/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsMonthView from '../../src/components/ids-month-view/ids-month-view';
import IdsContainer from '../../src/components/ids-container/ids-container';

const name = 'ids-month-view';

describe('IdsMonthView Component (using properties)', () => {
  let component;

  beforeEach(async () => {
    const container = new IdsContainer();
    document.body.appendChild(container);
    component = new IdsMonthView();
    component.month = 0;
    component.year = 2021;
    component.day = 15;
    component.firstDayOfWeek = 1;
    component.showToday = true;

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
    expect(component.month).toEqual(0);
    expect(component.year).toEqual(2021);
    expect(component.day).toEqual(15);
    expect(component.firstDayOfWeek).toEqual(1);
    expect(component.showToday).toBeTruthy();
  });

  it('should change properties', () => {
    component.month = 4;
    component.year = 2019;
    component.day = 22;
    component.firstDayOfWeek = 2;
    component.showToday = false;

    expect(component.month).toEqual(4);
    expect(component.year).toEqual(2019);
    expect(component.day).toEqual(22);
    expect(component.firstDayOfWeek).toEqual(2);
    expect(component.showToday).toBeFalsy();

    // Reset to defaults
    component.month = null;
    component.year = null;
    component.day = null;
    component.firstDayOfWeek = null;
    component.showToday = null;

    const now = new Date();

    expect(component.month).toEqual(now.getMonth());
    expect(component.year).toEqual(now.getFullYear());
    expect(component.day).toEqual(now.getDate());
    expect(component.firstDayOfWeek).toEqual(0);
    expect(component.showToday).toBeFalsy();
  });
});

describe('IdsMonthView Component (using attributes)', () => {
  let component;

  beforeEach(async () => {
    const container = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `
      <ids-month-view
        month="0"
        year="2021"
        day="15"
        first-day-of-week="1"
        show-today="true"
      ></ids-month-view>
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
    expect(component.month).toEqual(0);
    expect(component.year).toEqual(2021);
    expect(component.day).toEqual(15);
    expect(component.firstDayOfWeek).toEqual(1);
    expect(component.showToday).toBeTruthy();
  });

  it('should change attributes', () => {
    component.setAttribute('month', 4);
    component.setAttribute('year', 2019);
    component.setAttribute('day', 22);
    component.setAttribute('first-day-of-week', 2);
    component.setAttribute('show-today', false);

    expect(component.month).toEqual(4);
    expect(component.year).toEqual(2019);
    expect(component.day).toEqual(22);
    expect(component.firstDayOfWeek).toEqual(2);
    expect(component.showToday).toBeFalsy();

    // Reset to defaults
    component.removeAttribute('month');
    component.removeAttribute('year');
    component.removeAttribute('day');
    component.removeAttribute('first-day-of-week');
    component.removeAttribute('show-today');

    const now = new Date();

    expect(component.month).toEqual(now.getMonth());
    expect(component.year).toEqual(now.getFullYear());
    expect(component.day).toEqual(now.getDate());
    expect(component.firstDayOfWeek).toEqual(0);
    expect(component.showToday).toBeFalsy();
  });
});

describe('IdsMonthView Component (empty)', () => {
  let component;

  beforeEach(async () => {
    const container = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `<ids-month-view></ids-month-view>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should not error if no container', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const comp = new IdsMonthView();
    delete comp.locale;
    document.body.appendChild(comp);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have default properties', () => {
    const now = new Date();

    expect(component.year).toEqual(now.getFullYear());
    expect(component.month).toEqual(now.getMonth());
    expect(component.day).toEqual(now.getDate());
    expect(component.showToday).toBeFalsy();
    expect(component.firstDayOfWeek).toEqual(0);
  });
});
