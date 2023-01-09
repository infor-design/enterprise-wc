import { attributes } from '../../core/ids-attributes';

export type IdsButtonIconAlignment = undefined | 'start' | 'end';

export type IdsButtonType = 'default' | 'primary' | 'secondary' | 'tertiary' | 'primary-destructive' | 'tertiary-destructive' | 'swipe-action-right' | 'swipe-action-left';

// Button Styles
export const BUTTON_TYPES: Array<IdsButtonType> = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'primary-destructive',
  'tertiary-destructive',
  'swipe-action-left',
  'swipe-action-right'
];

// Default Button state values
export const BUTTON_DEFAULTS: any = {
  cssClass: [],
  disabled: false,
  hidden: false,
  tabIndex: 0,
  iconAlign: undefined,
  type: BUTTON_TYPES[0]
};

// Definable attributes
export const BUTTON_ATTRIBUTES: string[] = [
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
