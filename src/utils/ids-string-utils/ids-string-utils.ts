/**
 * Convert a string in presumed kebab case to camel case
 * @param  {string} str [description]
 * @returns {string} The return string
 */
export function camelCase(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
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
 * Adjust conditional statements if template found any as:
 * ${#var} True ${/var}
 * ${^var} False ${/var}
 * @param {string} str The string to inject into
 * @param {string} obj The string to inject into
 * @returns {string} The return string
 */
export function adjustConditions(str: string, obj: string): string {
  const regex = /\${(#|\^)(.+?)}/g;
  if (!regex.test(str)) return str;

  // adjuat end tag if use inside html node as attribute.
  // ex. `<div ${#var}x<${/var}>test</div>`
  str = str.replace(/\${=(.+?)\s(.+?)}/g, `\${/$2}`);

  str.match(regex)?.forEach((match) => {
    const key: any = match.replace(/\$|{|#|\^|}/g, '');
    const re = `\\\${(#|\\^)${key}}(.+?)\\\${\\/${key}}`;

    str = str.replace(new RegExp(re, 's'), (m, k) => {
      const isTrue = k === '#';
      if (!((isTrue && obj[key]) || (!isTrue && !obj[key]))) return '';

      const re2 = `\\\${(#|\\^)${key}}|\\\${\\/${key}}`;
      return m.replace(new RegExp(re2, 'gs'), '');
    });
  });
  return str;
}

/**
 * Inject template variables in a string
 * @param {string} str The string to inject into
 * @param {any} obj The string to inject into
 * @returns {string} The return string
 */
export function injectTemplate(str: string, obj: any): string {
  // Adjust conditions
  str = adjustConditions(str, obj);

  // Replace all other keys with data
  return str.replace(/\${(.*?)}/g, (_x, g) => obj[g]);
}

/**
 * Combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM
 * @param  {...any} classes classes/expressions
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
