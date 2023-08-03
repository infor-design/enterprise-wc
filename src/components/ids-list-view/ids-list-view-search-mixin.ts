import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import { deepClone } from '../../utils/ids-deep-clone-utils/ids-deep-clone-utils';
import { sanitizeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { EventsMixinInterface } from '../../mixins/ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';

import type IdsListView from './ids-list-view';
import type IdsSearchField from '../ids-search-field/ids-search-field';

type Constraints = IdsConstructor<EventsMixinInterface>;
type SearchItem = string | HTMLElement | object;
type SearchFilterModes = string | null | 'contains' | 'keyword' | 'phrase-starts-with' | 'word-starts-with';

const IdsListViewSearchMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.SEARCH_FIELD_ID,
      attributes.SEARCH_FILTER_MODE,
      attributes.SEARCH_TERM_CASE_SENSITIVE,
      attributes.SEARCH_TERM_MIN_SIZE,
      attributes.SEARCHABLE,
      attributes.SUPPRESS_HIGHLIGHT
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Possible Filter Modes
   */
  searchFilterModes = {
    CONTAINS: 'contains',
    KEYWORD: 'keyword',
    PHRASE_STARTS_WITH: 'phrase-starts-with',
    WORD_STARTS_WITH: 'word-starts-with'
  };

  /**
   * Search filter callback, use for custom filter to match
   */
  searchFilterCallback: null | ((term: string) => ((item: SearchItem) => boolean)) = null;

  /**
   * Searchable text callback
   */
  searchableTextCallback: null | ((item: SearchItem) => string) = null;

  /**
   * Current search term
   */
  #term = '';

  /**
   * Get search container element
   * @returns {HTMLDivElement|null|undefined} The search container element
   */
  get searchContainer(): HTMLDivElement | null | undefined {
    return this.shadowRoot?.querySelector('.ids-list-view-search');
  }

  /**
   * Get search field element
   * @returns {HTMLDivElement|null|undefined} The search field element
   */
  get searchField(): IdsSearchField | null | undefined {
    let searchfield: IdsSearchField | null | undefined = this.querySelector<IdsSearchField>('ids-search-field[slot="search"]');
    if (!searchfield && this.searchFieldId) {
      searchfield = this.closest('ids-container')?.querySelector(`#${this.searchFieldId}`);
    }
    return searchfield;
  }

  /**
   * Set ID of the search field element to use for the search
   * @param {string | null} value The value
   */
  set searchFieldId(value: string | null) {
    if (value) this.setAttribute(attributes.SEARCH_FIELD_ID, String(value));
    else this.removeAttribute(attributes.SEARCH_FIELD_ID);
    (this as unknown as IdsListView).redraw?.();
  }

  get searchFieldId(): string | null {
    return this.getAttribute(attributes.SEARCH_FIELD_ID);
  }

  /**
   * Set search filter mode
   * @param {SearchFilterModes} value The value
   */
  set searchFilterMode(value: SearchFilterModes) {
    if (Object.values(this.searchFilterModes).includes(value || '')) {
      this.setAttribute(attributes.SEARCH_FILTER_MODE, String(value));
    } else this.removeAttribute(attributes.SEARCH_FILTER_MODE);
  }

  get searchFilterMode(): string {
    const defaultVal = this.searchFilterModes.CONTAINS;
    return this.getAttribute(attributes.SEARCH_FILTER_MODE) || defaultVal;
  }

  /**
   * Set search term case sensitive
   * @param {string | boolean | null} value The value
   */
  set searchTermCaseSensitive(value: string | boolean | null) {
    if (stringToBool(value)) this.setAttribute(attributes.SEARCH_TERM_CASE_SENSITIVE, '');
    else this.removeAttribute(attributes.SEARCH_TERM_CASE_SENSITIVE);
  }

  get searchTermCaseSensitive(): boolean {
    return this.hasAttribute(attributes.SEARCH_TERM_CASE_SENSITIVE);
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
   * Set search term text to be suppress highlight when using searchable
   * @param {string | boolean | null} value The value
   */
  set suppressHighlight(value: string | boolean | null) {
    if (stringToBool(value)) this.setAttribute(attributes.SUPPRESS_HIGHLIGHT, '');
    else this.removeAttribute(attributes.SUPPRESS_HIGHLIGHT);
  }

  get suppressHighlight(): boolean {
    return this.hasAttribute(attributes.SUPPRESS_HIGHLIGHT);
  }

  /**
   * Get search template
   * @returns {string} The search template
   */
  searchTemplate(): string {
    return this.searchFieldId
      ? '' : `<div class="ids-list-view-search" part="search"><slot name="search"></slot></div>`;
  }

  /**
   * Get search field template
   * @returns {string} The search field template
   */
  searchFieldTemplate(): string {
    const cssParts = 'container: searchfield-container, field-container: searchfield-field-container, input: searchfield-input, popup: searchfield-popup';

    return `<ids-search-field slot="search" label="List view search" label-state="collapsed" size="full" exportparts="${cssParts}" ids-lv-default-searchfield clearable no-margins></ids-search-field>`;
  }

  /**
   * Reset search
   * @returns {void}
   */
  resetSearch(): void {
    this.#term = '';
    const lv = this as unknown as IdsListView;
    if (!lv.datasource?.filtered) return;

    lv.datasource?.filter(null);
    lv.redraw?.();
    lv.triggerEvent('filtered', lv, { bubbles: true, detail: { elem: lv, type: 'clear', term: '' } });
  }

  /**
   * Set the searchable
   * @returns {void}
   */
  setSearchable(): void {
    const getSlotted = () => this.shadowRoot?.querySelector<any>('slot[name="search"]')?.assignedElements()[0];

    let slotted = getSlotted();
    if (!slotted && this.searchable) {
      this.insertAdjacentHTML('afterbegin', this.searchFieldTemplate());
      slotted = getSlotted();
    } else if (!this.searchable && slotted?.hasAttribute('ids-lv-default-searchfield')) {
      slotted.remove();
    }

    const isSearchfield = !!getSlotted();
    this.container?.classList[isSearchfield ? 'add' : 'remove']('has-searchfield');
    this.searchContainer?.classList[isSearchfield ? 'add' : 'remove']('has-searchfield');
    this.#attachSearchField();
  }

  /**
   * Attaches a slotted IdsSearchField component
   * @private
   * @returns {void}
   */
  #attachSearchField(): void {
    const searchField = this.searchField;
    if (searchField) {
      searchField.onSearch = (term: string) => this.#handleSearch(term);

      this.offEvent('cleared.listviewsearch');
      this.onEvent('cleared.listviewsearch', searchField, () => this.resetSearch());
    }
  }

  /**
   * Get object props as text
   * @param {string} item The term value
   * @returns {string|HTMLElement|object} The searchable content
   */
  #objectPropsAsText(item: string | HTMLElement | object): string {
    const excludeValues = ['isFilteredOut'];
    let text = '';

    Object.keys(item).forEach((prop) => {
      if (excludeValues.indexOf(prop) > 0) return;
      const pad = text.length ? ' ' : '';
      text += `${pad}${(item as any)[prop]}`;
    });
    return text;
  }

  /**
   * Get searchable content
   * @private
   * @param {string} item The term value
   * @returns {string|HTMLElement|object} The searchable content
   */
  #searchableContent(item: string | HTMLElement | object): string {
    let santitize = true;
    if (typeof this.searchableTextCallback === 'function') {
      return this.searchableTextCallback(item) ?? '';
    }

    let targetContent;
    if (typeof item === 'string') {
      targetContent = item;
    } else if (item instanceof HTMLElement) {
      santitize = false;
      targetContent = item.innerText;
    } else { // Object
      targetContent = this.#objectPropsAsText(item);
    }

    if (santitize) targetContent = sanitizeHTML(targetContent);

    return targetContent ?? '';
  }

  /**
   * Matches the provided term against the beginning of all words in a text string.
   * @private
   * @param {string} text searchable text.
   * @param {string} term the term for which to search in the text string.
   * @returns {boolean} true if the term is present.
   */
  #wordStartsWithFilter(text: string, term: string): boolean {
    const parts = text.split(' ');

    // Check all words for a match
    for (let a = 0; a < parts.length; a++) {
      if (parts[a].indexOf(term) === 0) return true;
    }

    // Direct Match
    if (text.indexOf(term) === 0) return true;

    // Partial dual word match
    if (term.indexOf(' ') > 0 && text.indexOf(term) > 0) return true;

    return false;
  }

  /**
   * Handle search for given trem
   * @private
   * @param {string} term The term value
   * @returns {void}
   */
  #handleSearch(term: string): void {
    const lv = this as unknown as IdsListView;
    if (!lv.datasource) return;

    // Reset search if term is empty
    const isTermString = typeof term === 'string';
    if (!isTermString || (isTermString && term === '')) return this.resetSearch();

    // Make sure will trigger filtering only when its length is greater than or equals to search term min size.
    if (term.length < this.searchTermMinSize) {
      this.resetSearch();
      return;
    }

    // Avoid multiple runs if the search term is the same
    if (this.#term === term) return;

    this.#term = term;

    // Make search term lowercase if the search is not case-senstive
    if (!this.searchTermCaseSensitive) {
      term = term.toLowerCase();
    }

    // Iterates through each list item and attempts to find the provided search term.
    const searchItemIterator = (item: string | HTMLElement | object): boolean => {
      let text = this.#searchableContent(item);
      if (!this.searchTermCaseSensitive) {
        text = text.toLowerCase().trim();
      }

      const modes = this.searchFilterModes;
      let match = false;

      // For checking if any word in the string begins with the term, use `word-starts-with`
      if (this.searchFilterMode === modes.WORD_STARTS_WITH) {
        match = this.#wordStartsWithFilter(text, term);
      }

      // For checking if a string begins with the term, use `phrase-starts-with`
      if ((this.searchFilterMode === modes.PHRASE_STARTS_WITH) && (text.indexOf(term) === 0)) {
        match = true;
      }

      // Checking if a string contains the term
      if ((this.searchFilterMode === modes.CONTAINS) && (text.indexOf(term) >= 0)) {
        match = true;
      }

      // Keywords filter mode
      if (this.searchFilterMode === modes.KEYWORD) {
        const keywords = term.split(' ');
        for (let i = 0; i < keywords.length; i++) {
          if (text.indexOf(keywords[i]) >= 0) {
            match = true;
            break;
          }
        }
      }

      return !match;
    };

    // Set custom or default filter to match
    let itemIterator = searchItemIterator;
    if (typeof this.searchFilterCallback === 'function') {
      itemIterator = this.searchFilterCallback(term);
    }

    // Apply filter
    lv.datasource.filter(itemIterator);
    lv.redraw?.();
    lv.triggerEvent('filtered', lv, { bubbles: true, detail: { elem: lv, type: 'apply', term } });
  }

  /**
   * Set search term highlight
   * @param {string | HTMLElement | object} item The from data item
   * @returns {string} search term highlight
   */
  searchHighlight(item: string | HTMLElement | object): string | HTMLElement | object {
    if (this.suppressHighlight || !item || this.#term === '') return item;

    // Set regex according to search filter mode
    let regex: any = null;
    const modes = this.searchFilterModes;
    const flag = this.searchTermCaseSensitive ? 'g' : 'gi';
    const replaceTmpl = `<strong class="highlight">$1</strong>`;
    let replaceMatch = (s: string) => s.replace(regex, replaceTmpl);
    if (this.searchFilterMode === modes.WORD_STARTS_WITH) {
      regex = new RegExp(`(^|\\s)(${this.#term})`, flag);
      replaceMatch = (s: string) => s.replace(regex, (m: string) => (
        m.replace(new RegExp(`(${this.#term})`, flag), replaceTmpl)
      ));
    } else if (this.searchFilterMode === modes.PHRASE_STARTS_WITH) {
      regex = new RegExp(`^(${this.#term})`, flag);
    } else if ((this.searchFilterMode === modes.CONTAINS)
      || (this.searchFilterMode === modes.KEYWORD)) {
      regex = new RegExp(`(${this.#term})`, flag);
    }

    // No need to go further if regex is null
    if (!regex) return item;

    let term = this.#term;
    let text = this.#searchableContent(item);
    let cloneItem = deepClone(item);

    // Set case sensitive
    if (!this.searchTermCaseSensitive) {
      term = term.toLowerCase();
      text = text.toLowerCase();
    }

    // Highlight search term
    if (text.indexOf(term) >= 0) {
      if (typeof cloneItem === 'string' && text === cloneItem) {
        cloneItem = replaceMatch(cloneItem);
      } else if (cloneItem instanceof HTMLElement) {
        const itmText = cloneItem.innerText;
        const sHtml = sanitizeHTML(cloneItem.innerText);
        if (text === sHtml) cloneItem.innerText = replaceMatch(itmText);
      } else { // Object
        for (const [key, value] of Object.entries(cloneItem)) {
          const val = this.searchTermCaseSensitive ? value : value?.toString().toLowerCase();
          if (text === val) (cloneItem as any)[key] = replaceMatch(value as any);
        }
      }
    }

    return cloneItem;
  }
};

export default IdsListViewSearchMixin;
