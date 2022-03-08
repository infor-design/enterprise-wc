export default class IdsSwitch extends HTMLElement {
  /** Sets the checked state to true or false */
  checked: boolean;

  /** Sets checkbox to disabled * */
  disabled: boolean;

  /** Sets the checkbox label text * */
  label: string;

  /** Sets the checkbox label font size (rarely used) * */
  labelFontSize: 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72 | string | number;

  /** Sets the checkbox `value` attribute * */
  value: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
