export default class IdsCard extends HTMLElement {
  /** Set the card height */
  autoHeight: boolean;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
