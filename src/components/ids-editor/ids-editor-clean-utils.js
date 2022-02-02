import { sanitizeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { BLOCK_ELEMENTS } from './ids-editor-shared';

/**
 * Check if given html is word format
 * @param {string} content The html
 * @returns {string} The cleaned html
 */
export function isWordFormat(content) {
  return (
    (/<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i)
      .test(content)
    || (/class="OutlineElement/).test(content)
    || (/id="?docs\-internal\-guid\-/.test(content)) // eslint-disable-line
  );
}

/**
 * Clean word format for given html
 * @param {string} content The html
 * @returns {string} The cleaned html
 */
export function cleanWordHtml(content) {
  let s = content;

  // Word comments like conditional comments etc
  s = s.replace(/<!--[\s\S]+?-->/gi, '');

  // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content,
  // MS Office namespaced tags, and a few other tags
  s = s.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, ''); // eslint-disable-line

  // Convert <s> into <strike> for line-though
  s = s.replace(/<(\/?)s>/gi, '<$1strike>');

  // Replace nbsp entites to char since it's easier to handle
  s = s.replace(/&nbsp;/gi, '\u00a0');

  // Convert <span style="mso-spacerun:yes"></span> to string of alternating
  // breaking/non-breaking spaces of same length
  s = s.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, (str, spaces) => ((spaces.length > 0) ? spaces.replace(/./, ' ').slice(Math.floor(spaces.length / 2)).split('').join('\u00a0') : ''));

  // Remove line breaks / Mso classes
  s = s.replace(/(\n|\r| class=(\'|")?Mso[a-zA-Z]+(\'|")?)/g, ' '); // eslint-disable-line

  // Remove everything in between and including "badTags"
  const badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];
  badTags.forEach((tag) => {
    s = s.replace(new RegExp(`<${tag}.*?${tag}(.*?)>`, 'gi'), '');
  });

  return s;
}

/**
 * Strip given styles
 * @private
 * @param {string} content The html
 * @param {RegExp} styleStripper The RegExp
 * @returns {string} The cleaned html
 */
export function stripStyles(content, styleStripper) {
  const stylesToKeep = ['color', 'font-size', 'background', 'font-weight', 'font-style', 'text-decoration', 'text-align'];
  return content.replace(styleStripper, (m) => {
    m = m.replace(/( style=|("|\'))/gi, ''); // eslint-disable-line
    const attrs = m.split(';');
    let strStyle = '';
    attrs.forEach((attr) => {
      const entry = attr.split(':');
      strStyle += (stylesToKeep.indexOf((entry[0] || '').trim()) > -1) ? `${entry[0]}:${entry[1]};` : '';
    });
    return (strStyle !== '') ? ` style="${strStyle}"` : '';
  });
}

/**
 * Strip given attribute
 * @private
 * @param {string} content The html
 * @param {string} attribute The attribute
 * @param {RegExp} attributeStripper The RegExp
 * @returns {string} The cleaned html
 */
export function stripAttribute(content, attribute, attributeStripper) {
  return (attribute === 'style')
    ? stripStyles(content, attributeStripper)
    : content.replace(attributeStripper, '');
}

/**
 * Convert html entities
 * @private
 * @param {string} str The html
 * @returns {string} The converted html
 */
export function htmlEntities(str) {
  // converts special characters (e.g., <) into their escaped/encoded values (e.g., &lt;).
  // This allows you to display the string without the browser reading it as HTML.
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Clean given html
 * @private
 * @param {string} content The html
 * @returns {string} The cleaned html
 */
export function cleanHtml(content) {
  let attributeStripper;
  let s = content || '';

  const badAttributes = [
    'start', 'xmlns', 'xmlns:o', 'xmlns:w', 'xmlns:x', 'xmlns:m',
    'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave',
    'onmousemove', 'onload', 'onfocus', 'onblur', 'onclick',
    'style'
  ];

  // Remove extra word formating
  if (isWordFormat(s)) {
    s = cleanWordHtml(s);
  }

  // Remove bad attributes
  badAttributes.forEach((attr) => {
    attributeStripper = new RegExp(` ${attr}="(.*?)"`, 'gi');
    s = stripAttribute(s, attr, attributeStripper);

    attributeStripper = new RegExp(` ${attr}='(.*?)'`, 'gi');
    s = stripAttribute(s, attr, attributeStripper);
  });

  // Remove "ng-" directives and "ng-" classes
  s = s.replace(/\sng-[a-z-]+/, '');

  // Remove comments
  s = s.replace(/<!--(.*?)-->/gm, '');

  // Remove extra spaces
  s = s.replace(/\s\s+/g, ' ').replace(/\s>+/g, '>');

  // Remove extra attributes from list elements
  s = s.replace(/<(ul)(.*?)>/gi, '<$1>');

  // Remove empty list
  s = s.replace(/<li><\/li>/gi, '');
  s = s.replace(/<(ul|ol)><\/(ul|ol)>/gi, '');

  // Remove html and body tags
  s = s.replace(/<\/?(html|body)(.*?)>/gi, '');

  // Remove header tag and content
  s = s.replace(/<head\b[^>]*>(.*?)<\/head>/gi, '');

  // Remove empty tags
  s = s.replace(/<(div|span|p)> <\/(div|span|p)>/gi, ' ');
  s = s.replace(/<[^(br|/>)]+>[\s]*<\/[^>]+>/gi, '');

  if (s.indexOf('·') > -1) {
    // Replace span and paragraph tags from bulleted list pasting
    s = s.replace(/<\/p>/gi, '</li>');
    s = s.replace(/<p><span><span>·<\/span><\/span>/gi, '<li>');
    // Remove white space
    s = s.replace(/<\/li>\s<li>/gi, '</li><li>');
    // Add in opening and closing ul tags
    s = [s.slice(0, s.indexOf('<li>')), '<ul>', s.slice(s.indexOf('<li>'))].join('');
    s = [s.slice(0, s.lastIndexOf('</li>')), '</ul>', s.slice(s.lastIndexOf('</li>'))].join('');
  }

  return s;
}

/**
 * Trim out the editor spaces for comparison.
 * @private
 * @param  {string} content The html.
 * @returns {string} The trimmed content.
 */
export function trimContent(content) {
  const bElems = BLOCK_ELEMENTS.join('|');
  return sanitizeHTML(content || '')
    .trim()
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/<br(\s?\/)?>/g, '<br>\n')
    .replace(new RegExp(`</(${bElems})>`, 'gi'), '</$1>\n\n')
    .replace(/\n\n$/, '\n')
    .replace(new RegExp(`<(${bElems})><br>\\n</(${bElems})>\\n`, 'gi'), '');
}
