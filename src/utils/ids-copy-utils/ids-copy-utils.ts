/**
 * Copies a HTML section to the clipboard
 * @param {string} html element to copy
 * @returns {void}
 */
export async function copyHtmlToClipboard(html: string) {
  await navigator.clipboard.writeText(html.trim());
}
