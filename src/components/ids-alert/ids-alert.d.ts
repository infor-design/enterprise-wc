export default class IdsAlert extends HTMLElement {
  /* Types of alert */
  type: 'warning' | 'success' | 'dirty' | 'error' | 'info' | 'pending' | 'new' | 'in-progress' | 'info-field';

  /* Set the disabled */
  disabled: boolean | string | null;

  /* Set the icon */
  icon: string | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
