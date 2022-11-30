import { customElement } from '../../core/ids-decorators';
import { nextUntil } from '../../utils/ids-dom-utils/ids-dom-utils';
import { injectTemplate } from '../../utils/ids-string-utils/ids-string-utils';
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
   * Toggle Selection on the row element (via click/keyboard in the main dataGrid)
   */
  toggleSelection() {
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
   */
  toggleExpandCollapse() {
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
    const visibleRowIndex = Number(this.getAttribute('data-index'));

    this.dataGrid?.triggerEvent(`row${isExpanded ? 'collapsed' : 'expanded'}`, this.dataGrid, {
      detail: {
        elem: this, row: visibleRowIndex, data: this.dataGrid?.data[visibleRowIndex]
      }
    });
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
    const cssPart = (column: IdsDataGridColumn, rowIndex: number, cellIndex: number) => {
      const part = column.cssPart || 'cell';
      if (typeof part === 'function') {
        return part(rowIndex, cellIndex);
      }
      return part;
    };
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

    let expandableRowHtml = '';
    if (dataGrid?.expandableRow) {
      treeAttrs += (row.rowExpanded === true) ? ` aria-expanded="true"` : ` aria-expanded="false"`;
      const template = injectTemplate(dataGrid?.querySelector(`#${dataGrid?.expandableRowTemplate}`)?.innerHTML || '', row);
      expandableRowHtml = `<div class="ids-data-grid-expandable-row"${row.rowExpanded === true ? '' : ` hidden`}>${template}</div>`;
    }

    if (dataGrid?.pagination === 'client-side' && dataGrid?.pageNumber > 1) {
      ariaRowIndex += (Number(dataGrid?.pageNumber) - 1) * Number(dataGrid?.pageSize);
    }

    const frozenLast = dataGrid?.leftFrozenColumns.length;
    const isHidden = row.rowHidden ? ' hidden' : '';

    const cellsHtml = dataGrid?.visibleColumns.map((column: IdsDataGridColumn, j: number) => {
      const content = IdsDataGridCell.template(row, column, ariaRowIndex, dataGrid);
      let cssClasses = 'ids-data-grid-cell';
      cssClasses += `${column?.readonly ? ' readonly' : ''}`;
      cssClasses += `${column?.align ? ` align-${column?.align}` : ''}`;
      cssClasses += `${column?.frozen ? ` frozen frozen-${column?.frozen}${j + 1 === frozenLast ? ' frozen-last' : ''}` : ''}`;
      cssClasses += `${column?.editor ? ` is-editable${column?.editor?.inline ? ' is-inline' : ''}` : ''}`;

      return `<ids-data-grid-cell role="gridcell" part="${cssPart(column, index, j)}" class="${cssClasses}" aria-colindex="${j + 1}">${content}</ids-data-grid-cell>`;
    }).join('');

    return `<ids-data-grid-row role="row" part="row" aria-rowindex="${ariaRowIndex}" data-index="${index}" ${isHidden} class="ids-data-grid-row${rowClasses}"${treeAttrs}>${cellsHtml}${expandableRowHtml}</ids-data-grid-row>`;
  }
}
