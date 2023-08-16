import { attributes } from '../../core/ids-attributes';

export type IdsButtonContentAlignment = 'default' | 'start' | 'end';

export type IdsButtonIconAlignment = undefined | 'start' | 'end';

export type IdsButtonAppearance = 'default' | 'primary' | 'secondary' | 'tertiary' | 'primary-destructive' | 'tertiary-destructive' | 'swipe-action-right' | 'swipe-action-left';

// Button Appearance types
export const BUTTON_APPEARANCE: Array<IdsButtonAppearance> = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'primary-destructive',
  'tertiary-destructive',
  'swipe-action-left',
  'swipe-action-right'
];

export const BUTTON_CONTENT_ALIGNMENTS: Array<IdsButtonContentAlignment> = [
  'default',
  'start',
  'end'
];

export type IdsButtonType = HTMLButtonElement['type'];

// HTMLButtonElement types
export const BUTTON_TYPES: Array<string> = [
  'button', 'submit', 'reset', 'menu'
];

// Default Button state values
export const BUTTON_DEFAULTS: any = {
  contentAlign: BUTTON_CONTENT_ALIGNMENTS[0],
  cssClass: [],
  disabled: false,
  hidden: false,
  tabIndex: 0,
  iconAlign: undefined,
  appearance: BUTTON_APPEARANCE[0]
};

// Definable attributes
export const BUTTON_ATTRIBUTES: string[] = [
  attributes.APPEARANCE,
  attributes.CONTENT_ALIGN,
  attributes.CSS_CLASS,
  attributes.DISABLED,
  attributes.HIDDEN,
  attributes.ICON,
  attributes.ICON_ALIGN,
  attributes.ID,
  attributes.NO_PADDING,
  attributes.NO_MARGINS,
  attributes.SQUARE,
  attributes.TEXT,
  attributes.TYPE,
  attributes.TABINDEX,
  attributes.WIDTH
];

// Icon alignment CSS class names
export const ICON_ALIGN_CLASSNAMES = [
  'align-icon-start',
  'align-icon-end'
];

// IdsButton CSS classes representing button types
export const baseProtoClasses = [
  'ids-button',
  'ids-icon-button',
  'ids-menu-button',
  'ids-toggle-button'
];
