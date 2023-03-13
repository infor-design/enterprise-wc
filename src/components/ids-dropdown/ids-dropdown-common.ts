import { attributes } from '../../core/ids-attributes';

export type IdsDropdownOption = {
  id?: string,
  label: string,
  value: string,
  icon?: string,
  groupLabel?: boolean,
  // ids-multiselect shared
  selected?: boolean,
  index?: number
};

export type IdsDropdownOptions = Array<IdsDropdownOption>;

export const IdsDropdownCommonAttributes = [
  attributes.ALLOW_BLANK,
  attributes.CLEARABLE,
  attributes.CLEARABLE_TEXT,
  attributes.DISABLED,
  attributes.GROUP,
  attributes.GROUP_LABEL,
  attributes.LIST,
  attributes.NO_MARGINS,
  attributes.PLACEHOLDER,
  attributes.READONLY,
  attributes.SHOW_LOADING_INDICATOR,
  attributes.SIZE,
  attributes.TYPEAHEAD,
  attributes.VALUE
];
