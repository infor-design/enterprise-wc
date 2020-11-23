import {
  IdsElement,
  customElement,
  scss,
  props,
  mixin
} from '../ids-base/ids-element';

import { IdsDataSourceMixin } from '../ids-base/ids-data-source-mixin';
import { IdsDeepCloneMixin } from '../ids-base/ids-deep-clone-mixin';

import { IdsDataGridFormatters } from './ids-data-grid-formatters';
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
   */
  template() {
    let html = '';

    if (this?.data.length === 0) {
      return html;
    }

    if (this?.virtualScroll !== 'true') {
      html = `<div class="ids-data-grid"><table role="grid">`;
      html += this.headerTemplate();
      html += this.bodyTemplate();
      html += `</table></div>`;
      return html;
    }

    // Virtual Scrolling Datagrid
    html = `<ids-virtual-scroll height="310">
        <div class="ids-data-grid">
          <ul slot="contents">
          </ul>
        </div>
      </ids-virtual-scroll>`;
    return html;
  }

  headerTemplate() {
    let colgroup = '<colgroup>';
    let thead = '<thead><tr>';

    if (!this.currentColumns) {
      return colgroup;
    }

    this.currentColumns.forEach((columnData) => {
      colgroup += `<col>`;
      thead += `<th scope="col" role=columnheader">${this.headerCellTemplate(columnData)}</th>`;
    });
    return `${colgroup}</colgroup>${thead}</tr></thead>`;
  }

  headerCellTemplate(columnData) {
    return `<div class="ids-column-header">${columnData.name || ''}</div>`;
  }

  bodyTemplate() {
    let html = '';

    if (!this.data) {
      return html;
    }

    this.data.forEach((rowData, i) => {
      html += `<tr role="row" aria-rowindex="${i}" class="ids-data-grid-row">`;

      this.currentColumns.forEach((columnData, j) => {
        html += `<td role="gridcell" aria-colindex="${j}">${this.cellTemplate(rowData, columnData)}</td>`;
      });

      html += '</tr>';
    });

    return `${html}</tr>`;
  }

  cellTemplate(rowData, columnData) {
    return `<div class="ids-data-grid-cell-wrapper">${this.formatters.text(rowData, columnData)}</div>`;
  }

  /**
   * Rerender the list by re applying the template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    const html = this.template();

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    if (html) {
      template.innerHTML = html;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  /**
   * Set a style on every alternate row for better readability.
   * @param {boolean} value true to use alternate row shading
   */
  set alternateRowShading(value) {
    if (value) {
      this.setAttribute(props.ALTERNATE_ROW_SHADING, value);
      return;
    }

    this.removeAttribute(props.ALTERNATE_ROW_SHADING);
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
