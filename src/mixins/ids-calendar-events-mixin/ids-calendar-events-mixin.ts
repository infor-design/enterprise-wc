import IdsCalendarEvent, { CalendarEventData, CalendarEventTypeData } from '../../components/ids-calendar/ids-calendar-event';
import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import type IdsMenuButton from '../../components/ids-menu-button/ids-menu-button';

export interface CalendarEventsHandler {
  renderEventsData?(forceRender?: boolean): void;
  onEventsChange?(data: CalendarEventData[]): void;
  onEventTypesChange?(data: CalendarEventTypeData[]): void;
  onViewPickerChange?(doShow?: boolean): void;
}

type Constraints = IdsConstructor<EventsMixinInterface & CalendarEventsHandler>;

type IdsCalendarViewType = 'month' | 'year' | 'day';

const IdsCalendarEventsMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  #eventsData: CalendarEventData[] = [];

  #eventTypesData: CalendarEventTypeData[] = [];

  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.VIEW_PICKER,
      attributes.HIDDEN
    ];
  }

  /**
   * Set calendar events to display on week view
   * @param {CalendarEventData[]} data array of events
   */
  set eventsData(data: CalendarEventData[]) {
    this.#eventsData = this.sortEventsByDate(data);
    this.renderEventsData?.(true);
    this.onEventsChange?.(this.#eventsData);
  }

  /**
   * Gets calendar events
   * @returns {CalendarEventData[]} array of events
   */
  get eventsData(): CalendarEventData[] {
    return this.#eventsData;
  }

  /**
   * Set event types for week view
   * @param {CalendarEventTypeData[]} data array of event types
   */
  set eventTypesData(data: CalendarEventTypeData[]) {
    this.#eventTypesData = data;
    this.renderEventsData?.(true);
    this.onEventTypesChange?.(data);
  }

  /**
   * Gets event types of week view
   * @returns {CalendarEventTypeData[]} array of event types
   */
  get eventTypesData(): CalendarEventTypeData[] {
    return this.#eventTypesData;
  }

  /**
   * Allows setting async function to fetch calendar event data
   * Passes startDate and endDate as callback arguments
   * @param {Function} fn Async function
   */
  set beforeEventsRender(fn: ((startDate: Date, endDate: Date) => Promise<CalendarEventData[]>) | null) {
    this.state.beforeEventsRender = fn;
    this.renderEventsData?.();
  }

  /**
   * Sets whether view picker is visible in toolbar
   * @param {string|boolean} value show view picker if true
   */
  set viewPicker(value: string | boolean) {
    const doShowViewPicker = stringToBool(value);
    if (doShowViewPicker) {
      this.setAttribute(attributes.VIEW_PICKER, '');
    } else {
      this.removeAttribute(attributes.VIEW_PICKER);
    }

    if (typeof this.onViewPickerChange === 'function') {
      this.onViewPickerChange(doShowViewPicker);
    }
  }

  /**
   * Gets view picker value
   * @returns {boolean} true if view picker enabled
   */
  get viewPicker(): boolean {
    return this.hasAttribute(attributes.VIEW_PICKER);
  }

  /**
   * Handles global html hidden attribute changes
   * @param {boolean|string} value hidden value
   */
  onHiddenChange(value: boolean | string) {
    if (stringToBool(value)) {
      this.container?.classList.add(attributes.HIDDEN);
    } else {
      this.container?.classList.remove(attributes.HIDDEN);
    }
  }

  /**
   * Sort calender events by date
   * @param {CalendarEventData[]} data calendar events
   * @returns {CalendarEventData[]} sorted calendar events
   */
  sortEventsByDate(data: CalendarEventData[]): CalendarEventData[] {
    return data.slice().sort((a, b) => {
      const aStart = new Date(a.starts);
      const bStart = new Date(b.starts);
      return aStart.getTime() - bStart.getTime();
    });
  }

  /**
   * Creates date key used in component
   * Format - [year][month][date]
   * @param {Date} date Date obj
   * @returns {number} 20200421
   */
  generateDateKey(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();

    return parseInt(`${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`);
  }

  /**
   * Removes IdsCalendarEvent components from view
   */
  removeAllEvents(): void {
    const events = this.container?.querySelectorAll<IdsCalendarEvent>('ids-calendar-event');
    events?.forEach((event: IdsCalendarEvent) => event.remove());
  }

  /**
   * Create view picker template used in month/week views
   * @param {string} view month | week \ day
   * @returns {string} view picker template
   */
  createViewPickerTemplate(view: 'month' | 'week' | 'day'): string {
    const value = view[0].toUpperCase() + view.slice(1).toLowerCase();

    return `
      <ids-menu-button id="view-picker-btn" menu="view-picker" value="${view}" dropdown-icon display-selected-text>
        <span><ids-text translate-text="true" font-weight="semi-bold">${value}</ids-text></span>
      </ids-menu-button>
      <ids-popup-menu id="view-picker" trigger-type="click" target="#view-picker-btn">
        <ids-menu-group select="single">
          <ids-menu-item value="month" selected="${view === 'month'}">
            <ids-text translate-text="true">Month</ids-text>
          </ids-menu-item>
          <ids-menu-item value="week" selected="${view === 'week'}">
            <ids-text translate-text="true">Week</ids-text>
          </ids-menu-item>
          <ids-menu-item value="day" selected="${view === 'day'}">
            <ids-text translate-text="true">Day</ids-text>
          </ids-menu-item>
        </ids-menu-group>
      </ids-popup-menu>
    `;
  }

  /**
   * Handle view picker after render
   */
  viewPickerConnected(): void {
    const button = this.container?.querySelector<IdsMenuButton>('#view-picker-btn');

    if (button) {
      button.configureMenu();
    }
  }

  /**
   * Attach view picker events
   * @param {string} view month | week
   */
  attachViewPickerEvents(view: 'month' | 'week') {
    const menu = this.container?.querySelector('#view-picker');

    if (menu && view) {
      this.offEvent(`selected.${view}-view-picker`, menu);
      this.onEvent(`selected.${view}-view-picker`, menu, (evt: CustomEvent) => {
        evt.stopPropagation();
        this.#triggerViewChange(evt.detail.value);
      });
    }
  }

  /**
   * Trigger viewchange event used in month/week views
   * @param {IdsCalendarViewType} view month | week | day
   * @param {Date} activeDate date
   */
  #triggerViewChange(view: IdsCalendarViewType, activeDate?: Date): void {
    if (!view) return;

    this.triggerEvent('viewchange', this, {
      detail: {
        view,
        elem: this,
        date: activeDate
      },
      bubbles: true,
      cancelable: true,
      composed: true
    });
  }

  /**
   * Triggers date change event used in month/week views
   * @param {Date} date date
   * @param {string} type context/reason for the date change, if applicable
   */
  triggerDateChange(date: Date, type: string) {
    this.triggerEvent('datechange', this, {
      detail: {
        date,
        type
      },
      bubbles: true,
      cancelable: true,
      composed: true
    });
  }

  /**
   * Get event by id
   * @param {string} id event id
   * @returns {CalendarEventData} event data
   */
  getEventById(id: string): CalendarEventData | undefined {
    return this.#eventsData.find((item: CalendarEventData) => item.id === id);
  }

  /**
   * Get IdsCalendarEvent elem by id
   * @param {string} id event id
   * @returns {IdsCalendarEvent} calendar event component
   */
  getEventElemById(id: string): IdsCalendarEvent | undefined | null {
    return this.container?.querySelector<IdsCalendarEvent>(`ids-calendar-event[data-id="${id}"]`);
  }

  /**
   * Gets calendar event type by id
   * @param {string} id event type id
   * @returns {CalendarEventTypeData} calendar event type
   */
  getEventTypeById(id: string | null): CalendarEventTypeData | undefined {
    return this.#eventTypesData.find((item: CalendarEventTypeData) => id === item.id);
  }

  /**
   * @param {IdsCalendarViewType} val View Picker setting type
   */
  setViewPickerValue(val: IdsCalendarViewType) {
    const viewPickerEl = this.container?.querySelector<IdsMenuButton>('#view-picker-btn');
    if (viewPickerEl) viewPickerEl.value = val;
  }
};

export default IdsCalendarEventsMixin;
