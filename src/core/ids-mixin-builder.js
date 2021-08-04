/**
 * @param {CustomElementConstructor} superclass the base class to start with
 * @returns {any} a new base class with mixin attribs/methods included
 */
export default function mix(superclass) {
  const baseClass = class extends superclass {
    constructor() {
      super();
      this.superclass = superclass;
    }
  };

  return {
    with(...mixins) {
      return mixins.reduce((c, mixin) => mixin(c), baseClass);
    }
  };
}
