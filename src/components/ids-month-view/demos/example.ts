import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';

const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;

/**
 * Fetch event-types.json
 * @returns {Promise} event-types.json content
 */
function getEventTypes(): Promise<any> {
  return fetch(eventTypesURL).then((res) => res.json());
}

/**
 * Fetch event-types.json
 * @returns {Promise} event-types.json content
 */
function getEvents(): Promise<any> {
  return fetch(eventsURL).then((res) => res.json());
}

document.addEventListener('DOMContentLoaded', async () => {
  const monthView: any = document.querySelector('ids-month-view');

  monthView?.addEventListener('dayselected', (e: any) => {
    console.info('Day Selected', e.detail.date);
  });

  monthView.eventTypesData = await getEventTypes();
  monthView.eventsData = await getEvents();
});

const monthview = document.querySelector('ids-month-view');
monthview?.addEventListener('beforeeventrendered', (e: Event) => {
  console.info(`Before Event Rendered`, (e as CustomEvent).detail);
});

monthview?.addEventListener('aftereventrendered', (e: Event) => {
  console.info(`After Event Rendered`, (e as CustomEvent).detail);
});
