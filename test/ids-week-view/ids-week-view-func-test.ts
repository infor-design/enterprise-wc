/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import IdsWeekView from '../../src/components/ids-week-view/ids-week-view';
import IdsContainer from '../../src/components/ids-container/ids-container';

import {
  addDate,
  firstDayOfWeekDate,
  lastDayOfWeekDate
} from '../../src/utils/ids-date-utils/ids-date-utils';

const name = 'ids-week-view';
const startDate = '11/08/2021';
const endDate = '11/14/2021';
const startHour = 6;
const endHour = 21;
const startFirstDayOfWeek = 2;
const interval = 10000;
const defaultStartHour = 7;
const defaultEndHour = 19;
const defaultFirstDayOfWeek = 0;
const defaultInterval = 30000;

const EVENTS_ITEMS = [
  {
    id: '1',
    subject: 'Intraday Event',
    starts: '2021-11-10T12:00:00.000',
    ends: '2021-11-10T12:15:00.000',
    type: 'dto',
    isAllDay: 'false'
  },
  {
    id: '1b',
    subject: 'Intraday Event Copy',
    starts: '2021-11-10T12:00:00.000',
    ends: '2021-11-10T12:15:00.000',
    type: 'dto',
    isAllDay: 'false'
  },
  {
    id: '2',
    subject: '3 Day Event',
    starts: '2021-11-10T00:00:00.000',
    ends: '2021-11-12T23:59:59.999',
    type: 'admin',
    isAllDay: 'true'
  },
  {
    id: '3',
    subject: 'All Day Event',
    starts: '2021-11-10T00:00:00.000',
    ends: '2021-11-10T23:59:59.999',
    type: 'dto',
    isAllDay: 'true'
  },
  {
    id: '3b',
    subject: 'All Day Event Copy',
    starts: '2021-11-10T00:00:00.000',
    ends: '2021-11-10T23:59:59.999',
    type: 'dto',
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

describe('IdsWeekView Component (using properties)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    component = new IdsWeekView();
    component.startDate = startDate;
    component.endDate = endDate;
    component.firstDayOfWeek = startFirstDayOfWeek;
    component.startHour = startHour;
    component.endHour = endHour;
    component.showTimeline = false;
    component.timelineInterval = interval;

    await container.setLanguage('en');
    await container.setLocale('en-US');
    container.appendChild(component);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    // Use Snapshots
    expect(component.outerHTML).toMatchSnapshot();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.startDate.toISOString()).toEqual(new Date(startDate).toISOString());
    expect(component.endDate.toISOString()).toEqual(addDate(new Date(endDate), 1, 'days').toISOString());
    expect(component.firstDayOfWeek).toEqual(startFirstDayOfWeek);
    expect(component.startHour).toEqual(startHour);
    expect(component.endHour).toEqual(endHour);
    expect(component.showTimeline).toBeFalsy();
    expect(component.timelineInterval).toEqual(interval);
    expect(component.events).toBeUndefined();
    expect(component.eventTypes).toBeUndefined();
  });

  it('should change properties', () => {
    component.startDate = null;
    component.endDate = null;
    component.startHour = null;
    component.endHour = null;
    component.firstDayOfWeek = null;
    component.showToday = null;
    component.timelineInterval = null;

    expect(component.startDate.toISOString()).toEqual(firstDayOfWeekDate(new Date()).toISOString());
    expect(component.endDate.toISOString()).toEqual(lastDayOfWeekDate(new Date()).toISOString());
    expect(component.startHour).toEqual(defaultStartHour);
    expect(component.endHour).toEqual(defaultEndHour);
    expect(component.firstDayOfWeek).toEqual(defaultFirstDayOfWeek);
    expect(component.showToday).toBeFalsy();
    expect(component.timelineInterval).toEqual(defaultInterval);
  });

  it('can add calendar events', () => {
    component.eventTypes = EVENT_TYPES;
    component.events = EVENTS_ITEMS;

    const expectedEventCount = 7; // 5 Event Items (1 event lasts 3 days)
    expect(component.container.querySelectorAll('ids-calendar-event')?.length).toBe(expectedEventCount);
  });

  it('can change dates via toolbar buttons', () => {
    const clickEvent = new MouseEvent('click');

    // test clicking next button
    component.container.querySelector('.week-view-btn-next').dispatchEvent(clickEvent);
    expect(component.startDate.getDate()).toEqual(15);

    // test clicking previous button
    component.container.querySelector('.week-view-btn-previous').dispatchEvent(clickEvent);
    expect(component.startDate.getDate()).toEqual(8);
  });
});

describe('IdsWeekView Component (using attributes)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `
      <ids-week-view
        start-date="${startDate}"
        end-date="${endDate}"
        start-hour="${startHour}"
        end-hour="${endHour}"
        first-day-of-week="${startFirstDayOfWeek}"
        timeline-interval="${interval}"
        show-timeline="false"
      ></ids-week-view>
    `);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.startDate.toISOString()).toEqual(new Date(startDate).toISOString());
    expect(component.endDate.toISOString()).toEqual(addDate(new Date(endDate), 1, 'days').toISOString());
    expect(component.firstDayOfWeek).toEqual(startFirstDayOfWeek);
    expect(component.startHour).toEqual(startHour);
    expect(component.endHour).toEqual(endHour);
    expect(component.showTimeline).toBeFalsy();
    expect(component.timelineInterval).toEqual(interval);
  });
});

describe('IdsWeekView Component (empty)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `<ids-week-view></ids-week-view>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should not error if no container', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const comp: any = new IdsWeekView();
    delete comp.locale;
    comp.startDate = new Date();
    document.body.appendChild(comp);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have default properties', () => {
    expect(component.startDate.toISOString()).toEqual(firstDayOfWeekDate(new Date()).toISOString());
    expect(component.endDate.toISOString()).toEqual(lastDayOfWeekDate(new Date()).toISOString());
    expect(component.startHour).toEqual(7);
    expect(component.endHour).toEqual(19);
    expect(component.showToday).toBeFalsy();
    expect(component.showTimeline).toBeTruthy();
    expect(component.firstDayOfWeek).toEqual(0);
    expect(component.timelineInterval).toEqual(defaultInterval);
  });
});
