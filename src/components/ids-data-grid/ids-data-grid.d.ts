// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

interface sort extends Event {
  detail: {
    elem: IdsDataGrid,
    sortColumn: {
      id: string,
      ascending: string
    }
  }
}

interface activecellchange extends Event {
  detail: {
    elem: IdsDataGrid,
    activeCell: {
      cell: number;
      row: number;
      node: HTMLElement
    }
  }
}

interface selected extends Event {
  detail: {
    elem: IdsDataGrid,
    row: number;
    data: Record<string, unknown>
  }
}

interface activated extends Event {
  detail: {
    elem: IdsDataGrid,
    row: number;
    data: Record<string, unknown>,
    index: number
  }
}

interface selectionchanged extends Event {
  detail: {
    elem: IdsDataGrid,
    selectedRows: Array<Record<string, unknown>>
  }
}

interface activationchanged extends Event {
  detail: {
    elem: IdsDataGrid,
    selectedRows: Array<Record<string, unknown>>,
    row: HTMLElement
  }
}

export default class IdsDataGrid extends IdsElement {
  /** Set the data array of the datagrid */
  data: Array<unknown>;

  /** Set the columns array of the datagrid */
  columns: Array<unknown>;

  /** The supported cell formatters */
  formatters: {
    text: (rowData: unknown, columnData: unknown) => string;
  };

  /** Enables a different color shade on alternate rows for easier scanning */
  alternateRowShading: boolean;

  /** Enables the virtual scrolling behavior */
  virtualScroll: boolean;

  /** Sizes the datagrid to the parent container */
  autoFit: boolean;

  /** Enables the virtual scrolling behavior */
  rowHeight: 'extra-small' | 'small' | 'medium' | 'large';

  /** Set the row selection mode between false, 'single', 'multiple' and 'mixed` */
  rowSelection: false | 'single' | 'multiple' | 'mixed';

  /**
   * Set to true to prevent rows from being deactivated if clicked.
   * i.e. once a row is activated, it remains activated until another row is activated in its place
   */
  supressRowDeactivation: boolean;

  /**
   * Set to true to prevent rows from being deselected if click or space bar the row.
   * i.e. once a row is selected, it remains selected until another row is selected in its place.
   */
  supressRowDeselection: boolean;

  /** Sets the style of the grid to list style for simple readonly lists */
  listStyle: boolean;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the sort column and sort direction */
  setSortColumn(id: string, ascending?: boolean): void;

  /** Fires when a column is sorted, you can return false in the response to veto */
  on(event: 'sort', listener: (event: sort) => void): this;

  /** Fires while the cell is changed */
  on(event: 'activecellchange', listener: (event: activecellchange) => void): this;

  /** Fires when an individual row is activation and gives information about that row */
  on(event: 'rowselected', listener: (event: selected) => void): this;

  /** Fires when an individual row is deselected and gives information about that row */
  on(event: 'rowdeselected', listener: (event: selected) => void): this;

  /** Fires once for each time selection changes and gives information about all selected rows */
  on(event: 'selectionchanged', listener: (event: selectionchanged) => void): this;

  /** Fires when an individual row is activated and gives information about that row */
  on(event: 'rowactivated', listener: (event: activated) => void): this;

  /** Fires when an individual row is deactivated and gives information about that row */
  on(event: 'rowdeselected', listener: (event: activated) => void): this;

  /** Fires once for each time activation changes and gives information about the active row */
  on(event: 'activationchanged', listener: (event: activationchanged) => void): this;

  /** Set the language */
  language: string;

  /** Set the locale */
  locale: 'unset' | null;
}
