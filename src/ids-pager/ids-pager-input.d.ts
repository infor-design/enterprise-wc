import { IdsElement } from '../ids-base';

export default class IdsPagerInput extends IdsElement {
  /** whether or not the input has an overriding disable state applied */
  disabled: boolean;

  /** 1-based page number displayed; managed by parent ids-pager */
  pageNumber: number;

  /**
   * number of items shown per-page; managed by parent ids-pager
   */
  pageSize: number;

  /** whether or not the pager overall is disabled; managed by parent ids-pager */
  parentDisabled: boolean;

  /** number of items to track; managed by parent ids-pager */
  total: number;
}
