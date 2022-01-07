import Mark from 'mark.js';

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
   * @property {Mark} markAPI reference to the `mark.js` API
   */
  markAPI = null;

  /**
   * @property {boolean} isMarked true if the specified element currently contains marked content
   */
  isMarked = false;

  /**
   * @constructor
   * @param {HTMLElement} contextEl a root element to parse for content that should be highlighted
   */
  constructor(contextEl) {
    this.contextEl = contextEl;
    this.markAPI = new Mark(contextEl);
  }

  /**
   * Marks the context element anywhere the specified string is found
   * @param {string} str the specified string
   * @returns {void}
   */
  mark(str) {
    this.markAPI.mark(str, {
      element: 'span',
      className: 'filter',
    });
  }

  /**
   * Removes all previous marks
   * @returns {void}
   */
  reset() {
    this.markAPI.unmark();
  }
}

export { Mark };
