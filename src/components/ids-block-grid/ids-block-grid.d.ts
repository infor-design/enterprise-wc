export default class IdsBlockGrid extends HTMLElement {
  /** Set the block alignment */
  align: 'center' | 'left' | 'right';

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
