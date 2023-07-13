import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

export interface ColorVariantHandler {
  // as instance function
  onColorVariantRefresh?(variantName: string | undefined | null): void;
  // as instance property
  onColorVariantRefresh?: (variantName: string | undefined | null) => void;
}

type Constraints = IdsConstructor<ColorVariantHandler>;

/**
 * A mixin that will provide the container element of an IDS Component with a class
 * reserved for flipping the foreground color (text color, icon fill, etc) to an alternate,
 * contrasting color.  This allows easy integration with alternate layouts, headers, app menu, etc.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsColorVariantMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.colorVariant) this.#refreshColorVariant(null, this.colorVariant);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.COLOR_VARIANT
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants: Array<string> = [];

  /**
   * @returns {string|null} the name of the color variant currently applied
   */
  get colorVariant(): string | null {
    return this.getAttribute(attributes.COLOR_VARIANT);
  }

  /**
   * @param {string | null} val the name of the color variant to be applied
   */
  set colorVariant(val: string | null) {
    const safeValue = val ? stripHTML(val) : '';
    const currentValue = this.colorVariant;

    if (this.colorVariants.includes(safeValue)) {
      this.setAttribute(attributes.COLOR_VARIANT, `${safeValue}`);
    } else {
      this.removeAttribute(attributes.COLOR_VARIANT);
    }

    if (!safeValue || currentValue === safeValue) return;
    this.#refreshColorVariant(currentValue, safeValue);
  }

  /**
   * Refreshes the component's color variant state, driven by
   * a CSS class on the WebComponent's `container` element
   * @param {string} oldVariantName the variant name to "remove" from the style
   * @param {string} newVariantName the variant name to "add" to the style
   * @returns {void}
   */
  #refreshColorVariant(oldVariantName?: string | null, newVariantName?: string | null): void {
    if (!this.container) {
      return;
    }

    const cl = this.container?.classList;

    if (oldVariantName) cl?.remove(`color-variant-${oldVariantName}`);
    if (newVariantName) cl?.add(`color-variant-${newVariantName}`);

    // Fire optional callback
    if (typeof this.onColorVariantRefresh === 'function') {
      this.onColorVariantRefresh(newVariantName);
    }
  }
};

export default IdsColorVariantMixin;
