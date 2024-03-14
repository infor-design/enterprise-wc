import { BLOCK_ELEMENTS } from './ids-editor-shared';

export interface IdsEditorBlockElem {
  /** The block element */
  el: HTMLElement;
  /** The value filter */
  tagName: string;
}

/**
 * Get block element and tagName for given node
 * @param {Selection} sel The selection.
 * @returns {IdsEditorBlockElem} The element and tagname
 */
export function blockElem(sel: Selection): IdsEditorBlockElem {
  let tagName = '';
  let el = sel.anchorNode as HTMLElement;
  if (el && el.tagName) tagName = el.tagName.toLowerCase();
  while (el && BLOCK_ELEMENTS.indexOf(tagName) === -1) {
    el = el.parentNode as HTMLElement;
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
export function selectionBlockElems(sel: Selection, elem: HTMLElement): Array<HTMLElement> {
  return [...elem.querySelectorAll<HTMLElement>(BLOCK_ELEMENTS.join(', '))].filter((el) => sel.containsNode(el, true));
}

/**
 * Save current selection.
 * @param {Selection} sel The selection.
 * @returns {Array<Range>|null} The selection ranges.
 */
export function saveSelection(sel: Selection): Array<Range> | null {
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
 * @returns {void}
 */
export function restoreSelection(sel: Selection, savedSel: Array<Range> | null) {
  if (savedSel) {
    sel.removeAllRanges();
    savedSel.forEach((s) => sel.addRange(s));
  }
}

/**
 * Get all selection parents.
 * @param {Selection} sel The selection.
 * @param {HTMLElement} elem The element.
 * @returns {object} List of selection parents.
 */
export function selectionParents(sel: Selection, elem: HTMLElement): object {
  const parents: Record<string, { tag: string, node: HTMLElement }> = {};

  if (sel.focusNode && sel.containsNode(elem, true)) {
    let node = sel.focusNode;

    while (node && node !== elem) {
      if (node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        parents[tag] = { tag, node };
      }

      node = node.parentNode as HTMLElement;
    }
  }

  return parents;
}

/**
 * Find element within the selection
 * http://stackoverflow.com/questions/6052870/how-to-know-if-there-is-a-link-element-within-the-selection
 * @param {Selection} sel The selection.
 * @param {HTMLElement} container The editor host element
 * @param {string} tagName The tagname to find.
 * @returns {HTMLElement|null} The found element.
 */
export function findElementInSelection(sel: Selection, container: HTMLElement, tagName: string): HTMLElement | null {
  const range = sel.getRangeAt(0);

  if (range && container.contains(sel.focusNode)) {
    const selectionParent = range.commonAncestorContainer as HTMLElement;

    // Look for an element *around* the selected range
    for (let el = selectionParent; el && el !== container; el = el.parentElement as HTMLElement) {
      if (el && el.tagName && el.tagName.toLowerCase() === tagName) {
        return el;
      }
    }

    // Look for an element *within* the selected range
    if (!range.collapsed && selectionParent instanceof Element) {
      const elemsInside = [...selectionParent.getElementsByTagName(tagName)] as HTMLElement[];
      const elemRange = document.createRange();

      // Determine if element is within the range
      for (let i = 0; i < elemsInside.length; i++) {
        const elem = elemsInside[i];
        elemRange.selectNodeContents(elem);
        if (range.compareBoundaryPoints(Range.END_TO_START, elemRange) < 0
          && range.compareBoundaryPoints(Range.START_TO_END, elemRange) > 0) {
          return elem;
        }
      }
    }
  }

  return null;
}
