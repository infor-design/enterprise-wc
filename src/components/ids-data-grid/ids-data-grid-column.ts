export interface IdsDataGridColumnFormatOptions {
  /* Set the style of the number fx integer */
  style?: string;
}

export interface IdsDataGridColumnGroup {
  /* Set the id for the column group object */
  id?: string;
  /* Set the title/name for the column group */
  name?: string;
  /* Set the number of columns to span */
  colspan: number,
  /** Align the column text to either `left`, `center` or `right` */
  align?: string;
}

export interface IdsDataGridColumn {
  /** The columns unique id */
  id: string;
  /** The columns name */
  name: string;
  /** The columns field in the array to use */
  field: string;
  /** The subsitute text to use (for hyperlink and some formatters) */
  text?: string;
  /** Allow column sorting */
  sortable?: boolean;
  /** Allow column resizing */
  resizable?: boolean;
  /** Make the column readonly */
  readonly?: boolean;
  /** Adds a drag indicator and allows the columns to be moved by dragging */
  reorderable?: boolean;
  /** Allow column sorting */
  width?: number | string;
  /** Hide a column to be shown later */
  hidden?: boolean;
  /** Column Formatter Function */
  formatter?: (rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any) => string;
  /** Enable Href / Link Columns */
  href?: string | ((rowData: Record<string, unknown>, columnData: IdsDataGridColumn) => string);
  /** Fire for clickable formatters (like button) */
  click?: string | ((rowData: Record<string, unknown>, columnData: IdsDataGridColumn, event: MouseEvent) => void);
  /** Options to pass to the formatter */
  formatOptions?: IdsDataGridColumnFormatOptions;
  /** Column Filter to use */
  filterType?: string | any;
  /** Column Filter options to show */
  filterTerms?: any[];
  /** Options to pass to the filter */
  filterOptions?: {
    /** The columns unique id */
    columnId?: string;
    /** The label in the filter */
    label?: string;
    /** The size of the input field */
    size?: string;
    /** The filter type */
    type?: string;
    /** Disable the filter */
    disabled?: boolean;
    /** Make the filter readonly */
    readonly?: boolean;
    /** Date formation to show  (for date type filters) */
    format?: string;
    /** Placeholder to show for empty inputs */
    placeholder?: string;
    /** Option to show today or not (for date type filters)  */
    showToday?: boolean;
    /** First day of the week (for date type filters) */
    firstDayOfWeek?: number;
    /** The interval between minutes (for time type filters) */
    minuteInterval?: number;
    /** The interval between seconds (for time type filters) */
    secondInterval?: number;
    /** Sets the auto select attribute (for time type filters) */
    autoselect?: boolean;
    /** Sets the auto update attribute (for time type filters) */
    autoupdate?: boolean;
  };
  /** True if the row is selected */
  rowSelected?: boolean;
  /** True if the row is activated */
  rowActivated?: boolean;
  /** True if the row is selected */
  cssPart?: string | ((rowIndex: number, cellIndex: number) => string);
  /** Pass the type option to formatters that support it */
  type?: string;
  /** Disable the column with a boolean of a dynamic function */
  disabled?: boolean | ((row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>) => boolean);
  /** Name of the icon too use for formatters that support it */
  icon?: string;
  /** Align the column to either `left`, `center` or `right` */
  align?: string;
  /** Seperately align the header to either `left`, `center` or `right` */
  headerAlign?: string;
  /** Freeze the columns to either the `left` or `right` sides */
  frozen?: string;
}
