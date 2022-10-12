import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-date-picker-popup-base';
import {
  subtractDate, isValidDate, weekNumberToDate, weekNumber, hoursTo24
} from '../../utils/ids-date-utils/ids-date-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsModalButton from '../ids-modal-button/ids-modal-button';
import '../ids-month-view/ids-month-view';
import '../ids-text/ids-text';

import {
  IdsDatePickerCommonAttributes,
  MIN_MONTH,
  MAX_MONTH,
  MONTH_KEYS,
  PICKLIST_LENGTH
} from './ids-date-picker-common';

// Types
import type {
  IdsRangeSettings,
  IdsDisableSettings,
  IdsDayselectedEvent,
  IdsLegend
} from '../ids-month-view/ids-month-view';

import styles from './ids-date-picker-popup.scss';

/**
 * IDS Date Picker Popup Component
 * @type {IdsDatePickerPopup}
 * @inherits IdsPopup
 * @mixes IdsLocaleMixin
 */
@customElement('ids-date-picker-popup')
@scss(styles)
class IdsDatePickerPopup extends Base {
  constructor() {
    super();
  }

  /**
   * Elements for internal usage
   * @private
   */
  #monthView: any;

  connectedCallback() {
    super.connectedCallback();
    this.#monthView = this.container?.querySelector('ids-month-view');
    this.#attachEventListeners();
    this.#attachExpandedListener();
  }

  disconnectedCallback(): void {
    this.disconnectedCallback?.();
    this.#monthView = null;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      ...IdsDatePickerCommonAttributes
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-popup class="ids-date-picker-popup" type="menu" align="bottom, left" arrow="bottom" tabIndex="-1" y="12" animated>
      <ids-month-view
        slot="content"
        compact="true"
        is-date-picker="true"
        show-today=${this.showToday}
        first-day-of-week="${this.firstDayOfWeek}"
        year="${this.year}"
        month="${this.month}"
        day="${this.day}"
        use-range="${this.useRange}"
      ></ids-month-view>
      <div
        slot="content"
        class="popup-footer"
        part="footer">
        <ids-modal-button class="popup-btn popup-btn-cancel" cancel ${this.showCancel ? '' : ' hidden'}>
          <ids-text translate-text="true" font-weight="bold" part="btn-cancel">Cancel</ids-text>
        </ids-modal-button>
        <ids-modal-button class="popup-btn popup-btn-clear" part="btn-clear">
          <ids-text translate-text="true" font-weight="bold">Clear</ids-text>
        </ids-modal-button>
        <ids-modal-button class="popup-btn popup-btn-apply"${this.useRange ? ' disabled' : ' hidden'} part="btn-apply" type="primary">
          <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
        </ids-modal-button>
      </div>
    </ids-popup>`;
  }

  /**
   * @returns {Array<string>} Date Picker vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow'];

  /**
   * format attributes
   * @returns {string} format param. Default is locale - gets format from the calendar
   */
  get format(): string {
    const attrVal = this.getAttribute(attributes.FORMAT);

    return !attrVal || attrVal === 'locale' ? this.locale?.calendar().dateFormat.short : attrVal;
  }

  /**
   * Sets the value date format and applies ids-mask
   * @param {string|null} val format attribute
   */
  set format(val: string | null) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
      this.target?.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
      this.target?.removeAttribute(attributes.FORMAT);
    }

    if (this.placeholder) {
      this.placeholder = this.format;
    }

    this.container?.querySelector('ids-time-picker')?.remove();

    let valueAttr = '';
    if (this.target) valueAttr = ` value="${this.target.value}"`;

    if (this.#hasTime()) {
      this.#monthView?.insertAdjacentHTML('afterend', `
        <ids-time-picker
          embeddable="true"
          ${valueAttr}
          format="${this.format}"
          minute-interval="${this.minuteInterval}"
          second-interval="${this.secondInterval}"
          use-current-time="${this.useCurrentTime}"
        ></ids-time-picker>
      `);
    }

    this.container?.classList.toggle('has-time', this.#hasTime());

    // @TODO Fix mask
    // this.#applyMask();
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    // true by default if no attribute
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set whether or not month view today button should be show
   * @param {string|boolean|null} val show-today attribute value
   */
  set showToday(val: string | boolean | null) {
    this.setAttribute(attributes.SHOW_TODAY, val);
    this.#monthView?.setAttribute(attributes.SHOW_TODAY, val);
    // this.#attachExpandedListener();
  }

  /**
   * fist-day-of-week attribute for calendar popup
   * If not set the information comes from the locale. If not set in the locale defaults to 0
   * @returns {number} firstDayOfWeek param
   */
  get firstDayOfWeek(): number {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return this.locale?.calendar().firstDayofWeek || 0;
  }

  /**
   * Set month view first day of the week
   * @param {string|number|null} val fist-day-of-week attribute value
   */
  set firstDayOfWeek(val: string | number | null) {
    this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    this.#monthView?.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
  }

  /**
   * month attribute
   * @returns {number} month param
   */
  get month(): number {
    const attrVal = this.getAttribute(attributes.MONTH);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal >= MIN_MONTH && numberVal <= MAX_MONTH) {
      return numberVal;
    }

    // Default is current month
    return new Date().getMonth();
  }

  /**
   * Set month view month attribute
   * @param {string|number|null} val month param value
   */
  set month(val: string | number | null) {
    if (!Number.isNaN(stringToNumber(val))) {
      this.setAttribute(attributes.MONTH, val);
      this.#monthView?.setAttribute(attributes.MONTH, val);
    } else {
      this.removeAttribute(attributes.MONTH);
      this.#monthView?.removeAttribute(attributes.MONTH);
    }

    if (this.isCalendarToolbar) {
      this.hide();
    }
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value
   */
  get year(): number {
    const attrVal = this.getAttribute(attributes.YEAR);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && attrVal.length === 4) {
      return numberVal;
    }

    // Default is current year
    return new Date().getFullYear();
  }

  /**
   * Set month view year attribute
   * @param {string|number|null} val year attribute value
   */
  set year(val: string | number | null) {
    if (val) {
      this.setAttribute(attributes.YEAR, val);
      this.#monthView?.setAttribute(attributes.YEAR, val);
    } else {
      this.removeAttribute(attributes.YEAR);
      this.#monthView?.removeAttribute(attributes.YEAR);
    }

    if (this.isCalendarToolbar) {
      this.hide();
    }
  }

  /**
   * day attribute
   * @returns {number} day param converted to number from attribute value
   */
  get day(): number {
    const attrVal = this.getAttribute(attributes.DAY);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal > 0) {
      return numberVal;
    }

    // Default is current day
    return new Date().getDate();
  }

  /**
   * Set month view day attribute
   * @param {string|number|null} val day attribute value
   */
  set day(val: string | number | null) {
    if (val) {
      this.setAttribute(attributes.DAY, val);
      this.#monthView?.setAttribute(attributes.DAY, val);
    } else {
      this.removeAttribute(attributes.DAY);
      this.#monthView?.removeAttribute(attributes.DAY);
    }

    if (this.isCalendarToolbar) {
      this.hide();
    }
  }

  /**
   * expanded attribute
   * @returns {boolean} whether the month/year picker expanded or not
   */
  get expanded(): boolean {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  /**
   * Set whether or not the month/year picker should be expanded
   * @param {string|boolean|null} val expanded attribute value
   */
  set expanded(val: string | boolean | null) {
    if (!this.isDropdown || !this.container) return;

    const boolVal = stringToBool(val);
    if (boolVal !== this.expanded) {
      this.container.querySelector('ids-expandable-area').expanded = boolVal;
      this.container.classList.toggle('is-expanded', boolVal);
      this.#triggerExpandedEvent(boolVal);

      if (boolVal) {
        this.#attachPicklist();
        const monthViewHeight: number = getClosest(this, 'ids-month-view')?.container.offsetHeight || 0;
        const timePickerHeight: number = getClosest(this, 'ids-month-view')?.parentElement
          ?.querySelector('ids-time-picker')?.container.offsetHeight || 0;

        this.container.querySelector('.picklist')?.style.setProperty('height', `${monthViewHeight + timePickerHeight - 48}px`);

        const monthEl = this.container.querySelector(`.picklist-item.is-month[data-month="${this.month}"]`);
        const yearEl = this.container.querySelector(`.picklist-item.is-year[data-year="${this.year}"]`);
        const week = weekNumber(new Date(this.year, this.month, this.day), this.firstDayOfWeek);
        const weekEl = this.container.querySelector(`.picklist-item.is-week[data-week="${week}"]`);
        const picklistBtns: any = this.container.querySelectorAll('.picklist-item.is-btn-up, .picklist-item.is-btn-down');

        this.#selectPicklistEl(monthEl);
        this.#selectPicklistEl(yearEl);
        this.#selectPicklistEl(weekEl);

        picklistBtns.forEach((item: HTMLElement) => {
          item.setAttribute('tabindex', '0');
        });

        this.container.querySelector('.picklist-item.is-selected')?.focus();

        this.setAttribute(attributes.EXPANDED, boolVal);
      } else {
        this.#unselectPicklist('all');
        this.removeAttribute(attributes.EXPANDED);
      }
    }
  }

  /**
   * @returns {Array<IdsLegend>} array of legend items
   */
  get legend(): Array<IdsLegend> {
    return this.#monthView?.legend;
  }

  /**
   * Set array of legend items to month view component
   * Validation of data is provided by the month view component
   * @param {Array<IdsLegend>|null} val array of legend items
   */
  set legend(val: Array<IdsLegend> | null) {
    if (this.#monthView) {
      this.#monthView.legend = val;
    }
  }

  /**
   * Get range settings for month view component
   * @returns {object} month view range settings
   */
  get rangeSettings(): IdsRangeSettings {
    return this.#monthView?.rangeSettings;
  }

  /**
   * Pass range selection settings for month view component
   * and update input value if passed settings contain start/end
   * @param {object} val settings to be assigned to default range settings
   */
  set rangeSettings(val: IdsRangeSettings) {
    if (this.#monthView) {
      const btnApply = this.container?.querySelector('.popup-btn-apply');
      this.#monthView.rangeSettings = val;

      if (val?.start && val?.end) {
        if (this.target) this.target.value = `${this.locale.formatDate(this.#setTime(val.start), { pattern: this.format })}${this.rangeSettings.separator}${this.locale.formatDate(this.#setTime(val.end), { pattern: this.format })}`;
        btnApply?.removeAttribute('disabled');
      }

      if (val?.selectWeek) {
        btnApply?.setAttribute('hidden', 'true');
      }
    }
  }

  /**
 * minute-interval attribute
 * @returns {number} minuteInterval value
 */
  get minuteInterval(): number {
    return stringToNumber(this.getAttribute(attributes.MINUTE_INTERVAL));
  }

  /**
   * Set interval in minutes dropdown
   * @param {string|number|null} val minute-interval attribute value
   */
  set minuteInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (numberVal) {
      this.setAttribute(attributes.MINUTE_INTERVAL, numberVal);
      timePicker?.setAttribute(attributes.MINUTE_INTERVAL, numberVal.toString());
    } else {
      this.removeAttribute(attributes.MINUTE_INTERVAL);
      timePicker?.removeAttribute(attributes.MINUTE_INTERVAL);
    }
  }

  /**
   * second-interval attribute
   * @returns {number} secondInterval value
   */
  get secondInterval(): number {
    return stringToNumber(this.getAttribute(attributes.SECOND_INTERVAL));
  }

  /**
   * Set interval in seconds dropdown
   * @param {string|number|null} val second-interval attribute value
   */
  set secondInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (numberVal) {
      this.setAttribute(attributes.SECOND_INTERVAL, numberVal);
      timePicker?.setAttribute(attributes.SECOND_INTERVAL, numberVal.toString());
    } else {
      this.removeAttribute(attributes.SECOND_INTERVAL);
      timePicker?.removeAttribute(attributes.SECOND_INTERVAL);
    }
  }

  /**
   * show-clear attribute
   * @returns {boolean} showClear param converted to boolean from attribute value
   */
  get showClear(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_CLEAR));
  }

  /**
   * Set whether or not to show clear button in the calendar popup
   * @param {string|boolean|null} val show-clear attribute value
   */
  set showClear(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    const btn = this.container?.querySelector('.popup-btn-clear');

    if (boolVal) {
      this.setAttribute(attributes.SHOW_CLEAR, boolVal);
      btn?.removeAttribute('hidden');
    } else {
      this.removeAttribute(attributes.SHOW_CLEAR);
      btn?.setAttribute('hidden', (!boolVal).toString());
    }

    btn?.classList.toggle('is-visible', boolVal);
  }

  /**
   * show-cancel attribute
   * @returns {boolean} showCancel param converted to boolean from attribute value
   */
  get showCancel(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_CANCEL));
  }

  /**
   * Set whether or not to show cancel button when the picker is expanded
   * @param {string|boolean|null} val show-cancel attribute value
   */
  set showCancel(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_CANCEL, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_CANCEL);
    }
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

    this.setAttribute(attributes.SHOW_PICKLIST_YEAR, boolVal);
    this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_YEAR, boolVal);
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

    this.setAttribute(attributes.SHOW_PICKLIST_MONTH, boolVal);
    this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_MONTH, boolVal);
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
      this.setAttribute(attributes.SHOW_PICKLIST_WEEK, boolVal);
      this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_WEEK, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
      this.#monthView?.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
    }
  }

  /**
   * use-current-time attribute
   * @returns {number} useCurrentTime param converted to boolean from attribute value
   */
  get useCurrentTime(): boolean {
    return stringToBool(this.getAttribute(attributes.USE_CURRENT_TIME));
  }

  /**
   * Set whether or not to show current time in the time picker
   * @param {string|boolean|null} val useCurrentTime param value
   */
  set useCurrentTime(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (boolVal) {
      this.setAttribute(attributes.USE_CURRENT_TIME, boolVal.toString());
      timePicker?.setAttribute(attributes.USE_CURRENT_TIME, boolVal.toString());
    } else {
      this.removeAttribute(attributes.USE_CURRENT_TIME);
      timePicker?.removeAttribute(attributes.USE_CURRENT_TIME);
    }
  }

  /**
   * use-range attribute
   * @returns {boolean} useRange param converted to boolean from attribute value
   */
  get useRange(): boolean {
    const attrVal = this.getAttribute(attributes.USE_RANGE);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component should be a range picker
   * @param {string|boolean|null} val useRange param value
   */
  set useRange(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    const btnApply = this.container?.querySelector('.popup-btn-apply');

    if (boolVal) {
      this.setAttribute(attributes.USE_RANGE, boolVal);
      this.#monthView?.setAttribute(attributes.USE_RANGE, boolVal);
      btnApply?.removeAttribute('hidden');
      btnApply?.setAttribute('disabled', 'true');
    } else {
      this.removeAttribute(attributes.USE_RANGE);
      this.#monthView?.removeAttribute(attributes.USE_RANGE);
      btnApply?.setAttribute('hidden', 'true');
      btnApply?.removeAttribute('disabled');
    }
  }

  /**
   * Expanded/collapsed event for date picker (picklist) in calendar popup
   */
  #attachExpandedListener() {
    this.offEvent('expanded.date-picker-expand');
    this.onEvent('expanded.date-picker-expand', this.#monthView?.container?.querySelector('ids-date-picker'), (e: any) => {
      const btnApply = this.container?.querySelector('.popup-btn-apply');
      const btnCancel = this.container?.querySelector('.popup-btn-cancel');

      btnApply?.setAttribute('hidden', `${!(e.detail.expanded || (this.useRange && !this.rangeSettings.selectWeek))}`);
      btnApply?.classList.toggle('is-visible', e.detail.expanded || (this.useRange && !this.rangeSettings.selectWeek));

      if (e.detail.expanded) {
        btnApply?.removeAttribute('disabled');

        if (this.showCancel) {
          btnCancel?.removeAttribute('hidden');
        }
      } else {
        btnApply?.setAttribute('disabled', `${!(this.rangeSettings.start && this.rangeSettings.end)}`);
        btnCancel?.setAttribute('hidden', `${!e.detail.expanded && !this.showCancel}`);
      }
    });
  }

  #attachEventListeners() {
    if (!this.isDropdown) {
      this.offEvent('dayselected.date-picker-calendar');
      this.onEvent('dayselected.date-picker-calendar', this.#monthView, (e: IdsDayselectedEvent) => {
        this.#handleDaySelectedEvent(e);
      });

      this.offEvent('click.date-picker-footer');
      this.onEvent('click.date-picker-footer', this.container?.querySelector('.popup-footer'), (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;

        e.stopPropagation();

        if (target.closest('.popup-btn-apply')) {
          this.#handleApplyEvent(e);
          return;
        }

        if (target.closest('.popup-btn-clear')) {
          this.clear();
          this.hide();
          return;
        }

        if (target.closest('.popup-btn-cancel')) {
          this.#resetPickList();
          this.hide();
        }
      });
    }

    if (this.isDropdown) {
      this.offEvent('click.date-picker-dropdown');
      this.onEvent('click.date-picker-dropdown', this.container?.querySelector('ids-toggle-button'), (e: MouseEvent) => {
        e.stopPropagation();

        this.expanded = !this.expanded;
      });

      this.offEvent('click.date-picker-picklist');
      this.onEvent('click.date-picker-picklist', this.container?.querySelector('.picklist'), (e: MouseEvent) => {
        this.#handlePicklistEvent(e);
      });
    }

    // Input value change triggers component value change
    if (this.target) {
      this.offEvent('change.date-picker-input');
      this.onEvent('change.date-picker-input', this.target, (e: any) => {
        this.setAttribute(attributes.VALUE, e.detail.value);
      });

      // Closes popup on input focus
      this.offEvent('focus.date-picker-input');
      this.onEvent('focus.date-picker-input', this.target, () => {
        this.hide();
      });
    }
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
   * Click to apply button event handler
   * @param {MouseEvent} e click event
   */
  #handleApplyEvent(e: MouseEvent): void {
    e.stopPropagation();

    const picklist = this.#monthView?.container?.querySelector('ids-date-picker');

    if (picklist?.expanded) {
      const { month, year, day } = picklist;

      this.#monthView.year = year;
      this.#monthView.month = month;
      this.#monthView.day = day;

      picklist.expanded = false;

      return;
    }

    const close = () => {
      this.hide();
      this.target?.focus();
      this.#triggerSelectedEvent();
    };

    if (this.useRange) {
      if (this.rangeSettings.end || (this.rangeSettings.start && !this.rangeSettings.end)) {
        if (this.rangeSettings.minDays && (this.rangeSettings.start === this.rangeSettings.end)) {
          this.rangeSettings.start = subtractDate(this.rangeSettings.start, this.rangeSettings.minDays, 'days');
        }

        if (this.target) {
          this.target.value = [
            this.locale.formatDate(this.#setTime(this.rangeSettings.start), { pattern: this.format }),
            this.rangeSettings.separator,
            this.locale.formatDate(
              this.#setTime(this.rangeSettings.end ?? this.#monthView.activeDate),
              { pattern: this.format }
            ),
          ].filter(Boolean).join('');
        }

        close();
      } else {
        if (this.target) {
          this.target.value = this.locale.formatDate(
            this.#setTime(this.rangeSettings.start ?? this.#monthView.activeDate),
            { pattern: this.format }
          );
        }
        this.rangeSettings = {
          start: this.#monthView.activeDate
        };
      }

      return;
    }

    if (this.target) {
      this.target.value = this.locale.formatDate(
        this.#setTime(this.#monthView.activeDate),
        { pattern: this.format }
      );
    }

    close();
  }

  /**
   * Clears the contents of
   * @returns {void}
   */
  clear() {
    this.#resetPickList();
    if (!this.isCalendarToolbar) {
      this.rangeSettings = {
        start: null,
        end: null
      };
      if (this.target) {
        this.target.value = '';
        this.target.focus();
      }
      this.#triggerSelectedEvent();
    }
  }

  /**
   * Selected event handler
   * @param {IdsDayselectedEvent} e event from the calendar day selection
   */
  #handleDaySelectedEvent(e: IdsDayselectedEvent): void {
    const inputDate: Date = this.locale.parseDate(this.target?.value, { dateFormat: this.format });

    // Clear action
    // Deselect the selected date by clicking to the selected date
    if (isValidDate(inputDate) && inputDate.getTime() === e.detail.date.getTime()) {
      if (this.target) this.target.value = '';
      if (this.#monthView.selectDay) {
        this.#monthView.selectDay();
      }
      this.#triggerSelectedEvent();

      return;
    }

    if (this.useRange) {
      if (this.rangeSettings.selectWeek) {
        if (this.target) {
          this.target.value = [
            this.locale.formatDate(this.#setTime(e.detail.rangeStart as Date), { pattern: this.format }),
            this.rangeSettings.separator,
            e.detail.rangeEnd && this.locale.formatDate(this.#setTime(e.detail.rangeEnd), { pattern: this.format })
          ].filter(Boolean).join('');
        }

        this.hide();
        this.focus();
        this.#triggerSelectedEvent();

        return;
      }

      const btnApply = this.container?.querySelector('.popup-btn-apply');

      if (e.detail.rangeStart && e.detail.rangeEnd) {
        btnApply?.removeAttribute('disabled');
      } else {
        btnApply?.setAttribute('disabled', 'true');
      }
    } else {
      if (this.target) {
        this.target.value = this.locale.formatDate(
          this.#setTime(e.detail.date),
          { pattern: this.format }
        );
      }
      this.year = e.detail.date.getFullYear();
      this.month = e.detail.date.getMonth();
      this.day = e.detail.date.getDate();
      this.hide();
      this.focus();
      this.#triggerSelectedEvent();
    }
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
   * Render month/year picklist
   */
  #attachPicklist() {
    if (!this.isDropdown) return;

    const template = `
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
    `;

    this.container?.querySelectorAll('.picklist-section').forEach((el: Element) => el?.remove());
    this.container?.querySelector('.picklist')?.insertAdjacentHTML('afterbegin', template);
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

  #resetPickList() {
    const picklist = this.#monthView?.container.querySelector('ids-date-picker');
    if (picklist?.expanded) {
      picklist.expanded = false;
    }
  }

  /**
   * Defines if the format has hours/minutes/seconds pattern to show time picker
   * @returns {boolean} whether or not to show time picker
   */
  #hasTime(): boolean {
    return this.format.includes('h') || this.format.includes('m') || this.format.includes('s');
  }

  /**
   * Helper to set the date with time from time picker
   * @param {any} val date to add time values
   * @returns {Date} date with time values
   */
  #setTime(val: any): Date {
    const date = isValidDate(val) ? val : new Date(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (!this.#hasTime() || !timePicker) return date;

    const hours: number = timePicker.hours;
    const minutes: number = timePicker.minutes;
    const seconds: number = timePicker.seconds;
    const period: string = timePicker.period;
    const dayPeriodIndex = this.locale?.calendar().dayPeriods?.indexOf(period);

    date.setHours(hoursTo24(hours, dayPeriodIndex), minutes, seconds);

    return date;
  }

  /**
   * Trigger expanded event with current params
   * @param {boolean} expanded expanded or collapsed
   * @returns {void}
   */
  #triggerExpandedEvent(expanded: any): void {
    const args = {
      bubbles: true,
      detail: {
        elem: this,
        expanded
      }
    };

    this.triggerEvent('expanded', this, args);
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent(): void {
    const args = {
      detail: {
        elem: this,
        date: this.#monthView.activeDate,
        useRange: this.useRange,
        rangeStart: this.useRange && this.rangeSettings.start ? new Date(this.rangeSettings.start as string) : null,
        rangeEnd: this.useRange && this.rangeSettings.end ? new Date(this.rangeSettings.end as string) : null
      }
    };

    if (this.target) {
      this.target.triggerEvent('dayselected', this, args);
    }
  }

  /**
   * Runs when this picker component hides
   * @returns {void}
   */
  onHide() {
    if (this.#monthView.selectDay) {
      this.#monthView.selectDay();
    }
    this.container.setAttribute(htmlAttributes.TABINDEX, '-1');
    this.#resetPickList();

    this.container?.querySelectorAll('.popup-footer ids-modal-button')?.forEach((button: IdsModalButton) => {
      button.removeRipples();
    });
  }

  /**
   * Runs when this picker component shows
   * @returns {void}
   */
  onShow(): void {
    this.#attachEventListeners();

    if (this.target && this.target.value) {
      this.#monthView?.selectDay(this.year, this.month, this.day);
    }

    this.container.removeAttribute(htmlAttributes.TABINDEX);
    this.#monthView.focus();
  }
}

export default IdsDatePickerPopup;
