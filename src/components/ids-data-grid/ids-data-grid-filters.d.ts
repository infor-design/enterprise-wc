export default class IdsDataGridFilters {
  /** List of filter wrapper elements */
  readonly filterNodes: Array<HTMLElement>;

  /** Get text filter markup */
  text(column: object): string;

  /** Get integer filter markup */
  integer(column: object): string;

  /** Get decimal filter markup */
  decimal(column: object): string;

  /** Get contents filter markup */
  contents(column: object): string;

  /** Get dropdown filter markup */
  dropdown(column: object): string;

  /** Get checkbox filter markup */
  checkbox(column: object): string;

  /** Get date filter markup */
  date(column: object): string;

  /** Get time filter markup */
  time(column: object): string;

  /** Get markup for a header cell filter */
  filterTemplate(column: object): string;

  /** Get filter wrapper element for given column id */
  filterWrapperById(columnId: string): HTMLElement;

  /** Reset all filters as initial state */
  resetFilters(): void;

  /** Filter data rows based on given conditions */
  applyFilter(conditions?: Array<unknown>): void;

  /** Set disabled filter row */
  setFilterRowDisabled(): void;
}
