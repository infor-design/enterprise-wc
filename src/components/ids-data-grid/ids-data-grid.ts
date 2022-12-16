// Utils
import { customElement, scss } from '../../core/ids-decorators';
import { attributes, IdsDirection } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { next, previous } from '../../utils/ids-dom-utils/ids-dom-utils';

// Dependencies
import IdsDataSource from '../../core/ids-data-source';
import IdsDataGridFormatters from './ids-data-grid-formatters';
import { editors } from './ids-data-grid-editors';
import IdsDataGridFilters, { IdsDataGridFilterConditions } from './ids-data-grid-filters';
import { IdsDataGridContextmenuArgs, setContextmenu } from './ids-data-grid-contextmenu';
import { IdsDataGridColumn, IdsDataGridColumnGroup } from './ids-data-grid-column';
import type IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

// Styles
import styles from './ids-data-grid.scss';

// Sub Components
import IdsDataGridHeader from './ids-data-grid-header';
import IdsDataGridRow from './ids-data-grid-row';
import '../ids-virtual-scroll/ids-virtual-scroll';

// Mixins
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsDataGridSaveSettingsMixin from './ids-data-grid-save-settings-mixin';
import IdsDataGridTooltipMixin from './ids-data-grid-tooltip-mixin';
import IdsDataGridCell from './ids-data-grid-cell';

const Base = IdsThemeMixin(
  IdsPagerMixin(
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
  )
);

/**
 * IDS Data Grid Component
 * @type {IdsDataGrid}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
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
  virtualScrollContainer?: IdsVirtualScroll | null;

  isResizing = false;

  activeCell: Record<string, any> = {};

  autoFitSet = false;

  currentColumns?: IdsDataGridColumn[];

  sortColumn?: Record<string, any>;

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

  /* Returns the outside wrapper element */
  get wrapper() {
    return this.container?.parentNode as HTMLElement | undefined | null;
  }

  connectedCallback() {
    if (this.initialized) this.restoreAllSettings?.();

    super.connectedCallback();
    this.redrawBody();
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
      attributes.ALTERNATE_ROW_SHADING,
      attributes.AUTO_FIT,
      attributes.DISABLE_CLIENT_FILTER,
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
      attributes.MODE,
      attributes.ROW_HEIGHT,
      attributes.ROW_NAVIGATION,
      attributes.ROW_SELECTION,
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

    const html = `<div class="ids-data-grid-wrapper">
        <span class="ids-data-grid-sort-arrows"></span>
        <div class="ids-data-grid${cssClasses}" role="table" part="table" aria-label="${this.label}" data-row-height="${this.rowHeight}" mode="${this.mode}">
          ${IdsDataGridHeader.template(this)}
          ${this.bodyTemplate()}
        </div>
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
   * Apply the Filter with the currently selected conditions, or the ones passed in.
   * @param {Array} conditions An array of objects with the filter conditions.
   * @returns {void}
   */
  applyFilter(conditions: Array<IdsDataGridFilterConditions>) {
    this.filters?.applyFilter(conditions);
  }

  /**
   * Sync pager to refresh updated dataset
   * @private
   * @returns {void}
   */
  #syncPager(): void {
    const props = ['total', 'pageNumber', 'pageSize'];
    const isValid = (v: any) => typeof v !== 'undefined' && v !== null;

    props.forEach((prop) => {
      const pager: any = this.pager;
      const ds: any = this.datasource;
      const isValidProps = isValid(pager?.[prop]) && isValid(ds?.[prop]);
      if (this.initialized && isValidProps && pager[prop] !== ds[prop]) {
        pager[prop] = ds[prop];
      }
    });
  }

  /**
   * Sync and then redraw the body section
   * @returns {void}
   */
  redrawBody() {
    this.#redrawBodyTemplate();
    this.#syncPager();
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
    if (this.body) this.body.innerHTML = this.virtualScroll ? this.bodyTemplate() : this.bodyInnerTemplate();
    this.header?.setHeaderCheckbox();
  }

  /**
   * redraw the list by re applying the template
   * @private
   */
  redraw() {
    if ((this.columns.length === 0 && this.data.length === 0) || !this.initialized) {
      return;
    }

    const header = IdsDataGridHeader.template(this);
    const body = this.bodyTemplate();
    if (this.container) this.container.innerHTML = header + body;
    this.#setColumnWidths();

    // Setup virtual scrolling
    if (this.virtualScroll && this.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot?.querySelector<IdsVirtualScroll>('ids-virtual-scroll');
      if (this.virtualScrollContainer) {
        this.virtualScrollContainer.scrollTarget = this.container;

        this.virtualScrollContainer.itemTemplate = (
          row: any,
          index: number,
          ariaRowIndex: number
        ) => IdsDataGridRow.template(row, index, ariaRowIndex, this);
        this.virtualScrollContainer.itemHeight = this.rowPixelHeight;
        this.virtualScrollContainer.data = this.data;
      }
    }

    if (this.data.length > 0) this.setActiveCell(0, 0, true);

    this.#applyAutoFit();
    this.header.setHeaderCheckbox();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.setupTooltip();

    // Attach post filters setting
    this.filters.attachFilterSettings();

    // Set Counts/Totals
    this.container?.setAttribute('aria-rowcount', this.rowCount.toString());

    // Set contextmenu
    setContextmenu.apply(this);
  }

  /**
   * Contextmenu stuff use for info and events
   * @private
   */
  contextMenuInfo: {
    menu?: IdsPopupMenu,
    target?: HTMLElement,
    callbackArgs?: IdsDataGridContextmenuArgs
  } = {};

  /**
   * Body template markup
   * @private
   * @returns {string} The template
   */
  bodyTemplate() {
    if (this.virtualScroll) {
      return `<ids-virtual-scroll><div class="ids-data-grid-body" part="contents"></div></ids-virtual-scroll>`;
    }
    return `<div class="ids-data-grid-body" part="contents" role="rowgroup">${this.bodyInnerTemplate()}</div>`;
  }

  /**
   * Body inner template markup
   * @private
   * @returns {string} The template
   */
  bodyInnerTemplate() {
    let innerHTML = '';
    for (let index = 0; index < this.data.length; index++) {
      innerHTML += IdsDataGridRow.template(this.data[index], index, index + 1, this);
    }
    return innerHTML;
  }

  /**
   * Handle all triggering and handling of events
   * @private
   */
  #attachEventHandlers() {
    // Add a cell click handler
    const body = this.shadowRoot?.querySelector('.ids-data-grid-body');
    this.offEvent('click.body', body);
    this.onEvent('click.body', body, (e: any) => {
      const cell: IdsDataGridCell = (e.target as any).closest('ids-data-grid-cell');
      if (!cell) return;
      if (cell.isEditing) return;

      const cellNum = Number(cell.getAttribute('aria-colindex')) - 1;
      const row = <IdsDataGridRow>cell.parentNode;
      const rowNum = Number(row.getAttribute('data-index'));
      const isHyperlink = e.target?.nodeName === 'IDS-HYPERLINK' || e.target?.nodeName === 'A';
      const isButton = e.target?.nodeName === 'IDS-BUTTON';
      const isExpandButton = isButton && e.target?.classList.contains('expand-button');
      const isClickable = isButton || isHyperlink;
      const column: IdsDataGridColumn = this.visibleColumns[cellNum];

      // Focus Cell
      this.setActiveCell(cellNum, rowNum, isHyperlink);

      // Handle click callbacks
      if (isClickable && column.click !== undefined && !e.target?.getAttribute('disabled')) {
        (column as any).click({
          rowData: this.data[rowNum],
          columnData: this.visibleColumns[cellNum],
          event: e
        });
      }

      // Fires for each row that is clicked
      this.triggerEvent('rowclick', this, {
        detail: {
          elem: this, row, data: this.data[rowNum]
        }
      });

      // Handle Expand/Collapse Clicking
      if (isClickable && isExpandButton) {
        row.toggleExpandCollapse();
        return;
      }

      // Handle mixed selection
      if (this.rowSelection === 'mixed') {
        if (cell.children[0]?.classList.contains('ids-data-grid-checkbox-container')) {
          row.toggleSelection();
        } else {
          row.toggleRowActivation();
        }
        return;
      }

      // Handle selection if not disabled
      if (this.rowSelection !== false && this.rowSelection !== 'mixed') {
        if (this.suppressRowClickSelection && cell.children[0]?.classList.contains('is-selection-checkbox')) {
          row.toggleSelection();
        }
        if (!this.suppressRowClickSelection) {
          row.toggleSelection();
        }
      }

      // Handle Editing
      if (this.editable && column.editor) cell.startCellEdit(true);
    });

    // Add double click to the table body
    this.offEvent('dblclick.body', body);
    this.onEvent('dblclick.body', body, (e: MouseEvent) => {
      const row = (e.target as HTMLElement)?.closest('.ids-data-grid-row');
      const rowIndex: string | null | undefined = row?.getAttribute('data-index');

      if (!rowIndex) return;

      // Fires for each row that is double clicked
      this.triggerEvent('rowdoubleclick', this, {
        detail: {
          elem: this, row, data: this.data[Number(rowIndex)]
        }
      });
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
    this.attachSaveSettingsEventHandlers?.();
  }

  /**
   * Move a column to a new position. Use `columnIndex` to get the column by id.
   * @param {number} fromIndex The column index to movex
   * @param {number} toIndex The new column index
   */
  moveColumn(fromIndex: number, toIndex: number) {
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
    });

    this.redraw();
    this.triggerEvent('columnmoved', this, { detail: { elem: this, fromIndex: correctFromIndex, toIndex: correctToIndex } });
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
      const key = e.key;
      const cellNode = this.activeCell.node;
      const rowDiff = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0); //eslint-disable-line
      const cellDiff = key === 'ArrowRight' ? 1 : (key === 'ArrowLeft' ? -1 : 0); //eslint-disable-line
      const nextRow = Number(next(cellNode.parentElement, `:not([hidden])`)?.getAttribute('data-index'));
      const prevRow = Number(previous(cellNode.parentElement, `:not([hidden])`)?.getAttribute('data-index'));
      const rowIndex = key === 'ArrowDown' ? nextRow : prevRow;

      if (this.activeCellEditor) cellNode.endCellEdit();

      this.setActiveCell(Number(this.activeCell?.cell) + cellDiff, rowDiff === 0 ? Number(this.activeCell?.row) : rowIndex);
      if (this.rowSelection === 'mixed') {
        (cellNode.parentElement as IdsDataGridRow).toggleRowActivation();
      }
      e.preventDefault();
      e.stopPropagation();
    });

    // Handle Selection and Expand
    this.listen([' '], this, (e: Event) => {
      if (this.activeCellEditor) return;
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
      const row = this.rowByIndex(this.activeCell.row)!;
      row.toggleSelection();
      e.preventDefault();
    });

    // Follow links with keyboard and start editing
    this.listen(['Enter'], this, (e: KeyboardEvent) => {
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

    if (this.editable) {
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

      // Enter Edit by typing
      this.offEvent('keydown.body', this);
      this.onEvent('keydown.body', this, (e: KeyboardEvent) => {
        const isPrintableKey = e.key.length === 1;
        if (!this.activeCellEditor && isPrintableKey && e.key !== ' ') {
          this.activeCell.node.startCellEdit();
        }
      });
    }
    return this;
  }

  /**
   * Find the next editable cell and start editing it
   * @private
   * @param {IdsDirection} direction The cell element
   */
  #editAdjacentCell(direction: IdsDirection) {
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
      this.activeCell.node.focus();
      this.activeCell.node.startCellEdit();
      return;
    }

    const row = Number(nextCell.parentElement?.getAttribute('aria-rowindex')) - 1;
    const cell = Number(nextCell.getAttribute('aria-colindex')) - 1;
    this.setActiveCell(cell, row, true);
    nextCell.startCellEdit();
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
    if (this.virtualScrollContainer) this.virtualScrollContainer.data = this.data;
    this.redrawBody();
    this.header.setSortState(id, ascending);
    this.triggerEvent('sorted', this, { detail: { elem: this, sortColumn: this.sortColumn } });
    this.saveSettings?.();
  }

  /**
   * Set the sort column and sort direction on the UI only
   * @param {string} id The column id (or field) to set
   * @param {boolean} ascending Sort ascending (lowest first) or descending (lowest last)
   */
  setSortState(id: string, ascending = true) {
    this.header.setSortState(id, ascending);
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
   * Set the data of the data grid
   * @param {Array} value The array to use
   */
  set data(value: Array<Record<string, any>>) {
    if (value) {
      this.datasource.flatten = this.treeGrid;
      this.datasource.data = value;
      this.initialized = true;
      this.redraw();
      return;
    }

    this.datasource.data = [];
  }

  get data(): Array<Record<string, any>> { return this?.datasource?.data; }

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
    this.header.state.headerMenuData = value;
    setContextmenu.apply(this);
  }

  get headerMenuData() { return this.header.state.headerMenuData; }

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
    setContextmenu.apply(this);
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

    if (this.virtualScroll) this.redraw();
    this.saveSettings?.();
  }

  get rowHeight() { return this.getAttribute(attributes.ROW_HEIGHT) || 'lg'; }

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
   */
  updateDataset(row: number, data: Record<string, unknown>) {
    // Update the current data
    this.data[row] = { ...this.data[row], ...data };

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
      const parentRow = this.#findParentRow(this.datasource.originalData, this.data[row].parentElement);
      parentRow.children[this.data[row].ariaPosinset - 1] = {
        ...parentRow.children[this.data[row].ariaPosinset - 1],
        ...data
      };
      return;
    }
    // Non tree - update original data
    this.datasource.originalData[row] = { ...this.datasource.originalData[row], ...data };
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
   * Get the row HTMLElement
   * @param {number} index the zero based index
   * @returns {HTMLElement} Row HTMLElement
   */
  rowByIndex(index: number): IdsDataGridRow | undefined | null {
    return this.shadowRoot?.querySelector<IdsDataGridRow>(`.ids-data-grid-body ids-data-grid-row[data-index="${index}"]`);
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
   */
  addRow(data: Record<string, unknown>) {
    this.datasource.originalData.push(data);
    this.data = this.datasource.originalData;
    this.redrawBody();
  }

  /**
   * Remove a row by index for the data
   * @param {number} index the row index to remove
   */
  removeRow(index: number) {
    this.datasource.originalData.splice(index, 1);
    this.data = this.datasource.originalData;
    this.redrawBody();
  }

  /**
   * Clear all values in a row a row by index
   * @param {number} index the row index to clear
   */
  clearRow(index: number) {
    this.datasource.originalData[index] = {};
    this.data = this.datasource.originalData;
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
   */
  selectRow(index: number) {
    const row = this.rowByIndex(index);

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row?.querySelector('.ids-data-grid-checkbox');
      checkbox?.classList.add('checked');
      checkbox?.setAttribute('aria-checked', 'true');
    }

    if (this.rowSelection === 'single') {
      this.deSelectAllRows();
      const radio = row?.querySelector('.ids-data-grid-radio');
      radio?.classList.add('checked');
      radio?.setAttribute('aria-checked', 'true');
    }

    if (!row) return;

    row.selected = true;
    this.updateDataset(Number(row?.getAttribute('data-index')), { rowSelected: true });
    if ((this.rowSelection === 'single' || this.rowSelection === 'multiple') && row) row.updateCells(index);

    this.triggerEvent('rowselected', this, {
      detail: {
        elem: this, row, data: this.data[index]
      }
    });

    if (this.groupSelectsChildren) row?.toggleChildRowSelection(true);
    this.header.setHeaderCheckbox();
  }

  /**
   * Set a row to be deselected
   * @param {number} index the zero based index
   */
  deSelectRow(index: number) {
    const row = this.rowByIndex(index);

    if (this.rowSelection === 'mixed') {
      row?.classList.remove('mixed');
    }
    row?.classList.remove('selected');
    row?.removeAttribute('aria-selected');

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row?.querySelector('.ids-data-grid-checkbox');
      checkbox?.classList.remove('checked');
      checkbox?.setAttribute('aria-checked', 'false');
    }

    if (this.rowSelection === 'single') {
      const radio = row?.querySelector('.ids-data-grid-radio');
      radio?.classList.remove('checked');
      radio?.setAttribute('aria-checked', 'false');
    }

    this.updateDataset(Number(row?.getAttribute('data-index')), { rowSelected: undefined });

    this.triggerEvent('rowdeselected', this, {
      detail: {
        elem: this, row, data: this.data[index]
      }
    });

    row?.updateCells(index);
    if (this.groupSelectsChildren) row?.toggleChildRowSelection(false);
    this.header.setHeaderCheckbox();
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
    this.header.setHeaderCheckbox();
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
    this.header.setHeaderCheckbox();
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
      xs: 30,
      sm: 35,
      md: 40,
      lg: 50
    };

    return rowHeights[this.rowHeight];
  }

  /**
   * Set the card to auto fit to its parent size
   * @param {boolean|string|null} value The auto fit
   */
  set autoFit(value) {
    if (stringToBool(value) || value === 'bottom') {
      this.setAttribute(attributes.AUTO_FIT, String(value));
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
      this.container?.style.setProperty('height', `calc(100vh - ${spaceFromTop + 24}px)`);
      this.autoFitSet = true;
    }
    if (this.autoFit === true) {
      this.container?.style.setProperty('height', '100%');
      this.wrapper?.style.setProperty('height', '100%');
      this.autoFitSet = true;
    }
  }

  /**
   * Set the active cell for focus
   * @param {number} cell The cell to focus (zero based)
   * @param {number} row The row to focus (zero based)
   * @param {boolean} noFocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  setActiveCell(cell: number, row: number, noFocus?: boolean) {
    if (row < 0 || cell < 0 || row > this.data.length - 1
      || cell > this.visibleColumns.length - 1 || Number.isNaN(row) || Number.isNaN(row)) {
      return this.activeCell;
    }

    if (!this.activeCell) this.activeCell = {};
    this.activeCell.cell = Number(cell);
    this.activeCell.row = Number(row);

    const queriedRows = this.shadowRoot?.querySelectorAll('.ids-data-grid-body ids-data-grid-row');
    const rowNode = queriedRows?.item(row); // exclude header rows
    const queriedCells = rowNode?.querySelectorAll<HTMLElement>('ids-data-grid-cell');
    if (queriedCells && queriedCells.length > 0) {
      const cellNode = queriedCells[cell] as IdsDataGridCell;
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
    if (isApply) this.header.setFilterRow();
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
    value = stringToBool(value);
    if (value) {
      this.setAttribute(attributes.TREE_GRID, value.toString());
    } else {
      this.removeAttribute(attributes.TREE_GRID);
    }
  }

  get treeGrid() {
    return stringToBool(this.getAttribute(attributes.TREE_GRID)) || false;
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
    }
  }

  get editNextOnEnterPress(): boolean {
    return stringToBool(this.getAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS)) || false;
  }

  /**
   * Get all the currently dirty cells
   * @returns {Array<{ row: number, cell: number, columnId: string | null, originalValue: any }>} info about the dirty cells
   */
  get dirtyCells(): Array<{ row: number, cell: number, columnId: string | null, originalValue: any }> {
    const dirtyCells: Array<{ row: number, cell: number, columnId: string | null, originalValue: any }> = [];
    for (let index = 0; index < this.data.length; index++) {
      if (this.data[index]?.dirtyCells) {
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
}
