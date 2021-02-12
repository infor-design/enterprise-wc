/**
 * Ids DOM utilities
 */
const IdsDomUtils = {
  /**
   * Determines if a string-based attribute value is "true" for a boolean property
   * @param {any} val the value to be checked
   * @returns {boolean} true if the value is valid as a boolean property
   */
  isTrueBooleanAttribute(val) {
    return val !== null && (val === true || (typeof val === 'string' && val !== 'false'));
  },

  /**
   * Calculate outer width for given element
   * @param {HTMLElement} elem The DOM element
   * @returns {number} The calculated outer width
   */
  outerWidth(elem) {
    let width = 0;
    if (elem instanceof HTMLElement) {
      const style = getComputedStyle(elem);
      width = elem.offsetWidth + parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
    }
    return width;
  }
};

export { IdsDomUtils };
