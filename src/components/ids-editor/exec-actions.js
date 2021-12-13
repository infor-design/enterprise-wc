/* eslint-disable */
// TODO: remove below log function soon implemention done
// --------------------------------------------------------
function log() {
  console.log([].slice.call(arguments));
}
// ---------------------------------------------------------
/* eslint-enable */

/**
 * Execute editor actions.
 * @private
 * @returns {void}
 */
export const execActions = {
  /**
   * Toggles blockquote for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  blockquote(sel) {
    log('blockquote', sel);
  },

  /**
   * Toggles heading for given selection
   * @param {Selection} sel The selection.
   * @param {string} value The action value.
   * @returns {void}
   */
  heading(sel, value) {
    log('heading', sel, value);
  },

  /**
   * Insert paragraph for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  paragraph(sel) {
    log('paragraph', sel);
  },

  /**
   * Insert preformatted tag for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  pre(sel) {
    log('pre', sel);
  },

  /**
   * Toggles bold on/off for given selection.
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  bold(sel) {
    log('bold', sel);
    const action = { tagName: 'strong', tags: ['strong', 'b'] };
    this.inline(sel, action);

    // document.execCommand('bold', false, null);
  },

  /**
   * Toggles italic on/off for given selection.
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  italic(sel) {
    log('italic', sel);
    const action = { tagName: 'em', tags: ['em', 'i'] };
    this.inline(sel, action);

    // document.execCommand('italic', false, null);
  },

  /**
   * Toggles underline on/off for given selection.
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  underline(sel) {
    log('underline', sel);
    const action = { tagName: 'u', tags: ['u'] };
    this.inline(sel, action);

    // document.execCommand('underline', false, null);
  },

  /**
   * Toggles strike through on/off for given selection.
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  strikeThrough(sel) {
    log('strike through', sel);
    const action = { tagName: 's', tags: ['s', 'strike', 'del'] };
    this.inline(sel, action);

    // document.execCommand('strikeThrough', false, null);
  },

  /**
   * Toggles superscript on/off for given selection.
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  superscript(sel) {
    log('superscript', sel);
    const action = { tagName: 'sup', tags: ['sup'] };
    this.inline(sel, action);

    // document.execCommand('superscript', false, null);
  },

  /**
   * Toggles subscript on/off for given selection.
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  subscript(sel) {
    log('subscript', sel);
    const action = { tagName: 'sub', tags: ['sub'] };
    this.inline(sel, action);

    // document.execCommand('subscript', false, null);
  },

  /**
   * Toggles font color for given selection
   * @param {Selection} sel The selection.
   * @param {string} value The action value.
   * @returns {void}
   */
  foreColor(sel, value) {
    log('font-color', sel, value);
    document.execCommand('foreColor', false, '#ff0000');
  },

  /**
   * Toggles text background color for given selection
   * @param {Selection} sel The selection.
   * @param {string} value The action value.
   * @returns {void}
   */
  backColor(sel, value) {
    log('back-color', sel, value);
    document.execCommand('backColor', false, '#cccccc');
  },

  /**
   * Toggles align left for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  alignLeft(sel) {
    log('align-left', sel);
    document.execCommand('justifyLeft', false, null);
  },

  /**
   * Toggles align center for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  alignCenter(sel) {
    log('align-center', sel);
    document.execCommand('justifyCenter', false, null);
  },

  /**
   * Toggles align right for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  alignRight(sel) {
    log('align-right', sel);
    document.execCommand('justifyRight', false, null);
  },

  /**
   * Toggles align justify for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  alignJustify(sel) {
    log('align-right', sel);
    document.execCommand('justifyFull', false, null);
  },

  /**
   * Toggles ordered-list for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  orderedList(sel) {
    log('ordered-list', sel);
  },

  /**
   * Toggles unordered-list for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  unorderedList(sel) {
    log('unordered-list', sel);
  },

  /**
   * Toggles hyperlink for given selection
   * @param {Selection} sel The selection.
   * @param {string} value The action value.
   * @returns {void}
   */
  hyperlink(sel, value) {
    log('hyperlink', sel, value);
  },

  /**
   * Insert image for given selection
   * @param {Selection} sel The selection.
   * @param {string} value The action value.
   * @returns {void}
   */
  insertImage(sel, value) {
    log('insert-image', sel, value);
  },

  /**
   * Clear formatting for given selection
   * @param {Selection} sel The selection.
   * @returns {void}
   */
  clearFormatting(sel) {
    log('clear-formatting', sel);
  },

  /**
   * Check selection if single node.
   * @param {Selection} range The selection range.
   * @returns {void}
   */
  isSingleNode(range) {
    const startNode = range.startContainer;
    return startNode === range.endContainer
      && startNode.hasChildNodes()
      && range.endOffset === range.startOffset + 1;
  },

  /**
   * Execute the inline given action.
   * @private
   * @param {Selection} sel The selection.
   * @param {object} action The action.
   * @returns {void}
   */
  inline(sel, action) {
    if (sel.type === 'None') return;
    const range = sel.getRangeAt(0);

    let selEl = null;
    if (this.isSingleNode(range)) {
      selEl = range.startContainer.childNodes[range.startOffset];
    } else if (range.startContainer.nodeType === 3) {
      selEl = range.startContainer.parentNode;
    } else {
      selEl = range.startContainer;
    }

    const re = new RegExp(`\\b${action.tags.join('|')}\\b`, 'gi');
    const s = selEl.textContent;

    if (sel.type === 'Caret') {
      // Caret
      if (re.test(selEl.tagName)) {
        let html = `<${action.tagName}>${s.slice(0, range.startOffset)}</${action.tagName}>`;
        html += s.slice(range.startOffset, range.endOffset);
        html += `<${action.tagName}>${s.slice(range.endOffset)}</${action.tagName}>`;
        selEl.outerHTML = html;

        sel.collapse(range.commonAncestorContainer, (range.endOffset + 1));
        sel.collapseToEnd();
        console.log(sel, range);
      } else {
        const el = document.createElement(action.tagName);
        // todo: need to work without this spacer
        el.appendChild(document.createTextNode(' ')); // '\u200B' :zero width space
        range.insertNode(el);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (sel.type === 'Range') {
      // Range
      // Same node and type is text
      if (range.startContainer === range.endContainer && range.startContainer.nodeType === 3) {
        if (re.test(selEl.tagName)) {
          if (sel.focusNode.textContent === sel.toString()) {
            // Selection match whole node text
            selEl.outerHTML = selEl.innerHTML;
          } else {
            // Selection match part of node text
            let html = `<${action.tagName}>${s.slice(0, range.startOffset)}</${action.tagName}>`;
            html += s.slice(range.startOffset, range.endOffset);
            html += `<${action.tagName}>${s.slice(range.endOffset)}</${action.tagName}>`;
            selEl.outerHTML = html;
          }
        } else {
          console.log('Make it bold');
          const prev = sel.baseNode.previousSibling;
          const next = sel.baseNode.nextSibling;
          if ((re.test(prev?.tagName)) && (prev?.tagName === next?.tagName)) {
            let html = `<${action.tagName}>`;
            html += sel.baseNode.previousSibling.innerHTML;
            html += sel.toString();
            html += sel.baseNode.nextSibling.innerHTML;
            html += `</${action.tagName}>`;
            sel.baseNode.previousSibling.outerHTML = html;
            sel.baseNode.nextSibling.remove();
            sel.deleteFromDocument();
          } else {
            const el = document.createElement(action.tagName);
            range.surroundContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      } else {
        console.log(sel);
        console.log(range);
        console.log('Not in same range');
      }
    }
  }
};

export default execActions;
