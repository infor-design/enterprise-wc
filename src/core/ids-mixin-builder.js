/**
 * Combines two mixins with a base class in a prettier syntax
 * Adapted from https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 */
class MixinBuilder {
  appliedClassMixins = new WeakMap();

  /**
   * @param {CustomElementConstructor} superclass the class to originate from
   */
  constructor(superclass) {
    this.superclass = superclass;
  }

  /**
   * Mix a base object with a set of mixins
   * @param {...Function} mixins indeterminate list of function Classes to mix into the superclass
   * @returns {HTMLElement} the new "mixed" Class
   */
  with(...mixins) {
    this.superclass.appliedMixins = [];
    return mixins.reduce((c, mixin) => {
      if (this.superclass.appliedMixins.includes(mixin.name)) {
        return c;
      }

      this.superclass.appliedMixins.push(mixin.name);
      const mixedClass = mixin(c);
      return mixedClass;
    }, this.superclass);
  }
}

/**
 * @param {CustomElementConstructor} superclass the base class to start with
 * @returns {any} a new base class with mixin attribs/methods included
 */
const mix = (superclass) => new MixinBuilder(superclass);
export default mix;
