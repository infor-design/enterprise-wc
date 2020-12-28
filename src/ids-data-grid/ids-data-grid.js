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
    return [props.VIRTUAL_SCROLL, props.ALTERNATE_ROW_SHADING];
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
      html = `<div class="ids-data-grid${additionalClasses}" role="table" aria-label="${this.label}">
      ${this.headerTemplate()}
      ${this.bodyTemplate()}
      </div>`;
      return html;
    }

    html = `<div class="ids-data-grid${additionalClasses}" role="table" aria-label="${this.label}">
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
      this.virtualScrollContainer.height = 310 - 35; // TODO Height setting ?
      this.virtualScrollContainer.itemHeight = 50; // TODO Row Height setting
      this.virtualScrollContainer.data = this.data;
    }

    this.handleEvents();
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
   * @param {object} column The column info
   * @returns {string} The resuling header cell template
   * @private
   */
  headerCellTemplate(column) {
    const sortIndicator = `<div class="sort-indicator">
      <ids-icon icon="dropdown"></ids-icon>
      <ids-icon icon="dropdown"></ids-icon>
    </div>`;
    const cssClasses = `${column.sortable ? 'is-sortable' : ''}`;

    const headerTemplate = `<span class="ids-data-grid-header-cell ${cssClasses}" data-column-id="${column.id}" role="columnheader">
      <span class="ids-data-grid-header-text">${column.name || ''}</span>
      ${column.sortable ? sortIndicator : ''}
    </span>`;
    return headerTemplate;
  }

  /**
   * Body template markup
   * @returns {string} The template
   * @private
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
   * @param  {object} row The data item for the row
   * @param  {object} column The column data for the row
   * @returns {string} The template
   */
  cellTemplate(row, column) {
    return this.formatters.text(row, column);
  }

  /**
   * Handle all triggering and handling of events
   */
  handleEvents() {
    const sortableColumns = this.shadowRoot.querySelector('.ids-data-grid-header');
    if (this.eventHandlers) {
      this.eventHandlers.removeAll();
    }
    this.eventHandlers = new IdsEventsMixin();

    // Add a single click handler
    if (sortableColumns) {
      this.eventHandlers.addEventListener('click', sortableColumns, (e) => {
        const header = e.target.closest('.is-sortable');

        if (header) {
          this.setSortColumn(header.getAttribute('data-column-id'), header.getAttribute('aria-sort') !== 'ascending');
        }
      });
    }
  }

  /**
   * Set the column widths by generating the lengths in the css grid
   * and setting the css variable.
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
    this.eventHandlers.dispatchEvent('sorted', this, { elem: this, sortColumn: this.sortColumn });
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
   * Set the data array of the listview
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
}

export { IdsDataGrid, IdsDataGridFormatters };
