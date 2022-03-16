import { attributes } from '../../core/ids-attributes';

// List of view modes
export const VIEWS = ['editor', 'source'];

// List of paragraph separators
export const PARAGRAPH_SEPARATORS = ['p', 'div', 'br'];

// List of block elements
export const BLOCK_ELEMENTS = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];

// List of font size
export const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7'];

// Css classes used most in editor
export const CLASSES = { hidden: 'hidden', labelRequired: 'no-required-indicator' };

// List of defaults
export const EDITOR_DEFAULTS = {
  disabled: false,
  label: 'Ids editor',
  labelHidden: false,
  labelRequired: true,
  modals: {
    hyperlink: {
      url: 'http://www.example.com',
      classes: 'hyperlink',
      targets: [
        { text: 'Same Window', value: '' },
        { text: 'New Window', value: '_blank', selected: true }
      ],
      // Clickable hyperlink in editor
      isClickable: false,
      showIsClickable: true
    },
    insertimage: {
      url: '../assets/images/placeholder-154x120.png',
      alt: ''
    }
  },
  paragraphSeparator: 'p',
  pasteAsPlainText: false,
  readonly: false,
  sourceFormatter: false,
  view: 'editor', // 'editor', 'source'
};

// Definable attributes
export const EDITOR_ATTRIBUTES = [
  attributes.DISABLED,
  attributes.LABEL,
  attributes.LABEL_HIDDEN,
  attributes.LABEL_REQUIRED,
  attributes.PARAGRAPH_SEPARATOR,
  attributes.PASTE_AS_PLAIN_TEXT,
  attributes.PLACEHOLDER,
  attributes.READONLY,
  attributes.SOURCE_FORMATTER,
  attributes.VIEW
];

/**
 * Query selector in shadow root or given element.
 * @param {string} s The selector.
 * @param {ShadowRoot|HTMLElement} root The root element.
 * @returns {HTMLElement|null} First matched selector element.
 */
export function qs(s, root) {
  return root?.querySelector(s);
}

/**
 * Query selector all in shadow root or given element.
 * @param {string} s The selector.
 * @param {ShadowRoot|HTMLElement} root The root element.
 * @returns {Array<NodeList>} List of elements that matched.
 */
export function qsAll(s, root) {
  return Array.from(root?.querySelectorAll(s));
}

/**
 * Convert rgb to hex color value.
 * @param {string} rgb The rgb value
 * @returns {string} the hex value
 */
export function rgbToHex(rgb) {
  const arrayRgb = rgb.split('(')[1].split(')')[0].split(',');
  const hex = arrayRgb.map((item) => {
    const x = parseInt(item).toString(16);
    return (x.length === 1) ? `0${x}` : x;
  }).join('');
  return `#${hex}`;
}
