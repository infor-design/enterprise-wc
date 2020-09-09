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
   *
   * @param {string} val string value from the property
   * @returns {boolean} true/false value
   */
  stringToBool(val) {
    return (val).toLowerCase() === 'true';
  }
};

export { IdsStringUtilsMixin };
