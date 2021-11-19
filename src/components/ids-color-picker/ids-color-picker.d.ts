import Base from './ids-color-picker-base';

export default class IdsColorPicker extends Base {
  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the value */
  value: '#000000' | string;

  /** Sets the advanced fr a */
  advanced: 'true' | 'false' | boolean;

  /** Set the label */
  label: 'Ids Color Picker' | string;
}
