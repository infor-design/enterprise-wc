// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base/ids-element';

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

export default class IdsDataGrid extends IdsElement {
  /** Set the data array of the datagrid * */
  data: Array<unknown>;

  /** Set the columns array of the datagrid * */
  columns: Array<unknown>;

  /** The supported cell formatters * */
  formatters: {
    text: (rowData: unknown, columnData: unknown) => string;
  };

  /** Enables a different color shade on alternate rows for easier scanning */
  alternateRowShading: boolean;

  /** Enables the virtual scrolling behavior */
  virtualScroll: boolean;

  /** Enables the virtual scrolling behavior */
  rowHeight: 'extra-small' | 'small' | 'medium' | 'large';

  /** Set the sort column and sort direction */
  setSortColumn(id: string, ascending?: boolean): void;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'sorted', listener: (event: sorted) => void): this;

  /** Fires while the tag is removed */
  // eslint-disable-next-line no-use-before-define
  on(event: 'activecellchanged', listener: (event: activecellchanged) => void): this;
}
