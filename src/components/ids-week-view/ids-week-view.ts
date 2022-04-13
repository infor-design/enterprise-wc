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
import IdsCalendarEvent, { ICalendarEvent, ICalendarEventType } from './ids-calendar-event';

interface IDayMapItem {
  key: number;
  elem: HTMLTableCellElement;
}

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
  private dayMap: IDayMapItem[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
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
    this.#renderToolbar();

    // Set the height from the top
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          this.#attachOffsetTop();
        }
      }
    });
    ro.observe(this.container);

    // Respond to parent changing language
    this.offEvent('languagechange.week-view-container');
    this.onEvent('languagechange.week-view-container', this.closest('ids-container'), () => {
      this.#renderToolbar();
      this.#renderWeek();
      this.#attachOffsetTop();
    });

    // Respond to parent changing locale
    this.offEvent('localechange.week-view-container');
    this.onEvent('localechange.week-view-container', this.closest('ids-container'), () => {
      this.#renderWeek();
      this.#attachDatepicker();
    });

    // Handle Calendar Event selections
    this.offEvent('select.calendar-event');
    this.onEvent('select.calendar-event', this, (evt: CustomEvent) => {
      evt.stopPropagation();
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
    let startDate: Date;
    let endDate: Date;

    if (type === 'next') {
      startDate = addDate(this.startDate, diff, 'days');
      endDate = addDate(this.endDate, diff - 1, 'days');
    }

    if (type === 'previous') {
      startDate = subtractDate(this.startDate, diff, 'days');
      endDate = subtractDate(this.endDate, diff + 1, 'days');
    }

    if (type === 'today') {
      startDate = hasIrregularDays ? new Date() : firstDayOfWeekDate(new Date(), this.firstDayOfWeek);
      endDate = addDate(startDate, diff - 1, 'days');
    }

    this.#batchBeforeRender(() => {
      this.startDate = startDate;
      this.endDate = endDate;
    });

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

  #generateDateKey(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();

    return parseInt(`${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`);
  }

  /**
   * Allows execution of multiple operations before rendering week
   * Ex. setting startDate & endDate before triggering #renderWeek
   * @param {Function} fn Function containg batched operations
   */
  #batchBeforeRender(fn: () => void) {
    this.state.wait = true;
    fn();
    this.state.wait = false;
    this.#renderWeek();
  }

  /**
   * Add week HTML to shadow including day/weekday header, hour rows, event cells
   */
  #renderWeek() {
    if (!this.locale || this.state.wait) {
      return;
    }

    let canRender = true;
    const vetoFn = (veto: boolean) => { canRender = !!veto; };

    this.triggerEvent('beforeWeekRendered', this, {
      detail: {
        elem: this,
        response: vetoFn
      }
    });

    if (!canRender) return;

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
    this.dayMap = [];

    const daysTemplate = Array.from({ length: diff }, (_, index) => {
      const date = this.startDate.setDate(this.startDate.getDate() + index);
      const dayNumeric = this.locale.formatDate(date, { day: 'numeric' });
      const weekday = this.locale.formatDate(date, { weekday: 'short' });
      const isToday = isTodaysDate(new Date(date));
      const dataKey = this.#generateDateKey(new Date(date));

      return `
        <th data-key="${dataKey}">
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

    const startHour = this.startHour;
    const hoursTemplate = Array.from({ length: hoursDiff }).map((_, index) => {
      const hour = startHour + index;
      const hoursHTML = `
      <tr class="week-view-hour-row" data-hour="${hour}">
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
      </tr>`;

      return hoursHTML;
    }).join('');

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
    this.triggerEvent('afterWeekRendered', this, {
      detail: { elem: this }
    });

    // Create day map
    this.container.querySelectorAll('th').forEach((elem: HTMLTableCellElement) => {
      const dateKey = elem.getAttribute('data-key');
      if (dateKey) {
        const key = parseInt(dateKey);
        this.dayMap.push({ key, elem });
      }
    });

    this.#renderTimeline();
    this.#renderAllEvents();
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
   * Removes IdsCalendarEvent components from week view
   */
  #removeAllEvents() {
    const events = this.container.querySelectorAll('ids-calendar-event');
    events.forEach((event: IdsCalendarEvent) => event.remove());
  }

  /**
   * Gets number of hours of Date (ex. 3:15am => 3.25)
   * @param {Date} date Date object
   * @param {boolean} rounded If true, rounds down to nearest half hour
   * @returns {number} number of hours
   */
  #getDateHours(date: Date, rounded: boolean): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (rounded) {
      return hours + (minutes >= 30 ? 0.5 : 0);
    }

    return hours + (minutes / 60) + (seconds / 600);
  }

  /**
   * Renders all events currently set or returned in beforeEventsRender function
   */
  async #renderAllEvents() {
    if (typeof this.state.beforeEventsRender === 'function') {
      this.state.events = await this.state.beforeEventsRender(this.startDate, this.endDate);
    }

    if (!this.state.hasRendered || !this.state.events?.length) return;

    this.#removeAllEvents();

    const weekStart = new Date(this.startDate).getTime();
    const weekEnd = new Date(this.endDate).getTime();

    this.state.events.forEach((event: ICalendarEvent) => {
      const eventStart = new Date(event.starts).getTime();

      if (weekStart <= eventStart && eventStart < weekEnd) {
        this.#renderEvent(event);
      }
    });
  }

  /**
   * Finds week view table cell element for intraday event
   * @param {HTMLTableCellElement} dayColumn th element for day column
   * @param {ICalendarEvent} event event data
   * @returns {HTMLTableCellElement | null} td element in week view
   */
  #findHourContainer(dayColumn: HTMLTableCellElement, event: ICalendarEvent): HTMLTableCellElement | null {
    const hourContainers = this.container.querySelectorAll(`td:nth-child(${dayColumn.cellIndex + 1})`);
    const eventStartHour = this.#getDateHours(new Date(event.starts), true);

    for (let i = 0; i < hourContainers.length; i++) {
      const hour = parseFloat(hourContainers[i].parentElement?.getAttribute('data-hour'));
      if (hour === eventStartHour) return hourContainers[i];
    }

    return null;
  }

  /**
   * Creates IdsCalendarEvent and assigns event data and event type
   * @param {ICalendarEvent} eventData event data for calendar event
   * @param {Array<string>} cssClass optional css classes for calendar event
   * @returns {IdsCalendarEvent} IdsCalendarEvent component
   */
  #createCalendarEvent(eventData: ICalendarEvent, cssClass?: string[]): IdsCalendarEvent {
    const calendarEvent = new IdsCalendarEvent();
    const eventType = this.state.eventTypes?.find((et: ICalendarEventType) => et.id === eventData.type);

    calendarEvent.eventType = eventType;
    calendarEvent.event = eventData;

    if (cssClass?.length) {
      calendarEvent.cssClass = cssClass;

      // Prevent keyboard navigation for multi day events
      if (cssClass?.indexOf('calendar-event-continue') !== -1 || cssClass?.indexOf('calendar-event-ends') !== -1) {
        calendarEvent.container.setAttribute('tabindex', -1);
      }
    }

    return calendarEvent;
  }

  /**
   * Creates IdsCalendarEvent and finds its appropriate container
   * @param {ICalendarEvent} eventData Data to create calendar event
   */
  #renderEvent(eventData: ICalendarEvent) {
    const startKey = this.#generateDateKey(new Date(eventData.starts));
    const endKey = this.#generateDateKey(new Date(eventData.ends));
    const days = this.dayMap.filter((day) => day.key >= startKey && day.key <= endKey);
    const isAllDay = stringToBool(eventData.isAllDay);
    let calendarEvent: IdsCalendarEvent | undefined;
    let container: HTMLTableCellElement | null;

    // Event is intraday
    if (days.length === 1 && !isAllDay) {
      calendarEvent = this.#createCalendarEvent(eventData);
      container = this.#findHourContainer(days[0].elem, eventData);

      if (container) this.#renderIntradayEvent(container, calendarEvent);
    }

    // Event lasts all day
    if (days.length === 1 && isAllDay) {
      calendarEvent = this.#createCalendarEvent(eventData, ['all-day']);
      container = days[0].elem.querySelector('.week-view-all-day-wrapper');

      if (container) this.#renderAllDayEvent(container, calendarEvent);
    }

    // Event lasts multiple days
    if (days.length > 1) {
      for (let i = 0; i < days.length; i++) {
        let cssClass = i === 0 ? 'calendar-event-start' : 'calendar-event-continue';

        // last day of multi day event
        if (i === days.length - 1) cssClass = 'calendar-event-ends';

        calendarEvent = this.#createCalendarEvent(eventData, ['all-day', cssClass]);
        container = days[i].elem.querySelector('.week-view-all-day-wrapper');

        if (container) this.#renderAllDayEvent(container, calendarEvent);
      }
    }
  }

  /**
   * Appends IdsCalendarEvent to respective hour container
   * Adjust styles to reflect event duration and accomodate multiple events
   * @param {HTMLElement} container HTMLElement containing calendar event
   * @param {IdsCalendarEvent} calendarEvent IdsCalendarEvent component
   */
  #renderIntradayEvent(container: HTMLElement, calendarEvent: IdsCalendarEvent) {
    const containerHour = parseFloat(container.parentElement?.getAttribute('data-hour') || '');
    const eventStartHour = this.#getDateHours(calendarEvent.startDate, false);
    const containerWrapper = container.querySelector('.week-view-cell-wrapper');

    // Calculate and override event height
    const minHeightDuration = 0.25;
    const maxHeighDuration = this.endHour + 1 - eventStartHour;
    let eventDuration = calendarEvent.duration;
    eventDuration = Math.max(minHeightDuration, eventDuration);
    eventDuration = Math.min(maxHeighDuration, eventDuration);
    calendarEvent.height = `${(eventDuration * 50) + (eventDuration / 0.5) - 1}px`;

    // When event is less than 30 minutes
    if (eventDuration < 0.5) {
      calendarEvent.cssClass = ['reduced-padding'];
    }

    // When event duration fits within week view hour params
    if (eventDuration < 1.5) {
      calendarEvent.cssClass = ['is-ellipsis'];
    }

    if (eventDuration >= 2) {
      calendarEvent.displayTime = true;
      calendarEvent.overflow = 'normal';
    }

    // When event duration exceeds week view end hour
    if (eventStartHour + eventDuration > this.endHour) {
      calendarEvent.cssClass = ['is-cutoff'];
    }

    // Set Y offset
    if (eventStartHour > containerHour) {
      const unit = 0.016666666666666784; // unit for one minute
      const extra = eventStartHour - containerHour; // extract extra minutes
      const height = container.parentElement?.offsetHeight || 26; // container height

      calendarEvent.yOffset = `${(extra / unit) * (height / 30)}px`; // 30-minutes each row
    }

    // Set X offset
    const containerEvents = container.querySelectorAll<any>('ids-calendar-event');
    const eventCount = containerEvents.length;
    if (eventCount > 0) {
      const width = (100 / (eventCount + 1));

      calendarEvent.width = `${width}%`;
      calendarEvent.xOffset = `${width * eventCount}%`;
      containerEvents.forEach((elem, i) => {
        elem.width = `${width}%`;
        elem.xOffset = `${width * i}%`;
      });
    }

    containerWrapper?.appendChild(<any>calendarEvent);
  }

  /**
   * Appends IdsCalendarEvent to all day section of week view
   * Adjust styles to accomodate multiple calendar events
   * @param {HTMLElement} container HTMLElement containing calendar event
   * @param {IdsCalendarEvent} calendarEvent IdsCalendarEvent component
   */
  #renderAllDayEvent(container: HTMLElement, calendarEvent: IdsCalendarEvent) {
    const containerEvents = container.querySelectorAll('ids-calendar-event');
    const eventCount = containerEvents.length;

    // align events vertically
    if (eventCount >= 1) {
      calendarEvent.yOffset = `${22 * eventCount}px`;
    }

    // set container height to fit all events
    if (eventCount >= 2) {
      const nodes = this.container.querySelectorAll('.week-view-all-day-wrapper');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].style.height = `${44 + ((eventCount - 1) * 23)}px`;
      }
    }

    container.appendChild(<any>calendarEvent);
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

  /**
   * Set events to display on week view
   * @param {ICalendarEvent[]} events array of events
   */
  set events(events: ICalendarEvent[]) {
    this.state.events = events;
    if (!this.state.beforeEventsRender) this.#renderAllEvents();
  }

  /**
   * Gets calendar events
   * @returns {ICalendarEvent[]} array of events
   */
  get events(): ICalendarEvent[] {
    return this.state.events;
  }

  /**
   * Set event types for week view
   * @param {ICalendarEventType[]} eventTypes array of event types
   */
  set eventTypes(eventTypes: ICalendarEventType[]) {
    this.state.eventTypes = eventTypes;
    if (!this.state.beforeEventsRender) this.#renderAllEvents();
  }

  /**
   * Gets event types of week view
   * @returns {ICalendarEventType[]} array of event types
   */
  get eventTypes(): ICalendarEventType[] {
    return this.state.eventTypes;
  }

  /**
   * Allows setting async function to fetch calendar event data
   * Passes startDate and endDate as callback arguments
   * @param {Function} fn Async function
   */
  set beforeEventsRender(fn: (startDate: Date, endDate: Date) => Promise<ICalendarEvent[]>) {
    this.state.beforeEventsRender = fn;
  }
}
