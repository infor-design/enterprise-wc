import { IdsElement } from '../ids-base';

type IdsValidationErrorMessageTypes = {
  /** The unique id in the check messages */
  id: string;

  /** The Type of message and icon */
  type: 'error' | 'info' | 'alert' | 'warn';

  /** The localized message text */
  message: string;

  /** The Type of message icon */
  icon: string;
}

type IdsValidationTypes = {
  /** Add a message to the input */
  addMessage(settings: IdsValidationErrorMessageTypes);

  /** Remove a message(s) from the input */
  removeMessage(settings: IdsValidationErrorMessageTypes);
};

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

  /** flags the spinbox value as non-interactive/presentational */
  readonly?: boolean | string;

  IdsValidationTypes;
}
