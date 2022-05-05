import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-week-view-base';

import {
  daysDiff,
  addDate,
  subtractDate,
  firstDayOfWeekDate,
  isTodaysDate,
  isValidDate,
  lastDayOfWeekDate
} from '../../utils/ids-date-utils/ids-date-utils';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import '../ids-date-picker/ids-date-picker';
import '../ids-button/ids-button';
import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-toolbar/ids-toolbar';
import renderLoop from '../ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../ids-render-loop/ids-render-loop-item';

import styles from './ids-week-view.scss';

/**
 * IDS Week View Component
 * @type {IdsWeekView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-week-view')
@scss(styles)
export default class IdsWeekView extends Base {
  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.#renderToolbar();
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    this.timer?.destroy();
    this.timer = null;
    this.state = null;
    this.ro?.unobserve(this.container);
    super.disconnectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.END_DATE,
      attributes.END_HOUR,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.SHOW_TIMELINE,
      attributes.SHOW_TODAY,
      attributes.START_DATE,
      attributes.START_HOUR,
      attributes.TIMELINE_INTERVAL,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-week-view"></div>`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   * @private
   */
  #attachEventHandlers() {
    // Set the height from the top
    this.ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          this.#attachOffsetTop();
        }
      }
    });
    this.ro.observe(this.container);

    // Respond to parent changing language
    this.offEvent('languagechange.week-view-container');
    this.onEvent('languagechange.week-view-container', this.closest('ids-container'), () => {
      this.#renderWeek();
      this.#attachOffsetTop();
    });

    // Respond to parent changing locale
    this.offEvent('localechange.week-view-container');
    this.onEvent('localechange.week-view-container', this.closest('ids-container'), () => {
      this.#renderWeek();
      this.#attachDatepicker();
    });

    return this;
  }

  /**
   * Add toolbar HTML to shadow
   */
  #renderToolbar() {
    if (!this.locale) {
      return;
    }

    const toolbarTemplate = `<ids-toolbar class="week-view-header" tabbable="true">
      <ids-toolbar-section type="buttonset">
        <ids-button class="week-view-btn-previous">
          <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-left"></ids-icon>
        </ids-button>
        <ids-button class="week-view-btn-next">
          <ids-text audible="true" translate-text="true">NextMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-right"></ids-icon>
        </ids-button>
        <ids-date-picker
          is-calendar-toolbar="true"
        ></ids-date-picker>
        ${this.showToday ? `
          <ids-button css-class="no-padding" class="week-view-btn-today">
            <ids-text
              class="week-view-today-text"
              font-size="16"
              translate-text="true"
              font-weight="bold"
            >Today</ids-text>
          </ids-button>` : ''}
      </ids-toolbar-section>
    </ids-toolbar>`;

    // Clear/add HTML
    this.container.querySelector('ids-toolbar')?.remove();
    this.container.insertAdjacentHTML('afterbegin', toolbarTemplate);

    // Toolbar events
    this.#attachToolbarEvents();

    this.#attachDatepicker();
  }

  /**
   * Add next/previous/today click events when toolbar attached to shadow
   */
  #attachToolbarEvents() {
    this.offEvent('click.week-view-previous');
    this.onEvent('click.week-view-previous', this.container.querySelector('.week-view-btn-previous'), () => {
      this.#changeDate('previous');
    });

    this.offEvent('click.week-view-next');
    this.onEvent('click.week-view-next', this.container.querySelector('.week-view-btn-next'), () => {
      this.#changeDate('next');
    });

    if (this.showToday) {
      this.offEvent('click.week-view-today');
      this.onEvent('click.week-view-today', this.container.querySelector('.week-view-btn-today'), () => {
        this.#changeDate('today');
      });
    } else {
      this.offEvent('click.week-view-today');
    }

    this.offEvent('dayselected.week-view-datepicker');
    this.onEvent('dayselected.week-view-datepicker', this.container.querySelector('ids-date-picker'), (e: CustomEvent) => {
      this.#datepickerChangeDate(e.detail.date);
    });
  }

  /**
   * Helper to format startDate/endDate to month range
   * @returns {string} locale formatted month range
   */
  #formatMonthRange() {
    if (!this.locale) return '';

    const startDate = this.startDate;
    const endDate = subtractDate(this.endDate, 1, 'days');
    const startMonth = this.locale.formatDate(startDate, { month: 'long' });
    const endMonth = this.locale.formatDate(endDate, { month: 'long' });
    const startYear = this.locale.formatDate(startDate, { year: 'numeric' });
    const endYear = this.locale.formatDate(endDate, { year: 'numeric' });

    if (endYear !== startYear) {
      return `${this.locale.formatDate(startDate, {
        month: 'short',
        year: 'numeric',
      })} - ${this.locale.formatDate(endDate, {
        month: 'short',
        year: 'numeric',
      })}`;
    }

    if (endMonth !== startMonth) {
      return `${this.locale.formatDate(startDate, { month: 'short' })} - ${endMonth} ${startYear}`;
    }

    return this.locale.formatDate(startDate, { month: 'long', year: 'numeric' });
  }

  /**
   * Datepicker changing text
   */
  #attachDatepicker() {
    const text = this.#formatMonthRange();
    const datepicker = this.container.querySelector('ids-date-picker');

    if (datepicker) {
      datepicker.value = text;
      datepicker.year = this.startDate.getFullYear();
      datepicker.month = this.startDate.getMonth();
      datepicker.day = this.startDate.getDate();
      datepicker.showToday = this.showToday;
      datepicker.firstDayOfWeek = this.firstDayOfWeek;
    }
  }

  /**
   * Change startDate/endDate by event type
   * @param {'next'|'previous'|'today'} type of event to be called
   */
  #changeDate(type: 'next' | 'previous' | 'today') {
    const diff = daysDiff(this.startDate, this.endDate);
    const hasIrregularDays = diff !== 7;

    if (type === 'next') {
      this.startDate = addDate(this.startDate, diff, 'days');
      this.endDate = addDate(this.endDate, diff - 1, 'days');
    }

    if (type === 'previous') {
      this.startDate = subtractDate(this.startDate, diff, 'days');
      this.endDate = subtractDate(this.endDate, diff + 1, 'days');
    }

    if (type === 'today') {
      this.startDate = hasIrregularDays ? new Date() : firstDayOfWeekDate(new Date(), this.firstDayOfWeek);
      this.endDate = addDate(this.startDate, diff - 1, 'days');
    }

    this.#attachDatepicker();
  }

  /**
   * When datepicker changing date
   * @param {Date} date datepicker dayselected event date
   */
  #datepickerChangeDate(date: Date) {
    const diff = daysDiff(this.startDate, this.endDate);
    const hasIrregularDays = diff !== 7;

    this.startDate = hasIrregularDays ? date : firstDayOfWeekDate(date, this.firstDayOfWeek);
    this.endDate = addDate(this.startDate, diff - 1, 'days');
  }

  /**
   * Add week HTML to shadow including day/weekday header, hour rows, event cells
   */
  #renderWeek() {
    if (!this.locale) {
      return;
    }

    const diff = daysDiff(this.startDate, this.endDate);
    const hoursDiff = this.endHour - this.startHour + 1;
    const isDayView = diff === 1 || diff === 0;
    // Get locale loaded calendars and dayOfWeek calendar setting
    const calendars = this.locale.locale.options.calendars;
    const dayOfWeekSetting = (calendars)[0]?.dateFormat?.dayOfWeek;
    // Determinate day/weekday order based on calendar settings (d EEE or EEE)
    const emphasis: boolean = dayOfWeekSetting && dayOfWeekSetting.split(' ')[0] === 'EEE';
    // Helper to get day/weekday font size in the template
    const getTextFontSize = (isEmphasis: boolean) => {
      if (!isEmphasis) return 16;

      return isDayView ? 32 : 20;
    };

    const daysTemplate = Array.from({ length: diff }, (_, index) => {
      const date = this.startDate.setDate(this.startDate.getDate() + index);
      const dayNumeric = this.locale.formatDate(date, { day: 'numeric' });
      const weekday = this.locale.formatDate(date, { weekday: 'short' });
      const isToday = isTodaysDate(new Date(date));

      return `
        <th>
          <div class="week-view-header-wrapper${isToday ? ' is-today' : ''}${isDayView ? ' is-day-view' : ''}">
            <ids-text
              class="week-view-header-day-of-week${emphasis ? '' : ' is-emphasis'}"
              font-size="${getTextFontSize(!emphasis)}"
              ${isToday ? 'font-weight="bold"' : ''}
            >${emphasis ? weekday : dayNumeric}</ids-text>
            <ids-text
              class="week-view-header-day-of-week${emphasis ? ' is-emphasis' : ''}"
              font-size="${getTextFontSize(emphasis)}"
              ${isToday ? 'font-weight="bold"' : ''}
            >${emphasis ? dayNumeric : weekday}</ids-text>
          </div>
          <div class="week-view-all-day-wrapper"></div>
        </th>
      `;
    }).join('');

    const cellTemplate = Array.from({ length: diff }).map(() => `
      <td>
        <div class="week-view-cell-wrapper"></div>
      </td>
    `).join('');

    const hoursTemplate = Array.from({ length: hoursDiff }).map((_, index) => `
      <tr class="week-view-hour-row">
        <td>
          <div class="week-view-cell-wrapper">
            <ids-text font-size="12">${calendars ? this.locale.formatHour(this.startHour + index) : ''}</ids-text>
          </div>
        </td>
        ${cellTemplate}
      </tr>
      <tr class="week-view-half-hour-row">
        <td>
          <div class="week-view-cell-wrapper"></div>
        </td>
        ${cellTemplate}
      </tr>
    `).join('');

    const weekTemplate = `<div class="week-view-container">
      <table class="week-view-table">
        <thead class="week-view-table-header">
          <tr>
            <th>
              <div class="week-view-header-wrapper${isDayView ? ' is-day-view' : ''}">
                <ids-text translate-text="true" audible="true">Hour</ids-text>
              </div>
              <div class="week-view-all-day-wrapper">
                <ids-text font-size="12" translate-text="true">AllDay</ids-text>
              </div>
            </th>
            ${daysTemplate}
          </tr>
        </thead>
        <tbody>
          ${hoursTemplate}
        </tbody>
      </table>
    </div>`;

    // Clear/add HTML
    this.container.querySelector('.week-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', weekTemplate);
    this.state.hasRendered = true;
    this.#renderTimeline();
  }

  /**
   * Add/remove timeline HTML to hour row
   * Update timeline position every 30 seconds
   */
  #renderTimeline() {
    // Clear before rerender
    this.container.querySelectorAll('.week-view-time-marker')
      .forEach((item: HTMLElement) => item.remove());

    if (this.timer) this.timer.destroy(true);

    if (!this.showTimeline || !this.state.hasRendered) {
      return;
    }

    // Add timeline element
    this.container.querySelectorAll('.week-view-hour-row:nth-child(1) td')
      .forEach((item: HTMLElement) => item.insertAdjacentHTML(
        'afterbegin',
        '<div class="week-view-time-marker"></div>'
      ));

    const hoursDiff = this.endHour - this.startHour + 1;
    const hourRowElement = this.container.querySelector('.week-view-hour-row');
    const timelineInterval = this.timelineInterval;

    // Timeline position based on current hour and startHour/endHour parameters
    const setTimelinePosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const diff = hours - this.startHour + (mins / 60);
      const diffInMilliseconds = now.getTime() - this.startDate.getTime();
      // 52 is the size of one whole hour (25 + two borders)
      const position = diff > 0 && diff <= hoursDiff ? diff * 52 : 0;

      hourRowElement.style = `--timeline-shift: ${position}px`;
      // For testing purposes only
      hourRowElement.dataset.diffInMilliseconds = diffInMilliseconds;
    };

    setTimelinePosition();

    // Update timeline top shift (default is 30 seconds)
    this.timer?.destroy();
    this.timer = new IdsRenderLoopItem({
      id: 'week-view-timer',
      updateDuration: timelineInterval,
      updateCallback() {
        setTimelinePosition();
      }
    });

    renderLoop.register(this.timer);
  }

  /**
   * Add CSS variable of the container offset top
   * to be used in CSS to fit the component to the viewport height
   */
  #attachOffsetTop() {
    const offsetTop = this.container.offsetTop;
    this.container.style = `--offset-top: ${offsetTop}px`;
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the today button should be shown
   * @param {string|boolean} val showToday param value
   */
  set showToday(val: string | boolean) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_TODAY, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_TODAY);
    }

    this.#renderWeek();
    this.#attachDatepicker();
  }

  /**
   * start-date attribute
   * @returns {Date} startDate date parsed from attribute value
   */
  get startDate(): Date {
    const attrVal = this.getAttribute(attributes.START_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && isValidDate(attrDate)) {
      return attrDate;
    }

    // If no start-date attribute is set or not valid date
    // set startDate as first day of the week from current date
    return firstDayOfWeekDate(new Date(), this.firstDayOfWeek);
  }

  /**
   * Set start of the week to show
   * @param {string|Date} val startDate param value
   */
  set startDate(val: string | Date) {
    if (val) {
      this.setAttribute(attributes.START_DATE, val);
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    this.#renderWeek();
    this.#attachDatepicker();
  }

  /**
   * end-date attribute
   * @returns {Date} endDate date parsed from attribute value
   */
  get endDate(): Date {
    const attrVal = this.getAttribute(attributes.END_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && isValidDate(attrDate)) {
      // Adding one day to include end date to the range
      return addDate(attrDate, 1, 'days');
    }

    // If no end-date attribute is set or not valid date
    // set endDate as last day of the week from current date
    return lastDayOfWeekDate(new Date(), this.firstDayOfWeek);
  }

  /**
   * Set end of the week to show
   * @param {string|Date} val endDate param value
   */
  set endDate(val: string | Date) {
    if (val) {
      this.setAttribute(attributes.END_DATE, val);
    } else {
      this.removeAttribute(attributes.END_DATE);
    }

    this.#renderWeek();
    this.#attachDatepicker();
  }

  /**
   * fist-day-of-week attribute
   * @returns {number} firstDayOfWeek param converted to number from attribute value with range (0-6)
   */
  get firstDayOfWeek(): number {
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
   * @param {string|number} val firstDayOfWeek param value
   */
  set firstDayOfWeek(val: string | number) {
    const numberVal = typeof val === 'number' ? val : stringToNumber(val);

    if (!Number.isNaN(numberVal)) {
      this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    } else {
      this.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
    }

    this.#renderWeek();
    this.#attachDatepicker();
  }

  /**
   * start-hour attribute
   * @returns {number} startHour param converted to number from attribute value with range (0-24)
   */
  get startHour(): number {
    const attrVal = this.getAttribute(attributes.START_HOUR);
    const numberVal = stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 24) {
      return numberVal;
    }

    // Default value
    return 7;
  }

  /**
   * Set start hour of the day (0-24)
   * @param {string|number} val startHour param value
   */
  set startHour(val: string | number) {
    // Allow 0 to be set
    if (val !== null) {
      this.setAttribute(attributes.START_HOUR, val);
    } else {
      this.removeAttribute(attributes.START_HOUR);
    }

    this.#renderWeek();
    this.#renderTimeline();
  }

  /**
   * end-hour attribute
   * @returns {number} endHour param converted to number from attribute value with range (0-24)
   */
  get endHour(): number {
    const attrVal = this.getAttribute(attributes.END_HOUR);
    const numberVal = stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 24) {
      return numberVal;
    }

    // Default value
    return 19;
  }

  /**
   * Set end hour of the day (0-24)
   * @param {string|number} val endHour param value
   */
  set endHour(val: string | number) {
    // Allow 0 to be set
    if (val !== null) {
      this.setAttribute(attributes.END_HOUR, val);
    } else {
      this.removeAttribute(attributes.END_HOUR);
    }

    this.#renderWeek();
  }

  /**
   * show-timeline attribute
   * @returns {boolean} showTimeline param converted to boolean from attribute value
   */
  get showTimeline(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_TIMELINE);

    if (attrVal) {
      return stringToBool(attrVal);
    }

    // Default value
    return true;
  }

  /**
   * Set whether or not to show a bar across the current time
   * @param {string|boolean} val showTimeline param value
   */
  set showTimeline(val: string | boolean) {
    const boolVal = stringToBool(val);
    this.setAttribute(attributes.SHOW_TIMELINE, boolVal);

    this.#renderTimeline();
  }

  /**
   * timeline-interval attribute value in milliseconds
   * @returns {number} timelineInterval param converted to number
   */
  get timelineInterval(): number {
    const attrVal = this.getAttribute(attributes.TIMELINE_INTERVAL);
    const numberVal = stringToNumber(attrVal);

    if (numberVal > 0) {
      return numberVal;
    }

    // Default value
    return 30000;
  }

  /**
   * Set how often timeline should update it's position (in milliseconds)
   * @param {number|string} val timelineInterval param value
   */
  set timelineInterval(val: number | string) {
    if (val) {
      this.setAttribute(attributes.TIMELINE_INTERVAL, val);
    } else {
      this.removeAttribute(attributes.TIMELINE_INTERVAL);
    }

    this.#renderTimeline();
  }
}
