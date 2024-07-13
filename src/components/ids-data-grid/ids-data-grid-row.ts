import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { nextUntil } from '../../utils/ids-dom-utils/ids-dom-utils';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsElement from '../../core/ids-element';
import type IdsDataGrid from './ids-data-grid';
import type { IdsDataGridColumn } from './ids-data-grid-column';
import IdsDataGridCell from './ids-data-grid-cell';

@customElement('ids-data-grid-row')
export default class IdsDataGridRow extends IdsElement {
  rootNode?: any;

  constructor() {
    super({ noShadowRoot: true });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.ROW_INDEX,
    ];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === attributes.ROW_INDEX) {
      this.renderRow(Number(newValue));
    }
  }

  connectedCallback(): void {
    // NOTE: bypassing super.connectedCallback() for performance reasons
  }

  /**
   * Reference to the data grid parent
   * @returns {IdsDataGrid} the data grid parent
   */
  get dataGrid() {
    if (!this.rootNode) this.rootNode = (this.getRootNode() as any).host;
    return (this.rootNode) as IdsDataGrid;
  }

  get data(): Record<string, any>[] {
    return this.dataGrid?.data || [];
  }

  get rowData(): Record<string, any> {
    return this.data[this.rowIndex] ?? {};
  }

  get columns(): IdsDataGridColumn[] {
    return this.dataGrid?.columns || [];
  }

  get visibleColumns(): IdsDataGridColumn[] {
    return this.dataGrid?.visibleColumns || [];
  }

  get dimensions() {
    return this.getBoundingClientRect();
  }

  get expandIcon() {
    return this.querySelector('.ids-data-grid-tree-container ids-button ids-icon');
  }

  /**
   * Set the row disabled state.
   * @param {number} value the value
   */
  set disabled(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.removeAttribute('aria-disabled');
    }
  }

  get disabled(): boolean { return this.hasAttribute(attributes.DISABLED); }

  /**
   * Set the row index. This index will be used to popuplate data from ids-data-grid.
   * @param {number} value the index
   */
  set rowIndex(value: number) {
    if (value !== null && value >= 0) {
      this.setAttribute(attributes.ROW_INDEX, String(value));
    } else {
      this.removeAttribute(attributes.ROW_INDEX);
    }
  }

  /**
   * Gets the row index # of this row.
   * @returns {number} the row-index
   */
  get rowIndex(): number { return Number(this.getAttribute(attributes.ROW_INDEX) ?? -1); }

  /** Implements row cache */
  static rowCache: { [key: string]: string } = {};

  /**
   * Return the row from the cache or template.
   * @param {number} row the row index
   * @returns {string} the row's html
   */
  cacheRow(row: number) {
    const cacheHash = this.dataGrid.cacheHash;
    const rowIndex = Number(row);
    const selectState = this.dataGrid.data[row].rowSelected ? 'select' : 'deselect';
    const cacheKey = `${cacheHash}:${rowIndex}:${selectState}`;

    // This is current cache strategy via memoization.
    IdsDataGridRow.rowCache[cacheKey] = IdsDataGridRow.rowCache[cacheKey] ?? this.cellsHTML();
    return IdsDataGridRow.rowCache[cacheKey];
  }

  /**
   * Render the row again from the cache or template.
   * @param {number} row the row index
   */
  renderRow(row: number) {
    const cells = [...this.children] as IdsDataGridCell[];

    // Re-render datagrid cells instead datagrid rows for performance
    if (cells.length === this.visibleColumns.length) {
      [...cells].forEach((cell) => cell?.renderCell?.());
    } else {
      this.innerHTML = this.cacheRow(row);
    }

    this.#setAttributes();
  }

  /**
   * Refreshes the row's cells
   */
  refreshRow(): void {
    this.querySelectorAll<IdsDataGridCell>(':scope > ids-data-grid-cell').forEach((cell) => cell.refreshCell());
    this.#setAttributes();
  }

  /** Set row attributes and classes */
  #setAttributes() {
    const rowIndex = this.rowIndex;
    const rowData = this.rowData;
    const rowExpanded = this.isExpanded();
    const iconType = rowExpanded ? `plusminus-folder-open` : `plusminus-folder-closed`;

    this.setAttribute('data-index', String(rowIndex));
    this.setAttribute('aria-rowindex', String(rowIndex + 1));

    if (rowData?.rowHidden) {
      this.hidden = true;
      this.classList.add('hidden');
      this.setAttribute('hidden', '');
    } else {
      this.hidden = false;
      this.classList.remove('hidden');
      this.removeAttribute('hidden');
    }

    if (rowData?.rowSelected) {
      this.selected = rowData.rowSelected;
    }
    if (!rowData?.rowSelected && this.classList.contains('selected')) {
      this.selected = rowData.rowSelected;
    }

    if (this.dataGrid?.expandableRow) {
      this.setAttribute('aria-expanded', String(!!rowExpanded));
      this.expandIcon?.setAttribute('icon', iconType);

      const childRow = this.querySelector<HTMLElement>('.ids-data-grid-expandable-row');
      if (rowExpanded) {
        childRow?.removeAttribute('hidden');
      } else {
        childRow?.setAttribute('hidden', '');
      }
    }

    if (this.dataGrid?.treeGrid) {
      this.setAttribute('aria-setsize', rowData?.ariaSetSize);
      this.setAttribute('aria-level', rowData?.ariaLevel);
      this.setAttribute('aria-posinset', rowData?.ariaPosinset);

      if (rowData?.children?.length) {
        this.setAttribute('aria-expanded', String(!!rowExpanded));
      } else {
        // End nodes, nodes with no descendant nodes, should not have the aria-expanded attribute because,
        // if they were to have it, they would be incorrectly described to assistive technologies as parent nodes.
        // @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded#treeitems
        this.removeAttribute('aria-expanded');
      }

      if ((rowData?.children as any)?.length) {
        this.expandIcon?.setAttribute('icon', iconType);
      }
    }
  }

  /**
   * Toggle Selection on the row element (via click/keyboard in the main dataGrid)
   */
  toggleSelection() {
    this.dataGrid?.resetCache();
    const isSelected = this.classList.contains('selected');
    const index = Number(this.getAttribute('data-index'));

    if (isSelected && !this.dataGrid?.suppressRowDeselection) this.dataGrid?.deSelectRow(index);
    else this.dataGrid?.selectRow(index);

    this.dataGrid?.triggerEvent('selectionchanged', this.dataGrid, {
      detail: {
        elem: this,
        selectedRows: this.dataGrid?.selectedRows
      }
    });
  }

  /**
   * Toggle Expand/Collpase on the row element
   * @param {boolean} triggerEvent If true, will trigger event
   */
  toggleExpandCollapse(triggerEvent = true) {
    const isExpanded = this.isExpanded();
    const shouldCollapse = isExpanded === true;
    const shouldExpand = !shouldCollapse;

    if (shouldExpand) {
      this.doExpand();
    }
    if (shouldCollapse) {
      this.doCollapse();
    }

    if (triggerEvent) {
      const eventName = shouldExpand ? 'rowexpanded' : 'rowcollapsed';
      this.dataGrid?.triggerEvent(eventName, this.dataGrid, {
        bubbles: true,
        detail: {
          elem: this,
          row: this.rowIndex,
          data: this.rowData,
        }
      });
    }
  }

  /**
   * Toggle activation on the row element
   */
  toggleRowActivation() {
    const isActivated = this.classList.contains('activated');
    const currentRow = Number(this.getAttribute('aria-rowindex')) - 1;

    if (isActivated && !this.dataGrid?.suppressRowDeactivation) {
      this.dataGrid?.deactivateRow(currentRow);
    } else {
      if (this.dataGrid?.activatedRow.index) this.dataGrid?.deactivateRow(this.dataGrid?.activatedRow.index);
      this.dataGrid?.activateRow(currentRow);
    }

    this.dataGrid?.triggerEvent('activationchanged', this.dataGrid, {
      detail: {
        elem: this,
        data: this.dataGrid?.activatedRow,
        row: Number(this.getAttribute('data-index'))
      }
    });
  }

  /**
   * Select/Deselect all child rows
   * @param {boolean} isSelect true or false to select or deselect
   * @private
   */
  toggleChildRowSelection(isSelect: boolean) {
    const level = this?.getAttribute('aria-level');

    nextUntil(this, `[aria-level="${level}"]`).forEach((childRow) => {
      const nodeLevel = Number(childRow.getAttribute('aria-level'));
      if (nodeLevel > Number(level) && this.dataGrid) {
        this.dataGrid.groupSelectsChildren = false;
        if (isSelect) this.dataGrid?.selectRow(Number(childRow.getAttribute('data-index')));
        else this.dataGrid?.deSelectRow(Number(childRow.getAttribute('data-index')));
        this.dataGrid.groupSelectsChildren = true;
      }
    });
  }

  /**
   * Select this row node
   */
  set selected(select: boolean) {
    if (select) {
      this.classList.add('selected');
      this.setAttribute('aria-selected', 'true');

      if (this.dataGrid?.rowSelection === 'mixed') {
        this?.classList.add('mixed');
      }
    } else {
      this.classList.remove('selected');
      this.removeAttribute('aria-selected');
    }
  }

  get selected(): boolean {
    return this.classList.contains('selected');
  }

  /**
   * Updates some attributes/classes on a single row's cells
   * @private
   * @param {number} index the row index
   */
  updateCells(index: number) {
    const row = this;
    const cells = row.children;

    if (cells?.length) {
      [...cells].forEach((cell: Element, columnIndex: number) => {
        const columnData = this.dataGrid?.columns[columnIndex];
        let cssPart = columnData.cssPart || 'cell';

        // Updates selected rows to display the correct CSS part (also activated rows in mixed-selection mode)
        if (
          (this.dataGrid?.rowSelection === 'mixed' && row.classList.contains('activated'))
          || ((this.dataGrid?.rowSelection === 'single' || this.dataGrid?.rowSelection === 'multiple') && row.classList.contains('selected'))
        ) {
          if (columnData.cellSelectedCssPart) cssPart = columnData.cellSelectedCssPart;
          else cssPart = 'cell-selected';
        }

        if (typeof cssPart === 'function') {
          cssPart = cssPart(index, columnIndex);
        }
        cell.setAttribute('part', cssPart);
      });
    }
  }

  /**
   * Return the row's markup
   * @param {Record<string, unknown>} row The row data object
   * @param {number} index The data row index
   * @param {number} ariaRowIndex The indexes for aria-rowindex
   * @param {IdsDataGrid} dataGrid The dataGrid instance
   * @returns {string} The html string for the row
   */
  static template(row: Record<string, unknown>, index: number, ariaRowIndex: number, dataGrid: IdsDataGrid): string {
    let rowClasses = `${row?.rowSelected ? ' selected' : ''}`;
    rowClasses += `${row?.rowSelected && dataGrid?.rowSelection === 'mixed' ? ' mixed' : ''}`;
    rowClasses += `${row?.rowActivated ? ' activated' : ''}`;

    let treeAttrs = '';
    if (dataGrid?.treeGrid) {
      treeAttrs += ` aria-setsize="${row.ariaSetSize}" aria-level="${row.ariaLevel}" aria-posinset="${row.ariaPosinset}"`;
      if ((row.children as any)?.length) {
        treeAttrs += (row.rowExpanded === false) ? ` aria-expanded="false"` : ` aria-expanded="true"`;
      }
    }

    if (dataGrid?.pagination === 'client-side' && dataGrid?.pageNumber > 1) {
      ariaRowIndex += (Number(dataGrid?.pageNumber) - 1) * Number(dataGrid?.pageSize);
    }

    const isHidden = row?.rowHidden ? ' hidden' : '';

    // Set disabled state thru key found in the dataset
    const isRowDisabled = (): boolean => {
      const isTrue = (v: any) => (typeof v !== 'undefined' && v !== null && ((typeof v === 'boolean' && v === true) || (typeof v === 'string' && v.toLowerCase() === 'true')));
      const disabled = row.disabled;
      return isTrue(typeof disabled === 'function' ? disabled(index, row) : disabled);
    };
    const canRowDisabled = isRowDisabled();
    const disabled = canRowDisabled ? ' disabled aria-disabled="true"' : '';

    // Add and remove after to cache a temp disabled key,
    // so no need to run multiple times when rendering columns to check row disabled state
    if (row && canRowDisabled) row.idstempcanrowdisabled = canRowDisabled;

    return `
      <ids-data-grid-row
        row-index="${index}"
        role="row"
        part="row"
        aria-rowindex="${ariaRowIndex}"
        data-index="${index}"
        ${isHidden}
        class="ids-data-grid-row${rowClasses}"
        ${treeAttrs}
        ${disabled}
      >
      </ids-data-grid-row>
    `;
  }

  /**
   * Return the cells' markup
   * @returns {string} The html string for the row
   */
  cellsHTML(): string {
    const index = this.rowIndex;
    const ariaRowIndex = index;
    const row = this.data[index];
    const dataGrid = this.dataGrid;

    const cssPart = (column: IdsDataGridColumn, rowIndex: number, cellIndex: number) => {
      const part = column.cssPart || 'cell';
      if (typeof part === 'function') {
        return part(rowIndex, cellIndex);
      }
      return part;
    };

    const isDirtyCell = (currentRow: Record<string, unknown>, column: IdsDataGridColumn, cell: number): boolean => {
      if (!currentRow.dirtyCells) return false;
      return (currentRow.dirtyCells as any).findIndex((item: any) => item.cell === cell) !== -1;
    };

    const isInvalidCell = (currentRow: Record<string, unknown>, column: IdsDataGridColumn, cell: number): boolean => {
      if (!currentRow.invalidCells) return false;
      return (currentRow.invalidCells as any).findIndex((item: any) => item.cell === cell) !== -1;
    };

    const isReadonly = (column: IdsDataGridColumn, content: string): boolean => {
      if (column.readonly && column?.readonly === true) return true;
      if (typeof column?.readonly === 'function') return column?.readonly(index, content, column, row);
      return false;
    };

    const isColumnDisabled = (column: IdsDataGridColumn, content: string): boolean => {
      if (!column?.disabled) return false;
      if (typeof column?.disabled === 'function') return column?.disabled(index, content, column, row);
      if (typeof column?.disabled === 'boolean') return column?.disabled;
      return false;
    };

    const isUppercase = (column: IdsDataGridColumn, content: string): boolean => {
      if (typeof column?.uppercase === 'function') return column.uppercase('body-cell', column, index, content, row);
      return (column?.uppercase === 'true' || column?.uppercase === true);
    };

    let expandableRowHtml = '';
    if (dataGrid?.expandableRow) {
      const template = injectTemplate(dataGrid?.querySelector(`#${dataGrid?.expandableRowTemplate}`)?.innerHTML || '', row);
      expandableRowHtml = `<div class="ids-data-grid-expandable-row"${this.isExpanded() ? '' : ` hidden`}>${template}</div>`;
    }

    const frozenLast = dataGrid?.leftFrozenColumns.length;
    const cellsHtml = dataGrid?.visibleColumns.map((column: IdsDataGridColumn, j: number) => {
      const content = IdsDataGridCell.template(row, column, ariaRowIndex, dataGrid);
      const hasReadonlyClass = isReadonly(column, content);
      const hasDisabledClass = this.disabled || isColumnDisabled(column, content);
      const hasUppercaseClass = isUppercase(column, content);
      const editorType = column.editor?.type;

      let cssClasses = 'ids-data-grid-cell';
      cssClasses += `${editorType ? ` is-${editorType}` : ''}`;
      cssClasses += `${hasReadonlyClass ? ' is-readonly' : ''}`;
      cssClasses += `${hasDisabledClass ? ' is-disabled' : ''}`;
      cssClasses += `${hasUppercaseClass ? ' is-uppercase' : ''}`;
      cssClasses += `${isDirtyCell(row, column, j) ? ' is-dirty' : ''}`;
      cssClasses += `${isInvalidCell(row, column, j) ? ' is-invalid' : ''}`;
      cssClasses += `${column?.align ? ` align-${column?.align}` : ''}`;
      cssClasses += `${column?.formatter?.name ? ` formatter-${column.formatter.name}` : ''}`;
      cssClasses += `${column?.frozen ? ` frozen frozen-${column?.frozen}${j + 1 === frozenLast ? ' frozen-last' : ''}` : ''}`;
      cssClasses += `${column?.editor && !hasReadonlyClass && !hasDisabledClass ? ` is-editable${column?.editor?.inline ? ' is-inline' : ''}` : ''}`;
      return `<ids-data-grid-cell role="gridcell" part="${cssPart(column, index, j)}" class="${cssClasses}" aria-colindex="${j + 1}">${content}</ids-data-grid-cell>`;
    }).join('');

    // Remove temp disabled key
    if (row?.idstempcanrowdisabled) delete row.idstempcanrowdisabled;

    return `${cellsHtml}${expandableRowHtml}`;
  }

  /**
   * Get the cell HTMLElement
   * @param {number} columnIndex the zero-based column index
   * @returns {IdsDataGridCell} html element for cell
   */
  cellByIndex(columnIndex: number): IdsDataGridCell | null {
    columnIndex = Math.max(columnIndex, 0);
    if (columnIndex === 0) {
      return this.querySelector<IdsDataGridCell>('ids-data-grid-cell') ?? null;
    }

    const cells = this.querySelectorAll<IdsDataGridCell>('ids-data-grid-cell');
    const maxColumnIndex = cells.length - 1;
    columnIndex = Math.min(columnIndex, maxColumnIndex);

    return cells[columnIndex] ?? null;
  }

  /**
   * Is this row currently expanded
   * @returns {boolean} true if expanded
   */
  isExpanded(): boolean {
    const rowData = this.dataGrid.data[this.rowIndex];

    if (this.dataGrid?.expandableRow) {
      // expandableRows are collapsed by default, so only expand if rowExpanded is explicity "true"
      return rowData?.rowExpanded === true;
    }

    // all rows are expanded by default (i.e. tree-grid), unless rowExpanded is explicitly "false"
    return rowData?.rowExpanded !== false;
  }

  /**
   * Expand the row element
   */
  doExpand() {
    this.dataGrid?.updateDataset(this.rowIndex, { rowExpanded: true, rowHidden: false });

    // this.#setAttributes() will do this.setAttribute('aria-expanded', 'true');
    this.#setAttributes();

    if (this.dataGrid?.treeGrid) {
      const level = Number(this.getAttribute('aria-level')) || 1;
      const nextLevel = level + 1;
      let parentExpanded = this.isExpanded();

      nextUntil(this, `[aria-level="${level}"]`).forEach((childRow) => {
        const childAriaLevel = Number(childRow.getAttribute('aria-level')) || 1;
        const shouldExpand = (childAriaLevel === nextLevel) || parentExpanded;
        if (shouldExpand) {
          const childRowIndex = Number(childRow.getAttribute('row-index'));
          this.dataGrid?.updateDataset(childRowIndex, { rowHidden: false });
          childRow.removeAttribute('hidden');
          parentExpanded = (childRow as IdsDataGridRow).isExpanded?.();
        }
      });
    }
  }

  /**
   * Collapse the row element
   */
  doCollapse() {
    this.dataGrid?.updateDataset(this.rowIndex, { rowExpanded: false });

    // this.#setAttributes() will do this.setAttribute('aria-expanded', 'false');
    this.#setAttributes();

    if (this.dataGrid?.treeGrid) {
      const level = Number(this.getAttribute('aria-level')) || 1;

      nextUntil(this, `[aria-level="${level}"]`).forEach((childRow) => {
        const childAriaLevel = Number(childRow.getAttribute('aria-level')) || 1;
        if (childAriaLevel > level) {
          const childRowIndex = Number(childRow.getAttribute('row-index'));
          this.dataGrid?.updateDataset(childRowIndex, { rowHidden: true });
          childRow?.setAttribute('hidden', '');
        }
      });
    }
  }
}
