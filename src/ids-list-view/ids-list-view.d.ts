// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  /** Enabled virtual scrolling */
  virtualScroll: boolean;
  /** Set the internal list template */
  itemTemplate: Function | string;
  /** Attach a DataSet and render */
  data(value: Array<Object>): void;
}

export class IdsListView extends HTMLElement {
  nativeElement: nativeElement;
}
