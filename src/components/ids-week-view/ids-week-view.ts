import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';
import IdsCalendarEventsMixin from '../../mixins/ids-calendar-events-mixin/ids-calendar-events-mixin';
import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';

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

import styles from './ids-week-view.scss';
import IdsCalendarEvent, { CalendarEventData, CalendarEventTypeData } from '../ids-calendar/ids-calendar-event';
import { clearAnimationInterval, FrameRequestLoopHandler, requestAnimationInterval } from '../../utils/ids-timer-utils/ids-timer-utils';

interface DayMapData {
  key: number;
  elem: HTMLTableCellElement;
}

const Base = IdsDateAttributeMixin(
  IdsCalendarEventsMixin(
    IdsLocaleMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Week View Component
 * @type {IdsWeekView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsCalendarEventsMixin
 */
@customElement('ids-week-view')
@scss(styles)
export default class IdsWeekView extends Base {
  dayMap: DayMapData[] = [];

  vetoableEventTypes = ['beforeweekrendered'];

  ro: ResizeObserver | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#renderWeek();
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    (this.timer as any)?.destroy();
    this.timer = null;
    this.state = {};
    this.ro?.unobserve(this.container as HTMLElement);
    this.ro = null;
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
      attributes.TIMELINE_INTERVAL
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
      requestAnimationFrame(() => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            this.#attachOffsetTop();
          }
        }
      });
    });
    this.ro.observe(this.container as HTMLElement);
    return this;
  }

  /** Respond to locale changes */
  onLocaleChange = () => {
    this.#renderWeek();
  };

  /** Respond to language changes */
  onLanguageChange = () => {
    this.#renderWeek();
    this.#attachOffsetTop();
  };

  /**
   * Change startDate/endDate by event type
   * @param {'next'|'previous'|'today'} type of event to be called
   */
  changeDate(type: 'next' | 'previous' | 'today') {
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

    this.state.activeDate = this.startDate;
    this.triggerDateChange(this.startDate, type);
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
    if (!this.locale || this.state.wait || !this.container) {
      return;
    }

    const canRender = this.triggerVetoableEvent('beforeweekrendered');

    if (!canRender) return;

    const diff = daysDiff(this.startDate, this.endDate);
    const hoursDiff = this.endHour - this.startHour + 1;
    const isDayView = diff === 1 || diff === 0;
    // Get locale loaded calendars and dayOfWeek calendar setting
    const calendars = this.localeAPI.locale.options.calendars;
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
      const dayNumeric = this.localeAPI.formatDate(date, { day: 'numeric' });
      const weekday = this.localeAPI.formatDate(date, { weekday: 'short' });
      const isToday = isTodaysDate(new Date(date));
      const dataKey = this.generateDateKey(new Date(date));

      return `
        <th data-key="${dataKey}">
          <div class="week-view-header-wrapper${isToday ? ' is-today' : ''}${isDayView ? ' is-day-view' : ''}">
            <ids-text
              class="week-view-header-day-of-week${emphasis ? '' : ' is-emphasis'}"
              font-size="${getTextFontSize(!emphasis)}"
              ${isToday ? 'font-weight="semi-bold"' : ''}
            >${emphasis ? weekday : dayNumeric}</ids-text>
            <ids-text
              class="week-view-header-day-of-week${emphasis ? ' is-emphasis' : ''}"
              font-size="${getTextFontSize(emphasis)}"
              ${isToday ? 'font-weight="semi-bold"' : ''}
            >${emphasis ? dayNumeric : weekday}</ids-text>
          </div>
          <div class="week-view-all-day-wrapper"></div>
        </th>
      `;
    }).join('');

    const cellTemplate = Array.from({ length: diff }).map((_, index) => {
      const cellDate = this.startDate;
      cellDate.setDate(cellDate.getDate() + index);

      return `<td data-date="${cellDate.getDate()}">
        <div class="week-view-cell-wrapper"></div>
      </td>`;
    }).join('');

    const startHour = this.startHour;
    const hoursTemplate = Array.from({ length: hoursDiff }).map((_, index) => {
      const hour = startHour + index;
      const hoursHTML = `
      <tr class="week-view-hour-row" data-hour="${hour}">
        <td>
          <div class="week-view-cell-wrapper">
            <ids-text font-size="12">${calendars ? this.localeAPI.formatHour(this.startHour + index) : ''}</ids-text>
          </div>
        </td>
        ${cellTemplate}
      </tr>
      <tr class="week-view-half-hour-row" data-hour="${hour}.5">
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
    this.triggerEvent('afterweekrendered', this);

    // Create day map
    this.container.querySelectorAll('th').forEach((elem: HTMLTableCellElement) => {
      const dateKey = elem.getAttribute('data-key');
      if (dateKey) {
        const key = parseInt(dateKey);
        this.dayMap.push({ key, elem });
      }
    });

    this.#renderTimeline();
    this.renderEventsData();
  }

  /**
   * Add/remove timeline HTML to hour row
   * Update timeline position every 30 seconds
   */
  #renderTimeline() {
    // Clear before rerender
    this.container?.querySelectorAll('.week-view-time-marker').forEach((item: Element) => item.remove());

    if (this.timer) (this.timer as any)?.destroy(true);

    if (!this.showTimeline || !this.state.hasRendered) {
      return;
    }

    // Add timeline element
    this.container?.querySelectorAll<HTMLElement>('.week-view-hour-row:nth-child(1) td')
      .forEach((item: HTMLElement) => item.insertAdjacentHTML(
        'afterbegin',
        '<div class="week-view-time-marker"></div>'
      ));

    const hoursDiff = this.endHour - this.startHour + 1;
    const hourRowElement = this.container?.querySelector<HTMLElement>('.week-view-hour-row');
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

      if (hourRowElement) {
        hourRowElement.style.setProperty('--timeline-shift', `${position}px`);
        // For testing purposes only
        hourRowElement.dataset.diffInMilliseconds = diffInMilliseconds.toString();
      }
    };

    setTimelinePosition();

    // Update timeline top shift (default is 30 seconds)
    this.#clearInterval();
    this.#timelinePositionInterval = requestAnimationInterval(() => setTimelinePosition(), timelineInterval);
  }

  /**
   * Removes a previously-set interval that controls timeline position
   */
  #clearInterval() {
    if (this.#timelinePositionInterval) clearAnimationInterval(this.#timelinePositionInterval);
  }

  /**
   * Stored interval used to control timeline position
   */
  #timelinePositionInterval?: FrameRequestLoopHandler;

  /**
   * Add CSS variable of the container offset top
   * to be used in CSS to fit the component to the viewport height
   */
  #attachOffsetTop() {
    const offsetTop = this.container?.offsetTop;
    this.container?.style.setProperty(`--offset-top`, `${offsetTop}px`);
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
   * @param {boolean} forceRender if true, skips beforeEventRender
   */
  async renderEventsData(forceRender = false) {
    if (!forceRender && typeof this.state.beforeEventsRender === 'function') {
      this.eventsData = await this.state.beforeEventsRender(this.startDate, this.endDate);
      return;
    }

    this.removeAllEvents();

    if (!this.state.hasRendered || !this.eventsData?.length) return;

    this.eventsData.forEach((event: CalendarEventData) => {
      const eventStart = new Date(event.starts);
      const eventEnd = new Date(event.ends);

      if (this.startDate <= eventEnd && eventStart < this.endDate) {
        this.#renderEvent(event);
      }
    });
  }

  /**
   * Finds week view table cell element for intraday event
   * @param {CalendarEventData} eventData event data
   * @returns {HTMLTableCellElement | null} td element in week view
   */
  #findHourContainer(eventData: CalendarEventData): HTMLTableCellElement | null {
    const eventStart = new Date(eventData.starts);
    const startDate = eventStart.getDate();
    const startHour = this.#getDateHours(eventStart, true);

    return this.container?.querySelector(`[data-hour="${startHour}"] [data-date="${startDate}"]`) || null;
  }

  /**
   * Creates IdsCalendarEvent and assigns event data and event type
   * @param {CalendarEventData} eventData event data for calendar event
   * @param {Array<string>} cssClass optional css classes for calendar event
   * @returns {IdsCalendarEvent} IdsCalendarEvent component
   */
  #createCalendarEvent(eventData: CalendarEventData, cssClass?: string[]): IdsCalendarEvent {
    const calendarEvent = new IdsCalendarEvent();
    const eventType = this.eventTypesData?.find((et: CalendarEventTypeData) => et.id === eventData.type);

    calendarEvent.eventTypeData = eventType;
    calendarEvent.eventData = eventData;

    if (cssClass?.length) {
      calendarEvent.cssClass = cssClass;
    }

    return calendarEvent;
  }

  /**
   * Creates IdsCalendarEvent and finds its appropriate container
   * @param {CalendarEventData} eventData Data to create calendar event
   */
  #renderEvent(eventData: CalendarEventData) {
    let calendarEvent: IdsCalendarEvent | undefined;
    let container: HTMLTableCellElement | null;

    // get day containers
    const startDate = new Date(eventData.starts);
    const endDate = new Date(eventData.ends);
    const startKey = this.generateDateKey(startDate);
    const endKey = this.generateDateKey(endDate);
    const days = this.dayMap.filter((day) => day.key >= startKey && day.key <= endKey);

    // get event hour count
    const isAllDay = stringToBool(eventData.isAllDay);

    // Event is intraday
    if (days.length === 1 && !isAllDay) {
      calendarEvent = this.#createCalendarEvent(eventData);
      container = this.#findHourContainer(eventData);

      if (container) this.#appendIntradayEvent(container, calendarEvent);
      return;
    }

    // Event lasts one day
    if (days.length === 1 && isAllDay) {
      calendarEvent = this.#createCalendarEvent(eventData, ['all-day']);
      container = days[0].elem.querySelector('.week-view-all-day-wrapper');

      if (container) this.#appendAllDayEvent(container, calendarEvent);
      return;
    }

    // Event lasts multiple days
    if (days.length > 1 && isAllDay) {
      for (let i = 0; i < days.length; i++) {
        let cssClass = i === 0 ? 'calendar-event-start' : 'calendar-event-continue';

        // last day of multi day event
        if (i === days.length - 1) cssClass = 'calendar-event-ends';

        calendarEvent = this.#createCalendarEvent(eventData, ['all-day', cssClass]);
        container = days[i].elem.querySelector('.week-view-all-day-wrapper');

        if (container) this.#appendAllDayEvent(container, calendarEvent);
      }
    }
  }

  /**
   * Appends IdsCalendarEvent to hour container
   * Adjust styles to reflect event duration and accomodate multiple events
   * @param {HTMLElement} container HTMLElement containing calendar event
   * @param {IdsCalendarEvent} calendarEvent IdsCalendarEvent component
   */
  #appendIntradayEvent(container: HTMLElement, calendarEvent: IdsCalendarEvent) {
    const containerHour = parseFloat(container.parentElement?.getAttribute('data-hour') || '');
    const eventStartHour = this.#getDateHours(calendarEvent.startDate, false);
    const containerWrapper = container.querySelector('.week-view-cell-wrapper');

    // Calculate and override event height
    const minHeightDuration = 0.25;
    const maxHeightDuration = this.endHour + 1 - eventStartHour;
    let eventDuration = calendarEvent.duration;
    eventDuration = Math.max(minHeightDuration, eventDuration);
    eventDuration = Math.min(maxHeightDuration, eventDuration);
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

    this.triggerEvent('beforeeventrendered', this, {
      detail:
        {
          elem: this,
          events: this.eventsData,
          event: calendarEvent,
          dateCell: calendarEvent,
          container: containerWrapper
        },
      bubbles: true
    });
    containerWrapper?.appendChild(<any>calendarEvent);
    this.triggerEvent('aftereventrendered', this, {
      detail:
      {
        elem: this,
        events: this.eventsData,
        event: calendarEvent,
        dateCell: calendarEvent,
        container: containerWrapper
      },
      bubbles: true
    });
  }

  /**
   * Appends IdsCalendarEvent to all day section of week view
   * Adjust styles to accomodate multiple calendar events
   * @param {HTMLElement} container HTMLElement containing calendar event
   * @param {IdsCalendarEvent} calendarEvent IdsCalendarEvent component
   */
  #appendAllDayEvent(container: HTMLElement, calendarEvent: IdsCalendarEvent) {
    const containerEvents = container.querySelectorAll('ids-calendar-event');
    const eventCount = containerEvents.length;

    // align events vertically
    if (eventCount >= 1) {
      calendarEvent.yOffset = `${22 * eventCount}px`;
    }

    // set container height to fit all events
    if (eventCount >= 2) {
      this.container
        ?.querySelectorAll<HTMLElement>('.week-view-all-day-wrapper')
        .forEach((elem: HTMLElement) => {
          elem.style.height = `${44 + ((eventCount - 1) * 23)}px`;
        });
    }

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
    container.appendChild(<any>calendarEvent);
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
      this.setAttribute(attributes.SHOW_TODAY, 'true');
    } else {
      this.removeAttribute(attributes.SHOW_TODAY);
    }

    this.#renderWeek();
  }

  /**
   * start-date attribute
   * @returns {Date} startDate date parsed from attribute value
   */
  get startDate(): Date {
    const attrVal = this.getAttribute(attributes.START_DATE);
    const attrDate = new Date(attrVal ?? '');

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
      this.setAttribute(attributes.START_DATE, val.toString());
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    this.#renderWeek();
  }

  /**
   * end-date attribute
   * @returns {Date} endDate date parsed from attribute value
   */
  get endDate(): Date {
    const attrVal = this.getAttribute(attributes.END_DATE);
    const attrDate = new Date(attrVal ?? '');

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
      this.setAttribute(attributes.END_DATE, val.toString());
    } else {
      this.removeAttribute(attributes.END_DATE);
    }

    this.#renderWeek();
  }

  onFirstDayOfWeekChange() {
    this.#renderWeek();
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
      this.setAttribute(attributes.START_HOUR, String(val));
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
      this.setAttribute(attributes.END_HOUR, String(val));
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
    this.setAttribute(attributes.SHOW_TIMELINE, String(boolVal));
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
      this.setAttribute(attributes.TIMELINE_INTERVAL, String(val));
    } else {
      this.removeAttribute(attributes.TIMELINE_INTERVAL);
    }

    this.#renderTimeline();
  }
}
