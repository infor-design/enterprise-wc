import { BLOCK_ELEMENTS, qsAll } from './ids-editor-shared';

/**
 * Get block element and tagName for given node
 * @param {Selection} sel The selection.
 * @returns {object} The element and tagname
 */
export function blockElem(sel) {
  let tagName;
  let el = sel.anchorNode;
  if (el && el.tagName) tagName = el.tagName.toLowerCase();
  while (el && BLOCK_ELEMENTS.indexOf(tagName) === -1) {
    el = el.parentNode;
    if (el && el.tagName) tagName = el.tagName.toLowerCase();
  }
  return { el, tagName };
}

/**
 * Get list of block elements for selection
 * @param {Selection} sel The selection.
 * @param {HTMLElement} elem The element.
 * @returns {Array<HTMLElement>} List of selection block elements
 */
export function selectionBlockElems(sel, elem) {
  const blockElems = [];
  qsAll(BLOCK_ELEMENTS.join(', '), elem).forEach((el) => {
    if (sel.containsNode(el, true)) {
      blockElems.push(el);
    }
  });
  return blockElems;
}

/**
 * Save current selection.
 * @param {Selection} sel The selection.
 * @returns {Array<Range>|null} The selection ranges.
 */
export function saveSelection(sel) {
  if (sel.getRangeAt && sel.rangeCount) {
    const ranges = [];
    for (let i = 0, l = sel.rangeCount; i < l; i++) {
      ranges.push(sel.getRangeAt(i));
    }
    return ranges;
  }
  return null;
}

/**
 * Restore selection.
 * @param {Selection} sel The selection.
 * @param {Array<Range>|null} savedSel Saved selection ranges.
 * @returns {object} The object for chaining.
 */
export function restoreSelection(sel, savedSel) {
  if (savedSel) {
    sel.removeAllRanges();
    savedSel.forEach((s) => sel.addRange(s));
  }
  return this;
}

/**
 * Get all selection parents.
 * @param {Selection} sel The selection.
 * @param {HTMLElement} elem The element.
 * @returns {object} List of selection parents.
 */
export function selectionParents(sel, elem) {
  const parents = {};
  if (sel?.containsNode(elem, true)) {
    let node = sel?.focusNode;
    while (node?.id !== 'editor-container') {
      const tag = node?.tagName?.toLowerCase();
      if (tag) parents[tag] = { tag, node };
      node = node?.parentNode;
    }
  }
  return parents;
}

/**
 * Find element within the selection
 * http://stackoverflow.com/questions/6052870/how-to-know-if-there-is-a-link-element-within-the-selection
 * @param {Selection} sel The selection.
 * @param {HTMLElement} container The editor container element.
 * @param {string} tagname The tagname to find.
 * @returns {HTMLElement|null} The found element.
 */
export function findElementInSelection(sel, container, tagname) {
  let el;
  let comprng;
  let selparent;
  const range = sel.getRangeAt(0);

  if (range) {
    selparent = range.commonAncestorContainer || range.parentElement();
    // Look for an element *around* the selected range
    for (el = selparent; el !== container; el = el?.parentNode) {
      if (el && el.tagName && el.tagName.toLowerCase() === tagname) {
        return el;
      }
    }

    // Look for an element *within* the selected range
    if (!range.collapsed
      && (range.text === undefined || range.text)
      && selparent.getElementsByTagName) {
      el = selparent.getElementsByTagName(tagname);
      comprng = document.createRange ? document.createRange() : document.body.createTextRange();

      // Determine if element is within the range
      el.forEach((elem) => {
        if (document.createRange) {
          comprng.selectNodeContents(elem);
          if (range.compareBoundaryPoints(Range.END_TO_START, comprng) < 0
            && range.compareBoundaryPoints(Range.START_TO_END, comprng) > 0) {
            return elem;
          }
        } else {
          comprng.moveToElementText(elem);
          if (range.compareEndPoints('StartToEnd', comprng) < 0
            && range.compareEndPoints('EndToStart', comprng) > 0) {
            return elem;
          }
        }
      });
    }
  }
  return null;
}
