/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsDatePicker from '../../src/components/ids-date-picker/ids-date-picker';
import IdsContainer from '../../src/components/ids-container/ids-container';

const name = 'ids-date-picker';

const setupComponent = (component: any) => {
  component.tabbable = false;
  component.showToday = false;
  component.firstDayOfWeek = 1;
  component.id = name;
  component.label = name;
  component.value = '2021-10-18';
  component.size = 'lg';
  component.format = 'yyyy-MM-dd';
  component.month = 9;
  component.year = 2021;
  component.day = 18;
  component.showClear = true;
  component.showCancel = true;
  component.showPicklistYear = false;
  component.showPicklistMonth = false;
  component.showPicklistWeek = true;
  component.minuteInterval = 5;
  component.secondInterval = 5;
};

const testComponent = (component: any) => {
  expect(component.tabbable).toBeFalsy();
  expect(component.showToday).toBeFalsy();
  expect(component.firstDayOfWeek).toEqual(1);
  expect(component.id).toEqual(name);
  expect(component.value).toEqual('2021-10-18');
  expect(component.label).toEqual(name);
  expect(component.size).toEqual('lg');
  expect(component.format).toEqual('yyyy-MM-dd');
  expect(component.month).toEqual(9);
  expect(component.year).toEqual(2021);
  expect(component.day).toEqual(18);
  expect(component.showClear).toBeTruthy();
  expect(component.showCancel).toBeTruthy();
  expect(component.showPicklistYear).toBeFalsy();
  expect(component.showPicklistMonth).toBeFalsy();
  expect(component.showPicklistWeek).toBeTruthy();
  expect(component.minuteInterval).toEqual(5);
  expect(component.secondInterval).toEqual(5);
  expect(component.useCurrentTime).toBeFalsy();
};

describe('IdsMonthView Component initialization', () => {
  let container: any;

  beforeEach(() => {
    container = new IdsContainer();
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('can render via document.createElement (append early)', () => {
    const component: any = document.createElement('ids-date-picker');
    container.appendChild(component);
    setupComponent(component);
    testComponent(component);
  });

  it('can render via document.createElement (append late)', () => {
    const component: any = document.createElement('ids-date-picker');
    setupComponent(component);
    container.appendChild(component);
    testComponent(component);
  });

  it('can render html template', () => {
    container.insertAdjacentHTML('beforeend', `
      <ids-date-picker
        tabbable="false"
        show-today="false"
        first-day-of-week="1"
        id="${name}"
        label="${name}"
        value="2021-10-18"
        size="lg"
        format="yyyy-MM-dd"
        month="9"
        year="2021"
        day="18"
        show-clear="true"
        show-cancel="true"
        show-picklist-year="false"
        show-picklist-month="false"
        show-picklist-week="true"
        minute-interval="5"
        second-interval="5">
      </ids-date-picker>
    `);
    const component = document.querySelector('ids-date-picker');
    testComponent(component);
  });
});

describe('IdsDatePicker Component Tests', () => {
  describe('Using properties', () => {
    let component: any;

    beforeEach(async () => {
      const container: any = new IdsContainer();
      document.body.appendChild(container);
      component = new IdsDatePicker();
      setupComponent(component);

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
      testComponent(component);
    });

    it('should change properties', () => {
      component.tabbable = true;
      component.showToday = true;
      component.firstDayOfWeek = 0;
      component.id = 'changed';
      component.value = '2020-11-19';
      component.size = 'md';
      component.month = 10;
      component.year = 2020;
      component.day = 19;
      component.showClear = false;
      component.showCancel = false;
      component.showPicklistYear = true;
      component.showPicklistMonth = true;
      component.showPicklistWeek = false;
      component.useCurrentTime = true;

      expect(component.tabbable).toBeTruthy();
      expect(component.showToday).toBeTruthy();
      expect(component.firstDayOfWeek).toEqual(0);
      expect(component.id).toEqual('changed');
      expect(component.disabled).toBeFalsy();
      expect(component.readonly).toBeFalsy();
      expect(component.value).toEqual('2020-11-19');
      expect(component.size).toEqual('md');
      expect(component.month).toEqual(10);
      expect(component.year).toEqual(2020);
      expect(component.day).toEqual(19);
      expect(component.showClear).toBeFalsy();
      expect(component.showCancel).toBeFalsy();
      expect(component.showPicklistYear).toBeTruthy();
      expect(component.showPicklistMonth).toBeTruthy();
      expect(component.showPicklistWeek).toBeFalsy();
      expect(component.useCurrentTime).toBeTruthy();

      // Reset to defaults
      component.tabbable = null;
      component.showToday = null;
      component.firstDayOfWeek = null;
      component.id = '';
      component.value = '';
      component.label = null;
      component.format = null;
      component.month = null;
      component.year = null;
      component.day = null;
      component.minuteInterval = null;
      component.secondInterval = null;
      component.useCurrentTime = null;

      expect(component.tabbable).toBeTruthy();
      expect(component.showToday).toBeTruthy();
      expect(component.firstDayOfWeek).toEqual(0);
      expect(component.id).toEqual('');
      expect(component.value).toEqual('');
      expect(component.label).toEqual('');
      expect(component.format).toEqual('M/d/yyyy');
      expect(component.month).toEqual((new Date()).getMonth());
      expect(component.year).toEqual((new Date()).getFullYear());
      expect(component.day).toEqual((new Date()).getDate());
      expect(component.useCurrentTime).toBeFalsy();
    });

    it('should not change value when disabled or readonly', () => {
      component.disabled = true;
      component.value = 'changed';

      expect(component.value).toEqual('2021-10-18');

      component.disabled = false;
      component.readonly = true;

      component.value = 'changed';

      expect(component.value).toEqual('2021-10-18');

      component.readonly = false;
      component.value = 'changed';

      expect(component.value).toEqual('changed');
    });

    it('should set/unset legend property', () => {
      expect(component.legend.length).toEqual(0);

      const legend = [{ name: 'Weekends', color: 'amber-60', dayOfWeek: [0, 6] }];

      component.legend = legend;

      expect(component.legend).toEqual(legend);
    });

    it('should have setting for showWeekNumbers', () => {
      expect(component.showWeekNumbers).toEqual(false);
      component.showWeekNumbers = true;
      expect(component.showWeekNumbers).toEqual(true);
    });

    it('should set/unset useRange property', () => {
      expect(component.useRange).toBeFalsy();

      component.useRange = true;

      expect(component.useRange).toBeTruthy();

      component.useRange = false;

      expect(component.useRange).toBeFalsy();
    });

    it('should render field height', () => {
      const heights = ['xs', 'sm', 'md', 'lg'];
      const defaultHeight = 'md';
      const className = (h: any) => `field-height-${h}`;
      const checkHeight = (height: any) => {
        component.fieldHeight = height;

        const triggerField = component.container.querySelector('ids-trigger-field');
        expect(triggerField.getAttribute('field-height')).toEqual(height);
        expect(component.container.classList).toContain(className(height));
        heights.filter((h: any) => h !== height).forEach((h: any) => {
          expect(component.container.classList).not.toContain(className(h));
        });
      };

      expect(component.getAttribute('field-height')).toEqual(null);
      heights.filter((h: any) => h !== defaultHeight).forEach((h: any) => {
        expect(component.container.classList).not.toContain(className(h));
      });

      expect(component.container.classList).toContain(className(defaultHeight));
      heights.forEach((h: any) => checkHeight(h));
      component.removeAttribute('field-height');
      component.removeAttribute('compact');

      expect(component.getAttribute('field-height')).toEqual(null);
      heights.filter((h: any) => h !== defaultHeight).forEach((h: any) => {
        expect(component.container.classList).not.toContain(className(h));
      });
      component.onFieldHeightChange();

      expect(component.container.classList).toContain(className(defaultHeight));
    });

    it('should set compact height', () => {
      component.compact = true;

      expect(component.hasAttribute('compact')).toBeTruthy();
      expect(component.container.classList.contains('compact')).toBeTruthy();
      component.compact = false;

      expect(component.hasAttribute('compact')).toBeFalsy();
      expect(component.container.classList.contains('compact')).toBeFalsy();
    });

    it('should set size', () => {
      const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
      const defaultSize = 'sm';
      const checkSize = (size: any) => {
        component.size = size;

        expect(component.getAttribute('size')).toEqual(size);
        const triggerField = component.container.querySelector('ids-trigger-field');

        expect(triggerField.getAttribute('size')).toEqual(size);
      };

      // size lg is set before each test
      expect(component.getAttribute('size')).toEqual('lg');
      let triggerField = component.container.querySelector('ids-trigger-field');

      expect(triggerField.getAttribute('size')).toEqual('lg');
      sizes.forEach((s) => checkSize(s));
      component.size = null;

      expect(component.getAttribute('size')).toBeNull();
      triggerField = component.container.querySelector('ids-trigger-field');

      expect(triggerField.getAttribute('size')).toEqual(defaultSize);
    });

    it('should set no margins', () => {
      expect(component.getAttribute('no-margins')).toEqual(null);
      expect(component.noMargins).toEqual(false);
      let triggerField = component.container.querySelector('ids-trigger-field');

      expect(triggerField.getAttribute('no-margins')).toEqual(null);
      component.noMargins = true;

      expect(component.getAttribute('no-margins')).toEqual('');
      expect(component.noMargins).toEqual(true);
      triggerField = component.container.querySelector('ids-trigger-field');

      expect(triggerField.getAttribute('no-margins')).toEqual('');
      component.noMargins = false;

      expect(component.getAttribute('no-margins')).toEqual(null);
      expect(component.noMargins).toEqual(false);
      triggerField = component.container.querySelector('ids-trigger-field');

      expect(triggerField.getAttribute('no-margins')).toEqual(null);
    });

    it('should set values thru template', () => {
      expect(component.colorVariant).toEqual(null);
      expect(component.labelState).toEqual(null);
      expect(component.compact).toEqual(false);
      expect(component.noMargins).toEqual(false);
      component.colorVariant = 'alternate-formatter';
      component.labelState = 'collapsed';
      component.compact = true;
      component.noMargins = true;
      component.template();

      expect(component.colorVariant).toEqual('alternate-formatter');
      expect(component.labelState).toEqual('collapsed');
      expect(component.compact).toEqual(true);
      expect(component.noMargins).toEqual(true);
    });

    it('should change placeholder by format', () => {
      expect(component.placeholder).toBe('');

      component.placeholder = true;
      expect(component.placeholder).toBe('yyyy-MM-dd');

      component.format = 'M/d/yyyy';
      expect(component.placeholder).toBe('M/d/yyyy');

      component.placeholder = false;
      expect(component.placeholder).toBe('');
    });
  });

  describe('Using attributes', () => {
    let component: any;

    beforeEach(async () => {
      const container: any = new IdsContainer();
      document.body.appendChild(container);
      container.insertAdjacentHTML('beforeend', `
          <ids-date-picker
            label="${name}"
            id="${name}"
            tabbable="false"
            value="2021-10-18"
            format="yyyy-MM-dd"
            size="lg"
            first-day-of-week="1"
            show-today="false"
            month="9"
            year="2021"
            day="18"
            placeholder="false"
          ></ids-date-picker>
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
      expect(component.tabbable).toBeFalsy();
      expect(component.showToday).toBeFalsy();
      expect(component.firstDayOfWeek).toEqual(1);
      expect(component.id).toEqual(name);
      expect(component.value).toEqual('2021-10-18');
      expect(component.label).toEqual(name);
      expect(component.size).toEqual('lg');
      expect(component.format).toEqual('yyyy-MM-dd');
      expect(component.month).toEqual(9);
      expect(component.year).toEqual(2021);
      expect(component.day).toEqual(18);
    });

    it('can use "show()" to display the popup', () => {
      expect(component.container.querySelector('ids-date-picker-popup').visible).toBeFalsy();
      component.container.querySelector('ids-date-picker-popup').show();
      expect(component.container.querySelector('ids-date-picker-popup').visible).toBeTruthy();
    });

    it('should change attributes', () => {
      component.setAttribute('tabbable', true);
      component.setAttribute('show-today', true);
      component.setAttribute('id', 'changed');
      component.setAttribute('value', '2022-01-20');
      component.setAttribute('label', 'changed');
      component.setAttribute('placeholder', 'changed');
      component.setAttribute('size', 'sm');
      component.setAttribute('format', 'locale');
      component.setAttribute('month', 4);
      component.setAttribute('year', 2019);
      component.setAttribute('day', 22);
      component.setAttribute('first-day-of-week', 0);
      component.setAttribute('show-today', true);

      expect(component.tabbable).toBeTruthy();
      expect(component.showToday).toBeTruthy();
      expect(component.firstDayOfWeek).toEqual(0);
      expect(component.id).toEqual('changed');
      expect(component.value).toEqual('2022-01-20');
      expect(component.label).toEqual('changed');
      expect(component.size).toEqual('sm');
      expect(component.format).toEqual('M/d/yyyy');
      expect(component.month).toEqual(4);
      expect(component.year).toEqual(2019);
      expect(component.day).toEqual(22);

      // Reset to defaults
      component.removeAttribute('tabbable');
      component.removeAttribute('show-today');
      component.removeAttribute('id');
      component.removeAttribute('label');
      component.removeAttribute('placeholder');
      component.removeAttribute('size');
      component.removeAttribute('format');
      component.removeAttribute('month');
      component.removeAttribute('year');
      component.removeAttribute('day');
      component.removeAttribute('first-day-of-week');
      component.removeAttribute('show-today');

      expect(component.tabbable).toBeTruthy();
      expect(component.showToday).toBeTruthy();
      expect(component.firstDayOfWeek).toEqual(0);
      expect(component.id).toEqual('');
      expect(component.label).toEqual('');
      expect(component.format).toEqual('M/d/yyyy');
      expect(component.month).toEqual((new Date()).getMonth());
      expect(component.year).toEqual((new Date()).getFullYear());
      expect(component.day).toEqual((new Date()).getDate());
    });

    it('should set/unset useRange property', () => {
      expect(component.getAttribute('use-range')).toBeNull();

      component.setAttribute('use-range', true);

      expect(component.useRange).toBeTruthy();
    });

    it('should change placeholder by format', () => {
      expect(component.getAttribute('placeholder')).toBe(null);

      component.setAttribute('placeholder', true);
      expect(component.placeholder).toBe('yyyy-MM-dd');

      component.setAttribute('format', 'M/d/yyyy');
      expect(component.placeholder).toBe('M/d/yyyy');

      component.removeAttribute('placeholder');
      expect(component.placeholder).toBe('');
    });

    it('should trigger input change event when the date is changed', () => {
      const mockCallback = jest.fn();

      component.input.addEventListener('change', mockCallback);

      component.value = '1/2/2020';

      expect(mockCallback).toHaveBeenCalled();
    });

    it.skip('should trigger popup show/hide events', () => {
      const mockShowCallback = jest.fn();
      const mockHideCallback = jest.fn();

      component.container.addEventListener('show', mockShowCallback);
      component.container.addEventListener('hide', mockHideCallback);

      component.open();

      expect(mockShowCallback).toHaveBeenCalled();

      component.close();

      expect(mockHideCallback).toHaveBeenCalled();
    });
  });

  describe('Using empty component', () => {
    let component: any;

    beforeEach(async () => {
      const container: any = new IdsContainer();
      document.body.appendChild(container);
      container.insertAdjacentHTML('beforeend', `<ids-date-picker></ids-date-picker>`);
      component = document.querySelector(name);
    });

    afterEach(async () => {
      document.body.innerHTML = '';
      component = null;
    });

    it('should not error if no container', () => {
      document.body.innerHTML = '';
      const errors = jest.spyOn(global.console, 'error');
      const comp = new IdsDatePicker();
      (document.body as any).appendChild(comp);
      expect(errors).not.toHaveBeenCalled();
    });

    it('should render', () => {
      const errors = jest.spyOn(global.console, 'error');

      expect(document.querySelectorAll(name).length).toEqual(1);
      expect(errors).not.toHaveBeenCalled();
    });

    it('should have default properties', () => {
      expect(component.tabbable).toBeTruthy();
      expect(component.showToday).toBeTruthy();
      expect(component.firstDayOfWeek).toEqual(0);
      expect(component.id).toEqual('');
      expect(component.label).toEqual('');
      expect(component.disabled).toBeFalsy();
      expect(component.readonly).toBeFalsy();
      expect(component.value).toEqual('');
      expect(component.size).toEqual('sm');
      expect(component.validate).toBeNull();
      expect(component.validationEvents).toEqual('change blur');
      expect(component.format).toEqual('M/d/yyyy');
      expect(component.isCalendarToolbar).toBeFalsy();
      expect(component.month).toEqual((new Date()).getMonth());
      expect(component.year).toEqual((new Date()).getFullYear());
      expect(component.day).toEqual((new Date()).getDate());
      expect(component.showPicklistYear).toBeTruthy();
      expect(component.showPicklistMonth).toBeTruthy();
      expect(component.showPicklistWeek).toBeFalsy();
      expect(component.showClear).toBeFalsy();
      expect(component.showCancel).toBeFalsy();
      expect(component.disableSettings).toEqual({
        dates: [],
        years: [],
        minDate: '',
        maxDate: '',
        dayOfWeek: [],
        isEnable: false
      });
      expect(component.hasFocus).toBeFalsy();
    });

    it('should not expand if not dropdown', () => {
      expect(component.isDropdown).toBeFalsy();
      expect(component.expanded).toBeFalsy();

      component.expanded = true;

      expect(component.expanded).toBeFalsy();
    });

    it('should handle is-dropdown is-calendar-toolbar attributes', () => {
      component.isCalendarToolbar = true;
      component.isDropdown = true;

      expect(component.hasAttribute('is-calendar-toolbar')).toBeTruthy();
      expect(component.hasAttribute('is-dropdown')).toBeTruthy();

      component.isCalendarToolbar = null;
      component.isDropdown = null;

      expect(component.hasAttribute('is-calendar-toolbar')).toBeFalsy();
      expect(component.hasAttribute('is-dropdown')).toBeFalsy();
    });

    it('should set dirty tracking', () => {
      expect(component.dirtyTracker).toEqual(false);
      expect(component.getAttribute('dirty-tracker')).toEqual(null);
      expect(component.input.getAttribute('dirty-tracker')).toEqual(null);
      component.dirtyTracker = true;

      expect(component.dirtyTracker).toEqual(true);
      expect(component.getAttribute('dirty-tracker')).toEqual('true');
      expect(component.input.getAttribute('dirty-tracker')).toEqual('true');
      component.dirtyTracker = false;

      expect(component.dirtyTracker).toEqual(false);
      expect(component.getAttribute('dirty-tracker')).toEqual(null);
      expect(component.input.getAttribute('dirty-tracker')).toEqual(null);
    });

    it('should handle mask attribute', () => {
      expect(component.mask).toBeFalsy();

      component.mask = true;

      expect(component.mask).toBeTruthy();
      expect(component.input.getAttribute('mask')).toEqual('date');

      component.mask = false;

      expect(component.mask).toBeFalsy();
      expect(component.input.getAttribute('mask')).toBeNull();
    });

    it.skip('should format date with custom format', () => {
      const daySelectedEvent = (date: Date) => new CustomEvent('dayselected', {
        detail: { date }
      });

      component.value = '';
      component.format = 'MMM yyyy';
      component.open();

      const monthView = component.container.querySelector('ids-date-picker-popup');
      monthView.dispatchEvent(daySelectedEvent(new Date(2000, 2, 1)));

      expect(component.value).toEqual('Mar 2000');

      component.format = 'MMMM d';
      monthView.dispatchEvent(daySelectedEvent(new Date(1999, 9, 3)));

      expect(component.value).toEqual('October 3');

      component.format = 'yyyy';
      monthView.dispatchEvent(daySelectedEvent(new Date(2010, 0, 1)));

      expect(component.value).toEqual('2010');

      component.format = 'MMM dd, yyyy';
      monthView.dispatchEvent(daySelectedEvent(new Date(2010, 0, 1)));

      expect(component.value).toEqual('Jan 01, 2010');

      component.format = 'yyyy-MM-dd';
      monthView.dispatchEvent(daySelectedEvent(new Date(2012, 2, 4)));

      expect(component.value).toEqual('2012-03-04');
    });

    it('should parse date with custom format', () => {
      component.close();
      component.format = 'MMM yyyy';
      component.value = 'Feb 2020';
      const monthView = component.container.querySelector('ids-date-picker-popup');
      component.open();

      expect(monthView.activeDate).toEqual(new Date(2020, 1, 1));
      component.close();

      component.format = 'MMMM d';
      component.value = 'August 3';
      component.open();

      expect(monthView.activeDate.getMonth()).toEqual(7);
      expect(monthView.activeDate.getDate()).toEqual(3);
      component.close();

      component.format = 'yyyy';
      component.value = '2010';
      component.open();

      expect(monthView.activeDate.getFullYear()).toEqual(2010);
      component.close();

      component.format = 'MMM dd, yyyy';
      component.value = 'Jan 01, 2010';
      component.open();

      expect(monthView.activeDate).toEqual(new Date(2010, 0, 1));
      component.close();

      component.format = 'yyyy-MM-dd';
      component.value = '2012-03-04';
      component.open();

      expect(monthView.activeDate).toEqual(new Date(2012, 2, 4));
    });

    it('should validate dates', () => {
      let isValid;
      component.validate = 'date';
      component.format = 'yyyy-MM-dd';
      component.value = '2012-03-04';
      component.input.addEventListener('validate', (e: any) => {
        isValid = e.detail.isValid;
      });
      component.input.checkValidation();

      expect(isValid).toBeTruthy();

      component.value = '201-03-04';
      component.input.checkValidation();

      expect(isValid).toBeFalsy();

      component.value = '2012-40-04';
      component.input.checkValidation();

      expect(isValid).toBeFalsy();

      component.value = '2012-03-50';
      component.input.checkValidation();

      expect(isValid).toBeFalsy();

      component.format = 'yyyy';
      component.value = '2012';
      component.input.checkValidation();

      expect(isValid).toBeTruthy();

      component.value = '201';
      component.input.checkValidation();

      expect(isValid).toBeFalsy();

      component.validate = null;
      expect(component.validate).toBeNull();

      expect(component.validationEvents).toEqual('change blur');

      component.validationEvents = 'blur';

      expect(component.validationEvents).toEqual('blur');

      component.validationEvents = null;

      expect(component.validationEvents).toEqual('change blur');
    });

    it('should validate unavailable dates', () => {
      let isValid;
      component.disableSettings = {
        dates: ['2/15/2010', '2/25/2010'],
        dayOfWeek: [0, 6]
      };
      component.validate = 'availableDate';
      component.input.addEventListener('validate', (e: any) => {
        isValid = e.detail.isValid;
      });
      component.value = '2/16/2010';
      component.input.checkValidation();

      expect(isValid).toBeTruthy();

      component.value = '2/15/2010';
      component.input.checkValidation();

      expect(isValid).toBeFalsy();
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

    it('should parse dates in yyyy-MM-dd format', () => {
      component.format = 'yyyy-MM-dd';
      const parseDate = component.getDateValue('1990-04-21');
      expect(parseDate instanceof Date).toBeTruthy();
      expect(parseDate.getMonth()).toEqual(3);
      expect(parseDate.getFullYear()).toEqual(1990);
      expect(parseDate.getDate()).toEqual(21);
    });

    it('should parse dates in dd.MM.yyyy format (German)', () => {
      component.format = 'dd.MM.yyyy';
      const parseDate = component.getDateValue('21.04.1990');
      expect(parseDate instanceof Date).toBeTruthy();
      expect(parseDate.getMonth()).toEqual(3);
      expect(parseDate.getFullYear()).toEqual(1990);
      expect(parseDate.getDate()).toEqual(21);
    });

    it('should parse dates in dd/MM/yyyy format (Hebrew)', () => {
      component.format = 'dd/MM/yyyy';
      const parseDate = component.getDateValue('21/04/1990');
      expect(parseDate instanceof Date).toBeTruthy();
      expect(parseDate.getMonth()).toEqual(3);
      expect(parseDate.getFullYear()).toEqual(1990);
      expect(parseDate.getDate()).toEqual(21);
    });
  });
});
