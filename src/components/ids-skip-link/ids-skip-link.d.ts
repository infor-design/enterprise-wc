export default class IdsSkipLink extends HTMLElement {
  /** Set the links href */
  href: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
