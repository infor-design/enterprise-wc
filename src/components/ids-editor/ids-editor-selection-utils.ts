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

/**
 * Get all selection parents.
 * @param {Selection} sel The selection.
 * @param {HTMLElement} elem The element.
 * @returns {object} List of selection parents.
 */
export function selectionParents(sel: Selection, elem: HTMLElement): object {
  const parents: any = {};
  if (sel?.containsNode(elem, true)) {
    let node = <HTMLElement>sel?.focusNode;
    while (node !== elem) {
      const tag = node?.tagName?.toLowerCase();
      if (tag) parents[tag] = { tag, node };
      node = <HTMLElement>node?.parentNode;
    }
  }

  console.log('selectionParents', parents);

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
export function findElementInSelection(sel: Selection, container: HTMLElement, tagname: string): HTMLElement | null {
  let el: any;
  let comprng: any;
  let selparent: any;
  const range = <any>sel.getRangeAt(0);

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
      comprng = document.createRange ? document.createRange() : (<any>document.body).createTextRange();

      // Determine if element is within the range
      el.forEach((elem: any) => {
        if (document.createRange as any) {
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
