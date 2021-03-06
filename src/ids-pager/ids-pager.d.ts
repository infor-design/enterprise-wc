import { IdsElement } from '../ids-base';

export default class IdsPager extends IdsElement {
  /** A 1-based page number displayed */
  pageNumber: number;

  /**
   * The number of items shown per page
   */
  pageSize: number;

  /** The number of items to track */
  total: number;

  /** Whether or not the pager and subcomponents are disabled */
  disabled: boolean;
}
