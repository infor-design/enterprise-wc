/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsDatePicker from '../../src/components/ids-date-picker/ids-date-picker';
import IdsContainer from '../../src/components/ids-container/ids-container';

const name = 'ids-date-picker';

describe('IdsDatePicker Component Tests', () => {
  describe('Using properties', () => {
    let component: any;

    beforeEach(async () => {
      const container: any = new IdsContainer();
      document.body.appendChild(container);
      component = new IdsDatePicker();
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

      // Reset to defaults
      component.tabbable = null;
      component.showToday = null;
      component.firstDayOfWeek = null;
      component.id = null;
      component.value = '';
      component.label = null;
      component.format = null;
      component.month = null;
      component.year = null;
      component.day = null;

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

    it('can set visible and get the popup', () => {
      expect(component.container.querySelector('ids-popup').hasAttribute('visible')).toBeFalsy();
      component.popup.visible = true;
      expect(component.container.querySelector('ids-popup').hasAttribute('visible')).toBeTruthy();
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
      expect(component.getAttribute('placeholder')).toBeNull();

      component.setAttribute('placeholder', true);
      expect(component.placeholder).toBe('yyyy-MM-dd');

      component.setAttribute('format', 'M/d/yyyy');
      expect(component.placeholder).toBe('M/d/yyyy');

      component.removeAttribute('placeholder');
      expect(component.placeholder).toBe('');
    });

    it('should trigger input change event when the date is changed', () => {
      const mockCallback = jest.fn();

      component.triggerField.addEventListener('change', mockCallback);

      component.value = '1/2/2020';

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should trigger popup show/hide events', () => {
      const mockShowCallback = jest.fn();
      const mockHideCallback = jest.fn();

      component.popup.addEventListener('show', mockShowCallback);
      component.popup.addEventListener('hide', mockHideCallback);

      component.show();

      expect(mockShowCallback).toHaveBeenCalled();

      component.hide();

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
      delete comp.locale;
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

    it('should format date with custom format', () => {
      const daySelectedEvent = (date: Date) => new CustomEvent('dayselected', {
        detail: { date }
      });

      component.value = '';
      component.format = 'MMM yyyy';
      component.show();

      const monthView = component.container.querySelector('ids-month-view');
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
      component.hide();
      component.format = 'MMM yyyy';
      component.value = 'Feb 2020';
      const monthView = component.container.querySelector('ids-month-view');
      component.show();

      expect(monthView.activeDate).toEqual(new Date(2020, 1, 1));
      component.hide();

      component.format = 'MMMM d';
      component.value = 'August 3';
      component.show();

      expect(monthView.activeDate.getMonth()).toEqual(7);
      expect(monthView.activeDate.getDate()).toEqual(3);
      component.hide();

      component.format = 'yyyy';
      component.value = '2010';
      component.show();

      expect(monthView.activeDate.getFullYear()).toEqual(2010);
      component.hide();

      component.format = 'MMM dd, yyyy';
      component.value = 'Jan 01, 2010';
      component.show();

      expect(monthView.activeDate).toEqual(new Date(2010, 0, 1));
      component.hide();

      component.format = 'yyyy-MM-dd';
      component.value = '2012-03-04';
      component.show();

      expect(monthView.activeDate).toEqual(new Date(2012, 2, 4));
    });

    it('should validate dates', () => {
      let isValid;
      component.validate = 'date';
      component.format = 'yyyy-MM-dd';
      component.value = '2012-03-04';
      component.triggerField.addEventListener('validate', (e: any) => {
        isValid = e.detail.isValid;
      });
      component.triggerField.checkValidation();

      expect(isValid).toBeTruthy();

      component.value = '201-03-04';
      component.triggerField.checkValidation();

      expect(isValid).toBeFalsy();

      component.value = '2012-40-04';
      component.triggerField.checkValidation();

      expect(isValid).toBeFalsy();

      component.value = '2012-03-50';
      component.triggerField.checkValidation();

      expect(isValid).toBeFalsy();

      component.format = 'yyyy';
      component.value = '2012';
      component.triggerField.checkValidation();

      expect(isValid).toBeTruthy();

      component.value = '201';
      component.triggerField.checkValidation();

      expect(isValid).toBeFalsy();
    });
  });
});
