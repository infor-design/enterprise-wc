import { IdsElement } from '../ids-base';

export default class IdsPagerButton extends IdsElement {
  /** 1-based page number displayed; managed by parent ids-pager */
  pageNumber: number;

  /**
   * number of items shown per-page; managed by parent ids-pager
   */
  pageSize: number;

  /** number of items to track; managed by parent ids-pager */
  total: number;

  /** whether or not the button has an overriding disable state applied */
  disabled: boolean;

  /** whether or not the pager overall is disabled; managed by parent ids-pager */
  parentDisabled: boolean;

  /** whether or not the button is disabled based on current navigation and flag */
  navDisabled: boolean;
}
