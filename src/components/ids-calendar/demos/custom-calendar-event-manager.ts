import { CalendarEventTypeData } from '../ids-calendar-event';
import IdsCustomCalendarEvent from './custom-calendar-event';

export default class CustomCalendarEventManager {
  #CUSTOM_MAX_EVENT_COUNT = 3;

  #eventPositionMap = new Map();

  #eventPillAttributesMap = new Map();

  /**
   * Calculates the event Y_OFFSET value to set the event pill top position
   * @param {IdsCustomCalendarEvent} calendarEvent IdsCustomCalendarEvent
   * @returns {number} yOffset
   */
  generateYOffset(calendarEvent: IdsCustomCalendarEvent): number {
    const eventTypeData = calendarEvent.eventTypeData;
    const dateKey = calendarEvent.dateKey;
    const order = calendarEvent.order;
    let position = 0;
    if (eventTypeData && order <= 3) {
      // space between event pills
      this.manageEventPillsPosition(dateKey, order, eventTypeData);
      // position event element vertically
      if (order === 0) {
        position = 20;
      } else if (this.#eventPositionMap.get(`${dateKey}_${order}`)) {
        position = this.#eventPositionMap.get(`${dateKey}_${order}`);
      } else {
        // if event-types data doesn't contain noOfAttributes and attr values
        position = (order * 18) + 25;
      }
    }
    return position;
  }

  /**
   * Checks if the event pills exceed the MAX_EVENT_COUNT in a day cell
   * @param {IdsCustomCalendarEvent} calendarEvent IdsCustomCalendarEvent
   * @returns {boolean} isEventOverflowing
   */
  isEventOverflowing(calendarEvent: IdsCustomCalendarEvent): boolean {
    return calendarEvent.order > this.#CUSTOM_MAX_EVENT_COUNT - 1;
  }

  /**
   * Manage event pill position vetically based on the number of attributes displayed in first event pill
   * @param {string} dateKey generated date key
   * @param {number} eventOrder Events order
   * @param {CalendarEventTypeData} eventType Event
   */
  manageEventPillsPosition(dateKey: string, eventOrder: number, eventType: CalendarEventTypeData | any) {
    const MAX_EVENT_PILL_ATTR_COUNT = 5;
    const noOfAttributes = eventType.attrs?.length;
    if (eventOrder === 0) {
      if (noOfAttributes === 3) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 58);
      } else if (noOfAttributes === 2) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 54);
      } else if (noOfAttributes === 1) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 40);
      }
      this.#eventPillAttributesMap.set(`${dateKey}_${eventOrder}`, noOfAttributes);
    } else if (eventOrder === 1) {
      const attributesCount = this.#eventPillAttributesMap.get(`${dateKey}_${eventOrder - 1}`);
      if ((attributesCount + noOfAttributes) > MAX_EVENT_PILL_ATTR_COUNT) {
        this.#CUSTOM_MAX_EVENT_COUNT = 1;
      } else {
        this.#CUSTOM_MAX_EVENT_COUNT = 2;
      }

      if (attributesCount === 3 && noOfAttributes === 1) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 70);
      } else if (attributesCount === 2) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 70);
      } else if (attributesCount === 1 && noOfAttributes === 1) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 60);
      } else if (attributesCount === 1 && noOfAttributes === 2) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 70);
      }
      this.#eventPillAttributesMap.set(`${dateKey}_${eventOrder}`, noOfAttributes);
    } else if (eventOrder === 2) {
      const firstPillAttributesCount = this.#eventPillAttributesMap.get(`${dateKey}_${eventOrder - 2}`);
      const secondPillAttributesCount = this.#eventPillAttributesMap.get(`${dateKey}_${eventOrder - 1}`);
      if ((firstPillAttributesCount + secondPillAttributesCount + noOfAttributes)
        >= MAX_EVENT_PILL_ATTR_COUNT) {
        this.#CUSTOM_MAX_EVENT_COUNT = 2;
      } else {
        this.#CUSTOM_MAX_EVENT_COUNT = 3;
      }

      if (secondPillAttributesCount === 3) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 70);
      } else if (secondPillAttributesCount === 2) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 85);
      } else if (secondPillAttributesCount === 1) {
        this.#eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 75);
      }
      this.#eventPillAttributesMap.set(`${dateKey}_${eventOrder}`, noOfAttributes);
    }
  }
}
