import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-month-view-base';

// Import Utils
import {
  addDate,
  daysDiff,
  firstDayOfMonthDate,
  firstDayOfWeekDate,
  gregorianToUmalqura,
  isValidDate,
  lastDayOfMonthDate,
  subtractDate,
  weeksInMonth,
  weeksInRange,
} from '../../utils/ids-date-utils/ids-date-utils';
import {
  stringToBool,
  stringToNumber,
  buildClassAttrib,
} from '../../utils/ids-string-utils/ids-string-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

// Supporting components
import IdsButton from '../ids-button/ids-button';
// eslint-disable-next-line import/no-cycle
import IdsDatePicker from '../ids-date-picker/ids-date-picker';
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import IdsToolbar from '../ids-toolbar/ids-toolbar';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';

// Import Styles
import styles from './ids-month-view.scss';

const MIN_MONTH = 0;
const MAX_MONTH = 11;
const WEEK_LENGTH = 7;

/**
 * IDS Month View Component
 * @type {IdsMonthView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-month-view')
@scss(styles)
class IdsMonthView extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COMPACT,
      attributes.DAY,
      attributes.END_DATE,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.IS_DATEPICKER,
      attributes.MONTH,
      attributes.SHOW_TODAY,
      attributes.START_DATE,
      attributes.YEAR
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-month-view ${this.compact ? 'is-compact' : 'is-fullsize'}${this.isDatePicker ? ' is-date-picker' : ''}">
      <div class="month-view-container">
        <table class="month-view-table" aria-label="${this.locale?.translate('Calendar')}" role="application">
          <thead class="month-view-table-header">
            <tr></tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    // Respond to container changing language
    this.offEvent('languagechange.month-view-container');
    this.onEvent('languagechange.month-view-container', getClosest(this, 'ids-container'), async () => {
      this.#setDirection();
      this.#renderToolbar();
      this.#renderMonth();
    });

    // Respond to container changing locale
    this.offEvent('localechange.month-view-container');
    this.onEvent('localechange.month-view-container', getClosest(this, 'ids-container'), async () => {
      this.#setDirection();
      this.#renderMonth();
      this.#attachDatepicker();
    });

    // Day select event
    this.offEvent('click.month-view-dayselect');
    this.onEvent('click.month-view-dayselect', this.container.querySelector('tbody'), (e) => {
      this.#daySelectClick(e.target.closest('td'));
    });

    return this;
  }

  #attachKeyboardListeners() {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', 'Enter', ' '];

    this.listen(keys, this.container.querySelector('tbody'), (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      if (e.key === 'ArrowRight' || e.key === '+') {
        const lastDayOfMonth = lastDayOfMonthDate(this.year, this.month, this.day, this.locale?.isIslamic());

        // Next month/year with rerender
        if (lastDayOfMonth.getDate() === this.day) {
          const nextDate = addDate(lastDayOfMonth, 1, 'days');

          this.year = nextDate.getFullYear();
          this.month = nextDate.getMonth();
          this.day = nextDate.getDate();
        } else {
          // Just increase day without rerender
          this.day += 1;
        }
      }

      if (e.key === 'ArrowLeft' || e.key === '-') {
        const firstDayOfMonth = firstDayOfMonthDate(this.year, this.month, this.day, this.locale?.isIslamic());

        // Previous month/year with rerender
        if (firstDayOfMonth.getDate() === this.day) {
          const prevDate = subtractDate(firstDayOfMonth, 1, 'days');

          this.year = prevDate.getFullYear();
          this.month = prevDate.getMonth();
          this.day = prevDate.getDate();
        } else {
          // Just decrease day without rerender
          this.day -= 1;
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        this.#triggerSelectedEvent();
      }
    });
  }

  /**
   * Add/Remove toolbar HTML to container
   */
  #renderToolbar() {
    if (this.#isRange()) {
      this.container.querySelector('ids-toolbar')?.remove();
      this.#detachToolbarEvents();

      return;
    }

    const prevNextBtn = `<ids-button class="btn-previous">
      <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
      <ids-icon slot="icon" icon="chevron-left"></ids-icon>
    </ids-button>
    <ids-button class="btn-next">
      <ids-text audible="true" translate-text="true">NextMonth</ids-text>
      <ids-icon slot="icon" icon="chevron-right"></ids-icon>
    </ids-button>`;
    const todayBtn = this.showToday ? `<ids-button css-class="no-padding" class="btn-today">
      <ids-text
        class="month-view-today-text"
        font-size="16"
        translate-text="true"
        font-weight="bold"
      >Today</ids-text>
    </ids-button>` : '';

    const toolbarTemplate = `<ids-toolbar class="month-view-header" tabbable="true">
      ${!this.compact ? `
        <ids-toolbar-section type="buttonset">
          ${prevNextBtn}
          <ids-date-picker
            is-calendar-toolbar="true"
            value="${this.#formatMonthText()}"
            month="${this.month}"
            year="${this.year}"
            day="${this.day}"
            first-day-of-week="${this.firstDayOfWeek}"
            show-today=${this.showToday}"
          ></ids-date-picker>
          ${todayBtn}
        </ids-toolbar-section>
      ` : `
        <ids-toolbar-section>
          <div class="datepicker-section">
            ${!this.isDatePicker ? `
              <ids-trigger-button>
                <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
                <ids-icon slot="icon" icon="schedule" class="trigger-icon"></ids-icon>
              </ids-trigger-button>
            ` : ''}
            <ids-date-picker
              is-dropdown="true"
              value="${this.#formatMonthText()}"
            ></ids-date-picker>
          </div>
        </ids-toolbar-section>
        <ids-toolbar-section align="end" type="buttonset">
          ${todayBtn}
          ${prevNextBtn}
        </ids-toolbar-section>
      `}
    </ids-toolbar>`;

    // Clear/add HTML
    this.container.querySelector('ids-toolbar')?.remove();
    this.container.insertAdjacentHTML('afterbegin', toolbarTemplate);

    // Toolbar events
    this.#attachToolbarEvents();
  }

  /**
   * Add next/previous/today click events when toolbar is attached
   */
  #attachToolbarEvents() {
    const buttonSet = this.container.querySelector('ids-toolbar-section[type="buttonset"]');

    this.offEvent('click.month-view-buttons');
    this.onEvent('click.month-view-buttons', buttonSet, (e) => {
      e.stopPropagation();

      if (e.target?.classList.contains('btn-previous')) {
        this.#changeDate('previous');
      }

      if (e.target?.classList.contains('btn-next')) {
        this.#changeDate('next');
      }

      if (e.target?.classList.contains('btn-today')) {
        this.#changeDate('today');
        this.#triggerSelectedEvent();
      }
    });

    this.offEvent('dayselected.month-view-datepicker');
    this.onEvent('dayselected.month-view-datepicker', this.container.querySelector('ids-date-picker'), (e) => {
      const date = e.detail.date;

      this.day = date.getDate();
      this.year = date.getFullYear();
      this.month = date.getMonth();
    });
  }

  /**
   * Remove calendar toolbar events when showing range of dates
   */
  #detachToolbarEvents() {
    this.offEvent('click.month-view-buttons');
    this.offEvent('dayselected.month-view-datepicker');
  }

  /**
   * Helper to format datepicker text in the toolbar
   * @returns {string} locale formatted month year
   */
  #formatMonthText() {
    const dayOfMonth = new Date(this.year, this.month, this.day);

    return this.locale?.formatDate(dayOfMonth, { month: 'long', year: 'numeric', numberingSystem: 'latn' });
  }

  /**
   * Datepicker changing locale formatted text
   */
  #attachDatepicker() {
    const text = this.#formatMonthText();
    const datepicker = this.container.querySelector('ids-date-picker');

    if (!this.#isRange() && datepicker) {
      datepicker.value = text;
      datepicker.month = this.month;
      datepicker.year = this.year;
      datepicker.day = this.day;
      datepicker.firstDayOfWeek = this.firstDayOfWeek;
      datepicker.showToday = this.showToday;
    }
  }

  /**
   * Change month/year/day by event type
   * @param {'next'|'previous'|'today'} type of event to be called
   */
  #changeDate(type) {
    if (type === 'next') {
      this.year = this.month === MAX_MONTH ? this.year + 1 : this.year;
      this.month = this.month === MAX_MONTH ? MIN_MONTH : this.month + 1;
    }

    if (type === 'previous') {
      this.year = this.month === MIN_MONTH ? this.year - 1 : this.year;
      this.month = this.month === MIN_MONTH ? MAX_MONTH : this.month - 1;
    }

    if (type === 'today') {
      const now = new Date();

      this.day = now.getDate();
      this.year = now.getFullYear();
      this.month = now.getMonth();
    }

    this.#attachDatepicker();
  }

  /**
   * Day cell clicked
   * @param {HTMLElement} element The element.
   */
  #daySelectClick(element) {
    if (!element) return;

    const { month, year, day } = element.dataset;
    const isDisabled = element.classList.contains('is-disabled');

    if (!isDisabled) {
      // Not changing day for range calendar, just selecting UI
      if (this.#isRange()) {
        this.#selectDay(year, month, day);
      } else {
        this.day = day;
      }

      // Alternate cells clicked
      if ((stringToNumber(month) !== this.month || this.locale?.isIslamic()) && !this.#isRange()) {
        this.year = year;
        this.month = month;
        this.#selectDay(year, month, day);
      }

      this.#triggerSelectedEvent();
    }
  }

  /**
   * Helper to get month format for first day of a month or first day of the range
   * @param {Date} date date to check
   * @param {Date} rangeStartsOn very first day of the range
   * @returns {string|undefined} Intl.DateTimeFormat options month format (numeric, long, short)
   */
  #monthInDayFormat(date, rangeStartsOn) {
    const isFirstDayOfRange = daysDiff(date, rangeStartsOn) === 0;
    const isFirstDayOfMonth = this.locale?.isIslamic()
      ? gregorianToUmalqura(date).day === 1
      : date.getDate() === 1;

    if (this.#isRange() && (isFirstDayOfRange || isFirstDayOfMonth)) {
      return 'short';
    }

    return undefined;
  }

  /**
   * Table cell HTML template with locale, data attributes
   * @param {number} weekIndex number of week in month starting from 0
   * @returns {string} table cell HTML template
   */
  #getCellTemplate(weekIndex) {
    const firstDayOfRange = this.#isRange()
      ? this.startDate
      : firstDayOfMonthDate(this.year, this.month, this.day, this.locale?.isIslamic());
    const lastDayOfRange = this.#isRange()
      ? this.endDate
      : lastDayOfMonthDate(this.year, this.month, this.day, this.locale?.isIslamic());
    const rangeStartsOn = firstDayOfWeekDate(firstDayOfRange, this.firstDayOfWeek);

    return Array.from({ length: WEEK_LENGTH }).map((_, index) => {
      const date = addDate(rangeStartsOn, (weekIndex * WEEK_LENGTH) + index, 'days');
      const monthFormat = this.#monthInDayFormat(date, rangeStartsOn);
      const dayText = this.locale?.formatDate(date, {
        day: 'numeric',
        month: monthFormat,
        numberingSystem: 'latn'
      });
      const ariaLabel = this.locale?.formatDate(date, { dateStyle: 'full' });
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const isSelected = day === this.day && year === this.year && month === this.month;
      const isDisabled = this.#isRange() && (date < this.startDate || date > this.endDate);
      const isAlternate = !this.#isRange() && (date < firstDayOfRange || date > lastDayOfRange);
      const classAttr = buildClassAttrib(
        isAlternate && 'alternate',
        isDisabled && 'is-disabled',
        isSelected && 'is-selected',
        monthFormat && 'month-label'
      );
      const selectedAttr = isSelected ? 'aria-selected="true" tabindex="0" role="gridcell"' : 'role="link"';
      const dataAttr = [`data-year="${year}"`, `data-month="${month}"`, `data-day="${day}"`].join(' ');

      return `<td aria-label="${ariaLabel}" ${dataAttr} ${classAttr} ${selectedAttr}>
        <span class="day-container">
          <ids-text
            aria-hidden="true"
            class="day-text"
            font-size="14"
          >${dayText}</ids-text>
        </span>
      </td>`;
    }).join('');
  }

  /**
   * Add week days HTML to the table
   */
  #renderWeekDays() {
    if (!this.locale) return;

    const calendar = this.locale.calendar();
    const weekDays = this.compact ? calendar.days.narrow : calendar.days.abbreviated;

    const weekDaysTemplate = weekDays.map((_, index) => {
      const weekday = weekDays[(index + this.firstDayOfWeek) % WEEK_LENGTH];

      return `
        <th>
          <ids-text
            class="weekday-text"
            font-size="14"
          >${weekday}</ids-text>
        </th>
      `;
    }).join('');

    // Clear/add HTML
    this.container.querySelectorAll('thead th').forEach((el) => el.remove());
    this.container.querySelector('thead tr').insertAdjacentHTML('beforeend', weekDaysTemplate);
  }

  /**
   * Add month HTML to the table
   */
  #renderMonth() {
    const weeksCount = this.#isRange()
      ? weeksInRange(this.startDate, this.endDate, this.firstDayOfWeek)
      : weeksInMonth(this.year, this.month, this.day, this.firstDayOfWeek, this.locale?.isIslamic());

    const rowsTemplate = Array.from({ length: weeksCount }).map((_, weekIndex) =>
      `<tr>${this.#getCellTemplate(weekIndex)}</tr>`).join('');

    // Clear/add HTML
    this.container.querySelectorAll('tbody tr').forEach((el) => el.remove());
    this.container.querySelector('tbody').insertAdjacentHTML('beforeend', rowsTemplate);

    this.#renderWeekDays();
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent() {
    const date = new Date(this.year, this.month, this.day);
    const args = {
      detail: {
        elem: this,
        date
      }
    };

    this.triggerEvent('dayselected', this, args);
  }

  /**
   * Select active day and change dates if year/month/day is out of current month
   * @param {number} year a given year
   * @param {number} month a given month
   * @param {number} day a given day
   */
  #selectDay(year, month, day) {
    const clearable = this.container.querySelector('td.is-selected');

    // Clear before
    clearable?.removeAttribute('aria-selected');
    clearable?.removeAttribute('tabindex');
    clearable?.setAttribute('role', 'link');
    clearable?.classList.remove('is-selected');

    const selectedQuery = `td[data-year="${year}"][data-month="${month}"][data-day="${day}"]`;
    const selected = this.container.querySelector(selectedQuery);

    // Selectable attributes
    selected?.setAttribute('tabindex', 0);
    selected?.setAttribute('aria-selected', true);
    selected?.setAttribute('role', 'gridcell');
    selected?.classList.add('is-selected');
    selected?.focus();
  }

  /**
   * Whether or not it should show range of dates instead of one month view
   * @returns {boolean} startDate and endDate are set
   */
  #isRange() {
    return this.startDate && this.endDate && this.endDate >= this.startDate;
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday() {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the today button should be shown
   * @param {string|boolean|null} val showToday param value
   */
  set showToday(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_TODAY, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_TODAY);
    }

    this.#renderToolbar();
    this.#attachDatepicker();
  }

  /**
   * month attribute
   * @returns {number} month param converted to number from attribute value with range (MIN_MONTH - MAX_MONTH)
   */
  get month() {
    const attrVal = this.getAttribute(attributes.MONTH);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal >= MIN_MONTH && numberVal <= MAX_MONTH) {
      return numberVal;
    }

    // Default is current month
    return new Date().getMonth();
  }

  /**
   * Set month param and render month table/toolbar
   * @param {string|number|null} val month param value
   */
  set month(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal) && numberVal >= MIN_MONTH && numberVal <= MAX_MONTH) {
      this.setAttribute(attributes.MONTH, val);
    } else {
      this.removeAttribute(attributes.MONTH);
    }

    this.#renderMonth();
    this.#attachDatepicker();
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value with 4-digit check
   */
  get year() {
    const attrVal = this.getAttribute(attributes.YEAR);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && attrVal.length === 4) {
      return numberVal;
    }

    // Default is current year
    return new Date().getFullYear();
  }

  /**
   * Set year param and render month table/toolbar
   * @param {string|number|null} val year param value
   */
  set year(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal) && numberVal.toString().length === 4) {
      this.setAttribute(attributes.YEAR, val);
    } else {
      this.removeAttribute(attributes.YEAR);
    }

    this.#renderMonth();
    this.#attachDatepicker();
  }

  /**
   * day attribute
   * @returns {number} day param converted to number
   */
  get day() {
    const attrVal = this.getAttribute(attributes.DAY);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal > 0) {
      return numberVal;
    }

    // Default is current day
    return new Date().getDate();
  }

  /**
   * Set day param and select active day
   * @param {string|number|null} val day param value
   */
  set day(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal) && numberVal > 0) {
      this.setAttribute(attributes.DAY, val);
      this.#selectDay(this.year, this.month, numberVal);
    } else {
      this.removeAttribute(attributes.DAY);
      this.#selectDay(this.year, this.month, this.day);
    }

    this.#attachDatepicker();
  }

  /**
   * start-date attribute
   * @returns {Date} startDate date parsed from attribute value
   */
  get startDate() {
    const attrVal = this.getAttribute(attributes.START_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && isValidDate(attrDate)) {
      return attrDate;
    }

    return null;
  }

  /**
   * Set start of the range to show
   * @param {string|null} val startDate param value
   */
  set startDate(val) {
    if (val) {
      this.setAttribute(attributes.START_DATE, val);
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    this.#renderToolbar();
    this.#renderMonth();
  }

  /**
   * end-date attribute
   * @returns {Date|null} endDate date parsed from attribute value
   */
  get endDate() {
    const attrVal = this.getAttribute(attributes.END_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && isValidDate(attrDate)) {
      return attrDate;
    }

    return null;
  }

  /**
   * Set end of the range to show
   * @param {string|null} val endDate param value
   */
  set endDate(val) {
    if (val) {
      this.setAttribute(attributes.END_DATE, val);
    } else {
      this.removeAttribute(attributes.END_DATE);
    }

    this.#renderToolbar();
    this.#renderMonth();
  }

  /**
   * fist-day-of-week attribute
   * @returns {number} firstDayOfWeek param converted to number from attribute value with range (0-6)
   */
  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal >= 0 && numberVal <= 6) {
      return numberVal;
    }

    // Default value
    return 0;
  }

  /**
   * Set first day of the week (0-6)
   * @param {string|number|null} val firstDayOfWeek param value
   */
  set firstDayOfWeek(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal)) {
      this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    } else {
      this.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
    }

    this.#renderMonth();
    this.#attachDatepicker();
  }

  /**
   * compact attribute
   * @returns {boolean} compact param converted to boolean from attribute value
   */
  get compact() {
    const attrVal = this.getAttribute(attributes.COMPACT);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component should be compact view
   * @param {string|boolean|null} val compact param value
   */
  set compact(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.COMPACT, boolVal);
    } else {
      this.removeAttribute(attributes.COMPACT);
    }

    // Toggle container CSS class
    this.container.classList.toggle('is-fullsize', !boolVal);
    this.container.classList.toggle('is-compact', boolVal);
    // Render related views
    this.#renderToolbar();
    this.#renderWeekDays();
  }

  /**
   * is-date-picker attribute
   * @returns {boolean} isDatePicker param converted to boolean from attribute value
   */
  get isDatePicker() {
    const attrVal = this.getAttribute(attributes.IS_DATEPICKER);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is used in datepicker popup
   * @param {string|boolean|null} val compact param value
   */
  set isDatePicker(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_DATEPICKER, boolVal);
    } else {
      this.removeAttribute(attributes.IS_DATEPICKER);
    }

    // Toggle container CSS class
    this.container.classList.toggle('is-date-picker', boolVal);
  }

  /**
   * Set the direction attribute
   */
  #setDirection() {
    if (this.locale?.isRTL()) {
      this.setAttribute('dir', 'rtl');
    } else {
      this.removeAttribute('dir');
    }
  }
}

export default IdsMonthView;
