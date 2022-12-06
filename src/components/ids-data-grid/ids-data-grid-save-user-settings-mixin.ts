import { attributes } from '../../core/ids-attributes';
import { deepClone } from '../../utils/ids-deep-clone-utils/ids-deep-clone-utils';
import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../../mixins/ids-events-mixin/ids-events-mixin';
import type IdsDataGrid from './ids-data-grid';

import { IdsDataGridColumn } from './ids-data-grid-column';
import { IdsDataGridFilterConditions } from './ids-data-grid-filters';

type Constraints = IdsConstructor<EventsMixinInterface>;

export interface IdsDataGridSaveUserSettings {
  /** Set the active page number */
  activePage: number,
  /** Set the columns */
  columns: IdsDataGridColumn[],
  /** Set the filter conditions */
  filter: IdsDataGridFilterConditions[],
  /** Set the page size */
  pageSize: number,
  /** Set the row height */
  rowHeight: string,
  /** Set the sort order */
  sortOrder: { id: string, ascending: boolean }
}

/**
 * A mixin that adds save user settings functionality to data grid
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsDataGridSaveUserSettingsMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.SAVES_ACTIVE_PAGE,
      attributes.SAVES_COLUMNS,
      attributes.SAVES_FILTER,
      attributes.SAVES_PAGE_SIZE,
      attributes.SAVES_ROW_HEIGHT,
      attributes.SAVES_SORT_ORDER,
      attributes.SAVES_USER_SETTINGS
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Options to use with local storage.
   * @private
   */
  #options = {
    ACTIVE_PAGE: 'active-page',
    COLUMNS: 'columns',
    FILTER: 'filter',
    PAGE_SIZE: 'page-size',
    ROW_HEIGHT: 'row-height',
    SORT_ORDER: 'sort-order'
  };

  /**
   * State to check if can be able to save.
   */
  #saveMode = true;

  /**
   * List of restored options.
   */
  #restored: string[] = [];

  /**
   * Sets to saves active page
   * @param {boolean|string} value The value
   */
  set savesActivePage(value) {
    this.#setBoolAttribute(attributes.SAVES_ACTIVE_PAGE, value);
  }

  get savesActivePage() {
    return stringToBool(this.getAttribute(attributes.SAVES_ACTIVE_PAGE));
  }

  /**
   * Sets to saves columns
   * @param {boolean|string} value The value
   */
  set savesColumns(value) {
    this.#setBoolAttribute(attributes.SAVES_COLUMNS, value);
  }

  get savesColumns() {
    return stringToBool(this.getAttribute(attributes.SAVES_COLUMNS));
  }

  /**
   * Sets to saves filter
   * @param {boolean|string} value The value
   */
  set savesFilter(value) {
    this.#setBoolAttribute(attributes.SAVES_FILTER, value);
  }

  get savesFilter() {
    return stringToBool(this.getAttribute(attributes.SAVES_FILTER));
  }

  /**
   * Sets to saves page size
   * @param {boolean|string} value The value
   */
  set savesPageSize(value) {
    this.#setBoolAttribute(attributes.SAVES_PAGE_SIZE, value);
  }

  get savesPageSize() {
    return stringToBool(this.getAttribute(attributes.SAVES_PAGE_SIZE));
  }

  /**
   * Sets to saves row height
   * @param {boolean|string} value The value
   */
  set savesRowHeight(value) {
    this.#setBoolAttribute(attributes.SAVES_ROW_HEIGHT, value);
  }

  get savesRowHeight() {
    return stringToBool(this.getAttribute(attributes.SAVES_ROW_HEIGHT));
  }

  /**
   * Sets to saves sort order
   * @param {boolean|string} value The value
   */
  set savesSortOrder(value) {
    this.#setBoolAttribute(attributes.SAVES_SORT_ORDER, value);
  }

  get savesSortOrder() {
    return stringToBool(this.getAttribute(attributes.SAVES_SORT_ORDER));
  }

  /**
   * Sets to saves user settings
   * @param {boolean|string} value The value
   */
  set savesUserSettings(value) {
    this.#setBoolAttribute(attributes.SAVES_USER_SETTINGS, value);
  }

  get savesUserSettings() {
    return stringToBool(this.getAttribute(attributes.SAVES_USER_SETTINGS));
  }

  /**
   * Sets the given boolean attribute.
   * @private
   * @param {string} attributeName The attribute name
   * @param {boolean|string} value The value
   * @returns {void}
   */
  #setBoolAttribute(attributeName: string, value: boolean | string): void {
    if (stringToBool(value)) {
      this.setAttribute(attributeName, '');
      return;
    }
    this.removeAttribute(attributeName);
  }

  /**
   * Checks if local storage can be use.
   * @private
   * @returns {boolean} True, if local storage can be use.
   */
  #canUseLocalStorage(): boolean {
    try {
      if (typeof localStorage?.getItem === 'function') return true;
    } catch (exception) {
      return false;
    }
    return false;
  }

  /**
   * Get key to be use with local storage.
   * @private
   * @param {string} opt The option.
   * @param {string} prefix Optional prefix string to make the id more unique.
   * @param {string} suffix Optional suffix string to make the id more unique.
   * @param {string} uniqueId The uniqueId.
   * @returns {string} The key value.
   */
  #keyTobeUse(
    opt: string,
    prefix = '',
    suffix = '',
    uniqueId = (this as unknown as IdsDataGrid).uniqueId ?? this.getAttribute('id') ?? ''
  ): string {
    const key = `ids-data-grid-usersettings-${prefix}-${uniqueId}-${opt}-${suffix}`;
    return (key.replace(/-+/g, '-').replace(/-$/g, ''));
  }

  /**
   * Get key/value for given option.
   * @private
   * @param {string} opt The option.
   * @returns {{ key: string, value: any }} the value
   */
  #keyAndValue(opt: string): { key: string, value: any } {
    const grid = this as unknown as IdsDataGrid;

    // Adjust filters to keep minimal
    const filters = () => {
      const val: any = [];
      grid.filters?.filterConditions?.()?.forEach((filter: any) => {
        const { columnId, operator, value: v } = filter;
        val.push({ columnId, operator, value: v });
      });
      return val;
    };

    const options = this.#options;
    let value: any = null;

    if (opt === options.ACTIVE_PAGE) value = grid.datasource.pageNumber;
    if (opt === options.COLUMNS) value = deepClone(grid.columns);
    if (opt === options.FILTER) value = filters();
    if (opt === options.PAGE_SIZE) value = grid.datasource.pageSize;
    if (opt === options.ROW_HEIGHT) value = grid.rowHeight;
    if (opt === options.SORT_ORDER) value = grid.sortColumn;

    return { key: this.#keyTobeUse(opt), value };
  }

  /**
   * Save given key/value to local storage.
   * @private
   * @param {string} key The key.
   * @param {any} value The value.
   * @returns {void}
   */
  #save(key: string, value: any): void {
    if (this.#saveMode
      && this.#canUseLocalStorage()
      && typeof value !== 'undefined'
      && value !== null
    ) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Save the given option.
   * @private
   * @param {string} opt The option.
   * @returns {void}
   */
  #saveOption(opt: string): void {
    if (!this.#restored.includes(opt)) this.#restored.push(opt);
    const { key, value } = this.#keyAndValue(opt);
    this.#save(key, value);
  }

  /**
   * Save active page.
   * @returns {void}
   */
  saveActivePage(): void {
    this.#saveOption(this.#options.ACTIVE_PAGE);
  }

  /**
   * Save columns.
   * @returns {void}
   */
  saveColumns(): void {
    this.#saveOption(this.#options.COLUMNS);
  }

  /**
   * Save filter.
   * @returns {void}
   */
  saveFilter(): void {
    this.#saveOption(this.#options.FILTER);
  }

  /**
   * Save page size.
   * @returns {void}
   */
  savePageSize(): void {
    this.#saveOption(this.#options.PAGE_SIZE);
  }

  /**
   * Save row height.
   * @returns {void}
   */
  saveRowHeight(): void {
    this.#saveOption(this.#options.ROW_HEIGHT);
  }

  /**
   * Save sort order.
   * @returns {void}
   */
  saveSortOrder(): void {
    this.#saveOption(this.#options.SORT_ORDER);
  }

  /**
   * Save all user settings to local storage.
   * @returns {void}
   */
  saveAllUserSettings(): void {
    Object.values(this.#options).forEach((opt: string) => (this.#saveOption(opt)));
  }

  /**
   * Get saved value for given option.
   * @private
   * @param {string} opt The option.
   * @returns {any} Saved value
   */
  #saved(opt: string): any {
    let value = null;
    if (this.#canUseLocalStorage()) {
      const key = this.#keyTobeUse(opt);
      const savedStr = localStorage.getItem(key);
      if (typeof savedStr === 'string' && savedStr !== '') {
        value = JSON.parse(savedStr);
      }
    }
    return value;
  }

  /**
   * Get saved active page.
   * @returns {number|null} Saved value
   */
  savedActivePage(): number | null {
    return this.#saved(this.#options.ACTIVE_PAGE);
  }

  /**
   * Get saved columns.
   * @returns {IdsDataGridColumn[]|null} Saved value
   */
  savedColumns(): IdsDataGridColumn[] | null {
    return this.#saved(this.#options.COLUMNS);
  }

  /**
   * Get saved filter.
   * @returns {IdsDataGridFilterConditions[]|null} Saved value
   */
  savedFilter(): IdsDataGridFilterConditions[] | null {
    return this.#saved(this.#options.FILTER);
  }

  /**
   * Get saved page size.
   * @returns {number|null} Saved value
   */
  savedPageSize(): number | null {
    return this.#saved(this.#options.PAGE_SIZE);
  }

  /**
   * Get saved row height.
   * @returns {string|null} Saved value
   */
  savedRowHeight(): string | null {
    return this.#saved(this.#options.ROW_HEIGHT);
  }

  /**
   * Get saved sort order.
   * @returns {{ id: string, ascending: boolean }|null} Saved value
   */
  savedSortOrder(): { id: string, ascending: boolean } | null {
    return this.#saved(this.#options.SORT_ORDER);
  }

  /**
   * Get saved all user settings.
   * @returns {IdsDataGridSaveUserSettings} Saved value
   */
  savedAllUserSettings(): IdsDataGridSaveUserSettings {
    const saved: any = {};
    Object.values(this.#options).forEach((opt: string) => {
      saved[`${camelCase(opt)}`] = this.#saved(opt);
    });
    return saved;
  }

  /**
   * Clear the given option from local storage
   * @private
   * @param {string} opt The option.
   * @returns {void}
   */
  #clear(opt: string): void {
    if (this.#canUseLocalStorage()) {
      const key = this.#keyTobeUse(opt);
      const found = Object.keys(localStorage).some((k) => k === key);
      if (found) localStorage.removeItem(key);
    }
  }

  /**
   * Clear saved active page.
   * @returns {void}
   */
  clearSavedActivePage(): void {
    this.#clear(this.#options.ACTIVE_PAGE);
  }

  /**
   * Clear saved columns.
   * @returns {void}
   */
  clearSavedColumns(): void {
    this.#clear(this.#options.COLUMNS);
  }

  /**
   * Clear saved filter.
   * @returns {void}
   */
  clearSavedFilter(): void {
    this.#clear(this.#options.FILTER);
  }

  /**
   * Clear saved page size.
   * @returns {void}
   */
  clearSavedPageSize(): void {
    this.#clear(this.#options.PAGE_SIZE);
  }

  /**
   * Clear saved row height.
   * @returns {void}
   */
  clearSavedRowHeight(): void {
    this.#clear(this.#options.ROW_HEIGHT);
  }

  /**
   * Clear saved sort order.
   * @returns {void}
   */
  clearSavedSortOrder(): void {
    this.#clear(this.#options.SORT_ORDER);
  }

  /**
   * Clear saved all user settings from local storage.
   * @returns {void}
   */
  clearSavedAllUserSettings(): void {
    Object.values(this.#options).forEach((opt: string) => (this.#clear(opt)));
  }

  /**
   * Restore given option.
   * @private
   * @param {string} opt The option.
   * @param {any} value The value.
   * @param {Function} callback The callback function.
   * @returns {void}
   */
  #restoreOption(opt: string, value: any, callback: () => void): void {
    if (!this.#restored.includes(opt) && typeof value !== 'undefined' && value !== null) {
      this.#saveMode = false;
      callback();
      this.#saveMode = true;
      this.#restored.push(opt);
    }
  }

  /**
   * Restore active page.
   * @param {number | null} value The value.
   * @returns {void}
   */
  restoreActivePage(value = this.savedActivePage()): void {
    this.#restoreOption(this.#options.ACTIVE_PAGE, value, () => {
      (this as any).pageNumber = value;
    });
  }

  /**
   * Restore columns.
   * @param {IdsDataGridColumn[] | null} value The value.
   * @returns {void}
   */
  restoreColumns(value: any = this.savedColumns()): void {
    const props = [
      'cellSelectedCssPart',
      'click',
      'cssPart',
      'disabled',
      'filterType',
      'formatter',
      'isChecked',
      'tooltipCssPart'
    ];
    const adjust = (column: any) => {
      const orgColumn = (this as any).columnDataById(column.id);
      props.forEach((prop) => {
        if (!column[prop] && orgColumn[prop]) column[prop] = orgColumn[prop];
      });
    };
    value?.forEach((v: any) => adjust(v));

    this.#restoreOption(this.#options.COLUMNS, value, () => {
      (this as any).columns = value;
    });
  }

  /**
   * Restore filter.
   * @param {IdsDataGridFilterConditions[] | null} value The value.
   * @returns {void}
   */
  restoreFilter(value = this.savedFilter()): void {
    this.#restoreOption(this.#options.FILTER, value, () => {
      (this as any).applyFilter(value);
    });
  }

  /**
   * Restore Page size.
   * @param {number | null} value The value.
   * @returns {void}
   */
  restorePageSize(value = this.savedPageSize()): void {
    this.#restoreOption(this.#options.PAGE_SIZE, value, () => {
      (this as any).pageSize = value;
    });
  }

  /**
   * Restore row height.
   * @param {string | null} value The value.
   * @returns {void}
   */
  restoreRowHeight(value = this.savedRowHeight()): void {
    this.#restoreOption(this.#options.ROW_HEIGHT, value, () => {
      (this as any).rowHeight = value;
    });
  }

  /**
   * Restore sort order.
   * @param {{ id: string, ascending: boolean }|null} value The value.
   * @returns {void}
   */
  restoreSortOrder(value = this.savedSortOrder()): void {
    const { id, ascending } = value || {};
    this.#restoreOption(this.#options.SORT_ORDER, value, () => {
      (this as any).setSortColumn(id, ascending);
    });
  }

  /**
   * Restore all user settings.
   * @param {IdsDataGridSaveUserSettings} s User settings.
   * @returns {void}
   */
  restoreUserSettings(s?: IdsDataGridSaveUserSettings): void {
    const options = this.#options;

    Object.values(this.#options).forEach((opt: string) => {
      if (opt === options.ACTIVE_PAGE) this.restoreActivePage(s?.activePage);
      if (opt === options.COLUMNS) this.restoreColumns(s?.columns);
      if (opt === options.FILTER) this.restoreFilter(s?.filter);
      if (opt === options.PAGE_SIZE) this.restorePageSize(s?.pageSize);
      if (opt === options.ROW_HEIGHT) this.restoreRowHeight(s?.rowHeight);
      if (opt === options.SORT_ORDER) this.restoreSortOrder(s?.sortOrder);
    });
  }

  /**
   * Sets to save user settings.
   * @returns {void}
   */
  saveUserSettings(): void {
    const grid = this as unknown as IdsDataGrid;
    if (!this.#saveMode || !grid.initialized || !grid.data?.length) return;

    // Collect current settings
    const args = (opt: string) => ({ opt, optCC: camelCase(opt), ...this.#keyAndValue(opt) });
    const settings = Object.values(this.#options).map((opt: string) => args(opt));
    const userSettings = settings.reduce((acc, cur) => ({ ...acc, [cur.optCC]: cur.value }), {});

    // Fires after settings are changed in some way
    this.triggerEvent('settingschanged', this, {
      bubbles: true,
      detail: { elem: this, userSettings }
    });

    // Save all user settings
    if (this.savesUserSettings) {
      settings.forEach(({ opt, key, value }) => {
        if (!this.#restored.includes(opt)) this.#restored.push(opt);
        this.#save(key, value);
      });
      return;
    }

    // Save each individuals
    if (this.savesActivePage) this.saveActivePage();
    if (this.savesColumns) this.saveColumns();
    if (this.savesFilter) this.saveFilter();
    if (this.savesPageSize) this.savePageSize();
    if (this.savesRowHeight) this.saveRowHeight();
    if (this.savesSortOrder) this.saveSortOrder();
  }

  /**
   * Handle all user settings events
   * @returns {void}
   */
  attachUserSettingsEventHandlers(): void {
    const grid = this as unknown as IdsDataGrid;

    this.offEvent('pagenumberchange.data-grid-save-user-settings');
    this.onEvent('pagenumberchange.data-grid-save-user-settings', grid.pager, () => {
      this.saveUserSettings();
    });

    this.offEvent('pagesizechange.data-grid-save-user-settings');
    this.onEvent('pagesizechange.data-grid-save-user-settings', grid.pager, () => {
      this.saveUserSettings();
    });
  }
};

export default IdsDataGridSaveUserSettingsMixin;
