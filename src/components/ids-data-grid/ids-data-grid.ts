import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { deepClone } from '../../utils/ids-deep-clone-utils/ids-deep-clone-utils';

import Base from './ids-data-grid-base';
import IdsDataSource from '../../core/ids-data-source';
import IdsDataGridFormatters from './ids-data-grid-formatters';
import IdsDataGridFilters, { IdsDataGridFilterConditions } from './ids-data-grid-filters';
import '../ids-virtual-scroll/ids-virtual-scroll';

import styles from './ids-data-grid.scss';
import { IdsDataGridColumn, IdsDataGridColumnGroup } from './ids-data-grid-column';

const rowHeights: any = {
  xs: 30,
  sm: 35,
  md: 40,
  lg: 50
};

/**
 * IDS Data Grid Component
 * @type {IdsDataGrid}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part table - the table main element
 * @part body - the table body element
 * @part header - the header element
 * @part header-cell - the header cells
 * @part row - the row elements
 * @part cell - the row cell elements
 */
@customElement('ids-data-grid')
@scss(styles)
export default class IdsDataGrid extends Base {
  constructor() {
    super();
    this.initialized = false;
  }

  /* Returns the header element */
  get header() {
    return this.container.querySelector('.ids-data-grid-header');
  }

  /* Returns the body element */
  get body() {
    return this.container.querySelector('.ids-data-grid-body');
  }

  /* Returns the outside wrapper element */
  get wrapper() {
    return this.container.parentNode;
  }

  connectedCallback() {
    super.connectedCallback();
    this.state = { selectedRows: [], activatedRow: null };
    this.redrawBody();
  }

  /** Reference to datasource API */
  readonly datasource: any = new IdsDataSource();

  /** Filters instance attached to component  */
  readonly filters = new IdsDataGridFilters(this);

  /** API for list of formatters */
  readonly formatters: any = new IdsDataGridFormatters();

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALTERNATE_ROW_SHADING,
      attributes.AUTO_FIT,
      attributes.FILTER_ROW_DISABLED,
      attributes.FILTER_WHEN_TYPING,
      attributes.FILTERABLE,
      attributes.LABEL,
      attributes.LIST_STYLE,
      attributes.ROW_HEIGHT,
      attributes.ROW_SELECTION,
      attributes.SUPPRESS_ROW_DEACTIVATION,
      attributes.SUPPRESS_ROW_DESELECTION,
      attributes.VIRTUAL_SCROLL,
      attributes.MODE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   * @private
   */
  template() {
    if (this?.data.length === 0 && this?.columns.length === 0) {
      return ``;
    }

    let cssClasses = `${this.alternateRowShading ? ' alt-row-shading' : ''}`;
    cssClasses += `${this.listStyle ? ' is-list-style' : ''}`;

    const html = `<div class="ids-data-grid-wrapper">
      <span class="ids-data-grid-sort-arrows"></span>
      <div class="ids-data-grid${cssClasses}"
        role="table" part="table" aria-label="${this.label}"
        data-row-height="${this.rowHeight}"
        mode="${this.mode}">
      ${this.headerTemplate()}
      ${this.bodyTemplate()}
      </div></div>`;

    return html;
  }

  /**
   * Apply the Filter with the currently selected conditions, or the ones passed in.
   * @param {Array} conditions An array of objects with the filter conditions.
   * @returns {void}
   */
  applyFilter(conditions: Array<IdsDataGridFilterConditions>) {
    this.filters?.applyFilter(conditions);
  }

  /**
   * Sync and then redraw body rows
   * @param {boolean} sync Select selected and activated rows
   * @returns {void}
   */
  redrawBody(sync = true) {
    if (sync) {
      this.#syncSelectedRows();
      this.#syncActivatedRow();
    }
    this.#redrawBodyTemplate();
  }

  /**
   * redraw body rows
   * @private
   * @returns {void}
   */
  #redrawBodyTemplate() {
    if ((this.columns.length === 0 && this.data.length === 0) || !this.initialized) {
      return;
    }
    this.body.innerHTML = this.bodyTemplate();
    this.#setHeaderCheckbox();
  }

  /**
   * redraw the list by re applying the template
   * @private
   */
  redraw() {
    if ((this.columns.length === 0 && this.data.length === 0) || !this.initialized) {
      return;
    }

    const header = this.headerTemplate();
    const body = this.bodyTemplate();
    this.container.innerHTML = header + body;
    this.#setColumnWidths();

    // Setup virtual scrolling
    if (this.virtualScroll && this.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.scrollTarget = this.container;

      this.virtualScrollContainer.itemTemplate = (row: any, index: number) => this.rowTemplate(row, index);
      this.virtualScrollContainer.itemHeight = this.rowPixelHeight;
      this.virtualScrollContainer.data = this.data;
    }

    if (this.data.length > 0) {
      this.setActiveCell(0, 0, true);
    }

    this.#applyAutoFit();

    // Set back selection
    this.#setHeaderCheckbox();

    this.#attachEventHandlers();
    this.#attachKeyboardListeners();

    // Attach post filters setting
    this.filters.attachPostFiltersSetting();
  }

  /**
   * Header template markup
   * @returns {string} The template
   * @private
   */
  headerTemplate() {
    const html = `
      <div class="ids-data-grid-header" role="rowgroup" part="header">
        <div role="row" class="ids-data-grid-row">
          ${this.visibleColumns.map((columnData: any, index: number) => `${this.headerCellTemplate(columnData, index)}`).join('')}
        </div>
      </div>
    `;

    return this.columnGroupsTemplate() + html;
  }

  /**
   * Returns the markup for a header cell.
   * @param {IdsDataGridColumn} column The column info
   * @param {number} index The column index
   * @returns {string} The resuling header cell template
   */
  headerCellTemplate(column: IdsDataGridColumn, index: number) {
    const selectionCheckBoxTemplate = `
      <span class="ids-data-grid-checkbox-container">
        <span
          role="checkbox"
          aria-checked="false"
          aria-label="${column.name}"
          class="ids-data-grid-checkbox"
        >
        </span>
      </span>
    `;

    const sortIndicatorTemplate = `
      <span class="sort-indicator">
        <ids-icon icon="dropdown"></ids-icon>
        <ids-icon icon="dropdown"></ids-icon>
      </span>
    `;

    const resizerTemplate = `<span class="resizer"></span>`;
    const reorderTemplate = `<div class="reorderer" draggable="true"><ids-icon icon="drag" size="medium"></ids-icon></div>`;

    const headerContentTemplate = `
      ${(column.id !== 'selectionRadio' && column.id === 'selectionCheckbox') ? selectionCheckBoxTemplate : ''}
      ${(column.id !== 'selectionRadio' && column.id !== 'selectionCheckbox' && column.name) ? column.name : ''}
    `.trim();

    let cssClasses = 'ids-data-grid-header-cell-content';
    cssClasses += column.sortable ? ' is-sortable' : '';

    // Content row cell template
    const headerContentWrapperTemplate = `<span class="${cssClasses}">
        <span class="ids-data-grid-header-text">
          ${headerContentTemplate}
        </span>
        ${column.sortable ? sortIndicatorTemplate : ''}
      </span>${column.resizable ? resizerTemplate : ''}${column.reorderable ? reorderTemplate : ''}`;

    // Filter row cell template
    const headerFilterWrapperTemplate = this.filters?.filterTemplate(column) || '';
    let align = column.align ? ` align-${column.align}` : '';
    if (column.headerAlign) {
      align = ` align-${column.headerAlign}`;
    }

    // Frozen Classes
    const lastFrozen = this.leftFrozenColumns.length;
    const frozen = column?.frozen ? ` frozen frozen-${column?.frozen}${index + 1 === lastFrozen ? ' frozen-last' : ''}` : '';

    // Header cell template
    const html = `
      <span
        class="ids-data-grid-header-cell${align}${frozen}"
        part="header-cell"
        aria-colindex="${index + 1}"
        column-id="${column.id}"
        role="columnheader"
      >
        ${headerContentWrapperTemplate}
        ${headerFilterWrapperTemplate}
      </span>
    `;

    return html;
  }

  /**
   * Returns the markup for the grouped header cells.
   * @returns {string} The resuling header cell template
   */
  columnGroupsTemplate() : string {
    if (!this.columnGroups) {
      return '';
    }
    let columnGroupHtml = `<div class="ids-data-grid-header column-groups" role="rowgroup" part="header">
    <div role="row" class="ids-data-grid-row ids-data-grid-column-groups">`;

    this.columnGroups.forEach((columnGroup: IdsDataGridColumnGroup) => {
      const align = columnGroup.align ? ` align-${columnGroup.align}` : '';

      // Header cell template
      const html = `<span class="ids-data-grid-header-cell${align}" part="header-cell" column-group-id="${columnGroup.id || 'id'}" role="columnheader">
        <span class="ids-data-grid-header-cell-content">
          <span class="ids-data-grid-header-text">
            ${columnGroup.name || ''}
          </span>
        </span>
      </span>`;
      columnGroupHtml += html;
    });

    columnGroupHtml += '</div></div>';

    return columnGroupHtml;
  }

  /**
   * Body template markup
   * @private
   * @returns {string} The template
   */
  bodyTemplate() {
    if (this.virtualScroll) {
      return `
        <ids-virtual-scroll>
          <div class="ids-data-grid-body" part="contents" role="rowgroup"></div>
        </ids-virtual-scroll>
      `;
    }
    return `
      <div class="ids-data-grid-body" part="contents" role="rowgroup">
        ${this.data.map((row: Record<string, any>, index: number) => this.rowTemplate(row, index)).join('')}
      </div>
    `;
  }

  /**
   * Return the row's markup
   * @private
   * @param {Record<string, unknown>} row The row data object
   * @param {number} index The row index for aria
   * @returns {string} The html string for the row
   */
  rowTemplate(row: Record<string, unknown>, index: number) {
    let rowClasses = `${row?.rowSelected ? ' selected' : ''}`;
    rowClasses += `${row?.rowSelected && this.rowSelection === 'mixed' ? ' mixed' : ''}`;
    rowClasses += `${row?.rowActivated ? ' activated' : ''}`;

    const frozenLast = this.leftFrozenColumns.length;

    return `
      <div role="row" part="row" aria-rowindex="${index + 1}" class="ids-data-grid-row${rowClasses}">
        ${this.visibleColumns.map((column: IdsDataGridColumn, j: number) => `
          <span role="cell" part="${this.#cssPart(column, index, j)}" class="ids-data-grid-cell${column?.readonly ? ` readonly` : ``}${column?.align ? ` align-${column?.align}` : ``}${column?.frozen ? ` frozen frozen-${column?.frozen}${j + 1 === frozenLast ? ' frozen-last' : ''}` : ``}" aria-colindex="${j + 1}">
            ${this.cellTemplate(row, column, index + 1, this)}
          </span>
        `).join('')}
      </div>
    `;
  }

  /**
   * Return the dynamic css part to use.
   * @private
   * @param {IdsDataGridColumn} column The row data object
   * @param {number} rowIndex The row's index
   * @param {number} cellIndex The cells's index
   * @returns {string} The html string for the row
   */
  #cssPart(column: IdsDataGridColumn, rowIndex: number, cellIndex: number) {
    const cssPart = column.cssPart || 'cell';
    if (typeof column.cssPart === 'function') {
      return column.cssPart(rowIndex, cellIndex);
    }
    return cssPart;
  }

  /**
   * Render the individual cell using the column formatter
   * @private
   * @param {object} row The data item for the row
   * @param {object} column The column data for the row
   * @param {object} index The running index
   * @param {object} api The entire data grid api
   * @returns {string} The template to display
   */
  cellTemplate(row: Record<string, unknown>, column: IdsDataGridColumn, index: number, api: this) {
    return this.formatters[column?.formatter?.name || 'text'](row, column, index, api);
  }

  /**
   * Handle all triggering and handling of events
   * @private
   */
  #attachEventHandlers() {
    const header = this.shadowRoot.querySelector('.ids-data-grid-header:not(.column-groups)');

    // Add a sort Handler
    this.offEvent('click.sort', header);
    this.onEvent('click.sort', header, (e: any) => {
      // Dont sort on resize
      if (this.isResizing) {
        this.isResizing = false;
        return;
      }

      const sortableHeaderCell = e.target.closest('.is-sortable')?.closest('.ids-data-grid-header-cell');
      if (sortableHeaderCell) {
        this.setSortColumn(
          sortableHeaderCell.getAttribute('column-id'),
          sortableHeaderCell.getAttribute('aria-sort') !== 'ascending'
        );
      }
    });

    // Add a cell click handler
    const body = this.shadowRoot.querySelector('.ids-data-grid-body');
    this.offEvent('click.body', body);
    this.onEvent('click.body', body, (e: any) => {
      const cell = (e.target as any).closest('.ids-data-grid-cell');

      const cellNum = cell.getAttribute('aria-colindex') - 1;
      const row = cell.parentNode;
      const rowNum = row.getAttribute('aria-rowindex') - 1;
      const isHyperlink = this.visibleColumns[cellNum]?.formatter?.name === 'hyperlink' && e.target?.nodeName === 'IDS-HYPERLINK';
      const isButton = this.visibleColumns[cellNum]?.formatter?.name === 'button' && e.target?.nodeName === 'IDS-BUTTON';
      const isClickable = isButton || isHyperlink;

      // Focus Cell
      this.setActiveCell(cellNum, rowNum, isHyperlink);

      // Handle mixed selection
      if (this.rowSelection === 'mixed') {
        if (cell.children[0].classList.contains('ids-data-grid-checkbox-container')) {
          this.#handleRowSelection(row);
        } else {
          this.#handleRowActivation(row);
        }
        return;
      }

      // Handle click callbacks
      if (isClickable && this.visibleColumns[cellNum].click !== undefined && !e.target?.getAttribute('disabled')) {
        (this.visibleColumns[cellNum] as any).click({
          rowData: this.data[rowNum],
          columnData: this.visibleColumns[cellNum],
          event: e
        });
      }

      // Handle selection if not disabled
      this.#handleRowSelection(row);
    });

    // Add a click to the table header
    this.headerCheckbox = this.shadowRoot.querySelector('.ids-data-grid-header .ids-data-grid-checkbox-container .ids-data-grid-checkbox');
    this.offEvent('click.select', this.headerCheckbox);
    this.onEvent('click.select', this.headerCheckbox, (e: any) => {
      if (e.target.classList.contains('checked') || e.target.classList.contains('indeterminate')) {
        this.deSelectAllRows();
      } else {
        this.selectAllRows();
      }
    });

    // Handle the Locale Change
    this.offEvent('languagechange.data-grid-container');
    this.onEvent('languagechange.data-grid-container', this.closest('ids-container'), () => {
      this.redraw();
    });

    this.offEvent('localechange.data-grid-container');
    this.onEvent('localechange.data-grid-container', this.closest('ids-container'), () => {
      this.redraw();
    });

    this.filters?.attachFilterEventHandlers();
    this.#attachResizeHandlers();
    this.#attachReorderHandlers();
  }

  /**
   * Establish Drag handlers for resize
   * Based on https://htmldom.dev/resize-columns-of-a-table/
   * @private
   */
  #attachResizeHandlers() {
    // Track the current position of mouse
    let x = 0;
    let w = 0;
    let columnId = '';

    const header = this.shadowRoot.querySelector('.ids-data-grid-header:not(.column-groups)');
    const mouseMoveHandler = (e: MouseEvent) => {
      // Determine how far the mouse has been moved
      const dx = e.clientX - x;
      // Update the width of column to ${w + dx}px
      this.setColumnWidth(columnId, w + (!this.locale.isRTL() ? dx : -dx));
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      header.style.cursor = '';
      requestAnimationFrame(() => {
        this.isResizing = false;
      });
    };

    // Add a resize Handler
    this.offEvent('mousedown.resize', header);
    this.onEvent('mousedown.resize', header, (e: MouseEvent) => {
      const target = (e.target as any);
      if (!target.classList.contains('resizer')) {
        return;
      }

      // Get the current mouse position
      x = e.clientX;

      // Calculate the current width of column
      const col = target.closest('.ids-data-grid-header-cell');
      const colStyles = window.getComputedStyle(col);
      columnId = col.getAttribute('column-id');
      w = parseInt(colStyles.width, 10);

      // Attach listeners for document's events
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);

      // Import the cursor behavior
      header.style.cursor = 'col-resize';

      // Prevent a click causing a sort
      this.isResizing = true;
    });
  }

  /**
   * Establish Reorder handlers for moving columns
   * @private
   */
  #attachReorderHandlers() {
    const header = this.shadowRoot.querySelector('.ids-data-grid-header:not(.column-groups)');
    const dragArrows = this.wrapper.querySelector('.ids-data-grid-sort-arrows');
    let dragger: HTMLElement;
    let startIndex = 0;

    // Style the Dragger
    this.offEvent('dragstart.resize', header);
    this.onEvent('dragstart.resize', header, (e: DragEvent) => {
      const target = (e.target as any);
      if (!target.classList.contains('reorderer')) {
        return;
      }

      target.parentNode.classList.add('active-drag-column');
      dragger = target.parentNode.cloneNode(true);
      dragger.classList.add('dragging');
      dragger.style.position = 'absolute';
      dragger.style.top = '0';
      dragger.style.left = '-1000px';

      this.header.appendChild(dragger);
      // Based on width of 110
      e?.dataTransfer?.setDragImage(dragger, this.locale.isRTL() ? 100 : 10, 18);
      target.style.position = 'absolute';

      startIndex = target.parentNode.getAttribute('aria-colindex');
    });

    // Show the arrows
    this.offEvent('dragenter.resize', header);
    this.onEvent('dragenter.resize', header, (e: DragEvent) => {
      const cell = (e.target as any).closest('.ids-data-grid-header-cell');
      if (cell.classList.contains('active-drag-column')) return;

      const rect = cell.getBoundingClientRect();
      const curIndex = cell.getAttribute('aria-colindex');
      const cellLeft = rect.left + (startIndex < curIndex ? rect.width + 1 : 1);
      const cellRight = rect.left + (startIndex < curIndex ? 1 : rect.width + 1);

      dragArrows.style.left = `${this.locale.isRTL() ? cellRight : cellLeft}px`;
      dragArrows.style.height = `${rect.height}px`;
      dragArrows.style.display = 'block';

      e.preventDefault();
    });

    // Use a normal cursor (not drag and drop)
    this.offEvent('dragover.resize', header);
    this.onEvent('dragover.resize', header, (e: DragEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      e.dataTransfer!.dropEffect = 'move';
      e.preventDefault();
    });

    // Set everything temp element back to normal
    this.offEvent('dragend.resize', header);
    this.onEvent('dragend.resize', header, (e: DragEvent) => {
      this.header.querySelector('.active-drag-column')?.classList.remove('active-drag-column');
      dragger.remove();
      dragArrows.style.display = 'none';
      e.preventDefault();
    });

    this.offEvent('drop.resize', header);
    this.onEvent('drop.resize', header, (e: DragEvent) => {
      const cell = (e.target as any).closest('.ids-data-grid-header-cell');
      this.moveColumn(startIndex - 1, cell.getAttribute('aria-colindex') - 1);
    });
  }

  /**
   * Move a column to a new position. Can use columnIndex to get the column by id.
   * @param {number} fromIndex The column index to movex
   * @param {number} toIndex The new column index
   */
  moveColumn(fromIndex: number, toIndex: number) {
    const correctFromIndex = this.columnIdxById(this.visibleColumns[fromIndex].id);
    const correctToIndex = this.columnIdxById(this.visibleColumns[toIndex].id);

    const element = this.columns[correctFromIndex];
    this.columns.splice(correctFromIndex, 1);
    this.columns.splice(correctToIndex, 0, element);
    this.redraw();
    this.triggerEvent('columnmoved', this, { detail: { elem: this, fromIndex: correctFromIndex, toIndex: correctToIndex } });
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    // Handle arrow navigation
    this.listen(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'], this, (e: KeyboardEvent) => {
      const key = e.key;
      const rowDiff = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0); //eslint-disable-line
      const cellDiff = key === 'ArrowRight' ? 1 : (key === 'ArrowLeft' ? -1 : 0); //eslint-disable-line

      this.setActiveCell(Number(this.activeCell?.cell) + cellDiff, Number(this.activeCell?.row) + rowDiff);
      e.preventDefault();
      e.stopPropagation();
    });

    // Handle Selection
    this.listen([' '], this, (e: Event) => {
      this.#handleRowSelection(this.rowByIndex(this.activeCell.row));
      e.preventDefault();
    });
    return this;
  }

  /**
   * Set the column widths by generating the lengths in the css grid
   * and setting the css variable.
   * @private
   */
  #setColumnWidths() {
    let colWidths = '';
    const total = this.visibleColumns.length;

    this.visibleColumns.forEach((column: IdsDataGridColumn, index: number) => {
      // Special Columns
      if ((column.id === 'selectionCheckbox' || column.id === 'selectionRadio') && !column.width) {
        column.width = 45;
      }
      // Percent Columns
      if (column.width && typeof column.width === 'string' && column.width.indexOf('%') > -1) {
        colWidths += `minmax(${column.width}, 1fr) `;
      }
      // Other (fr, ch)
      if (column.width && typeof column.width === 'string' && column.width.indexOf('%') === -1) {
        colWidths += `${column.width} `;
      }
      // Fixed pixel
      if (column.width && typeof column.width === 'number') {
        colWidths += `${column.width}px `;
      }
      // Default 110px or stretch to fit
      if (!column.width) {
        colWidths += `minmax(110px, 1fr) `;
      }

      if (column?.frozen && index > 0 && index < total - 1) {
        this.container.style.setProperty(`--ids-data-grid-frozen-column-left-width-${index + 1}`, `${this.visibleColumns[index - 1].width}px`);
      }
    });

    this.container.style.setProperty('--ids-data-grid-column-widths', colWidths);
    this.#setColumnGroupsWidth();
  }

  /**
   * Set one column's width (used for resizing)
   * @param {string} columnId The column id
   * @param {number} width The column id (or field) to sort
   */
  setColumnWidth(columnId: string, width: number) {
    const idx = this.columnIdxById(columnId);
    const column = this.columnDataById(columnId);
    // Constrain to a min and max width
    const minWidth = column.minWidth || 12;
    const maxWidth = column.maxWidth || Number.MAX_SAFE_INTEGER;

    if (this.columns[idx] && width >= minWidth && width <= maxWidth) {
      this.columns[idx].width = width;
      this.#setColumnWidths();
      this.#setColumnGroupsWidth();
    }
    this.triggerEvent('columnresized', this, { detail: { index: idx, column, columns: this.columns } });
  }

  /**
   * Set a column to visible or hidden
   * @param {string} columnId The column id
   * @param {boolean} visible True to hide or false to show
   */
  setColumnVisible(columnId: string, visible: boolean) {
    this.columnDataById(columnId).hidden = !visible;
    this.redraw();
  }

  /**
   * Set the column groups widths based on the provided colspans.
   * With some error handling.
   * @private
   */
  #setColumnGroupsWidth() {
    if (this.columnGroups) {
      let counter = 1;

      const groupElems = this.container.querySelector('.ids-data-grid-column-groups').childNodes;
      this.columnGroups.forEach((group: IdsDataGridColumnGroup, index: number) => {
        let colspan = group.colspan;
        // decrease if hidden
        for (let i = 1; i <= colspan; i++) {
          if (this.columns[counter]?.hidden) {
            colspan -= 1;
          }
          counter++;
        }
        groupElems[index].style.gridColumnStart = `span ${colspan}`;
      });
    }
  }

  /**
   * Set the sort column and sort direction
   * @param {string} id The column id (or field) to sort
   * @param {boolean} ascending Sort ascending (lowest first) or descending (lowest last)
   */
  setSortColumn(id : string, ascending = true) {
    const column = this.columnDataById(id);
    const sortField = column?.field !== column?.id ? column?.field : column?.id;
    this.sortColumn = { id, ascending };
    this.datasource.sort(sortField, ascending, null);
    this.redrawBody();
    this.setSortState(id, ascending);
    this.triggerEvent('sorted', this, { detail: { elem: this, sortColumn: this.sortColumn } });
  }

  /**
   * Set the sort column and sort direction on the UI only
   * @param {string} id The column id (or field) to set
   * @param {boolean} ascending Sort ascending (lowest first) or descending (lowest last)
   */
  setSortState(id: string, ascending = true) {
    const sortedHeaders = [...this.shadowRoot.querySelectorAll('.is-sortable')]
      .map((sorted) => sorted.closest('.ids-data-grid-header-cell'));
    sortedHeaders.forEach((header) => header.removeAttribute('aria-sort'));

    const header = this.shadowRoot.querySelector(`[column-id="${id}"]`);
    if (header && sortedHeaders.includes(header)) {
      header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    }
  }

  /**
   * Get column data by given column id
   * @param {string} columnId The column id
   * @returns {object} The column data
   */
  columnDataById(columnId: string) {
    return this.columns?.filter((column: IdsDataGridColumn) => column.id === columnId)[0];
  }

  /**
   * Get column index by given column id
   * @param {string} columnId The column id
   * @returns {number} The column index
   */
  columnIdxById(columnId: string): number {
    return this.columns?.findIndex((column: IdsDataGridColumn) => column.id === columnId);
  }

  /**
   * Get the visible column data (via hidden attributes)
   * @returns {Array<IdsDataGridColumn>} The visible column data
   */
  get visibleColumns(): Array<IdsDataGridColumn> {
    return this.columns?.filter((column: IdsDataGridColumn) => !column.hidden);
  }

  /**
   * Get the columns frozen on the right
   * @returns {Array<IdsDataGridColumn>} The frozen column data
   */
  get rightFrozenColumns(): Array<IdsDataGridColumn> {
    return this.columns?.filter((column: IdsDataGridColumn) => !column.hidden && column.frozen === 'right');
  }

  /**
   * Get the columns frozen on the left
   * @returns {Array<IdsDataGridColumn>} The frozen column data
   */
  get leftFrozenColumns(): Array<IdsDataGridColumn> {
    return this.columns?.filter((column: IdsDataGridColumn) => !column.hidden && column.frozen === 'left');
  }

  /**
   * Return true if any columns are frozen
   * @returns {Array<IdsDataGridColumn>} The frozen column data
   */
  get hasFrozenColumns(): boolean {
    return this.leftFrozenColumns.length > 0 || this.rightFrozenColumns.length > 0;
  }

  /**
   * Get column data by given column header element
   * @param {HTMLElement} elem The column header element
   * @returns {IdsDataGridColumn} The column data
   */
  columnDataByHeaderElem(elem: HTMLElement) {
    const columnId = elem?.getAttribute('column-id');
    return this.columnDataById(columnId || '');
  }

  /**
   * Set a style on every alternate row for better readability.
   * @param {boolean|string} value true to use alternate row shading
   */
  set alternateRowShading(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'true');
      this.shadowRoot?.querySelector('.ids-data-grid').classList.add('alt-row-shading');
      return;
    }

    this.shadowRoot?.querySelector('.ids-data-grid').classList.remove('alt-row-shading');
    this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'false');
  }

  get alternateRowShading() {
    return stringToBool(this.getAttribute(attributes.ALTERNATE_ROW_SHADING)) || false;
  }

  /**
   * Set the columns of the data grid
   * @param {Array} value The array to use
   */
  set columns(value) {
    this.currentColumns = value ? deepClone(value) : [{ id: '', name: '' }];
    this.redraw();
  }

  get columns() { return this?.currentColumns || [{ id: '', name: '' }]; }

  /**
   * Set the columns groups of the data grid
   * @param {Array} value The array to use
   */
  set columnGroups(value) {
    this.state.columnsGroups = value;
    this.redraw();
  }

  get columnGroups() { return this.state?.columnsGroups || null; }

  /**
   * Set the data of the data grid
   * @param {Array} value The array to use
   */
  set data(value) {
    if (value) {
      this.datasource.data = value;
      this.initialized = true;
      this.redraw();
      return;
    }

    this.datasource.data = null;
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of rows
   * @param {boolean|string} value true to use virtual scrolling
   */
  set virtualScroll(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, 'true');
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
    this.redraw();
  }

  get virtualScroll(): boolean { return stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

  /**
   * Set the aria-label element in the DOM. This should be translated.
   * @param {string} value The aria label
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('aria-label', value);
      return;
    }

    this.removeAttribute(attributes.LABEL);
    this.shadowRoot.querySelector('.ids-data-grid').setAttribute('aria-label', 'Data Grid');
  }

  get label(): string { return this.getAttribute(attributes.LABEL) || 'Data Grid'; }

  /**
   * Set the row height between extra-small, small, medium and large (default)
   * @param {string} value The row height
   */
  set rowHeight(value) {
    if (value) {
      this.setAttribute(attributes.ROW_HEIGHT, value);
      this.shadowRoot?.querySelector('.ids-data-grid').setAttribute('data-row-height', value);
    } else {
      this.removeAttribute(attributes.ROW_HEIGHT);
      this.shadowRoot?.querySelector('.ids-data-grid').setAttribute('data-row-height', 'lg');
    }

    if (this.virtualScroll) {
      this.redraw();
    }
  }

  get rowHeight() { return this.getAttribute(attributes.ROW_HEIGHT) || 'lg'; }

  /**
   * Set the style of the grid to list style for simple readonly lists
   * @param {boolean} value list styling to use
   */
  set listStyle(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.LIST_STYLE, value);
      this.shadowRoot?.querySelector('.ids-data-grid').classList.add('is-list-style');
    } else {
      this.removeAttribute(attributes.LIST_STYLE);
      this.shadowRoot?.querySelector('.ids-data-grid').classList.remove('is-list-style');
    }
  }

  get listStyle() { return stringToBool(this.getAttribute(attributes.LIST_STYLE)) || false; }

  /**
   * Set the row selection mode between false, 'single', 'multiple' and 'mixed'
   * @param {string|boolean} value selection mode to use
   */
  set rowSelection(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ROW_SELECTION, value);
    } else {
      this.removeAttribute(attributes.ROW_SELECTION);
    }
  }

  get rowSelection() { return this.getAttribute(attributes.ROW_SELECTION) || false; }

  /**
   * Set to true to prevent rows from being deselected if click or space bar the row.
   * i.e. once a row is selected, it remains selected until another row is selected in its place.
   * @param {string|boolean} value true or false
   */
  set suppressRowDeselection(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_ROW_DESELECTION, value);
    } else {
      this.removeAttribute(attributes.SUPPRESS_ROW_DESELECTION);
    }
  }

  get suppressRowDeselection() { return this.getAttribute(attributes.SUPPRESS_ROW_DESELECTION) || false; }

  /**
   * Set to true to prevent rows from being deactivated if clicked.
   * i.e. once a row is activated, it remains activated until another row is activated in its place.
   * @param {string|boolean} value true or false
   */
  set suppressRowDeactivation(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_ROW_DEACTIVATION, value);
    } else {
      this.removeAttribute(attributes.SUPPRESS_ROW_DEACTIVATION);
    }
  }

  get suppressRowDeactivation() { return this.getAttribute(attributes.SUPPRESS_ROW_DEACTIVATION) || false; }

  /**
   * Resync the selected rows array's indexes
   * @private
   */
  #syncSelectedRows() {
    this.state.selectedRows = [];
    this.data?.forEach((row: any, index: number) => {
      if (row.rowSelected) {
        this.state.selectedRows.push(index);
      }
    });
  }

  /**
   * Resync the selected rows array's indexes
   * @private
   */
  #syncActivatedRow() {
    this.state.activatedRow = null;
    this.data?.forEach((row: any, index: number) => {
      if (row.rowActivated) {
        this.state.activatedRow = index;
      }
    });
  }

  /**
   * Get the selected rows
   * @returns {Array<object>} An array of all currently selected rows
   */
  get selectedRows() {
    const selectedIndex = this.state.selectedRows;
    return selectedIndex.map((index: number) => ({ index, data: this.data[index] }));
  }

  /**
   * Get the activated row
   * @returns {any} The index of the selected row
   */
  get activatedRow(): any {
    if (this.state.activatedRow == null) {
      return null;
    }
    return { index: this.state.activatedRow, data: this.data[this.state.activatedRow] };
  }

  /**
   * Handle selection via click/keyboard
   * @param {HTMLElement} row the row that was clicked
   */
  #handleRowSelection(row: any) {
    if (this.rowSelection === false) {
      return;
    }
    const isSelected = row.classList.contains('selected');
    if (isSelected && !this.suppressRowDeselection) {
      this.deSelectRow(row.getAttribute('aria-rowindex') - 1);
    } else {
      const index = row.getAttribute('aria-rowindex') - 1;
      // Already selected
      if (this.state.selectedRows.includes(index)) {
        return;
      }
      this.selectRow(index);
    }

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        selectedRows: this.selectedRows
      }
    });
  }

  /**
   * Handle activation via click/keyboard
   * @param {number} row the row that was clicked
   */
  #handleRowActivation(row: any) {
    const isActivated = row.classList.contains('activated');
    const currentRow = row.getAttribute('aria-rowindex') - 1;

    if (isActivated && !this.suppressRowDeactivation) {
      this.deActivateRow(currentRow);
    } else {
      this.deActivateRow(this.state.activatedRow);
      this.activateRow(currentRow);
    }

    this.triggerEvent('activationchanged', this, {
      detail: {
        elem: this,
        activatedRow: this.state.activatedRow,
        row
      }
    });
  }

  /**
   * Get the row HTMLElement
   * @param {number} index the zero based index
   * @returns {HTMLElement} The HTMLElement
   */
  rowByIndex(index: number) {
    return this.shadowRoot.querySelector(`.ids-data-grid-body .ids-data-grid-row[aria-rowindex="${index + 1}"]`);
  }

  /**
   * Set a row to selected
   * @param {number} index the zero based index
   */
  selectRow(index: any) {
    let row = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row.querySelector('.ids-data-grid-checkbox');
      checkbox?.classList.add('checked');
      checkbox?.setAttribute('aria-checked', 'true');
    }

    if (this.rowSelection === 'single') {
      this.deSelectAllRows();
      const radio = row.querySelector('.ids-data-grid-radio');
      radio?.classList.add('checked');
      radio?.setAttribute('aria-checked', 'true');
    }

    row.classList.add('selected');
    if (this.rowSelection === 'mixed') {
      row.classList.add('mixed');
    }
    this.state.selectedRows.push(index);
    (this.data[index] as any).rowSelected = true;

    this.triggerEvent('rowselected', this, {
      detail: {
        elem: this, row, data: this.data[index]
      }
    });
    this.#setHeaderCheckbox();
  }

  /**
   * Set a row to be deselected
   * @param {number} index the zero based index
   */
  deSelectRow(index: any) {
    let row = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection === 'mixed') {
      row.classList.remove('mixed');
    }
    row.classList.remove('selected');

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row.querySelector('.ids-data-grid-checkbox');
      checkbox?.classList.remove('checked');
      checkbox?.setAttribute('aria-checked', 'false');
    }

    if (this.rowSelection === 'single') {
      const radio = row.querySelector('.ids-data-grid-radio');
      radio?.classList.remove('checked');
      radio?.setAttribute('aria-checked', 'false');
    }

    this.state.selectedRows = this.state.selectedRows.filter((rowNumber: any) => rowNumber !== index);
    (this.data[index] as any).rowSelected = undefined;

    this.triggerEvent('rowdeselected', this, {
      detail: {
        elem: this, row, data: this.data[index]
      }
    });
    this.#setHeaderCheckbox();
  }

  /**
   * Set a row to activated
   * @param {number} index the zero based index
   */
  activateRow(index: number) {
    let row = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection !== 'mixed') {
      return;
    }

    (row as any).classList.add('activated');
    this.state.activatedRow = index;
    (this.data[index] as any).rowActivated = true;

    this.triggerEvent('rowactivated', this, {
      detail: {
        elem: this, row, data: this.data[index], index
      }
    });
  }

  /**
   * Set a row to be deactivated
   * @param {number} index the zero based index
   */
  deActivateRow(index: any) {
    let row = index;
    if (!index) {
      return;
    }

    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection !== 'mixed') {
      return;
    }
    row.classList.remove('activated');
    this.state.activatedRow = null;
    (this.data[index] as any).rowActivated = undefined;

    this.triggerEvent('rowdeactivated', this, {
      detail: {
        elem: this, row, data: this.data[index], index
      }
    });
  }

  /**
   * Set a all rows to be selected
   */
  selectAllRows() {
    this.data?.forEach((row: any, index: number) => {
      this.selectRow(index);
    });

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        selectedRows: this.selectedRows
      }
    });
    this.#setHeaderCheckbox();
  }

  /**
   * Set a all rows to be deselected
   */
  deSelectAllRows() {
    this.data?.forEach((row: any, index: number) => {
      this.deSelectRow(index);
    });

    if (this.rowSelection !== 'single') {
      this.triggerEvent('selectionchanged', this, {
        detail: {
          elem: this,
          selectedRows: this.selectedRows
        }
      });
    }
    this.#setHeaderCheckbox();
  }

  #setHeaderCheckbox() {
    if (!this.rowSelection || this.rowSelection === 'single' || !this.headerCheckbox) {
      return;
    }

    const selectedCount = this.selectedRows.length;
    const dataCount = this.data.length;

    if (selectedCount === 0) {
      this.headerCheckbox.classList.remove('indeterminate');
      this.headerCheckbox.classList.remove('checked');
      this.headerCheckbox.setAttribute('aria-checked', 'false');
      return;
    }

    if (selectedCount === dataCount) {
      this.headerCheckbox.classList.remove('indeterminate');
      this.headerCheckbox.classList.add('checked');
      this.headerCheckbox.setAttribute('aria-checked', 'true');
      return;
    }

    if (selectedCount !== dataCount) {
      this.headerCheckbox.classList.add('indeterminate');
      this.headerCheckbox.setAttribute('aria-checked', 'mixed');
    }
  }

  /**
   * Get the row height in pixels
   * @private
   * @returns {number} The pixel height
   */
  get rowPixelHeight(): any {
    return rowHeights[this.rowHeight];
  }

  /**
   * Set the card to auto fit to its parent size
   * @param {boolean|string|null} value The auto fit
   */
  set autoFit(value) {
    if (stringToBool(value) || value === 'bottom') {
      this.setAttribute(attributes.AUTO_FIT, value);
      return;
    }
    this.removeAttribute(attributes.AUTO_FIT);
  }

  get autoFit(): boolean | string | null {
    const attr = this.getAttribute(attributes.AUTO_FIT);
    if (attr === 'bottom') {
      return attr;
    }
    return stringToBool(attr);
  }

  /**
   * Set the container height
   * @private
   */
  #applyAutoFit() {
    if (this.autoFitSet) {
      return;
    }
    if (this.autoFit === 'bottom') {
      const spaceFromTop = this.getBoundingClientRect().y;
      this.container.style.height = `calc(100vh - ${spaceFromTop + 16}px)`;
      this.autoFitSet = true;
    }
    if (this.autoFit === true) {
      this.container.style.height = '100%';
      this.wrapper.style.height = '100%';
      this.autoFitSet = true;
    }
  }

  /**
   * Set the active cell for focus
   * @param {number} cell The cell to focus (zero based)
   * @param {number} row The row to focus (zero based)
   * @param {boolean} nofocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  setActiveCell(cell: number, row: number, nofocus?: boolean) {
    if (row < 0 || cell < 0 || row > this.data.length - 1 || cell > this.visibleColumns.length - 1) {
      return this.activeCell;
    }

    if (!this.activeCell) {
      this.activeCell = {};
    }

    this.activeCell.cell = cell;
    this.activeCell.row = row;

    const queriedRows = this.shadowRoot.querySelectorAll('.ids-data-grid-body .ids-data-grid-row');
    const rowNode = queriedRows[row]; // exclude header rows
    const queriedCells = rowNode?.querySelectorAll('.ids-data-grid-cell');
    if (queriedCells && queriedCells.length > 0) {
      const cellNode = queriedCells[cell];

      this.activeCell?.node?.removeAttribute('tabindex');
      this.activeCell.node = cellNode;
      cellNode.setAttribute('tabindex', '0');

      if (!nofocus) {
        cellNode.focus();
      }
    }
    this.triggerEvent('activecellchanged', this, { detail: { elem: this, activeCell: this.activeCell } });
    return this.activeCell;
  }

  /**
   * Set filter row to be shown or hidden
   * @private
   * @returns {object} This API object for chaining
   */
  #setFilterRow() {
    const nodes = this.shadowRoot.querySelectorAll('.ids-data-grid-header-cell-filter-wrapper');
    nodes.forEach((n: HTMLElement) => n?.classList?.[this.filterable ? 'remove' : 'add']('hidden'));
    this.triggerEvent(this.filterable ? 'filterrowopened' : 'filterrowclosed', this, {
      detail: { elem: this, filterable: this.filterable }
    });
    return this;
  }

  /**
   * Sets the data grid to be filterable
   * @param {boolean|string} value If true will set filterable
   */
  set filterable(value) {
    const isApply = this.filterable !== stringToBool(value);
    if (typeof value !== 'undefined' && value !== null) {
      this.setAttribute(attributes.FILTERABLE, value);
    } else {
      this.removeAttribute(attributes.FILTERABLE);
    }
    if (isApply) this.#setFilterRow();
  }

  get filterable() {
    const value = this.getAttribute(attributes.FILTERABLE);
    return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterable;
  }

  /**
   * Sets disabled to be filter row
   * @param {boolean|string} value The value
   */
  set filterRowDisabled(value) {
    const isApply = this.filterRowDisabled !== stringToBool(value);
    if (typeof value !== 'undefined' && value !== null) {
      this.setAttribute(attributes.FILTER_ROW_DISABLED, value);
    } else {
      this.removeAttribute(attributes.FILTER_ROW_DISABLED);
    }
    if (isApply) this.filters?.setFilterRowDisabled();
  }

  get filterRowDisabled() {
    const value = this.getAttribute(attributes.FILTER_ROW_DISABLED);
    return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterRowDisabled;
  }

  /**
   * Sets the data grid to filter when typing
   * @param {boolean|string} value The value
   */
  set filterWhenTyping(value) {
    const isApply = this.filterWhenTyping !== stringToBool(value);
    if (typeof value !== 'undefined' && value !== null) {
      this.setAttribute(attributes.FILTER_WHEN_TYPING, value);
    } else {
      this.removeAttribute(attributes.FILTER_WHEN_TYPING);
    }
    if (isApply) this.filters?.setFilterWhenTyping();
  }

  get filterWhenTyping() {
    const value = this.getAttribute(attributes.FILTER_WHEN_TYPING);
    return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterWhenTyping;
  }
}
