/**
 * Remove console methods
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
export function sanitizeConsoleMethods(html: string | any) {
  const methods = ['assert', 'clear', 'count', 'debug', 'dirxml', 'dir', 'error', 'exception', 'groupCollapsed', 'groupEnd', 'group', 'info', 'log', 'markTimeline', 'profileEnd', 'profile', 'table', 'timeEnd', 'timeStamp', 'time', 'trace', 'warn'];
  const expr = new RegExp(`console\\.(${methods.join('|')})((\\s+)?\\(([^)]+)\\);?)?`, 'igm');

  return typeof html !== 'string' ? html : html.replace(expr, '');
}

/**
 * Removes Script Tags
 * @param {string} str HTML in string form
 * @returns {string} the modified value
 */
export function removeScriptTags(str: string) {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
}

/**
 * Remove Script tags and all onXXX functions
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
export function sanitizeHTML(html: string) {
  let santizedHtml = removeScriptTags(html);
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
  if (!str) return '';

  let newStr = str;
  if (typeof newStr === 'number') newStr = `${newStr}`;

  newStr = removeScriptTags(newStr);
  return newStr.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Remove all html tags except for the ones specified.
 * For example: White list to a specific set of accepted tags.
 * @param {string | number} html HTML in string form
 * @param {string} allowed Comma seperated string of allowed tags e.g. '<b><i><p>''
 * @returns {string} the modified value
 */
export function stripTags(html: string | number, allowed = ''): string {
  if (!html) return '';
  if (typeof html === 'number') return `${html}`;

  const allowList = (`${allowed}`
    .toLowerCase()
    .match(/<[a-z][a-z0-9|ids\-a-z]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c><ids-abc>)

  const tags = /<\/?([a-z][a-z0-9|ids\-a-z]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  const replacer = ($0: string, $1: string) => {
    const contents = allowList.indexOf(`<${$1.toLowerCase()}>`);
    if (contents > -1) return $0;
    return '';
  };

  return html
    .replace(commentsAndPhpTags, '')
    .replace(tags, replacer)
    .replace(tags, replacer);
}

/**
 * Un-escapes HTML, replacing encoded symbols with special characters.
 * Symbols taken from https://bit.ly/1iVkGlc
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
