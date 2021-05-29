import { IdsElement } from '../ids-base';

export default class IdsSpinbox extends IdsElement {
  /**
   * the maximum value the spinbox' input can be set to
   */
  max: number | string;

  /**
   * the minimum value the spinbox' input can be set to
   */
  min: number | string;

  /** spinbox' current input value */
  value: number | string;

  /** hint shown when a user has cleared the spinbox value */
  placeholder?: string;

  /** label text describing the spinbox value */
  label: string;

  /** whether the dirty tracker has been enabled */
  dirtyTracker: boolean | string;

  /** whether or not content is interactive */
  disabled: boolean | string;

  /** validation message text; set to `required` to require validation. */
  validate?: string;
}
