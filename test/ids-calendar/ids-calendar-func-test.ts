/**
 * @jest-environment jsdom
 */

import IdsCalendar from '../../src/components/ids-calendar/ids-calendar';
import IdsContainer from '../../src/components/ids-container/ids-container';
import '../helpers/resize-observer-mock';
import '../../src/components/ids-month-view/ids-month-view';

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
    color: 'azure',
    checked: true
  },
  {
    id: 'admin',
    label: 'Admin',
    translationKey: 'AdministrativeLeave',
    color: 'amethyst',
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

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelector('ids-calendar')).toBeNull();
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set day, month, year', () => {
    const day = 5;
    const month = 11;
    const year = 2019;

    component.date = `${month}/${day}/${year}`;

    expect(component.date.getDate()).toEqual(day);
    expect(component.date.getMonth()).toEqual(month - 1);
    expect(component.date.getFullYear()).toEqual(year);
  });

  it('has settings for visible panes', () => {
    component.showLegend = true;
    component.showDetails = true;
    expect(component.showLegend).toBeTruthy();
    expect(component.showDetails).toBeTruthy();

    component.showLegend = false;
    component.showDetails = false;
    expect(component.showLegend).toBeFalsy();
    expect(component.showDetails).toBeFalsy();
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

    component.removeAllEvents();
    expect(component.eventsData.length).toEqual(0);
    expect(view.eventsData.length).toEqual(0);
  });

  it('can change views', () => {
    // mock view changes to save memory
    const insertTemplateSpy = jest.spyOn(component, 'insertViewTemplate').mockImplementation();

    // week view
    component.changeView('week');
    expect(insertTemplateSpy).toHaveBeenCalled();
    expect(component.state.view).toEqual('week');

    // day view
    component.changeView('day');
    expect(insertTemplateSpy).toHaveBeenCalled();
    expect(component.state.view).toEqual('day');

    // month view
    component.changeView('month');
    expect(insertTemplateSpy).toHaveBeenCalled();
    expect(component.state.view).toEqual('month');

    insertTemplateSpy.mockClear();
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
    const changeViewSpy = jest.spyOn(component, 'changeView').mockImplementation();

    component.triggerEvent('overflow-click', component.container, {
      detail: { date: new Date() }
    });

    expect(changeViewSpy).toHaveBeenCalled();
    changeViewSpy.mockClear();
  });

  it('changes view when viewchange event is triggered', () => {
    const changeViewSpy = jest.spyOn(component, 'changeView').mockImplementation();

    component.triggerEvent('viewchange', component.container, {
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
    const wrapper = component.container.querySelector('#calendar-legend-pane');
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
});
