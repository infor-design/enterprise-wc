/**
 * HideFocus: Only shows the focus state on key entry.
 */
const IdsHideFocusMixin = {
  isClick: false,
  isFocused: false,
  labelClicked: false,
  radioCheckbox: false,

  /**
   * Initialize HideFocus
   * @returns {void}
   */
  hideFocus() {
    // Checkbox, Radio buttons or Switch
    this.radioCheckbox = /checkbox|radio/.test(this.input?.getAttribute('type'));

    this.input?.classList.add('hide-focus');
    this.hidefocusFocusin();
    this.hidefocusFocusout();
    this.hidefocusMousedown();
  },

  /**
   * Handle focusin event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  hidefocusFocusin(option) {
    if (this.input) {
      const eventName = 'focusin';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.eventHandlers.removeEventListener(eventName, this.input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
          if (!this.isClick && !this.isFocused && !this.labelClicked) {
            this.input.classList.remove('hide-focus');
          }
          this.isClick = false;
          this.isFocused = true;
          this.labelClicked = false;
        });
      }
    }
  },

  /**
   * Handle focusout event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  hidefocusFocusout(option) {
    if (this.input) {
      const eventName = 'focusout';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.eventHandlers.removeEventListener(eventName, this.input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
          this.input.classList.add('hide-focus');
          this.isClick = false;
          this.isFocused = false;
          if (this.radioCheckbox) {
            const label = this.shadowRoot.querySelector('label');
            const labelText = this.shadowRoot.querySelector('.label-text');
            const checkmark = this.shadowRoot.querySelector('.checkmark');
            this.labelClicked = this.labelClicked === label
              || this.labelClicked === labelText
              || this.labelClicked === checkmark;
          }
        });
      }
    }
  },

  /**
   * Handle mousedown
   * @private
   * @returns {void}
   */
  hidefocusHandleMousedown() {
    this.input?.classList.add('hide-focus');
    this.isClick = true;
  },

  /**
   * Handle mousedown event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  hidefocusMousedown(option) {
    if (this.input) {
      const setEvent = (el) => {
        if (el) {
          const eventName = 'mousedown';
          if (option === 'remove') {
            const handler = this.eventHandlers?.handledEvents?.get(eventName);
            if (handler && handler.target === el) {
              this.eventHandlers.removeEventListener(eventName, el);
            }
          } else {
            this.eventHandlers.addEventListener(eventName, el, () => {
              this.hidefocusHandleMousedown();
              if (this.radioCheckbox) {
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
      } else {
        // TODO soon added other components (ie. hyperlinks)
        // setEvent(this.input);
      }
    }
  },

  /**
   * Destroy
   * @returns {void}
   */
  destroyHideFocus() {
    this.input?.classList.remove('hide-focus');
    this.hidefocusFocusin('remove');
    this.hidefocusFocusout('remove');
    this.hidefocusMousedown('remove');
  }
};

export { IdsHideFocusMixin };
