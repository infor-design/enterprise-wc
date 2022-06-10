/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsMonthView from '../../src/components/ids-month-view/ids-month-view';
import IdsContainer from '../../src/components/ids-container/ids-container';

const name = 'ids-month-view';

describe('IdsMonthView Component (using properties)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    component = new IdsMonthView();
    component.month = 0;
    component.year = 2021;
    component.day = 15;
    component.firstDayOfWeek = 1;
    component.showToday = true;
    component.showPicklistYear = false;
    component.showPicklistMonth = false;
    component.showPicklistWeek = true;

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
    expect(component.showPicklistYear).toBeFalsy();
    expect(component.showPicklistMonth).toBeFalsy();
    expect(component.showPicklistWeek).toBeTruthy();
  });

  it('should change properties', () => {
    component.month = 4;
    component.year = 2019;
    component.day = 22;
    component.firstDayOfWeek = 2;
    component.showToday = false;
    component.showPicklistYear = true;
    component.showPicklistMonth = true;
    component.showPicklistWeek = false;

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
    expect(component.showPicklistYear).toBeTruthy();
    expect(component.showPicklistMonth).toBeTruthy();
    expect(component.showPicklistWeek).toBeFalsy();
  });

  it('should change legend property', () => {
    expect(component.legend.length).toEqual(0);

    const legend = [{ name: 'Weekends', color: 'amber-60', dayOfWeek: [0, 6] }];

    component.legend = legend;

    expect(component.legend).toEqual(legend);
  });

  it('should change useRange', () => {
    expect(component.useRange).toBeFalsy();

    component.useRange = true;

    expect(component.useRange).toBeTruthy();

    component.useRange = false;

    expect(component.useRange).toBeFalsy();
  });
});

describe('IdsMonthView Component (using attributes)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `
      <ids-month-view
        month="0"
        year="2021"
        day="15"
        first-day-of-week="1"
        show-today="true"
        is-date-picker="true"
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
    expect(component.isDatePicker).toBeTruthy();
  });

  it('should change attributes', () => {
    component.setAttribute('month', 4);
    component.setAttribute('year', 2019);
    component.setAttribute('day', 22);
    component.setAttribute('first-day-of-week', 2);
    component.setAttribute('show-today', false);
    component.setAttribute('is-date-picker', false);

    expect(component.month).toEqual(4);
    expect(component.year).toEqual(2019);
    expect(component.day).toEqual(22);
    expect(component.firstDayOfWeek).toEqual(2);
    expect(component.showToday).toBeFalsy();
    expect(component.isDatePicker).toBeFalsy();

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
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
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
    const comp: any = new IdsMonthView();
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

describe('IdsMonthView Component (range of dates)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `
      <ids-month-view
        start-date="07/14/2021"
        end-date="02/02/2022"
      ></ids-month-view>
    `);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should not error if no container', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const comp: any = new IdsMonthView();
    delete comp.locale;
    document.body.appendChild(comp);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have properties', () => {
    expect(component.startDate.getFullYear()).toEqual(2021);
    expect(component.endDate.getFullYear()).toEqual(2022);
    expect(component.startDate.getDate()).toEqual(14);
    expect(component.endDate.getDate()).toEqual(2);
    expect(component.startDate.getMonth()).toEqual(6);
    expect(component.endDate.getMonth()).toEqual(1);
    expect(component.firstDayOfWeek).toEqual(0);
  });

  it('should switch to one month if start/end dates removed', () => {
    component.startDate = null;
    component.endDate = null;

    const now = new Date();

    expect(component.year).toEqual(now.getFullYear());
    expect(component.month).toEqual(now.getMonth());
    expect(component.day).toEqual(now.getDate());
  });

  it('should get/set range settings', () => {
    expect(component.rangeSettings).toEqual({
      start: null,
      end: null,
      separator: ' - ',
      minDays: 0,
      maxDays: 0,
      selectForward: false,
      selectBackward: false,
      includeDisabled: false,
      selectWeek: false
    });

    component.rangeSettings = {
      start: '5/11/2020',
      end: '5/14/2020',
      selectWeek: true
    };

    expect(component.rangeSettings).toEqual({
      start: '5/11/2020',
      end: '5/14/2020',
      separator: ' - ',
      minDays: 0,
      maxDays: 0,
      selectForward: false,
      selectBackward: false,
      includeDisabled: false,
      selectWeek: true
    });
  });

  it('should get/set disable settings', () => {
    expect(component.disable).toEqual({
      dates: [],
      years: [],
      minDate: '',
      maxDate: '',
      dayOfWeek: [],
      isEnable: false
    });

    component.disable = {
      dates: [],
      years: [2021]
    };

    expect(component.disable).toEqual({
      dates: [],
      years: [2021],
      minDate: '',
      maxDate: '',
      dayOfWeek: [],
      isEnable: false
    });
  });
});

describe('IdsMonthView Component (compact and datepicker)', () => {
  let component: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.insertAdjacentHTML('beforeend', `
      <ids-month-view
        compact="true"
        is-date-picker="true"
      ></ids-month-view>
    `);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should not error if no container', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const comp: any = new IdsMonthView();
    delete comp.locale;
    document.body.appendChild(comp);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have compact/datepicker css class initially', () => {
    const isCompact = component.container.classList.contains('is-compact');
    const isDatePicker = component.container.classList.contains('is-date-picker');

    expect(isCompact).toBeTruthy();
    expect(isDatePicker).toBeTruthy();
  });
});
