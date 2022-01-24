export default class IdsAlert extends HTMLElement {
  /* Types of alert */
  icon: 'alert' | 'success' | 'dirty' | 'error' | 'info' |
    'pending' | 'new' | 'in-progress' | 'info-field';

  /* Set alert to disabled */
  disabled: boolean | string | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;
}
