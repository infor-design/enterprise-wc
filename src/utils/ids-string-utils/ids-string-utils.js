/**
 * Convert a string in presumed kebab case to camel case
 * @param  {string} str [description]
 * @returns {string} The return string
 */
export function camelCase(str) {
  return (str.slice(0, 1).toLowerCase() + str.slice(1))
    .replace(/([-_ ]){1,}/g, ' ')
    .split(/[-_ ]/)
    // eslint-disable-next-line no-unsafe-optional-chaining
    .reduce((cur, acc) => cur + acc[0]?.toUpperCase() + acc.substring(1));
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
  // eslint-disable-next-line no-unsafe-optional-chaining
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
 * Combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM
 * @param  {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */
export function buildClassAttrib(...classes) {
  const classAttrib = classes.reduce((attribStr, c) => {
    if (attribStr && c) { return `${attribStr} ${c}`; }

    if (!attribStr && c) { return c; }
    return attribStr;
  }, '');

  return !classAttrib ? '' : ` class="${classAttrib}"`;
}

/**
 * Checks a keycode value and determines if it belongs to a printable character
 * @private
 * @param {number} e the event to inspect
 * @returns {boolean} Returns true if the key is a printable one.
 */
export function isPrintable(e) {
  const controlKeys = ['Alt', 'Shift', 'Control', 'Meta', 'CapsLock', 'Enter', 'Escape', 'Tab'];
  if (controlKeys.indexOf(e.key) > -1 || e.key.indexOf('Arrow') > -1) {
    return false;
  }

  if ((e.altKey && (e.keyCode === 38)) || (e.keyCode > 111 && e.keyCode < 124)) {
    return false;
  }
  return true;
}
