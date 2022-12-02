import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import type IdsDataGrid from './ids-data-grid';
import type { IdsDataGridColumn } from './ids-data-grid-column';
import { IdsDataGridEditor } from './ids-data-grid-editors';

@customElement('ids-data-grid-cell')
export default class IdsDataGridCell extends IdsElement {
  rootNode?: any;

  constructor() {
    super({ noShadowRoot: true });
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Reference to the data grid parent
   * @returns {IdsDataGrid} the data grid parent
   */
  get dataGrid() {
    if (!this.rootNode) this.rootNode = (this.getRootNode() as any);
    return (this.rootNode.host) as IdsDataGrid;
  }

  /**
   * Get the column definition
   * @returns {IdsDataGridColumn} the current cells column
   */
  get column() {
    return this.dataGrid?.columns[Number(this.getAttribute('aria-colindex')) - 1];
  }

  /**
   * Rerender a cell - may be used later
   */
  renderCell() {
    const column = this.column;
    let index = Number(this.parentElement?.getAttribute('data-index'));

    if (column?.formatter?.name === 'rowNumber') {
      index += 1;
    }
    const row: Record<string, any> | undefined = this.dataGrid?.data[index];
    this.innerHTML = IdsDataGridCell.template(row, column, index, this.dataGrid);
  }

  /**
   * Set the active cell for focus
   * @param {boolean} nofocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  activate(nofocus: boolean) {
    this.dataGrid.activeCell?.node?.removeAttribute('tabindex');
    this.dataGrid.activeCell.node = this;
    this.setAttribute('tabindex', '0');

    if (!nofocus) {
      this.focus();
    }
    this.dataGrid.triggerEvent('activecellchanged', this.dataGrid, { detail: { elem: this, activeCell: this.dataGrid.activeCell } });
    return this.dataGrid.activeCell;
  }

  /** Previous Value before Editing */
  originalValue: unknown;

  /** The editor element */
  editor?: IdsDataGridEditor;

  /** If currently in edit mode */
  isEditing?:boolean;

  /** Begin Edit Mode */
  startCellEdit() {
    const column = this.column;
    const columnEditor = this.dataGrid.editors.find((obj) => obj.type === column?.editor?.type);
    if (!columnEditor || !columnEditor.editor || this.isEditing || !this.dataGrid) return;

    // Init Editor
    let canEdit = true;
    const response = (veto: any) => {
      canEdit = !!veto;
    };

    this.dataGrid.triggerEvent('beforecelledit', this.dataGrid, {
      detail: {
        elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid.activeCell.row], response
      }
    });

    if (!canEdit) {
      return;
    }

    this.originalValue = this.innerText;
    this.editor = columnEditor.editor;
    this.editor?.init(this);

    // Set states
    this.classList.add('is-editing');
    if (column.editor?.inline) this.classList.add('is-inline');
    this.isEditing = true;

    // Save on Click Out Event
    this.editor.input?.addEventListener('blur', () => {
      this.endCellEdit();
    });

    this.dataGrid?.triggerEvent('celledit', this.dataGrid, {
      detail: {
        elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid?.activeCell.row]
      }
    });

    this.dataGrid.activeCellEditor = this;
  }

  /** End Cell Edit */
  endCellEdit() {
    const column = this.column;

    const isDirty = this.editor?.input?.isDirty;
    const newValue = this.editor?.save(this);
    this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
      [String(column?.field)]: newValue,
    });

    // Save Dirty State on the row
    if (isDirty) this.#saveDirtyState(newValue);

    this.editor?.destroy(this);
    this.renderCell();
    this.isEditing = false;
    this.dataGrid?.triggerEvent('endcelledit', this.dataGrid, {
      detail: {
        elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid?.activeCell.row]
      }
    });
    this.dataGrid.activeCellEditor = undefined;
  }

  /**
   * Save the dirty state s
   * @param {boolean} newValue the current value
   */
  #saveDirtyState(newValue: any) {
    let rowDirtyCells = this.dataGrid.data[this.dataGrid?.activeCell.row].dirtyCells;
    if (rowDirtyCells === undefined) rowDirtyCells = [];
    const cell = Number(this.getAttribute('aria-colindex')) - 1;
    const previousCellInfo = rowDirtyCells.filter((item: any) => item.cell === cell);

    if (previousCellInfo[0] && newValue === previousCellInfo[0].orginalValue) {
      const oldIndex = rowDirtyCells.findIndex((item: any) => item.cell === cell);
      rowDirtyCells.splice(oldIndex, 1);
      // Value was reset
      this?.classList.remove('is-dirty');
      this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
        dirtyCells: rowDirtyCells
      });
      return;
    }

    this?.classList.add('is-dirty');

    if (previousCellInfo.length === 0) {
      rowDirtyCells.push({
        row: Number(this.parentElement?.getAttribute('aria-rowindex')) - 1,
        cell: Number(this?.getAttribute('aria-colindex')) - 1,
        columnId: this.column.id,
        orginalValue: this?.editor?.input?.dirty.original
      });
      this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
        dirtyCells: rowDirtyCells
      });
    }
  }

  /** Cancel Cell Edit */
  cancelCellEdit() {
    const column = this.column;
    this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, { [String(column?.field)]: this.originalValue });
    this.renderCell();
    this.dataGrid?.triggerEvent('cancel', this.dataGrid, {
      detail: {
        elem: this,
        editor: this.editor,
        column,
        data: this.dataGrid.data[this.dataGrid?.activeCell.row],
        oldValue: this.originalValue
      }
    });
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
    if (!dataGridFormatters[column?.formatter?.name || 'text'] && column?.formatter) return column?.formatter(row, column, index, dataGrid);
    return dataGridFormatters[column?.formatter?.name || 'text'](row, column, index, dataGrid);
  }
}
