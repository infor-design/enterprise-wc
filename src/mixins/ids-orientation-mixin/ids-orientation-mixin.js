import { attributes } from '../../core';
import { IdsXssUtils } from '../../utils';

/**
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsOrientationMixin = (superclass) => class extends superclass {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.orientation = null;

    // Overrides the IdsElement `render` method to also include an update
    // to color variant styling after it runs, keeping the visual state in-sync.
    this.render = () => {
      super.render();
      this.#refreshOrientation();
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.orientation = this.getAttribute(attributes.ORIENTATION);
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.ORIENTATION
    ];
  }

  /**
   * @returns {Array<string>} List of available orientation for this component
   */
  orientations = ['horizontal', 'vertical'];

  /**
   * @returns {string|null} the name of the orientation currently applied
   */
  get orientation() {
    return this.state?.orientation;
  }

  /**
   * @param {string|null} val the name of the orientation to be applied
   */
  set orientation(val) {
    let safeVal = null;
    if (typeof val === 'string') {
      safeVal = IdsXssUtils.stripTags(val, '');
    }

    if (this.orientations.includes(safeVal)) {
      this.setAttribute(attributes.ORIENTATION, `${safeVal}`);
    } else {
      this.removeAttribute(attributes.ORIENTATION);
      safeVal = null;
    }

    if (this.state.orientation !== safeVal) {
      this.state.orientation = safeVal;
      this.#refreshOrientation(safeVal);
    }
  }

  /**
   * Refreshes the component's orientation state, driven by
   * a CSS class on the WebComponent's `container` element
   *
   * @param {string} variantName the orientation variant name to "add" to the style
   * @returns {void}
   */
  #refreshOrientation(variantName) {
    const variantClass = `orientation-${variantName}`;
    const cl = this.container.classList;

    // remove any orientation classes
    cl.forEach((x) => {
      if (x.includes('orientation')) cl.remove(x);
    });

    // add the orientation class
    if (variantName !== null) {
      cl.add(variantClass);
    }

    // Fire optional callback
    if (typeof this.onOrientationRefresh === 'function') {
      this.onOrientationRefresh();
    }
  }
};

export default IdsOrientationMixin;
