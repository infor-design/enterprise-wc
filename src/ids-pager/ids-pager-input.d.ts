import { IdsElement } from '../ids-base';

export default class IdsPagerInput extends IdsElement {
  /** Whether or not the input has an overriding disable state applied */
  disabled: boolean;

  /** A 1-based page number displayed; managed by parent ids-pager */
  pageNumber: number;

  /**
   * The number of items shown per page; managed by parent ids-pager
   */
  pageSize: number;

  /** Whether or not the pager overall is disabled; managed by parent ids-pager */
  parentDisabled: boolean;

  /** The number of items to track; managed by parent ids-pager */
  total: number;
}
