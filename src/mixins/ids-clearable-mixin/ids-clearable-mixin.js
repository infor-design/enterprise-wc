import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 *Clearable (Shows an x-icon button to clear).
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsClearableMixin = (superclass) => class extends superclass {
  // Input clearable events
  inputClearableEvents = ['blur.clearmixin', 'change.clearmixin', 'keyup.clearmixin'];

  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.CLEARABLE
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.handleClearable();
  }

  /**
   * Handle clearable
   * @returns {void}
   */
  handleClearable() {
    let isClearable = this.clearable && !(this.disabled || this.readonly);
    isClearable = `${isClearable || this.clearableForced}`.toLowerCase() === 'true';

    if (isClearable) {
      this.appendClearableButton();
    } else {
      this.destroyClearable();
    }
  }

  refreshClearableButtonStyles() {
    this.removeClearableButton();
    this.appendClearableButton();
  }

  #initClearableButton() {
    const xButton = document.createElement('ids-trigger-button');
    const icon = document.createElement('ids-icon');
    const text = document.createElement('ids-text');
    icon.setAttribute('icon', 'close');
    icon.setAttribute('size', 'small');
    icon.setAttribute('slot', 'icon');
    if (this.colorVariant === 'alternate') {
      icon.style.color = 'white';
      const triggerBtn = xButton.shadowRoot.querySelector('button');
      triggerBtn.classList.add('color-variant-alternate');
    }
    text.setAttribute('audible', 'true');
    text.textContent = 'clear';
    xButton.setAttribute('part', 'clearable-button');
    xButton.className = 'btn-clear';
    xButton.appendChild(text);
    xButton.appendChild(icon);
    xButton.refreshProtoClasses();

    return xButton;
  }

  /**
   * Check if clearable x-icon button exists if not add it
   * @private
   * @returns {void}
   */
  appendClearableButton() {
    let xButton = this.shadowRoot.querySelector('.btn-clear');
    if (!xButton) {
      xButton = this.#initClearableButton();
      let parent = this.shadowRoot.querySelector('.ids-input, .ids-textarea');
      parent = parent?.querySelector('.field-container');
      parent?.appendChild(xButton);
      this.input?.classList.add('has-clearable');
      if (this.closest('.ids-search-field')) {
        this.input?.classList.add('has-no-trigger-button');
      }
      this.attachClearableEvents();
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
  attachClearableEvents() {
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

  /**
   * When set the input will add a clearable x button
   * @param {boolean|string} value If true will set `clearable` attribute
   */
  set clearable(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CLEARABLE, val.toString());
    } else {
      this.removeAttribute(attributes.CLEARABLE);
    }
    this.handleClearable();
  }

  get clearable() { return this.getAttribute(attributes.CLEARABLE); }

  /**
   * When set the input will force to add a clearable x button on readonly and disabled
   * @param {boolean|string} value If true will set `clearable-forced` attribute
   */
  set clearableForced(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CLEARABLE_FORCED, val.toString());
    } else {
      this.removeAttribute(attributes.CLEARABLE_FORCED);
    }
    this.handleClearable();
  }

  get clearableForced() { return this.getAttribute(attributes.CLEARABLE_FORCED); }
};

export default IdsClearableMixin;
