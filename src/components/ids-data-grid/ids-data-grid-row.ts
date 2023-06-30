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

  get data(): Record<string, any>[] {
    return this.dataGrid?.data || [];
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

  get rowIndex(): number { return Number(this.getAttribute(attributes.ROW_INDEX) ?? -1); }

  /** Implements row cache */
  static rowCache: { [key: string]: string } = {};

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === attributes.ROW_INDEX) {
      this.renderRow(Number(newValue));
    }
  }

  /**
   * Render the row again from the cache or template.
   * @param {number} row the row index
   */
  renderRow(row: number) {
    const cacheHash = this.dataGrid.cacheHash;
    const rowIndex = Number(row);
    const selectState = this.dataGrid.data[row].rowSelected ? 'select' : 'deselect';
    const cacheKey = `${cacheHash}:${rowIndex}:${selectState}`;

    // This is current cache strategy via memoization.
    IdsDataGridRow.rowCache[cacheKey] = IdsDataGridRow.rowCache[cacheKey] ?? this.cellsHTML();
    this.innerHTML = IdsDataGridRow.rowCache[cacheKey];
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
    const row = this.rowIndex;
    this.setAttribute('data-index', String(row));
    this.setAttribute('aria-rowindex', String(row + 1));

    // Handle Selection
    if (this.dataGrid.data[row]?.rowSelected) {
      this.selected = this.dataGrid.data[row].rowSelected;
    }
    if (!this.dataGrid.data[row]?.rowSelected && this.classList.contains('selected')) {
      this.selected = this.dataGrid.data[row].rowSelected;
    }

    // Handle Tree
    if (this.dataGrid?.treeGrid) {
      this.setAttribute('aria-setsize', this.dataGrid.data[row]?.ariaSetSize);
      this.setAttribute('aria-level', this.dataGrid.data[row]?.ariaLevel);
      this.setAttribute('aria-posinset', this.dataGrid.data[row]?.ariaPosinset);

      if (this.dataGrid.data[row]?.children) {
        this.setAttribute('aria-expanded', this.dataGrid.data[row]?.rowExpanded === false ? 'false' : 'true');
      }
    }

    // Handle Expanded
    if (this.dataGrid.data[row]?.rowExpanded) {
      this.setAttribute('aria-expanded', 'true');
    }
    if (!this.dataGrid.data[row]?.rowExpanded && this.getAttribute('aria-expanded') === 'false') {
      this.setAttribute('aria-expanded', 'false');
    }
    if (!this.dataGrid.data[row]?.rowExpanded && this.dataGrid.expandableRow) {
      this.setAttribute('aria-expanded', 'false');
    }

    // Handle Hidden
    if (this.dataGrid.data[row]?.rowHidden) {
      this.hidden = true;
      this.classList.add('hidden');
    }
    if (!this.dataGrid.data[row]?.rowHidden && this.classList.contains('hidden')) {
      this.hidden = false;
      this.classList.remove('hidden');
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
   * @param {boolean} noTrigger If true, will not trigger event
   */
  toggleExpandCollapse(noTrigger = false) {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';

    // Handle Expand/Collapse for an expandedable row
    if (this.dataGrid?.expandableRow) {
      const childRow = <HTMLElement> this.querySelector('.ids-data-grid-expandable-row');
      if (!isExpanded) childRow.removeAttribute('hidden');
      else childRow.setAttribute('hidden', '');

      this.setAttribute('aria-expanded', String(!isExpanded));
      this.dataGrid?.updateDataset(Number(this.getAttribute('data-index')), { rowExpanded: !isExpanded });
      this.querySelector('.ids-data-grid-tree-container ids-button ids-icon')?.setAttribute('icon', !isExpanded ? 'plusminus-folder-open' : 'plusminus-folder-closed');
    }

    // Handle Expand/Collapse for a tree
    if (this.dataGrid?.treeGrid) {
      this.setAttribute('aria-expanded', String(!isExpanded));
      this.dataGrid?.updateDataset(Number(this.getAttribute('data-index')), { rowExpanded: !isExpanded });
      this.querySelector('.ids-data-grid-tree-container ids-button ids-icon')!.setAttribute('icon', !isExpanded ? 'plusminus-folder-open' : 'plusminus-folder-closed');
      const level = this.getAttribute('aria-level');
      let isParentCollapsed = false;

      nextUntil(this, `[aria-level="${level}"]`).forEach((childRow) => {
        const nodeLevel = Number(childRow.getAttribute('aria-level'));
        if (nodeLevel > Number(level) && !isParentCollapsed) {
          if (isExpanded) childRow.setAttribute('hidden', '');
          else childRow.removeAttribute('hidden');
          this.dataGrid?.updateDataset(Number(childRow.getAttribute('data-index')), { rowHidden: isExpanded });
        }
        if (childRow.getAttribute('aria-expanded')) isParentCollapsed = childRow.getAttribute('aria-expanded') === 'false';
      });
    }

    // Emit an Event
    if (!noTrigger) {
      const visibleRowIndex = Number(this.getAttribute('data-index'));
      this.dataGrid?.triggerEvent(`row${isExpanded ? 'collapsed' : 'expanded'}`, this.dataGrid, {
        bubbles: true,
        detail: {
          elem: this, row: visibleRowIndex, data: this.dataGrid?.data[visibleRowIndex]
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

  /**
   * Updates some attributes/classes on a single row's cells
   * @private
   * @param {number} index the row index
   */
  updateCells(index: number) {
    const row = this;

    const cells = row.querySelectorAll('.ids-data-grid-cell');
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
      if (row.children) {
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
      expandableRowHtml = `<div class="ids-data-grid-expandable-row"${row.rowExpanded === true ? '' : ` hidden`}>${template}</div>`;
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
      cssClasses += `${column?.frozen ? ` frozen frozen-${column?.frozen}${j + 1 === frozenLast ? ' frozen-last' : ''}` : ''}`;
      cssClasses += `${column?.editor && !hasReadonlyClass && !hasDisabledClass ? ` is-editable${column?.editor?.inline ? ' is-inline' : ''}` : ''}`;
      return `<ids-data-grid-cell role="gridcell" part="${cssPart(column, index, j)}" class="${cssClasses}" aria-colindex="${j + 1}">${content}</ids-data-grid-cell>`;
    }).join('');

    // Remove temp disabled key
    if (row?.idstempcanrowdisabled) delete row.idstempcanrowdisabled;

    return `${cellsHtml}${expandableRowHtml}`;
  }
}
