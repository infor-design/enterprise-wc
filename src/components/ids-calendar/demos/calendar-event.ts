import '../ids-calendar-event';
import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';

const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;

document.addEventListener('DOMContentLoaded', async () => {
  const gridCells: any = document.querySelectorAll<HTMLElement>('ids-layout-grid-cell');
  const eventData = await fetch(eventsURL).then((res) => res.json());
  const eventTypeData = await fetch(eventTypesURL).then((res) => res.json());

  gridCells.forEach((gridCell: HTMLElement, i: number) => {
    gridCell.style.display = 'block';
    gridCell.style.position = 'relative';

    const calendarEvent: any = document.querySelector(`#item-${i + 1}`);
    calendarEvent.eventData = eventData[i];
    calendarEvent.eventTypeData = eventTypeData[i];
  });
});
