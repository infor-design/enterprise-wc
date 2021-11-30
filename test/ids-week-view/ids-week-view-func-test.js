/**
 * @jest-environment jsdom
 */
import IdsWeekView from '../../src/components/ids-week-view/ids-week-view';
import {
  addDate,
  firstDayOfWeek,
  lastDayOfWeek
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

describe('IdsWeekView Component (using properties)', () => {
  let component;

  beforeEach(async () => {
    component = new IdsWeekView();
    component.startDate = startDate;
    component.endDate = endDate;
    component.firstDayOfWeek = startFirstDayOfWeek;
    component.startHour = startHour;
    component.endHour = endHour;
    component.showTimeline = false;
    component.timelineInterval = interval;

    document.body.appendChild(component);
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
  });

  it('should change properties', () => {
    component.startDate = null;
    component.endDate = null;
    component.startHour = null;
    component.endHour = null;
    component.firstDayOfWeek = null;
    component.showToday = null;
    component.timelineInterval = null;

    expect(component.startDate.toISOString()).toEqual(firstDayOfWeek(new Date()).toISOString());
    expect(component.endDate.toISOString()).toEqual(lastDayOfWeek(new Date()).toISOString());
    expect(component.startHour).toEqual(defaultStartHour);
    expect(component.endHour).toEqual(defaultEndHour);
    expect(component.firstDayOfWeek).toEqual(defaultFirstDayOfWeek);
    expect(component.showToday).toBeFalsy();
    expect(component.timelineInterval).toEqual(defaultInterval);
  });
});

describe('IdsWeekView Component (using attributes)', () => {
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `
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
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-week-view></ids-week-view>`);
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

  it('should have default properties', () => {
    expect(component.startDate.toISOString()).toEqual(firstDayOfWeek(new Date()).toISOString());
    expect(component.endDate.toISOString()).toEqual(lastDayOfWeek(new Date()).toISOString());
    expect(component.startHour).toEqual(7);
    expect(component.endHour).toEqual(19);
    expect(component.showToday).toBeFalsy();
    expect(component.showTimeline).toBeTruthy();
    expect(component.firstDayOfWeek).toEqual(0);
    expect(component.timelineInterval).toEqual(defaultInterval);
  });
});
