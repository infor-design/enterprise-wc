export default class IdsListView extends HTMLElement {
  /** Enabled virtual scrolling */
  virtualScroll: boolean;

  /** Attach a DataSet and render */
  data: Array<unknown> | null;

  /** The height of the component */
  height: string | number;

  /** The height of each list item */
  itemHeight: string | number;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the internal list template */
  itemTemplate: (item: unknown) => string | string;
}
