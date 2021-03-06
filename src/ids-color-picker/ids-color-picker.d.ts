export default class IdsColorPicker extends HTMLElement {
  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the value */
  value: '#000000' | string;

  /** Sets the swatch */
  swatch: 'true' | 'false' | boolean;

  /** Set the label */
  label: 'Ids Color Picker' | string;
}
