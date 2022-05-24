export interface IdsDataGridColumnFormatOptions {
  /* Set the style of the number fx integer */
  style?: string;
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
  /** Make the column readonly */
  readonly?: boolean;
  /** Allow column sorting */
  width?: number | string;
  /** Hide a column to be shown later */
  hidden?: boolean;
  /** Column Formatter Function */
  formatter?: (rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any) => string;
  /** Enable Href / Link Columns */
  href?: string | ((rowData: Record<string, unknown>, columnData: IdsDataGridColumn) => string);
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
}
