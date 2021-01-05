import {
  IdsElement,
  customElement,
  scss,
  props,
  mixin
} from '../ids-base/ids-element';

import { IdsDataGridFormatters } from './ids-data-grid-formatters';
import { IdsDataSourceMixin } from '../ids-base/ids-data-source-mixin';
import { IdsDeepCloneMixin } from '../ids-base/ids-deep-clone-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';

import styles from './ids-data-grid.scss';

/**
 * IDS DataGrid Component
 */
@customElement('ids-data-grid')
@scss(styles)
@mixin(IdsDeepCloneMixin)
class IdsDataGrid extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Handle setup when connected
   * @private
   */
  connectedCallBack() {
    this.formatters = new IdsDataGridFormatters();
    this.datasource = new IdsDataSourceMixin();
  }

  /**
   * Return the properties we handle as getters/setters
   * @private
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.ALTERNATE_ROW_SHADING,
      props.LABEL,
      props.ROW_HEIGHT,
      props.VIRTUAL_SCROLL
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   * @private
   */
  template() {
    let html = '';

    if (this?.data.length === 0 && this?.columns.length === 0) {
      return html;
    }

    const additionalClasses = this.alternateRowShading === 'true' ? ' alt-row-shading' : '';
    if (this?.virtualScroll !== 'true') {
      html = `<div class="ids-data-grid${additionalClasses}" role="table" aria-label="${this.label}" data-row-height="${this.rowHeight}">
      ${this.headerTemplate()}
      ${this.bodyTemplate()}
      </div>`;
      return html;
    }

    html = `<div class="ids-data-grid${additionalClasses}" role="table" aria-label="${this.label}" data-row-height="${this.rowHeight}">
      ${this.headerTemplate()}
      <ids-virtual-scroll>
        <div class="ids-data-grid-container">
          <div class="ids-data-grid-body" role="rowgroup" slot="contents">
          </div>
        </div>
      </ids-virtual-scroll>
    </div>`;

    return html;
  }

  /**
   * Rerender the list by re applying the template
   * @private
   */
  rerender() {
    if (this.columns.length === 0 && this.data.length === 0) {
      return;
    }

    const template = document.createElement('template');
    const html = this.template();

    // Render and append styles
    this.shadowRoot.innerHTML = '';
    this.appendStyles();
    this.setColumnWidths();
    template.innerHTML = html;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Setup virtual scrolling
    if (this.virtualScroll === 'true' && this?.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.scrollTarget = this.shadowRoot.querySelector('.ids-data-grid');

      this.virtualScrollContainer.itemTemplate = (row, index) => this.rowTemplate(row, index);
      this.virtualScrollContainer.itemCount = this.data.length;
      // TODO Dynamic Height setting - header height
      this.virtualScrollContainer.height = 350 - this.headerPixelHeight;
      this.virtualScrollContainer.itemHeight = this.rowPixelHeight;
      this.virtualScrollContainer.data = this.data;
    }

    this.handleEvents();

    if (this.data.length > 0) {
      this.setActiveCell(0, 0);
      this.handleKeys();
    }
  }

  /**
   * Header template markup
   * @returns {string} The template
   * @private
   */
  headerTemplate() {
    let header = '<div class="ids-data-grid-header" role="rowgroup"><div role="row" class="ids-data-grid-row">';

    this.columns.forEach((columnData) => {
      header += `${this.headerCellTemplate(columnData)}`;
    });
    return `${header}</div></div>`;
  }

  /**
   * Returns the markup for a header cell.
   * @private
   * @param {object} column The column info
   * @returns {string} The resuling header cell template
   */
  headerCellTemplate(column) {
    const sortIndicator = `<div class="sort-indicator">
      <ids-icon icon="dropdown"></ids-icon>
      <ids-icon icon="dropdown"></ids-icon>
    </div>`;
    const cssClasses = `${column.sortable ? ' is-sortable' : ''}`;

    const headerTemplate = `<span class="ids-data-grid-header-cell${cssClasses}" data-column-id="${column.id}" role="columnheader">
      <span class="ids-data-grid-header-text">${column.name || ''}</span>
      ${column.sortable ? sortIndicator : ''}
    </span>`;
    return headerTemplate;
  }

  /**
   * Body template markup
   * @private
   * @returns {string} The template
   */
  bodyTemplate() {
    let html = '<div class="ids-data-grid-container"><div class="ids-data-grid-body" role="rowgroup">';

    this.data.forEach((row, index) => {
      html += this.rowTemplate(row, index);
    });

    return `${html}</div></div>`;
  }

  /**
   * Return the row's markup
   * @private
   * @param  {object} row The row data object
   * @param  {number} index [description]
   * @returns {string} The html string for the row
   */
  rowTemplate(row, index) {
    let html = `<div role="row" aria-rowindex="${index}" class="ids-data-grid-row">`;

    this.columns.forEach((column, j) => {
      html += `<span role="cell" class="ids-data-grid-cell" aria-colindex="${j}">${this.cellTemplate(row, column)}</span>`;
    });

    html += '</div>';
    return html;
  }

  /**
   * Render the individual cell using the column formatter
   * @private
   * @param  {object} row The data item for the row
   * @param  {object} column The column data for the row
   * @returns {string} The template
   */
  cellTemplate(row, column) {
    return this.formatters.text(row, column);
  }

  /**
   * Handle all triggering and handling of events
   * @private
   */
  handleEvents() {
    const sortableColumns = this.shadowRoot.querySelector('.ids-data-grid-header');
    if (this.eventHandlers) {
      this.eventHandlers.removeAll();
    }
    this.eventHandlers = new IdsEventsMixin();

    // Add a sort Handler
    this.eventHandlers.addEventListener('click', sortableColumns, (e) => {
      const header = e.target.closest('.is-sortable');

      if (header) {
        this.setSortColumn(header.getAttribute('data-column-id'), header.getAttribute('aria-sort') !== 'ascending');
      }
    });

    // Add a cell click handler
    this.eventHandlers.addEventListener('click', this.shadowRoot.querySelector('.ids-data-grid-body'), (e) => {
      const cell = e.target.closest('.ids-data-grid-cell');
      const row = cell.parentNode;
      // TODO Handle Hidden Cells
      this.setActiveCell(parseInt(cell.getAttribute('aria-colindex'), 10), parseInt(row.getAttribute('aria-rowindex'), 10));
    });
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  handleKeys() {
    if (this.keyboard) {
      this.keyboard.destroy();
    }
    this.keyboard = new IdsKeyboardMixin();

    // Handle arrow navigation
    this.keyboard.listen(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'], this, (e) => {
      const key = e.key;
      const rowDiff = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0); //eslint-disable-line
      const cellDiff = key === 'ArrowRight' ? 1 : (key === 'ArrowLeft' ? -1 : 0); //eslint-disable-line

      this.setActiveCell(this.activeCell.cell + cellDiff, this.activeCell.row + rowDiff);
      e.preventDefault();
      e.stopPropagation();
    });

    return this;
  }

  /**
   * Set the column widths by generating the lengths in the css grid
   * and setting the css variable.
   * @private
   */
  setColumnWidths() {
    let css = '';
    let colsWithoutWidth = 0;

    let styleSheet = null;

    if (this.shadowRoot.adoptedStyleSheets) {
      styleSheet = this.shadowRoot.adoptedStyleSheets[0];
    } else if (this.shadowRoot.styleSheets) {
      styleSheet = this.shadowRoot.styleSheets[0];
    }

    if (!styleSheet) {
      return;
    }

    this.columns.forEach((column, i) => {
      if (column.width && this.columns.length === i + 1) {
        css += `minmax(250px, 1fr)`;
      }
      if (column.width && this.columns.length !== i + 1) {
        css += `${column.width}px `;
      }
      if (!column.width) {
        colsWithoutWidth++;
      }
    });

    if (colsWithoutWidth) {
      css += ` repeat(${colsWithoutWidth}, minmax(110px, 1fr))`;
    }

    styleSheet.insertRule(`:host {
      --ids-data-grid-column-widths: ${css} !important;
    }`);
  }

  /**
   * Set the sort column and sort direction
   * @param {string} id The field id to sort on
   * @param {boolean} ascending Set in ascending (lowest first) or descending (lowest last)
   */
  setSortColumn(id, ascending = true) {
    this.sortColumn = { id, ascending };
    this.datasource.sort(id, ascending);
    this.rerender();
    this.setSortState(id, ascending);
    this.eventHandlers.dispatchEvent('sorted', this, { detail: { elem: this, sortColumn: this.sortColumn } });
  }

  /**
   * Set the sort column and sort direction on the UI only
   * @private
   * @param {string} id The field id to sort on
   * @param {boolean} ascending Set in ascending (lowest first) or descending (lowest last)
   */
  setSortState(id, ascending = true) {
    const sortedHeaders = this.shadowRoot.querySelectorAll('.is-sortable');
    for (let i = 0; i < sortedHeaders.length; i++) {
      sortedHeaders[i].removeAttribute('aria-sort');
    }

    const header = this.shadowRoot.querySelector(`[data-column-id="${id}"]`);

    if (header && header.classList.contains('is-sortable')) {
      header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    }
  }

  /**
   * Set a style on every alternate row for better readability.
   * @private
   * @param {boolean|string} value true to use alternate row shading
   */
  set alternateRowShading(value) {
    if (value === true || value === 'true') {
      this.setAttribute(props.ALTERNATE_ROW_SHADING, value);
      this.shadowRoot?.querySelector('.ids-data-grid').classList.add('alt-row-shading');
      return;
    }

    if (!value || value === false || value === 'false') {
      this.shadowRoot?.querySelector('.ids-data-grid').classList.remove('alt-row-shading');
      this.setAttribute(props.ALTERNATE_ROW_SHADING, value);
    }
  }

  get alternateRowShading() { return this.getAttribute(props.ALTERNATE_ROW_SHADING) || 'false'; }

  /**
   * Set the columns array of the datagrid
   * @param {Array} value The array to use
   */
  set columns(value) {
    this.currentColumns = value ? this.deepClone(value) : [{ id: '', name: '' }];
    this.rerender();
  }

  get columns() { return this?.currentColumns || [{ id: '', name: '' }]; }

  /**
   * Set the data array of the datagrid
   * @param {Array} value The array to use
   */
  set data(value) {
    if (value) {
      this.datasource.data = value;
      this.rerender();
      return;
    }

    this.datasource.data = null;
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {boolean} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    if (value === true || value === 'true') {
      this.setAttribute(props.VIRTUAL_SCROLL, value);
      this.rerender();
      return;
    }

    this.removeAttribute(props.VIRTUAL_SCROLL);
    this.rerender();
  }

  get virtualScroll() { return this.getAttribute(props.VIRTUAL_SCROLL) || 'false'; }

  /**
   * Set the aria-label element in the DOM. This should be translated.
   * @param {string} value The aria label
   */
  set label(value) {
    if (value) {
      this.setAttribute(props.LABEL, value);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('aria-label', value);
      this.rerender();
      return;
    }

    this.removeAttribute(props.LABEL);
    this.shadowRoot.querySelector('.ids-data-grid').setAttribute('aria-label', 'Data Grid');
    this.rerender();
  }

  get label() { return this.getAttribute(props.LABEL) || 'Data Grid'; }

  /**
   * Set the row height between extra-small, small, medium and large (default)
   * @param {string} value The row height
   */
  set rowHeight(value) {
    if (value) {
      this.setAttribute(props.ROW_HEIGHT, value);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('data-row-height', value);
    } else {
      this.removeAttribute(props.ROW_HEIGHT);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('data-row-height', 'large');
    }

    if (this.stringToBool(this.virtualScroll)) {
      this.rerender();
    }
  }

  get rowHeight() { return this.getAttribute(props.ROW_HEIGHT) || 'large'; }

  /**
   * Get the row height in pixels
   * @private
   * @returns {number} The pixel height
   */
  get rowPixelHeight() {
    if (this.rowHeight === 'medium') return 40;
    if (this.rowHeight === 'small') return 35;
    if (this.rowHeight === 'extra-small') return 30;
    return 50;
  }

  /**
   * Get the header height in pixels
   * @private
   * @returns {number} The pixel height
   */
  get headerPixelHeight() {
    return 35;
  }

  /**
   * Set the active cell for focus
   * @param  {number} cell [description]
   * @param  {number} row  [description]
   * @returns {object} the current active cell
   */
  setActiveCell(cell, row) {
    // TODO Hidden Columns
    if (row < 0 || cell < 0 || row > this.data.length - 1 || cell > this.columns.length - 1) {
      return this.activeCell;
    }

    if (!this.activeCell) {
      this.activeCell = {};
    }

    this.activeCell.cell = cell;
    this.activeCell.row = row;

    const rowNode = this.shadowRoot.querySelectorAll('.ids-data-grid-body .ids-data-grid-row')[row]; // exclude header rows
    const cellNode = rowNode.querySelectorAll('.ids-data-grid-cell')[cell];
    this.activeCell?.node?.removeAttribute('tabindex');

    this.activeCell.node = cellNode;
    cellNode.setAttribute('tabindex', '0');
    cellNode.focus();

    this.eventHandlers.dispatchEvent('activecellchanged', this, { detail: { elem: this, activeCell: this.activeCell } });
    return this.activeCell;
  }
}

export { IdsDataGrid, IdsDataGridFormatters };
