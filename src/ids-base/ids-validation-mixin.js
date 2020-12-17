import { IdsEventsMixin } from './ids-events-mixin';

/**
 * The validation rules.
 */
const IdsValidationMixin = {
  useRules: new Map(),
  validationEventsList: [],

  // Default icon
  VALIDATION_DEFAULT_ICON: 'user-profile',

  // Icons
  VALIDATION_ICONS: {
    alert: 'alert-solid',
    error: 'error-solid',
    info: 'info-solid',
    success: 'success-solid',
  },

  /**
   * Handle the validation rules
   * @returns {void}
   */
  handleValidation() {
    if (this.labelEl && this.input && typeof this.validate === 'string') {
      const radioCheckbox = /checkbox|radio/.test(this.input?.getAttribute('type'));
      const defaultEvents = radioCheckbox ? 'change' : 'blur';
      const events = this.validationEvents && typeof this.validationEvents === 'string' ? this.validationEvents : defaultEvents;
      this.validationEventsList = [...new Set(events.split(' '))];
      const getRule = (id) => ({ id, rule: this.rules[id] });
      let isRulesAdded = false;
      this.validate.split(' ').forEach((strRule) => {
        if (strRule === 'required') {
          this.labelEl.classList.add('required');
          this.input.setAttribute('aria-required', true);
        }
        const useRules = this.useRules.get(this.input);
        if (useRules) {
          let found = false;
          useRules.forEach((rule) => {
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
  },

  /**
   * Check the validation and add/remove errors as needed
   * @private
   * @returns {void}
   */
  checkValidation() {
    if (this.input) {
      let isValid = true;
      const useRules = this.useRules.get(this.input);
      useRules?.forEach((thisRule) => {
        if (!thisRule.rule.check(this.input)) {
          this.addMessage(thisRule.rule);
          isValid = false;
        } else {
          this.removeMessage(thisRule.rule);
        }
      });
      this.eventHandlers.dispatchEvent('validated', this, { elem: this, value: this.value, isValid });
    }
  },

  /**
   * Add a message to an input
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  addMessage(settings) {
    const { id, type, message, icon } = settings; // eslint-disable-line
    if (id) {
      let elem = this.shadowRoot.querySelector(`[validation-id="${id}"]`);
      if (!elem) {
        const regex = new RegExp(`^\\b(${Object.keys(this.VALIDATION_ICONS).join('|')})\\b$`, 'g');
        const isValidationIcon = type && (regex.test(type));
        let audible = isValidationIcon ? type.replace(/^./, type[0].toUpperCase()) : null;
        audible = audible ? `<ids-text audible="true">${audible} </ids-text>` : '';
        let cssClass = 'validation-message';
        let iconName = this.VALIDATION_ICONS[type];
        if (!iconName && type === 'icon') {
          iconName = icon || this.VALIDATION_DEFAULT_ICON;
          cssClass += iconName ? ' has-custom-icon' : '';
        }
        cssClass += isValidationIcon ? ` ${type}` : '';
        cssClass += this.disabled ? ' disabled' : '';
        const iconHtml = iconName ? `<ids-icon icon="${iconName}" class="ids-icon"></ids-icon>` : '';

        elem = document.createElement('div');
        elem.setAttribute('validation-id', id);
        elem.setAttribute('type', type);
        elem.className = cssClass;
        elem.innerHTML = `${iconHtml}<ids-text class="message-text">${audible}${message}</ids-text>`;
        this.input?.classList.add(type);
        const typeAttr = this.input?.getAttribute('type');
        let parent = this.shadowRoot;
        if (typeAttr === 'checkbox') {
          parent = this.shadowRoot.querySelector('.ids-checkbox');
        }
        parent.appendChild(elem);
      }
    }
  },

  /**
   * Remove the message(s) from an input
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  removeMessage(settings) {
    const { id, type } = settings;
    const elem = this.shadowRoot.querySelector(`[validation-id="${id}"]`);

    elem?.remove();
    this.input?.classList.remove(type);
  },

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
  },

  /**
   * Handle validation events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleValidationEvents(option) {
    /* istanbul ignore next */
    if (!this.eventHandlers) {
      this.eventHandlers = new IdsEventsMixin();
    }

    if (this.input) {
      this.validationEventsList.forEach((eventName) => {
        if (option === 'remove') {
          const handler = this.eventHandlers?.handledEvents?.get(eventName);
          if (handler && handler.target === this.input) {
            this.eventHandlers.removeEventListener(eventName, this.input);
          }
        } else {
          this.eventHandlers.addEventListener(eventName, this.input, () => {
            this.checkValidation();
          });
        }
      });
    }
  },

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
  },

  /**
   * Set all validation rules
   * @private
   */
  rules: {
    /**
     * Required validation rule
     * @private
     */
    required: {
      check: (input) => {
        const isCheckbox = input.getAttribute('type') === 'checkbox';
        if (isCheckbox) {
          return input.checked;
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
  }
};

export { IdsValidationMixin };
