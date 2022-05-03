import '../ids-week-view';
import '../../ids-calendar/ids-calendar-event';
import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';

const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;

/**
 * Fetch events.json
 * @param {Date} startDate start date of week
 * @param {Date} endDate end date of week
 * @returns {Promise} events.json content
 */
function getEventsWithinWeek(startDate: Date, endDate: Date): Promise<any> {
  return fetch(eventsURL)
    .then((res) => res.json())
    .then((events: any[]) => {
      const weekStart = startDate.getTime();
      const weekEnd = endDate.getTime();
      const weekEvents = events.filter((event) => {
        const eventStart = new Date(event.starts).getTime();
        return weekStart <= eventStart && eventStart < weekEnd;
      });

      return weekEvents;
    });
}

/**
 * Fetch event-types.json
 * @returns {Promise} event-types.json content
 */
function getEventTypes(): Promise<any> {
  return fetch(eventTypesURL).then((res) => res.json());
}

document.addEventListener('DOMContentLoaded', async () => {
  const weekView: any = document.querySelector('ids-week-view');

  // Set event types
  weekView.eventTypes = await getEventTypes();

  weekView.beforeEventsRender = (startDate: Date, endDate: Date) => {
    const starts = startDate;
    const ends = endDate;

    return getEventsWithinWeek(starts, ends);
  };
});
