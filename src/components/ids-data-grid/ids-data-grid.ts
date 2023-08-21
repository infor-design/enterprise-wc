// Utils
import { customElement, scss } from '../../core/ids-decorators';
import { attributes, IdsDirection } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { requestAnimationTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';
import { next, previous } from '../../utils/ids-dom-utils/ids-dom-utils';
import { exportToCSV, exportToXLSX } from '../../utils/ids-excel-exporter/ids-excel-exporter';
import { eventPath, findInPath } from '../../utils/ids-event-path-utils/ids-event-path-utils';

// Dependencies
import IdsDataSource from '../../core/ids-data-source';
import IdsDataGridFormatters from './ids-data-grid-formatters';
import { editors } from './ids-data-grid-editors';
import IdsDataGridFilters, { IdsDataGridFilterConditions } from './ids-data-grid-filters';
import { containerArguments, containerTypes } from './ids-data-grid-container-arguments';
import { IdsDataGridContextmenuArgs, setContextmenu, getContextmenuElem } from './ids-data-grid-contextmenu';
import { IdsDataGridColumn, IdsDataGridColumnGroup } from './ids-data-grid-column';

import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import {
  IdsDataGridEmptyMessageElements,
  setEmptyMessage,
  resetEmptyMessageElements,
  hideEmptyMessage,
  IdsDataGridToggleEmptyMessage,
  emptyMessageTemplate
} from './ids-data-grid-empty-message';

// Styles
import styles from './ids-data-grid.scss';

// Sub Components
import IdsDataGridHeader from './ids-data-grid-header';
import IdsDataGridRow from './ids-data-grid-row';
import '../ids-virtual-scroll/ids-virtual-scroll';

// Mixins
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsDataGridSaveSettingsMixin from './ids-data-grid-save-settings-mixin';
import IdsDataGridTooltipMixin from './ids-data-grid-tooltip-mixin';
import IdsDataGridCell from './ids-data-grid-cell';
import { ExcelColumn } from '../../utils/ids-excel-exporter/ids-worksheet-templates';

const Base = IdsPagerMixin(
  IdsDataGridSaveSettingsMixin(
    IdsDataGridTooltipMixin(
      IdsKeyboardMixin(
        IdsLocaleMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

/**
 * IDS Data Grid Component
 * @type {IdsDataGrid}
 * @inherits IdsElement
 * @mixes IdsPagerMixin
 * @mixes IdsDataGridTooltipMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @part table - the table main element
 * @part body - the table body element
 * @part header - the header element
 * @part header-cell - the header cells
 * @part row - the row elements
 * @part cell - the cell elements
 */
@customElement('ids-data-grid')
@scss(styles)
export default class IdsDataGrid extends Base {
  initialized = false;

  isResizing = false;

  activeCell: Record<string, any> = {};

  autoFitSet = false;

  currentColumns?: IdsDataGridColumn[];

  sortColumn?: { id: string, ascending: boolean };

  emptyMessageElements?: IdsDataGridEmptyMessageElements;

  cacheHash = Math.random().toString(32).substring(2, 10);

  /**
   * Types for contextmenu.
   */
  contextmenuTypes = { ...containerTypes };

  constructor() {
    super();

    this.initialized = false;
    this.state = {
      menuData: null
    };
  }

  /* Returns the header element */
  get header(): IdsDataGridHeader {
    return this.container?.querySelector('ids-data-grid-header:not(.column-groups)') as IdsDataGridHeader;
  }

  /* Returns the body element */
  get body() {
    return this.container?.querySelector<HTMLElement>('.ids-data-grid-body');
  }

  /* Returns all the row elements in an array */
  get rows(): IdsDataGridRow[] {
    // NOTE: Array.from() seems slower than dotdotdot array-destructuring.
    if (!this.container) return [];
    return [...this.container.querySelectorAll<IdsDataGridRow>('.ids-data-grid-body ids-data-grid-row')];
  }

  /* Returns the outside wrapper element */
  get wrapper() {
    return this.container?.parentNode as HTMLElement | undefined | null;
  }

  connectedCallback() {
    if (this.initialized) this.restoreAllSettings?.();

    super.connectedCallback();
    this.redrawBody();
    setContextmenu.apply(this);
    this.#attachScrollEvents();
  }

  /** Reference to datasource API */
  readonly datasource: IdsDataSource = new IdsDataSource();

  /** Filters instance attached to component  */
  readonly filters = new IdsDataGridFilters(this);

  /** API for list of formatters */
  readonly formatters: IdsDataGridFormatters = new IdsDataGridFormatters();

  /** API for list of editors */
  readonly editors = editors;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ADD_NEW_AT_END,
      attributes.ALTERNATE_ROW_SHADING,
      attributes.AUTO_FIT,
      attributes.DISABLE_CLIENT_FILTER,
      attributes.EMPTY_MESSAGE_DESCRIPTION,
      attributes.EMPTY_MESSAGE_ICON,
      attributes.EMPTY_MESSAGE_LABEL,
      attributes.EDITABLE,
      attributes.EDIT_NEXT_ON_ENTER_PRESS,
      attributes.EXPANDABLE_ROW,
      attributes.EXPANDABLE_ROW_TEMPLATE,
      attributes.FILTER_ROW_DISABLED,
      attributes.FILTER_WHEN_TYPING,
      attributes.FILTERABLE,
      attributes.GROUP_SELECTS_CHILDREN,
      attributes.ID_COLUMN,
      attributes.HEADER_MENU_ID,
      attributes.LABEL,
      attributes.LIST_STYLE,
      attributes.MENU_ID,
      attributes.ROW_HEIGHT,
      attributes.ROW_NAVIGATION,
      attributes.ROW_SELECTION,
      attributes.ROW_START,
      attributes.SHOW_HEADER_EXPANDER,
      attributes.SUPPRESS_CACHING,
      attributes.SUPPRESS_EMPTY_MESSAGE,
      attributes.SUPPRESS_ROW_CLICK_SELECTION,
      attributes.SUPPRESS_ROW_DEACTIVATION,
      attributes.SUPPRESS_ROW_DESELECTION,
      attributes.TREE_GRID,
      attributes.VIRTUAL_SCROLL,
      attributes.UNIQUE_ID,
    ];
  }

  /**
   * @returns {Array<string>} Drawer vetoable events
   */
  vetoableEventTypes = [
    'beforemenushow',
    'beforetooltipshow',
  ];

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
    const emptyMesageTemplate = emptyMessageTemplate.apply(this);

    const html = `<div class="ids-data-grid-wrapper">
        <span class="ids-data-grid-sort-arrows"></span>
        <div class="ids-data-grid${cssClasses}" role="table" part="table" aria-label="${this.label}" data-row-height="${this.rowHeight}">
          ${IdsDataGridHeader.template(this)}
          ${this.bodyTemplate()}
        </div>
        ${emptyMesageTemplate}
        <slot name="menu-container"></slot>
        <slot name="contextmenu"></slot>
        <slot name="header-contextmenu"></slot>
        <slot name="tooltip">
          <ids-tooltip id="tooltip" exportparts="tooltip-popup, tooltip-arrow"></ids-tooltip>
        </slot>
      </div>`;

    return html;
  }

  /**
   * Collapse all expandable or tree rows.
   * @returns {void}
   */
  collapseAll() {
    this.toggleAll(true);
  }

  /**
   * Expand all expandable or tree rows.
   * @returns {void}
   */
  expandAll() {
    this.toggleAll(false);
  }

  /**
   * Toggle collapse/expand all expandable or tree rows.
   * @param {boolean | string} opt false: will expand all, true: will collapse all
   * @returns {void}
   */
  toggleAll(opt: boolean | string = false) {
    const rows: any[] = [];
    opt = String(stringToBool(opt));
    const icons = this.container?.querySelectorAll('.header-expander');
    icons?.forEach((iconEl: any) => {
      if (iconEl) iconEl.icon = `plusminus-folder-${opt === 'true' ? 'closed' : 'open'}`;
    });

    this.rows
      .filter((r: any) => r?.getAttribute('aria-expanded') === opt)
      .forEach((r: any) => {
        const row = Number(r.getAttribute('data-index'));
        rows.push({ row, data: this.data[row] });
        r?.toggleExpandCollapse?.(true);
      });

    this.triggerEvent(`row${opt === 'true' ? 'collapsed' : 'expanded'}`, this, {
      bubbles: true,
      detail: { elem: this, rows }
    });
  }

  /**
   * Toggle the empty message.
   * @param {boolean | number} hide If true, will hide empty message.
   * @returns {void}
   */
  toggleEmptyMessage(hide?: boolean | number): void {
    IdsDataGridToggleEmptyMessage.apply(this, [hide]);
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
   * Sync and then redraw the body section
   * @returns {void}
   */
  redrawBody() {
    this.#redrawBodyTemplate();
    this.pager?.sync?.apply(this);
  }

  /**
   * Redraw the body area
   * @private
   * @returns {void}
   */
  #redrawBodyTemplate() {
    if ((this.columns.length === 0 && this.data.length === 0) || !this.initialized) {
      return;
    }

    if (this.body) this.body.innerHTML = this.bodyInnerTemplate();
    this.#resetLastSelectedRow();
    this.header?.setHeaderCheckbox();
  }

  /**
   * Redraw the list by reapplying the template
   * @private
   */
  redraw() {
    if (this.columns.length === 0 || !this.initialized) {
      return;
    }

    const header = IdsDataGridHeader.template(this);
    const body = this.bodyTemplate();
    if (this.container) this.container.innerHTML = header + body;
    this.#setColumnWidths();

    this.#applyAutoFit();
    this.header?.setHeaderCheckbox();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#attachScrollEvents();
    this.setupTooltip();

    // Attach post filters setting
    this.filters.attachFilterSettings();

    // Set Counts/Totals
    this.#updateRowCount();

    // Show/hide empty message
    this.toggleEmptyMessage();

    // Do some things after redraw
    this.afterRedraw();
  }

  /** Do some things after redraw */
  afterRedraw() {
    const rowStart = this.rowStart || 0;

    // Handle ready state
    const handleReady = () => {
      this.header?.setIsHeaderExpanderCollapsed?.();
      this.triggerEvent('afterrendered', this, { bubbles: true, detail: { elem: this } });
    };

    if (!rowStart) {
      requestAnimationFrame(() => {
        // Set Focus
        this.setActiveCell(0, 0, true);
        handleReady();
      });
    } else {
      requestAnimationTimeout(() => {
        if (this.container) {
          let scrollTopPixels = rowStart * (this.virtualScrollSettings.ROW_HEIGHT);
          if (!this.virtualScrollSettings.ENABLED) {
            const containerTopPosition = this.container.getBoundingClientRect().top;
            scrollTopPixels = this.rowByIndex(rowStart)?.getBoundingClientRect?.()?.y ?? scrollTopPixels;
            scrollTopPixels -= containerTopPosition;
          }

          const headerHeight = this.header?.getBoundingClientRect?.().height ?? 0;
          this.container.scrollTop = scrollTopPixels - headerHeight;
          this.#scrollRowIntoView(rowStart);
          requestAnimationTimeout(() => {
            this.#attachVirtualScrollEvent();
            this.#scrollRowIntoView(this.rowStart);
          }, 150);
          handleReady();
        }
      }, 150);
    }
  }

  /**
   * Contextmenu stuff use for info and events
   * @private
   */
  contextmenuInfo: {
    menu?: IdsPopupMenu,
    target?: HTMLElement,
    callbackArgs?: IdsDataGridContextmenuArgs
  } = {};

  /**
   * Track contextmenu data dynamicly changed by the user.
   * @private
   */
  isDynamicContextmenu = false;

  /**
   * Body template markup
   * @private
   * @returns {string} The template
   */
  bodyTemplate() {
    return `<div class="ids-data-grid-body" part="contents" role="rowgroup">${this.bodyInnerTemplate()}</div>`;
  }

  /**
   * Simple way to clear cache until a better cache-busting strategy is in implemented
   * @param {number|undefined} rowIndex - (optional) row-index to target specific rowCache to clear
   * @returns {void}
   */
  resetCache(rowIndex?: number): void {
    if (rowIndex === 0 || (rowIndex && rowIndex >= 1)) {
      delete IdsDataGridRow.rowCache[rowIndex];
      // return; // TODO: returning currently breaks cell-editor tests... must fix
    }

    IdsDataGridRow.rowCache = {};
    IdsDataGridCell.cellCache = {};
  }

  /**
   * Body inner template markup
   * @private
   * @returns {string} The template
   */
  bodyInnerTemplate() {
    this.resetCache();

    let innerHTML = '';
    const data = this.virtualScroll ? this.data.slice(0, this.virtualScrollSettings.MAX_ROWS_IN_DOM) : this.data;
    for (let index = 0; index < data.length; index++) {
      innerHTML += IdsDataGridRow.template(data[index], index, index + 1, this);
    }
    return innerHTML;
  }

  /**
   * Check if row is selected.
   * @param {number} index The row index
   * @returns {boolean} True, if row is selected
   */
  rowIsSelected(index: number): boolean {
    return !!this.data[index].rowSelected;
  }

  /**
   * Keep flag for last selected row
   * @private
   */
  #lastSelectedRow: number | null = null;

  /**
   * Keep reference to last shifted row
   * @private
   */
  #lastShiftedRow: number | null = null;

  /**
   * Reset flag for last selected row
   * @private
   * @returns {void}
   */
  #resetLastSelectedRow(): void {
    this.#lastSelectedRow = null;
  }

  /**
   * Reset reference to last shifted row
   * @private
   */
  #resetLastShiftedRow(): void {
    this.#lastShiftedRow = null;
  }

  /**
   * Toggle rows selection between given index and last selected
   * @private
   * @param {number} index The row index
   * @returns {void}
   */
  #toggleSelectionInBetween(index: number): void {
    if (this.#lastSelectedRow === null) return;

    const start = Math.min(index, this.#lastSelectedRow);
    const end = Math.max(index, this.#lastSelectedRow);
    const isSelected = this.rowIsSelected(index);
    for (let i = start; i <= end; i++) {
      if (isSelected) this.deSelectRow(i);
      else this.selectRow(i);
    }
    this.#getSelection()?.removeAllRanges?.();
    this.header?.setHeaderCheckbox();

    this.triggerEvent('selectionchanged', this, {
      detail: { elem: this, selectedRows: this.selectedRows }
    });
  }

  /**
   * Get current selection
   * @private
   * @returns {Selection|null} The selection
   */
  #getSelection(): Selection | null {
    if (!(this.shadowRoot as any)?.getSelection) {
      return document.getSelection();
    }
    return (this.shadowRoot as any)?.getSelection();
  }

  /**
   * Handle all triggering and handling of events
   * @private
   */
  #attachEventHandlers() {
    // Add a cell click handler
    const body = this.body;

    this.offEvent('click.body', body);
    this.onEvent('click.body', body, (e: any) => {
      const cell: IdsDataGridCell = (e.target as any).closest('ids-data-grid-cell');
      if (!cell) return;
      if (cell.isEditing) return;

      const cellNum = Number(cell.getAttribute('aria-colindex')) - 1;
      const row = <IdsDataGridRow>cell.parentNode;
      if (row.disabled) return;

      const rowNum = row.rowIndex;

      if (!e.shiftKey) this.#resetLastShiftedRow();

      const isHyperlink = e.target?.nodeName === 'IDS-HYPERLINK' || e.target?.nodeName === 'A';
      const isButton = e.target?.nodeName === 'IDS-BUTTON';
      const isExpandButton = isButton && e.target?.classList.contains('expand-button');
      const isClickable = isButton || isHyperlink;
      const column: IdsDataGridColumn = this.visibleColumns[cellNum];

      // Focus Cell
      this.setActiveCell(cellNum, rowNum, isHyperlink);
      // Handle click callbacks
      if (isClickable && column.click !== undefined && !e.target?.getAttribute('disabled')) {
        column.click(this.data[rowNum], this.visibleColumns[cellNum], e);
      }

      // Fires for each row that is clicked
      this.triggerEvent('rowclick', this, {
        detail: {
          elem: this, row, data: this.data[rowNum]
        }
      });

      // Handle multiple or mixed selection
      const handleMultipleOrMixedSelection = () => {
        if (['multiple', 'mixed'].includes(String(this.rowSelection))) {
          if (e.shiftKey && this.#lastSelectedRow !== null) this.#toggleSelectionInBetween(rowNum);
          else row.toggleSelection();
          this.#lastSelectedRow = rowNum;
        } else row.toggleSelection();
      };

      // Handle Expand/Collapse Clicking
      if (isClickable && isExpandButton) {
        row.toggleExpandCollapse();
        return;
      }

      // Handle mixed selection
      if (this.rowSelection === 'mixed') {
        if (cell.children[0]?.classList.contains('ids-data-grid-checkbox-container')) {
          handleMultipleOrMixedSelection();
        } else {
          row.toggleRowActivation();
        }
        return;
      }

      // Handle selection if not disabled
      if (this.rowSelection !== false && this.rowSelection !== 'mixed') {
        if ((!this.suppressRowClickSelection) || (
          this.suppressRowClickSelection
          && cell.children[0]?.classList.contains('is-selection-checkbox')
        )) handleMultipleOrMixedSelection();
      }

      // Handle Editing
      if (this.editable && column.editor) {
        cell.startCellEdit(e);
      }
    });

    // Add double click to the container
    this.offEvent('dblclick.container', this.container);
    this.onEvent('dblclick.container', this.container, (e: MouseEvent) => {
      this.triggerEvent('dblclick', this, {
        bubbles: true,
        detail: {
          ...containerArguments.apply(this, [e]),
          originalEvent: e
        }
      });
    });

    this.filters?.attachFilterEventHandlers();
    this.attachSaveSettingsEventHandlers?.();
  }

  /**
   * Handle Locale (and language) change
   */
  onLocaleChange = () => {
    this.redraw();
  };

  /**
   * Move a column to a new position. Use `columnIndex` to get the column by id.
   * @param {number} fromIndex The column index to movex
   * @param {number} toIndex The new column index
   */
  moveColumn(fromIndex: number, toIndex: number) {
    if (fromIndex === -1 || toIndex === -1) return;
    const correctFromIndex = this.columnIdxById(this.visibleColumns[fromIndex].id);
    const correctToIndex = this.columnIdxById(this.visibleColumns[toIndex].id);

    const element = this.columns[correctFromIndex];
    this.columns.splice(correctFromIndex, 1);
    this.columns.splice(correctToIndex, 0, element);

    // Move the dirty data
    this.dirtyCells.forEach((dirtyRow: Record<string, any>) => {
      if (dirtyRow.cell === fromIndex) {
        const row: any = this.data[dirtyRow?.row];
        const cellIndex = row.dirtyCells.findIndex((item: any) => item.cell === fromIndex);
        row.dirtyCells[cellIndex].cell = toIndex;
      }
      if (dirtyRow.cell === toIndex) {
        const row: any = this.data[dirtyRow?.row];
        const cellIndex = row.dirtyCells.findIndex((item: any) => item.cell === toIndex);
        row.dirtyCells[cellIndex].cell = fromIndex;
      }
    });

    // Move the validation data
    this.invalidCells.forEach((invalidRow: Record<string, any>) => {
      if (invalidRow.cell === fromIndex) {
        const row: any = this.data[invalidRow?.row];
        const cellIndex = row.invalidCells.findIndex((item: any) => item.cell === fromIndex);
        row.invalidCells[cellIndex].cell = toIndex;
      }
    });

    resetEmptyMessageElements.apply(this);
    this.redraw();
    this.triggerEvent('columnmoved', this, { detail: { elem: this, fromIndex: correctFromIndex, toIndex: correctToIndex } });
    if (this.sortColumn) this.header?.setSortState(this.sortColumn.id, this.sortColumn.ascending);
    this.saveSettings?.();
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    // Handle arrow navigation
    this.listen(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'], this, (e: KeyboardEvent) => {
      const inFilter = findInPath(eventPath(e), '.ids-data-grid-header-cell-filter-wrapper');
      const key = e.key;

      if (!e.shiftKey) this.#resetLastShiftedRow();
      if (inFilter && (key === 'ArrowRight' || key === 'ArrowLeft')) return;
      if (!this.activeCell?.node) return;

      const cellNode = this.activeCell.node;
      const cellNumber = Number(this.activeCell?.cell);
      const rowDiff = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0); //eslint-disable-line
      const cellDiff = key === 'ArrowRight' ? 1 : (key === 'ArrowLeft' ? -1 : 0); //eslint-disable-line
      const nextRow = Number(next(cellNode.parentElement, `:not([hidden])`)?.getAttribute('row-index'));
      const prevRow = Number(previous(cellNode.parentElement, `:not([hidden])`)?.getAttribute('row-index'));
      const rowIndex = key === 'ArrowDown' ? nextRow : prevRow;

      const movingHorizontal = key === 'ArrowLeft' || key === 'ArrowRight';
      const reachedHorizontalBounds = cellNumber < 0 || cellNumber >= this.visibleColumns.length;
      if (movingHorizontal && reachedHorizontalBounds) return;

      const movingVertical = key === 'ArrowDown' || key === 'ArrowUp';
      const reachedVerticalBounds = nextRow >= this.data.length || prevRow < 0;
      if (movingVertical && reachedVerticalBounds) return;

      if (this.activeCellEditor) cellNode.endCellEdit();

      const activateCellNumber = cellNumber + cellDiff;
      const activateRowIndex = rowDiff === 0 ? Number(this.activeCell?.row) : rowIndex;
      this.setActiveCell(activateCellNumber, activateRowIndex);

      // Handle row selection
      if ((this.rowSelection === 'mixed' || this.rowSelection === 'multiple') && movingVertical && e.shiftKey) {
        const previousActiveRow = Number(cellNode.parentElement.getAttribute('row-index'));
        this.#lastShiftedRow ??= previousActiveRow;
        const shiftSelectFrom = Math.min(activateRowIndex, this.#lastShiftedRow);
        const shiftSelectTo = Math.max(activateRowIndex, this.#lastShiftedRow);

        if (Number.isNaN(shiftSelectFrom) || Number.isNaN(shiftSelectTo)) return;

        if (previousActiveRow < shiftSelectFrom || previousActiveRow > shiftSelectTo) {
          this.deSelectRow(previousActiveRow);
        }

        for (let i = shiftSelectFrom; i <= shiftSelectTo; i++) {
          this.selectRow(i);
        }
      }

      if (this.rowSelection === 'mixed' && this.rowNavigation) {
        (cellNode.parentElement as IdsDataGridRow).toggleRowActivation();
      }
      e.preventDefault();
      e.stopPropagation();
    });

    // Handle Selection and Expand
    this.listen([' '], this, (e: Event) => {
      if (this.activeCellEditor) return;
      if (!this.activeCell?.node) return;

      const row = this.rowByIndex(this.activeCell.row)!;
      if (row.disabled) return;

      const button = this.activeCell.node.querySelector('ids-button');
      if (button) {
        button.click();
        e.preventDefault();
        return;
      }

      const child = this.activeCell.node.children[0];
      const isCheckbox = child?.classList.contains('ids-data-grid-checkbox-container')
        && !child?.classList.contains('is-selection-checkbox');
      if (isCheckbox) {
        this.activeCell.node.click();
        e.preventDefault();
        return;
      }
      row.toggleSelection();
      e.preventDefault();
    });

    // Follow links with keyboard and start editing
    this.listen(['Enter'], this, (e: KeyboardEvent) => {
      if (!this.activeCell?.node || findInPath(eventPath(e), '.ids-data-grid-header-cell')) return;

      const row = this.rowByIndex(this.activeCell.row)!;
      if (row.disabled) return;

      const cellNode = this.activeCell.node;
      const hyperlink = cellNode.querySelector('ids-hyperlink');
      const button = cellNode.querySelector('ids-button');
      const customLink = cellNode.querySelector('a');

      if (hyperlink && !hyperlink.container.matches(':focus') && !hyperlink.hasAttribute('disabled')) {
        hyperlink.container.click();
        hyperlink.container.focus();
      }

      if (button && !button.hasAttribute('disabled')) {
        button.click();
      }

      customLink?.click();

      if (customLink) {
        cellNode.focus();
      }
      this.#handleEditMode(e, cellNode);
    });

    // Commit Edit
    this.listen(['F2'], this, () => {
      const cellNode = this.activeCell.node;
      if (this.activeCellEditor) {
        cellNode.endCellEdit();
        cellNode.focus();
      }
    });

    // Cancel Edit
    this.listen(['Escape'], this, () => {
      const cellNode = this.activeCell.node;
      if (this.activeCellEditor) {
        cellNode.cancelCellEdit();
        cellNode.focus();
      }
    });

    // Edit Next
    this.listen(['Tab'], this, (e: KeyboardEvent) => {
      if (this.activeCellEditor) {
        if (e.shiftKey) this.#editAdjacentCell(IdsDirection.Previous);
        else this.#editAdjacentCell(IdsDirection.Next);

        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      return true;
    });

    this.offEvent('keydown.body', this.header);
    this.onEvent('keydown.body', this.header, () => {
      this.activeCell = {};
    });

    // Enter Edit by typing
    this.offEvent('keydown.body', this);
    this.onEvent('keydown.body', this, (e: KeyboardEvent) => {
      const isPrintableKey = e.key.length === 1;
      if (!this.activeCellEditor && isPrintableKey && e.key !== ' ') {
        this.activeCell?.node?.startCellEdit?.();
      }
    });
    return this;
  }

  /**
   * Find the next editable cell and start editing it
   * @private
   * @param {IdsDirection} direction The cell element
   * @returns {IdsDataGridCell} IdsDataGridCell
   */
  #editAdjacentCell(direction: IdsDirection): IdsDataGridCell {
    this.commitCellEdit();

    let nextCell = direction === IdsDirection.Next
      ? next(this.activeCell.node, '.is-editable') as IdsDataGridCell
      : previous(this.activeCell.node, '.is-editable') as IdsDataGridCell;

    const rows = this.body?.querySelectorAll('.ids-data-grid-row');
    if (!nextCell && rows && direction === IdsDirection.Next) {
      for (let index = this.activeCell.row + 1; index < rows.length; index++) {
        const row = rows[index];
        nextCell = next(row.firstChild, '.is-editable') as IdsDataGridCell;
        if (nextCell) break;
      }
    }

    if (!nextCell && rows && direction === IdsDirection.Previous) {
      for (let index = this.activeCell.row - 1; index >= 0; index--) {
        const row = rows[index];
        if ((row.lastChild as Element).classList?.contains('is-editable')) {
          nextCell = row.lastChild as IdsDataGridCell;
          break;
        }
        nextCell = previous(row.lastChild, '.is-editable') as IdsDataGridCell;
        if (nextCell) break;
      }
    }

    if (!nextCell) {
      if (this.addNewAtEnd) {
        this.addRow({});
        return this.#editAdjacentCell(IdsDirection.Next);
      }

      this.activeCell.node.focus();
      this.activeCell.node.startCellEdit();
      return this.activeCell.node;
    }

    const row = Number(nextCell.parentElement?.getAttribute('aria-rowindex')) - 1;
    const cell = Number(nextCell.getAttribute('aria-colindex')) - 1;
    this.setActiveCell(cell, row, true);
    nextCell.startCellEdit();
    return nextCell;
  }

  /**
   * Save or start editing
   * @param {KeyboardEvent} e The cell event
   * @param {IdsDataGridCell} cellNode The cell element
   * @private
   */
  #handleEditMode(e: KeyboardEvent, cellNode: IdsDataGridCell) {
    // Editing Keyboard
    if (this.editable && cellNode.classList.contains('is-editable') && cellNode.classList.contains('is-editing')) {
      cellNode.endCellEdit();
      cellNode.focus();

      if (this.editNextOnEnterPress) {
        this.setActiveCell(Number(this.activeCell?.cell), Number(this.activeCell?.row) + (e.shiftKey ? -1 : 1));
        this.activeCell.node.startCellEdit();
      }
    } else cellNode.startCellEdit();
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
        this.container?.style.setProperty(`--ids-data-grid-frozen-column-left-width-${index + 1}`, `${this.visibleColumns[index - 1].width}px`);
      }
    });

    this.container?.style.setProperty('--ids-data-grid-column-widths', colWidths);
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
    const minWidth = (column as any).minWidth || 12;
    const maxWidth = (column as any).maxWidth || Number.MAX_SAFE_INTEGER;

    if (this.columns[idx] && width >= minWidth && width <= maxWidth) {
      this.columns[idx].width = width;
      this.#setColumnWidths();
      this.#setColumnGroupsWidth();
    }
    this.triggerEvent('columnresized', this, { detail: { index: idx, column, columns: this.columns } });
    this.saveSettings?.();
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

      const groupElems = this.container?.querySelector('.ids-data-grid-column-groups')?.childNodes;
      this.columnGroups.forEach((group: IdsDataGridColumnGroup, index: number) => {
        let colspan = group.colspan;
        // decrease if hidden
        for (let i = 1; i <= colspan; i++) {
          if (this.columns[counter]?.hidden) {
            colspan -= 1;
          }
          counter++;
        }
        (groupElems?.item(index) as HTMLElement)?.style.setProperty('grid-column-start', `span ${colspan}`);
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
    this.datasource.sort(sortField || '', ascending);
    this.redrawBody();
    this.header?.setSortState(id, ascending);
    this.triggerEvent('sorted', this, { detail: { elem: this, sortColumn: this.sortColumn } });
    this.saveSettings?.();
  }

  /**
   * Set the sort column and sort direction on the UI only
   * @param {string} id The column id (or field) to set
   * @param {boolean} ascending Sort ascending (lowest first) or descending (lowest last)
   */
  setSortState(id: string, ascending = true) {
    this.header?.setSortState(id, ascending);
  }

  /**
   * Get column group data by given column group id
   * @param {string} columnGroupId The column group id
   * @returns {object} The column group data
   */
  columnGroupDataById(columnGroupId: string) {
    return this.columnGroups?.filter(
      (columnGroup: IdsDataGridColumnGroup) => columnGroup.id === columnGroupId
    )[0];
  }

  /**
   * Get column group index by given column group id
   * @param {string} columnGroupId The column group id
   * @returns {number} The column group index
   */
  columnGroupIdxById(columnGroupId: string): number {
    return this.columnGroups?.findIndex(
      (columnGroup: IdsDataGridColumn) => columnGroup.id === columnGroupId
    );
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
   * Set to show header expander icon for expandable and tree rows
   * @param {boolean|string} value The value
   */
  set showHeaderExpander(value) {
    if (stringToBool(value)) this.setAttribute(attributes.SHOW_HEADER_EXPANDER, '');
    else this.removeAttribute(attributes.SHOW_HEADER_EXPANDER);
  }

  get showHeaderExpander() {
    return this.hasAttribute(attributes.SHOW_HEADER_EXPANDER);
  }

  /**
   * Set a style on every alternate row for better readability.
   * @param {boolean|string} value true to use alternate row shading
   */
  set alternateRowShading(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'true');
      this.shadowRoot?.querySelector('.ids-data-grid')?.classList.add('alt-row-shading');
      return;
    }

    this.shadowRoot?.querySelector('.ids-data-grid')?.classList.remove('alt-row-shading');
    this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'false');
  }

  get alternateRowShading() {
    return stringToBool(this.getAttribute(attributes.ALTERNATE_ROW_SHADING)) || false;
  }

  /**
   * Set the columns of the data grid
   * @param {Array} value The array to use
   */
  set columns(value: IdsDataGridColumn[] | undefined | null) {
    this.resetCache();
    this.currentColumns = value || [{ id: '', name: '' }];
    this.redraw();
  }

  get columns(): IdsDataGridColumn[] {
    return this.currentColumns || ([{ id: '', name: '', field: '' }]);
  }

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
   * Use this to add more data to the datagrid's existing dataset.
   * This will automatically render additional rows in the datagrid.
   * @param {Array} value The array to use
   */
  appendData(value: Array<Record<string, any>>) {
    if (this.virtualScroll) {
      this.datasource.data = this.data.concat(value);
      this.#appendMissingRows();
    } else {
      this.data = this.data.concat(value);
    }
  }

  /* Append missing rows for virtual-scrolling */
  #appendMissingRows() {
    if (!this.virtualScroll) return;

    const data = this.data;
    const rows = this.rows;
    if (!data.length || !rows.length) return;

    const { MAX_ROWS_IN_DOM } = this.virtualScrollSettings;

    const rowsNeeded = Math.min(data.length, MAX_ROWS_IN_DOM) - rows.length;
    const missingRows: any[] = [];

    const lastRow: any = rows[rows.length - 1];
    const lastRowIndex = lastRow?.rowIndex || 0;

    while (missingRows.length < rowsNeeded) {
      const rowIndex = lastRowIndex + missingRows.length + 1;
      const clonedRow = IdsDataGridRow.template(data[rowIndex], rowIndex, rowIndex + 1, this);
      missingRows.push(clonedRow);
    }

    if (missingRows.length && this.body) {
      this.body.innerHTML += missingRows.join('');
    }
  }

  /**
   * Set the data of the data grid
   * @param {Array} value The array to use
   */
  set data(value: Array<Record<string, any>>) {
    if (value) {
      hideEmptyMessage.apply(this);
      this.datasource.flatten = this.treeGrid;
      this.datasource.data = value;
      this.initialized = true;
      this.redraw();
    } else {
      this.datasource.data = [];
    }
  }

  get data(): Array<Record<string, any>> { return this?.datasource?.data; }

  /**
   * Set empty message description
   * @param {string} value The value
   */
  set emptyMessageDescription(value: string | null) {
    if (typeof value === 'string' && value !== '') {
      this.setAttribute(attributes.EMPTY_MESSAGE_DESCRIPTION, value);
    } else {
      this.removeAttribute(attributes.EMPTY_MESSAGE_DESCRIPTION);
    }
    setEmptyMessage.apply(this);
  }

  get emptyMessageDescription(): string | null {
    return this.getAttribute(attributes.EMPTY_MESSAGE_DESCRIPTION);
  }

  /**
   * Set empty message icon
   * @param {string} value The value
   */
  set emptyMessageIcon(value: string | null) {
    if (typeof value === 'string' && value !== '') {
      this.setAttribute(attributes.EMPTY_MESSAGE_ICON, value);
    } else {
      this.removeAttribute(attributes.EMPTY_MESSAGE_ICON);
    }
    setEmptyMessage.apply(this);
  }

  get emptyMessageIcon(): string | null {
    return this.getAttribute(attributes.EMPTY_MESSAGE_ICON);
  }

  /**
   * Set empty message label
   * @param {string} value The value
   */
  set emptyMessageLabel(value: string | null) {
    if (typeof value === 'string' && value !== '') {
      this.setAttribute(attributes.EMPTY_MESSAGE_LABEL, value);
    } else {
      this.removeAttribute(attributes.EMPTY_MESSAGE_LABEL);
    }
    setEmptyMessage.apply(this);
  }

  get emptyMessageLabel(): string | null {
    return this.getAttribute(attributes.EMPTY_MESSAGE_LABEL);
  }

  /**
   * Set header menu id
   * @param {string} value The header menu id
   */
  set headerMenuId(value) {
    if (value) {
      this.setAttribute(attributes.HEADER_MENU_ID, value);
      return;
    }
    this.removeAttribute(attributes.HEADER_MENU_ID);
  }

  get headerMenuId() { return this.getAttribute(attributes.HEADER_MENU_ID); }

  /**
   * Set the header menu data
   * @param {Array} value The array to use
   */
  set headerMenuData(value) {
    if (this?.header?.state) {
      this.header.state.headerMenuData = value;
    }
    if (!this.isDynamicContextmenu) {
      const headerMenu: any = getContextmenuElem.apply(this, [true]);
      if (headerMenu) headerMenu.data = value;
      setContextmenu.apply(this);
    }
    this.isDynamicContextmenu = false;
  }

  get headerMenuData() { return this?.header?.state?.headerMenuData; }

  /**
   * Set menu id
   * @param {string} value The menu id
   */
  set menuId(value) {
    if (value) {
      this.setAttribute(attributes.MENU_ID, value);
      return;
    }
    this.removeAttribute(attributes.MENU_ID);
  }

  get menuId() { return this.getAttribute(attributes.MENU_ID); }

  /**
   * Set the menu data
   * @param {Array} value The array to use
   */
  set menuData(value) {
    this.state.menuData = value;
    if (!this.isDynamicContextmenu) {
      const menu: any = getContextmenuElem.apply(this);
      if (menu) menu.data = value;
      setContextmenu.apply(this);
    }
    this.isDynamicContextmenu = false;
  }

  get menuData() { return this?.state?.menuData; }

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
   * Some future configurable virtual scroll settings
   * @returns {object} the current settings
   */
  get virtualScrollSettings() {
    const ENABLED = !!this.virtualScroll;
    const ROW_HEIGHT = this.rowPixelHeight || 50;
    const MAX_ROWS_IN_DOM = this.virtualScrollMaxRowsInDOM;
    const BODY_HEIGHT = MAX_ROWS_IN_DOM * ROW_HEIGHT;
    const BUFFER_ROWS = 52;
    const BUFFER_HEIGHT = BUFFER_ROWS * ROW_HEIGHT;
    const RAF_DELAY = 60;
    const DEBOUNCE_RATE = 10;

    return {
      ENABLED,
      ROW_HEIGHT,
      MAX_ROWS_IN_DOM,
      BODY_HEIGHT,
      BUFFER_ROWS,
      BUFFER_HEIGHT,
      RAF_DELAY,
      DEBOUNCE_RATE,
    };
  }

  virtualScrollMaxRowsInDOM = 150;

  /* Attach Events for global scrolling */
  #attachScrollEvents() {
    const virtualScrollSettings = this.virtualScrollSettings;

    this.offEvent('scroll.data-grid', this.container);
    this.onEvent('scroll.data-grid', this.container, () => {
      const scrollTop = this.container!.scrollTop;
      const virtualRowHeight = virtualScrollSettings.ROW_HEIGHT;
      const rowIndex = Math.floor(scrollTop / virtualRowHeight);
      const rows = this.rows;

      const reachedTheTop = rowIndex <= 0;
      const reachedTheBottom = this.container!.offsetHeight + this.container!.scrollTop >= this.container!.scrollHeight;

      if (reachedTheTop) {
        const firstRow: any = rows[0];
        this.#triggerCustomScrollEvent(firstRow.rowIndex, 'start');
      }
      if (reachedTheBottom) {
        const lastRow: any = rows[rows.length - 1];
        this.#triggerCustomScrollEvent(lastRow.rowIndex, 'end');
      }
      if (!reachedTheTop && !reachedTheBottom) {
        this.#triggerCustomScrollEvent(0);
      }
    }, { capture: true, passive: true }); // @see https://javascript.info/bubbling-and-capturing#capturing

    this.#attachVirtualScrollEvent();
  }

  /* Attach Events for virtual scrolling */
  #attachVirtualScrollEvent() {
    if (!this.virtualScroll) return;

    const virtualScrollSettings = this.virtualScrollSettings;
    const virtualRowHeight = virtualScrollSettings.ROW_HEIGHT;

    this.offEvent('scroll.data-grid.virtual-scroll', this.container);
    this.onEvent('scroll.data-grid.virtual-scroll', this.container, (evt) => {
      evt.stopImmediatePropagation();
      this.#handleVirtualScroll(virtualRowHeight);
    }, { capture: true, passive: true });// @see https://javascript.info/bubbling-and-capturing#capturing

    this.offEvent('scrollend.data-grid.virtual-scroll', this.container);
    this.onEvent('scrollend.data-grid.virtual-scroll', this.container, (evt) => {
      evt.stopImmediatePropagation();
      this.#handleVirtualScroll(virtualRowHeight);
    });
  }

  #handleVirtualScroll(rowHeight: number) {
    const rowIndex = Math.floor(this.container!.scrollTop / rowHeight);
    this.#scrollRowIntoView(rowIndex, false);
  }

  #customScrollEventCache: { [key: string]: number } = {};

  /* Trigger API scroll event */
  #triggerCustomScrollEvent(rowIndex: number, eventType?: 'start' | 'end') {
    if (!eventType) {
      this.#customScrollEventCache = {}; // reset event-cache
    } else if (rowIndex !== this.#customScrollEventCache[eventType]) {
      this.#customScrollEventCache[eventType] = rowIndex;

      this.triggerEvent(`scroll${eventType}`, this, {
        bubbles: true,
        composed: true,
        detail: { elem: this, value: rowIndex }
      });
    }
  }

  /**
   * Stores the last request animation from used during virtual scroll.
   * RAFs are recommended in the row-recycling articles we referenced.
   * If we were to take them out, what would happen is the repainting of the browser
   * window would happen during scrolling and we'd errors like "redraw happened during scrolling.
   *
   * One thing to note is RAFs should have as little logic as possible within them
   * and should only contain the CSS+DOM manipulations.
   * It's best to do (as much as possible) logic+calculations outside the RAF,
   * and then when ready to move things around, do those inside the RAF.
   * this keeps the RAF short and sweet, and keeps our FPS-lag low.
   */
  #rafReference = NaN;

  requestAnimationFrame(fnCallback: () => void) {
    if (this.virtualScroll) {
      this.#rafReference = requestAnimationFrame(fnCallback);
    } else {
      fnCallback();
    }
  }

  /**
   * Internal handling of scrolling to row
   * @param {number} rowIndex row index
   */
  #scrollTo(rowIndex: number): void {
    this.rowByIndex(rowIndex)?.scrollIntoView?.();
    const headerHeight = this.header?.clientHeight;
    const scrollHeight = this.container!.scrollHeight;
    const containerHeight = this.container!.clientHeight;
    const scrollTop = this.container!.scrollTop;
    const isScrollBottom = (scrollTop + containerHeight) >= scrollHeight;

    // offset for sticky header height
    if (!isScrollBottom) this.container!.scrollTop -= headerHeight;
  }

  /**
   * Scroll a given row into view
   * @param {number} rowIndex which row to scroll into view.
   */
  scrollRowIntoView(rowIndex: number) {
    this.#scrollRowIntoView(rowIndex);
  }

  /**
   * Scroll a given row into view
   * @param {number} rowIndex which row to scroll into view.
   * @param {boolean} doScroll set to "true" to have the browser perform the scroll action
   */
  #scrollRowIntoView(rowIndex: number, doScroll = true) {
    if (this.#rafReference) cancelAnimationFrame(this.#rafReference);
    const data = this.data;
    const rows = this.rows;
    if (!data.length || !rows.length) return;

    const virtualScrollSettings = this.virtualScrollSettings;

    const maxRowIndex = data.length - 1;
    rowIndex = Math.max(rowIndex, 0);
    rowIndex = Math.min(rowIndex, maxRowIndex);

    if (!this.virtualScroll) {
      this.#scrollTo(rowIndex);
      return;
    }

    const container = this.container!;
    const body = this.body!;

    const firstRow: any = rows[0];
    const lastRow: any = rows[rows.length - 1];
    const firstRowIndex = firstRow.rowIndex;
    const lastRowIndex = lastRow.rowIndex;

    const isAboveFirstRow = rowIndex < firstRowIndex;
    const isBelowLastRow = rowIndex > lastRowIndex;
    const isInRange = !isAboveFirstRow && !isBelowLastRow;
    const reachedTheBottom = lastRowIndex >= maxRowIndex;
    let bufferRowIndex = rowIndex - virtualScrollSettings.BUFFER_ROWS;
    bufferRowIndex = Math.max(bufferRowIndex, 0);
    bufferRowIndex = Math.min(bufferRowIndex, maxRowIndex);

    if (isInRange && doScroll) {
      this.offEvent('scroll.data-grid.virtual-scroll', this.container);
      this.#scrollTo(rowIndex);
      this.#attachVirtualScrollEvent();
      return;
    }

    if (isInRange) {
      // if rowIndex is in range of the currently visible rows:
      // then we should only move rows up or down according to how big the buffer should be.
      const moveRowsDown = bufferRowIndex - firstRowIndex;
      const moveRowsUp = Math.abs(moveRowsDown);

      if (moveRowsDown > 0) {
        if (!reachedTheBottom) {
          this.#recycleTopRowsDown(moveRowsDown);
        }
      } else if (moveRowsUp < virtualScrollSettings.MAX_ROWS_IN_DOM) {
        this.#recycleBottomRowsUp(moveRowsUp);
      } else {
        return; // exit early because nothing to do.
      }
    } else if (isAboveFirstRow) {
      // if rowIndex should appear above the currently visible rows,
      // then we must figure out how many rows we must move up from the bottom to render the rowIndex row
      this.#recycleAllRows(bufferRowIndex);
    } else if (isBelowLastRow) {
      // if rowIndex should appear below the currently visible rows,
      // then we recycle all rows, since none of the visible rows are needed
      this.#recycleAllRows(bufferRowIndex);
    }

    // NOTE: repaint of padding is more performant than margin
    const virtualRowHeight = virtualScrollSettings.ROW_HEIGHT;
    const maxHeight = this.data.length * virtualRowHeight;
    const maxPaddingBottom = maxHeight - virtualScrollSettings.BODY_HEIGHT;
    const firstRowInDom = this.rows[0].rowIndex;
    const bodyTranslateY = firstRowInDom * virtualRowHeight;
    const bodyPaddingBottom = maxPaddingBottom - bodyTranslateY;

    if (!reachedTheBottom) {
      body.style.setProperty('transform', `translateY(${bodyTranslateY}px)`);
    }

    body.style.setProperty('padding-bottom', `${Math.max(bodyPaddingBottom, 0)}px`);

    if (doScroll) {
      container!.scrollTop = rowIndex * virtualRowHeight;
    }
  }

  /* Recycle the rows during scrolling */
  #recycleAllRows(topRowIndex: number) {
    const data = this.data;
    const rows = this.rows;
    if (!data.length || !rows.length) return;

    const veryLastIndex = data.length - 1;
    topRowIndex = Math.min(topRowIndex, veryLastIndex);
    topRowIndex = Math.max(topRowIndex, 0);

    const { MAX_ROWS_IN_DOM } = this.virtualScrollSettings;

    // Using Array.every as an alternaive to using a for-loop with a break
    this.rows.every((row: any, idx) => {
      const nextRowIndex = topRowIndex + idx;
      if (nextRowIndex > veryLastIndex) {
        const moveTheRestToTop = MAX_ROWS_IN_DOM - idx;
        this.#recycleBottomRowsUp(moveTheRestToTop);
        return false;
      }
      row.rowIndex = nextRowIndex;
      return true;
    });
  }

  /* Recycle the rows during scrolling from the top */
  #recycleTopRowsDown(rowCount: number) {
    const rows = this.rows;
    if (!rowCount || !rows.length) return;
    const data = this.data;

    const bottomRow = rows[rows.length - 1];
    const bottomRowIndex = bottomRow.rowIndex;
    const staleRows = rows.slice(0, rowCount);
    const rowsToMove: IdsDataGridRow[] = [];

    // NOTE: Using Array.every as an alternaive to using a for-loop with a break
    staleRows.every((row: IdsDataGridRow, idx) => {
      const nextIndex = bottomRowIndex + (idx + 1);
      if (nextIndex >= data.length) return false;
      row.rowIndex = nextIndex;
      return rowsToMove.push(row);
    });

    if (!rowsToMove.length) return;

    // NOTE: no need to shift rows in the DOM if all the rows need to be recycled
    if (rowsToMove.length >= this.virtualScrollSettings.MAX_ROWS_IN_DOM) return;

    // NOTE: body.append is faster than body.innerHTML
    // NOTE: body.append is faster than multiple calls to appendChild()
    this.body?.append(...rowsToMove);
  }

  /* Recycle the rows during scrolling from the bottom */
  #recycleBottomRowsUp(rowCount: number) {
    const rows = this.rows;
    if (!rowCount || !rows.length) return;

    const topRow = rows[0];
    const topRowIndex = topRow.rowIndex;
    const staleRows = rows.slice((-1 * rowCount));
    const rowsToMove: IdsDataGridRow[] = [];

    // NOTE: Using Array.every as an alternaive to using a for-loop with a break
    staleRows.every((row: any, idx) => {
      const prevIndex = topRowIndex - (idx + 1);
      if (prevIndex < 0) return false;
      row.rowIndex = prevIndex;
      return rowsToMove.push(row);
    });

    if (!rowsToMove.length) return;

    // NOTE: body.prepend() seems to be faster than body.innerHTML
    this.body?.prepend(...rowsToMove.reverse());
  }

  /**
   * Set the aria-label element in the DOM. This should be translated.
   * @param {string} value The aria label
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
      this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('aria-label', value);
      return;
    }

    this.removeAttribute(attributes.LABEL);
    this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('aria-label', 'Data Grid');
  }

  get label(): string { return this.getAttribute(attributes.LABEL) || 'Data Grid'; }

  /**
   * Set the row height between extra-small, small, medium and large (default)
   * @param {string} value The row height
   */
  set rowHeight(value) {
    if (value) {
      this.setAttribute(attributes.ROW_HEIGHT, value);
      this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('data-row-height', value);
    } else {
      this.removeAttribute(attributes.ROW_HEIGHT);
      this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('data-row-height', 'lg');
    }
    this.saveSettings?.();
  }

  get rowHeight() { return this.getAttribute(attributes.ROW_HEIGHT) || 'lg'; }

  /**
   * Set the row index. If set, the datagrid's data set will initially load here.
   * @param {number} rowIndex The row-index at which to start showing data.
   */
  set rowStart(rowIndex: number) {
    this.setAttribute(attributes.ROW_START, String(rowIndex || 0));
  }

  /**
   * Get the start-row index
   * @returns {number} The start-row index
   */
  get rowStart(): number { return Number(this.getAttribute(attributes.ROW_START)) || 0; }

  /**
   * Sets keyboard navigation to rows
   * @param {boolean} value toggle row navigation
   */
  set rowNavigation(value: string | boolean | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ROW_NAVIGATION, '');
      this.container?.classList.add('row-navigation');
    } else {
      this.removeAttribute(attributes.ROW_NAVIGATION);
      this.container?.classList.remove('row-navigation');
    }
  }

  get rowNavigation(): boolean {
    return this.hasAttribute(attributes.ROW_NAVIGATION);
  }

  /**
   * Set the style of the grid to list style for simple readonly lists
   * @param {boolean} value list styling to use
   */
  set listStyle(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.LIST_STYLE, String(value));
      this.shadowRoot?.querySelector('.ids-data-grid')?.classList.add('is-list-style');
    } else {
      this.removeAttribute(attributes.LIST_STYLE);
      this.shadowRoot?.querySelector('.ids-data-grid')?.classList.remove('is-list-style');
    }
  }

  get listStyle() { return stringToBool(this.getAttribute(attributes.LIST_STYLE)) || false; }

  /**
   * Set the row selection mode between false, 'single', 'multiple' and 'mixed'
   * @param {string|boolean} value selection mode to use
   */
  set rowSelection(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ROW_SELECTION, String(value));
    } else {
      this.removeAttribute(attributes.ROW_SELECTION);
    }
  }

  get rowSelection() { return this.getAttribute(attributes.ROW_SELECTION) || false; }

  /**
   * Set suppress empty message
   * @param {string|boolean} value The value
   */
  set suppressEmptyMessage(value: string | boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_EMPTY_MESSAGE, '');
    } else {
      this.removeAttribute(attributes.SUPPRESS_EMPTY_MESSAGE);
    }
    setEmptyMessage.apply(this);
  }

  get suppressEmptyMessage(): boolean {
    return this.hasAttribute(attributes.SUPPRESS_EMPTY_MESSAGE);
  }

  /*
  * Set to true to prevent rows from being selectedd when clicking the row,only the checkbox will select.
  * @param {string|boolean} value true or false
  */
  set suppressRowClickSelection(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_ROW_CLICK_SELECTION, value.toString());
    } else {
      this.removeAttribute(attributes.SUPPRESS_ROW_CLICK_SELECTION);
    }
  }

  get suppressRowClickSelection() { return this.getAttribute(attributes.SUPPRESS_ROW_CLICK_SELECTION) || false; }

  /**
   * Set to true to prevent rows from being deselected if click or space bar the row.
   * i.e. once a row is selected, it remains selected until another row is selected in its place.
   * @param {string|boolean} value true or false
   */
  set suppressRowDeselection(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_ROW_DESELECTION, String(value));
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
      this.setAttribute(attributes.SUPPRESS_ROW_DEACTIVATION, String(value));
    } else {
      this.removeAttribute(attributes.SUPPRESS_ROW_DEACTIVATION);
    }
  }

  get suppressRowDeactivation() { return this.getAttribute(attributes.SUPPRESS_ROW_DEACTIVATION) || false; }

  /**
   * Get the selected rows
   * @returns {Array<object>} An array of all currently selected rows
   */
  get selectedRows(): Array<{ index: number, data: Record<string, unknown> }> {
    return this.data.flatMap((row: Record<string, unknown>, index: number) => {
      if (row.rowSelected) return { index: Number(index), data: row };
      return [];
    });
  }

  /**
   * Get the activated row
   * @returns {any} The index of the selected row
   */
  get activatedRow(): any {
    return this.data.flatMap((row: Record<string, unknown>, index: number) => {
      if (row.rowActivated) return { index: Number(index), data: row };
      return [];
    })[0] || { };
  }

  /**
   * Update the dataset
   * @param {number} row the parent row that was clicked
   * @param {Record<string, unknown>} data the data to apply to the row
   * @param {boolean} isClear do not keep current data
   */
  updateDataset(row: number, data: Record<string, unknown>, isClear?: boolean) {
    // Update the current data
    if (isClear) this.data[row] = data;
    else this.data[row] = { ...this.data[row], ...data };

    // Update the tree element in the original data
    if (this.treeGrid) {
      if (this.data[row].ariaLevel === 1) {
        this.datasource.originalData[this.data[row].originalElement] = {
          ...this.datasource.originalData[this.data[row].originalElement],
          ...data
        };
        return;
      }

      // Update the child element
      const parentRow = this.#findParentRow(this.datasource.originalData, this.data[row].parentElement ?? '');
      if (parentRow) {
        parentRow.children[this.data[row].ariaPosinset - 1] = {
          ...parentRow.children[this.data[row].ariaPosinset - 1],
          ...data
        };
      }
      return;
    }
    // Non tree - update original data
    if (isClear) this.datasource.originalData[row] = data;
    else this.datasource.originalData[row] = { ...this.datasource.originalData[row], ...data };
  }

  /**
   * Update the dataset and refresh
   * @param {number} row the parent row that was clicked
   * @param {Record<string, unknown>} data the data to apply to the row
   * @param {boolean} isClear do not keep current data
   */
  updateDatasetAndRefresh(row: number, data: Record<string, unknown>, isClear?: boolean) {
    this.updateDataset(row, data, isClear);
    this.rowByIndex(row)?.refreshRow();
  }

  /**
   * Find the parent id based on the cached props
   * @param {Array<Record<string, any>>} data the parent row that was clicked
   * @param {string} parentIds the string "1 2" of indexes
   * @returns {Record<string, unknown>} The child record
   */
  #findParentRow(data: Array<Record<string, any>>, parentIds: string): any {
    let childRow: any;
    parentIds.split(' ').forEach((r: string, index: number) => {
      // eslint-disable-next-line eqeqeq
      if (index === 0) childRow = data.find((row: Record<string, any>) => row[this.idColumn] == r);
      // eslint-disable-next-line eqeqeq
      else childRow = childRow.children.find((cRow: Record<string, any>) => cRow.id == r);
    });
    return childRow;
  }

  /**
   * Updates row count attribute on container
   */
  #updateRowCount() {
    this.container?.setAttribute('aria-rowcount', this.rowCount.toString());
  }

  /**
   * Get the row HTMLElement
   * @param {number} rowIndex the zero based index
   * @returns {HTMLElement} Row HTMLElement
   */
  rowByIndex(rowIndex: number): IdsDataGridRow | undefined | null {
    const maxRowIndex = this.data.length - 1;
    rowIndex = Math.max(rowIndex, 0);
    rowIndex = Math.min(rowIndex, maxRowIndex);
    return this.shadowRoot?.querySelector<IdsDataGridRow>(`.ids-data-grid-body ids-data-grid-row[row-index="${rowIndex}"]`);
  }

  activeCellEditor?: IdsDataGridCell;

  /**
   * Commit editing on any active editor
   */
  commitCellEdit() {
    this.activeCellEditor?.endCellEdit();
  }

  /**
   * Cancel editing on any active editor
   */
  cancelCellEdit() {
    this.activeCellEditor?.cancelCellEdit();
  }

  /**
   * Add a row to the data grid
   * @param {Record<string, unknown>} data the data to add to the row
   * @param {number} index insert position for new row
   */
  addRow(data: Record<string, unknown>, index?: number) {
    const insertIdx = index ?? this.datasource.originalData.length;
    this.datasource.originalData.splice(insertIdx, 0, data);
    this.datasource.data = this.datasource.originalData;
    this.redrawBody();
    this.#updateRowCount();
  }

  /**
   * Add multiple rows to the data grid
   * @param {Array<Record<string, unknown>>} data multiple row data
   * @param {number} index insert position for new rows
   */
  addRows(data: Array<Record<string, unknown>> = [], index?: number) {
    const insertIdx = index ?? this.datasource.originalData.length;
    this.datasource.originalData.splice(insertIdx, 0, ...data);
    this.datasource.data = this.datasource.originalData;
    this.redrawBody();
    this.#updateRowCount();
  }

  /**
   * Remove a row by index for the data
   * @param {number} index the row index to remove
   */
  removeRow(index: number) {
    this.datasource.originalData.splice(index, 1);
    this.datasource.data = this.datasource.originalData;
    this.redrawBody();
    this.#updateRowCount();
  }

  /**
   * Clear all values in a row a row by index
   * @param {number} index the row index to clear
   */
  clearRow(index: number) {
    this.updateDataset(index, {}, true);
    this.redrawBody();
  }

  /**
   * Edit the first editable cell
   */
  editFirstCell() {
    this.#editAdjacentCell(IdsDirection.Next);
  }

  /**
   * Set a row to selected
   * @param {number} index the zero based index
   * @param {boolean} triggerEvent fire an event with the selected row
   */
  selectRow(index: number, triggerEvent = true) {
    const row = this.rowByIndex(index);

    // If virtual scroll and row not in DOM, just save state in data
    if (this.virtualScroll && !row && this.data[index]) {
      if (this.rowSelection === 'single') this.deSelectAllRows();
      this.updateDataset(index, { rowSelected: true });
      return;
    }

    if (!row || row.selected) return;

    let canSelect = true;
    const response = (veto: any) => {
      canSelect = !!veto;
    };

    this.triggerEvent('beforerowselected', this, {
      detail: {
        elem: this, row, data: this.data[index], response
      }
    });

    if (!canSelect) {
      return;
    }

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row?.querySelector('.is-selection-checkbox .ids-data-grid-checkbox');
      checkbox?.classList.add('checked');
      checkbox?.setAttribute('aria-checked', 'true');
    }

    if (this.rowSelection === 'single') {
      this.deSelectAllRows();
      const radio = row?.querySelector('.ids-data-grid-radio');
      radio?.classList.add('checked');
      radio?.setAttribute('aria-checked', 'true');
    }

    this.updateDataset(index, { rowSelected: true });
    row.selected = true;

    if ((this.rowSelection === 'single' || this.rowSelection === 'multiple') && row) {
      row.updateCells(index);
    }

    if (triggerEvent) {
      this.triggerEvent('rowselected', this, {
        detail: {
          elem: this, row, data: this.data[index]
        }
      });
    }

    if (this.groupSelectsChildren) row?.toggleChildRowSelection(true);
    this.header?.setHeaderCheckbox();
  }

  /**
   * Set a row to be deselected
   * @param {number} index the zero based index
   * @param {boolean} triggerEvent fire an event with the deselected row
   */
  deSelectRow(index: number, triggerEvent = true) {
    const row = this.rowByIndex(index);

    // If virtual scroll and row not in DOM, just save state in data
    if (this.virtualScroll && !row && this.data[index]) {
      this.updateDataset(index, { rowSelected: false });
      return;
    }

    if (!row) return;

    let canDeselect = true;
    const response = (veto: any) => {
      canDeselect = !!veto;
    };

    this.triggerEvent('beforerowdeselected', this, {
      detail: {
        elem: this, row, data: this.data[index], response
      }
    });

    if (!canDeselect) {
      return;
    }

    if (this.rowSelection === 'mixed') {
      row.classList.remove('mixed');
    }
    row.classList.remove('selected');
    row.removeAttribute('aria-selected');

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row.querySelector('.is-selection-checkbox .ids-data-grid-checkbox');
      checkbox?.classList.remove('checked');
      checkbox?.setAttribute('aria-checked', 'false');
    }

    if (this.rowSelection === 'single') {
      const radio = row.querySelector('.ids-data-grid-radio');
      radio?.classList.remove('checked');
      radio?.setAttribute('aria-checked', 'false');
    }

    this.updateDataset(index, { rowSelected: false });

    if (triggerEvent) {
      this.triggerEvent('rowdeselected', this, {
        detail: {
          elem: this, row, data: this.data[index]
        }
      });
    }

    row.updateCells(index);
    if (this.groupSelectsChildren) row.toggleChildRowSelection(false);
    this.header?.setHeaderCheckbox();
  }

  /**
   * Set a row to activated
   * @param {number} index the zero based index
   */
  activateRow(index: number) {
    let row: any = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (!row || this.rowSelection !== 'mixed') {
      return;
    }

    (row as any).classList.add('activated');
    this.updateDataset(Number(row?.getAttribute('data-index')), { rowActivated: true });
    row?.updateCells(index);

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
  deactivateRow(index: any) {
    if (typeof index === 'undefined' || index === null) {
      return;
    }
    let row = index;

    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (!row || this.rowSelection !== 'mixed') {
      return;
    }
    row.classList.remove('activated');
    this.updateDataset(Number(row?.getAttribute('data-index')), { rowActivated: undefined });
    row.updateCells(index);

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
      row.rowSelected = true;
    });

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        selectedRows: this.selectedRows
      }
    });
    this.header?.setHeaderCheckbox();
  }

  /**
   * Set a all rows to be deselected
   */
  deSelectAllRows() {
    this.data?.forEach((row: any, index: number) => {
      if (row.rowSelected) {
        this.deSelectRow(index);
        row.rowSelected = false;
      }
    });

    if (this.rowSelection !== 'single') {
      this.triggerEvent('selectionchanged', this, {
        detail: {
          elem: this,
          selectedRows: this.selectedRows
        }
      });
    }
    this.header?.setHeaderCheckbox();
  }

  /**
   * Set/Get the total number of records
   * @returns {number} The no of rows (flattened trees)
   */
  get rowCount() {
    return this.data.length;
  }

  /**
   * Get the row height in pixels
   * @private
   * @returns {number} The pixel height
   */
  get rowPixelHeight(): number {
    const rowHeights: any = {
      xxs: 25,
      xs: 30,
      sm: 35,
      md: 40,
      lg: 50
    };

    return rowHeights[this.rowHeight] + 1;
  }

  /**
   * Set the card to auto fit to its parent size
   * @param {boolean|string|null} value The auto fit
   */
  set autoFit(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.AUTO_FIT, String(value));
      return;
    }
    this.removeAttribute(attributes.AUTO_FIT);
  }

  get autoFit(): boolean | string | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FIT));
  }

  /**
   * Set the container height
   * @private
   */
  #applyAutoFit() {
    if (this.autoFitSet) {
      return;
    }
    if (this.autoFit === true) {
      this.container?.style.setProperty('height', '100%');
      this.wrapper?.style.setProperty('height', '100%');
      this.autoFitSet = true;
    }
  }

  /**
   * Suppress row row and cell caching
   * @param {boolean|string|null} value false to not cache
   */
  set suppressCaching(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_CACHING, String(value));
      return;
    }
    this.removeAttribute(attributes.SUPPRESS_CACHING);
  }

  get suppressCaching(): boolean {
    return stringToBool(this.getAttribute(attributes.SUPPRESS_CACHING)) || false;
  }

  /**
   * Set the active cell for focus
   * @param {number} cellNumber The cell to focus (zero based)
   * @param {number} rowIndex The row to focus (zero based)
   * @param {boolean} noFocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  setActiveCell(cellNumber: number, rowIndex: number, noFocus?: boolean) {
    if (rowIndex < 0 || cellNumber < 0 || rowIndex > this.data.length - 1
      || cellNumber > this.visibleColumns.length - 1 || Number.isNaN(rowIndex) || Number.isNaN(rowIndex)) {
      return this.activeCell;
    }

    if (!this.activeCell) this.activeCell = {};
    this.activeCell.cell = Number(cellNumber);
    this.activeCell.row = Number(rowIndex);

    let rowNode = this.rowByIndex(rowIndex);
    if (!rowNode && this.virtualScroll) {
      this.#scrollRowIntoView(rowIndex);
      rowNode = this.rowByIndex(rowIndex);
    }

    const queriedCells = rowNode?.querySelectorAll<HTMLElement>('ids-data-grid-cell');
    if (queriedCells && queriedCells.length > 0) {
      const cellNode = queriedCells[cellNumber] as IdsDataGridCell;
      cellNode.activate(Boolean(noFocus));
    }
    return this.activeCell;
  }

  /**
   * Sets disable client filter
   * @param {boolean|string} value IThe value
   */
  set disableClientFilter(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLE_CLIENT_FILTER, '');
    } else {
      this.removeAttribute(attributes.DISABLE_CLIENT_FILTER);
    }
  }

  get disableClientFilter() {
    const value = this.getAttribute(attributes.DISABLE_CLIENT_FILTER);
    return value !== null ? stringToBool(value) : this.filters.DEFAULTS.disableClientFilter;
  }

  /**
   * Sets the data grid to be filterable
   * @param {boolean|string} value If true will set filterable
   */
  set filterable(value) {
    const isApply = this.filterable !== stringToBool(value);
    if (typeof value !== 'undefined' && value !== null) {
      this.setAttribute(attributes.FILTERABLE, String(value));
    } else {
      this.removeAttribute(attributes.FILTERABLE);
    }
    if (isApply) this.header?.setFilterRow();
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
      this.setAttribute(attributes.FILTER_ROW_DISABLED, String(value));
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
      this.setAttribute(attributes.FILTER_WHEN_TYPING, String(value));
    } else {
      this.removeAttribute(attributes.FILTER_WHEN_TYPING);
    }
    if (isApply) this.filters?.setFilterWhenTyping();
  }

  get filterWhenTyping() {
    const value = this.getAttribute(attributes.FILTER_WHEN_TYPING);
    return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterWhenTyping;
  }

  /**
   * Sets the grid to render as a tree grid (does require a tree formatter column)
   * @param {boolean|string} value The value
   */
  set treeGrid(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.TREE_GRID, value.toString());
    } else {
      this.removeAttribute(attributes.TREE_GRID);
    }
  }

  get treeGrid() {
    return this.hasAttribute(attributes.TREE_GRID);
  }

  /**
   * If true then the children will be selected when a group is selected
   * @param {boolean|string} value The value
   */
  set groupSelectsChildren(value) {
    value = stringToBool(value);
    if (value) {
      this.setAttribute(attributes.GROUP_SELECTS_CHILDREN, value.toString());
    } else {
      this.removeAttribute(attributes.GROUP_SELECTS_CHILDREN);
    }
  }

  get groupSelectsChildren() {
    return stringToBool(this.getAttribute(attributes.GROUP_SELECTS_CHILDREN)) || false;
  }

  /**
   * Used to set which column is the unique id column in the data set.
   * This is needed for some operations.
   * @param {string} value The value
   */
  set idColumn(value) {
    if (value) {
      this.setAttribute(attributes.ID_COLUMN, value.toString());
    } else {
      this.removeAttribute(attributes.ID_COLUMN);
    }
  }

  get idColumn() {
    return this.getAttribute(attributes.ID_COLUMN) || 'id';
  }

  /**
   * If true an expandable row is present in the grid. Also requires a expandable-row-template and
   * an expander formatter.
   * @param {string} value The value
   */
  set expandableRow(value) {
    if (value) {
      this.setAttribute(attributes.EXPANDABLE_ROW, value.toString());
    } else {
      this.removeAttribute(attributes.EXPANDABLE_ROW);
    }
  }

  get expandableRow() {
    return this.getAttribute(attributes.EXPANDABLE_ROW) || false;
  }

  /**
   * An id that points to the template to use for expandable rows. Also requires the expandable-row setting
   * and an expander formatter.
   * @param {string} value The value
   */
  set expandableRowTemplate(value) {
    if (value) {
      this.setAttribute(attributes.EXPANDABLE_ROW_TEMPLATE, value.toString());
    } else {
      this.removeAttribute(attributes.EXPANDABLE_ROW_TEMPLATE);
    }
  }

  get expandableRowTemplate() {
    return this.getAttribute(attributes.EXPANDABLE_ROW_TEMPLATE) || '';
  }

  /**
   * Set uniqueId to save to local storage.
   * @param {number|string|null} value A uniqueId use to save to local storage.
   */
  set uniqueId(value: number | string | null) {
    const val = /number|string/g.test(typeof value) ? `${value}` : null;
    if (typeof val === 'string' && val !== '') {
      this.setAttribute(attributes.UNIQUE_ID, val);
    } else {
      this.removeAttribute(attributes.UNIQUE_ID);
    }
  }

  get uniqueId(): string | null { return this.getAttribute(attributes.UNIQUE_ID); }

  /**
   * Set to true if one or more editors is present to activate editing
   * @param {boolean} value true indicates some cells may be editable
   */
  set editable(value: boolean) {
    value = stringToBool(value);
    if (value) {
      this.setAttribute(attributes.EDITABLE, value.toString());
    } else {
      this.removeAttribute(attributes.EDITABLE);
    }
  }

  get editable(): boolean {
    return stringToBool(this.getAttribute(attributes.EDITABLE));
  }

  /**
   * Set to false to avoid moving up and down rows when editing and hitting enter
   * @param {boolean} value false indicates the grid will not switch rows on edit
   */
  set editNextOnEnterPress(value: boolean) {
    value = stringToBool(value);
    if (value) {
      this.setAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS, value.toString());
    } else {
      this.removeAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS);
    }
  }

  get editNextOnEnterPress(): boolean {
    return stringToBool(this.getAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS));
  }

  /**
   * Set to true to automatically append rows when keyboard navigating
   * the data grid in editable mode
   * @param {boolean} val boolean flag
   */
  set addNewAtEnd(val: string | boolean) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.ADD_NEW_AT_END, 'true');
    } else {
      this.removeAttribute(attributes.ADD_NEW_AT_END);
    }
  }

  get addNewAtEnd(): boolean {
    return stringToBool(this.getAttribute(attributes.ADD_NEW_AT_END));
  }

  /**
   * Get all the currently invalid cells
   * @returns {Array<{ row: number, cell: number, columnId: string | null, validationMessages: any }>} cell invalid info
   */
  get invalidCells(): Array<{ row: number, cell: number, columnId: string | null, validationMessages: any }> {
    const invalidCells: Array<{ row: number, cell: number, columnId: string | null, validationMessages: any }> = [];
    for (let index = 0; index < this.data.length; index++) {
      if (this.data[index]?.invalidCells) {
        this.data[index].invalidCells?.forEach((invalidCellInRow: any) => {
          invalidCellInRow.row = index;
        });
        invalidCells.push(...this.data[index].invalidCells);
      }
    }
    return invalidCells;
  }

  /**
   * Get all the currently dirty cells
   * @returns {Array<{ row: number, cell: number, columnId: string | null, originalValue: any }>} info about the dirty cells
   */
  get dirtyCells(): Array<{ row: number, cell: number, columnId: string | null, originalValue: any }> {
    const dirtyCells: Array<{ row: number, cell: number, columnId: string | null, originalValue: any }> = [];
    for (let index = 0; index < this.data.length; index++) {
      if (this.data[index]?.dirtyCells) {
        this.data[index].dirtyCells?.forEach((dirtyCellInRow: any) => {
          dirtyCellInRow.row = index;
        });
        dirtyCells.push(...this.data[index].dirtyCells);
      }
    }
    return dirtyCells;
  }

  /**
   * Reset any currently dirty cells
   */
  resetDirtyCells() {
    this.data.forEach((row) => {
      if (row?.dirtyCells) {
        delete row.dirtyCells;
      }
    });
    this.container?.querySelectorAll('ids-data-grid-cell.is-dirty').forEach((elem) => {
      elem.classList.remove('is-dirty');
    });
  }

  /**
   * Export data grid to excel
   * @param {string} format csv or xlsx
   * @param {string} filename filename
   * @param {boolean} keepGridFormatting keep grid formatting, or pass raw datasource data
   */
  exportToExcel(format: 'csv' | 'xlsx', filename: string, keepGridFormatting = true) {
    const xlColumns: Record<string, ExcelColumn> = {};
    const gridColCache: Record<string, IdsDataGridColumn> = {};
    format = format === 'csv' || format === 'xlsx' ? format : 'xlsx';
    keepGridFormatting = format === 'csv' ? true : keepGridFormatting;

    // create excel col config from grid column config
    this.columns.forEach((gridCol) => {
      if (gridCol.id && gridCol.field && gridCol.name) {
        gridColCache[gridCol.id] = gridCol;

        xlColumns[gridCol.id] = {
          id: gridCol.id,
          field: gridCol.field,
          name: gridCol.name,
          type: keepGridFormatting ? 'string' : this.determineColType(gridCol)
        };
      }
    });

    // Get excel data from grid data source
    const elem = document.createElement('span');
    const xlData: Array<Record<string, any>> = !keepGridFormatting
      ? this.datasource.data
      : this.datasource.data.map((rowData, rowIndex) => {
        const xlDataRow: Record<string, any> = {};

        Object.keys(xlColumns).forEach((id) => {
          const gridCol = gridColCache[id];
          const formatter = gridCol?.formatter;
          const isNumber = formatter === this.formatters.decimal || formatter === this.formatters.integer;
          const rawValue = rowData[xlColumns[id].field];
          let excelValue = rawValue;

          // use grid formatted strings for non number truthy values
          if (rawValue !== undefined && rawValue !== null && !isNumber && formatter) {
            const formattedValue = formatter.call(this.formatters, rowData, gridCol!, rowIndex, this);
            elem.innerHTML = formattedValue;
            excelValue = elem.textContent?.trim();
          }

          xlDataRow[id] = excelValue;
        });

        return xlDataRow;
      });

    const exporter = format === 'csv' ? exportToCSV : exportToXLSX;
    exporter(xlData, {
      filename: filename || 'data-grid',
      columns: Object.values(xlColumns)
    });
  }

  /**
   * Get excel data type from data grid column formattter
   * @param {IdsDataGridColumn} gridCol grid column config
   * @returns {string} matching excel type
   */
  private determineColType(gridCol: IdsDataGridColumn): string {
    let type = 'string';

    if (gridCol.formatter === this.formatters.integer || gridCol.formatter === this.formatters.decimal) {
      type = 'number';
    }

    if (gridCol.formatter === this.formatters.date) {
      type = 'date';
    }

    if (gridCol.formatter === this.formatters.time) {
      type = 'time';
    }

    return type;
  }

  /**
   * Find a specific IdsDataGridCell element using row-index and column-index.
   * @param {number} rowIndex the zero-based row index
   * @param {number} columnIndex the zero-based column index
   * @returns {IdsDataGridCell} html element for cell
   */
  cellByIndex(rowIndex: number, columnIndex: number): IdsDataGridCell | null {
    return this.rowByIndex(rowIndex)?.cellByIndex?.(columnIndex) ?? null;
  }
}
