/**
 * Clearable (Shows an X button to clear).
 */
const IdsClearableMixin = {
  // Input clearable events
  inputClearableEvents: ['blur', 'change', 'keyup'],

  /**
   * Handle clearable
   * @returns {void}
   */
  handleClearable() {
    if (this.clearable) {
      const input = this.input || this.shadowRoot.querySelector(`#${this.ID || 'ids-input-id'}`);
      if (input) {
        this.appendClearableButton();
        this.clearableEvents();
      }
    } else {
      this.destroyClearable();
    }
  },

  /**
   * Check if clearable X button exists if not add it
   * @private
   * @returns {void}
   */
  appendClearableButton() {
    let xButton = this.shadowRoot.querySelector('.btn-clear');
    if (!xButton) {
      xButton = document.createElement('ids-trigger-button');
      const icon = document.createElement('ids-icon');
      const text = document.createElement('ids-text');
      icon.setAttribute('icon', 'close');
      icon.setAttribute('size', 'small');
      icon.setAttribute('slot', 'icon');

      text.setAttribute('audible', true);
      text.textContent = 'clear';
      xButton.setAttribute('tabindex', 0);
      xButton.className = 'btn-clear';
      xButton.appendChild(text);
      xButton.appendChild(icon);
      this.shadowRoot.appendChild(xButton);
      this.input?.classList.add('has-clearable');
    }
  },

  /**
   * Remove if clearable X button exists
   * @private
   * @returns {void}
   */
  removeClearableButton() {
    const xButton = this.shadowRoot.querySelector('.btn-clear');
    if (xButton) {
      xButton.remove();
    }
  },

  /**
   * Clears the contents of the input element
   * @private
   * @returns {void}
   */
  clear() {
    if (this.input) {
      this.value = '';
      this.input.dispatchEvent(new Event('change'));
      this.input.focus();
      this.checkContents();
      this.eventHandlers.dispatchEvent('cleared', this, { elem: this, value: this.value });
    }
  },

  /**
   * Checks the contents of input element for empty
   * @private
   * @returns {void}
   */
  checkContents() {
    const xButton = this.shadowRoot.querySelector('.btn-clear');
    if (xButton) {
      const text = this.input?.value;
      if (!text || !text.length) {
        xButton.classList.add('is-empty');
      } else {
        xButton.classList.remove('is-empty');
      }
      this.eventHandlers.dispatchEvent('contents-checked', this, { elem: this, value: this.value });
    }
  },

  /**
   * Handle clearable events
   * @private
   * @returns {void}
   */
  clearableEvents() {
    this.handleClearableXbtnKeydown();
    this.handleClearableXbtnClick();
    this.inputClearableEvents.forEach((e) => this.handleClearableInputEvents(e));

    // Set initial state
    this.checkContents();
  },

  /**
   * Handle clearable xButton keydown event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleClearableXbtnKeydown(option) {
    const xButton = this.shadowRoot.querySelector('.btn-clear');
    if (xButton) {
      const eventName = 'keydown';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === xButton) {
          this.eventHandlers.removeEventListener(eventName, xButton);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, xButton, (e) => {
          const key = e.key;
          if (key === 'Enter' || (e.altKey && (key === 'Delete' || key === 'Backspace'))) {
            e.preventDefault();
            this.clear();
          }
        });
      }
    }
  },

  /**
   * Handle clearable xButton click event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleClearableXbtnClick(option) {
    const xButton = this.shadowRoot.querySelector('.btn-clear');
    if (xButton) {
      const eventName = 'click';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === xButton) {
          this.eventHandlers.removeEventListener(eventName, xButton);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, xButton, () => {
          this.clear();
        });
      }
    }
  },

  /**
   * Handle clearable events (blur|change|keyup)
   * @private
   * @param {string} evt event name to attach/remove
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleClearableInputEvents(evt, option) {
    const input = this.input || this.shadowRoot.querySelector(`#${this.ID || 'ids-input-id'}`);
    if (input && evt && typeof evt === 'string') {
      const eventName = evt;
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === input) {
          this.eventHandlers.removeEventListener(eventName, input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, input, () => {
          this.checkContents();
        });
      }
    }
  },

  /**
   * Destroy clearable
   * @returns {void}
   */
  destroyClearable() {
    this.input?.classList.remove('has-clearable');
    this.handleClearableXbtnClick('remove');
    this.handleClearableXbtnKeydown('remove');
    this.inputClearableEvents.forEach((e) => this.handleClearableInputEvents(e, 'remove'));
    this.removeClearableButton();
  }
};

export { IdsClearableMixin };
