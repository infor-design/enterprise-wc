import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix,
  IdsDataSource
} from '../../core';

// Import Utils
import { IdsDeepCloneUtils, IdsStringUtils as stringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

// Import Dependencies
import { IdsDataGridFormatters } from './ids-data-grid-formatters';
import IdsVirtualScroll from '../ids-virtual-scroll';

// Import Styles
import styles from './ids-data-grid.scss';

const rowHeights = {
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
 * @part container - the table container element
 * @part body - the table body element
 * @part header - the header element
 * @part header-cell - the header cells
 * @part row - the row elements
 * @part cell - the row cell elements
 */
@customElement('ids-data-grid')
@scss(styles)
class IdsDataGrid extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin,
    IdsKeyboardMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.state = { selectedRows: [], activatedRow: null };
    super.connectedCallback();
  }

  formatters = new IdsDataGridFormatters();

  datasource = new IdsDataSource();

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.ALTERNATE_ROW_SHADING,
      attributes.AUTO_FIT,
      attributes.LABEL,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.LIST_STYLE,
      attributes.ROW_HEIGHT,
      attributes.ROW_SELECTION,
      attributes.SUPRESS_ROW_DEACTIVATION,
      attributes.SUPRESS_ROW_DESELECTION,
      attributes.VIRTUAL_SCROLL,
      attributes.MODE,
      attributes.VERSION
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

    const cssClasses = [
      `${this.alternateRowShading ? `alt-row-shading` : ``}`,
      `${this.listStyle ? `is-list-style` : ``}`
    ];

    const html = `
      <div
        class="ids-data-grid ${cssClasses}"
        role="table" part="table" aria-label="${this.label}"
        data-row-height="${this.rowHeight}"
        mode="${this.mode}"
        version="${this.version}"
      >
      ${this.headerTemplate()}
      ${this.virtualScroll
      ? `<ids-virtual-scroll>
          <div class="ids-data-grid-body" part="style-wrapper" part="body" role="rowgroup"></div>
        </ids-virtual-scroll>`
      : `${this.bodyTemplate()}`
      }
      </div>
    `;

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
    const dir = this.container?.getAttribute('dir');
    const html = this.template();

    // Render and append styles
    this.shadowRoot.innerHTML = '';
    this.hasStyles = false;
    this.appendStyles();
    this.setColumnWidths();
    template.innerHTML = html;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('.ids-data-grid');

    // Setup virtual scrolling
    if (this.virtualScroll && this.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      if (this.virtualScrollContainer) {
        this.virtualScrollContainer.scrollTarget = this.container;
        this.virtualScrollContainer.itemTemplate = (row, index) => this.rowTemplate(row, index);
        this.virtualScrollContainer.itemCount = this.data.length;
        this.virtualScrollContainer.itemHeight = this.rowPixelHeight;
        this.virtualScrollContainer.data = this.data;
      }
    }

    this.#attachEventHandlers();

    if (this.data.length > 0) {
      this.setActiveCell(0, 0, true);
      this.#attachKeyboardListeners();
    }

    if (this.autoFit) this.container.style.height = `100%`;

    // Set back direction
    if (dir) {
      this.container.setAttribute('dir', dir);
    }

    // Set back selection
    this.#setHeaderCheckbox();
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
          ${this.columns.map((columnData) => `${this.headerCellTemplate(columnData)}`).join('')}
        </div>
      </div>
    `;
    return html;
  }

  /**
   * Returns the markup for a header cell.
   * @private
   * @param {object} column The column info
   * @returns {string} The resuling header cell template
   */
  headerCellTemplate(column) {
    const cssClasses = [
      `${column.sortable ? 'is-sortable' : ''}`
    ];

    const selectionCheckBoxTemplate = `
      <span class="ids-datagrid-checkbox-container">
        <span 
          role="checkbox" 
          aria-checked="false" 
          aria-label="${column.name}" 
          class="ids-datagrid-checkbox"
        >
        </span>
      </span>
    `;

    const sortIndicatorTemplate = `
      <div class="sort-indicator">
        <ids-icon icon="dropdown"></ids-icon>
        <ids-icon icon="dropdown"></ids-icon>
      </div>
    `;

    const headerContentTemplate = `
      ${(column.id !== 'selectionRadio' && column.id === 'selectionCheckBox') ? selectionCheckBoxTemplate : ''}
      ${(column.id !== 'selectionRadio' && column.id !== 'selectionCheckBox' && column.name) ? column.name : ''}
    `.trim();

    const html = `
      <span 
        class="ids-data-grid-header-cell ${cssClasses.join(' ')}"
        part="header-cell"
        data-column-id="${column.id}"
        role="columnheader"
      >
        <span class="ids-data-grid-header-text">
          ${headerContentTemplate}
        </span>
        ${column.sortable ? sortIndicatorTemplate : ''}
      </span>
    `;

    return html;
  }

  /**
   * Body template markup
   * @private
   * @returns {string} The template
   */
  bodyTemplate() {
    return `
      <div class="ids-data-grid-body" part="body" role="rowgroup">
        ${this.data.map((row, index) => this.rowTemplate(row, index)).join('')}
      </div> 
    `;
  }

  /**
   * Return the row's markup
   * @private
   * @param {object} row The row data object
   * @param {number} index [description]
   * @returns {string} The html string for the row
   */
  rowTemplate(row, index) {
    const rowClasses = [
      `${row?.rowSelected ? 'selected' : ''}`,
      `${row?.rowSelected && this.rowSelected === 'mixed' ? 'mixed' : ''}`,
      `${row?.rowActivated ? 'activated' : ''}`,
    ];

    return `
      <div role="row" part="row" aria-rowindex="${index + 1}" class="ids-data-grid-row ${rowClasses.join(' ')}">
        ${this.columns.map((column, j) => `
          <span role="cell" part="cell" class="ids-data-grid-cell ${column?.readonly ? `readonly` : ``}" aria-colindex="${j + 1}">
            ${this.cellTemplate(row, column, index + 1, this)}
          </span>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render the individual cell using the column formatter
   * @private
   * @param {object} row The data item for the row
   * @param {object} column The column data for the row
   * @param {object} index The running index
   * @param {object} api The entire datagrid api
   * @returns {string} The template to display
   */
  cellTemplate(row, column, index, api) {
    return this.formatters[column?.formatter?.name || 'text'](row, column, index, api);
  }

  /**
   * Handle all triggering and handling of events
   * @private
   */
  #attachEventHandlers() {
    const sortableColumns = this.shadowRoot.querySelector('.ids-data-grid-header');

    // Add a sort Handler
    this.offEvent('click.sort', sortableColumns);
    this.onEvent('click.sort', sortableColumns, (e) => {
      const header = e.target.closest('.is-sortable');

      if (header) {
        this.setSortColumn(header.getAttribute('data-column-id'), header.getAttribute('aria-sort') !== 'ascending');
      }
    });

    // Add a cell click handler
    const body = this.shadowRoot.querySelector('.ids-data-grid-body');
    this.offEvent('click.body', body);
    this.onEvent('click.body', body, (e) => {
      const cell = e.target.closest('.ids-data-grid-cell');
      const row = cell.parentNode;
      this.setActiveCell(parseInt(cell.getAttribute('aria-colindex') - 1, 10), parseInt(row.getAttribute('aria-rowindex') - 1, 10));

      if (this.rowSelection === 'mixed') {
        if (cell.children[0].classList.contains('ids-datagrid-checkbox-container')) {
          this.#handleRowSelection(row);
        } else {
          this.#handleRowActivation(row);
        }
        return;
      }
      this.#handleRowSelection(row);
    });

    // Add a click to the table header
    this.headerCheckbox = this.shadowRoot.querySelector('.ids-data-grid-header .ids-datagrid-checkbox-container .ids-datagrid-checkbox');
    this.offEvent('click.select', this.headerCheckbox);
    this.onEvent('click.select', this.headerCheckbox, (e) => {
      if (e.target.classList.contains('checked') || e.target.classList.contains('indeterminate')) {
        this.deSelectAllRows();
      } else {
        this.selectAllRows();
      }
    });

    // Handle the Locale Changes
    // Respond to parent changing language
    this.offEvent('languagechange.data-grid-container');
    this.onEvent('languagechange.data-grid-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });

    // Respond to the element changing language
    this.offEvent('languagechange.data-grid');
    this.onEvent('languagechange.data-grid', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
    });

    // Respond to parent changing language
    this.offEvent('localechange.data-grid-container');
    this.onEvent('localechange.data-grid-container', this.closest('ids-container'), async (e) => {
      await this.setLocale(e.detail.locale.name);
      this.rerender();
    });

    // Respond to the element changing language
    this.offEvent('localechange.data-grid');
    this.onEvent('localechange.data-grid', this, async (e) => {
      if (!e.detail.locale.name) {
        return;
      }
      await this.locale.setLocale(e.detail.locale.name);
      this.rerender();
    });
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    // Handle arrow navigation
    this.listen(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'], this, (e) => {
      const key = e.key;
      const rowDiff = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0); //eslint-disable-line
      const cellDiff = key === 'ArrowRight' ? 1 : (key === 'ArrowLeft' ? -1 : 0); //eslint-disable-line

      this.setActiveCell(Number(this.activeCell?.cell) + cellDiff, Number(this.activeCell?.row) + rowDiff);
      e.preventDefault();
      e.stopPropagation();
    });

    // Handle Selection
    this.listen([' '], this, () => {
      this.#handleRowSelection(this.rowByIndex(this.activeCell.row));
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

    if (!this.shadowRoot.styleSheets) {
      return;
    }

    const styleSheet = this.shadowRoot.styleSheets[0];

    if (!styleSheet) {
      return;
    }

    this.columns.forEach((column, i) => {
      // Special Columns
      if (column.id === 'selectionCheckbox' || column.id === 'selectionRadio') {
        column.width = 45;
      }
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
    this.datasource.sort(id, ascending, null);
    this.#syncSelectedRows();
    this.#syncActivatedRow();
    this.rerender();
    this.setSortState(id, ascending);
    this.triggerEvent('sort', this, { detail: { elem: this, sortColumn: this.sortColumn } });
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
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'true');
      this.shadowRoot?.querySelector('.ids-data-grid').classList.add('alt-row-shading');
      return;
    }

    this.shadowRoot?.querySelector('.ids-data-grid').classList.remove('alt-row-shading');
    this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'false');
  }

  get alternateRowShading() {
    return stringUtils.stringToBool(this.getAttribute(attributes.ALTERNATE_ROW_SHADING)) || false;
  }

  /**
   * Set the columns array of the datagrid
   * @param {Array} value The array to use
   */
  set columns(value) {
    this.currentColumns = value ? IdsDeepCloneUtils.deepClone(value) : [{ id: '', name: '' }];
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
   * @param {boolean|string} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    stringUtils.stringToBool(value)
      ? this.setAttribute(attributes.VIRTUAL_SCROLL, 'true')
      : this.removeAttribute(attributes.VIRTUAL_SCROLL);

    this.rerender();
  }

  get virtualScroll() { return stringUtils.stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

  /**
   * Set the aria-label element in the DOM. This should be translated.
   * @param {string} value The aria label
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('aria-label', value);
      return;
    }

    this.removeAttribute(attributes.LABEL);
    this.shadowRoot.querySelector('.ids-data-grid').setAttribute('aria-label', 'Data Grid');
  }

  get label() { return this.getAttribute(attributes.LABEL) || 'Data Grid'; }

  /**
   * Set the row height between extra-small, small, medium and large (default)
   * @param {string} value The row height
   */
  set rowHeight(value) {
    if (value) {
      this.setAttribute(attributes.ROW_HEIGHT, value);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('data-row-height', value);
    } else {
      this.removeAttribute(attributes.ROW_HEIGHT);
      this.shadowRoot.querySelector('.ids-data-grid').setAttribute('data-row-height', 'lg');
    }

    if (this.virtualScroll) {
      this.rerender();
    }
  }

  get rowHeight() { return this.getAttribute(attributes.ROW_HEIGHT) || 'lg'; }

  /**
   * Set the style of the grid to list style for simple readonly lists
   * @param {boolean} value list styling to use
   */
  set listStyle(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(attributes.LIST_STYLE, value);
      this.shadowRoot.querySelector('.ids-data-grid').classList.add('is-list-style');
    } else {
      this.removeAttribute(attributes.LIST_STYLE);
      this.shadowRoot.querySelector('.ids-data-grid').classList.remove('is-list-style');
    }
  }

  get listStyle() { return stringUtils.stringToBool(this.getAttribute(attributes.LIST_STYLE)) || false; }

  /**
   * Set the row selection mode between false, 'single', 'multiple' and 'mixed'
   * @param {string|boolean} value selection mode to use
   */
  set rowSelection(value) {
    if (stringUtils.stringToBool(value)) {
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
  set supressRowDeselection(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(attributes.SUPRESS_ROW_DESELECTION, value);
    } else {
      this.removeAttribute(attributes.SUPRESS_ROW_DESELECTION);
    }
  }

  get supressRowDeselection() { return this.getAttribute(attributes.SUPRESS_ROW_DESELECTION) || false; }

  /**
   * Set to true to prevent rows from being deactivated if clicked.
   * i.e. once a row is activated, it remains activated until another row is activated in its place.
   * @param {string|boolean} value true or false
   */
  set supressRowDeactivation(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(attributes.SUPRESS_ROW_DEACTIVATION, value);
    } else {
      this.removeAttribute(attributes.SUPRESS_ROW_DEACTIVATION);
    }
  }

  get supressRowDeactivation() { return this.getAttribute(attributes.SUPRESS_ROW_DEACTIVATION) || false; }

  /**
   * Resync the selected rows array's indexes
   * @private
   */
  #syncSelectedRows() {
    this.state.selectedRows = [];
    this.data?.forEach((row, index) => {
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
    this.data?.forEach((row, index) => {
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
    return selectedIndex.map((index) => ({ index, data: this.data[index] }));
  }

  /**
   * Get the activated row
   * @returns {number} The index of the selected row
   */
  get activatedRow() {
    if (this.state.activatedRow == null) {
      return null;
    }
    return { index: this.state.activatedRow, data: this.data[this.state.activatedRow] };
  }

  /**
   * Handle selection via click/keyboard
   * @param {number} row the row that was clicked
   */
  #handleRowSelection(row) {
    if (this.rowSelection === false) {
      return;
    }
    const isSelected = row.classList.contains('selected');
    if (isSelected && !this.supressRowDeselection) {
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
  #handleRowActivation(row) {
    const isActivated = row.classList.contains('activated');
    const currentRow = row.getAttribute('aria-rowindex') - 1;

    if (isActivated && !this.supressRowDeactivation) {
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
  rowByIndex(index) {
    return this.shadowRoot.querySelector(`.ids-data-grid-body .ids-data-grid-row[aria-rowindex="${index + 1}"]`);
  }

  /**
   * Set a row to selected
   * @param {number} index the zero based index
   */
  selectRow(index) {
    let row = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row.querySelector('.ids-datagrid-checkbox');
      checkbox?.classList.add('checked');
      checkbox?.setAttribute('aria-checked', 'true');
    }

    if (this.rowSelection === 'single') {
      this.deSelectAllRows();
      const radio = row.querySelector('.ids-datagrid-radio');
      radio?.classList.add('checked');
      radio?.setAttribute('aria-checked', 'true');
    }

    row.classList.add('selected');
    if (this.rowSelection === 'mixed') {
      row.classList.add('mixed');
    }
    this.state.selectedRows.push(index);
    this.data[index].rowSelected = true;

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
  deSelectRow(index) {
    let row = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection === 'mixed') {
      row.classList.remove('mixed');
    }
    row.classList.remove('selected');

    if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
      const checkbox = row.querySelector('.ids-datagrid-checkbox');
      checkbox?.classList.remove('checked');
      checkbox?.setAttribute('aria-checked', 'false');
    }

    if (this.rowSelection === 'single') {
      const radio = row.querySelector('.ids-datagrid-radio');
      radio?.classList.remove('checked');
      radio?.setAttribute('aria-checked', 'false');
    }

    this.state.selectedRows = this.state.selectedRows.filter((rowNumber) => rowNumber !== index);
    this.data[index].rowSelected = undefined;

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
  activateRow(index) {
    let row = index;
    if (typeof index === 'number') {
      row = this.rowByIndex(index);
    }

    if (this.rowSelection !== 'mixed') {
      return;
    }

    row.classList.add('activated');
    this.state.activatedRow = index;
    this.data[index].rowActivated = true;

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
  deActivateRow(index) {
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
    this.data[index].rowActivated = undefined;

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
    this.data?.forEach((row, index) => {
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
    this.data?.forEach((row, index) => {
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
  get rowPixelHeight() {
    return rowHeights[this.rowHeight];
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
   * Set the card to auto fit to its parent size
   * @param {boolean|null} value The auto fit
   */
  set autoFit(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(attributes.AUTO_FIT, value);
      return;
    }
    this.removeAttribute(attributes.AUTO_FIT);
  }

  get autoFit() { return stringUtils.stringToBool(this.getAttribute(attributes.AUTO_FIT)); }

  /**
   * Set the active cell for focus
   * @param {number} cell The cell to focus (zero based)
   * @param {number} row The row to focus (zero based)
   * @param {boolean} nofocus If true, do not focus the cell
   * @returns {object} the current active cell
   */
  setActiveCell(cell, row, nofocus) {
    // TODO Hidden Columns
    if (row < 0 || cell < 0 || row > this.data.length - 1 || cell > this.columns.length - 1) {
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
    const cellNode = queriedCells[cell];

    this.activeCell?.node?.removeAttribute('tabindex');
    this.activeCell.node = cellNode;
    cellNode.setAttribute('tabindex', '0');

    if (!nofocus) {
      cellNode.focus();
    }
    this.triggerEvent('activecellchange', this, { detail: { elem: this, activeCell: this.activeCell } });
    return this.activeCell;
  }
}

export { IdsDataGrid, IdsDataGridFormatters };
