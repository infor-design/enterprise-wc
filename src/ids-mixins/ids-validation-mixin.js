/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsValidationMixin = (superclass) => class extends superclass {
  constructor() {
    super();
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

    if (this.labelEl && this.input && typeof this.validate === 'string' && canRadio) {
      const isCheckbox = this.input?.getAttribute('type') === 'checkbox';
      const defaultEvents = (isCheckbox || isRadioGroup) ? 'change' : 'blur';
      const events = (this.validationEvents && typeof this.validationEvents === 'string')
        ? this.validationEvents : defaultEvents;
      this.validationEventsList = [...new Set(events.split(' '))];
      const getRule = (/** @type {string} */ id) => ({ id, rule: this.rules[id] });
      let isRulesAdded = false;

      this.validate.split(' ').forEach((/** @type {string} */ strRule) => {
        if (strRule === 'required') {
          this.labelEl.classList.add('required');
          this.input.setAttribute('aria-required', true);
          if (isRadioGroup) {
            const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
            radioArr.forEach((r) => r.input.setAttribute('required', 'required'));
          }
        }
        const useRules = this.useRules.get(this.input);
        if (useRules) {
          let found = false;
          useRules.forEach((/** @type {object} */ rule) => {
            if (rule.id === strRule) {
              found = true;
            }
          });
          if (!found) {
            const mergeRule = [...useRules, getRule(strRule)];
            this.useRules.set(this.input, mergeRule);
            isRulesAdded = true;
          }
        } else {
          this.useRules.set(this.input, [getRule(strRule)]);
          isRulesAdded = true;
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
  /**
   * Check the validation and add/remove errors as needed
   * @private
   * @returns {void}
   */
  checkValidation() {
    if (this.input) {
      this.isTypeNotValid = {};
      let isValid = true;
      const useRules = this.useRules.get(this.input);
      useRules?.forEach((/** @type {object} */ thisRule) => {
        if (!thisRule.rule.check(this.input) && this.isTypeNotValid) {
          this.addMessage(thisRule.rule);
          isValid = false;
          this.isTypeNotValid[thisRule.rule.type] = true;
        } else {
          this.removeMessage(thisRule.rule);
        }
      });
      this.isTypeNotValid = null;
      this.triggerEvent('validate', this, { detail: { elem: this, value: this.value, isValid } });
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
    const messageId = `${this.input.getAttribute('id')}-${settings.type}`;

    if (!iconName && type === 'icon') {
      iconName = icon || this.VALIDATION_DEFAULT_ICON;
      /* istanbul ignore next */
      cssClass += iconName ? ' has-custom-icon' : '';
    }
    cssClass += isValidationIcon ? ` ${type}` : '';
    cssClass += this.disabled ? ' disabled' : '';
    const iconHtml = iconName ? `<ids-icon icon="${iconName}" class="ids-icon"></ids-icon>` : '';

    // Add error message div and associated aria
    /* istanbul ignore else */
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
    this.input.classList.add(type);
    this.input.setAttribute('aria-describedby', messageId);
    this.input.setAttribute('aria-invalid', 'true');

    const rootEl = this.shadowRoot.querySelector('.ids-input, .ids-textarea, .ids-checkbox');
    const parent = rootEl || this.shadowRoot;

    /* istanbul ignore else */
    if (!this.#externalValidationEl) {
      parent.appendChild(elem);
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
    const { id, type } = settings;

    /* istanbul ignore else */
    if (!this.#externalValidationEl) {
      this.shadowRoot.querySelector(`[validation-id="${id}"]`)?.remove?.();
    } else {
      this.#externalValidationEl.innerHTML = '';
    }

    if (this.isTypeNotValid && !this.isTypeNotValid[type]) {
      this.input?.classList.remove(type);
      this.input.removeAttribute('aria-describedby');
      this.input.removeAttribute('aria-invalid');
    }

    const isRadioGroup = this.input?.classList.contains('ids-radio-group');
    if (isRadioGroup) {
      const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
      radioArr.forEach((r) => r.removeAttribute('validation-has-error'));
    }
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
    /* istanbul ignore next */
    if (this.input) {
      this.validationEventsList.forEach((eventName) => {
        if (option === 'remove') {
          const handler = this.handledEvents.get(eventName);
          if (handler && handler.target === this.input) {
            this.offEvent(eventName, this.input);
          }
        } else {
          this.onEvent(eventName, this.input, () => {
            this.checkValidation();
          });
        }
      });
    }
  }

  /**
   * Destroy the validation mixin
   * @returns {void}
   */
  destroyValidation() {
    /* istanbul ignore next */
    if (this.input) {
      const useRules = this.useRules.get(this.input);
      if (useRules) {
        this.handleValidationEvents('remove');
        this.useRules.delete(this.input);
      }
      this.labelEl?.classList.remove('required');
      this.removeAllMessages();
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
      check: (/** @type {object} */input) => {
        // Checkbox
        if (input.getAttribute('type') === 'checkbox') {
          return input.checked;
        }
        // Radio
        if (input.classList.contains('ids-radio-group')) {
          return input.getRootNode()?.host?.checked;
        }
        const val = input.value;
        /* istanbul ignore next */
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
      check: (/** @type {object} */ input) => {
        const val = input.value;
        const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,16}(?:\.[a-z]{2})?)$/i;
        return (val.length) ? regex.test(val) : true;
      },
      message: 'Email address not valid',
      type: 'error',
      id: 'email'
    }
  }

  setValidationElement(el) {
    this.#externalValidationEl = el;
  }

  #externalValidationEl;
};

export default IdsValidationMixin;
