/**
 * Remove console methods
 * @private
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
export function sanitizeConsoleMethods(html: string | any) {
  const methods = ['assert', 'clear', 'count', 'debug', 'dirxml', 'dir', 'error', 'exception', 'groupCollapsed', 'groupEnd', 'group', 'info', 'log', 'markTimeline', 'profileEnd', 'profile', 'table', 'timeEnd', 'timeStamp', 'time', 'trace', 'warn'];
  const expr = new RegExp(`console\\.(${methods.join('|')})((\\s+)?\\(([^)]+)\\);?)?`, 'igm');

  return typeof html !== 'string' ? html : html.replace(expr, '');
}

/**
 * Remove Script tags and all onXXX functions
 * @private
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
export function sanitizeHTML(html: string) {
  let santizedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
  santizedHtml = santizedHtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  santizedHtml = santizedHtml.replace(/<iframe\b[^<]*(?:(?!>)<[^<]*)*>/gi, '');
  santizedHtml = santizedHtml.replace(/<[^>]+/g, (match) => {
    const expr = /(\/|\s)on\w+=('|")?/g;
    let str = match;
    if ((str.match(expr) || []).length > 0) {
      str = str.replace(/(\/|\s)title=('|")(.*)('|")/g, (m) => {
        if ((m.match(expr) || []).length > 0) {
          return m.replace(expr, (m2) => m2.replace('on', ''));
        }
        return m;
      });
    }
    return str.replace(/(\/|\s)on\w+=('|")?[^"]*('|")?/g, '');
  });

  // Remove console methods
  santizedHtml = sanitizeConsoleMethods(santizedHtml);

  // Remove nested script tags
  santizedHtml = santizedHtml.replace(/<\/script>/g, '');

  return santizedHtml;
}

/**
 * Takes a string and removes all html tags
 * @param {string} str The string to parse
 * @returns {string} The string minus html tags.
 */
export function stripHTML(str: string) {
  let newStr = str;
  if (!newStr) {
    return '';
  }

  newStr = newStr.replace(/<\/?[^>]+(>|$)/g, '');
  return newStr;
}

/**
 * Remove all html tags except for the ones specified.
 * For example: White list to a specific set of accepted tags.
 * @param {string | number} html HTML in string form
 * @param {string} allowed Comma seperated string of allowed tags e.g. '<b><i><p>''
 * @returns {string} the modified value
 */
export function stripTags(html: string | number, allowed?: string) {
  if (!html) {
    return '';
  }

  if (typeof html === 'number') {
    return html;
  }

  const allowList = ((`${allowed || ''}`)
    .toLowerCase()
    .match(/<[a-z][a-z0-9|ids\-a-z]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c><ids-abc>)

  const tags = /<\/?([a-z][a-z0-9|ids\-a-z]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  let returnHTML = '';
  returnHTML = html.replace(commentsAndPhpTags, '')
    .replace(tags, ($0, $1) => allowList.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''); //eslint-disable-line
  returnHTML = returnHTML.replace(tags, ($0, $1) => allowList.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''); //eslint-disable-line

  return returnHTML;
}

/**
 * Un-escapes HTML, replacing encoded symbols with special characters.
 * Symbols taken from https://bit.ly/1iVkGlc
 * @private
 * @param {string} value HTML in string form
 * @returns {string} the modified value
 */
export function unescapeHTML(value: any) {
  if (value === '') {
    return '';
  }

  if (typeof value === 'string') {
    const match = (regx: any) => (value as any).match(regx)[0];
    const doc = new DOMParser().parseFromString(value, 'text/html');

    // Keep leading/trailing spaces
    return `${match(/^\s*/)}${(doc.documentElement as any).textContent.trim()}${match(/\s*$/)}`;
  }
  return value;
}

/**
 * Escapes HTML, replacing special characters with encoded symbols.
 * Symbols taken from https://bit.ly/1iVkGlc
 * @private
 * @param {string} unsafe HTML in string form
 * @returns {string} the modified value
 */
export function escapeHTML(unsafe?: string) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\\/g, '&bsol;');
}
