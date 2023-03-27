import { ExcelColumn, WORKSHEET_TEMPLATE, XLSXColumn } from './ids-worksheet-templates';

const VALID_TYPES = ['string', 'number', 'date', 'time'];

const CELL_PADDING = 2;

/**
 * Class used to format data collection into Office Open XML format for .xlsx files
 * Link below provides a PDF (Part 1) of OOXML documentation
 * @see {@link https://www.ecma-international.org/publications-and-standards/standards/ecma-376/}
 */
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
   * Prepares column configuration referenced in worksheet creation
   * @param {Array<ExcelColumn>} columnConfig column configuration
   */
  private prepareColumnConfig(columnConfig?: Array<ExcelColumn>) {
    if (!columnConfig) return;
    this.columns = columnConfig.map((config, idx) => {
      const xlsxCol: XLSXColumn = {
        ...config,
        refLetter: this.generateColumnLetter(idx),
        width: config.name.length + CELL_PADDING
      };

      return xlsxCol;
    });
  }

  /**
   * Generates <cols> section of worksheet
   * Width is determined by max char length of data column
   * @param {Array<XLSXColumn>} columns column config
   * @returns {string} <cols> worksheet string
   */
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
   * Escapes special characters for excel string cells
   * @param {string} str cell string
   * @returns {string} escaped, trimmed cell string
   */
  private escapeExcelString(str: string) {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
    };

    return str.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Create formatted string cell
   * @param {string} value string value
   * @param {string} cellRef cell ref location
   * @returns {string} xlsx xml string cell
   */
  private formatStringCell(value: string, cellRef: string): string {
    let cleanValue = value ?? '';
    cleanValue = this.escapeExcelString(String(cleanValue).trim());

    return `<c r="${cellRef}" t="inlineStr"><is><t>${cleanValue}</t></is></c>`;
  }

  /**
   * Create a cell with a certain type
   * @param {any} value cell value
   * @param {string} cellRef cell ref location
   * @param {string} type cell type
   * @returns {string} xlsx xml number cell
   */
  private formatTypedCell(value: any, cellRef: string, type: string): string {
    if (type === 'date') {
      return this.formatDateCell(value, cellRef);
    }

    if (type === 'time') {
      return this.formatTimeCell(value, cellRef);
    }

    // return value as number
    value = Number.isNaN(value) ? '' : value;
    value ??= '';
    return `<c r="${cellRef}"><v>${value}</v></c>`;
  }

  /**
   * Convert JS Date object to excel date value
   * Excel date is number of days since Jan 1 1900
   * @see {@link https://support.microsoft.com/en-us/office/datetime-function-812ad674-f7dd-4f31-9245-e79cfa358a4e}
   * @see {@link https://www.flyaga.info/converting-a-javascript-date-object-to-an-excel-date-time-serial-value/}
   * @param {Date} date JS Date Object
   * @returns {number} excel date value
   */
  private createExcelDate(date: Date): number {
    const epochDiff = 25569.0; // difference between JS date epoch and excel epoch in days
    const dayInMs = 1000 * 60 * 60 * 24;

    return epochDiff + ((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (dayInMs));
  }

  /**
   * Creates time cell string
   * Defaults to en_US formatting of time
   * @param {string} dateStr parseable Date string
   * @param {string} cellRef cell reference string
   * @returns {string} cell time string
   */
  private formatTimeCell(dateStr: string, cellRef: string): string {
    const d = new Date(dateStr);

    if (!Number.isNaN(d.getTime())) {
      const excelDate = this.createExcelDate(d);
      return `<c r="${cellRef}" s="3"><v>${excelDate}</v></c>`;
    }

    return this.formatStringCell('', cellRef);
  }

  /**
   * Creates date cell string
   * Defaults to en_US formatting of dates
   * @param {string} dateStr parseable Date string
   * @param {string} cellRef cell reference string
   * @returns {string} cell date string
   */
  private formatDateCell(dateStr: string, cellRef: string): string {
    const d = new Date(dateStr);

    if (!Number.isNaN(d.getTime())) {
      const excelDate = this.createExcelDate(d);
      return `<c r="${cellRef}" s="2"><v>${excelDate}</v></c>`;
    }

    return this.formatStringCell('', cellRef);
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
    let cellType = VALID_TYPES.includes(cellConfig?.type) ? cellConfig.type : 'string';
    const cellRefLetter = cellConfig.refLetter || this.generateColumnLetter(cellIndex);
    const cellRef = `${cellRefLetter}${rowIndex}`;

    // update column width
    const valueWidth = String(value).length + CELL_PADDING;
    cellConfig.width = Math.max(valueWidth, cellConfig.width);

    // check if type is string, but contains only numbers
    if (cellType === 'string' && this.canCastAsNumber(value)) {
      cellType = 'number';
    }

    return cellType === 'string'
      ? this.formatStringCell(value as string, cellRef)
      : this.formatTypedCell(value as number, cellRef, cellType);
  }

  private canCastAsNumber(value: any): boolean {
    if (typeof value === 'number' && !Number.isNaN(Number(value))) {
      return true;
    }

    if (value?.length && !Number.isNaN(Number(value))) {
      return true;
    }

    return false;
  }

  /**
   * Create xlsx xml formatted row
   * @param {Record<string, any>} row row data
   * @param {number} rowIndex row index
   * @returns {string} xlsx xml formatted row
   */
  private formatRow(row: Record<string, any>, rowIndex: number): string {
    const rowCells = this.columns.reduce((rowString, col, idx) => {
      const value = row[col.id] || row[col.field];
      const cell = this.formatCell(col, value, idx, rowIndex);
      return `${rowString}${cell}`;
    }, '');

    return `<row r="${rowIndex}">${rowCells}</row>`;
  }

  /**
   * Create header row for excel sheet
   * @param {Array<XLSXColumn>} columns columns config
   * @returns {string} header excel string
   */
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
