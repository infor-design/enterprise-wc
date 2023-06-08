import { attributes } from '../../core/ids-attributes';
import { hasClass } from '../../utils/ids-dom-utils/ids-dom-utils';
import { escapeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import type { IdsDataGridColumn } from './ids-data-grid-column';
import IdsDataGridCell from './ids-data-grid-cell';
import '../ids-menu-button/ids-menu-button';
import '../ids-popup-menu/ids-popup-menu';
import '../ids-popup/ids-popup';
import '../ids-menu/ids-menu';
import '../ids-menu/ids-menu-item';
import '../ids-input/ids-input';
import '../ids-dropdown/ids-dropdown';
import '../ids-dropdown/ids-dropdown-list';
import '../ids-icon/ids-icon';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-trigger-field/ids-trigger-field';
import '../ids-date-picker/ids-date-picker-popup';
import '../ids-time-picker/ids-time-picker-popup';

import type IdsDatePickerPopup from '../ids-date-picker/ids-date-picker-popup';
import type IdsMenuItem from '../ids-menu/ids-menu-item';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

// Instance counter
let instanceCounter = 0;

export interface IdsDataGridFilterConditions {
  /** The filter element */
  filterElem?: any;
  /** The id of the column */
  columnId?: string;
  /** The value filter */
  value?: string;
  /** The filter operator */
  operator?: 'equals' | 'does-not-equal' | 'contains' | 'does-not-contain' | 'end-with' | 'start-with' | 'does-not-end-with' | 'does-not-start-with' | 'is-empty' | 'is-not-empty' | 'in-range' | 'less-than' | 'less-equals' | 'greater-than' | 'greater-equals' | 'selected' | 'not-selected' | 'selected-notselected'
}

/**
 * IDS Data Grid Filters
 * @type {object}
 */
export default class IdsDataGridFilters {
  constructor(root: any) {
    this.root = root;
    instanceCounter++;
  }

  root: any;

  /**
   * Filter defaults.
   * @type {object}
   */
  DEFAULTS = {
    disableClientFilter: false,
    filterable: true,
    filterWhenTyping: true,
    filterRowDisabled: false
  };

  /**
   * Saved list of conditions to use with filter rerender.
   * @private
   * @type {Array<IdsDataGridFilterConditions>}
   */
  #conditions: any = [];

  /**
   * Initial values to use reset filter.
   * @private
   * @type {object}
   */
  #initial: any = {};

  /**
   * Hold filter in-process state.
   * @private
   * @type {boolean}
   */
  #filterIsProcessing = false;

  /**
   * Focused element use with rerender filter.
   * @private
   * @type {HTMLElement|null}
   */
  focused: any;

  /**
   * Suppress filtered event
   * @private
   * @type {boolean}
   */
  #suppressFilteredEvent = false;

  /**
   * Text filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  text(column: IdsDataGridColumn) {
    return this.#btnAndInputTemplate('text', column);
  }

  /**
   * Integer filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  integer(column: IdsDataGridColumn) {
    return this.#btnAndInputTemplate('integer', column);
  }

  /**
   * Decimal filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  decimal(column: IdsDataGridColumn) {
    return this.#btnAndInputTemplate('decimal', column);
  }

  /**
   * Contents filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  contents(column: IdsDataGridColumn) {
    return this.#dropdownTemplate('contents', column);
  }

  /**
   * Dropdown filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  dropdown(column: IdsDataGridColumn) {
    return this.#dropdownTemplate('dropdown', column);
  }

  /**
   * Checkbox filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  checkbox(column: IdsDataGridColumn) {
    return this.#filterButtonTemplate('checkbox', column);
  }

  /**
   * Date filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  date(column: IdsDataGridColumn) {
    const TYPE = 'date';
    const id = `${this.#id(column)}-${TYPE}`;
    const opt = column.filterOptions || {};
    const format = opt.format ? ` format="${opt.format}"` : '';
    const showToday = opt.showToday ? ` show-today="${opt.showToday}"` : '';
    const firstDayOfWeek = opt.firstDayOfWeek ? ` first-day-of-week="${opt.firstDayOfWeek}"` : '';
    const disabled = opt.disabled ? ' disabled' : '';

    const filtered = this.#conditions.filter((c: IdsDataGridFilterConditions) => c.columnId === column.id);
    let value = (filtered[0] as any)?.value ?? null;
    this.#initial[column.id] = this.#initial[column.id] || {};
    if (!this.#initial[column.id].datePicker) this.#initial[column.id].datePicker = { value };
    value = value ? ` value="${value}"` : '';

    const filterButton = `${this.#filterButtonTemplate(TYPE, column)}`;
    const trigger = `${this.#triggerFieldTemplate(TYPE, column, 'calendar', 'DatePickerTriggerButton')}`;
    const popup = `<ids-date-picker-popup
      attachment=".ids-data-grid-wrapper"
      data-filter-type="${TYPE}"
      trigger-type="click"
      id="popup-${id}"
      no-margins
      compact="true"
      ${format}${showToday}${firstDayOfWeek}${value}${disabled}></ids-date-picker-popup>`;

    if (column.align === 'right') return `${trigger}${filterButton}${popup}`;
    return `${filterButton}${trigger}${popup}`;
  }

  /**
   * Time filter markup.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  time(column: IdsDataGridColumn) {
    const TYPE = 'time';
    const id = `${this.#id(column)}-${TYPE}`;
    const opt = column.filterOptions || {};
    const label = opt.label || 'Filter time picker';
    const format = opt.format ? ` format="${opt.format}"` : '';
    const placeholder = opt.placeholder ? ` placeholder="${opt.placeholder}"` : '';
    const minuteInterval = opt.minuteInterval ? ` minute-interval="${opt.minuteInterval}"` : '';
    const secondInterval = opt.secondInterval ? ` second-interval="${opt.secondInterval}"` : '';
    const autoselect = opt.autoselect ? ' autoselect' : '';
    const autoupdate = opt.autoupdate ? ' autoupdate' : '';
    const disabled = opt.disabled ? ' disabled' : '';
    const readonly = opt.readonly ? ' readonly' : '';

    const filtered = this.#conditions.filter((c: IdsDataGridFilterConditions) => c.columnId === column.id);
    let value = (filtered[0] as any)?.value ?? null;
    this.#initial[column.id] = this.#initial[column.id] || {};
    if (!this.#initial[column.id].timePicker) this.#initial[column.id].timePicker = { value };
    value = value ? ` value="${value}"` : '';

    const filterButton = `${this.#filterButtonTemplate(TYPE, column)}`;
    const trigger = `${this.#triggerFieldTemplate(TYPE, column, 'clock', 'TimePickerTriggerButton')}`;
    const popup = `<ids-time-picker-popup
        attachment=".ids-data-grid-wrapper"
        trigger-type="click"
        color-variant="${!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'}"
        data-filter-type="${TYPE}"
        size="${opt.size || 'full'}"
        label="${label}"
        label-state="collapsed"
        id="${id}"
        no-margins
        compact
        ${format}${placeholder}${minuteInterval}${secondInterval}
        ${autoselect}${autoupdate}${disabled}${readonly}${value}
      ></ids-time-picker-popup>`;

    if (column?.align === 'right') return `${trigger}${filterButton}${popup}`;
    return `${filterButton}${trigger}${popup}`;
  }

  /**
   * Get filter wrapper element by given column id
   * @param {string} columnId The column id
   * @returns {HTMLElement|undefined} The filter wrapper element
   */
  filterWrapperById(columnId: string | undefined) {
    return this.root.shadowRoot.querySelector(`.ids-data-grid-header-cell[column-id="${columnId}"]
      .ids-data-grid-header-cell-filter-wrapper`);
  }

  /**
   * Returns markup for a header cell filter in data grid.
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The resulting template
   */
  filterTemplate(column: IdsDataGridColumn) {
    const slottedEl = this.root.querySelector(`[slot="filter-${column.id}"]`);
    let html: any = '';
    if (slottedEl) {
      html = `<slot name="filter-${column.id}"></slot>`;
    } else if (typeof column.filterType === 'function') {
      html = column.filterType.apply(this, [column]);
    }
    if (html !== '') {
      let cssClass = 'ids-data-grid-header-cell-filter-wrapper';
      cssClass += !this.root.filterable ? ' hidden' : '';
      cssClass += column.filterOptions?.disabled ? ' disabled' : '';
      html = `<span class="${cssClass}">${html}</span>`;
    }
    return html;
  }

  /**
   * Set datepicker type to range or single date.
   * @private
   * @param {object} datePicker datepicker element.
   * @param {string} operator filter type.
   * @returns {void}
   */
  #setDatePicker(datePicker: IdsTriggerField, operator?: string): void {
    if (datePicker) {
      const popupId = datePicker.getAttribute('id')?.replace('field-', 'popup-');
      const popupEl: IdsDatePickerPopup = this.root.wrapper.querySelector(`#${popupId}`)!;
      if (popupEl) {
        if (operator === 'in-range') {
          popupEl.useRange = true;
        } else {
          const startDateValue = popupEl.value.split(popupEl.rangeSettings.separator)[0];
          popupEl.resetRangeSettings();
          popupEl.useRange = false;
          if (popupEl.value !== startDateValue) popupEl.value = startDateValue;
        }
      }
    }
  }

  /**
   * Reset all filters as initial state.
   * @returns {void}
   */
  resetFilters() {
    this.filterNodes?.forEach((n: any) => {
      const slot = n.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : n;
      if (node) {
        const headerElem = n.closest('.ids-data-grid-header-cell');
        const columnData = this.root.columnDataByHeaderElem(headerElem);
        const initial = this.#initial[columnData.id];

        const input = node.querySelector('ids-input');
        const dropdown = node.querySelector('ids-dropdown');
        const triggerField = node.querySelector('ids-trigger-field');
        const timePicker = node.querySelector('ids-time-picker');
        const btn = node.querySelector('ids-menu-button');

        if (input) input.value = initial?.input?.value || '';
        if (dropdown) dropdown.value = initial?.dropdown?.value || '';
        if (triggerField) triggerField.value = initial?.triggerField?.value || '';
        if (timePicker) timePicker.value = initial?.timePicker?.value || '';
        if (btn) {
          let item = btn.menuEl.items.filter((itm: any) => itm.value === initial?.btn?.value)[0];
          if (!item) item = btn.menuEl.items[0];
          if (item) {
            btn.menuEl.selectItem(item);
            if (triggerField) this.#setDatePicker(triggerField, item.value);
          }
        }
      }
    });
  }

  /**
   * Set filter conditions on the UI Only.
   * @param {Array<IdsDataGridFilterConditions>} conditions An array of objects with the filter conditions.
   * @returns {Array<object>} An array of currently showing filter conditions.
   */
  setFilterConditions(conditions: Array<IdsDataGridFilterConditions>) {
    this.#suppressFilteredEvent = true;
    this.resetFilters();
    const toBeRemoved: any = [];
    conditions.forEach((c, i) => {
      const el = this.filterWrapperById(c.columnId);
      if (!el || hasClass(el, 'disabled') || hasClass(el, 'readonly')) return;

      const slot = el.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : el;
      if (node) {
        const input = node.querySelector('ids-input');
        const btn = node.querySelector('ids-menu-button');
        const dropdown = node.querySelector('ids-dropdown');
        const triggerField = node.querySelector('ids-trigger-field');
        const timePicker = node.querySelector('ids-time-picker');
        const headerElem = node.closest('.ids-data-grid-header-cell');
        const columnData = this.root.columnDataByHeaderElem(headerElem);

        if (input) input.value = c.value || '';
        if (triggerField) triggerField.value = c.value || '';
        if (timePicker) timePicker.value = c.value || '';
        if (dropdown) {
          dropdown.value = c.value || '';
          if (dropdown.value === this.#dropdownNotFilterItem(columnData).value) toBeRemoved.push(i);
        }
        if (timePicker && !columnData.formatOptions?.dateFormat && !columnData.formatOptions?.timeStyle) {
          if (!columnData.formatOptions) columnData.formatOptions = {};
          columnData.formatOptions.dateFormat = timePicker.format;
          columnData.formatOptions.timeStyle = 'short';
        }
        if (btn) {
          let item = btn.menuEl.items.filter((itm: any) => itm.value === c.operator)[0];
          if (!item) item = btn.menuEl.items[0];
          if (item) btn.menuEl.selectItem(item);
        }
        if (!c.filterElem) c.filterElem = timePicker || triggerField || dropdown || input;
        this.#setDatePicker(triggerField, c.operator);
      }
    });
    if (toBeRemoved.length) conditions = conditions.filter((c, i) => !toBeRemoved.includes(i));
    this.#suppressFilteredEvent = false;
    return conditions;
  }

  /**
   * Get filter conditions in array from whats set in the UI.
   * @returns {Array<object>} An array of currently showing filter conditions.
   */
  filterConditions() {
    const filterExpr: any = [];
    this.filterNodes?.forEach((n: any) => {
      const slot = n.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : n;
      if (node) {
        const input = node.querySelector('ids-input');
        const triggerField = node.querySelector('ids-trigger-field');
        const btn = node.querySelector('ids-menu-button');
        const dropdown = node.querySelector('ids-dropdown');
        const timePicker = node.querySelector('ids-time-picker');
        if (!btn && !input && !triggerField && !dropdown) return;

        const headerElem = n.closest('.ids-data-grid-header-cell');
        const columnData = this.root.columnDataByHeaderElem(headerElem);
        let operator = btn?.menuEl?.getSelectedValues()[0];
        if (!operator) operator = btn?.menuEl?.items?.[0]?.value;
        if (!operator && !btn && input) operator = 'contains';
        const value = input?.value ?? triggerField?.value ?? dropdown?.value ?? timePicker?.value ?? '';
        if (dropdown) {
          operator = 'equals';
          if (value === this.#dropdownNotFilterItem(columnData).value) return;
        }
        if (timePicker && !columnData.formatOptions?.dateFormat && !columnData.formatOptions?.timeStyle) {
          if (!columnData.formatOptions) columnData.formatOptions = {};
          columnData.formatOptions.dateFormat = timePicker.format;
          columnData.formatOptions.timeStyle = 'short';
        }
        this.#setDatePicker(triggerField, operator);

        if (operator === 'selected-notselected') return;
        if (value === '' && !dropdown && !(/\b(is-not-empty|is-empty|selected|not-selected)\b/g.test(operator))) return;

        const filterElem = timePicker || dropdown || triggerField || input;

        const condition = {
          columnId: columnData.id,
          columnData,
          filterElem,
          operator,
          value
        };

        filterExpr.push(condition);
      }
    });

    return filterExpr;
  }

  /**
   * Apply the Filter with the currently selected conditions, or the ones passed in.
   * @param {Array} conditions An array of objects with the filter conditions
   * @returns {void}
   */
  applyFilter(conditions?: any) {
    this.root?.resetCache();

    if (this.#filterIsProcessing || !this.root.filterable || this.root.filterRowDisabled) return;
    this.#filterIsProcessing = true;

    if (conditions) {
      conditions = this.setFilterConditions(conditions);
    } else {
      conditions = this.filterConditions();
    }
    this.#conditions = conditions;

    // Client filter
    if (this.root.disableClientFilter) {
      this.root.triggerEvent('filtered', this.root, { bubbles: true, detail: { elem: this.root, conditions } });
      this.#filterIsProcessing = false;
      this.root.saveSettings?.();
      return;
    }

    // No need to go further, if no condition/s to filter
    if ((!conditions?.length && !this.root.datasource.filtered) || !conditions) {
      this.#filterIsProcessing = false;
      return;
    }

    // Should fire clear event
    const isCleared = !conditions.length && this.root.datasource.filtered;
    let isFilterApply = false;

    const checkRow = (row: any, index: number) => {
      let isMatch = true;

      for (let i = 0, l = conditions.length; i < l; i++) {
        const c = conditions[i] || {};
        if (!c.columnData) {
          c.columnData = this.root.columnDataById(c.columnId);
          if (!c.columnData) continue;
        }

        // Must be filter type
        if (typeof c.columnData.filterType !== 'function'
          && typeof c.columnData.filterFunction !== 'function') continue;

        // Use custom filter
        if (typeof c.columnData.filterFunction === 'function') {
          isMatch = c.columnData.filterFunction({ data: row, index, condition: c });
          if (!isMatch) {
            this.#filterIsProcessing = false;
            return true;
          }
          continue;
        }

        // All other use in-built filters
        const filterType = c.columnData.filterType?.name;

        // Single filter
        const filterWrapper = this.filterWrapperById(c.columnId);
        if (hasClass(filterWrapper, 'disabled') || hasClass(filterWrapper, 'readonly')) continue;

        const column = c.columnData;
        const stringVal = (v: any) => ((v === null || v === undefined) ? '' : v.toString().toLowerCase());
        const formatterVal = () => {
          const val = IdsDataGridCell.template(row, column, index, this.root);
          const rex = /(<([^>]+)>)|(amp;)|(&lt;([^>]+)&gt;)/ig;
          return val.replace(rex, '').trim().toLowerCase();
        };
        let conditionValue = stringVal(c.value);
        let value = row[column.field];
        let valueStr = stringVal(value);

        // Dropdown, multiselect and contents types
        if (/dropdown|multiselect|contents/g.test(filterType)) {
          if ((value === null || typeof value === 'undefined') && c.value === '') {
            const temp = 'filter-blank-value-temp';
            value = temp;
            conditionValue = temp;
          } else {
            conditionValue = c.value;
          }
        }

        // Run Data over the formatter
        if (filterType === 'text') {
          value = formatterVal();
          valueStr = stringVal(value);
        }

        // Integer
        if (filterType === 'integer') {
          value = formatterVal();
          value = this.root.localeAPI?.parseNumber(value);
          conditionValue = this.root.localeAPI?.parseNumber(conditionValue);
        }

        if (filterType === 'date' || filterType === 'time') {
          if (/string|undefined/g.test(typeof value)) value = formatterVal();
          const getValues = (rValue: any, cValue: any) => {
            const format = c.format || column.formatOptions || this.root.localeAPI?.calendar().timeFormat;
            cValue = this.root.localeAPI?.parseDate(cValue, format);
            if (cValue) {
              if (filterType === 'time') {
                // drop the day, month and year
                cValue.setDate(1);
                cValue.setMonth(0);
                cValue.setYear(0);
              }

              cValue = cValue.getTime();
            }

            if (typeof rValue === 'string' && rValue) {
              rValue = this.root.localeAPI?.parseDate(rValue, format);

              if (rValue) {
                if (filterType === 'time') {
                  // drop the day, month and year
                  rValue.setDate(1);
                  rValue.setMonth(0);
                  rValue.setYear(0);
                } else if (!(column.formatOptions?.showTime)) {
                  // Drop any time component of the row data for the filter
                  // as it is a date only field
                  rValue.setHours(0);
                  rValue.setMinutes(0);
                  rValue.setSeconds(0);
                  rValue.setMilliseconds(0);
                }
                rValue = rValue.getTime();
              }
            }
            return { rValue, cValue };
          };

          let values = null;
          if (c.operator === 'in-range') { // range stuff
            const datePickerPopup: IdsDatePickerPopup = this.root.wrapper.querySelector(`#${c.filterElem.getAttribute('aria-controls')}`)!;
            if (datePickerPopup) {
              if (c.value.indexOf(datePickerPopup.rangeSettings.separator) > -1) {
                const cValues = c.value.split(datePickerPopup.rangeSettings.separator);
                const range = { start: getValues(value, cValues[0]), end: getValues(value, cValues[1]) };
                values = {
                  rValue: range.start.rValue,
                  cValue: { start: range.start.cValue, end: range.end.cValue }
                };
              } else values = getValues(value, c.value);
            }
          } else {
            values = getValues(value, c.value);
          }
          value = values ? values.rValue : value;
          conditionValue = values ? values.cValue : conditionValue;
        }

        switch (c.operator) {
          case 'equals':
            isMatch = (value === conditionValue && value !== '');
            break;
          case 'does-not-equal':
            isMatch = (value !== conditionValue);
            break;
          case 'contains':
            isMatch = (valueStr.indexOf(conditionValue) > -1 && value.toString() !== '');
            break;
          case 'does-not-contain':
            isMatch = (valueStr.indexOf(conditionValue) === -1);
            break;
          case 'end-with':
            isMatch = (valueStr.lastIndexOf(conditionValue) === (valueStr.length - conditionValue.toString().length) && valueStr !== '' && (valueStr.length >= conditionValue.toString().length));
            break;
          case 'start-with':
            isMatch = (valueStr.indexOf(conditionValue) === 0 && valueStr !== '');
            break;
          case 'does-not-end-with':
            isMatch = (valueStr.lastIndexOf(conditionValue) === (valueStr.length - conditionValue.toString().length) && valueStr !== '' && (valueStr.length >= conditionValue.toString().length));
            isMatch = !isMatch;
            break;
          case 'does-not-start-with':
            isMatch = !(valueStr.indexOf(conditionValue) === 0 && valueStr !== '');
            break;
          case 'is-empty':
            isMatch = (valueStr === '');
            break;
          case 'is-not-empty':
            if (value === '') {
              isMatch = (value !== '');
              break;
            }
            isMatch = !(value === null);
            break;
          case 'in-range':
            if (typeof conditionValue === 'object') {
              isMatch = value >= conditionValue.start && value <= conditionValue.end && value !== '';
            } else isMatch = (value === conditionValue && value !== '');
            break;
          case 'less-than':
            isMatch = (value < conditionValue && (value !== '' && value !== null));
            break;
          case 'less-equals':
            isMatch = (value <= conditionValue && (value !== '' && value !== null));
            break;
          case 'greater-than':
            isMatch = (value > conditionValue && (value !== '' && value !== null));
            break;
          case 'greater-equals':
            isMatch = (value >= conditionValue && (value !== '' && value !== null));
            break;
          case 'selected':
            if (typeof c.columnData.isChecked === 'function') {
              isMatch = c.columnData.isChecked(value);
              break;
            }
            isMatch = (valueStr === '1' || valueStr === 'true' || value === true || value === 1) && valueStr !== '';
            break;
          case 'not-selected':
            if (typeof c.columnData.isChecked === 'function') {
              isMatch = !c.columnData.isChecked(value);
              break;
            }
            isMatch = (valueStr === '0' || valueStr === 'false' || value === false || value === 0 || valueStr === '');
            break;
          case 'selected-notselected':
            isMatch = true;
            break;
          default:
            break;
        }

        isFilterApply = true;

        if (!isMatch) {
          this.#filterIsProcessing = false;
          return true;
        }
      }
      this.#filterIsProcessing = false;
      return !isMatch;
    };

    this.root.datasource.filter(checkRow);
    this.root.redrawBody();

    // Fires after filter action occurs
    if (isCleared || isFilterApply) {
      this.root.toggleEmptyMessage();
      this.root.triggerEvent('filtered', this.root, {
        bubbles: true,
        detail: { elem: this.root, type: isCleared ? 'clear' : 'apply', conditions }
      });
      this.root.saveSettings?.();
    }

    requestAnimationFrame(() => {
      this.root.setActiveCell(0, 0, true);
    });
  }

  /**
   * Set disabled filter row
   * @returns {void}
   */
  setFilterRowDisabled() {
    this.filterNodes?.forEach((n: any) => {
      const slot = n.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : n;
      if (node) {
        [
          node.querySelector('ids-input'),
          node.querySelector('ids-menu-button'),
          node.querySelector('ids-dropdown'),
          node.querySelector('ids-date-picker'),
          node.querySelector('ids-trigger-field'),
          node.querySelector('ids-time-picker')
        ].forEach((el) => {
          if (this.root.filterRowDisabled) {
            n.classList.add('disabled');
            el?.setAttribute('disabled', '');
          } else {
            n.classList.remove('disabled');
            el?.removeAttribute('disabled');
          }
        });
      }
    });
  }

  /**
   * Attach filters setting after data grid render
   * @returns {void}
   */
  attachFilterSettings() {
    // Set filter row should be disabled or not
    if (this.root.filterRowDisabled) this.setFilterRowDisabled();

    // Set compulsory attributes for slotted elements
    const setCompulsoryAttributes = (el: any) => {
      el?.setAttribute('color-variant', (!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'));
      el?.setAttribute('label-state', 'collapsed');
      el?.setAttribute('no-margins', '');
      el?.setAttribute('compact', '');
    };

    this.filterNodes?.forEach((n: any) => {
      const slot = n.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : n;
      const headerElem = n.closest('.ids-data-grid-header-cell');
      const column = this.root.columnDataByHeaderElem(headerElem);
      const input = node?.querySelector('ids-input');
      const type = input?.getAttribute('data-filter-type');
      const dropdown = node?.querySelector('ids-dropdown');
      const dropdownList = node?.querySelector('ids-dropdown-list');
      const datePicker = node?.querySelector('ids-date-picker');
      const timePicker = node?.querySelector('ids-time-picker');
      const btn = node?.querySelector('ids-menu-button');
      const menu = node?.querySelector('ids-popup-menu');
      const triggerBtn = node?.querySelector('ids-trigger-button');
      const triggerField = node?.querySelector('ids-trigger-field');
      const datePickerPopup = node?.querySelector('ids-date-picker-popup');
      const timePickerPopup = node?.querySelector('ids-time-picker-popup');
      let menuAttachment = '.ids-data-grid-wrapper';

      // Slotted filter only
      if (slot && (input || dropdown || datePicker || timePicker || btn)) {
        menuAttachment = 'ids-data-grid';

        // Slotted initial
        this.#initial[column.id] = this.#initial[column.id] || {};
        const initial = this.#initial[column.id];
        if (input && !initial.input) initial.input = { value: input.value };
        if (dropdown && !initial.dropdown) initial.dropdown = { value: dropdown.value };
        if (datePicker && !initial.datePicker) initial.datePicker = { value: datePicker.value };
        if (timePicker && !initial.timePicker) initial.timePicker = { value: timePicker.value };
        if (btn && !initial.btn) initial.btn = { value: btn.menuEl?.getSelectedValues()[0] };

        // Slotted attributes
        setCompulsoryAttributes(input);
        setCompulsoryAttributes(dropdown);
        setCompulsoryAttributes(datePicker);
        setCompulsoryAttributes(timePicker);
        if (btn) {
          btn.cssClass = [...new Set([...btn.cssClass, 'compact'])];
          btn.setAttribute('color-variant', (!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'));
          btn.setAttribute('column-id', column.id);
          btn.setAttribute('square', 'true');
        }
        // Place slotted menus into a special slot placed near internal filter menus
        if (menu) {
          menu.setAttribute('slot', `menu-container`);
        }
      }

      // Connect Popup Menus
      if (menu) {
        menu.setAttribute(attributes.TRIGGER_TYPE, 'click');
        menu.setAttribute(attributes.ATTACHMENT, menuAttachment);
        menu.onOutsideClick = () => { menu.hide(); };

        // Move/Rebind menu (order of these statements matters)
        menu.appendToTargetParent();
        menu.popupOpenEventsTarget = document.body;
        menu.refreshTriggerEvents();
      }

      btn?.setAttribute('data-filter-conditions-button', '');

      const dateOrTimePopup = datePickerPopup || timePickerPopup;
      if (dateOrTimePopup) {
        dateOrTimePopup.appendToTargetParent();
        dateOrTimePopup.popupOpenEventsTarget = document.body;
        dateOrTimePopup.onOutsideClick = (e: MouseEvent) => {
          if (!e.composedPath().includes(dateOrTimePopup)) { dateOrTimePopup.hide(); }
        };
        dateOrTimePopup.setAttribute(attributes.TRIGGER_TYPE, 'click');
        dateOrTimePopup.setAttribute(attributes.TARGET, `#${triggerField.getAttribute('id')}`);
        dateOrTimePopup.setAttribute(attributes.TRIGGER_ELEM, `#${triggerBtn.getAttribute('id')}`);
        dateOrTimePopup.popup.setAttribute(attributes.ARROW_TARGET, `#${triggerBtn.getAttribute('id')}`);
        dateOrTimePopup.popup.y = 16;
        dateOrTimePopup.setAttribute(attributes.ATTACHMENT, menuAttachment);
        dateOrTimePopup.refreshTriggerEvents();
      }

      // Date Picker - Adjust range settings
      if (datePickerPopup) {
        const rangeSettings = column.filterOptions?.rangeSettings;
        if (rangeSettings) datePickerPopup.rangeSettings = rangeSettings;
        datePickerPopup.useRange = (btn?.menuEl?.getSelectedValues()[0] === 'in-range');
      }

      // Time Picker - Adjust format
      if (timePickerPopup) {
        const format = this.root.localeAPI?.calendar().timeFormat;
        triggerField.format = format;
        timePickerPopup.format = format;
      }

      // Dropdown/List settings
      if (dropdown && dropdownList) {
        dropdownList.configurePopup();
        dropdownList.setAttribute('size', 'full');
        dropdown.input.value = (dropdownList.selected || dropdownList.listBox?.children[0])?.textContent || '';
        dropdownList.setAttribute(attributes.ATTACHMENT, menuAttachment);
        dropdownList.appendToTargetParent();
        dropdownList.popupOpenEventsTarget = document.body;
        dropdownList.setAttribute(attributes.TRIGGER_TYPE, 'custom');
        dropdownList.setAttribute(attributes.TARGET, `#${dropdown.getAttribute('id')}`);
        dropdownList.setAttribute(attributes.TRIGGER_ELEM, `#${dropdown.getAttribute('id')}`);
        dropdown.onEvent('click', dropdown, () => {
          const popup = dropdownList.popup;
          if (popup) {
            if (!popup.visible) dropdown.open();
            else dropdown.close();
          }
        });
        dropdownList.onOutsideClick = (e: MouseEvent) => {
          if (!e.composedPath().includes(dropdownList)) {
            dropdown.close();
          }
        };
        dropdownList.refreshTriggerEvents();
      }

      // Integer type mask
      if (type === 'integer') {
        input.mask = 'number';
        input.maskOptions = {
          allowDecimal: false,
          allowNegative: true,
          allowThousandsSeparator: false
        };
      }
      // Decimal type mask
      if (type === 'decimal') {
        input.mask = 'number';
        input.maskOptions = {
          allowDecimal: true,
          allowNegative: true
        };
      }
    });
  }

  /**
   * Handle all triggering and handling of events
   * @returns {void}
   */
  attachFilterEventHandlers() {
    // Captures selected contents from menu/dropdown list items.
    this.root.offEvent(`selected.${this.#id()}`, this.root.wrapper);
    this.root.onEvent(`selected.${this.#id()}`, this.root.wrapper, (e: any) => {
      const elem = e.detail?.elem;
      if (!elem) return;

      if (/ids-menu-item/gi.test(elem.nodeName)) {
        this.#handleMenuButtonSelected(elem);
      }

      if (/ids-dropdown-list/gi.test(elem.nodeName)) {
        e.target.value = e.detail.value;
      }
    });

    // Change event for input, dropdown and multiselect
    const header = this.root.container?.querySelector('.ids-data-grid-header:not(.column-groups)');
    this.root.onEvent(`change.${this.#id()}`, header, (e: any) => {
      const nodeName = e.target?.nodeName;
      if (!this.#suppressFilteredEvent && nodeName && /ids-(input|trigger-field|dropdown|multiselect)/gi.test(nodeName)) {
        this.applyFilter();
      }
    });

    // Capture 'dayselected' events from IdsDatePickerPopup
    this.root.onEvent(`dayselected.${this.#id()}`, this.root.wrapper, (e: any) => {
      // this will trigger the above change event which also calls applyFilter().
      e.target.value = e.detail.value;
    });

    // Capture 'timeselected' events from IdsTimePickerPopup
    this.root.onEvent(`timeselected.${this.#id()}`, this.root.wrapper, (e: any) => {
      // this will trigger the above change event which also calls applyFilter().
      e.target.value = e.detail.value;
    });

    // Change event for ids-date-picker and ids-time-picker
    this.filterNodes?.forEach((n: any) => {
      const slot = n.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : n;
      const elem = node?.querySelector('ids-date-picker, ids-time-picker');
      if (elem) this.root.onEvent(`change.${this.#id()}`, elem.input, () => this.applyFilter());
    });

    // Set filter event when typing for input
    this.setFilterWhenTyping();
  }

  /**
   * Handles `selected` events from filter menus
   * @param {IdsMenuItem} el reference to the menu item that triggered the event
   * @returns {void}
   */
  #handleMenuButtonSelected(el: IdsMenuItem) {
    const target = (el.menu as any)?.target;
    if (!target?.hasAttribute('data-filter-conditions-button')) return;

    const { value, icon, text: label } = el;
    if (!icon || !target || target.icon === icon.replace(/^filter-/g, '')) return;

    const columnId = target.getAttribute('column-id');
    const initial = this.#initial[columnId].btn;
    const beforeChange = {
      icon: target.icon,
      value: `${target.icon}`.replace(/^filter-/g, ''),
      label: (target.text || '').trim()
    };
    target.icon = icon;
    target.querySelector('span, ids-text').textContent = label;
    this.root.triggerEvent('filteroperatorchanged', this.root, {
      bubbles: true,
      detail: {
        elem: this.root,
        targetElem: target,
        icon,
        value,
        label,
        initial,
        beforeChange
      }
    });
    this.applyFilter();
  }

  /**
   * Set filter event when typing for all filter inputs
   * @returns {void}
   */
  setFilterWhenTyping() {
    this.filterNodes?.forEach((n: any) => {
      const slot = n.querySelector('slot[name^="filter-"]');
      const node = slot ? slot.assignedElements()[0] : n;
      const input = node?.querySelector('ids-input');
      if (!input) return;
      const eventName = `keydownend.${input.id}`;
      if (this.root.filterWhenTyping) {
        n.classList.add('filter-when-typing');
        this.root.onEvent(eventName, input, () => {
          const canFilter = input.value?.length > 3 || input.value?.length === 0;
          this.focused = input;
          if (canFilter) this.applyFilter();
        });
      } else {
        n.classList.remove('filter-when-typing');
        this.root.offEvent(eventName, input);
      }
    });
  }

  /**
   * Returns the markup for filter menu button and input.
   * @private
   * @param {string} type Must be exactly the same as filter method name
   * @param {IdsDataGridColumn} column The column info.
   * @returns {string} The resulting template
   */
  #btnAndInputTemplate(type: string, column: IdsDataGridColumn) {
    const input = `${this.#inputTemplate(type, column)}`;
    const button = `${this.#filterButtonTemplate(type, column)}`;
    if (column.align === 'right') {
      return `${input}${button}`;
    }
    return `${button}${input}`;
  }

  /**
   * Returns the markup for filter menu button in header cell.
   * @private
   * @param {string} type Must be exactly the same as filter method name
   * @param {IdsDataGridColumn} column The column info.
   * @returns {string} The resulting template
   */
  #filterButtonTemplate(type: string, column: IdsDataGridColumn) {
    const operators = this.#operators(type, column);

    if (!operators?.length) return '';

    const opt = column.filterOptions || {};
    const disabled = opt.disabled ? ' disabled' : '';
    const readonly = opt.readonly ? ' readonly' : '';

    let sel: any = null;
    const id = `${this.#id(column)}-${type}`;
    if (this.#conditions.length) {
      const condition = this.#conditions.filter((c: any) => c.columnId === column.id)[0];
      sel = operators.filter((op) => (op.value === condition?.operator))[0];
    }
    if (!sel) sel = operators.filter((op) => (op.selected))[0];
    if (!operators.length) sel = { value: '', icon: '', label: '' };
    let items = '';
    operators.forEach((op, i) => {
      const defaultSel = !sel && i === 0;
      if (defaultSel) sel = op;
      const selected = op.value === sel.value ? ' selected="true"' : '';
      items += `<ids-menu-item id="item-${i}-${id}" value="${op.value}" icon="${op.icon}"${selected}>${op.label}</ids-menu-item>`;
    });

    this.#initial[column.id] = this.#initial[column.id] || {};
    if (!this.#initial[column.id].btn) this.#initial[column.id].btn = { ...sel };

    return `
      <ids-menu-button
        color-variant="${!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'}"
        css-class="compact"
        icon="${sel.icon}"
        column-id="${column.id}"
        id="btn-${id}"
        menu="menu-${id}"
        square="true"
        trigger-type="click"
        ${disabled}${readonly}
        dropdown-icon>
        <span class="audible">${sel.label}</span>
      </ids-menu-button>
      <ids-popup-menu id="menu-${id}" target="#btn-${id}">
        <ids-menu-group select="single">${items}</ids-menu-group>
      </ids-popup-menu>`;
  }

  /**
   * Get input template string
   * @private
   * @param {string} type Must be exactly the same as filter method name
   * @param {IdsDataGridColumn} column The column info.
   * @returns {string} The template string
   */
  #inputTemplate(type: any, column: any) {
    const id = `${this.#id(column)}-${type}`;
    const opt = column.filterOptions || {};
    const label = opt.label || 'Filter Input';
    const placeholder = opt.placeholder ? ` placeholder="${opt.placeholder}"` : '';
    const disabled = opt.disabled ? ' disabled' : '';
    const readonly = opt.readonly ? ' readonly' : '';

    let value = this.#conditions.filter((c: any) => c.columnId === column.id)[0]?.value ?? null;
    this.#initial[column.id] = this.#initial[column.id] || {};
    if (!this.#initial[column.id].input) this.#initial[column.id].input = { value };
    value = value ? ` value="${value}"` : '';

    return `<ids-input
      color-variant="${!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'}"
      data-filter-type="${type}"
      type="${opt.type || 'text'}"
      size="${opt.size || 'full'}"
      label="${label}"
      label-state="collapsed"
      ${this.root.rowHeight === 'xxs' || this.root.rowHeight === 'xxs' ? `field-height="xs"` : ''}
      id="${id}"
      text-align="${column.align === 'right' ? 'end' : 'start'}"
      no-margins
      compact
      ${placeholder}${disabled}${readonly}${value}>
    </ids-input>`;
  }

  /**
   * Get trigger field template string
   * @private
   * @param {string} type Must be exactly the same as filter method name
   * @param {IdsDataGridColumn} column The column info.
   * @param {string} [icon] if provided, defines the icon used on this field's trigger button
   * @param {string} [btnText] if provided, defines the text content of this field's trigger button
   * @returns {string} The template string
   */
  #triggerFieldTemplate(type: any, column: any, icon?: string, btnText?: string) {
    const fieldId = `field-${this.#id(column)}-${type}`;
    const triggerBtnId = `triggerBtn-${this.#id(column)}-${type}`;
    const opt = column.filterOptions || {};
    const triggerBtnIcon = icon ? ` icon="${icon}"` : '';
    const triggerBtnText = btnText ? `<ids-text audible="true" translate-text="true">${btnText}</ids-text>` : '';
    const label = opt.label || 'Filter Input';
    const placeholder = opt.placeholder ? ` placeholder="${opt.placeholder}"` : '';
    const disabled = opt.disabled ? ' disabled' : '';
    const readonly = opt.readonly ? ' readonly' : '';

    let value = this.#conditions.filter((c: any) => c.columnId === column.id)[0]?.value ?? null;
    this.#initial[column.id] = this.#initial[column.id] || {};
    if (!this.#initial[column.id].input) this.#initial[column.id].input = { value };
    value = value ? ` value="${value}"` : '';

    return `<ids-trigger-field
      color-variant="${!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'}"
      data-filter-type="${type}"
      type="${opt.type || 'text'}"
      size="${opt.size || 'full'}"
      label="${label}"
      label-state="collapsed"
      id="${fieldId}"
      no-margins
      compact
      ${placeholder}${disabled}${readonly}${value}>
      <ids-trigger-button id="${triggerBtnId}" slot="trigger-end"${triggerBtnIcon}>
        <ids-icon part="icon"></ids-icon>
        ${triggerBtnText}
      </ids-trigger-button>
    </ids-trigger-field>`;
  }

  /**
   * Get dropdown template string
   * @private
   * @param {string} type Must be exactly the same as filter method name
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The template string
   */
  #dropdownTemplate(type: any, column: any) {
    const id = `${this.#id(column)}-${type}`;
    const operators = this.#operators(type, column);

    const opt = column.filterOptions || {};
    const label = opt.label || 'Filter Dropdown';
    const disabled = opt.disabled ? ' disabled' : '';
    const readonly = opt.readonly ? ' readonly' : '';

    let sel: any = null;
    if (this.#conditions.length) {
      const condition = this.#conditions.filter((c: any) => c.columnId === column.id)[0];
      sel = operators.filter((op: any) => (op.label === condition?.value))[0];
    }
    if (!sel) sel = operators.filter((op: any) => op.selected)[0];
    let items = '';
    const { value: nfValue, label: nfLabel } = this.#dropdownNotFilterItem(column);
    const notFilteredItemTemplate = () => {
      if (!sel) sel = { value: nfValue };
      items = `<ids-list-box-option id="${id}-opt-not-filtered" value="${nfValue}">${nfLabel}</ids-list-box-option>`;
    };

    if (!operators.length) {
      notFilteredItemTemplate();
    } else {
      const found = operators.some((op: any) => op.value === nfValue);
      if (!found) notFilteredItemTemplate();
      operators.forEach((op: any, i: any) => {
        items += `<ids-list-box-option id="${id}-opt-${i}" value="${op.value}">${op.label}</ids-list-box-option>`;
      });
    }
    if (!sel) sel = operators[0];
    const value = (sel?.value || sel?.value === '') ? ` value="${sel.value}"` : '';
    const isUppercase = (): boolean => {
      if (typeof column?.uppercase === 'function') return column.uppercase('header-cell', column);
      return (column?.uppercase === 'true' || column?.uppercase === true);
    };
    const uppercaseClass = isUppercase() ? ' uppercase' : '';

    this.#initial[column.id] = this.#initial[column.id] || {};
    if (!this.#initial[column.id].dropdown) this.#initial[column.id].dropdown = { ...sel };

    return `
      <ids-dropdown
        color-variant="${!this.root.listStyle ? 'alternate-formatter' : 'alternate-list-formatter'}"
        label="${label}"
        label-state="collapsed"
        list="#${id}-list"
        no-margins
        compact
        data-filter-type="${type}"
        size="${opt.size || 'full'}"
        id="${id}"
        ${value}${disabled}${readonly}
      >
      </ids-dropdown>
      <ids-dropdown-list id="${id}-list">
        <ids-list-box${uppercaseClass}>${items}</ids-list-box>
      </ids-dropdown-list>
    `;
  }

  /**
   * Get list of filter wrapper elements
   * @returns {Array<HTMLElement>} List of filter wrapper elements
   */
  get filterNodes() {
    return this.root?.shadowRoot?.querySelectorAll('.ids-data-grid-header-cell-filter-wrapper');
  }

  /**
   * Get not filter item for dropdown
   * @private
   * @param {IdsDataGridColumn} column The column info
   * @returns {object} The item
   */
  #dropdownNotFilterItem(column: IdsDataGridColumn) {
    const item = (column?.filterOptions as any)?.notFilteredItem || {};
    return { value: item.value || 'not-filtered', label: item.label || '' };
  }

  /**
   * Get unique id string
   * @private
   * @param {IdsDataGridColumn} column The column info
   * @returns {string} The id string
   */
  #id(column?: IdsDataGridColumn) {
    const columnId = column?.id ? `${column.id}-` : '';
    return `ids-data-grid-filter-${columnId}${instanceCounter}`;
  }

  /**
   * Get button operators by filter type
   * @private
   * @param {string} type The filter type
   * @param {IdsDataGridColumn} column The column info
   * @returns {Array} List of button operators
   */
  #operators(type: string, column: IdsDataGridColumn): { value: string, label: string, icon: string, selected?: boolean }[] {
    if (column?.filterConditions?.constructor === Array) return column.filterConditions;
    const ds = this.#operatorsDataset;
    let operators: any = [];

    // Collect and built, all the operators for contents type
    const contentsOperators = () => {
      const val = this.root.datasource.allData.map((row: any) => escapeHTML(row[column.id]));
      return [...new Set(val)].map((v) => ({ value: v || '', label: v || '' }));
    };

    switch (type) {
      case 'text':
        operators = [
          ds.contains,
          ds.doesNotContain,
          ds.equals,
          ds.doesNotEqual,
          ds.isEmpty,
          ds.isNotEmpty,
          ds.endsWith,
          ds.doesNotEndWith,
          ds.startsWith,
          ds.doesNotStartWith
        ];
        break;
      case 'decimal':
      case 'integer':
      case 'time':
        operators = [
          ds.equals,
          ds.doesNotEqual,
          ds.isEmpty,
          ds.isNotEmpty,
          ds.lessThan,
          ds.lessOrEquals,
          ds.greaterThan,
          ds.greaterOrEquals
        ];
        break;
      case 'checkbox':
        operators = [
          ds.all,
          ds.selected,
          ds.notSelected
        ];
        break;
      case 'contents':
        operators = contentsOperators();
        break;
      case 'date':
        operators = [
          ds.equals,
          ds.doesNotEqual,
          ds.isEmpty,
          ds.isNotEmpty,
          ds.inRange,
          ds.lessThan,
          ds.lessOrEquals,
          ds.greaterThan,
          ds.greaterOrEquals
        ];
        break;
      default:
        break;
    }

    return operators;
  }

  /**
   * Available operators for filter button.
   * @private
   * @type {object}
   */
  #operatorsDataset = {
    contains: { value: 'contains', label: 'Contains', icon: 'filter-contains' },
    doesNotContain: { value: 'does-not-contain', label: 'Does Not Contain', icon: 'filter-does-not-contain' },
    equals: { value: 'equals', label: 'Equals', icon: 'filter-equals' },
    doesNotEqual: { value: 'does-not-equal', label: 'Does Not Equals', icon: 'filter-does-not-equal' },
    isEmpty: { value: 'is-empty', label: 'Is Empty', icon: 'filter-is-empty' },
    isNotEmpty: { value: 'is-not-empty', label: 'Is Not Empty', icon: 'filter-is-not-empty' },
    endsWith: { value: 'end-with', label: 'Ends With', icon: 'filter-end-with' },
    doesNotEndWith: { value: 'does-not-end-with', label: 'Does Not End With', icon: 'filter-does-not-end-with' },
    startsWith: { value: 'start-with', label: 'Starts With', icon: 'filter-start-with' },
    doesNotStartWith: { value: 'does-not-start-with', label: 'Does Not Start With', icon: 'filter-does-not-start-with' },
    lessThan: { value: 'less-than', label: 'Less Than', icon: 'filter-less-than' },
    lessOrEquals: { value: 'less-equals', label: 'Less Or Equals', icon: 'filter-less-equals' },
    greaterThan: { value: 'greater-than', label: 'Greater Than', icon: 'filter-greater-than' },
    greaterOrEquals: { value: 'greater-equals', label: 'Greater Or Equals', icon: 'filter-greater-equals' },
    inRange: { value: 'in-range', label: 'In Range', icon: 'filter-in-range' },
    all: { value: 'selected-notselected', label: 'All', icon: 'filter-selected-notselected' },
    selected: { value: 'selected', label: 'Selected', icon: 'filter-selected' },
    notSelected: { value: 'not-selected', label: 'Not Selected', icon: 'filter-not-selected' },
  };
}
