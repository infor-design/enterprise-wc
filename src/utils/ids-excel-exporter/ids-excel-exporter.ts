import { XLSXFormatter } from './ids-excel-formatter';
import { CONTENT_TYPES, ExcelConfig, RELS, STYLES_XML, WORKBOOK_XML, WORKBOOK_XML_REL } from './ids-worksheet-templates';
import { saveAs } from '../ids-file-saver/ids-file-saver';
import { IdsZip } from './ids-zip/ids-zip';

/**
 * Export to CSV format
 * @param {Array<Record<string, any>>} data excel data
 * @param {ExcelConfig} config excel config
 */
export function exportToCSV(data: Array<Record<string, any>>, config: ExcelConfig) {
  const fields = config.columns.map((col) => col.field);
  const header = config.columns.map((col) => col.name);

  let csvContent = `${header.join(',')}\n`;
  data.forEach((rowData) => {
    const rowStr = fields.map((field) => rowData[field].replaceAll(',', '') ?? '');
    csvContent += `${rowStr.join(',')}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
  saveAs(blob, `${config.filename || 'worksheet'}.csv`);
}

/**
 * Export to XLSX format
 * @param {Array<Record<string, any>>} data excel data
 * @param {ExcelConfig} config excel config
 */
export function exportToXLSX(data: Array<Record<string, any>>, config: ExcelConfig) {
  const root = new IdsZip();
  root.file('xl/workbook.xml', WORKBOOK_XML);
  root.file('xl/_rels/workbook.xml.rels', WORKBOOK_XML_REL);
  root.file('xl/styles.xml', STYLES_XML);
  root.file('_rels/.rels', RELS);
  root.file('[Content_Types].xml', CONTENT_TYPES);

  const xlsxFormatter = new XLSXFormatter();
  root.file('xl/worksheets/sheet1.xml', xlsxFormatter.generateWorksheet(data, config.columns));

  const zipFile = root.zip('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  saveAs(zipFile, `${config.filename || 'worksheet'}.xlsx`);
}
