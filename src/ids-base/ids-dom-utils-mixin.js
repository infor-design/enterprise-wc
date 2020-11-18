/**
 * Ids DOM utilities
 */
const IdsDomUtilsMixin = {
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

export { IdsDomUtilsMixin };
