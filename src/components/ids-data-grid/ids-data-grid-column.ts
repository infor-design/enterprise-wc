export interface IdsDataGridColumnFormatOptions {
  style?: string;
}

export interface IdsDataGridColumn {
  name?: string;
  id?: string;
  field?: string;
  text?: string;
  sortable?: boolean;
  width?: number | string;
  formatter?: (rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any) => string;
  href?: string | ((rowData: Record<string, unknown>, columnData: IdsDataGridColumn) => string);
  formatOptions?: IdsDataGridColumnFormatOptions;
}
