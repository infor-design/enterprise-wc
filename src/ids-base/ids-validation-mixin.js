/**
 * The validation rules.
 */
const IdsValidationMixin = {
  useRules: new Map(),

  handleValidation() {
    if (this.input && typeof this.validate === 'string') {
      const getRule = (id) => ({ id, rule: this.rules[id] });
      let isRulesAdded = false;
      this.validate.split(' ').forEach((strRule) => {
        if (strRule === 'required') {
          const label = this.querySelector('ids-label');
          label?.setAttribute('required', true);
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
        this.validationEvents();
      }
    } else {
      this.destroyValidation();
    }
  },

  checkValidation() {
    if (this.input) {
      const useRules = this.useRules.get(this.input);
      useRules?.forEach((thisRule) => {
        if (!thisRule.rule.check(this.input)) {
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

    if (!errorElem) {
      const audible = type.replace(/^./, type[0].toUpperCase());
      this.insertAdjacentHTML('beforeend', `<ids-validation-message type="${type}" audible="${audible}" validation-id="${id}">${message}</ids-validation-message>`);
    }
    this.input?.setAttribute('validation-status', type);
  },

  removeError(rule) {
    const { id } = rule;
    const errorElem = this.querySelector(`ids-validation-message[validation-id="${id}"]`);
    const errorLen = [].slice.call(this.querySelectorAll(`ids-validation-message`)).length;

    errorElem?.remove();
    if (!errorLen) {
      this.input?.removeAttribute('validation-status');
    }
  },

  /**
   * Handle validation events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  validationEvents(option) {
    const action = option === 'remove' ? 'removeEventListener' : 'addEventListener';
    if (this.input) {
      this.eventHandlers[action]('triggerblur', this.input, () => {
        this.checkValidation();
      });
    }
  },

  /**
   * Destroy validation
   * @returns {void}
   */
  destroyValidation() {
    if (this.input) {
      const useRules = this.useRules.get(this.input);
      if (useRules) {
        useRules.forEach((thisRule) => {
          if (thisRule.id === 'required') {
            const label = this.querySelector('ids-label');
            label?.removeAttribute('required');
          }
        });
        this.validationEvents('remove');
        this.useRules.delete(this.input);
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
