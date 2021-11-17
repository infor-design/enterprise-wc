import Base from './ids-search-field-base';

export default class IdsSearchField extends Base {
  /** Sets the main label */
  label: string;

  /** Sets the current value */
  value: string;

  /** Sets the placeholder */
  placeholder: string;

  /** Sets the disabled status */
  disabled: boolean;

  /** Sets the readonly status */
  readonly: boolean;
}
