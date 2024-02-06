/**
 * @jest-environment jsdom
 */

import IdsCalendar from '../../src/components/ids-calendar/ids-calendar';
import IdsContainer from '../../src/components/ids-container/ids-container';
import '../helpers/resize-observer-mock';
import '../../src/components/ids-month-view/ids-month-view';
import '../../src/components/ids-date-picker/ids-date-picker-popup';

const EVENTS_ITEMS = [
  {
    id: '1',
    subject: 'Intraday Event',
    starts: '2019-11-10T12:00:00.000',
    ends: '2019-11-10T12:15:00.000',
    type: 'dto',
    isAllDay: 'false',
    status: 'test status',
    comments: 'test comment'
  },
  {
    id: '2',
    subject: 'All Day Event',
    starts: '2019-11-10T00:00:00.000',
    ends: '2019-11-10T23:59:59.999',
    type: 'admin',
    isAllDay: 'true'
  }
];

const EVENT_TYPES = [
  {
    id: 'dto',
    label: 'Discretionary Time Off',
    translationKey: 'DiscretionaryTimeOff',
    color: 'blue',
    checked: true
  },
  {
    id: 'admin',
    label: 'Admin',
    translationKey: 'AdministrativeLeave',
    color: 'purple',
    checked: true
  }
];

describe('IdsCalendar Component', () => {
  let container: any;
  let component: any;

  beforeAll(() => {
    container = new IdsContainer();
    document.body.appendChild(container);
  });

  beforeEach(() => {
    component = new IdsCalendar();
    container.appendChild(component);
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelector('ids-calendar')).toBeDefined();
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders via document.createElement (append late)', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = document.createElement('ids-calendar');

    elem.date = '10/22/2019';
    container.appendChild(elem);

    expect(elem.date.getTime()).toEqual(new Date('10/22/2019').getTime());
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelector('ids-calendar')).toBeNull();
    expect(errors).not.toHaveBeenCalled();
  });

  it('shares calendar event data with active view component', () => {
    const day = 5;
    const month = 10;
    const year = 2019;
    const view = component.getView();

    component.day = day;
    component.month = month;
    component.year = year;
    component.eventTypesData = EVENT_TYPES;
    component.eventsData = EVENTS_ITEMS;

    expect(component.eventsData.length).toEqual(2);
    expect(component.eventTypesData.length).toEqual(2);
    expect(view.eventsData.length).toEqual(2);
    expect(view.eventTypesData.length).toEqual(2);

    component.clearEvents();
    expect(component.eventsData.length).toEqual(0);
    expect(view.eventsData.length).toEqual(0);
  });

  it('can format duration strings', () => {
    // 3 days
    let start = new Date(2022, 7, 15);
    let end = new Date(2022, 7, 18);
    let duration = component.formatDuration(start, end);
    expect(duration.trim().toLowerCase()).toEqual('3 days');

    // 3 hours
    start = new Date(2022, 7, 15);
    end = new Date(2022, 7, 15, 3);
    duration = component.formatDuration(start, end);
    expect(duration.trim().toLowerCase()).toEqual('3 hours');

    // 5 minutes
    start = new Date(2022, 7, 15, 0, 10);
    end = new Date(2022, 7, 15, 0, 15);
    duration = component.formatDuration(start, end);
    expect(duration.trim().toLowerCase()).toEqual('5 minutes');
  });

  it('can format date range strings', () => {
    const start = new Date(2022, 7, 15);
    const end = new Date(2022, 7, 18);
    const dateRange = component.formatDateRange(start, end);
    expect(dateRange).toEqual('August 15, 2022 at 12:00 AM - August 18, 2022 at 12:00 AM');
  });

  it('changes to day view when overflow-click event is triggered', () => {
    const changeViewSpy = jest.spyOn(component, 'setViewPickerValue').mockImplementation();

    component.triggerEvent('overflow-click', component.container, {
      detail: { date: new Date() }
    });

    expect(changeViewSpy).toHaveBeenCalled();
    changeViewSpy.mockClear();
  });

  it('changes view when viewchange event is triggered', () => {
    const changeViewSpy = jest.spyOn(component, 'changeView').mockImplementation();

    component.triggerEvent('viewchange', component, {
      detail: {
        date: new Date(),
        view: 'day'
      }
    });

    expect(changeViewSpy).toHaveBeenCalled();
    changeViewSpy.mockClear();
  });

  it('renders event details when dayselected event is triggered', () => {
    const renderDetailsSpy = jest.spyOn(component, 'updateEventDetails');
    const detail = {
      date: new Date(EVENTS_ITEMS[0].starts),
      eventsData: EVENTS_ITEMS
    };

    component.showDetails = true;
    component.eventTypesData = EVENT_TYPES;
    component.eventsData = EVENTS_ITEMS;

    // desktop details accordion
    component.triggerEvent('dayselected', component.container, { detail });
    expect(renderDetailsSpy).toHaveBeenCalled();

    // Mobile details list
    component.state.isMobile = true;
    component.triggerEvent('dayselected', component.container, { detail });
    expect(renderDetailsSpy).toHaveBeenCalled();
  });

  it('updates event type checked states when change event is triggered', () => {
    const wrapper = component.container.querySelector('.calendar-legend-pane');
    const elem = document.createElement('input');
    const checked = false;

    elem.type = 'checbox';
    elem.setAttribute('data-id', EVENT_TYPES[0].id);
    elem.checked = checked;
    component.showLegend = true;
    component.eventsData = EVENTS_ITEMS;
    component.eventTypesData = EVENT_TYPES;

    component.triggerEvent('change', wrapper, { detail: { elem, checked } });

    expect(component.eventTypesData[0].checked).toBeFalsy();
  });

  it('can clear events via API', () => {
    component.eventsData = EVENTS_ITEMS;
    expect(component.eventsData.length).toBe(2);

    component.clearEvents();
    expect(component.eventsData.length).toBe(0);
  });

  it('can add and update events via API', () => {
    const newEvent = EVENTS_ITEMS[0];
    component.clearEvents();
    component.addEvent(newEvent);
    expect(component.eventsData[0].id).toEqual(newEvent.id);

    const subject = 'new test subject';
    const updatedEvent = { ...newEvent, subject };
    component.updateEvent(updatedEvent);
    expect(component.eventsData[0].subject).toEqual(subject);
  });

  it('has startDate and endDate properties', () => {
    const now = new Date();
    const start = component.startDate;
    const end = component.endDate;

    expect(start.getFullYear()).toEqual(now.getFullYear());
    expect(end.getFullYear()).toEqual(now.getFullYear());

    expect(start.getMonth()).toEqual(now.getMonth());
    expect(end.getMonth()).toEqual(now.getMonth());
  });

  it.skip('can modal to create new event', () => {
    const id = '123';

    // open modal
    component.createNewEvent(id, true);
    const popup = component.container.querySelector('#event-form-popup');
    expect(popup).toBeDefined();

    // submit form
    popup.querySelector('ids-button[data-action="submit"]').click();
    expect(component.eventsData[0].id).toEqual(id);
  });
});
