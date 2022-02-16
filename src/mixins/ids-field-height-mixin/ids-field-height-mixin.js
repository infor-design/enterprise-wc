// Import Core
import { attributes } from '../../core/ids-attributes';

// Setting defaults field-heights
const FIELD_HEIGHTS = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
};

// Returns a Field Height css class
const getFieldHeightClass = (val) => `field-height-${val || FIELD_HEIGHTS.default}`;

/**
 * Adds a "field-height" attrbute to a component, which enables style capability in a component,
 * linked to detection of its desired Field Height
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFieldHeightMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.FIELD_HEIGHT,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.container.classList.add(getFieldHeightClass(this.fieldHeight));
  }

  /**
   * Set the fieldHeight (height) of input
   * @param {string} value [xs, sm, mm, md, lg]
   */
  set fieldHeight(value) {
    const fieldHeight = FIELD_HEIGHTS[value];

    const heightClasses = Object.values(FIELD_HEIGHTS).map((h) => getFieldHeightClass(h));
    this.container?.classList.remove(...heightClasses);

    if (fieldHeight) {
      this.setAttribute(attributes.FIELD_HEIGHT, fieldHeight);
      this.container?.classList.add(getFieldHeightClass(fieldHeight));
    } else {
      this.removeAttribute(attributes.FIELD_HEIGHT);
    }

    if (typeof this.onFieldHeightChange === 'function') {
      this.onFieldHeightChange(fieldHeight);
    }
  }

  get fieldHeight() {
    return this.getAttribute(attributes.FIELD_HEIGHT);
  }

  /**
   * Get field height css class name with prefix
   * @private
   * @param {string} val The given value
   * @returns {string} css class name with prefix
   */
  fieldHeightClass(val) {
    return `field-height-${val || FIELD_HEIGHTS.default}`;
  }
};

export default IdsFieldHeightMixin;
export {
  FIELD_HEIGHTS
};
