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

    if (!this.state) {
      this.state = {};
    }

    // Overrides the IdsElement `render` method to also include an update
    // to the `inverse` styling after it runs, keeping the visual state in-sync.
    this.render = () => {
      super.render();
      this.refreshInverse();
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.inverse = IdsStringUtils.stringToBool(this.getAttribute('inverse')) || false;
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
    return this.state.inverse;
  }

  /**
   * @param {boolean} val true if the inverse property should become enabled
   */
  set inverse(val) {
    const truthyVal = IdsStringUtils.stringToBool(val);
    if (truthyVal !== this.state.inverse) {
      if (truthyVal) {
        this.setAttribute(attributes.INVERSE, `${val}`);
      } else {
        this.removeAttribute(attributes.INVERSE);
      }
      this.state.inverse = truthyVal;
      this.refreshInverse();
    }
  }

  /**
   * Refreshes the component's "inverse" state
   * @returns {void}
   */
  refreshInverse() {
    this.container.classList[this.inverse ? 'add' : 'remove']('inverse');

    // Fire optional callback
    if (typeof this.onInverseRefresh === 'function') {
      this.onInverseRefresh();
    }
  }
};

export default IdsInverseColorMixin;
