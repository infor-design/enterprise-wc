export interface IdsExcelItem {
  column: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'date';
};

export type IdsExcelRow = Array<IdsExcelItem>;

export type IdsExcelData = Array<IdsExcelRow>;

export function exportToCSV(data: IdsExcelData) {
  console.info('exportToCSV', data);
}

export function exportToXLSX(data: IdsExcelData) {
  console.info('exportToXLSX', data);
}
