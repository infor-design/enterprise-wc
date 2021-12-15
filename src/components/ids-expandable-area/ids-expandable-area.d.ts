export default class extends HTMLElement {
  /** Set the expanded state */
  expanded: string;

  /** Set the type of expander to toggle-btn or not and future types */
  type: null | 'toggle-btn' | string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
