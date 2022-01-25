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
 * A mixin that adds attribute getter/setter helper functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
export const IdsAttributesMixin = (superclass) => class extends superclass {
  #properties = new Map();

  get props() { return this.#properties; }

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
};

export default IdsAttributesMixin;
