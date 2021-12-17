export default class IdsListView extends HTMLElement {
  /** Enabled virtual scrolling */
  virtualScroll: boolean;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the internal list template */
  itemTemplate: (item: unknown) => string | string;

  /** Attach a DataSet and render */
  data: Array<unknown>;
}
