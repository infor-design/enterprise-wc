type IdsSearchFieldSearchResult = undefined | string | number | HTMLElement;

export default class IdsSearchField extends HTMLElement {
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

  /** user-defined search method that performs an external operation to get search results */
  onSearch?(val: string): Array<IdsSearchFieldSearchResult>;

  /** programmatically performs a search and sets the search field value */
  search(val: string): Array<IdsSearchFieldSearchResult>;
}
