import Base from './ids-count-base';

export default class IdsCounts extends Base {
  /** Set the tag type/color */
  color: 'base' | 'caution' | 'danger' | 'success' | 'warning' | string;

  /** Sets the value size at 32 when true (instead of 40) */
  compact?: 'true' | 'false' | boolean;

  /** Sets the href/link */
  href?: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
