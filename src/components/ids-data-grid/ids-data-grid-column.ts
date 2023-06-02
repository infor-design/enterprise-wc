import type IdsDataGrid from './ids-data-grid';
import { IdsDataGridEditor } from './ids-data-grid-editors';

export interface IdsDataGridColumnFormatOptions {
  /* Set the style of the number fx integer */
  style?: string;
  /* Sets the incoming locale */
  locale?: string;
  /** Sets the group (thousands) characters */
  group?: string;
  /** Sets the time style */
  timeStyle?: string
  /** Date format to use for parsing ect */
  dateFormat?: string
  /** year pattern for Intl.DateTimeFormat */
  year?: string;
  /** month pattern for Intl.DateTimeFormat */
  month?: string;
  /** day pattern for Intl.DateTimeFormat */
  day?: string;
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
  /** Name of the header icon to use for formatters that support it */
  headerIcon?: string;
  /** Sets the header icon tooltip content */
  headerIconTooltip?: string;
}

export interface IdsDataGridTooltipCallback {
  /* Column id */
  columnId?: string;
  /* Column data */
  columnData?: any;
  /* Column index */
  columnIndex?: number;
  /* Column group id */
  columnGroupId?: string;
  /* Column group data */
  columnGroupData?: any;
  /* Column group index */
  columnGroupIndex?: number;
  /* Field data */
  fieldData?: any;
  /* The grid api object */
  grid?: any;
  /* Is header group */
  isHeaderGroup?: boolean;
  /* Row data */
  rowData?: any;
  /* Row index */
  rowIndex?: number,
  /* The current text content */
  text?: string;
  /* Type of tooltip as unique identifier */
  type?: string;
}

export interface IdsDataGridTooltipOptions {
  /* The tooltip placement */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /* Sets tooltip edge horizontal space */
  x?: number;
  /* Sets tooltip edge vertical space */
  y?: number;
  /* The header tooltip placement */
  headerPlacement?: 'top' | 'right' | 'bottom' | 'left';
  /* Sets tooltip edge horizontal space */
  headerX?: number;
  /* Sets tooltip edge vertical space */
  headerY?: number;
  /* The header icon tooltip placement */
  headerIconPlacement?: 'top' | 'right' | 'bottom' | 'left';
  /* Sets tooltip edge horizontal space */
  headerIconX?: number;
  /* Sets tooltip edge vertical space */
  headerIconY?: number;
  /* The filter button tooltip placement */
  filterButtonPlacement?: 'top' | 'right' | 'bottom' | 'left';
  /* Sets tooltip edge horizontal space */
  filterButtonX?: number;
  /* Sets tooltip edge vertical space */
  filterButtonY?: number;
}

export interface IdsDataGridColumn {
  /** The columns unique id */
  id: string;
  /** The columns name */
  name?: string;
  /** The columns field in the array to use */
  field?: string;
  /** The subsitute text to use (for hyperlink and some formatters) */
  text?: string;
  /** Max value of a range */
  max?: number;
  /** Mininum value of a range */
  min?: number;
  /** Allow column sorting */
  sortable?: boolean;
  /** Allow column resizing */
  resizable?: boolean;
  /** Adds a drag indicator and allows the columns to be moved by dragging */
  reorderable?: boolean;
  /** Set a column width in pixel or percent */
  width?: number | string;
  /** Set a min column width for resizing */
  minWidth?: number | string;
  /** Set a max column width for resizing */
  maxWidth?: number | string;
  /** Hide a column to be shown later */
  hidden?: boolean;
  /** Column Formatter Function */
  formatter?: (rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: IdsDataGrid) => string;
  /** Set the column to checked or unchecked (filtering) */
  isChecked?: (value: boolean) => boolean;
  /** Enable Href / Link Columns */
  href?: string | ((rowData: Record<string, unknown>, columnData: IdsDataGridColumn) => string);
  /** Fires for clickable formatters (like button) */
  click?: (rowData: Record<string, unknown>, columnData: IdsDataGridColumn, event: MouseEvent) => void;
  /** Get the color dynamically from a function or as text */
  color?: string | ((row: number, value: any, column: IdsDataGridColumn, index: Record<string, any>) => string | undefined);
  /** Get the size dynamically from a function or as text */
  size?: string | ((row: number, value: any, column: IdsDataGridColumn, index: Record<string, any>) => string | undefined);
  /** Options to pass to the formatter */
  formatOptions?: IdsDataGridColumnFormatOptions;
  /** Column Filter to use */
  filterType?: string | any;
  /** Column Filter options to show */
  filterConditions?: any[];
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
    /** If the filter type is "contents" lets you set a blank string to a text value (matched by ID) */
    notFilteredItem?: { value: string, label: string }
  };
  /** Lets you make a dynamic filter function */
  filterFunction?: any;
  /** True if the row is selected */
  rowSelected?: boolean;
  /** True if the row is activated */
  rowActivated?: boolean;
  /** True if the row is selected */
  cssPart?: string | ((rowIndex: number, cellIndex: number) => string);
  /** Pass the type option to formatters that support it */
  type?: string;
  /** Disable the column with a boolean or a dynamic function */
  disabled?: boolean | ((row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>) => boolean);
  /** Make the column readonly with a boolean or a dynamic function */
  readonly?: boolean | ((row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>) => boolean);
  /** Name of the icon too use for formatters that support it */
  icon?: string;
  /** Name of the header icon */
  headerIcon?: string;
  /** Align the column to either `left`, `center` or `right` */
  align?: string;
  /** Seperately align the header to either `left`, `center` or `right` */
  headerAlign?: string;
  /** Freeze the columns to either the `left` or `right` sides */
  frozen?: string;
  /** If a tree or expandable row will set the state of the row */
  rowExpanded?: boolean;
  /** Sets the tooltip options */
  tooltipOptions?: IdsDataGridTooltipOptions | ((options: IdsDataGridTooltipCallback) => IdsDataGridTooltipOptions);
  /** Sets the tooltip content */
  tooltip?: string | ((options: IdsDataGridTooltipCallback) => string | Promise<string>);
  /** Sets the header tooltip content */
  headerTooltip?: string;
  /** Sets the header icon tooltip content */
  headerIconTooltip?: string;
  /** Sets the header filter button tooltip content */
  filterButtonTooltip?: string;
  /** Sets the tooltip css part */
  tooltipCssPart?: string | ((options: IdsDataGridTooltipCallback) => string);
  /** Sets the header tooltip css part */
  headerTooltipCssPart?: string;
  /** Sets the header icon tooltip css part */
  headerIconTooltipCssPart?: string;
  /** Sets the header filter button tooltip css part */
  filterButtonTooltipCssPart?: string;
  /** Sets the cell activation color css part */
  cellSelectedCssPart?: string | ((rowIndex: number, cellIndex: number) => string);
  /** Setup an editor */
  editor?: {
    type: 'input' | 'date' | 'time' | 'checkbox' | 'dropdown' | 'datepicker' | 'timepicker',
    inline?: boolean,
    editor?: IdsDataGridEditor,
    editorSettings?: Record<string, unknown>
  }
  /** If a true will set the text to uppercase */
  uppercase?: boolean | 'true' | ((type: 'body-cell' | 'header-cell', col: IdsDataGridColumn, index?: number, value?: any, item?: Record<string, any>) => boolean);
}
