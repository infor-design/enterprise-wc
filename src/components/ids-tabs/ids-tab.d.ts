import { IdsElement } from '../../core';

export default class IdsTab extends IdsElement {
  /**
   * A theming variant which was applied by the parent ids-tab;
   * not meant to be overriden
   */
  colorVariant? : 'alternate';

  /** Indicates the number of items represented in the tab (optional). */
  count?: number;

  /**
   * The orientation of the ids-tabs; this is applied by the parent ids-tab and
   * not meant to be overridden.
   */
  orientation? : 'horizontal' | 'vertical';

  /** Whether or not this tab is selected. */
  selected: boolean;

  /**
   * A value which represents a currently selected tab; at any time,
   * should match one of the child ids-tab `value` attributes set for
   * a valid selection.
   */
  value: string;
}
