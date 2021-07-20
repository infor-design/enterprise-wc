import { attributes, IdsStringUtils } from '../ids-base';

/**
 * A mixin that will provide the container element of an IDS Component with a class
 * reserved for flipping the foreground color (text color, icon fill, etc) to an alternate,
 * contrasting color.  This allows easy integration with alternate layouts, headers, app menu, etc.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsInverseColorMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.refreshInverse();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.INVERSE
    ];
  }

  /**
   * @returns {boolean} true if the inverse property is currently enabled
   */
  get inverse() {
    return this.hasAttribute(attributes.INVERSE);
  }

  /**
   * @param {boolean} val true if the inverse property should become enabled
   */
  set inverse(val) {
    const isValueTruthy = IdsStringUtils.stringToBool(val);
    if (isValueTruthy) {
      this.setAttribute(attributes.INVERSE, `${val}`);
    } else {
      this.removeAttribute(attributes.INVERSE);
    }
    this.refreshInverse();
  }

  /**
   * Sets the "inverse" class on the container based on the defined property.
   * @returns {void}
   */
  refreshInverse() {
    this.container.classList[this.inverse ? 'add' : 'remove']('inverse');
  }
};

export default IdsInverseColorMixin;
