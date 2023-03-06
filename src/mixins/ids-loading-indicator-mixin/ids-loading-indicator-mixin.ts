import { attributes } from '../../core/ids-attributes';
import { IdsBaseConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * A mixin that will add loading indicator functionality to a component.
 * @mixin IdsLoadingIndicatorMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it.
 * @returns {any} The extended object
 */
const IdsLoadingIndicatorMixin = <T extends IdsBaseConstructor>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.SHOW_LOADING_INDICATOR
    ];
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    this.#addClasses();
  }

  /**
   * Set whether or not to show loading indicator. Disabled by default
   * @param {boolean|string|null} value show-loading-indicator attribute value
   */
  set showLoadingIndicator(value: string | boolean | null) {
    const boolVal = stringToBool(value);
    if (boolVal) {
      this.setAttribute(attributes.SHOW_LOADING_INDICATOR, boolVal.toString());
    } else {
      this.removeAttribute(attributes.SHOW_LOADING_INDICATOR);
    }
  }

  /**
   * show-loading-indicator attribute
   * @returns {boolean} showLoadingIndicator param converted to boolean from attribute value. Defaults to false
   */
  get showLoadingIndicator() { return stringToBool(this.getAttribute(attributes.SHOW_LOADING_INDICATOR)); }

  #addClasses() {
    const slot = this.container?.querySelector<HTMLSlotElement>('slot[name="loading-indicator"]');
    slot?.assignedNodes()?.forEach((item: any) => {
      item.classList.add('loading-indicator');
    });
  }
};

export default IdsLoadingIndicatorMixin;
