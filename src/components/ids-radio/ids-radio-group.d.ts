import Base from './ids-radio-group-base';

export default class IdsRadioGroup extends Base {
  /** Sets the dirty tracking feature on to indicate a changed field */
  dirtyTracker: boolean;

  /** Sets checkbox to disabled * */
  disabled: boolean;

  /** Flips the checkbox orientation to horizontal * */
  horizontal: boolean;

  /** Sets the checkbox label text * */
  label: string;

  /** Sets the checkbox label font size (rarely used) * */
  labelFontSize: 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72 |
    'xs' | 'sm ' | 'lg' | 'xl' | string | number;

  /** Sets the checkbox to required * */
  labelRequired: boolean;

  /** Sets the validation check to use * */
  validate: 'required' | string;

  /** Sets which events to fire validation on * */
  validationEvents: 'change' | string;

  /** Sets the checkbox `value` attribute * */
  value: string;
}
