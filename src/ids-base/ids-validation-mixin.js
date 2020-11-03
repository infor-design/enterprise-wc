/**
 * The validation rules.
 */
const IdsValidationMixin = {
  useRules: new Map(),

  /**
   * Handle the validation rules
   * @returns {void}
   */
  handleValidation() {
    if (this.label && this.input && typeof this.validate === 'string') {
      const getRule = (id) => ({ id, rule: this.rules[id] });
      let isRulesAdded = false;
      this.validate.split(' ').forEach((strRule) => {
        if (strRule === 'required') {
          this.label.classList.add('required');
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
        this.validationEvents();
      }
    } else {
      this.destroyValidation();
    }
  },

  /**
   * Check the validation and set to add/remove errors
   * @private
   * @returns {void}
   */
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

  /**
   * Add the error for given rule
   * @private
   * @param {object} rule The rule to add error
   * @returns {void}
   */
  addError(rule) {
    const { id, type, message } = rule;
    let errorEl = this.shadowRoot.querySelector(`[validation-id="${id}"]`);

    if (!errorEl) {
      const audible = type.replace(/^./, type[0].toUpperCase());
      errorEl = document.createElement('ids-validation-message');
      errorEl.setAttribute('type', type);
      errorEl.setAttribute('validation-id', id);
      errorEl.innerHTML = `<span class="audible">${audible} </span>${message}`;
      this.shadowRoot.appendChild(errorEl);
    }
  },

  /**
   * Remove the error for given rule
   * @private
   * @param {object} rule The rule to add error
   * @returns {void}
   */
  removeError(rule) {
    const { id } = rule;
    const errorElem = this.shadowRoot.querySelector(`[validation-id="${id}"]`);
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
      this.eventHandlers[action]('blur', this.input, () => {
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
