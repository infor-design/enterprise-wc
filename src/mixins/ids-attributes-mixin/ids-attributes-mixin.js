const TypeCasters = {
  boolean: Boolean,
  number: Number,
  string: String,
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const camelCase = (word) => word.split('-').reduce((curr, next) => (`${curr}${capitalize(next)}`));

export const defineProp = (target, name, defaultValue, { changing, changed }) => {
  const attrName = String(name?.attrName || name).trim();
  const propName = String(name?.propName || camelCase(attrName)).trim();
  const propTypeCaster = TypeCasters[typeof (defaultValue)] || Boolean;

  const getter = () => (propTypeCaster(target.getAttribute(attrName)) ?? defaultValue);
  const setter = (value) => {
    changing?.bind(target)?.(value);
    target.setAttribute(attrName, value);
    changed?.bind(target)?.(value);
  };

  target.setAttribute(attrName, defaultValue); // initialize attribute

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
};

export default IdsAttributesMixin;
