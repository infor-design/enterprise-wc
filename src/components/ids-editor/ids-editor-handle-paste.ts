import { htmlEntities, cleanHtml } from './ids-editor-clean-utils';

/**
 * Paste as plain text.
 * @private
 * @param {ClipboardEvent} e The event
 * @returns {string|null} The updated pasted data
 */
export function handlePasteAsPlainText(e?: ClipboardEvent): string | null {
  if (!e) return null;

  let paste;
  let html = '';
  if (e.clipboardData?.getData) {
    paste = e.clipboardData.getData('text/plain');
  } else {
    paste = (<any>window).clipboardData?.getData ? (<any>window).clipboardData.getData('Text') : false;
  }
  if (paste) {
    const nodes = paste.split(/[\r\n]/g);
    nodes.forEach((node: string, i: number) => {
      if (node !== '') {
        if (navigator.userAgent.match(/firefox/i) && i === 0) {
          html += `<p>${htmlEntities(node)}</p>`;
        } else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(node)) {
          html += `<img src="${htmlEntities(node)}" />`;
        } else {
          html += `<p>${htmlEntities(node)}</p>`;
        }
      }
    });
  }
  return html;
}

/**
 * Paste as Html.
 * @private
 * @param {ClipboardEvent} e The event
 * @returns {string|null} The updated pasted data
 */
export function handlePasteAsHtml(e?: ClipboardEvent): string | null {
  if (!e) return null;

  const clipboardData = e.clipboardData;
  let html: string | undefined;

  if (clipboardData?.types) {
    const types = clipboardData.types;
    if ((types instanceof DOMStringList && types.contains('text/html'))
      || (types.indexOf && types.indexOf('text/html') !== -1)) {
      html = e.clipboardData?.getData('text/html');
    }
    if (types instanceof DOMStringList && types.contains('text/plain')) {
      html = e.clipboardData?.getData('text/plain');
    }
    if ((typeof types === 'object' && types[0] === 'text/plain') && !types[1]) {
      html = e.clipboardData?.getData('text/plain');
    }
  } else {
    const paste = (<any>window).clipboardData ? (<any>window).clipboardData.getData('Text') : '';
    const nodes = paste.split(/[\r\n]/g);
    html = '';
    nodes.forEach((node: string, i: number) => {
      if (node !== '') {
        if (navigator.userAgent.match(/firefox/i) && i === 0) {
          html += `<p>${htmlEntities(node)}</p>`;
        } else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(node)) {
          html += `<img src="${htmlEntities(node)}" />`;
        } else {
          html += `<p>${htmlEntities(node)}</p>`;
        }
      }
    });
  }
  return html ? cleanHtml(html) : null;
}
