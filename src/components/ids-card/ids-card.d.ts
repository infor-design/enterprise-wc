export default class IdsCard extends HTMLElement {
  /** Set the card height */
  autoHeight: boolean;

  /** Set the selection type */
  selection: 'single' | 'multiple' | string;

  /** Set the selected status type */
  selected: 'true' | 'false' | boolean;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
