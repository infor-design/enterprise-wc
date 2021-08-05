/**
 * Convert a string in presumed kebab case to camel case
 * @param  {string} str [description]
 * @returns {string} The return string
 */
export function camelCase(str) {
  return (str.slice(0, 1).toLowerCase() + str.slice(1))
    .replace(/([-_ ]){1,}/g, ' ')
    .split(/[-_ ]/)
    .reduce((cur, acc) => cur + acc[0].toUpperCase() + acc.substring(1));
}

/**
 * Removes all duplicate characters from a string and returns another string
 * containing ALL unique characters.  Useful for construction of REGEX objects
 * with characters from an input field, etc.
 * @param {string} str The string to process
 * @returns {string} The processed string
 */
export function removeDuplicates(str) {
  return str
    .split('')
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .join('');
}

/**
 * Convert an attribute string into a boolean representation
 * @param {string|boolean|any} val string value from the component attribute
 * @returns {boolean} The return boolean
 */
export function stringToBool(val) {
  if (typeof val === 'string' && val.toLowerCase() === 'false') {
    return false;
  }
  return val !== null && (val === true || (typeof val === 'string' && val !== 'false'));
}

/**
 * Converts an attribute string into a number
 * @param {string|number|any} val string value from the component attribute
 * @returns {number} The return boolean
 */
export function stringToNumber(val) {
  const v = val?.toString() * 1; // Converting String to Number
  return !isNaN(v) ? v : 0; // eslint-disable-line
}

/**
 * Inject template variables in a string
 * @param {string} str The string to inject into
 * @param {string} obj The string to inject into
 * @returns {obj} The dataset row / item
 */
export function injectTemplate(str, obj) {
  return str.replace(/\${(.*?)}/g, (_x, g) => obj[g]);
}

/**
 * combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM without
 * any fuss
 *
 * @param  {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */
export function buildClassAttrib(...classes) {
  /* istanbul ignore next */
  const classAttrib = classes.reduce((attribStr = '', c) => {
    /* istanbul ignore else */
    if (attribStr && c) { return `${attribStr} ${c}`; }

    /* istanbul ignore else */
    if (!attribStr && c) { return c; }
    return attribStr;
  }, '');

  /* istanbul ignore next */
  return !classAttrib ? '' : ` class="${classAttrib}"`;
}

/**
 * Check whether the given object is an object or not.
 * @param {any} obj The object to check.
 * @returns {boolean} true if given object is an object.
 */
export function isObject(obj) {
  return obj instanceof Object && !(obj instanceof Number) && !(obj instanceof Array);
}

/**
 * Check the given object is an object and NOT empty.
 * @param {any} obj The object to check.
 * @returns {boolean} true if given object is an object and NOT empty.
 */
export function isObjectAndNotEmpty(obj) {
  return isObject(obj) && Object.keys(obj).length > 0;
}

/**
 * Ids String parsing/processing utilities
 */
export const IdsStringUtils = {
  camelCase,
  injectTemplate,
  stringToBool,
  stringToNumber,
  removeDuplicates,
  buildClassAttrib,
  isObject,
  isObjectAndNotEmpty
};

export default IdsStringUtils;
export { IdsStringUtils as stringUtils };
