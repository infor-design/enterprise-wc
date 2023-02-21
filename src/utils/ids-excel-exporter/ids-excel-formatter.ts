import { WORKSHEET_TEMPLATE } from './ids-worksheet-templates';

export type ExcelCell = {
  value: string | number;
  type: 'string' | 'number';
};

export type ExcelRow = Array<ExcelCell>;

const VALID_TYPES = ['string', 'number'];

/**
 * Recursively creates Excel column letter by column index
 * @param {number} colIndex zero-based column index
 * @returns {string} Excel Column letter
 */
function generateColumnLetter(colIndex: number): string {
  if (typeof colIndex !== 'number') {
    return '';
  }

  const prefix = Math.floor(colIndex / 26);
  const letter = String.fromCharCode(97 + (colIndex % 26)).toUpperCase();
  if (prefix === 0) {
    return letter;
  }

  return generateColumnLetter(prefix - 1) + letter;
}

/**
 * Creates cell index (ex. A1, B3, AC2, etc.)
 * @param {number} colIndex column index
 * @param {number} rowIndex row index
 * @returns {string} cell index
 */
function generateCellIndex(colIndex: number, rowIndex: number): string {
  return `${generateColumnLetter(colIndex)}${rowIndex}`;
}

/**
 * Create xlsx xml formatted string cell
 * @param {string} value string value
 * @param {number} colindex column index
 * @param {number} rowIndex row index
 * @returns {string} xlsx xml string cell
 */
function formatStringCell(value: string, colindex: number, rowIndex: number): string {
  return `<c r="${generateCellIndex(colindex, rowIndex)}" t="inlineStr"><is><t>${value}</t></is></c>`;
}

/**
 * Create xlsx xml formatted number cell
 * @param {number} value numeric value
 * @param {number} colIndex column index
 * @param {number} rowIndex row index
 * @returns {string} xlsx xml number cell
 */
function formatNumberCell(value: number, colIndex: number, rowIndex: number): string {
  return `<c r="${generateCellIndex(colIndex, rowIndex)}"><v>${value}</v></c>`;
}

/**
 * Create xlsx xml formatted cell by cell type
 * @param {ExcelCell} cell cell data
 * @param {number} colIndex column number
 * @param {number} rowIndex row number
 * @returns {string} xlsx xml formatted cell
 */
function formatCell(cell: ExcelCell, colIndex: number, rowIndex: number): string {
  if (!VALID_TYPES.includes(cell.type)) {
    cell.type = 'string';
  }

  return cell.type === 'string'
    ? formatStringCell(cell.value as string, colIndex, rowIndex)
    : formatNumberCell(cell.value as number, colIndex, rowIndex);
}

/**
 * Create xlsx xml formatted row
 * @param {ExcelRow} row row data
 * @param {number} rowIndex row index
 * @returns {string} xlsx xml formatted row
 */
function formatRow(row: ExcelRow, rowIndex: number): string {
  const rowCells = row.reduce((prev, cell, idx) => prev + formatCell(cell, idx, rowIndex), '');
  return `<row r="${rowIndex}">${rowCells}</row>`;
}

/**
 * Creates xlsx formatted rows
 * @param {Array<ExcelRow>} rows array of row data
 * @returns {string} xml formatted rows
 */
function generateRows(rows: Array<ExcelRow>): string {
  return rows.reduce((prevRow, row, idx) => {
    // Excel index starts at 1
    const rowIndex = idx + 1;
    return prevRow + formatRow(row, rowIndex);
  }, '');
}

/**
 * Generates an excel formatted worksheet string from data
 * @param {Array<ExcelRow>} data excel data
 * @returns {string} xlsx formatted worksheet
 */
export function generateWorksheet(data: Array<ExcelRow>): string {
  const xmlRows = generateRows(data);
  return WORKSHEET_TEMPLATE.replace('{placeholder}', xmlRows);
}
