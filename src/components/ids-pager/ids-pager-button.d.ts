export default class IdsPagerButton extends HTMLElement {
  /** A 1-based page number displayed; managed by parent ids-pager */
  pageNumber: number;

  /**
   * The number of items shown per page; managed by parent ids-pager
   */
  pageSize: number;

  /** The number of items to track; managed by parent ids-pager */
  total: number;

  /** Whether or not the button has an overriding disable state applied */
  disabled: boolean;

  /** Whether or not the pager overall is disabled; managed by parent ids-pager */
  parentDisabled: boolean;

  /** Whether or not the button is disabled based on current navigation and flag */
  navDisabled: boolean;
}
