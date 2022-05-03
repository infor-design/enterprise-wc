import '../ids-calendar-event';
import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';

const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll<HTMLElement>('ids-layout-grid-cell').forEach((elem) => {
    elem.style.display = 'block';
    elem.style.position = 'relative';
  });

  const eventData = await fetch(eventsURL).then((res) => res.json());
  const eventTypeData = await fetch(eventTypesURL).then((res) => res.json());

  for (let i = 0; i < 4; i++) {
    const calendarEvent: any = document.querySelector(`#item-${i + 1}`);
    calendarEvent.event = eventData[i];
    calendarEvent.eventType = eventTypeData[i];
  }
});
