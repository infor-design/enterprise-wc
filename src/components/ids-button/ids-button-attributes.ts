import { attributes } from '../../core/ids-attributes';

// Button Styles
const BUTTON_TYPES = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'destructive',
  'swipe-action-left',
  'swipe-action-right'
];

// Default Button state values
const BUTTON_DEFAULTS: any = {
  cssClass: [],
  disabled: false,
  hidden: false,
  tabIndex: 0,
  iconAlign: 'start',
  type: BUTTON_TYPES[0]
};

// Definable attributes
const BUTTON_ATTRIBUTES: string[] = [
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

// Icon alignments
const ICON_ALIGN = [
  'align-icon-start',
  'align-icon-end'
];

const baseProtoClasses = [
  'ids-button',
  'ids-icon-button',
  'ids-menu-button',
  'ids-toggle-button'
];

export {
  BUTTON_TYPES, BUTTON_DEFAULTS, BUTTON_ATTRIBUTES, ICON_ALIGN, baseProtoClasses
};
