import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';
import '../../ids-layout-flex/ids-layout-flex';
import { CalendarEventData } from '../ids-calendar-event';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import calendarEventStyles from '../ids-calendar-event.scss';

appendStyleSheets(calendarEventStyles);

const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;

/**
 * Fetch events.json
 * @returns {Promise} events.json content
 */
function getCalendarEvents(): Promise<any> {
  return fetch(eventsURL).then((res) => res.json());
}

/**
 * Fetch event-types.json
 * @returns {Promise} event-types.json content
 */
function getEventTypes(): Promise<any> {
  return fetch(eventTypesURL).then((res) => res.json());
}

/**
 * Counts occurence of rendered event type
 * @param {string} eventType event type id
 * @param {CalendarEventData[]} calendarEvents events data
 * @returns {number} event count
 */
function countEventType(eventType: string, calendarEvents: CalendarEventData[]): number {
  return calendarEvents.filter((ce) => ce.type === eventType).length;
}

/**
 * Update custom legend with rendered event type counts
 * @param {CalendarEventData[]} calendarEvents events data
 */
function updateEventCounts(calendarEvents: CalendarEventData[]): void {
  const eventTypes = ['dto', 'admin', 'team', 'sick', 'holiday'];
  const eventTypesCount = eventTypes.map((eventType) => {
    const keyVal = {
      eventType,
      count: countEventType(eventType, calendarEvents)
    };

    return keyVal;
  }, {} as Record<string, number>);

  const legendContainer = document.querySelector('#custom-legend-container');
  if (legendContainer) {
    eventTypesCount.forEach((obj) => {
      const eventTypeBadge = legendContainer.querySelector(`#badge-${obj.eventType}`);
      if (eventTypeBadge) eventTypeBadge.textContent = `(${obj.count})`;
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const calendar: any = document.querySelector('ids-calendar');

  calendar.addEventListener('eventsrendered', (evt: any) => {
    updateEventCounts(evt.detail.eventsData);
  });

  // Set event types
  calendar.eventTypesData = await getEventTypes();
  calendar.eventsData = await getCalendarEvents();

  // Listen to dayselected events
  calendar.addEventListener('dayselected', (evt: any) => {
    console.info('dayselected', evt.detail);
  });
});
