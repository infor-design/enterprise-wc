// Types
const TYPES = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  email: 'email',
  color: 'color'
};

// Setting defaults sizes
const SIZES = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  mm: 'mm',
  md: 'md',
  lg: 'lg',
  full: 'full'
};

// Setting defaults field-heights
const FIELD_HEIGHTS = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
};

// Setting defaults text-align
const TEXT_ALIGN = {
  default: 'left',
  left: 'left',
  center: 'center',
  right: 'right'
};

let instanceCounter = 0;

export { TYPES, SIZES, FIELD_HEIGHTS, TEXT_ALIGN, instanceCounter };
