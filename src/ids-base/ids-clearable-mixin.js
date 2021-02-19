import { IdsEventsMixin } from './ids-events-mixin';
import { IdsKeyboardMixin } from './ids-keyboard-mixin';

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
    /* istanbul ignore next */
    if (!this.eventHandlers) {
      /** @type {any} */
      this.eventHandlers = new IdsEventsMixin();
    }
    if (!this.keyboard) {
      /** @type {any} */
      this.keyboard = new IdsKeyboardMixin();
    }

    let isClearable = this.clearable && !(this.disabled || this.readonly);
    isClearable = `${isClearable || this.clearableForced}`.toLowerCase() === 'true';

    if (isClearable) {
      if (this.input) {
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
      xButton.setAttribute('tabindex', '0');
      xButton.className = 'btn-clear';
      xButton.appendChild(text);
      xButton.appendChild(icon);
      xButton.refreshProtoClasses();
      let parent = this.shadowRoot.querySelector('.ids-input, .ids-textarea');
      parent = parent?.querySelector('.field-container');
      parent?.appendChild(xButton);
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
    /* istanbul ignore next */
    if (this.input && evt && typeof evt === 'string') {
      const eventName = evt;
      if (option === 'remove') {
        const handler = this.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.offEvent(eventName, this.input);
        }
      } else {
        this.onEvent(eventName, this.input, () => {
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
