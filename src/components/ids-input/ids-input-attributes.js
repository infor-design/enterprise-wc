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

// Setting defaults text-align
const TEXT_ALIGN = {
  default: 'left',
  left: 'left',
  center: 'center',
  right: 'right'
};

const instanceCounter = 0;

export {
  TYPES,
  SIZES,
  TEXT_ALIGN,
  instanceCounter
};
