import Base from './ids-tabs-base';

export default class IdsTabs extends Base {
  /** A theming variant to the ids-tabs which also applies to each ids-tab */
  colorVariant? : 'alternate';

  /** The direction the tabs will be laid out in; defaults to `horizontal`. */
  orientation? : 'horizontal' | 'vertical';

  /**
   * A value which represents a currently selected tab; at any time,
   * should match one of the child ids-tab `value` attributes set for
   * a valid selection.
   */
  value: string;
}
