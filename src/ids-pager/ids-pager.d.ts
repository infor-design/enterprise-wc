import { IdsElement } from '../ids-base';

export default class IdsPager extends IdsElement {
  /** 1-based page number displayed */
  pageNumber: number;

  /**
   * number of items shown per-page
   */
  pageSize: number;

  /** number of items to track */
  total: number;

  /** whether or not the pager and subcomponents are disabled */
  disabled: boolean;
}
