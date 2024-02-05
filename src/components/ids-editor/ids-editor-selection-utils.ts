import { BLOCK_ELEMENTS, qsAll } from './ids-editor-shared';

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
  const blockElems: Array<HTMLElement> = [];
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
