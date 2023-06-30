import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import type IdsDropdown from '../ids-dropdown/ids-dropdown';
import type IdsInput from '../ids-input/ids-input';
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
   * Get row of table cell
   * @returns {number} table row index
   */
  get row(): number {
    return Number(this.parentElement?.getAttribute('data-index'));
  }

  /**
   * Rerender a cell - may be used later
   */
  renderCell() {
    const column = this.column;
    const rowIndex = Number(this.parentElement?.getAttribute('row-index'));

    const row: Record<string, any> | undefined = this.dataGrid?.data[rowIndex];
    const template = IdsDataGridCell.template(row, column, rowIndex, this.dataGrid);

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
   * @param {MouseEvent} clickEvent event passed if activated by click (vs keyboard)
   */
  startCellEdit(clickEvent?: MouseEvent) {
    // end previous cell edit
    if (this.dataGrid.activeCellEditor instanceof IdsDataGridCell && this.dataGrid.activeCellEditor !== this) {
      this.dataGrid.activeCellEditor.endCellEdit();
    }

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

    this.originalValue = this.textContent;
    this.editor = columnEditor.editor;
    this.editor.clickEvent = clickEvent;

    const editorType = this.editor.type;
    // Override original value if dropdown
    if (editorType === 'dropdown') {
      this.originalValue = this.querySelector('[data-value]')?.getAttribute('data-value');
    } else if (editorType === 'timepicker' || editorType === 'datepicker') {
      const rowData = this.dataGrid.data[this.dataGrid.activeCell.row];
      const rowVal = rowData[this.column.field!];
      this.originalValue = rowVal;
    }

    this.classList.add('is-editing');
    this.editor.init(this);

    // Set states
    if (this.classList.contains('is-invalid')) {
      this.classList.remove('is-invalid');
      this.isInValid = true;
    }
    if (column.editor.inline) this.classList.add('is-inline');
    this.isEditing = true;

    // Save on Click Out Event
    this.editor.input?.onEvent('focusout', this.editor.input, () => {
      this.endCellEdit();
    });

    this.dataGrid?.triggerEvent('celledit', this.dataGrid, {
      detail: {
        elem: this, editor: this.editor, column, data: this.dataGrid.data[this.row]
      }
    });

    this.dataGrid.activeCellEditor = this;
  }

  /** End Cell Edit */
  endCellEdit() {
    const column = this.column;
    const input = this.editor?.input;
    const editorType = this.editor?.type;
    input?.offEvent('focusout', input);

    if (editorType === 'input') {
      input?.setDirtyTracker(input?.value as any);
      (<IdsInput>input)?.checkValidation();
    }

    if (editorType === 'dropdown' || editorType === 'timepicker' || editorType === 'datepicker') {
      (<IdsDropdown>input)?.input?.checkValidation();
    }

    const isDirty = column.editor?.editorSettings?.dirtyTracker && (input?.isDirty || input?.input.isDirty);
    const isValid = column.editor?.editorSettings?.validate ? input?.isValid : true;
    const newValue = this.editor?.save(this);
    this.#saveCellValue(newValue?.value);

    // Save dirty and valid state on the row
    if (isDirty) this.#saveDirtyState(newValue?.dirtyCheckValue ?? newValue?.value);
    if (!isValid) this.#saveValidState(input?.validationMessages);
    if (this.isInValid && isValid) this.#resetValidState();

    this.editor?.destroy(this);
    this.renderCell();
    this.isEditing = false;
    this.classList.remove('is-editing');

    this.dataGrid?.triggerEvent('endcelledit', this.dataGrid, {
      detail: {
        elem: this, editor: this.editor, column, data: this.dataGrid.data[this.row]
      }
    });
    this.dataGrid.activeCellEditor = undefined;
  }

  /** Cancel Cell Edit */
  cancelCellEdit() {
    const column = this.column;
    const input = this.editor?.input;
    input?.offEvent('focusout', input);
    input?.setDirtyTracker(input?.value as any);

    this.dataGrid?.updateDataset(this.row, { [String(column?.field)]: this.originalValue });
    this.editor?.destroy(this);
    this.renderCell();
    this.isEditing = false;
    this.classList.remove('is-editing');

    this.dataGrid?.triggerEvent('cancelcelledit', this.dataGrid, {
      detail: {
        elem: this,
        editor: this.editor,
        column,
        data: this.dataGrid.data[this.row],
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
    this.dataGrid.resetCache(this.dataGrid?.activeCell.row);
    if (column.editor?.editorSettings?.mask === 'date') {
      newValue = this.dataGrid.localeAPI.parseDate(newValue, column.formatOptions);
    }
    this.dataGrid?.updateDataset(this.row, {
      [String(column?.field)]: newValue,
    });
  }

  /**
   * Save the dirty state info on the row
   * @param {boolean} newValue the current value
   */
  #saveDirtyState(newValue: any) {
    let rowDirtyCells = this.dataGrid.data[this.row].dirtyCells;
    if (rowDirtyCells === undefined) rowDirtyCells = [];
    const cell = Number(this.getAttribute('aria-colindex')) - 1;
    const previousCellInfo = rowDirtyCells.filter((item: any) => item.cell === cell);

    if (previousCellInfo[0] && newValue === previousCellInfo[0].originalValue) {
      const oldIndex = rowDirtyCells.findIndex((item: any) => item.cell === cell);
      rowDirtyCells.splice(oldIndex, 1);
      // Value was reset
      this?.classList.remove('is-dirty');
      this.dataGrid?.updateDataset(this.row, {
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
      this.dataGrid?.updateDataset(this.row, {
        dirtyCells: rowDirtyCells
      });
    }
  }

  /**
   * Save the validation state info on the row
   * @param {any} validationMessages the current value
   */
  #saveValidState(validationMessages: any) {
    let rowInvalidCells = this.dataGrid.data[this.row].invalidCells;
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
      this.dataGrid?.updateDataset(this.row, {
        invalidCells: rowInvalidCells
      });
    }
  }

  /**
   * Set back the valid state
   */
  #resetValidState() {
    this?.classList.remove('is-invalid');
    this.dataGrid?.updateDataset(this.row, {
      invalidCells: undefined
    });
    this.isInValid = false;
  }

  // NOTE: check memory footprint of this caching strategy
  static cellCache: { [key: string]: string } = {};

  /**
   * Return the Template for the cell contents
   * @param {object} row The data item for the row
   * @param {object} column The column data for the row
   * @param {object} rowIndex The running row-index
   * @param {IdsDataGrid} dataGrid The dataGrid instance
   * @returns {string} The template to display
   */
  static template(row: Record<string, unknown>, column: IdsDataGridColumn, rowIndex: number, dataGrid: IdsDataGrid): string {
    const cacheHash = dataGrid.cacheHash;
    const selected = row.rowSelected ? 'select' : 'deselect';
    const cacheKey = `${cacheHash}:${column.id}:${rowIndex}:${selected}`;

    // NOTE: This is how we could disable cache until a proper cache-busting strategy is in place
    // delete IdsDataGridCell.cellCache[cacheKey];

    // NOTE: this type of param-based caching is good for upscroll when revising rows that have been seen already.
    // NOTE: we also need a content-cache that caches based on the actual data that's being rendered
    // NOTE: content-cache should probably be done in the IdsDataGridFormatters class
    if (!IdsDataGridCell.cellCache[cacheKey]) {
      const dataGridFormatters = (dataGrid.formatters as any);
      let template = '';

      if (!dataGridFormatters[column?.formatter?.name || 'text'] && column?.formatter) template = column?.formatter(row, column, rowIndex, dataGrid);
      else template = dataGridFormatters[column?.formatter?.name || 'text'](row, column, rowIndex, dataGrid);

      if (row.invalidCells) {
        const message = (row.invalidCells as any).find((info: any) => info.cell === dataGrid.columnIdxById(column.id));
        if (message) template += `<ids-alert icon="error" tooltip="${message?.validationMessages[0]?.message}"></ids-alert>`;
      }
      IdsDataGridCell.cellCache[cacheKey] = template;
    }

    return IdsDataGridCell.cellCache[cacheKey];
  }

  /**
   * Clears cell cache
   */
  clearCache() {
    const cacheHash = this.dataGrid.cacheHash;
    const rowIndex = Number(this.parentElement?.getAttribute('row-index'));
    const row = this.dataGrid.data[rowIndex] as any;
    const selected = row.rowSelected ? 'select' : 'deselect';
    const cacheKey = `${cacheHash}:${this.column.id}:${rowIndex}:${selected}`;

    delete IdsDataGridCell.cellCache[cacheKey];
  }

  /**
   * Refreshes the cell
   */
  refreshCell() {
    this.clearCache();
    this.renderCell();
  }
}
