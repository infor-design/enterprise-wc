import { attributes } from '../../core/ids-attributes';
import { isValidTextDisplay } from './ids-module-nav-common';

import type { IdsConstructor } from '../../core/ids-element';

export interface TextDisplayHandler {
  onTextDisplayChange?(newValue: string | null): void;
}

type Constraints = IdsConstructor<TextDisplayHandler>;

const IdsModuleNavTextDisplayMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.TEXT_DISPLAY
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (this.hasAttribute(attributes.TEXT_DISPLAY)) {
      this.textDisplay = this.getAttribute(attributes.TEXT_DISPLAY);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
  }

  /**
   * Sets the textDisplay property
   * @param {string | null} val textDisplay property value
   */
  set textDisplay(val: string | null) {
    const valStr = `${val}`;
    const valid = isValidTextDisplay(valStr);
    if (valid && valStr !== 'default') {
      this.setAttribute(attributes.TEXT_DISPLAY, valStr);
    } else {
      this.removeAttribute(attributes.TEXT_DISPLAY);
    }
    this.#setTextDisplay(val);
  }

  /**
   * Gets textDisplay property
   * @returns {string} textDisplay property value
   */
  get textDisplay(): string | null {
    return this.getAttribute(attributes.TEXT_DISPLAY);
  }

  #setTextDisplay(val: string | null) {
    if (this.container) {
      this.container.classList.remove('text-display-tooltip', 'text-display-hidden');
      if (val && val !== 'default') this.container.classList.add(`text-display-${val}`);
    }

    // Fire optional callback
    if (typeof this.onTextDisplayChange === 'function') {
      this.onTextDisplayChange(val);
    }
  }
};

export default IdsModuleNavTextDisplayMixin;
