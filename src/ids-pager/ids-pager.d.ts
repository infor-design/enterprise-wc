import { IdsElement } from '../ids-base';

export default class IdsPager extends IdsElement {
  /** 1-based page number displayed */
  pageNumber: string|number;

  /**
   * number of items shown per-page
   */
  pageSize: string|number;

  /** number of items to track */
  total: string|number;
}
