import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsCalendarEventsMixin from '../../mixins/ids-calendar-events-mixin/ids-calendar-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsMonthViewAttributeMixin from './ids-month-view-attribute-mixin';

// Import Utils
import {
  addDate,
  daysDiff,
  daysInMonth,
  firstDayOfMonthDate,
  firstDayOfWeekDate,
  gregorianToUmalqura,
  isValidDate,
  lastDayOfMonthDate,
  subtractDate,
  umalquraToGregorian,
  weeksInMonth,
  weeksInRange,
  removeDateRange,
  weekNumber
} from '../../utils/ids-date-utils/ids-date-utils';
import {
  stringToBool,
  stringToNumber,
  buildClassAttrib,
} from '../../utils/ids-string-utils/ids-string-utils';

// Supporting components
import '../ids-button/ids-button';
import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-trigger-field/ids-trigger-button';

// Import Styles
import styles from './ids-month-view.scss';
import IdsCalendarEvent, { CalendarEventData, CalendarEventTypeData } from '../ids-calendar/ids-calendar-event';
import { getDateValuesFromString } from '../ids-date-picker/ids-date-picker-common';

import type {
  IdsRangeSettings,
  IdsDisableSettings,
  IdsLegendSettings,
} from './ids-month-view-common';
import {
  BASE_Y_OFFSET,
  MIN_MONTH,
  MAX_MONTH,
  MAX_EVENT_COUNT,
  WEEK_LENGTH,
  IdsRangeSettingsInterface
} from './ids-month-view-common';

export type IdsDayselectedEvent = CustomEventInit & {
  detail: {
    elem: IdsMonthView,
    date: Date,
    useRange: boolean,
    rangeStart: Date | null,
    rangeEnd: Date | null,
    events?: CalendarEventData[]
  },
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
};

const Base = IdsMonthViewAttributeMixin(
  IdsDateAttributeMixin(
    IdsCalendarEventsMixin(
      IdsLocaleMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

/**
 * IDS Month View Component
 * @type {IdsMonthView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsCalendarEventsMixin
 * @part container - the container of the component
 * @part table-container - the container of the calendar table
 */
@customElement('ids-month-view')
@scss(styles)
class IdsMonthView extends Base implements IdsRangeSettingsInterface {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#renderMonth();
  }

  // Flag value for custom calendar event
  #isCustom = false;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.COMPACT,
      attributes.END_DATE,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.IS_DATEPICKER,
      attributes.SHOW_PICKLIST_MONTH,
      attributes.SHOW_PICKLIST_WEEK,
      attributes.SHOW_PICKLIST_YEAR,
      attributes.SHOW_TODAY,
      attributes.START_DATE,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-month-view ${this.compact ? 'is-compact' : 'is-fullsize'}${this.isDatePicker ? ' is-date-picker' : ''}" part="container">
      <div class="month-view-container" part="table-container">
        <table class="month-view-table" aria-label="${this.localeAPI?.translate('Calendar')}" role="application">
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
   * @returns {void}
   */
  #attachEventHandlers() {
    // Day select event
    this.offEvent('click.month-view-dayselect');
    this.onEvent('click.month-view-dayselect', this.container?.querySelector('tbody'), (e: MouseEvent) => {
      // ignore clicks from week number column
      if ((e.target as HTMLElement)?.classList.contains('week-num-text')) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        return;
      }

      this.#daySelectClick((e.target as HTMLElement).closest('td'));
    });

    // Range selection event
    this.offEvent('mouseover.month-view-range');
    this.onEvent('mouseover.month-view-range', this.container?.querySelector('tbody'), (e: MouseEvent) => {
      const element = (e.target as HTMLElement).closest('td');

      if (!element) return;

      const { year, month, day } = element.dataset;

      this.#rangePropagation(year, month, day);
    });

    // Clear range selection when hover outside
    this.offEvent('mouseleave.month-view-range');
    this.onEvent('mouseleave.month-view-range', this.container?.querySelector('tbody'), () => {
      this.container?.querySelectorAll('td')
        .forEach((item: HTMLElement) => item.classList.remove('range-next', 'range-prev'));
    });

    // Events Overflow click event
    this.onEvent('click.overflow', this.container, (evt: any) => {
      if (evt.target.tagName === 'IDS-TEXT' && evt.target.classList.contains('events-overflow')) {
        evt.stopPropagation();
        const date = new Date(evt.target.getAttribute('data-date'));
        this.triggerEvent('overflow-click', this, {
          detail: { date },
          bubbles: true,
          cancelable: true,
          composed: true
        });
      }
    });

    return this;
  }

  onLanguageChange = () => {
    this.#renderMonth();
  };

  onLocaleChange = () => {
    this.#renderMonth();
  };

  /**
   * Establish Internal Keyboard shortcuts
   * @returns {object} this class-instance object for chaining
   */
  #attachKeyboardListeners(): any {
    // Group key codes to stop keyboard event, trigger dayselected event and focus active day
    const keys = [33, 34, 35, 36, 37, 38, 39, 40, 187, 189];

    // Range calendar doesn't have keyboard shortcuts
    if (this.#isDisplayRange()) {
      this.offEvent('keydown.month-view-keyboard');
    } else {
      this.offEvent('keydown.month-view-keyboard');
      this.onEvent('keydown.month-view-keyboard', this.container?.querySelector('.month-view-table'), (e: KeyboardEvent) => {
        const key = e.keyCode;

        if (keys.includes(key)) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();
        }

        // When range selection is started
        if (this.useRange) {
          if (this.rangeSettings.start) {
            // Escape resets range selection
            if (key === 27) {
              this.rangeSettings.start = null;
              this.#clearRangeClasses();
              this.selectDay(this.year, this.month, this.day);
              this.focus();
            }

            // Arrow Up includes range start and same day previous week
            if (key === 38) {
              this.changeDate('previous-week', true);
              this.#rangePropagation(this.year, this.month, this.day);
            }

            // Arrow Down includes range start and same day next week
            if (key === 40) {
              this.changeDate('next-week', true);
              this.#rangePropagation(this.year, this.month, this.day);
            }

            // Arrow Right or + key includes next day to range selection
            if (key === 39 || (key === 187 && e.shiftKey)) {
              this.changeDate('next-day', true);
              this.#rangePropagation(this.year, this.month, this.day);
            }

            // Arrow Left or - key includes previous day to range selection
            if (key === 37 || (key === 189 && !e.shiftKey)) {
              this.changeDate('previous-day', true);
              this.#rangePropagation(this.year, this.month, this.day);
            }

            // Enter or space key completes range selection if started
            if (key === 13 || key === 32) {
              this.#setRangeSelection(this.year, this.month, this.day);
              this.#triggerSelectedEvent();
            }

            this.focus();

            return;
          }

          // Enter or space key starts range selection
          if (key === 13 || key === 32) {
            if (this.rangeSettings.selectWeek) {
              this.#rangeSelectWeek(this.year, this.month, this.day);
              this.#triggerSelectedEvent();
            } else {
              this.#setRangeSelection(this.year, this.month, this.day);
              this.focus();
            }
          }
        }

        // Arrow Up selects same day previous week
        if (key === 38) {
          this.changeDate('previous-week');
        }

        // Arrow Down selects same day next week
        if (key === 40) {
          this.changeDate('next-week');
        }

        // Arrow Right or + key selects next day
        if (key === 39 || (key === 187 && e.shiftKey)) {
          this.changeDate('next-day');
        }

        // Arrow Left or - key selects previous day
        if (key === 37 || (key === 189 && !e.shiftKey)) {
          this.changeDate('previous-day');
        }

        // Page Up selects same day previous month
        if (key === 33 && !e.altKey && !(e.ctrlKey || e.metaKey)) {
          this.changeDate('previous-month');
        }

        // Page Down selects same day next month
        if (key === 34 && !e.altKey && !(e.ctrlKey || e.metaKey)) {
          this.changeDate('next-month');
        }

        // ctrl + Page Up selects same day previous year
        if (key === 33 && (e.ctrlKey || e.metaKey)) {
          this.changeDate('previous-year');
        }

        // ctrl + Page Down selects same day next year
        if (key === 34 && (e.ctrlKey || e.metaKey)) {
          this.changeDate('next-year');
        }

        // Home moves to start of the month
        if (key === 36) {
          this.changeDate('start-month');
        }

        // End moves to end of the month
        if (key === 35) {
          this.changeDate('end-month');
        }

        // 't' selects today
        if (key === 84) {
          this.changeDate('today');
        }

        // Add keys including Enter or Space triggers dayselected event in regular calendar
        if (((keys.includes(key) || key === 84) && !this.isDatePicker) || (key === 32 || key === 13)) {
          this.#triggerSelectedEvent();
        }

        if (keys.includes(key) || key === 84) {
          if (this.isDatePicker) {
            this.selectDay(this.year, this.month, this.day);
          }
          this.focus();
        }
      });
    }

    return this;
  }

  /**
   * Add/remove legend HTML to the container
   */
  #renderLegend(): void {
    const template = (this.legend && this.legend.length > 0) ? `
      <div class="month-view-legend">
        ${this.legend.map((item: any) => `
          <div class="month-view-legend-item ${item.cssClass || ''}">
            <span class="month-view-legend-swatch" data-color="${item.color}"></span>
            <ids-text class="month-view-legend-text" ${item.fontSize ? `font-size="${item.fontSize}"` : ''}>${item.name}</ids-text>
          </div>
        `).join('')}
      </div>
    ` : '';

    // Clear/add HTML
    this.container?.querySelector('.month-view-legend')?.remove();
    this.container?.querySelector('.month-view-container')?.insertAdjacentHTML('beforeend', template);

    this.#colorToVar();
  }

  /**
   * Change month/year/day by event type
   * @param {string} type of event to be called
   * @param {boolean} limitMonth date changing is limited only to the current month
   */
  changeDate(type: string, limitMonth = false): void {
    if (type === 'next-month') {
      if (this.localeAPI?.isIslamic()) {
        const umalqura = gregorianToUmalqura(this.activeDate);
        const year = umalqura.month === MAX_MONTH ? umalqura.year + 1 : umalqura.year;
        const month = umalqura.month === MAX_MONTH ? MIN_MONTH : umalqura.month + 1;
        const gregorian = umalquraToGregorian(year, month, umalqura.day === 30 ? 1 : umalqura.day);

        this.day = gregorian.getDate();
        this.year = gregorian.getFullYear();
        this.month = gregorian.getMonth();
      } else {
        this.year = this.month === MAX_MONTH ? this.year + 1 : this.year;
        this.month = this.month === MAX_MONTH ? MIN_MONTH : this.month + 1;
        this.day = this.#getDayInMonth(this.day);
      }
    }

    if (type === 'previous-month') {
      if (this.localeAPI?.isIslamic()) {
        const umalqura = gregorianToUmalqura(this.activeDate);
        const year = umalqura.month === MIN_MONTH ? umalqura.year - 1 : umalqura.year;
        const month = umalqura.month === MIN_MONTH ? MAX_MONTH : umalqura.month - 1;
        const gregorian = umalquraToGregorian(year, month, umalqura.day === 30 ? 1 : umalqura.day);

        this.day = gregorian.getDate();
        this.year = gregorian.getFullYear();
        this.month = gregorian.getMonth();
      } else {
        this.year = this.month === MIN_MONTH ? this.year - 1 : this.year;
        this.month = this.month === MIN_MONTH ? MAX_MONTH : this.month - 1;
        this.day = this.#getDayInMonth(this.day);
      }
    }

    if (type === 'next-day') {
      const lastDayOfMonth = lastDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());

      if (lastDayOfMonth.getDate() === this.day && limitMonth) return;

      if (this.localeAPI?.isIslamic()) {
        const nextDate = addDate(this.activeDate, 1, 'days');

        this.day = nextDate.getDate();
        this.year = nextDate.getFullYear();
        this.month = nextDate.getMonth();

        return;
      }

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

    if (type === 'previous-day') {
      const firstDayOfMonth = firstDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());

      if (firstDayOfMonth.getDate() === this.day && limitMonth) return;

      if (this.localeAPI?.isIslamic()) {
        const prevDate = subtractDate(this.activeDate, 1, 'days');

        this.day = prevDate.getDate();
        this.year = prevDate.getFullYear();
        this.month = prevDate.getMonth();

        return;
      }

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

    if (type === 'next-year') {
      if (this.localeAPI?.isIslamic()) {
        const umalqura = gregorianToUmalqura(this.activeDate);
        const gregorian = umalquraToGregorian(
          umalqura.year + 1,
          umalqura.month,
          umalqura.day === 30 ? 1 : umalqura.day
        );

        this.day = gregorian.getDate();
        this.month = gregorian.getMonth();
        this.year = gregorian.getFullYear();
      } else {
        const y = this.year + 1;
        this.year = y;
        this.day = this.#getDayInMonth(this.day);
      }
    }

    if (type === 'previous-year') {
      if (this.localeAPI?.isIslamic()) {
        const umalqura = gregorianToUmalqura(this.activeDate);
        const gregorian = umalquraToGregorian(
          umalqura.year - 1,
          umalqura.month,
          umalqura.day === 30 ? 1 : umalqura.day
        );

        this.day = gregorian.getDate();
        this.month = gregorian.getMonth();
        this.year = gregorian.getFullYear();
      } else {
        const y = this.year - 1;
        this.year = y;
        this.day = this.#getDayInMonth(this.day);
      }
    }

    if (type === 'today') {
      const now = new Date();

      this.day = now.getDate();
      this.year = now.getFullYear();
      this.month = now.getMonth();

      if (this.useRange) {
        this.rangeSettings.start = now.getTime();
        this.rangeSettings.end = now.getTime();
      }
      this.focus();
    }

    if (type === 'next-week') {
      const nextWeek = addDate(this.activeDate, WEEK_LENGTH, 'days');
      const lastDayOfMonth = lastDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());

      if (nextWeek > lastDayOfMonth && limitMonth) return;

      this.day = nextWeek.getDate();

      if (nextWeek > lastDayOfMonth || this.localeAPI?.isIslamic()) {
        this.year = nextWeek.getFullYear();
        this.month = nextWeek.getMonth();
      }
    }

    if (type === 'previous-week') {
      const prevWeek = subtractDate(this.activeDate, WEEK_LENGTH, 'days');
      const firstDayOfMonth = firstDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());

      if (prevWeek < firstDayOfMonth && limitMonth) return;

      this.day = prevWeek.getDate();

      if (prevWeek < firstDayOfMonth || this.localeAPI?.isIslamic()) {
        this.year = prevWeek.getFullYear();
        this.month = prevWeek.getMonth();
      }
    }

    if (type === 'start-month') {
      const firstDayOfMonth = firstDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());

      this.day = firstDayOfMonth.getDate();

      if (this.localeAPI?.isIslamic()) {
        this.year = firstDayOfMonth.getFullYear();
        this.month = firstDayOfMonth.getMonth();
      }
    }

    if (type === 'end-month') {
      const lastDayOfMonth = lastDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());

      this.day = lastDayOfMonth.getDate();

      if (this.localeAPI?.isIslamic()) {
        this.month = lastDayOfMonth.getMonth();
        this.year = lastDayOfMonth.getFullYear();
      }
    }

    this.triggerDateChange(this.activeDate, type);
  }

  /**
   * Day cell clicked
   * @param {HTMLElement} element The element.
   */
  #daySelectClick(element: null | HTMLElement): void {
    if (!element) return;

    const { month, year, day }: any = element.dataset;
    const isDisabled = element.classList.contains('is-disabled');

    if (!isDisabled) {
      this.#setRangeSelection(year, month, day);

      this.day = day;

      if (stringToNumber(month) !== this.month || this.localeAPI?.isIslamic()) {
        this.month = month;
      }

      if (stringToNumber(year) !== this.year || this.localeAPI?.isIslamic()) {
        this.year = year;
      }

      this.focus();
      this.#triggerSelectedEvent();
    }
  }

  /**
   * Add given year, month, day to the range selection
   * @param {number} year to add to the range selection
   * @param {number} month to add to the range selection
   * @param {number} day to add to the range selection
   */
  #setRangeSelection(year: number, month: number, day: number | undefined): void {
    if (!this.useRange) return;

    const date = new Date(year, month, day);
    const dateTime = date.getTime();
    const diff = this.rangeSettings.start ? daysDiff(this.rangeSettings.start, date) : 0;
    const rangeStarted = this.rangeSettings.start && !this.rangeSettings.end;
    const canSelectBoth = !(this.rangeSettings.selectBackward || this.rangeSettings.selectForward);
    const selectBackward = this.rangeSettings.selectBackward && diff < 0;
    const selectForward = this.rangeSettings.selectForward && diff > 0;
    const startDate = new Date(this.rangeSettings.start as string);
    const startTime = startDate.getTime();
    const minDays = this.rangeSettings.minDays;
    const maxDays = this.rangeSettings.maxDays;
    const minRangeExceeded = (minDays as number) > 0 && Math.abs(diff) < (minDays as number);
    const maxRangeExceeded = (maxDays as number) > 0 && Math.abs(diff) > (maxDays as number);
    const minRangeDate = diff >= 0
      ? addDate(startDate, (minDays as number), 'days')
      : subtractDate(startDate, (minDays as number), 'days');

    this.selectDay(year, month, day);

    if (this.rangeSettings.selectWeek) {
      return;
    }

    // Start is set
    if (rangeStarted && !maxRangeExceeded && (canSelectBoth || selectBackward || selectForward)) {
      if (minRangeExceeded) {
        this.rangeSettings.end = dateTime >= startTime ? minRangeDate.getTime() : this.rangeSettings.start;
        this.rangeSettings.start = subtractDate(this.rangeSettings.end, (minDays as number), 'days');

        this.#renderRangeSelection();

        return;
      }

      this.rangeSettings.end = dateTime >= startTime ? dateTime : this.rangeSettings.start;
      this.rangeSettings.start = dateTime <= startTime ? dateTime : this.rangeSettings.start;

      this.#renderRangeSelection();
      // Start not set or both not set
    } else {
      this.rangeSettings.start = dateTime;
      this.rangeSettings.end = null;

      this.#clearRangeClasses();
    }
  }

  /**
   * Helper to clear range selection CSS classes
   */
  #clearRangeClasses(): void {
    this.container?.querySelectorAll('td')
      .forEach(
        (item: HTMLElement) => item.classList.remove(
          'range-next',
          'range-prev',
          'range-selection',
          'not-included'
        )
      );
  }

  /**
   * Add CSS classes and selected attrs to tables cells when range selection is completed
   */
  #renderRangeSelection(): void {
    if (!this.useRange) return;
    const startRange = new Date(this.rangeSettings.start);
    const endRange = new Date(this.rangeSettings.end);
    const days = this.rangeSettings.end ? daysDiff(startRange, endRange) : 0;

    this.#clearRangeClasses();

    Array.from({ length: days + 1 }).forEach((_, index) => {
      const rangeDay = addDate(startRange, index, 'days');
      const selectedQuery = [
        'td',
        `[data-year="${rangeDay.getFullYear()}"]`,
        `[data-month="${rangeDay.getMonth()}"]`,
        `[data-day="${rangeDay.getDate()}"]`
      ].join('');
      const element = this.container?.querySelector(selectedQuery);

      element?.classList.add('range-selection');

      if (!this.rangeSettings.includeDisabled) {
        element?.classList.add('not-included');
      }

      if ((index === 0 || index === days) && !this.rangeSettings.selectWeek) {
        element?.setAttribute('aria-selected', 'true');
        element?.setAttribute('role', 'gridcell');
        element?.classList.add('is-selected');
      }
    });
  }

  /**
   * Helper to check if date is in the range selection
   * @param {Date} date to check if is in range selection
   * @returns {boolean} whether the date is in range selection
   */
  #isRangeByDate(date: Date): boolean {
    const startRange = new Date(this.rangeSettings.start);
    const endRange = new Date(this.rangeSettings.end);

    return date.getTime() >= startRange.getTime()
      && date.getTime() <= endRange.getTime();
  }

  /**
   * Helper to handle week selection
   * @param {string|number} year to add to the range selection
   * @param {string|number} month to add to the range selection
   * @param {string|number} day to add to the range selection
   */
  #rangeSelectWeek(
    year: string | number | undefined,
    month: string | number | undefined,
    day: string | number | undefined
  ): void {
    const firstDayOfWeek: Date = firstDayOfWeekDate(
      new Date(year as number, month as number, day as number),
      this.firstDayOfWeek
    );

    if (firstDayOfWeek.getTime() !== this.rangeSettings.start?.getTime()) {
      this.rangeSettings.start = firstDayOfWeek;
      this.rangeSettings.end = addDate(this.rangeSettings.start, WEEK_LENGTH - 1, 'days');

      this.selectDay();
      this.#renderRangeSelection();
    }
  }

  /**
   * Add CSS classes to table cells when range selection is in progress
   * Starting from the range settings start
   * @param {string|number} year to add to the range selection
   * @param {string|number} month to add to the range selection
   * @param {string|number} day to add to the range selection
   */
  #rangePropagation(
    year: string | number | undefined,
    month: string | number | undefined,
    day: string | number | undefined
  ): void {
    if (!this.useRange) return;

    if (this.rangeSettings.selectWeek) {
      this.#rangeSelectWeek(year, month, day);

      return;
    }

    if (this.rangeSettings.start && !(this.rangeSettings.end && this.rangeSettings.start)) {
      const startRange = new Date(this.rangeSettings.start);
      const endRange = new Date(year as number, month as number, day as number);
      const diff = daysDiff(startRange, endRange);

      this.#clearRangeClasses();

      const canSelectBoth = !(this.rangeSettings.selectBackward || this.rangeSettings.selectForward);
      const selectBackward = this.rangeSettings.selectBackward && diff < 0;
      const selectForward = this.rangeSettings.selectForward && diff > 0;
      const maxDays = this.rangeSettings.maxDays;
      const maxRangeExceeded = (maxDays as number) > 0 && Math.abs(diff) > (maxDays as number);

      if (diff !== 0 && !maxRangeExceeded && (canSelectBoth || selectBackward || selectForward)) {
        Array.from({ length: Math.abs(diff) }).forEach((_, index) => {
          const rangeDay = diff > 0
            ? addDate(startRange, index + 1, 'days')
            : subtractDate(startRange, index + 1, 'days');
          const selectedQuery = [
            'td',
            `[data-year="${rangeDay.getFullYear()}"]`,
            `[data-month="${rangeDay.getMonth()}"]`,
            `[data-day="${rangeDay.getDate()}"]`
          ].join('');

          this.container?.querySelector(selectedQuery)
            ?.classList.add(diff > 0 ? 'range-next' : 'range-prev');

          if (!this.rangeSettings.includeDisabled) {
            this.container?.querySelector(selectedQuery)?.classList.add('not-included');
          }
        });
      }
    }
  }

  /**
   * Defines if a date is in disabled settings
   * @param {Date} date to check
   * @returns {boolean} wheter or not the date is disabled
   */
  isDisabledByDate(date: Date): boolean {
    const {
      years,
      dayOfWeek,
      dates,
      minDate,
      maxDate,
      isEnable
    }: IdsDisableSettings = this.disableSettings;

    const isOutOfDisplayRange: boolean = this.#isDisplayRange()
      && (date < (this.startDate as Date) || date > (this.endDate as Date));
    const ifYear: boolean = (years as Array<number>).some(
      (item: number) => item === date.getFullYear()
    );
    const ifDayOfWeek: boolean = (dayOfWeek as Array<number>).some(
      (item: number) => item === date.getDay()
    );
    const ifDates: boolean = (dates as Array<string>).some(
      (item: string) => (new Date(item)).getTime() === date.getTime()
    );
    const ifMinMaxDate: boolean = date <= new Date(minDate as string) || date >= new Date(maxDate as string);
    const ifBySettings: boolean = ifYear || ifDayOfWeek || ifDates || ifMinMaxDate;
    const withReverse: boolean = isEnable ? !ifBySettings : ifBySettings;

    return withReverse || isOutOfDisplayRange;
  }

  /**
   * Helper to get month format for first day of a month or first day of the display range
   * @param {Date} date date to check
   * @param {Date} rangeStartsOn very first day of the display range
   * @returns {string|undefined} Intl.DateTimeFormat options month format (numeric, long, short)
   */
  #monthInDayFormat(date: Date, rangeStartsOn: Date): string | undefined {
    const isFirstDayOfRange = daysDiff(date, rangeStartsOn) === 0;
    const isFirstDayOfMonth = this.localeAPI?.isIslamic()
      ? gregorianToUmalqura(date).day === 1
      : date.getDate() === 1;

    if (this.#isDisplayRange() && (isFirstDayOfRange || isFirstDayOfMonth)) {
      return 'short';
    }

    return undefined;
  }

  /**
   * Table cell HTML template with locale, data attributes
   * @param {number} weekIndex number of week in month starting from 0
   * @returns {string} table cell HTML template
   */
  #getCellTemplate(weekIndex: number): string {
    const firstDayOfRange: Date = this.#isDisplayRange()
      ? (this.startDate as Date)
      : firstDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());
    const lastDayOfRange: Date = this.#isDisplayRange()
      ? (this.endDate as Date)
      : lastDayOfMonthDate(this.year, this.month, this.day, this.localeAPI?.isIslamic());
    const rangeStartsOn = firstDayOfWeekDate(firstDayOfRange, this.firstDayOfWeek);
    const firstDayOfWeek = addDate(rangeStartsOn, (weekIndex * WEEK_LENGTH), 'days');
    const now: Date = new Date();
    const isCompact = this.compact;

    const dayCells = Array.from({ length: WEEK_LENGTH }).map((_, index) => {
      const date: Date = addDate(rangeStartsOn, (weekIndex * WEEK_LENGTH) + index, 'days');
      const monthFormat: string | undefined = this.#monthInDayFormat(date, rangeStartsOn);
      const dayText: string = this.localeAPI?.formatDate(date, {
        day: 'numeric',
        month: monthFormat,
        numberingSystem: 'latn'
      });
      const ariaLabel: string = this.localeAPI?.formatDate(date, { dateStyle: 'full' });
      const day: number = date.getDate();
      const month: number = date.getMonth();
      const year: number = date.getFullYear();
      const dateMatch: boolean = day === this.day && year === this.year && month === this.month;
      const isSelected: boolean = !this.useRange && dateMatch;
      const isSelectedWithRange: boolean = this.useRange && !this.rangeSettings.start && dateMatch;
      const isDisabled: boolean = this.isDisabledByDate(date);
      const isAlternate: boolean = !this.#isDisplayRange() && (date < firstDayOfRange || date > lastDayOfRange);
      const legend: any = this.getLegendByDate(date);
      const isRangeSelection: boolean = this.#isRangeByDate(date);
      const isToday: boolean = year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
      const classAttr: string = buildClassAttrib(
        isAlternate && 'alternate',
        legend && 'has-legend',
        isDisabled && 'is-disabled',
        (isSelected || isSelectedWithRange) && 'is-selected',
        monthFormat && 'month-label',
        isRangeSelection && 'range-selection',
        isToday && 'is-today'
      );
      const selectedAttr: string = isSelected || isSelectedWithRange
        ? 'aria-selected="true" tabindex="0" role="gridcell"' : 'role="link"';
      const dataAttr: string = [`data-year="${year}"`, `data-month="${month}"`, `data-day="${day}"`].join(' ');
      const colorAttr: string = legend ? `data-color="${legend.color}"` : '';
      const dateKey = this.generateDateKey(new Date(year, month, day));

      let cellTemplate = `<td aria-label="${ariaLabel}" ${dataAttr} ${classAttr} ${selectedAttr} ${colorAttr}>
        <span class="day-container">
          <ids-text
            aria-hidden="true"
            class="day-text"
            font-size="14"
          >${dayText}</ids-text>
        </span>
        ${isCompact ? '' : `<div class="events-container" data-key="${dateKey}"></div>`}
      </td>`;
      if (typeof this.state.onDayRender === 'function') {
        cellTemplate = this.state.onDayRender(cellTemplate, dateKey);
      }
      return cellTemplate;
    }).join('');

    // Week number cell if enabled
    const weekNumCell = `<td class="week-num-cell">
      <ids-text class="week-num-text" font-size="14">${weekNumber(firstDayOfWeek)}</ids-text>
    </td>`;
    const weekNumCellTemplate = this.showWeekNumbers ? weekNumCell : '';

    return `${weekNumCellTemplate}${dayCells}`;
  }

  /**
   * Add week days HTML to the table
   */
  #renderWeekDays(): void {
    const weekDayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDays = weekDayKeys.map((item) => this.localeAPI?.translate(`${this.compact ? 'DayNarrow' : 'DayAbbreviated'}${item}`));
    const weekDaysWide = weekDayKeys.map((item) => this.localeAPI?.translate(`DayWide${item}`));

    // Week number header if enabled
    const weekNumHeader = `<th scope="col" class="week-num-cell">
      <ids-text class="week-num-text" font-size="14">W#</ids-text>
    </th>`;
    let weekDaysTemplate = this.showWeekNumbers ? weekNumHeader : '';

    weekDaysTemplate += weekDays.map((el: any, index: number) => {
      const idx = (index + this.firstDayOfWeek) % WEEK_LENGTH;
      const weekday = weekDays[idx];
      const weekdaywide = weekDaysWide[idx];

      return `
        <th scope="col" abbr="${weekdaywide}">
          <ids-text
            class="weekday-text"
            font-size="14"
          >${weekday}</ids-text>
        </th>
      `;
    }).join('');

    // Clear/add HTML
    this.container?.querySelectorAll('thead th').forEach((el: Element) => el.remove());
    this.container?.querySelector('thead tr')?.insertAdjacentHTML('beforeend', weekDaysTemplate);
  }

  /**
   * Add month HTML to the table
   */
  #renderMonth(): void {
    const weeksCount = this.#isDisplayRange()
      ? weeksInRange(this.startDate, this.endDate, this.firstDayOfWeek)
      : weeksInMonth(this.year, this.month, this.day, this.firstDayOfWeek, this.localeAPI?.isIslamic());
    this.triggerEvent('beforerendermonth', this, { bubbles: true, composed: true });

    const rowsTemplate = Array.from({ length: weeksCount }).map((_, weekIndex) => `<tr>${this.#getCellTemplate(weekIndex)}</tr>`).join('');

    // Clear/add HTML
    this.container?.querySelectorAll('tbody tr').forEach((el: Element) => el.remove());
    this.container?.querySelector('tbody')?.insertAdjacentHTML('beforeend', rowsTemplate);

    this.#renderWeekDays();
    this.#colorToVar();
    this.state.hasRendered = true;

    if (!this.compact && !this.isDatePicker) {
      this.renderEventsData();
    }
  }

  /**
   * Gets calendar events within the selected/active day
   * @returns {CalendarEventData[]} calendar events data
   */
  getActiveDayEvents(): CalendarEventData[] {
    const activeDay = this.getSelectedDay();
    let eventElems = activeDay ? [...activeDay.querySelectorAll('ids-calendar-event')] : [];
    if (this.#isCustom && activeDay) {
      const customCalendarEvents: any = activeDay.querySelectorAll('.events-container > [slot]');
      eventElems = activeDay ? [...customCalendarEvents] : [];
    }
    const events = eventElems.map((elem: any) => elem.eventData);

    return events;
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent(): void {
    if (this.isDisabledByDate(this.activeDate)) {
      return;
    }

    const args: IdsDayselectedEvent = {
      detail: {
        elem: this,
        date: this.activeDate,
        useRange: this.useRange,
        rangeStart: this.useRange && this.rangeSettings.start ? new Date(this.rangeSettings.start) : null,
        rangeEnd: this.useRange && this.rangeSettings.end ? new Date(this.rangeSettings.end) : null,
        value: this.getFormattedDate(this.activeDate)
      },
      bubbles: true,
      cancelable: true,
      composed: true
    };

    // For full-sized non datepicker month view
    if (!this.compact && !this.isDatePicker) {
      args.detail.events = this.getActiveDayEvents();
    }

    this.triggerEvent('dayselected', this, args);
  }

  /**
   * Add selectable attribute to active day
   * @param {number} year a given year
   * @param {number} month a given month
   * @param {number} day a given day
   */
  selectDay(year?: any, month?: any, day?: any): void {
    // Clear before
    this.#makeAllDeselected();
    const selectedQuery = `td[data-year="${year}"][data-month="${month}"][data-day="${day}"]`;
    const selected = this.container?.querySelector<HTMLTableCellElement>(selectedQuery);
    if (selected) this.#makeSelected(selected);
  }

  /**
   * Makes a specified day in the Month View table appear "selected"
   * @param {HTMLTableCellElement} elem the element to make appear "selected"
   * @returns {void}
   */
  #makeSelected(elem: HTMLTableCellElement): void {
    if (!elem) return;
    elem.setAttribute(attributes.TABINDEX, '0');
    elem.setAttribute('aria-selected', 'true');
    elem.setAttribute('role', 'gridcell');
    elem.classList.add('is-selected');
  }

  /**
   * Makes a specified day in the Month View table appear "selected"
   * @param {HTMLTableCellElement} elem the element to make appear "selected"
   * @returns {void}
   */
  #makeDeselected(elem: HTMLTableCellElement): void {
    if (!elem) return;
    elem.removeAttribute(attributes.TABINDEX);
    elem.removeAttribute('aria-selected');
    elem.setAttribute('role', 'link');
    elem.classList.remove('is-selected');
  }

  /**
   * Clears all previously-selected days from the Month View
   */
  #makeAllDeselected(): void {
    this.container?.querySelectorAll<HTMLTableCellElement>('td.is-selected')?.forEach((item: HTMLTableCellElement) => {
      this.#makeDeselected(item);
    });
  }

  /**
   * Whether or not it should show range of dates instead of one month view
   * @returns {boolean} startDate and endDate are set
   */
  #isDisplayRange(): boolean {
    return isValidDate(this.startDate)
      && isValidDate(this.endDate)
      && (this.endDate as Date) >= (this.startDate as Date);
  }

  /**
   * Helper to check if the month has a day
   * @param {number} day to check
   * @returns {number} day of the month either active or first
   */
  #getDayInMonth(day: number): number {
    const numberOfDays = daysInMonth(this.year, this.month);

    return day > numberOfDays ? 1 : day;
  }

  /**
   * Iterate legend items with color data and add color css variable
   */
  #colorToVar(): void {
    this.container?.querySelectorAll('[data-color]')
      .forEach((el: any) => {
        const color = el.dataset.color;
        const isHex = color?.includes('#');

        if (color) {
          el.style = `--legend-color: ${isHex ? color : `var(--ids-color-${color})`}`;
        }
      });
  }

  /**
   * Queries selected day cell element
   * @returns {HTMLElement} selected day
   */
  getSelectedDay(): HTMLTableCellElement | null {
    const selectedQuery = `td[data-year="${this.year}"][data-month="${this.month}"][data-day="${this.day}"]`;
    return this.container?.querySelector(selectedQuery) || null;
  }

  /**
   * Focuses the active/selected day
   * @returns {void}
   */
  focus(): void {
    const selectedDay = this.getSelectedDay();
    if (selectedDay) {
      const isDisabled = selectedDay.classList.contains('is-disabled');
      if (!isDisabled) {
        this.#makeAllDeselected();
        this.#makeSelected(selectedDay);
        setTimeout(() => selectedDay.focus(), 10);
      }
    }
  }

  /**
   * Inherited from `IdsDateAttributeMixin`
   * @returns {void}
   */
  onFirstDayOfWeekChange() {
    if (this.container) this.#renderMonth();
  }

  /**
   * Inherited from `IdsDateAttributeMixin`
   * @returns {void}
   */
  onMonthChange() {
    if (!this.container) return;

    // Month change in range calendar doesn't trigger a rerender, just selects a day
    if (this.#isDisplayRange()) {
      this.selectDay(this.year, this.month, this.day);
    } else {
      this.#renderMonth();
      this.#renderRangeSelection();
    }
  }

  /**
   * Inherited from `IdsDateAttributeMixin`
   * @returns {void}
   */
  onYearChange() {
    if (!this.container) return;

    // Year change in range calendar doesn't trigger a rerender, just selects a day
    if (this.#isDisplayRange()) {
      this.selectDay(this.year, this.month, this.day);
    } else {
      this.#renderMonth();
      this.#renderRangeSelection();
    }
  }

  /**
   * Inherited from `IdsDateAttributeMixin`
   * @param {number} numberVal new value
   * @param {boolean} validates true if the new value passed is valid
   * @returns {void}
   */
  onDayChange(numberVal: number, validates: boolean) {
    if (!this.container) return;

    if (!(this.rangeSettings.start || this.useRange) && !this.isDatePicker) {
      this.selectDay(this.year, this.month, validates ? numberVal : this.day);
    }
  }

  /**
   * start-date attribute
   * @returns {Date | null} startDate date parsed from attribute value
   */
  get startDate(): Date | null {
    const attrVal = this.getAttribute(attributes.START_DATE) ?? '';
    const attrDate = new Date(attrVal);

    if (attrVal && isValidDate(attrDate)) {
      return attrDate;
    }

    return null;
  }

  /**
   * Set start of the range to show
   * @param {string | Date | null} val startDate param value
   */
  set startDate(val: string | Date | null) {
    if (val) {
      this.setAttribute(attributes.START_DATE, String(val));
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    if (this.container) {
      this.#renderMonth();
      this.#attachKeyboardListeners();
    }
  }

  /**
   * end-date attribute
   * @returns {Date|null} endDate date parsed from attribute value
   */
  get endDate(): Date | null {
    const attrVal = this.getAttribute(attributes.END_DATE) ?? '';
    const attrDate = new Date(attrVal);

    if (attrVal && isValidDate(attrDate)) {
      return attrDate;
    }

    return null;
  }

  /**
   * Set end of the range to show
   * @param {Date | string | null} val endDate param value
   */
  set endDate(val: Date | string | null) {
    if (val) {
      this.setAttribute(attributes.END_DATE, String(val));
    } else {
      this.removeAttribute(attributes.END_DATE);
    }

    if (this.container) {
      this.#renderMonth();
      this.#attachKeyboardListeners();
    }
  }

  /**
   * compact attribute
   * @returns {boolean} compact param converted to boolean from attribute value
   */
  get compact(): boolean {
    const attrVal = this.getAttribute(attributes.COMPACT);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component should be compact view
   * @param {string|boolean|null} val compact param value
   */
  set compact(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.COMPACT, 'true');
    } else {
      this.removeAttribute(attributes.COMPACT);
    }

    // Toggle container CSS class
    this.container?.classList.toggle('is-fullsize', !boolVal);
    this.container?.classList.toggle('is-compact', boolVal);

    if (this.container) {
      // Render related views
      this.#renderWeekDays();
    }
  }

  set showWeekNumbers(val: boolean | null) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.SHOW_WEEK_NUMBERS, '');
    } else {
      this.removeAttribute(attributes.SHOW_WEEK_NUMBERS);
    }
  }

  get showWeekNumbers(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_WEEK_NUMBERS));
  }

  /**
   * is-date-picker attribute
   * @returns {boolean} isDatePicker param converted to boolean from attribute value
   */
  get isDatePicker(): boolean {
    const attrVal = this.getAttribute(attributes.IS_DATEPICKER);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is used in datepicker popup
   * @param {string|boolean|null} val compact param value
   */
  set isDatePicker(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_DATEPICKER, 'true');
    } else {
      this.removeAttribute(attributes.IS_DATEPICKER);
    }

    // Toggle container CSS class
    this.container?.classList.toggle('is-date-picker', boolVal);
  }

  onDisableSettingsChange() {
    this.#renderMonth();
  }

  onLegendSettingsChange(val: IdsLegendSettings) {
    if (!this.container) return;

    this.#renderMonth();
    this.#renderLegend();
    this.container.classList[val && val.length ? 'add' : 'remove']('has-legend');
  }

  onRangeSettingsChange(val: IdsRangeSettings) {
    if (!this.container) return;

    if (this.useRange && val?.start) {
      this.selectDay();
    } else {
      this.#clearRangeClasses();
      this.selectDay(this.year, this.month, this.day);
    }

    this.container.classList.toggle('range-select-week', this.rangeSettings.selectWeek);
    this.#renderRangeSelection();
  }

  onUseRangeChange(newValue: boolean) {
    if (newValue) {
      this.selectDay();
      this.#renderRangeSelection();
    } else {
      this.#clearRangeClasses();
      this.selectDay(this.year, this.month, this.day);
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
   * Whether or not to show a list of years in the toolbar datepicker picklist
   * @param {string | boolean | null} val value to be set as show-picklist-year attribute converted to boolean
   */
  set showPicklistYear(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.SHOW_PICKLIST_YEAR, String(boolVal));
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
   * Whether or not to show a list of months in the toolbar datepicker picklist
   * @param {string | boolean | null} val value to be set as show-picklist-month attribute converted to boolean
   */
  set showPicklistMonth(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.SHOW_PICKLIST_MONTH, String(boolVal));
  }

  /**
   * show-picklist-week attribute
   * @returns {boolean} showPicklistWeek param converted to boolean from attribute value
   */
  get showPicklistWeek(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_PICKLIST_WEEK));
  }

  /**
   * Whether or not to show week numbers in the toolbar datepicker picklist
   * @param {string | boolean | null} val value to be set as show-picklist-week attribute converted to boolean
   */
  set showPicklistWeek(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_PICKLIST_WEEK, 'true');
    } else {
      this.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
    }
  }

  /**
   * Remove month view calendar events and overflow elements
   */
  removeAllEvents(): void {
    this.container
      ?.querySelectorAll('.events-container')
      .forEach((container: Element) => { container.innerHTML = ''; });
  }

  /**
   * Groups calendar events by day using dateKey as key
   * @param {CalendarEventData[]} events calendar events data
   * @returns {Record<string, Array<CalendarEventData>>} collection of calendar events
   */
  #groupEventsByDay(events: CalendarEventData[]): Record<string, Array<CalendarEventData>> {
    const dayEvents: Record<string, Array<CalendarEventData>> = {};

    events.forEach((event: CalendarEventData) => {
      const dateKey = this.generateDateKey(new Date(event.starts)).toString();
      if (!dayEvents[dateKey]) dayEvents[dateKey] = [];
      dayEvents[dateKey].push(event);
    });

    return dayEvents;
  }

  /**
   * Filter calendar events data by current month
   * @param {CalendarEventData[]} data calendar events data
   * @returns {CalendarEventData[]} calendar events within month
   */
  filterEventsByMonth(data: CalendarEventData[] = []): CalendarEventData[] {
    return data.filter((event) => {
      const eventStart = new Date(event.starts);
      return this.startDate && this.endDate ? this.startDate <= eventStart && eventStart < this.endDate
        : eventStart.getMonth() === this.month && eventStart.getFullYear() === this.year;
    });
  }

  /**
   * Render Calendar Events data inside month view
   * @param {boolean} forceRender skip data fetch
   */
  async renderEventsData(forceRender = false): Promise<void> {
    if (!forceRender && typeof this.state.beforeEventsRender === 'function') {
      const startDate = this.startDate || new Date(this.year, this.month, 1);
      const endDate = this.endDate || new Date(this.year, this.month + 1, 0);
      this.eventsData = await this.state.beforeEventsRender(startDate, endDate);
      return;
    }

    this.removeAllEvents();

    if (!this.state.hasRendered || !this.eventsData?.length) return;

    const eventsInRange = this.filterEventsByMonth(this.eventsData);
    const monthEvents = this.#groupEventsByDay(eventsInRange);

    const customCalendarEvent: any = this.querySelector('[slot="customCalendarEvent"]');
    for (const dateKey in monthEvents) {
      if (monthEvents.hasOwnProperty(dateKey)) {
        this.#renderDayEvents(dateKey, monthEvents[dateKey], customCalendarEvent);
      }
    }
  }

  /**
   * Counts number of days for calendar events
   * @param {Date} start start date
   * @param {Date} end end date
   * @returns {number} days
   */
  #countDays(start: Date, end: Date): number {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Renders calendar events within corresponding date's table cell
   * @param {string} dateKey generated date key
   * @param {CalendarEventData[]} events calendar events
   * @param {any} customCalendarEvent custom calendar events
   */
  #renderDayEvents(dateKey: string, events: CalendarEventData[], customCalendarEvent?: any): void {
    if (!this.container) return;

    const eventsContainer = this.container?.querySelector(`.events-container[data-key="${dateKey}"]`);
    const orders = [...(eventsContainer?.childNodes) || []].map((elem: any) => elem.order);
    const baseOrder = orders.length ? Math.max(...orders) + 1 : 0;
    let isOverflowing = false;
    events.forEach((event: CalendarEventData, index: number) => {
      const start = new Date(event.starts);
      const end = new Date(event.ends);
      const days = this.#countDays(start, end) || 1;

      for (let i = 0; i < days; i++) {
        const calendarEvent = this.#newCalendarEvent(customCalendarEvent);
        const eventType = this.eventTypesData?.find((et: CalendarEventTypeData) => et.id === event.type) ?? null;
        const eventOrder = baseOrder + index;
        calendarEvent.eventTypeData = eventType;
        calendarEvent.eventData = event;
        calendarEvent.cssClass = ['is-month-view'];
        calendarEvent.order = eventOrder;

        if (i > 0) {
          start.setDate(start.getDate() + 1);
        }

        const day = start.getDate();
        const year = start.getFullYear();
        const month = start.getMonth();
        calendarEvent.dateKey = `${year}${month}${day}`;
        const dateCell = this.container?.querySelector(`td[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);

        if (dateCell) {
          // multi day events
          if (days > 1) {
            const extraCss = ['all-day'];

            if (i === 0) {
              extraCss.push('calendar-event-start');
            } else if (i === days - 1) {
              extraCss.push('calendar-event-ends');
            } else {
              extraCss.push('calendar-event-continue');
            }

            calendarEvent.cssClass = extraCss;
          }

          const eventYOffset = this.generateYOffset(calendarEvent);
          calendarEvent.setAttribute(attributes.Y_OFFSET, `${eventYOffset}px`);
          // hide overflowing event
          isOverflowing = this.isEventOverflowing(calendarEvent);
          calendarEvent.hidden = isOverflowing;
          dateCell.querySelector('.events-container')?.appendChild(calendarEvent as any);

          const container = dateCell.querySelector('.events-container');
          this.triggerEvent('beforeeventrendered', this, {
            detail:
            {
              elem: this,
              events: this.eventsData,
              event: calendarEvent,
              dateCell: calendarEvent,
              container
            },
            bubbles: true
          });
          container?.appendChild(calendarEvent as any);
          this.triggerEvent('aftereventrendered', this, {
            detail:
            {
              elem: this,
              events: this.eventsData,
              event: calendarEvent,
              dateCell: calendarEvent,
              container
            },
            bubbles: true
          });
        }
      }
    });

    if (isOverflowing && eventsContainer) {
      this.#renderEventsOverflow(eventsContainer, dateKey);
    }
  }

  /**
   * Renders clickable event overflow element
   * Specifies number of calendar events overflowing the container
   * @param {Element} eventsContainer date specific event container elemeent
   * @param {string} dateKey generated date key
   */
  #renderEventsOverflow(eventsContainer: any, dateKey: string): void {
    if (!eventsContainer) return;

    const calendarEvents = [...eventsContainer.childNodes];
    const hiddenEvents = calendarEvents.filter((elem: IdsCalendarEvent) => elem.hidden);
    const year = dateKey.substring(0, 4);
    const month = parseInt(dateKey.substring(4, 6)) + 1;
    const day = dateKey.substring(6);
    const date = `${month}/${day}/${year}`;
    const tmpl = `
      <ids-text data-date="${date}" class="events-overflow" font-size="12">
        ${hiddenEvents.length}+ ${this.localeAPI.translate('More')}
      </ids-text>
    `;

    eventsContainer.insertAdjacentHTML('beforeend', tmpl);
  }

  /**
   * Generates new IdsCalendarEvent
   * @param {IdsCalendarEvent} customCalendarEvent optional custom event to use instead of default
   * @returns {IdsCalendarEvent} calendar event
   */
  #newCalendarEvent(customCalendarEvent?: any): any {
    if (customCalendarEvent?.name === 'MonthViewCalendarEventTemplate') {
      const eventTemplate = customCalendarEvent.assignedNodes()[0];
      if (eventTemplate) {
        this.#isCustom = true;
        return eventTemplate.cloneNode(true);
      }
    }
    return new IdsCalendarEvent();
  }

  /**
   * Selects the Month View's current day from a stringified date
   * @param {string} val string representation of a date
   */
  selectDayFromValue(val: string) {
    let usableValue = val;
    if (this.useRange && this.rangeSettings.separator && this.rangeSettings.end) {
      usableValue = removeDateRange(val, this.rangeSettings.separator);
    }

    const { month, day, year } = getDateValuesFromString(usableValue);
    this.day = day;
    this.month = month;
    this.year = year;

    if (this.useRange) {
      this.selectDay();
      this.#renderRangeSelection();
    } else {
      this.#clearRangeClasses();
      this.selectDay(year, month, day);
    }
  }

  /**
   * Function that fires as the day cell is rendered.
   * @returns {Function} the function to call
   */
  public get onDayRender() {
    return this.state.onDayRender;
  }

  public set onDayRender(func) {
    this.state.onDayRender = func;
  }

  /**
   * Calculates the event Y_OFFSET value to set the event pill top position
   * @param {IdsCalendarEvent} event IdsCalendarEvent
   * @returns {number} yOffset
   */
  generateYOffset(event: IdsCalendarEvent): number {
    return (event.order * 16) + BASE_Y_OFFSET;
  }

  /**
   * Checks if the event pills exceed the MAX_EVENT_COUNT in a day cell
   * @param {IdsCalendarEvent} event IdsCalendarEvent
   * @returns {boolean} isEventOverflowing
   */
  isEventOverflowing(event: IdsCalendarEvent): boolean {
    return event.order > MAX_EVENT_COUNT - 1;
  }
}

export default IdsMonthView;
