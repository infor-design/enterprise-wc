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
      attributes.LOADING_INDICATOR_ONLY,
      attributes.SHOW_LOADING_INDICATOR,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    this.#attachLoadingIndicator();
    this.#addClass();
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

  /**
   * Set whether or not to replace text/icons with the loading indicator and place it at the center. Defaults to false
   * @param {boolean|string|null} value loading-indicator-only attribute value
   */
  set loadingIndicatorOnly(value: string | boolean | null) {
    const boolVal = stringToBool(value);
    if (boolVal) {
      this.setAttribute(attributes.LOADING_INDICATOR_ONLY, boolVal.toString());
    } else {
      this.removeAttribute(attributes.LOADING_INDICATOR_ONLY);
    }
  }

  /**
   * loading-indicator-only attribute
   * @returns {boolean} loadingIndicatorOnly param converted to boolean from attribute value. Defaults to false
   */
  get loadingIndicatorOnly() { return stringToBool(this.getAttribute(attributes.LOADING_INDICATOR_ONLY)); }

  #getSlottedElements() {
    const slot = this.container?.querySelector<HTMLSlotElement>('slot[name="loading-indicator"]');

    return slot?.assignedNodes();
  }

  #attachLoadingIndicator() {
    if (this.showLoadingIndicator && this.#getSlottedElements()?.length === 0) {
      const type: string | null = this.getAttribute('type');

      this.insertAdjacentHTML(
        'beforeend',
        `<ids-loading-indicator
          slot="loading-indicator"
          size="xs"
          class="slot-loading-indicator${type ? ` type-${type}` : ''}"
        ></ids-loading-indicator>`
      );
    }
  }

  /**
   * Add CSS class if an element provided in the slot
   */
  #addClass() {
    this.#getSlottedElements()?.forEach((item: Node) => {
      (item as HTMLElement).classList.add('slot-loading-indicator');
    });
  }
};

export default IdsLoadingIndicatorMixin;
