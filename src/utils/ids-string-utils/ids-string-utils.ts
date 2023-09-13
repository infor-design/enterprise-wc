/**
 * Convert a string in presumed kebab case to camel case
 * @param {string} str description
 * @returns {string} The return string
 */
export function camelCase(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

/**
 * Convert a string into kebab case
 * @param {string} str The value to be converted
 * @returns {string} The return string
 */
export function kebabCase(str: string): string {
  return str?.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
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
export function removeNewLines(str: string): string | null {
  return str?.replace(/\r?\n|\r/g, ' ') || '';
}

/**
 * Convert an attribute string into a boolean representation
 * @param {string|boolean|null} val string value from the component attribute
 * @returns {boolean} The return boolean
 */
export function stringToBool(val: string | boolean | null | undefined): boolean {
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
export function stringToNumber(val?: string | number | any): number {
  return parseFloat(val); // eslint-disable-line
}

/**
 * Inject template variables in a string
 * @param {string} str The string to inject into
 * @param {any} obj The string to inject into
 * @returns {string} The return string
 */
export function injectTemplate(str: string, obj: any): string {
  // Replace all other keys with data
  return str.replace(/\${(.*?)}/g, (_x, g) => {
    let value = obj[g];
    if (value !== undefined) return value;

    if (g.includes('.')) {
      const path = g.split('.');
      path.forEach((key: string) => {
        value = value?.[key] ?? obj[key];
      });
    }
    return value ?? '&nbsp;';
  });
}

/**
 * Combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM
 * @param {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */
export function buildClassAttrib(...classes: any): string {
  const classAttrib = classes.reduce((attribStr: any, c: any) => {
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
export function isPrintable(e: KeyboardEvent | any): boolean {
  const controlKeys = ['Alt', 'Shift', 'Control', 'Meta', 'CapsLock', 'Enter', 'Escape', 'Tab'];
  if (controlKeys.indexOf(e.key) > -1 || e.key.indexOf('Arrow') > -1) {
    return false;
  }

  if ((e.altKey && (e.keyCode === 38)) || (e.keyCode > 111 && e.keyCode < 124)) {
    return false;
  }
  return true;
}

/**
 * Escape user input that will be treated as a literal string.
 * This prevents incorrect RegExp matching when converting user input.
 * @param {string} s string to process
 * @returns {string} string after escaping
 */
export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& whole matched string
}
