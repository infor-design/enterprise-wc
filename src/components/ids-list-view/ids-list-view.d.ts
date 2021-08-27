// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsListView extends IdsElement {
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
