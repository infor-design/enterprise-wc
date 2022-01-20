export default class IdsBadge extends HTMLElement {
  /* Set the shape of the badge */
  shape: 'normal' | 'round';

  /* Set the color of the badge */
  color: 'success' | 'info' | 'warning' | 'error' | string | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
