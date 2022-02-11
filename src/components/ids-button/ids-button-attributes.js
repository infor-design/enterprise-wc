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
const BUTTON_DEFAULTS = {
  cssClass: [],
  disabled: false,
  hidden: false,
  tabIndex: true,
  type: BUTTON_TYPES[0]
};

// Definable attributes
const BUTTON_ATTRIBUTES = [
  attributes.CSS_CLASS,
  attributes.COLOR_VARIANT,
  attributes.DISABLED,
  attributes.HIDDEN,
  attributes.ICON,
  attributes.ICON_ALIGN,
  attributes.ID,
  attributes.NO_PADDING,
  attributes.NO_MARGINS,
  attributes.NO_RIPPLE,
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
