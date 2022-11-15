import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import type IdsDataGrid from './ids-data-grid';
import type { IdsDataGridColumn } from './ids-data-grid-column';

@customElement('ids-data-grid-cell')
export default class IdsDataGridCell extends IdsElement {
  dataGrid: IdsDataGrid | undefined;

  constructor() {
    super({ noShadowRoot: true });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.dataGrid = (this.getRootNode() as any).host as IdsDataGrid;
  }

  /**
   * Rerender a cell - may be used later
   */
  renderCell() {
    const dataGridFormatters = (this.dataGrid?.formatters as any);
    const column = this.dataGrid?.columns[Number(this.getAttribute('aria-colindex')) - 1];
    let index = Number(this.parentElement?.getAttribute('data-index'));
    if (column?.formatter?.name === 'rowNumber') {
      index += 1;
    }
    const row: Record<string, any> | undefined = this.dataGrid?.data[index];

    let formatter = null;
    if (!dataGridFormatters[column?.formatter?.name || 'text'] && column?.formatter) formatter = column?.formatter(row as Record<string, any>, column, index, this);
    else formatter = dataGridFormatters[column?.formatter?.name || 'text'](row, column, index, this.dataGrid);
    this.innerHTML = formatter;
  }

  /**
   * Set the active cell for focus
   * @param {number} cell The cell to focus (zero based)
   * @param {number} row The row to focus (zero based)
   * @param {IdsDataGrid} dataGrid The parent data grid instance
   * @param {boolean} nofocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  static setActiveCell(cell: number, row: number, dataGrid: IdsDataGrid, nofocus?: boolean) {
    if (row < 0 || cell < 0 || row > dataGrid.data.length - 1
      || cell > dataGrid.visibleColumns.length - 1 || Number.isNaN(row) || Number.isNaN(row)) {
      return dataGrid.activeCell;
    }

    if (!dataGrid.activeCell) {
      dataGrid.activeCell = {};
    }

    dataGrid.activeCell.cell = Number(cell);
    dataGrid.activeCell.row = Number(row);

    const queriedRows = dataGrid.shadowRoot?.querySelectorAll('.ids-data-grid-body ids-data-grid-row');
    const rowNode = queriedRows?.item(row); // exclude header rows
    const queriedCells = rowNode?.querySelectorAll<HTMLElement>('ids-data-grid-cell');
    if (queriedCells && queriedCells.length > 0) {
      const cellNode = queriedCells[cell];

      dataGrid.activeCell?.node?.removeAttribute('tabindex');
      dataGrid.activeCell.node = cellNode;
      cellNode.setAttribute('tabindex', '0');

      if (!nofocus) {
        cellNode.focus();
      }
    }
    dataGrid.triggerEvent('activecellchanged', dataGrid, { detail: { elem: this, activeCell: dataGrid.activeCell } });
    return dataGrid.activeCell;
  }

  /**
   * Return the Template for the cell contents
   * @param {object} row The data item for the row
   * @param {object} column The column data for the row
   * @param {object} index The running index
   * @param {IdsDataGrid} dataGrid The dataGrid instance
   * @returns {string} The template to display
   */
  static template(row: Record<string, unknown>, column: IdsDataGridColumn, index: number, dataGrid: IdsDataGrid): string {
    const dataGridFormatters = (dataGrid.formatters as any);
    if (!dataGridFormatters[column?.formatter?.name || 'text'] && column?.formatter) return column?.formatter(row, column, index, this);
    return dataGridFormatters[column?.formatter?.name || 'text'](row, column, index, this);
  }
}
