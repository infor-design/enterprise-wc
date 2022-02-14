import { attributes } from '../../core/ids-attributes';

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsValidationMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.handleValidation();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS
    ];
  }

  // Map of rules to use
  useRules = new Map();

  // List of events to validate on
  validationEventsList = [];

  // Default icon
  VALIDATION_DEFAULT_ICON = 'user-profile';

  // Icons
  VALIDATION_ICONS = {
    alert: 'alert',
    error: 'error',
    info: 'info',
    success: 'success',
  };

  /**
   * Handle the validation rules
   * @returns {void}
   */
  handleValidation() {
    const isRadioGroup = this.input?.classList.contains('ids-radio-group');
    const canRadio = ((!isRadioGroup) || (!!(isRadioGroup && this.querySelector('ids-radio'))));

    if (this.labelEl && typeof this.validate === 'string' && canRadio) {
      const isCheckbox = this.input?.getAttribute('type') === 'checkbox';
      const defaultEvents = (isCheckbox || isRadioGroup) ? 'change.validationmixin' : 'blur.validationmixin';
      const events = (this.validationEvents && typeof this.validationEvents === 'string')
        ? this.validationEvents : defaultEvents;
      this.validationEventsList = [...new Set(events.split(' '))];
      const getRule = (id) => ({ id, rule: this.rules[id] });
      let isRulesAdded = false;

      this.validate.split(' ').forEach((strRule) => {
        if (strRule === 'required') {
          this.labelEl?.classList.add('required');
          this.input?.setAttribute('aria-required', true);

          // Triggerfield with multiple inputs
          if (this.inputs) {
            [...this.inputs].forEach((input) => {
              input.setAttribute('aria-required', true);
            });
          }

          if (isRadioGroup) {
            const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
            radioArr.forEach((r) => r.input.setAttribute('required', 'required'));
          }
          this.validationElems?.editor?.setAttribute('aria-required', true);
        }

        /**
         * Set the useRules map
         * @param {*} input element(s)
         */
        const setRules = (input) => {
          const useRules = this.useRules.get(input);
          if (useRules) {
            let found = false;
            useRules.forEach((rule) => {
              if (rule.id === strRule) {
                found = true;
              }
            });
            if (!found) {
              const mergeRule = [...useRules, getRule(strRule)];
              this.useRules.set(input, mergeRule);
              isRulesAdded = true;
            }
          } else {
            this.useRules.set(input, [getRule(strRule)]);
            isRulesAdded = true;
          }
        };

        setRules(this.input);

        // If there are multiple inputs in the trigger field.
        if (this.inputs) {
          [...this.inputs].forEach((input) => {
            setRules(input);
          });
        }
      });

      if (isRulesAdded) {
        this.handleValidationEvents();
      }
    } else {
      this.destroyValidation();
    }
  }

  /**
   * Check the validation and add/remove errors as needed
   * @private
   * @returns {void}
   */
  checkValidation() {
    /**
     * Check validation rules
     * @param {*} input element
     */
    const checkRules = (input) => {
      this.isTypeNotValid = {};
      let isValid = true;
      const useRules = this.useRules.get(input);
      useRules?.forEach((thisRule) => {
        if (thisRule.rule !== undefined && !thisRule.rule?.check(input) && this.isTypeNotValid) {
          this.addMessage(thisRule.rule);
          isValid = false;
          this.isTypeNotValid[thisRule.rule.type] = true;
        } else if (thisRule.rule !== undefined) {
          this.removeMessage(thisRule.rule);
        }
      });
      this.isTypeNotValid = null;
      this.triggerEvent('validate', this, { detail: { elem: this, value: this.value, isValid } });
    };

    if (this.input) {
      checkRules(this.input);
    }

    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        checkRules(input);
      });
    }
  }

  /**
   * Add a message to an input
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  addMessage(settings) {
    const {
      id,
      type,
      message,
      icon
    } = settings;

    if (!id && !this.#externalValidationEl) {
      return;
    }

    let elem = this.#externalValidationEl || this.shadowRoot.querySelector(`[validation-id="${id}"]`);
    if (elem && !this.#externalValidationEl) {
      // Already has this message
      return;
    }

    // Add error and related details
    const regex = new RegExp(`^\\b(${Object.keys(this.VALIDATION_ICONS).join('|')})\\b$`, 'g');
    const isValidationIcon = type && (regex.test(type));
    let audible = isValidationIcon ? type.replace(/^./, type[0].toUpperCase()) : null;
    audible = audible ? `<ids-text audible="true">${audible} </ids-text>` : '';
    let cssClass = 'validation-message';
    let iconName = this.VALIDATION_ICONS[type];
    let messageId = `${this.input?.getAttribute('id')}-${settings.type}`;

    // If multiple inputs in triggerfield
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        messageId = `${input.getAttribute('id')}-${settings.type}`;
      });
    }

    if (!iconName && type === 'icon') {
      iconName = icon || this.VALIDATION_DEFAULT_ICON;
      cssClass += iconName ? ' has-custom-icon' : '';
    }
    cssClass += isValidationIcon ? ` ${type}` : '';
    cssClass += this.disabled ? ' disabled' : '';
    const iconHtml = iconName ? `<ids-icon icon="${iconName}" class="ids-icon"></ids-icon>` : '';

    // Add error message div and associated aria

    if (!this.#externalValidationEl) {
      elem = document.createElement('div');
    } else {
      elem = this.#externalValidationEl;
    }

    elem.setAttribute('id', messageId);
    elem.setAttribute('validation-id', id);
    elem.setAttribute('type', type);
    elem.className = cssClass;
    elem.innerHTML = `${iconHtml}<ids-text error="true" class="message-text">${audible}${message}</ids-text>`;
    this.validationElems?.main?.classList.add(type);
    this.input?.classList.add(type);
    this.input?.setAttribute('aria-describedby', messageId);
    this.input?.setAttribute('aria-invalid', 'true');

    const rootEl = this.shadowRoot.querySelector('.ids-input, .ids-textarea, .ids-checkbox');
    const parent = rootEl || this.shadowRoot;

    if (!this.#externalValidationEl) {
      parent.appendChild(elem);
    }

    // If multiple inputs in triggerfield
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        input.classList.add(type);
        input.setAttribute('aria-describedby', messageId);
        input.setAttribute('aria-invalid', 'true');
        parent.querySelector('.ids-trigger-field-content').classList.add(type);
      });
    }

    // Add extra classes for radios
    const isRadioGroup = this.input?.classList.contains('ids-radio-group');
    if (isRadioGroup) {
      const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
      radioArr.forEach((r) => r.setAttribute('validation-has-error', true));
    }
  }

  /**
   * Remove the message(s) from an input
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  removeMessage(settings) {
    const id = settings.id;
    let type = settings.type;

    if (!this.#externalValidationEl) {
      const elem = this.shadowRoot.querySelector(`[validation-id="${id}"]`);
      if (elem) {
        if (!type) {
          type = elem.getAttribute('type');
        }
        if (!this.isTypeNotValid) {
          this.isTypeNotValid = {};
        }
        elem.remove?.();
      }
    } else {
      this.#externalValidationEl.innerHTML = '';
    }

    if (this.isTypeNotValid && !this.isTypeNotValid[type]) {
      this.input?.classList.remove(type);
      this.input?.removeAttribute('aria-describedby');
      this.input?.removeAttribute('aria-invalid');
    }

    const rootEl = this.shadowRoot.querySelector('.ids-input, .ids-textarea, .ids-checkbox');
    const parent = rootEl || this.shadowRoot;

    // If multiple inputs in triggerfield
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        if (this.isTypeNotValid && !this.isTypeNotValid[type]) {
          input.classList.remove(type);
          input.removeAttribute('aria-describedby');
          input.removeAttribute('aria-invalid');
          parent.querySelector('.ids-trigger-field-content').classList.remove(type);
        }
      });
    }

    const isRadioGroup = this.input?.classList.contains('ids-radio-group');
    if (isRadioGroup) {
      const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
      radioArr.forEach((r) => r.removeAttribute('validation-has-error'));
    }
    this.validationElems?.main?.classList.remove(type);
  }

  /**
   * Remove all the messages from input
   * @returns {void}
   */
  removeAllMessages() {
    const nodes = [].slice.call(this.shadowRoot.querySelectorAll('.validation-message'));
    nodes.forEach((node) => {
      this.removeMessage({
        id: node.getAttribute('validation-id'),
        type: node.getAttribute('type')
      });
    });
  }

  /**
   * Handle validation events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleValidationEvents(option = '') {
    /**
     * Handle the validation events
     * @param {*} input element(s)
     */
    const validationEvents = (input) => {
      this.validationEventsList.forEach((eventName) => {
        if (option === 'remove') {
          const handler = this.handledEvents.get(eventName);
          if (handler && handler.target === input) {
            this.offEvent(eventName, input);
          }
        } else {
          this.onEvent(eventName, input, () => {
            this.checkValidation();
          });
        }
      });
    };

    if (this.input) {
      validationEvents(this.input);
    }

    // If multiple inputs in triggerfield
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        validationEvents(input);
      });
    }
  }

  /**
   * Destroy the validation mixin
   * @returns {void}
   */
  destroyValidation() {
    /**
     * Destroy validation
     * @param {*} input element(s)
     */
    const destroy = (input) => {
      const useRules = this.useRules.get(input);
      if (useRules) {
        this.handleValidationEvents('remove');
        this.useRules.delete(input);
      }
      if (!(/\brequired\b/gi.test(this.validate))) {
        this.labelEl?.classList.remove('required');
        input.removeAttribute('aria-required');
        this.validationElems?.editor?.removeAttribute('aria-required');
      }
      this.removeAllMessages();
    };

    if (this.input) {
      destroy(this.input);
    }

    // If multiple inputs in triggerfield
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        destroy(input);
      });
    }
  }

  /**
   * Set all validation rules
   * @private
   */
  rules = {
    /**
     * Required validation rule
     * @private
     */
    required: {
      check: (input) => {
        // Checkbox
        if (input.getAttribute('type') === 'checkbox') {
          return input.checked;
        }
        // Radio
        if (input.classList.contains('ids-radio-group')) {
          return input.getRootNode()?.host?.checked;
        }
        const val = input.value;
                return !((val === null) || (typeof val === 'string' && val === '') || (typeof val === 'number' && isNaN(val))) // eslint-disable-line
      },
      message: 'Required',
      type: 'error',
      id: 'required'
    },

    /**
     * Email validation rule
     * @private
     */
    email: {
      check: (input) => {
        const val = input.value;
        const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,16}(?:\.[a-z]{2})?)$/i;
        return (val.length) ? regex.test(val) : true;
      },
      message: 'Email address not valid',
      type: 'error',
      id: 'email'
    }
  };

  setValidationElement(el) {
    this.#externalValidationEl = el;
  }

  #externalValidationEl;

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value);
    } else {
      this.removeAttribute(attributes.VALIDATE);
    }

    this.handleValidation();
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Sets which events to fire validation on
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
    }
    this.handleValidation();
  }

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS); }
};

export default IdsValidationMixin;
