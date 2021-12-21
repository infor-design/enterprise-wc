export default class IdsCard extends HTMLElement {
  /** Set the card height */
  autoHeight: boolean;

  /** Set the selection type */
  cardSelection: 'single' | 'multiple' | string;

  /** Set the selected status type */
  cardSelected: 'true' | 'false' | boolean;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
