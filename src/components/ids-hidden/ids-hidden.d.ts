import Base from './ids-hidden-base';

export default class extends Base {
  /** Sets the min width breakpoint that should hide the element */
  hideUp?: string | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

  /** Sets the max width breakpoint that should hide the element */
  hideDown?: string | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

  /** True if the Action sheet should be displayed */
  visible?: boolean;
}
