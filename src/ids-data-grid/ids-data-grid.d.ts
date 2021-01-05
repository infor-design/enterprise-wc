// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  /** Set the data array of the datagrid **/
  data: Array<object>;
  /** Set the columns array of the datagrid **/
  columns: Array<object>;
  /** The supported cell formatters **/
  formatters: {
    text: Function;
  };
  /** Enables a different color shade on alternate rows for easier scanning */
  alternateRowShading: boolean;
  /** Enables the virtual scrolling behavior */
  virtualScroll: boolean;
  /** Enables the virtual scrolling behavior */
  rowHeight: 'extra-small' | 'small' | 'medium' | 'large';

  /** Set the sort column and sort direction */
  setSortColumn(id: string, ascending?: boolean): void;
}

interface sorted extends Event {
  detail: {
    elem: IdsDataGrid,
    sortColumn: {
      id: string,
      ascending: string
    }
  }
}

interface activecellchanged extends Event {
  detail: {
    elem: IdsDataGrid,
    activeCell: {
      cell: number;
      row: number;
      node: HTMLElement
    }
  }
}

export class IdsDataGrid extends HTMLElement {
  nativeElement: nativeElement;
}
