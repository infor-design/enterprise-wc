import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-month-year-picker-view-base';

import '../ids-text/ids-text';

import {
  weekNumber,
  weekNumberToDate
} from '../../utils/ids-date-utils/ids-date-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import {
  IdsDatePickerCommonAttributes,
  MONTH_KEYS,
  PICKLIST_LENGTH
} from './ids-date-picker-common';

// Types
import type {
  IdsDisableSettings,
} from '../ids-month-view/ids-month-view';

import styles from './ids-month-year-picker-view.scss';

/**
 * IDS Month/Year Picker View Component
 * @type {IdsMonthYearPickerView}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-month-year-picker-view')
@scss(styles)
class IdsMonthYearPickerView extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventListeners();
  }

  disconnectedCallback(): void {
    this.disconnectedCallback?.();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      ...IdsDatePickerCommonAttributes
    ];
  }

  template() {
    return `<div class="picklist" role="application">
      ${this.showPicklistWeek ? `
        <div class="picklist-section">
          <ul class="picklist-list">
            <li class="picklist-item is-btn-up is-week-nav">
              <ids-text audible="true" translate-text="true">PreviousWeek</ids-text>
              <ids-icon icon="chevron-up"></ids-icon>
            </li>
            ${this.#getPicklistWeeks()}
            <li class="picklist-item is-btn-down is-week-nav">
              <ids-text audible="true" translate-text="true">NextWeek</ids-text>
              <ids-icon icon="chevron-down"></ids-icon>
            </li>
          </ul>
        </div>
      ` : ''}
      ${this.showPicklistMonth && !this.showPicklistWeek ? `
        <div class="picklist-section">
          <ul class="picklist-list">
            <li class="picklist-item is-btn-up is-month-nav">
              <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
              <ids-icon icon="chevron-up"></ids-icon>
            </li>
            ${this.#getPicklistMonths()}
            <li class="picklist-item is-btn-down is-month-nav">
              <ids-text audible="true" translate-text="true">NextMonth</ids-text>
              <ids-icon icon="chevron-down"></ids-icon>
            </li>
          </ul>
        </div>
      ` : ''}
      ${this.showPicklistYear ? `
        <div class="picklist-section">
          <ul class="picklist-list">
            <li class="picklist-item is-btn-up is-year-nav">
              <ids-text audible="true" translate-text="true">PreviousYear</ids-text>
              <ids-icon icon="chevron-up"></ids-icon>
            </li>
            ${this.#getPicklistYears()}
            <li class="picklist-item is-btn-down is-year-nav">
              <ids-text audible="true" translate-text="true">NextYear</ids-text>
              <ids-icon icon="chevron-down"></ids-icon>
            </li>
          </ul>
        </div>
      ` : ''}
    </div>`;
  }

  /**
   * disabled attribute
   * @returns {boolean} disabled param
   */
  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Set trigger field disabled attribute
   * @param {string|boolean|null} val disabled param value
   */
  set disabled(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    if (boolVal) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  #attachEventListeners() {
    this.offEvent('click.date-picker-picklist');
    this.onEvent('click.date-picker-picklist', this.container, (e: MouseEvent) => {
      this.#handlePicklistEvent(e);
    });
  }

  /**
   * Get a list of years to be attached to the picklist
   * @returns {string|undefined} years list items
   */
  #getPicklistYears(): string | undefined {
    const disabledSettings: IdsDisableSettings = getClosest(this, 'ids-month-view')?.disable;
    const startYear: number = this.year - 2;
    const years: string = Array.from({ length: PICKLIST_LENGTH }).map((_, index) => {
      const year: number = startYear + index;
      const isDisabled: boolean | undefined = disabledSettings?.years?.includes(year);

      return `<li
        data-year="${year}"
        class="picklist-item is-year${index === PICKLIST_LENGTH - 1 ? ' is-last' : ''}${isDisabled ? ' is-disabled' : ''}"
      ><ids-text${isDisabled ? ' disabled="true"' : ''}>${year}</ids-text></li>`;
    }).join('');

    return years;
  }

  /**
   * Get a list of months to be attached to the picklist
   * @returns {string|undefined} months list items
   */
  #getPicklistMonths(): string | undefined {
    const monthsList: Array<string> = MONTH_KEYS.map((item) => this.locale?.translate(`MonthWide${item}`));

    const months: string = monthsList?.map((item: string, index: number) => `<li
        data-month="${index}"
        class="picklist-item is-month${index === PICKLIST_LENGTH - 1 || index === 11 ? ' is-last' : ''}"
      ><ids-text>${item}</ids-text></li>`).filter(
      (_, index: number) => (this.month <= PICKLIST_LENGTH - 1 && index <= PICKLIST_LENGTH - 1)
        || (this.month > PICKLIST_LENGTH - 1 && index > PICKLIST_LENGTH - 1)
    ).join('');

    return months;
  }

  /**
   * Get a list of week numbers to be attached to the picklist
   * @returns {string|undefined} week numbers items
   */
  #getPicklistWeeks(): string | undefined {
    const currentWeek: number = weekNumber(new Date(this.year, this.month, this.day));
    const startWeek: number = currentWeek <= PICKLIST_LENGTH ? 1 : currentWeek - 2;
    const weeks: string = Array.from({ length: PICKLIST_LENGTH }).map((_, index) => {
      const weekIndex: number = startWeek + index;
      const week: number = this.#getWeekNumber(weekIndex);

      return `<li
        data-week="${week}"
        class="picklist-item is-week${index === PICKLIST_LENGTH - 1 ? ' is-last' : ''}"
      ><ids-text>${week}</ids-text></li>`;
    }).join('');

    return weeks;
  }

  /**
   * Helper to get week number from paginated index
   * @param {number} weekIndex index number as it comes from the paged loop
   * @returns {number} week number
   */
  #getWeekNumber(weekIndex: number) {
    // Get total number of weeks in the year by getting week number of the last day of the year
    const totalWeeks = weekNumber(new Date(this.year, 11, 31), this.firstDayOfWeek);

    if (weekIndex > totalWeeks) {
      return weekIndex % totalWeeks;
    }

    if (weekIndex < 1) {
      return totalWeeks + weekIndex;
    }

    return weekIndex;
  }

  /**
   * Click to picklist elements event handler
   * @param {MouseEvent} e click event
   */
  #handlePicklistEvent(e: MouseEvent) {
    if (!e.target) return;
    e.stopPropagation();
    const btnUpYear: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-up.is-year-nav');
    const btnDownYear: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-down.is-year-nav');
    const btnUpMonth: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-up.is-month-nav');
    const btnDownMonth: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-down.is-month-nav');
    const btnUpWeek: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-up.is-week-nav');
    const btnDownWeek: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-down.is-week-nav');
    const monthItem: HTMLElement | null = (e.target as HTMLElement).closest('.is-month');
    const yearItem: HTMLElement | null = (e.target as HTMLElement).closest('.is-year');
    const weekItem: HTMLElement | null = (e.target as HTMLElement).closest('.is-week');

    if (btnUpYear) {
      this.#picklistYearPaged(false);
    }

    if (btnDownYear) {
      this.#picklistYearPaged(true);
    }

    if (btnUpMonth || btnDownMonth) {
      this.#picklistMonthPaged();
    }

    if (btnUpWeek) {
      this.#picklistWeekPaged(false);
    }

    if (btnDownWeek) {
      this.#picklistWeekPaged(true);
    }

    if (monthItem) {
      this.#unselectPicklist('month');
      this.#selectPicklistEl(monthItem);
      monthItem.focus();

      this.month = monthItem.dataset.month as string;
    }

    if (yearItem) {
      const disabledSettings: IdsDisableSettings = getClosest(this, 'ids-month-view')?.disable;
      const isDisabled: boolean | undefined = disabledSettings?.years?.includes(stringToNumber(yearItem.dataset.year));

      if (isDisabled) return;

      this.#unselectPicklist('year');
      this.#selectPicklistEl(yearItem);
      yearItem.focus();

      this.year = yearItem.dataset.year as string;
    }

    if (weekItem) {
      this.#unselectPicklist('week');
      this.#selectPicklistEl(weekItem);
      weekItem.focus();

      const week = stringToNumber(weekItem.dataset.week);
      const date = weekNumberToDate(this.year, week, this.firstDayOfWeek);

      this.month = date.getMonth();
      this.day = date.getDate();
    }
  }

  /**
   * Loop through the year list and increase/descrese year depends on the param
   * @param {boolean} isNext increase/descrese picklist year
   */
  #picklistYearPaged(isNext: boolean) {
    const disabledSettings: IdsDisableSettings = getClosest(this, 'ids-month-view')?.disable;

    this.container?.querySelectorAll('.picklist-item.is-year').forEach((el: any) => {
      const elYear: number = stringToNumber(el.dataset.year);
      const year: number = isNext ? elYear + PICKLIST_LENGTH : elYear - PICKLIST_LENGTH;
      const isDisabled: boolean | undefined = disabledSettings?.years?.includes(year);

      el.dataset.year = year;
      el.querySelector('ids-text').textContent = year;

      el.classList.toggle('is-disabled', isDisabled);
      el.querySelector('ids-text').disabled = isDisabled;

      if (el.classList.contains('is-selected') && !isDisabled) {
        this.#selectPicklistEl(el);

        this.year = year;
      }
    });
  }

  /**
   * Loop through the entire list of the months
   */
  #picklistMonthPaged() {
    const monthsList: Array<string> = MONTH_KEYS.map((item) => this.locale?.translate(`MonthWide${item}`));

    this.container?.querySelectorAll('.picklist-item.is-month').forEach((el: any, index: number) => {
      const elMonth: number = stringToNumber(el.dataset.month);
      const month: number = elMonth > PICKLIST_LENGTH - 1 ? 0 + index : PICKLIST_LENGTH + index;

      el.dataset.month = month;
      el.querySelector('ids-text').textContent = monthsList[month];

      if (el.classList.contains('is-selected')) {
        this.#selectPicklistEl(el);

        this.month = month;
      }
    });
  }

  /**
   * Loop through the week list and increase/descrese week depends on the param
   * @param {boolean} isNext increase/descrese picklist week
   */
  #picklistWeekPaged(isNext: boolean) {
    this.container?.querySelectorAll('.picklist-item.is-week').forEach((el: any) => {
      const elWeek: number = stringToNumber(el.dataset.week);
      const weekIndex: number = isNext ? elWeek + PICKLIST_LENGTH : elWeek - PICKLIST_LENGTH;
      const week = this.#getWeekNumber(weekIndex);

      el.dataset.week = week;
      el.querySelector('ids-text').textContent = week;

      if (el.classList.contains('is-selected')) {
        this.#selectPicklistEl(el);
      }
    });
  }

  /**
   * Set month and day params based on week number
   * @param {number} week number of a week
   */
  #setWeekDate(week: number) {
    const date = weekNumberToDate(this.year, week, this.firstDayOfWeek);

    this.month = date.getMonth();
    this.day = date.getDate();
  }

  /**
   * Add selectable/tabbable attributes to picklist element
   * @param {HTMLElement} el element to handle
   */
  #selectPicklistEl(el: HTMLElement | null) {
    el?.classList.add('is-selected');
    el?.setAttribute('tabindex', '0');
    el?.setAttribute('aria-selected', 'true');
    el?.setAttribute('role', 'gridcell');
  }

  /**
   * Reset picklist selectable/tabbable attributes
   * @param {'month'|'year'|'all'} type of panel to unselect
   */
  #unselectPicklist(type: string) {
    const selector = `.picklist-item${type !== 'all' ? `.is-${type}` : ''}`;

    this.container?.querySelectorAll(selector).forEach((el: Element) => {
      el.removeAttribute('tabindex');
      el.classList.remove('is-selected');
      el.removeAttribute('aria-selected');

      if (el.getAttribute('role') === 'gridcell') {
        el.setAttribute('role', 'link');
      }
    });
  }

  /**
   * show-picklist-year attribute, default is true
   * @returns {boolean} showPicklistYear param converted to boolean from attribute value
   */
  get showPicklistYear(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_PICKLIST_YEAR);

    if (attrVal) {
      return stringToBool(attrVal);
    }

    return true;
  }

  /**
   * Whether or not to show a list of years in the picklist
   * @param {string | boolean | null} val value to be set as show-picklist-year attribute converted to boolean
   */
  set showPicklistYear(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.SHOW_PICKLIST_YEAR, String(boolVal));
    // this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_YEAR, boolVal);
  }

  /**
   * show-picklist-month attribute, default is true
   * @returns {boolean} showPicklistMonth param converted to boolean from attribute value
   */
  get showPicklistMonth(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_PICKLIST_MONTH);

    if (attrVal) {
      return stringToBool(attrVal);
    }

    return true;
  }

  /**
   * Whether or not to show a list of months in the picklist
   * @param {string | boolean | null} val value to be set as show-picklist-month attribute converted to boolean
   */
  set showPicklistMonth(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.SHOW_PICKLIST_MONTH, String(boolVal));
    // this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_MONTH, boolVal);
  }

  /**
   * show-picklist-week attribute
   * @returns {boolean} showPicklistWeek param converted to boolean from attribute value
   */
  get showPicklistWeek(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_PICKLIST_WEEK));
  }

  /**
   * Whether or not to show week numbers in the picklist
   * @param {string | boolean | null} val value to be set as show-picklist-week attribute converted to boolean
   */
  set showPicklistWeek(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_PICKLIST_WEEK, String(boolVal));
      // this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_WEEK, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
      // this.#monthView?.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
    }
  }

  activatePicklist() {
    if (!this.container) return;

    const picklistBtns: any = this.container.querySelectorAll('.picklist-item.is-btn-up, .picklist-item.is-btn-down');
    picklistBtns.forEach((item: HTMLElement) => {
      item.setAttribute('tabindex', '0');
    });

    const monthEl = this.container.querySelector<HTMLElement>(`.picklist-item.is-month[data-month="${this.month}"]`);
    const yearEl = this.container.querySelector<HTMLElement>(`.picklist-item.is-year[data-year="${this.year}"]`);
    const week = weekNumber(new Date(this.year, this.month, this.day), this.firstDayOfWeek);
    const weekEl = this.container.querySelector<HTMLElement>(`.picklist-item.is-week[data-week="${week}"]`);
    this.#selectPicklistEl(monthEl);
    this.#selectPicklistEl(yearEl);
    this.#selectPicklistEl(weekEl);

    this.container.querySelector<HTMLElement>('.picklist-item.is-selected')?.focus();
  }

  deactivatePicklist() {
    if (!this.container) return;

    const picklistBtns: any = this.container.querySelectorAll('.picklist-item.is-btn-up, .picklist-item.is-btn-down');
    picklistBtns.forEach((item: HTMLElement) => {
      item.setAttribute('tabindex', '-1');
    });
  }
}

export default IdsMonthYearPickerView;
