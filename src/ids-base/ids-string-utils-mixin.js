/**
 * Ids String parsing/processing utilities
 */
const IdsStringUtilsMixin = {
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
   * @param {string} val string value from the component property
   * @returns {boolean} The return boolean
   */
  stringToBool(val) {
    return (val + '').toLowerCase() === 'true'; //eslint-disable-line
  },

  /**
   * Inject template variables in a string
   * @param {string} str The string to inject into
   * @param {string} obj The string to inject into
   * @returns {obj} The dataset row / item
   */
  injectTemplate(str, obj) {
    return str.replace(/\${(.*?)}/g, (x, g) => obj[g]);
  }
};

export { IdsStringUtilsMixin };
