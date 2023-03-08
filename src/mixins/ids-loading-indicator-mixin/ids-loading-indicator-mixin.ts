import { attributes } from '../../core/ids-attributes';
import { IdsBaseConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../../components/ids-loading-indicator/ids-loading-indicator';

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
    this.#attachLoadingIndicator();
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

    this.#attachLoadingIndicator();
  }

  /**
   * show-loading-indicator attribute
   * @returns {boolean} showLoadingIndicator param converted to boolean from attribute value. Defaults to false
   */
  get showLoadingIndicator() { return stringToBool(this.getAttribute(attributes.SHOW_LOADING_INDICATOR)); }

  #attachLoadingIndicator() {
    const slot = this.container?.querySelector<HTMLSlotElement>('slot[name="loading-indicator"]');

    if (this.showLoadingIndicator && slot?.assignedNodes().length === 0) {
      this.insertAdjacentHTML('beforeend', '<ids-loading-indicator slot="loading-indicator" size="sm" class="slot-loading-indicator"></ids-loading-indicator>');
    }
  }

  #addClasses() {
    const slot = this.container?.querySelector<HTMLSlotElement>('slot[name="loading-indicator"]');
    slot?.assignedNodes()?.forEach((item: any) => {
      item.classList.add('slot-loading-indicator');
    });
  }
};

export default IdsLoadingIndicatorMixin;
