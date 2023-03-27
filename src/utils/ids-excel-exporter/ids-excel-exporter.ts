import { XLSXFormatter } from './ids-excel-formatter';
import { IdsZip } from '../ids-zip/ids-zip';
import {
  CONTENT_TYPES,
  ExcelConfig, RELS,
  STYLES_XML, WORKBOOK_XML,
  WORKBOOK_XML_REL
} from './ids-worksheet-templates';
import { saveAs } from '../ids-file-saver/ids-file-saver';

const DEFAULT_FILENAME = 'DataGrid (Export)';

/**
 * Export to CSV format
 * @param {Array<Record<string, any>>} data excel data
 * @param {ExcelConfig} config excel config
 */
export function exportToCSV(data: Array<Record<string, any>>, config: ExcelConfig) {
  const wrap = (str: string) => `"${str}"`;
  const fields = config.columns.map((col) => col.id);
  const universalBOM = '\uFEFF';

  // generate csv string
  const header = config.columns.map((col) => wrap(col.name));
  let csvContent = `${header.join(',')}\n`;
  data.forEach((rowData) => {
    const rowStr = fields.map((field) => wrap(rowData[field] ?? ''));
    csvContent += `${rowStr.join(',')}\n`;
  });

  // download
  const filename = `${config.filename || DEFAULT_FILENAME}.csv`;
  const href = `data:text/csv; charset=utf-8,${encodeURIComponent(universalBOM + csvContent)}`;
  saveAs(filename, href);
}

/**
 * Export to XLSX format
 * @param {Array<Record<string, any>>} data excel data
 * @param {ExcelConfig} config excel config
 */
export function exportToXLSX(data: Array<Record<string, any>>, config: ExcelConfig) {
  // create mostly static xlsx files
  const root = new IdsZip();
  root.file('xl/workbook.xml', WORKBOOK_XML);
  root.file('xl/_rels/workbook.xml.rels', WORKBOOK_XML_REL);
  root.file('xl/styles.xml', STYLES_XML);
  root.file('_rels/.rels', RELS);
  root.file('[Content_Types].xml', CONTENT_TYPES);

  // generate xlsx worksheet data
  const xlsxFormatter = new XLSXFormatter();
  root.file('xl/worksheets/sheet1.xml', xlsxFormatter.generateWorksheet(data, config.columns));
  const zipFile = root.zip('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  // download
  const filename = `${config.filename || DEFAULT_FILENAME}.xlsx`;
  saveAs(filename, zipFile);
}
