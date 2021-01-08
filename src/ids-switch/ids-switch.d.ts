// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class IdsSwitch extends HTMLElement {
  /** Sets the checked state to true or false */
  checked: boolean;
  /** Sets checkbox to disabled **/
  disabled: boolean;
  /** Sets the checkbox label text **/
  label: string;
  /** Sets the checkbox label font size (rarely used) **/
  labelFontSize: 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72 | 'xs' | 'sm ' | 'lg' | 'xl' | string | number;
  /** Sets the checkbox `value` attribute **/
  value: string;
}
