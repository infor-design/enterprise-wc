/**
 * Ids String parsing/processing utilities
 */
const IdsStringUtils = {
  /**
   * Convert a string in presumed kebab case to camel case
   * @param  {string} str [description]
   * @returns {string} The return string
   */
  camelCase(str) {
    return (str.slice(0, 1).toLowerCase() + str.slice(1))
      .replace(/([-_ ]){1,}/g, ' ')
      .split(/[-_ ]/)
      .reduce((cur, acc) => cur + acc[0].toUpperCase() + acc.substring(1));
  },

  /**
   * Convert a string value into a boolean
   * @param {string|boolean|any} val string value from the component property
   * @returns {boolean} The return boolean
   */
  stringToBool(val) {
    if (typeof val === 'string' && val.toLowerCase() === 'false') {
      return false;
    }
    return val !== null && (val === true || (typeof val === 'string' && val !== 'false'));
  },

  /**
   * Inject template variables in a string
   * @param {string} str The string to inject into
   * @param {string} obj The string to inject into
   * @returns {obj} The dataset row / item
   */
  injectTemplate(str, obj) {
    return str.replace(/\${(.*?)}/g, (_x, g) => obj[g]);
  }
};

export { IdsStringUtils };
