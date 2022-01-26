const TypeCasters = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: JSON.parse,
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const camelCase = (word) => word.split('-').reduce((curr, next) => (`${curr}${capitalize(next)}`));

export const defineProp = (target, name, defaultValue, { propName, before, after }) => {
  const attrName = String(name).trim();
  propName = String(propName || camelCase(attrName)).trim();
  const propTypeCaster = target.propTypeCasters[typeof (defaultValue)] || Boolean;
  const stringCaster = (typeof (defaultValue) === 'object') ? JSON.stringify : String;

  target.setAttribute(attrName, stringCaster(defaultValue)); // initialize attribute

  const getter = () => (propTypeCaster(target.getAttribute(attrName)) ?? defaultValue);
  const setter = (value) => {
    const stringValue = stringCaster(value);
    before?.bind(target)?.(stringValue);
    target.setAttribute(attrName, stringValue);
    after?.bind(target)?.(stringValue);
  };

  const propDescriptor = {
    get: getter.bind(target),
    set: setter.bind(target),
    configurable: true,
    enumerable: true
  };

  Object.defineProperty(target, propName, propDescriptor);

  return {
    attrName,
    propName,
    propDescriptor,
    propTypeCaster,
    stringCaster,
    before,
    after,
    defaultValue,
  };
};

/**
 * This decorator may go away, but I'm committing it for the sake of demonstration
 *
 * Possible usage could look like this:
 *
 * +  import { decorator as attr } from 'mixins/ids-attributes-mixin/ids-attributes-mixin';
 * +
 * +  @attr(attributes.ALIGN, 'center', { before, after, })
 * +  class IdsCustomComponent extends Base {}
 *
 * @param  {...any} args - attribute settings
 * @returns {Function} - decorator handler
 */
export const decorator = (...args) => {
  const [name, defaultValue, options = {}] = args;
  return (target) => {
    defineProp(target.prototype, name, defaultValue, options);
  };
};

/**
 * A mixin that adds attribute getter/setter helper functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
export const IdsAttributesMixin = (superclass) => class extends superclass {
  #properties = new Map();

  get props() { return this.#properties; }

  /**
   * Example usage:
   *
   * +  class IdsCustomComponent extends Base {
   * +    constructor() {
   * +      super();
   * +
   * +      this.prop(attributes.DATA, { fname: "John", lname: "Doe" });
   * +      this.prop(attributes.AUTO_FOCUS);
   * +
   * +      // Reacting to prop changes using method-chaining
   * +      this.prop(attributes.ALIGN_Y, 'top').before(this.alignYBefore).after(this.alignYAfter);
   * +
   * +      // Reacting to prop changes using the options argument
   * +      this.prop(attributes.ALIGN_X, 'start', { after: this.alignXAfter });
   * +
   * +    }
   * +
   * +    // Methods for reacting to prop changes (used in the constructor above)
   * +    alignXAfter(value) { console.log('alignXAfter, value, this.alignX); }
   * +    alignYBefore(value) { console.log('alignYBefore, value, this.alignY); }
   * +    alignYAfter(value) { console.log('alignYAfter, value, this.alignY); }
   * +  }
   *
   * @param {string} name the attribute name that appears in the DOM
   * @param {*} defaultValue the attributes default value (used to determine TypeCaster)
   * @param {object} options additional settings
   * @returns {object} - object containing before/after callbacks to react to attribute changes
   */
  prop(name, defaultValue = false, options = {}) {
    const propInfo = defineProp(this, name, defaultValue, options);
    this.#properties.set(propInfo.attrName, propInfo);

    return {
      before: (before) => this.prop(propInfo.attrName, defaultValue, { ...propInfo, before }),
      after: (after) => this.prop(propInfo.attrName, defaultValue, { ...propInfo, after })
    };
  }

  /**
   * Overridable getter - allows Web Components to define their own propTypeCasters
   * @returns {TypeCasters} needs keys for string|boolean|number|object
   */
  get propTypeCasters() { return TypeCasters; }

  /**
   * This class-based decorator wrapper may go away, but I'm committing it for the sake of demonstration
   *
   * Possible usage could look like this:
   *
   * + import { IdsAttributes } from 'mixins/ids-attributes-mixin/ids-attributes-mixin';
   * +
   * + @IdsAttributes.attr(attributes.AUTO_UPDATE)
   * + class IdsCustomComponent extends Base {}
   *
   * @see decorator()
   * @param  {...any} args - attribute settings
   * @returns {Function} - decorator handler
   */
  static attr(...args) {
    return decorator(...args);
  }
};

export const IdsAttributes = IdsAttributesMixin(HTMLElement);

export default IdsAttributesMixin;
