import { ExcelColumn, WORKSHEET_TEMPLATE, XLSXColumn } from './ids-worksheet-templates';

const VALID_TYPES = ['string', 'number'];

const CELL_PADDING = 2;

export class XLSXFormatter {
  private columns: Array<XLSXColumn> = [];

  /**
   * Generate worksheet xml string from data
   * @param {Record<string, any>} data user data
   * @param {Array<ExcelColumn>} columnConfig column configuration
   * @returns {string} xlsx formatted worksheet string
   */
  public generateWorksheet(data: Array<Record<string, any>>, columnConfig?: Array<ExcelColumn>): string {
    this.prepareColumnConfig(columnConfig);
    const dataHeader = this.generateHeaderRow(this.columns);
    const dataBody = this.generateRows(data);
    const sheetData = `${dataHeader}${dataBody}`;
    const colStyles = this.generateColWidths(this.columns);
    let worksheet = WORKSHEET_TEMPLATE.replace('{sheetDataPlaceholder}', sheetData);
    worksheet = worksheet.replace('{colPlaceholder}', colStyles);

    return worksheet;
  }

  /**
   * Prepares column configuration referenced in worksheet generation
   * @param {Array<ExcelColumn>} columnConfig column configuration
   */
  private prepareColumnConfig(columnConfig?: Array<ExcelColumn>) {
    if (!columnConfig) return;
    this.columns = columnConfig.map((config, idx) => {
      const xlsxCol = {
        ...config,
        refLetter: this.generateColumnLetter(idx),
        width: config.field.length + CELL_PADDING
      };

      return xlsxCol;
    });
  }

  private generateColWidths(columns: Array<XLSXColumn>): string {
    return columns.reduce((cols, col, idx) => {
      const colIndex = idx + 1;
      const colWidth = col.width;
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
   * Create formatted string cell
   * @param {string} value string value
   * @param {string} cellRef cell ref location
   * @returns {string} xlsx xml string cell
   */
  private formatStringCell(value: string, cellRef: string): string {
    let cleanValue = value ?? '';
    cleanValue = String(cleanValue).trim();

    return `<c r="${cellRef}" t="inlineStr"><is><t>${cleanValue}</t></is></c>`;
  }

  /**
   * Create formatted date cell
   * @param {number} value numeric value
   * @param {string} cellRef cell ref location
   * @returns {string} xlsx xml number cell
   */
  private formatNumberCell(value: number, cellRef: string): string {
    return `<c r="${cellRef}"><v>${value ?? 0}</v></c>`;
  }

  /**
   * Factory function to format cells of different types
   * @param {XLSXColumn} col column
   * @param {any} value field value
   * @param {number} cellIndex column number
   * @param {number} rowIndex row number
   * @returns {string} xlsx xml formatted cell
   */
  private formatCell(col: XLSXColumn, value: any, cellIndex: number, rowIndex: number): string {
    const cellConfig = col;
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
    const rowCells = this.columns.reduce((rowString, col, idx) => {
      const cell = this.formatCell(col, row[col.field], idx, rowIndex);
      return `${rowString}${cell}`;
    }, '');

    return `<row r="${rowIndex}">${rowCells}</row>`;
  }

  private generateHeaderRow(columns: Array<XLSXColumn>): string {
    const headerCells = columns.reduce((headerStr, col) => {
      const cellR = col.refLetter;
      const name = col.name;
      const cell = `<c r="${cellR}1" t="inlineStr" s="1"><is><t>${name}</t></is></c>`;
      return `${headerStr}${cell}`;
    }, '');
    return `<row r="1">${headerCells}</row>`;
  }

  /**
   * Creates xlsx formatted rows
   * @param {Array<Record<string, any>>} rows array of row data
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
    this.columns = [];
  }
}
