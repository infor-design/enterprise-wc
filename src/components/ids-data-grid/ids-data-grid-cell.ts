import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import type IdsDataGrid from './ids-data-grid';
import type { IdsDataGridColumn } from './ids-data-grid-column';
import { IdsDataGridEditor } from './ids-data-grid-editors';

@customElement('ids-data-grid-cell')
export default class IdsDataGridCell extends IdsElement {
  rootNode?: any;

  isInValid = false;

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
    let template = IdsDataGridCell.template(row, column, index, this.dataGrid);

    if (row.invalidCells) {
      const message = row.invalidCells.find((info: any) => info.cell === Number(this.getAttribute('aria-colindex')) - 1);
      if (message) template += `<ids-alert icon="error" tooltip="${message.validationMessages[0]?.message}"></ids-alert>`;
    }
    this.innerHTML = template;
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

  /** Previous Invalid state before reseting */
  previousInvalidState = '';

  /** The editor element */
  editor?: IdsDataGridEditor;

  /** If currently in edit mode */
  isEditing?:boolean;

  /**
   * Start Edit Mode
   * @param {boolean} isClick If true of clicking activated the editor (vs keyboard)
   */
  startCellEdit(isClick?: boolean) {
    const column = this.column;
    if (!column.editor) return;
    const columnEditor = this.dataGrid.editors.find((obj) => obj.type === column?.editor?.type);
    if (!columnEditor || !columnEditor.editor || this.isEditing) return;

    // Init Editor
    let canEdit = !(this.classList.contains('is-readonly') || this.classList.contains('is-disabled'));
    if (!canEdit) {
      return;
    }

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
    this.editor.isClick = isClick;

    // Override original value if dropdown
    if (this.editor.type === 'dropdown') {
      this.originalValue = this.querySelector('[data-value]')?.getAttribute('data-value');
    }

    this.editor.init(this);


    // Set states
    this.classList.add('is-editing');
    if (this.classList.contains('is-invalid')) {
      this.classList.remove('is-invalid');
      this.isInValid = true;
    }
    if (column.editor.inline) this.classList.add('is-inline');
    this.isEditing = true;

    // Save on Click Out Event
    this.editor.input?.onEvent('blur', this.editor.input, () => {
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
    const input = this.editor?.input;
    input?.offEvent('blur', input);

    if (this.editor?.type === 'input') {
      input?.setDirtyTracker(input?.value as any);
      input?.checkValidation();
    }

    const isDirty = column.editor?.editorSettings?.dirtyTracker && input?.isDirty;
    const isValid = column.editor?.editorSettings?.validate ? input?.isValid : true;
    const newValue = this.editor?.save(this);
    this.#saveCellValue(newValue);

    // Save dirty and valid state on the row
    if (isDirty) this.#saveDirtyState(newValue);
    if (!isValid) this.#saveValidState(input?.validationMessages);
    if (this.isInValid && isValid) this.#resetValidState();

    this.editor?.destroy(this);
    this.renderCell();
    this.isEditing = false;
    this.classList.remove('is-editing');

    this.dataGrid?.triggerEvent('endcelledit', this.dataGrid, {
      detail: {
        elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid?.activeCell.row]
      }
    });
    this.dataGrid.activeCellEditor = undefined;
  }

  /** Cancel Cell Edit */
  cancelCellEdit() {
    const column = this.column;
    const input = this.editor?.input;
    input?.offEvent('blur', input);
    input?.setDirtyTracker(input?.value as any);

    this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, { [String(column?.field)]: this.originalValue });
    this.editor?.destroy(this);
    this.renderCell();
    this.isEditing = false;
    this.classList.remove('is-editing');

    this.dataGrid?.triggerEvent('cancel', this.dataGrid, {
      detail: {
        elem: this,
        editor: this.editor,
        column,
        data: this.dataGrid.data[this.dataGrid?.activeCell.row],
        oldValue: this.originalValue
      }
    });
    this.dataGrid.activeCellEditor = undefined;
  }

  /**
   * Save cell Edit Back into data set
   * @param {any} newValue the value to coerce and save
   */
  #saveCellValue(newValue: any) {
    const column = this.column;
    if (column.editor?.editorSettings?.mask === 'date') {
      newValue = this.dataGrid.locale.parseDate(newValue, column.formatOptions);
    }
    this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
      [String(column?.field)]: newValue,
    });
  }

  /**
   * Save the dirty state info on the row
   * @param {boolean} newValue the current value
   */
  #saveDirtyState(newValue: any) {
    let rowDirtyCells = this.dataGrid.data[this.dataGrid?.activeCell.row].dirtyCells;
    if (rowDirtyCells === undefined) rowDirtyCells = [];
    const cell = Number(this.getAttribute('aria-colindex')) - 1;
    const previousCellInfo = rowDirtyCells.filter((item: any) => item.cell === cell);

    if (previousCellInfo[0] && newValue === previousCellInfo[0].originalValue) {
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
        cell: Number(this?.getAttribute('aria-colindex')) - 1,
        columnId: this.column.id,
        originalValue: this?.editor?.input?.dirty.original
      });
      this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
        dirtyCells: rowDirtyCells
      });
    }
  }

  /**
   * Save the validation state info on the row
   * @param {any} validationMessages the current value
   */
  #saveValidState(validationMessages: any) {
    let rowInvalidCells = this.dataGrid.data[this.dataGrid?.activeCell.row].invalidCells;
    if (!rowInvalidCells) rowInvalidCells = [];
    const cell = Number(this.getAttribute('aria-colindex')) - 1;
    const previousCellInfo = rowInvalidCells.filter((item: any) => item.cell === cell);

    this?.classList.add('is-invalid');

    if (previousCellInfo.length === 0) {
      this.previousInvalidState = validationMessages.id;
      rowInvalidCells.push({
        cell: Number(this?.getAttribute('aria-colindex')) - 1,
        columnId: this.column.id,
        validationMessages
      });
      this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
        invalidCells: rowInvalidCells
      });
    }
  }

  /**
   * Set back the valid state
   */
  #resetValidState() {
    this?.classList.remove('is-invalid');
    this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
      invalidCells: undefined
    });
    this.isInValid = false;
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
    let template = '';

    if (!dataGridFormatters[column?.formatter?.name || 'text'] && column?.formatter) template = column?.formatter(row, column, index, dataGrid);
    else template = dataGridFormatters[column?.formatter?.name || 'text'](row, column, index, dataGrid);

    if (row.invalidCells) {
      const message = (row.invalidCells as any).find((info: any) => info.cell === dataGrid.columnIdxById(column.id));
      if (message) template += `<ids-alert icon="error" tooltip="${message?.validationMessages[0]?.message}"></ids-alert>`;
    }
    return template;
  }
}
