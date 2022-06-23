// Types
const TYPES: any = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  phone: 'tel',
  email: 'email',
  color: 'color'
};

// Setting defaults sizes
const SIZES: any = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  mm: 'mm',
  md: 'md',
  lg: 'lg',
  full: 'full'
};

// Setting defaults text-align
const TEXT_ALIGN: any = {
  default: 'start',
  start: 'start',
  center: 'center',
  end: 'end'
};

const instanceCounter = 0;

export {
  TYPES,
  SIZES,
  TEXT_ALIGN,
  instanceCounter
};
