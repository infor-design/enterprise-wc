/**
 * Used to "highlight" portions of text content to make them stand out from other text.
 * This is used during filtering or searching.
 * @class IdsHightlightUtil
 */
export class IdsHighlightUtil {
  /**
   * @property {HTMLElement} contextEl the specified root element to parse for content that should be highlighted
   */
  contextEl = null;

  /**
   * @constructor
   * @param {HTMLElement} contextEl a root element to parse for content that should be highlighted
   */
  constructor(contextEl) {
    this.contextEl = contextEl;
  }

  /**
   * Marks the context element anywhere the specified string is found
   * @param {string} str the specified string
   * @returns {void}
   */
  mark(str) {
    console.log(`highlighting "${str}" on element:`, this.contextEl);
  }

  /**
   * Removes all previous marks
   * @returns {void}
   */
  reset() {
    console.log(`removing all highlighted content from element:`, this.contextEl);
  }
}
