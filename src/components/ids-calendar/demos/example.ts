import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';

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

document.addEventListener('DOMContentLoaded', async () => {
  const calendar: any = document.querySelector('ids-calendar');
  const addEventMenu = document.querySelector('#add-event');

  // Set event types
  calendar.eventTypesData = await getEventTypes();
  calendar.eventsData = await getCalendarEvents();

  addEventMenu?.addEventListener('selected', (evt: any) => {
    // Mock user defined id
    const id: string = Date.now().toString() + Math.floor(Math.random() * 100);

    switch (evt.detail.value) {
      case 'add-modal':
        calendar.createNewEvent(id, true);
        break;
      case 'add-api':
        calendar.createNewEvent(id, false);
        break;
      case 'clear':
        calendar.clearEvents();
        break;
      default:
        break;
    }
  });

  // Listen to dayselected events
  calendar.addEventListener('dayselected', (evt: any) => {
    console.info('dayselected', evt.detail);
  });
});

const monthview = document.querySelector('ids-calendar');
monthview?.addEventListener('beforeeventrendered', (e: Event) => {
  console.info(`Before Event Rendered`, (e as CustomEvent).detail);
});

monthview?.addEventListener('aftereventrendered', (e: Event) => {
  console.info(`After Event Rendered`, (e as CustomEvent).detail);
});
