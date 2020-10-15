/**
 * The validation rules.
 */
const IdsValidationMixin = {
  useRules: new Map(),

  handleValidation() {
    const input = this.querySelector('ids-input');
    if (input && typeof this.validate === 'string') {
      const getRule = (id) => ({ id, rule: this.rules[id] });
      let isRulesAdded = false;
      this.validate.split(' ').forEach((strRule) => {
        if (strRule === 'required') {
          const label = this.querySelector('ids-label');
          label?.setAttribute('required', true);
        }
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
      });
      if (isRulesAdded) {
        this.validationEvents();
      }
    } else {
      this.destroyValidation();
    }
  },

  checkValidation() {
    const input = this.querySelector('ids-input');
    if (input) {
      const useRules = this.useRules.get(input);
      useRules?.forEach((thisRule) => {
        if (!thisRule.rule.check(input)) {
          this.addError(thisRule.rule);
        } else {
          this.removeError(thisRule.rule);
        }
      });
    }
  },

  addError(rule) {
    const { id, type, message } = rule;
    const errorElem = this.querySelector(`ids-validation-message[validation-id="${id}"]`);
    const input = this.querySelector('ids-input');

    if (!errorElem) {
      const audible = type.replace(/^./, type[0].toUpperCase());
      this.insertAdjacentHTML('beforeend', `<ids-validation-message type="${type}" audible="${audible}" validation-id="${id}">${message}</ids-validation-message>`);
    }
    input?.setAttribute('validation-status', type);
  },

  removeError(rule) {
    const { id } = rule;
    const errorElem = this.querySelector(`ids-validation-message[validation-id="${id}"]`);
    const errorLen = [].slice.call(this.querySelectorAll(`ids-validation-message`)).length;
    const input = this.querySelector('ids-input');

    errorElem?.remove();
    if (!errorLen) {
      input?.removeAttribute('validation-status');
    }
  },

  /**
   * Handle validation events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  validationEvents(option) {
    const input = this.querySelector('ids-input');
    const action = option === 'remove' ? 'removeEventListener' : 'addEventListener';
    if (input) {
      this.eventHandlers[action]('triggerblur', input, () => {
        this.checkValidation();
      });
    }
  },

  /**
   * Destroy validation
   * @returns {void}
   */
  destroyValidation() {
    const input = this.querySelector('ids-input');
    if (input) {
      const useRules = this.useRules.get(input);
      if (useRules) {
        useRules.forEach((thisRule) => {
          if (thisRule.id === 'required') {
            const label = this.querySelector('ids-label');
            label?.removeAttribute('required');
          }
        });
        this.validationEvents('remove');
        this.useRules.delete(input);
      }
    }
  },

  rules: {
    required: {
      check: (input) => {
        const val = input.getAttribute('value');
        return !((val === null) || (typeof val === 'string' && val === '') || (typeof val === 'number' && isNaN(val))) // eslint-disable-line
      },
      message: 'Required',
      type: 'error',
      id: 'required'
    },
    email: {
      check: (input) => {
        const val = input.getAttribute('value') || '';
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
