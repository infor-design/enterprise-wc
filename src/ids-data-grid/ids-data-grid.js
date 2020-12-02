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

  connectedCallBack() {
    this.formatters = new IdsDataGridFormatters();
    this.datasource = new IdsDataSourceMixin();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.DATA, props.VIRTUAL_SCROLL, props.ALTERNATE_ROW_SHADING];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   * @private
   */
  template() {
    let html = '';

    if (this?.data.length === 0) {
      return html;
    }

    const additionalClasses = this.alternateRowShading ? ' alt-row-shading' : '';
    if (this?.virtualScroll !== 'true') {
      html = `<div class="ids-data-grid${additionalClasses}"><table role="grid">`;
      html += this.headerTemplate();
      html += this.bodyTemplate();
      html += `</table></div>`;
      return html;
    }

    html = `<div class="ids-data-grid${additionalClasses}">
      <ids-virtual-scroll>
        <table>
          ${this.headerTemplate()}
          <tbody slot="contents">
          </tbody>
        </table>
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

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    if (html) {
      this.appendStyles();
      template.innerHTML = html;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    if (this.virtualScroll === 'true' && this?.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.itemTemplate = (row, index) => this.rowTemplate(row, index);
      this.virtualScrollContainer.itemCount = this.data.length;
      this.virtualScrollContainer.height = 310;
      this.virtualScrollContainer.itemHeight = 50; // TODO Row Height setting
      this.virtualScrollContainer.data = this.data;
    }
  }

  /**
   * Header template markup
   * @returns {string} The template
   * @private
   */
  headerTemplate() {
    let colgroup = '<colgroup>';
    let thead = '<thead><tr>';

    if (!this.currentColumns) {
      return colgroup;
    }

    this.currentColumns.forEach((columnData) => {
      colgroup += `<col>`;
      thead += `<th scope="col" role="columnheader">${this.headerCellTemplate(columnData)}</th>`;
    });
    return `${colgroup}</colgroup>${thead}</tr></thead>`;
  }

  headerCellTemplate(columnData) {
    return `<div class="ids-column-header">${columnData.name || ''}</div>`;
  }

  /**
   * Body template markup
   * @returns {string} The template
   * @private
   */
  bodyTemplate() {
    let html = '';

    if (!this.data) {
      return html;
    }

    this.data.forEach((row, index) => {
      html += this.rowTemplate(row, index);
    });

    return `${html}</tr>`;
  }

  /**
   * Return the row's markup
   * @param  {object} row The row data object
   * @param  {number} index [description]
   * @returns {string} The html string for the row
   */
  rowTemplate(row, index) {
    let html = `<tr role="row" aria-rowindex="${index}" class="ids-data-grid-row">`;

    this.currentColumns.forEach((column, j) => {
      html += `<td role="gridcell" aria-colindex="${j}">${this.cellTemplate(row, column)}</td>`;
    });

    html += '</tr>';
    return html;
  }

  /**
   * Render the individual cell using the column formatter
   * @param  {object} row The data item for the row
   * @param  {object} column The column data for the row
   * @returns {string} The template
   */
  cellTemplate(row, column) {
    return `<div class="ids-data-grid-cell-wrapper">${this.formatters.text(row, column)}</div>`;
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
    if (value) {
      this.currentColumns = this.deepClone(value);
      this.rerender();
      return;
    }

    this.currentColumns = null;
  }

  get columns() { return this?.currentColumns || []; }

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
    if (value) {
      this.setAttribute(props.VIRTUAL_SCROLL, value);
      this.rerender();
      return;
    }

    this.removeAttribute(props.VIRTUAL_SCROLL);
    this.rerender();
  }

  get virtualScroll() { return this.getAttribute(props.VIRTUAL_SCROLL) || 'true'; }
}

export { IdsDataGrid, IdsDataGridFormatters };
