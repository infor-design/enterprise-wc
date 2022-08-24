import type { IdsValidationErrorMessage } from './ids-validation-mixin';

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsValidationInputMixin = (superclass: any): any => class extends superclass {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Return if the field is valid or not
   * @returns {boolean} true if invalid
   */
  get isValid(): boolean { return this.input.shadowRoot.querySelectorAll('.validation-message').length === 0; }

  /**
   * Return if the current validation errors
   * @returns {Array<IdsValidationErrorMessage>} The current errors
   */
  get validationMessages(): Array<IdsValidationErrorMessage> {
    const msgs: Array<IdsValidationErrorMessage> = [];
    this.input.shadowRoot.querySelectorAll('.validation-message').forEach((message: Element) => {
      msgs.push({
        message: message.querySelector('ids-text')?.childNodes[1].textContent || '',
        type: message.getAttribute('type') || '',
        id: message.getAttribute('validation-id') || ''
      });
    });
    return msgs;
  }
};

export default IdsValidationInputMixin;
