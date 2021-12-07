import Base from './ids-separator-base';

export default class IdsSeparator extends Base {
  /* Set the variants theme styles */
  colorVariant?: 'alternate-formatter';

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
