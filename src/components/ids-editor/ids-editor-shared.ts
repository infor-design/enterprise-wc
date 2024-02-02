import { attributes } from '../../core/ids-attributes';
import { IdsLabelStateAttributes } from '../../mixins/ids-label-state-mixin/ids-label-state-common';

export interface EditorAction {
  action: string;
  keyid?: string;
  value?: string;
}

// List of view modes
export const VIEWS = ['editor', 'source'];

// List of paragraph separators
export const PARAGRAPH_SEPARATORS = ['p', 'div', 'br'];

// List of headers
export const HEADERS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// List of block elements
export const BLOCK_ELEMENTS = [...HEADERS, 'p', 'div', 'blockquote', 'pre'];

// List of font size
export const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7'];

// Css classes used most in editor
export const CLASSES = { hidden: 'hidden', labelRequired: 'no-required-indicator' };

// Collection of Text Format actions
export const TEXT_FORMAT_ACTIONS = BLOCK_ELEMENTS.reduce((actions, blockAction: string) => {
  actions[blockAction] = {
    action: 'formatBlock',
    value: blockAction,
    keyid: HEADERS.includes(blockAction)
      ? `Digit${blockAction.replace('h', '')}|alt`
      : undefined
  };
  return actions;
}, {} as Record<string, EditorAction>);

// Collection of Font Size actions
export const FONT_SIZE_ACTIONS = FONT_SIZES.reduce((actions, fontSize: string) => {
  actions[fontSize] = {
    action: 'fontSize',
    value: fontSize
  };
  return actions;
}, {} as Record<string, EditorAction>);

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
      url: '',
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
  ...IdsLabelStateAttributes,
  attributes.DISABLED,
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
 * @returns {any} First matched selector element.
 */
export function qs(s: string, root: ShadowRoot | HTMLElement | null): any {
  return root?.querySelector(s);
}

/**
 * Query selector all in shadow root or given element.
 * @param {string} s The selector.
 * @param {ShadowRoot|HTMLElement} root The root element.
 * @returns {Array<any>} List of elements that matched.
 */
export function qsAll(s: string, root: ShadowRoot | HTMLElement | null): Array<any> {
  return Array.from(root?.querySelectorAll(s) ?? []);
}

/**
 * Convert rgb to hex color value.
 * @param {string} rgb The rgb value
 * @returns {string} the hex value
 */
export function rgbToHex(rgb: string): string {
  const arrayRgb = rgb.split('(')[1].split(')')[0].split(',');
  const hex = arrayRgb.map((item) => {
    const x = parseInt(item).toString(16);
    return (x.length === 1) ? `0${x}` : x;
  }).join('');
  return `#${hex}`;
}
