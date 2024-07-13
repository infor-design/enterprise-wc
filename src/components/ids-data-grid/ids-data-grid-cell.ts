import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import type IdsDropdown from '../ids-dropdown/ids-dropdown';
import type IdsInput from '../ids-input/ids-input';
import type IdsDataGrid from './ids-data-grid';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import type { IdsDataGridColumn } from './ids-data-grid-column';
import { IdsDataGridEditor } from './ids-data-grid-editors';

@customElement('ids-data-grid-cell')
export default class IdsDataGridCell extends IdsElement {
  rootNode?: any;

  isInValid = false;

  /** The editor element */
  editor?: IdsDataGridEditor;

  constructor() {
    super({ noShadowRoot: true });
  }

  connectedCallback(): void {
    // NOTE: bypassing super.connectedCallback() for performance reasons
    this.renderCell();
    this.#attachEventHandlers();
  }

  get isEditable() {
    if (this.classList.contains('is-readonly') || this.classList.contains('is-disabled')) return false;

    const column = this.column;
    if (!column.editor) return false;
    const columnEditor = this.dataGrid.editors.find((editor) => editor.type === column?.editor?.type);
    return !!columnEditor?.editor;
  }

  #attachEventHandlers() {
    this.tabIndex = -1;
    this.setAttribute('tabindex', '-1');

    this.dataGrid?.offEvent('focusin.ids-cell', this);
    this.dataGrid?.onEvent('focusin.ids-cell', this, () => {
      this.tabIndex = 0;
      this.setAttribute('tabindex', '0');

      this.dataGrid?.setAttribute('active-cell', `${this.rowIndex}:${this.columnIndex}`);
      this.dataGrid?.hideOpenMenus();
    });

    this.dataGrid?.offEvent('focusout.ids-cell', this);
    this.dataGrid?.onEvent('focusout.ids-cell', this, () => {
      this.tabIndex = -1;
      this.setAttribute('tabindex', '-1');
    });
  }

  /**
   * Reference to the data grid parent
   * @returns {IdsDataGrid} the data grid parent
   */
  get dataGrid() {
    if (!this.rootNode) this.rootNode = (this.getRootNode() as any).host;
    return (this.rootNode) as IdsDataGrid;
  }

  /**
   * Get the cell above this cell
   * @returns {IdsDataGridCell | null} the cell above this cell
   */
  get cellAbove(): IdsDataGridCell | null {
    return this.dataGrid?.rowByIndex(this.rowIndex - 1)?.cellByIndex(this.columnIndex) ?? null;
  }

  /**
   * Get the cell below this cell
   * @returns {IdsDataGridCell | null} the cell below this cell
   */
  get cellBelow(): IdsDataGridCell | null {
    return this.dataGrid?.rowByIndex(this.rowIndex + 1)?.cellByIndex(this.columnIndex) ?? null;
  }

  /**
   * Get the cell to the left of this cell
   * @returns {IdsDataGridCell | null} the cell to the left of this cell
   */
  get cellLeft(): IdsDataGridCell | null {
    const cellLeft = this.dataGrid?.rowByIndex(this.rowIndex)?.cellByIndex(this.columnIndex - 1);
    if (cellLeft && cellLeft !== this) return cellLeft;

    return this.dataGrid?.rowByIndex(this.rowIndex - 1)?.cellByIndex(this.dataGrid?.columns.length ?? 0) ?? null;
  }

  /**
   * Get the cell to the right of this cell
   * @returns {IdsDataGridCell | null} the cell to the right of this cell
   */
  get cellRight(): IdsDataGridCell | null {
    const cellRight = this.dataGrid?.rowByIndex(this.rowIndex)?.cellByIndex(this.columnIndex + 1) ?? null;
    if (cellRight && cellRight !== this) return cellRight;

    return this.dataGrid?.rowByIndex(this.rowIndex + 1)?.cellByIndex(0) ?? null;
  }

  /**
   * Get the next editable cell to the left of this cell
   * @returns {IdsDataGridCell | null} the next editabled cell to the left of this cell
   */
  get cellLeftEditable(): IdsDataGridCell | null {
    if (!this.dataGrid?.isEditable) return null;

    let nextCell = this.cellLeft;

    while (nextCell && !nextCell.isEditable) {
      nextCell = nextCell.cellLeft;
    }
    return nextCell;
  }

  /**
   * Get the next editable cell to the right of this cell
   * @returns {IdsDataGridCell | null} the next editabled cell to the right of this cell
   */
  get cellRightEditable(): IdsDataGridCell | null {
    if (!this.dataGrid?.isEditable) return null;

    let nextCell = this.cellRight;

    while (nextCell && !nextCell.isEditable) {
      nextCell = nextCell.cellRight;
    }
    return nextCell;
  }

  /**
   * Update this cell's dataset and refresh
   * @param {string} value the new data for the cell
   * @param {boolean} refresh if true, rerender the cell
   */
  updateData(value: string, refresh = true) {
    const rowIndex = this.rowIndex;
    const record = this.dataGrid?.data[rowIndex];
    const columnIndex = this.columnIndex;

    // a cell exists in a row of a visible-columns
    const visibleColumns = this.dataGrid?.visibleColumns;

    const column = visibleColumns[columnIndex];
    if (!column?.field) return;

    const updatedRecord = {
      ...record,
      [column.field]: value,
    };

    this.editor?.change?.(value);

    if (refresh) {
      this.dataGrid?.updateDatasetAndRefresh?.(this.rowIndex, updatedRecord, false);
    } else {
      this.dataGrid?.updateDataset?.(this.rowIndex, updatedRecord, false);
    }
  }

  /**
   * Get the column definition
   * @returns {IdsDataGridColumn} the current cells column
   */
  get column() {
    return this.dataGrid?.columns[this.columnIndex];
  }

  /**
   * Gets the column # in which this cell exists
   * @returns {number} the column-index
   */
  get columnIndex(): number {
    return Number(this.getAttribute?.('aria-colindex') ?? 0) - 1;
  }

  /**
   * Gets the row-index # in which this cell exists
   * @returns {number} the row-index
   */
  get rowIndex(): number {
    return Number(this.parentElement?.getAttribute?.('row-index') ?? -1);
  }

  /**
   * Get row of table cell
   * @returns {number} table row index
   */
  get row(): number {
    return this.rowIndex;
  }

  /**
   * Get data value of this cell
   * @returns {any} the data value of this cell
   */
  get value(): any {
    // NOTE: the editor is a singleton, so we must ensure the input is still in this cell's DOM.
    if (this.editor && this.contains(this.editor?.input ?? null)) {
      return this.editor?.value?.();
    }

    const column = this.dataGrid?.columns?.[this.columnIndex];
    const record = this.dataGrid?.data?.[this.rowIndex];

    return record?.[(column?.field ?? -1)] ?? this.textContent ?? '';
  }

  get isOnScreen() {
    const dataGrid = this.dataGrid;
    const columnIndex = this.columnIndex;
    const columnHeader = dataGrid?.header?.columns[columnIndex];
    return columnHeader?.hasAttribute('column-onscreen');
  }

  get columnHeader() {
    return this.dataGrid?.header?.columns[this.columnIndex];
  }

  /**
   * Rerender a cell - may be used later
   */
  renderCell() {
    const dataGrid = this.dataGrid;

    if (dataGrid.virtualScroll) {
      const tooManyColumns = dataGrid.columns.length > dataGrid.TOO_MANY_COLUMNS;

      const columnsStale = dataGrid.hasAttribute('columns-stale');
      const columnsFresh = !columnsStale;

      const columnHeaders = this.columnHeader;
      const columnOffScreen = columnHeaders?.hasAttribute('column-offscreen');

      if (tooManyColumns && columnsFresh && columnOffScreen) {
        // NOTE: skip renderCell if cell is NOT on-screen
        return;
      }

      const columnOnScreen = columnHeaders?.hasAttribute('column-onscreen');
      const columnOffScreenLeft = columnHeaders?.hasAttribute('column-offscreen-left');
      const columnOffScreenRight = columnHeaders?.hasAttribute('column-offscreen-right');
      this.toggleAttribute('column-onscreen', columnOnScreen);
      this.toggleAttribute('column-offscreen', columnOffScreen);
      this.toggleAttribute('column-offscreen-left', columnOffScreenLeft);
      this.toggleAttribute('column-offscreen-right', columnOffScreenRight);
    }

    const rowIndex = this.rowIndex;
    const rowData: Record<string, any> | undefined = dataGrid?.data[rowIndex];
    const column = this.column;

    const template = IdsDataGridCell.template(rowData, column, rowIndex, dataGrid);
    if (this.innerHTML !== template) {
      this.innerHTML = template;
    }

    if (column.formatter) this.classList.add(`formatter-${column.formatter.name}`);
  }

  /**
   * Set the active cell for focus
   * @param {boolean} nofocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  activate(nofocus: boolean) {
    this.dataGrid.activeCell.node = this;

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

    this.originalValue = this.value;
    this.editor = columnEditor.editor;
    this.editor.clickEvent = clickEvent;

    const editorType = this.editor.type;
    // Override original value if dropdown
    if (editorType === 'dropdown') {
      this.originalValue = this.querySelector('[data-value]')?.getAttribute('data-value');
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

    // Pass column text alignment rules into the cell editor
    if (column.align) {
      let columnAlign = column.align;
      if (columnAlign === 'left') columnAlign = 'start';
      if (columnAlign === 'right') columnAlign = 'end';
      this.editor?.input?.setAttribute('text-align', `${columnAlign}`);
    }

    // Save on Click Out Event
    if (['datepicker', 'timepicker', 'lookup'].includes(editorType)) {
      this.editor.input?.onEvent('focusout', this.editor.input, () => {
        if (this.editor?.popup?.visible) return;
        setTimeout(() => {
          if (this.contains(this.dataGrid!.shadowRoot!.activeElement)) return;
          this.endCellEdit();
        });
      });
    } else {
      this.editor.input?.onEvent('focusout', this.editor.input, () => {
        this.endCellEdit();
      });
    }

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
    const input = this.editor?.input as any;

    if (!input) return;

    const editorType = (this.editor?.type as string);
    input?.offEvent('focusout', input);

    if (['input', 'tree'].includes(editorType) && input?.setDirtyTracker) {
      input?.setDirtyTracker(input?.value as any);
    }

    if (['input', 'tree'].includes(editorType) && input?.checkValidation) {
      (<IdsInput>input)?.checkValidation();
    }

    if (editorType === 'dropdown') {
      (<IdsDropdown>input)?.input?.checkValidation();
    }

    if (editorType === 'timepicker' || editorType === 'datepicker') {
      (<IdsTriggerField>input)?.checkValidation();
    }

    const isDirty = column.editor?.editorSettings?.dirtyTracker && (input?.isDirty || input?.input.isDirty);
    const isDirtyCheckbox = column.editor?.editorSettings?.dirtyTracker && editorType === 'checkbox';
    const isValid = input?.isValid;
    const newValue = this.editor?.save(this);
    this.#saveCellValue(newValue?.value);

    // Save dirty and valid state on the row
    if (isDirty || isDirtyCheckbox) this.#saveDirtyState(newValue?.dirtyCheckValue ?? newValue?.value);
    if (!isValid) this.#saveValidState(input?.validationMessages);
    if (this.isInValid && isValid) this.#resetValidState();
    this.isInValid = !isValid;

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
    const input = this.editor?.input as any;
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
    this.dataGrid.openMenu = null;
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
      const originalValue = this?.editor?.type === 'checkbox' ? this.originalValue : (this?.editor?.input as any)?.dirty?.original;

      rowDirtyCells.push({
        cell: Number(this?.getAttribute('aria-colindex')) - 1,
        columnId: this.column.id,
        originalValue,
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

  /**
   * Checks on the cell editor to see if its current state allows it to be closed.
   * @returns {boolean} true if the cell editor is able to "close"
   */
  canClose(): boolean {
    if (this.isEditing) return false;
    if (this.editor?.popup?.visible) return false;
    if (this.column?.editor?.inline) return false;

    return true;
  }
}
