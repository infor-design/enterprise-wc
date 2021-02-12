/**
 * Combines two mixins with a base class in a prettier syntax
 * Adapted from https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 */
class MixinBuilder {
  /**
   * @param {CustomElementConstructor} superclass the class to originate from
   */
  constructor(superclass) {
    this.superclass = superclass;
  }

  /**
   * @param {...Function} mixins indeterminate list of function Classes to mix into the superclass
   * @returns {HTMLElement} the new "mixed" Class
   */
  with(...mixins) {
    // @ts-ignore
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

/**
 * @param {CustomElementConstructor} superclass the base class to start with
 * @returns {any} a new base class with mixin props/methods included
 */
const mix = (superclass) => new MixinBuilder(superclass);
export default mix;
