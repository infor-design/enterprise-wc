import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../../mixins/ids-events-mixin/ids-events-mixin';
import type IdsDataGrid from './ids-data-grid';
import IdsSearchField from '../ids-search-field/ids-search-field';

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * A mixin that adds tooltip functionality to data grid
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
  #searchedTerm: string = '';

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.SEARCHABLE,
      attributes.SEARCH_TERM_MIN_SIZE,
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
   * Attaches a slotted IdsSearchField component to the app menu
   */
  #attachSearchField() {
    const searchfield = this.toolbar?.querySelector<IdsSearchField>('ids-search-field');
    if (searchfield) {
      searchfield.onSearch = (value: string) => {
        if (value !== '' && value.length > this.searchTermMinSize) {
          this.#searchedTerm = value.toLowerCase();
          return this.#handleSearchKeyword();
        }
        this.dataGrid.filters.applyFilter();
        this.resetHighlightSearchRows();
        return [];
      };
    }
  }

  /**
   * Get search field template
   * @returns {string} The search field template
   */
  searchFieldTemplate(): string {
    const cssParts = 'container: searchfield-container, field-container: searchfield-field-container, input: searchfield-input, popup: searchfield-popup';

    return `<ids-search-field label="Search" label-state="collapsed" size="" exportparts="${cssParts}" clearable no-margins></ids-search-field>`;
  }

  /**
   * Set the searchable
   * @returns {void}
   */
  setSearchable(): void {
    const getSearchField = () => this.toolbar?.querySelector<any>('ids-search-field');

    let searchField = getSearchField();
    if (!searchField && this.searchable) {
      this.toolbar?.insertAdjacentHTML('afterbegin', this.searchFieldTemplate());
      searchField = getSearchField();
    } else if (!this.searchable) {
      searchField?.remove();
    }

    const isSearchfield = !!getSearchField();
    this.dataGrid.wrapper?.classList.toggle('has-searchfield', isSearchfield);
    this.#attachSearchField();
  }

  /**
   * Set searchable which allows list view to be filtered
   * @param {string | boolean | null} value The value
   */
  set searchable(value: string | boolean | null) {
    if (stringToBool(value)) this.setAttribute(attributes.SEARCHABLE, '');
    else this.removeAttribute(attributes.SEARCHABLE);
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
    const defaultVal = 1;
    const val = stringToNumber(this.getAttribute(attributes.SEARCH_TERM_MIN_SIZE));
    return (!Number.isNaN(val) && val > 0) ? val : defaultVal;
  }

  #handleSearchKeyword() {
    const filterExpr: any = [];
    const term = (this.#searchedTerm || '').toLowerCase();
    filterExpr.push({
      column: 'all',
      operator: 'contains',
      value: term,
      keywordSearch: true
    });

    this.dataGrid.filters?.applyFilter(filterExpr);
    this.highlightSearchRows();
  }

  resetHighlightSearchRows() {
    this.container?.querySelectorAll('ids-data-grid-cell').forEach((cell) => {
      cell.innerHTML = cell.innerHTML.replace(/<strong class="highlight">/g, '').replace(/<\/strong>/g, '');
    });
  }

  highlightSearchRows() {
    if (!this.#searchedTerm || this.#searchedTerm === '') return;
    this.container?.querySelectorAll('ids-data-grid-cell').forEach((cell) => {
      const text = cell.textContent || '';

      if (!text.toLowerCase().includes(this.#searchedTerm)) return;

      const regex = new RegExp(`(${this.#searchedTerm})`, 'gi');
      const cellHtml = (cell.innerHTML);

      const replaceTmpl = (matched: string) => `<strong class="highlight">${matched}</strong>`;
      const replaceMatch = (s: string) => s.replace(regex, replaceTmpl);

      cell.innerHTML = cellHtml.replace(text, replaceMatch(text));
    });
  }
};

export default IdsDataGridSearchMixin;
