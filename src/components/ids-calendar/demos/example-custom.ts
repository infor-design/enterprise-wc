import eventsJSON from '../../../assets/data/events.json';
// import eventTypesJSON from '../../../assets/data/event-types.json';

const eventsURL: any = eventsJSON;
// const eventTypesURL: any = eventTypesJSON;

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
// function getEventTypes(): Promise<any> {
//   return fetch(eventTypesURL).then((res) => res.json());
// }

document.addEventListener('DOMContentLoaded', async () => {
  const calendar: any = document.querySelector('ids-calendar');
  const addEventMenu = document.querySelector('#add-event');

  // Set event types
  calendar.eventTypesData = [
    {
      id: 'dto',
      label: 'Discretionary Time Off',
      translationKey: 'DiscretionaryTimeOff',
      color: 'azure',
      checked: true,
      noOfAttributes: 2,
      attrs: [
        'subject',
        'time'
      ]
    },
    {
      id: 'admin',
      label: 'Admin',
      translationKey: 'AdministrativeLeave',
      color: 'amethyst',
      checked: true,
      noOfAttributes: 2,
      attrs: [
        'subject',
        'time'
      ]
    },
    {
      id: 'team',
      label: 'Team Event',
      translationKey: 'TeamEvent',
      color: 'emerald',
      checked: true,
      noOfAttributes: 3,
      attrs: [
        'subject',
        'time',
        'location'
      ]
    },
    {
      id: 'sick',
      label: 'Sick Time',
      translationKey: 'SickTime',
      color: 'amber',
      checked: true,
      noOfAttributes: 2,
      attrs: [
        'subject',
        'time'
      ]
    },
    {
      id: 'holiday',
      label: 'Company Holiday',
      translationKey: 'CompanyHoliday',
      color: 'slate',
      checked: true,
      disabled: true,
      noOfAttributes: 1,
      attrs: [
        'subject'
      ]
    }
  ];
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
});
