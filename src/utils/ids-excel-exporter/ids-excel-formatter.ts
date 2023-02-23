import { saveAs } from "../ids-file-saver/ids-file-saver";
import { CONTENT_TYPES, ExcelColumn, ExcelConfig, RELS, STYLES_XML, WORKBOOK_XML, WORKBOOK_XML_REL, WORKSHEET_TEMPLATE, XLSXColumn } from "./ids-worksheet-templates";
import { IdsZip } from "./ids-zip/ids-zip";

const VALID_TYPES = ['string', 'number'];

const CELL_PADDING = 2;

export class XLXExporter {
  private root: IdsZip | null = null;

  private columns: Record<string, XLSXColumn> = {};

  constructor() {
    this.root = new IdsZip();
  }

  public async exportToExcel(data: Array<Record<string, any>>, config: ExcelConfig) {
    const xl = this.root!.folder('xl');
    xl.file('workbook.xml', WORKBOOK_XML);
    xl.file('_rels/workbook.xml.rels', WORKBOOK_XML_REL);
    xl.file('styles.xml', STYLES_XML);
    this.root!.file('_rels/.rels', RELS);
    this.root!.file('[Content_Types].xml', CONTENT_TYPES);
    xl!.file('worksheets/sheet1.xml', this.generateWorksheet(data, config.columns))
    return this.root!
      .generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      .then((blob) => saveAs(blob, `${config.filename || 'worksheet'}.xlsx`));
  }

  /**
   * Generate worksheet xml string from data
   * @param {Record<string, any} data user data
   * @param {Array<ExcelColumn>} columnConfig column configuration
   * @returns {string} xlsx formatted worksheet string
   */
  private generateWorksheet(data: Array<Record<string, any>>, columnConfig?: Array<ExcelColumn>): string {
    this.prepareColumnConfig(columnConfig);
    const dataHeader = this.generateHeaderRow(this.columns);
    const dataBody = this.generateRows(data);
    const sheetData = `${dataHeader}${dataBody}`;
    const colStyles = this.generateColWidths(this.columns);
    let worksheet = WORKSHEET_TEMPLATE.replace('{sheetDataPlaceholder}', sheetData);
    worksheet = worksheet.replace('{colPlaceholder}', colStyles);

    console.log(worksheet);

    return worksheet;
  }

  /**
   * Prepares column configuration referenced in worksheet generation
   * @param {Array<ExcelColumn>} columnConfig column configuration
   */
  private prepareColumnConfig(columnConfig?: Array<ExcelColumn>) {
    if (!columnConfig) return;
    this.columns = columnConfig.reduce((columns, config, idx) => {
      columns[config.field] = {
        ...config,
        refLetter: this.generateColumnLetter(idx),
        width: config.field.length + CELL_PADDING
      }

      return columns;
    }, this.columns);
  }

  private generateColWidths(columns: Record<string, XLSXColumn>): string {
    return Object.keys(columns).reduce((cols, col, idx) => {
      const colIndex = idx + 1;
      const colWidth = columns[col].width;
      const colStr = `<col min="${colIndex}" max="${colIndex}" width="${colWidth}" bestFit="1" customWidth="1" />`;
      return `${cols}${colStr}`;
    }, '');
  }

  /**
   * Recursively creates Excel column letter by column index
   * @param {number} colIndex zero-based column index
   * @returns {string} Excel Column letter
   */
  private generateColumnLetter(colIndex: number): string {
    if (typeof colIndex !== 'number') {
      return '';
    }

    const prefix = Math.floor(colIndex / 26);
    const letter = String.fromCharCode(97 + (colIndex % 26)).toUpperCase();
    if (prefix === 0) {
      return letter;
    }

    return this.generateColumnLetter(prefix - 1) + letter;
  }

  /**
   * Create xlsx xml formatted string cell
   * @param {string} value string value
   * @param {number} colindex column index
   * @param {number} rowIndex row index
   * @returns {string} xlsx xml string cell
   */
  private formatStringCell(value: string, cellRef: string): string {
    let cleanValue = value ?? "";
    cleanValue = String(cleanValue).trim();

    return `<c r="${cellRef}" t="inlineStr"><is><t>${cleanValue}</t></is></c>`;
  }

  /**
   * Create xlsx xml formatted number cell
   * @param {number} value numeric value
   * @param {number} colIndex column index
   * @param {number} rowIndex row index
   * @returns {string} xlsx xml number cell
   */
  private formatNumberCell(value: number, cellRef: string): string {
    return `<c r="${cellRef}"><v>${value}</v></c>`;
  }

  /**
   * Create xlsx xml formatted cell by cell type
   * @param {string} field field name
   * @param {any} value field value
   * @param {number} colIndex column number
   * @param {number} rowIndex row number
   * @returns {string} xlsx xml formatted cell
   */
  private formatCell(field: string, value: any, cellIndex: number, rowIndex: number): string {
    const cellConfig = this.columns[field];
    const cellType = VALID_TYPES.includes(cellConfig?.type) ? cellConfig.type : 'string';
    const cellRefLetter = cellConfig.refLetter || this.generateColumnLetter(cellIndex);
    const cellRef = `${cellRefLetter}${rowIndex}`;

    // update column width
    const valueWidth = String(value).length + CELL_PADDING;
    cellConfig.width = Math.max(valueWidth, cellConfig.width);

    return cellType === 'string'
      ? this.formatStringCell(value as string, cellRef)
      : this.formatNumberCell(value as number, cellRef);
  }

  /**
   * Create xlsx xml formatted row
   * @param {Record<string, any>} row row data
   * @param {number} rowIndex row index
   * @returns {string} xlsx xml formatted row
   */
  private formatRow(row: Record<string, any>, rowIndex: number): string {
    let rowCells = Object.keys(this.columns).reduce((rowString, field, idx) => {
      const cell = this.formatCell(field, row[field], idx, rowIndex);
      return `${rowString}${cell}`;
    }, '');

    return `<row r="${rowIndex}">${rowCells}</row>`;
  }

  private generateHeaderRow(columns: Record<string, XLSXColumn>): string {
    const headerCells = Object.keys(columns).reduce((headerStr, field) => {
      const cellR = this.columns[field].refLetter;
      const cell = `<c r="${cellR}1" t="inlineStr" s="1"><is><t>${field}</t></is></c>`;
      return `${headerStr}${cell}`;
    }, '');
    return `<row r="1">${headerCells}</row>`;
  }

  /**
   * Creates xlsx formatted rows
   * @param {Array<Record<string, any>} rows array of row data
   * @returns {string} xml formatted rows
   */
  private generateRows(rows: Array<Record<string, any>>): string {
    return rows.reduce((prevRow, row, idx) => {
      // Excel rows start at 1 (reserved for header row)
      const rowIndex = idx + 2;
      return prevRow + this.formatRow(row, rowIndex);
    }, '');
  }

  /**
   * Clean up any references
   */
  public destroy(): void {
    this.columns = {};
    this.root = null;
  }
}
