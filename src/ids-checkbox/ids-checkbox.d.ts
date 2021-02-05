// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsCheckbox extends HTMLElement {
  /** Sets the checked state to true or false */
  checked: boolean;

  /** Sets the checkbox color to one of the colors in our color palette for example emerald07 */
  color: string;

  /** Sets the dirty tracking feature on to indicate a changed field */
  dirtyTracker: boolean;

  /** Sets checkbox to disabled * */
  disabled: boolean;

  /** Flips the checkbox orientation to horizontal * */
  horizontal: boolean;

  /** Sets the checkbox to the indeterminate state * */
  indeterminate: boolean;

  /** Sets the checkbox label text * */
  label: string;

  /** Sets the checkbox to required * */
  labelRequired: boolean;

  /** Sets the validation check to use * */
  validate: 'required' | string;

  /** Sets which events to fire validation on * */
  validationEvents: 'change' | string;

  /** Sets the checkbox `value` attribute * */
  value: string;
}
