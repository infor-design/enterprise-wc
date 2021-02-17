/**
 *Clearable (Shows an x-icon button to clear).
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsClearableMixin = (superclass) => class extends superclass {
  // Input clearable events
  inputClearableEvents = ['blur', 'change', 'keyup'];

  constructor() {
    super();
    this.init(this);
  }

  /**
   * Handle clearable
   * @returns {void}
   */
  handleClearable() {
    if ((this.clearable && !(this.disabled || this.readonly)) || this.clearableForced) {
      const input = this.input || this.shadowRoot.querySelector(`#${this.ID || 'ids-input-id'}`);
      if (input) {
        this.appendClearableButton();
        this.clearableEvents();
      }
    } else {
      this.destroyClearable();
    }
  }

  /**
   * Check if clearable x-icon button exists if not add it
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
      text.setAttribute('audible', 'true');
      text.textContent = 'clear';
      xButton.className = 'btn-clear';
      xButton.appendChild(text);
      xButton.appendChild(icon);
      xButton.refreshProtoClasses();
      this.shadowRoot.appendChild(xButton);
      this.input?.classList.add('has-clearable');
    }
  }

  /**
   * Remove if clearable x-icon button exists
   * @private
   * @returns {void}
   */
  removeClearableButton() {
    const xButton = this.shadowRoot.querySelector('.btn-clear');
    if (xButton) {
      xButton.remove();
    }
  }

  /**
   * Clears the contents of the input element
   * @returns {void}
   */
  clear() {
    /* istanbul ignore next */
    if (this.input) {
      this.value = '';
      this.input.dispatchEvent(new Event('change'));
      this.input.focus();
      this.checkContents();
      this.triggerEvent('cleared', this, { detail: { elem: this, value: this.value } });
    }
  }

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
      this.triggerEvent('contents-checked', this, { detail: { elem: this, value: this.value } });
    }
  }

  /**
   * Handle clearable events
   * @private
   * @returns {void}
   */
  clearableEvents() {
    this.handleClearBtnClick('');
    this.inputClearableEvents.forEach((e) => this.handleClearableInputEvents(e, ''));

    // Set initial state
    this.checkContents();
  }

  /**
   * Handle clearable x-icon button click event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleClearBtnClick(option) {
    const xButton = this.shadowRoot.querySelector('.btn-clear');
    if (xButton) {
      const eventName = 'click';
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        /* istanbul ignore next */
        if (handler && handler.target === xButton) {
          this.offEvent(eventName, xButton);
        }
      } else {
        this.onEvent(eventName, xButton, () => {
          this.clear();
        });
      }
    }
  }

  /**
   * Handle clearable events (blur|change|keyup)
   * @private
   * @param {string} evt event name to attach/remove
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleClearableInputEvents(evt, option) {
    const input = this.input;
    /* istanbul ignore next */
    if (input && evt && typeof evt === 'string') {
      const eventName = evt;
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        if (handler && handler.target === input) {
          this.offEvent(eventName, input);
        }
      } else {
        this.onEvent(eventName, input, () => {
          this.checkContents();
        });
      }
    }
  }

  /**
   * Destroy clearable actions
   * @returns {void}
   */
  destroyClearable() {
    this.input?.classList.remove('has-clearable');
    this.handleClearBtnClick('remove');
    this.inputClearableEvents.forEach((e) => this.handleClearableInputEvents(e, 'remove'));
    this.removeClearableButton();
  }
};

export { IdsClearableMixin };
