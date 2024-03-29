import { attributes } from '../../core/ids-attributes';

import type { IdsModuleNavDisplayMode } from './ids-module-nav-common';
import type { IdsConstructor } from '../../core/ids-element';

export interface DisplayModeHandler {
  onDisplayModeChange?(currentValue: string | false, newValue: string | false): void;
}

type Constraints = IdsConstructor<DisplayModeHandler>;

const IdsModuleNavDisplayModeMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  previousDisplayMode: IdsModuleNavDisplayMode = false;

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
      attributes.DISPLAY_MODE
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (this.hasAttribute(attributes.DISPLAY_MODE)) {
      this.displayMode = this.getAttribute(attributes.DISPLAY_MODE) as IdsModuleNavDisplayMode;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
  }

  /**
   * Set the type for toolbar
   * @param {IdsModuleNavDisplayMode | null} value Display Mode setting
   */
  set displayMode(value: IdsModuleNavDisplayMode | null) {
    let safeValue: IdsModuleNavDisplayMode = false;
    if (typeof value === 'string' && (value === 'expanded' || value === 'collapsed')) {
      safeValue = value;
    }

    const currentValue = this.previousDisplayMode;
    if (currentValue !== safeValue) {
      if (safeValue !== false) {
        this.setAttribute(attributes.DISPLAY_MODE, `${safeValue}`);
      } else {
        this.removeAttribute(attributes.DISPLAY_MODE);
        safeValue = false;
      }
      this.previousDisplayMode = safeValue;
      this.#setDisplayMode(currentValue, safeValue);
    }
  }

  get displayMode(): IdsModuleNavDisplayMode {
    return (this.getAttribute(attributes.DISPLAY_MODE) as IdsModuleNavDisplayMode) ?? false;
  }

  #setDisplayMode(currentValue: string | false, newValue: string | false) {
    if (this.container) {
      if (currentValue) this.container?.classList.remove(`display-mode-${currentValue}`);
      if (newValue) this.container?.classList.add(`display-mode-${newValue}`);
    }
    // Fire optional callback
    if (typeof this.onDisplayModeChange === 'function') {
      this.onDisplayModeChange(currentValue, newValue);
    }
  }

  /**
   * Detects if state changes from outside the component library have occured against
   * the `display-mode` attribute and corrects component state.
   */
  checkDisplayMode() {
    if (this.previousDisplayMode !== this.displayMode) {
      this.#setDisplayMode(this.previousDisplayMode, this.displayMode);
    }
  }
};

export default IdsModuleNavDisplayModeMixin;
