/**
 * Format given string to proper indentation.
 * @param {string} html true will force to toggle in to source mode.
 * @returns {string} formated value
 */
export function formatHtml(html) {
  html = html.trim();
  const tokens = html.split(/</);
  let indentLevel = 0;
  let result = '';

  const getIndent = (level) => {
    const tabsize = 4;
    let indentation = '';
    let i = level * tabsize;
    if (level > -1) {
      while (i--) {
        indentation += ' ';
      }
    }
    return indentation;
  };

  for (let i = 0, l = tokens.length; i < l; i++) {
    const parts = tokens[i].split(/>/);

    if (parts.length === 2) {
      if (tokens[i][0] === '/') {
        indentLevel--;
      }
      result += getIndent(indentLevel);
      if (tokens[i][0] !== '/') {
        indentLevel++;
      }
      if (i > 0) {
        result += '<';
      }
      result += `${parts[0].trim()}>\n`;
      if (parts[1].trim() !== '') {
        result += `${getIndent(indentLevel) + parts[1].trim().replace(/\s+/g, ' ')}\n`;
      }
      if (parts[0].match(/^(area|base|br|col|command|embed|hr|img|input|link|meta|param|source)/)) {
        indentLevel--;
      }
    } else {
      result += `${getIndent(indentLevel) + parts[0]}\n`;
    }
  }
  return result.trim();
}
