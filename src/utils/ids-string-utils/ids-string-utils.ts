/**
 * Convert a string in presumed kebab case to camel case
 * @param  {string} str [description]
 * @returns {string} The return string
 */
export function camelCase(str: string): string {
  return (str.slice(0, 1).toLowerCase() + str.slice(1))
    .replace(/([-_ ]){1,}/g, ' ')
    .split(/[-_ ]/)
    .reduce((cur, acc) => cur + acc[0]?.toUpperCase() + acc.substring(1));
}

/**
 * Removes all duplicate characters from a string and returns another string
 * containing ALL unique characters.  Useful for construction of REGEX objects
 * with characters from an input field, etc.
 * @param {string} str The string to process
 * @returns {string} The processed string
 */
export function removeDuplicates(str: string): string {
  return str
    .split('')
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .join('');
}

/**
 * Removes all newLines from a string and replaces them with spaces
 * @param {string} str the incoming string to format
 * @returns {string} the string with newline characters replaced
 */
export function removeNewLines(str: string): string {
  return str.replace(/\r?\n|\r/g, ' ');
}

/**
 * Convert an attribute string into a boolean representation
 * @param {string|boolean|any} val string value from the component attribute
 * @returns {boolean} The return boolean
 */
export function stringToBool(val: string | boolean): boolean {
  if ((typeof val === 'string' && val.toLowerCase() === 'false') || val === false) {
    return false;
  }
  return typeof val === 'string' || val === true;
}

/**
 * Converts an attribute string into a number, or returns NaN
 * @param {string|number|any} val string value from the component attribute
 * @returns {number} The return boolean
 */
export function stringToNumber(val: string): number {
  return parseFloat(val); // eslint-disable-line
}

/**
 * Inject template variables in a string
 * @param {string} str The string to inject into
 * @param {string} obj The string to inject into
 */
export function injectTemplate(str: string, obj: string): string {
  return str.replace(/\${(.*?)}/g, (_x, g) => obj[g]);
}

/**
 * Combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM
 * @param  {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */
export function buildClassAttrib(...classes: Record<string, unknown>[]): string {
  const classAttrib = classes.reduce((attribStr: any, c) => {
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
export function isPrintable(e: KeyboardEvent): boolean {
  const controlKeys = ['Alt', 'Shift', 'Control', 'Meta', 'CapsLock', 'Enter', 'Escape', 'Tab'];
  if (controlKeys.indexOf(e.key) > -1 || e.key.indexOf('Arrow') > -1) {
    return false;
  }

  if ((e.altKey && (e.keyCode === 38)) || (e.keyCode > 111 && e.keyCode < 124)) {
    return false;
  }
  return true;
}
