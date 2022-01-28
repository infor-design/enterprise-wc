import { attributes } from '../../core/ids-attributes';
import { stripTags } from '../../utils/ids-xss-utils/ids-xss-utils';

/**
 * A mixin that will provide the container element of an IDS Component with a class
 * reserved for flipping the foreground color (text color, icon fill, etc) to an alternate,
 * contrasting color.  This allows easy integration with alternate layouts, headers, app menu, etc.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsColorVariantMixin = (superclass) => class extends superclass {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.colorVariant = null;

    // Overrides the IdsElement `render` method to also include an update
    // to color variant styling after it runs, keeping the visual state in-sync.
    this.render = () => {
      super.render();
      this.#refreshColorVariant();
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.colorVariant = this.getAttribute(attributes.COLOR_VARIANT);
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR_VARIANT
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = [];

  /**
   * @returns {string|null} the name of the color variant currently applied
   */
  get colorVariant() {
    return this.state?.colorVariant;
  }

  /**
   * @param {string|null} val the name of the color variant to be applied
   */
  set colorVariant(val) {
    let safeValue = null;
    if (typeof val === 'string') {
      safeValue = stripTags(val, '');
    }

    const currentValue = this.state.colorVariant;
    if (currentValue !== safeValue) {
      if (this.colorVariants.includes(safeValue)) {
        this.setAttribute(attributes.COLOR_VARIANT, `${safeValue}`);
      } else {
        this.removeAttribute(attributes.COLOR_VARIANT);
        safeValue = null;
      }

      this.state.colorVariant = safeValue;
      this.#refreshColorVariant(currentValue, safeValue);
    }
  }

  /**
   * Refreshes the component's color variant state, driven by
   * a CSS class on the WebComponent's `container` element
   *
   * @param {string} oldVariantName the variant name to "remove" from the style
   * @param {string} newVariantName the variant name to "add" to the style
   * @returns {void}
   */
  #refreshColorVariant(oldVariantName, newVariantName) {
    const cl = this.container.classList;

    if (oldVariantName) cl.remove(`color-variant-${oldVariantName}`);
    if (newVariantName) cl.add(`color-variant-${newVariantName}`);

    // Fire optional callback
    if (typeof this.onColorVariantRefresh === 'function') {
      this.onColorVariantRefresh();
    }
  }
};

export default IdsColorVariantMixin;
