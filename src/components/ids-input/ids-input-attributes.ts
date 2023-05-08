// Interface
export interface IdsInputInterface {
  input?: any;
  value?: any;
  checked?: any;
  fieldContainer?: HTMLElement | SVGElement | null;
  labelEl?: HTMLLabelElement | null;
}

// Types
const TYPES = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  phone: 'tel',
  email: 'email',
  color: 'color'
} as const;

type TypeKeys = keyof typeof TYPES;

type TypeValues = typeof TYPES[TypeKeys];

// Setting defaults sizes
const SIZES = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  mm: 'mm',
  md: 'md',
  lg: 'lg',
  full: 'full'
} as const;

type SizeKeys = keyof typeof SIZES;

type SizeValues = typeof SIZES[SizeKeys];

// Setting defaults text-align
const TEXT_ALIGN = {
  default: 'start',
  start: 'start',
  center: 'center',
  end: 'end'
};

const LABEL_WRAPS = ['ellipsis', 'wrap', 'ellipsis-no-stretch', 'wrap-no-stretch'];

const instanceCounter = 0;

export {
  LABEL_WRAPS,
  TYPES,
  TypeKeys,
  TypeValues,
  SIZES,
  SizeKeys,
  SizeValues,
  TEXT_ALIGN,
  instanceCounter
};
