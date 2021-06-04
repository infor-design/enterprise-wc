import { IdsElement } from '../ids-base';

export default class IdsPager extends IdsElement {
  /** 0-based page index */
  pageIndex: string|number;

  /**
   * number of items shown per-page
   */
  pageItemCount: string|number;

  /** number of items to track */
  count: string|number;
}
