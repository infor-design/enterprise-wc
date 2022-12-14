import { attributes } from '../../core/ids-attributes';
import { deepClone } from '../../utils/ids-deep-clone-utils/ids-deep-clone-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../../mixins/ids-events-mixin/ids-events-mixin';
import type IdsDataGrid from './ids-data-grid';

import { IdsDataGridColumn } from './ids-data-grid-column';
import { IdsDataGridFilterConditions } from './ids-data-grid-filters';

type Constraints = IdsConstructor<EventsMixinInterface>;

export interface IdsDataGridSaveSettings {
  /** Set the active page number */
  activePage?: number,
  /** Set the columns */
  columns?: IdsDataGridColumn[],
  /** Set the filter conditions */
  filter?: IdsDataGridFilterConditions[],
  /** Set the page size */
  pageSize?: number,
  /** Set the row height */
  rowHeight?: string,
  /** Set the sort order */
  sortOrder?: { id: string, ascending: boolean }
}

/**
 * A mixin that adds save user settings functionality to data grid
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsDataGridSaveSettingsMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.SAVE_ACTIVE_PAGE,
      attributes.SAVE_COLUMNS,
      attributes.SAVE_FILTER,
      attributes.SAVE_PAGE_SIZE,
      attributes.SAVE_ROW_HEIGHT,
      attributes.SAVE_SORT_ORDER,
      attributes.SAVE_USER_SETTINGS
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Settings to use with local storage.
   */
  settings = {
    activePage: 'active-page',
    columns: 'columns',
    filter: 'filter',
    pageSize: 'page-size',
    rowHeight: 'row-height',
    sortOrder: 'sort-order'
  };

  /**
   * List of values for each setting.
   * @private
   */
  #valSettings = Object.values(this.settings);

  /**
   * State to check if can be able to save.
   * @private
   */
  #saveMode = true;

  /**
   * List of restored options.
   * @private
   */
  #restored: string[] = [];

  /**
   * Sets to save active page
   * @param {boolean|string} value The value
   */
  set saveActivePage(value) {
    this.#setBoolAttribute(attributes.SAVE_ACTIVE_PAGE, value);
  }

  get saveActivePage() {
    return stringToBool(this.getAttribute(attributes.SAVE_ACTIVE_PAGE));
  }

  /**
   * Sets to save columns
   * @param {boolean|string} value The value
   */
  set saveColumns(value) {
    this.#setBoolAttribute(attributes.SAVE_COLUMNS, value);
  }

  get saveColumns() {
    return stringToBool(this.getAttribute(attributes.SAVE_COLUMNS));
  }

  /**
   * Sets to save filter
   * @param {boolean|string} value The value
   */
  set saveFilter(value) {
    this.#setBoolAttribute(attributes.SAVE_FILTER, value);
  }

  get saveFilter() {
    return stringToBool(this.getAttribute(attributes.SAVE_FILTER));
  }

  /**
   * Sets to save page size
   * @param {boolean|string} value The value
   */
  set savePageSize(value) {
    this.#setBoolAttribute(attributes.SAVE_PAGE_SIZE, value);
  }

  get savePageSize() {
    return stringToBool(this.getAttribute(attributes.SAVE_PAGE_SIZE));
  }

  /**
   * Sets to save row height
   * @param {boolean|string} value The value
   */
  set saveRowHeight(value) {
    this.#setBoolAttribute(attributes.SAVE_ROW_HEIGHT, value);
  }

  get saveRowHeight() {
    return stringToBool(this.getAttribute(attributes.SAVE_ROW_HEIGHT));
  }

  /**
   * Sets to save sort order
   * @param {boolean|string} value The value
   */
  set saveSortOrder(value) {
    this.#setBoolAttribute(attributes.SAVE_SORT_ORDER, value);
  }

  get saveSortOrder() {
    return stringToBool(this.getAttribute(attributes.SAVE_SORT_ORDER));
  }

  /**
   * Sets to save all user settings
   * @param {boolean|string} value The value
   */
  set saveUserSettings(value) {
    this.#setBoolAttribute(attributes.SAVE_USER_SETTINGS, value);
  }

  get saveUserSettings() {
    return stringToBool(this.getAttribute(attributes.SAVE_USER_SETTINGS));
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
   * Get key to be used with local storage.
   * @private
   * @param {string} setting The setting name.
   * @param {string} prefix Optional prefix string to make the id more unique.
   * @param {string} suffix Optional suffix string to make the id more unique.
   * @param {string} uniqueId The uniqueId.
   * @returns {string} The key value.
   */
  #keyTobeUsed(
    setting: string,
    prefix = '',
    suffix = '',
    uniqueId = (this as unknown as IdsDataGrid).uniqueId ?? this.getAttribute('id') ?? ''
  ): string {
    const key = `ids-data-grid-usersettings-${prefix}-${uniqueId}-${setting}-${suffix}`;
    return (key.replace(/-+/g, '-').replace(/-$/g, ''));
  }

  /**
   * Get key/value for given setting.
   * @private
   * @param {string} setting The setting.
   * @returns {{ key: string, value: any }} the value
   */
  #keyAndValue(setting: string): { key: string, value: any } {
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

    const s = this.settings;
    let value: any = null;

    if (setting === s.activePage) value = grid.datasource.pageNumber;
    if (setting === s.columns) value = deepClone(grid.columns);
    if (setting === s.filter) value = filters();
    if (setting === s.pageSize) value = grid.datasource.pageSize;
    if (setting === s.rowHeight) value = grid.rowHeight;
    if (setting === s.sortOrder) value = grid.sortColumn;

    return { key: this.#keyTobeUsed(setting), value };
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
   * Save the given setting.
   * @param {string} setting The setting.
   * @returns {void}
   */
  saveSetting(setting: string): void {
    if (this.#valSettings.includes(setting)) {
      if (!this.#restored.includes(setting)) this.#restored.push(setting);
      const { key, value } = this.#keyAndValue(setting);
      this.#save(key, value);
    }
  }

  /**
   * Save all user settings to local storage.
   * @returns {void}
   */
  saveAllSettings(): void {
    this.#valSettings.forEach((s: string) => this.saveSetting(s));
  }

  /**
   * Get saved value for given setting.
   * @param {string} setting The setting.
   * @returns {any} Saved value
   */
  savedSetting(setting: string): any {
    let value = null;
    if (this.#valSettings.includes(setting) && this.#canUseLocalStorage()) {
      const key = this.#keyTobeUsed(setting);
      const savedStr = localStorage.getItem(key);
      if (typeof savedStr === 'string' && savedStr !== '') {
        value = JSON.parse(savedStr);
      }
    }
    return value;
  }

  /**
   * Get saved all user settings.
   * @returns {IdsDataGridSaveSettings} Saved value
   */
  savedAllSettings(): IdsDataGridSaveSettings {
    return Object.fromEntries(
      Object.entries(this.settings).map(([k, v]) => [k, this.savedSetting(v)])
    );
  }

  /**
   * Clear the given saved setting from local storage
   * @private
   * @param {string} setting The setting.
   * @param {string} key The unique user key stored with local storage.
   * @returns {void}
   */
  clearSetting(setting: string, key?: string): void {
    if (this.#valSettings.includes(setting) && this.#canUseLocalStorage()) {
      key = key ?? this.#keyTobeUsed(setting);
      const found = Object.keys(localStorage).some((k) => k === key);
      if (found) localStorage.removeItem(key);
    }
  }

  /**
   * Clear saved all user settings from local storage.
   * @param {any} userKeys The setting/value.
   * @returns {void}
   */
  clearAllSettings(userKeys: any = {}): void {
    Object.entries(this.settings).forEach(
      ([k, v]) => this.clearSetting(v, (userKeys as any)[k])
    );
  }

  /**
   * Restore given setting.
   * @param {string} setting The setting.
   * @param {any} value The value.
   * @returns {void}
   */
  restoreSetting(setting: string, value?: any): void {
    if (this.#valSettings.includes(setting)) {
      const s = this.settings;
      if (setting === s.activePage) this.#restoreActivePage(value);
      if (setting === s.columns) this.#restoreColumns(value);
      if (setting === s.filter) this.#restoreFilter(value);
      if (setting === s.pageSize) this.#restorePageSize(value);
      if (setting === s.rowHeight) this.#restoreRowHeight(value);
      if (setting === s.sortOrder) this.#restoreSortOrder(value);
    }
  }

  /**
   * Restore saved all user settings from local storage.
   * @param {IdsDataGridSaveSettings} userSettings The setting/value.
   * @returns {void}
   */
  restoreAllSettings(userSettings: IdsDataGridSaveSettings = {}): void {
    Object.entries(this.settings).forEach(
      ([k, v]) => this.restoreSetting(v, (userSettings as any)[k])
    );
  }

  /**
   * Restore given user setting.
   * @private
   * @param {string} setting The setting.
   * @param {any} value The value.
   * @param {Function} callback The callback function.
   * @returns {void}
   */
  #restoreUserSetting(setting: string, value: any, callback: () => void): void {
    if (!this.#restored.includes(setting) && typeof value !== 'undefined' && value !== null) {
      this.#saveMode = false;
      callback();
      this.#saveMode = true;
      this.#restored.push(setting);
    }
  }

  /**
   * Restore active page.
   * @param {number | null} value The value.
   * @returns {void}
   */
  #restoreActivePage(value = this.savedSetting(this.settings.activePage)): void {
    this.#restoreUserSetting(this.settings.activePage, value, () => {
      (this as any).pageNumber = value;
    });
  }

  /**
   * Restore columns.
   * @param {IdsDataGridColumn[] | null} value The value.
   * @returns {void}
   */
  #restoreColumns(value = this.savedSetting(this.settings.columns)): void {
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

    this.#restoreUserSetting(this.settings.columns, value, () => {
      (this as any).columns = value;
    });
  }

  /**
   * Restore filter.
   * @param {IdsDataGridFilterConditions[] | null} value The value.
   * @returns {void}
   */
  #restoreFilter(value = this.savedSetting(this.settings.filter)): void {
    this.#restoreUserSetting(this.settings.filter, value, () => {
      (this as any).applyFilter(value);
    });
  }

  /**
   * Restore Page size.
   * @param {number | null} value The value.
   * @returns {void}
   */
  #restorePageSize(value = this.savedSetting(this.settings.pageSize)): void {
    this.#restoreUserSetting(this.settings.pageSize, value, () => {
      (this as any).pageSize = value;
    });
  }

  /**
   * Restore row height.
   * @param {string | null} value The value.
   * @returns {void}
   */
  #restoreRowHeight(value = this.savedSetting(this.settings.rowHeight)): void {
    this.#restoreUserSetting(this.settings.rowHeight, value, () => {
      (this as any).rowHeight = value;
    });
  }

  /**
   * Restore sort order.
   * @param {{ id: string, ascending: boolean } | null} value The value.
   * @returns {void}
   */
  #restoreSortOrder(value = this.savedSetting(this.settings.sortOrder)): void {
    const { id, ascending } = value || {};
    this.#restoreUserSetting(this.settings.sortOrder, value, () => {
      (this as any).setSortColumn(id, ascending);
    });
  }

  /**
   * Sets to save user settings.
   * @returns {void}
   */
  saveSettings(): void {
    const grid = this as unknown as IdsDataGrid;
    if (!this.#saveMode || !grid.initialized || !grid.data?.length) return;

    // Collect current settings
    const userSettings = Object.fromEntries(
      Object.entries(this.settings).map(([k, v]) => [k, this.#keyAndValue(v).value])
    );

    // Fires after settings are changed in some way
    this.triggerEvent('settingschanged', this, {
      bubbles: true,
      detail: { elem: this, settings: userSettings }
    });

    // Save all user settings
    if (this.saveUserSettings) {
      this.saveAllSettings();
      return;
    }

    // Save each individuals
    if (this.saveActivePage) this.saveSetting(this.settings.activePage);
    if (this.saveColumns) this.saveSetting(this.settings.columns);
    if (this.saveFilter) this.saveSetting(this.settings.filter);
    if (this.savePageSize) this.saveSetting(this.settings.pageSize);
    if (this.saveRowHeight) this.saveSetting(this.settings.rowHeight);
    if (this.saveSortOrder) this.saveSetting(this.settings.sortOrder);
  }

  /**
   * Handle all save settings events
   * @returns {void}
   */
  attachSaveSettingsEventHandlers(): void {
    const grid = this as unknown as IdsDataGrid;

    this.offEvent('pagenumberchange.data-grid-save-settings');
    this.onEvent('pagenumberchange.data-grid-save-settings', grid.pager, () => {
      this.saveSettings();
    });

    this.offEvent('pagesizechange.data-grid-save-settings');
    this.onEvent('pagesizechange.data-grid-save-settings', grid.pager, () => {
      this.saveSettings();
    });
  }
};

export default IdsDataGridSaveSettingsMixin;
