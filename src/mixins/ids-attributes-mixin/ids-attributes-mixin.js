const TypeCasters = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: JSON.parse,
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const camelCase = (word) => word.split('-').reduce((curr, next) => (`${curr}${capitalize(next)}`));

export const defineProp = (target, name, defaultValue, { changing, changed }) => {
  const attrName = String(name?.attrName || name).trim();
  const propName = String(name?.propName || camelCase(attrName)).trim();
  const propTypeCaster = target.propTypeCasters[typeof (defaultValue)] || Boolean;
  const stringCaster = (typeof (defaultValue) === 'object') ? JSON.stringify : String;

  target.setAttribute(attrName, stringCaster(defaultValue)); // initialize attribute

  const getter = () => (propTypeCaster(target.getAttribute(attrName)) ?? defaultValue);
  const setter = (value) => {
    const stringValue = stringCaster(value);
    changing?.bind(target)?.(stringValue);
    target.setAttribute(attrName, stringValue);
    changed?.bind(target)?.(stringValue);
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
    changing,
    changed,
    defaultValue,
  };
};

/**
 * This decorator may go away, but I'm committing it for the sake of demonstration
 *
 * Possible usage could look like this:
 *
 * +  @attr(attributes.ALIGN, 'center', { changing, changed, })
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
   * +      this.prop(attributes.ALIGN_X, 'start', { changed: this.alignXChanged });
   * +      this.prop(attributes.ALIGN_Y, 'top').changing(this.alignYChanging).changed(this.alignYChanged);
   * +      this.prop(attributes.ALIGN_Y, 'top');
   * +      this.prop(attributes.AUTO_FOCUS, true);
   * +      this.prop(attributes.DATA, { fname: "John", lname: "Doe" });
   * +    }
   * +
   * +    alignXChanged(value) { console.log('alignXChanged, value, this.alignX); }
   * +    alignYChanging(value) { console.log('alignYChanging, value, this.alignY); }
   * +    alignYChanged(value) { console.log('alignYChanged, value, this.alignY); }
   * +  }
   *
   * @param {string} name the attribute name that appears in the DOM
   * @param {*} defaultValue the attributes default value (used to determine TypeCaster)
   * @param {object} options additional settings
   * @returns {object} - object containing changing/changed callbacks to react to attribute changes
   */
  prop(name, defaultValue = false, options = {}) {
    const propInfo = defineProp(this, name, defaultValue, options);
    this.#properties.set(propInfo.attrName, propInfo);

    return {
      changing: (changing) => this.prop(propInfo, defaultValue, { ...propInfo, changing }),
      changed: (changed) => this.prop(propInfo, defaultValue, { ...propInfo, changed })
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
   * + @IdsAttributes.attr(attributes.ALIGN_EDGE, 'center')
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
