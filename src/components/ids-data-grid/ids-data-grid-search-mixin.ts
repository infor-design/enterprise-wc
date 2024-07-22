import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../../mixins/ids-events-mixin/ids-events-mixin';
import type IdsDataGrid from './ids-data-grid';
import IdsSearchField from '../ids-search-field/ids-search-field';

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * A mixin that adds search functionality to data grid
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsDataGridSearchMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  /**
   * Current search term
   */
  #searchTerm: string = '';

  /**
   * Reference to the search field element
   */
  #searchField: HTMLElement | IdsSearchField | null = null;

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.SEARCHABLE,
      attributes.SEARCH_TERM_MIN_SIZE,
      attributes.SEARCH_FIELD,
      attributes.SEARCH_FIELD_ID
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.dataGrid.pager.onEvent('pagenumberchange', this, () => {
      this.highlightSearchRows();
    });

    this.dataGrid.pager.onEvent('pagesizechange', this, () => {
      this.highlightSearchRows();
    });
  }

  /**
   * Reference to the data grid parent
   * @returns {IdsDataGrid} the data grid parent
   */
  get dataGrid() {
    return this as unknown as IdsDataGrid;
  }

  /**
   * Reference to the data grid toolbar
   * @returns {HTMLElement} the toolbar
   */
  get toolbar() {
    const toolbar = this.dataGrid.shadowRoot?.querySelector('.ids-data-grid-toolbar');
    if (!toolbar) {
      this.dataGrid?.wrapper?.insertAdjacentHTML('afterbegin', '<div class="ids-data-grid-toolbar"></div>');
      return this.dataGrid.shadowRoot?.querySelector('.ids-data-grid-toolbar');
    }

    return toolbar;
  }

  /**
   * Attach event listeners for search field
   */
  #attachEventListeners() {
    if (!this.searchField) return;

    const input = (this.searchField as IdsSearchField)?.input ?? this.searchField;

    input?.addEventListener('input', (e: any) => {
      this.#onSearch(e.target?.value || '');
    });

    this.searchField?.addEventListener('cleared', () => {
      this.#onSearch('');
    });
  }

  /**
   * Handles the search event
   * @param {string} value The search value
   * @returns {void}
   */
  #onSearch(value: string) {
    if (value !== '' && value.length > this.searchTermMinSize) {
      this.#searchTerm = value.toLowerCase();
      return this.#handleSearchKeyword();
    }
    this.dataGrid.filters.applyFilter();
    this.resetHighlightSearchRows();
  }

  /**
   * Get search field template
   * @returns {string} The search field template
   */
  searchFieldTemplate(): string {
    const cssParts = 'container: searchfield-container, field-container: searchfield-field-container, input: searchfield-input, popup: searchfield-popup';

    return `<ids-search-field id="data-grid-search-field" label="Search" label-state="collapsed" size="" exportparts="${cssParts}" clearable no-margins></ids-search-field>`;
  }

  /**
   * Set the searchable
   * @returns {void}
   */
  setSearchable(): void {
    if (!this.searchField && this.searchable) {
      this.toolbar?.insertAdjacentHTML('afterbegin', this.searchFieldTemplate());
      this.searchField = this.toolbar?.querySelector('ids-search-field') || null;
    }

    this.#makeItSearchable();
  }

  #makeItSearchable() {
    const isSearchField = !!this.searchField;
    this.dataGrid.wrapper?.classList.toggle('has-searchfield', isSearchField);
    this.#attachEventListeners();
  }

  /**
   * Set searchable which allows list view to be filtered
   * @param {string | boolean | null} value The value
   */
  set searchable(value: string | boolean | null) {
    this.toggleAttribute(attributes.SEARCHABLE, stringToBool(value));
    this.setSearchable();
  }

  get searchable(): boolean {
    return this.hasAttribute(attributes.SEARCHABLE);
  }

  /**
   * Set search term min size, will trigger filtering only when its length is greater than or equals to term value.
   * @param {string | number | null} value The value
   */
  set searchTermMinSize(value: string | number | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && val > 0) this.setAttribute(attributes.SEARCH_TERM_MIN_SIZE, val.toString());
    else this.removeAttribute(attributes.SEARCH_TERM_MIN_SIZE);
  }

  get searchTermMinSize(): number {
    const val = stringToNumber(this.getAttribute(attributes.SEARCH_TERM_MIN_SIZE));
    return (!Number.isNaN(val) && val > 0) ? val : 1;
  }

  /**
   * Set search field
   * @param {string} value The value
   */
  set searchFieldId(value: string) {
    if (value) {
      this.setAttribute(attributes.SEARCH_FIELD_ID, value);
      this.searchField = document.querySelector<HTMLElement>(`#${value}`);
    } else {
      this.removeAttribute(attributes.SEARCH_FIELD_ID);
    }
  }

  get searchFieldId() {
    return this.getAttribute(attributes.SEARCH_FIELD_ID) || '';
  }

  /**
   * Set search field
   * @param {HTMLElement | IdsSearchField | null} value - A custom search element
   */
  set searchField(value: HTMLElement | IdsSearchField | null) {
    this.#searchField = value;
    this.#makeItSearchable();
  }

  /**
   * Get search field
   * @returns {HTMLElement | IdsSearchField | null} value - The custom search element
   */
  get searchField(): HTMLElement | IdsSearchField | null {
    return this.#searchField;
  }

  /**
   * Handles the search keyword
   */
  #handleSearchKeyword() {
    const filterExpr: any = [];
    const term = (this.#searchTerm || '').toLowerCase();
    filterExpr.push({
      column: 'all',
      operator: 'contains',
      value: term,
      keywordSearch: true
    });

    this.dataGrid.filters?.applyFilter(filterExpr);
    this.highlightSearchRows();

    /**
     * Triggered when the user searched for a term
     * @event searched.datagrid
     * @property {string} value The searched term
     */
    this.triggerEvent('searched.datagrid', this, {
      detail: {
        value: this.#searchTerm
      }
    });
  }

  resetHighlightSearchRows() {
    this.container?.querySelectorAll('ids-data-grid-cell').forEach((cell) => {
      cell.innerHTML = cell.innerHTML.replace(/<strong class="highlight">/g, '').replace(/<\/strong>/g, '');
    });
  }

  highlightSearchRows() {
    if (!this.#searchTerm || this.#searchTerm === '') return;
    this.container?.querySelectorAll('ids-data-grid-cell').forEach((cell) => {
      const text = cell.textContent || '';

      if (!text.toLowerCase().includes(this.#searchTerm)) return;

      const regex = new RegExp(`(${this.#searchTerm})`, 'gi');

      const replaceTmpl = (matched: string) => `<strong class="highlight">${matched}</strong>`;
      const replaceMatch = (s: string) => s.replace(regex, replaceTmpl);

      const cellHtml = cell.innerHTML;
      cell.innerHTML = cellHtml.replace(text, replaceMatch(text));
    });
  }
};

export default IdsDataGridSearchMixin;
