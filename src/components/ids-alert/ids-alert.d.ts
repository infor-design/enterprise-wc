import Base from './ids-alert-base';

export default class IdsAlert extends Base {
  /* Types of alert */
  type: 'alert' | 'success' | 'dirty' | 'error' | 'info' |
    'pending' | 'new' | 'in-progress' | 'info-field';

  /* Set the disabled */
  disabled: boolean | string | null;

  /* Set the icon */
  icon: string | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
