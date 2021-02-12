/**
 * HideFocus: Only shows the focus state on key entry.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsHideFocusMixin = (superclass) => class extends superclass {
  isClick = false;

  isFocused = false;

  labelClicked = false;

  radioCheckbox = false;

  /**
   * Initialize HideFocus
   * @returns {void}
   */
  hideFocus() {
    // Checkbox, Radio buttons or Switch
    this.radioCheckbox = /checkbox|radio/.test(this.input?.getAttribute('type'));

    this.hidefocusToggle(this.input);
    this.hidefocusFocusin();
    this.hidefocusFocusout();
    this.hidefocusMousedown();
  }

  /**
   * Toggle hidefocus class and trigger event
   * @private
   * @param {object} elem The element node
   * @param {boolean|any} isRemove If true, will remove
   * @param {boolean|any} noTrigger If true, will not trigger
   * @returns {void}
   */
  hidefocusToggle(elem, isRemove = false, noTrigger = false) {
    if (elem) {
      const action = isRemove ? 'remove' : 'add';
      elem.classList[action]('hide-focus');

      if (!noTrigger) {
        this.trigger(`hidefocus${action}`, this, { elem, action });
      }
    }
  }

  /**
   * Handle focusin event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  hidefocusFocusin(option = '') {
    if (this.input) {
      const eventName = 'focusin';
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.off(eventName, this.input);
        }
      } else {
        this.on(eventName, this.input, () => {
          if (!this.isClick && !this.isFocused && !this.labelClicked) {
            this.hidefocusToggle(this.input, true);
          }
          this.isClick = false;
          this.isFocused = true;
          this.labelClicked = false;
        });
      }
    }
  }

  /**
   * Handle focusout event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  hidefocusFocusout(option = '') {
    if (this.input) {
      const eventName = 'focusout';
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.off(eventName, this.input);
        }
      } else {
        this.on(eventName, this.input, () => {
          this.hidefocusToggle(this.input);
          this.isClick = false;
          this.isFocused = false;
          if (this.radioCheckbox) {
            const label = this.shadowRoot.querySelector('label');
            const labelText = this.shadowRoot.querySelector('.label-text');
            const checkmark = this.shadowRoot.querySelector('.checkmark');
            const circle = this.shadowRoot.querySelector('.circle');
            const rootEl = this.shadowRoot.querySelector('.ids-radio');
            this.hidefocusToggle(rootEl, true, true);

            this.labelClicked = this.labelClicked === label
              || this.labelClicked === labelText
              || this.labelClicked === checkmark
              || this.labelClicked === circle;
          }
        });
      }
    }
  }

  /**
   * Handle mousedown
   * @private
   * @returns {void}
   */
  hidefocusHandleMousedown() {
    this.hidefocusToggle(this.input);
    this.isClick = true;
  }

  /**
   * Handle mousedown event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  hidefocusMousedown(option = '') {
    if (this.input) {
      const setEvent = (/** @type {any} */ el) => {
        if (el) {
          const eventName = 'mousedown';
          if (option === 'remove') {
            const handler = this?.handledEvents?.get(eventName);
            if (handler && handler.target === el) {
              this.off(eventName, el);
            }
          } else {
            this.on(eventName, el, () => {
              this.hidefocusHandleMousedown();
              if (this.radioCheckbox) {
                const rootEl = this.shadowRoot.querySelector('.ids-radio');
                this.hidefocusToggle(rootEl);
                this.labelClicked = el;
              }
            });
          }
        }
      };

      if (this.radioCheckbox) {
        setEvent(this.shadowRoot.querySelector('label'));
        setEvent(this.shadowRoot.querySelector('.label-text'));
        setEvent(this.shadowRoot.querySelector('.checkmark'));
        setEvent(this.shadowRoot.querySelector('.circle'));
      } else {
        // TODO soon added other components (ie. hyperlinks)
        // setEvent(this.input);
      }
    }
  }

  /**
   * Destroy
   * @returns {void}
   */
  destroyHideFocus() {
    this.hidefocusToggle(this.input, true);
    this.hidefocusFocusin('remove');
    this.hidefocusFocusout('remove');
    this.hidefocusMousedown('remove');
  }
};

export { IdsHideFocusMixin };
