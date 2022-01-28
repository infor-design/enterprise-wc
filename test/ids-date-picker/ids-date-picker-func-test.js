/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsDatePicker from '../../src/components/ids-date-picker/ids-date-picker';
import IdsContainer from '../../src/components/ids-container/ids-container';

const name = 'ids-date-picker';

describe('IdsDatePicker Component Tests', () => {
  describe('Using properties', () => {
    let component;

    beforeEach(async () => {
      const container = new IdsContainer();
      document.body.appendChild(container);
      component = new IdsDatePicker();
      component.tabbable = false;
      component.showToday = false;
      component.firstDayOfWeek = 1;
      component.id = name;
      component.label = name;
      component.value = '2021-10-18';
      component.placeholder = name;
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
      expect(component.placeholder).toEqual(name);
      expect(component.size).toEqual('lg');
      expect(component.format).toEqual('yyyy-MM-dd');
      expect(component.month).toEqual('9');
      expect(component.year).toEqual('2021');
      expect(component.day).toEqual('18');
    });

    it('should change properties', () => {
      component.tabbable = true;
      component.showToday = true;
      component.firstDayOfWeek = 0;
      component.id = 'changed';
      component.value = '2020-11-19';
      component.placeholder = 'changed';
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
      expect(component.placeholder).toEqual('changed');
      expect(component.size).toEqual('md');
      expect(component.month).toEqual('10');
      expect(component.year).toEqual('2020');
      expect(component.day).toEqual('19');

      // Reset to defaults
      component.tabbable = null;
      component.showToday = null;
      component.firstDayOfWeek = null;
      component.id = null;
      component.value = '';
      component.label = null;
      component.format = null;
      component.placeholder = null;
      component.month = null;
      component.year = null;
      component.day = null;

      expect(component.tabbable).toBeTruthy();
      expect(component.showToday).toBeTruthy();
      expect(component.firstDayOfWeek).toEqual(0);
      expect(component.id).toEqual('');
      expect(component.value).toEqual('');
      expect(component.label).toEqual('');
      expect(component.format).toEqual('locale');
      expect(component.placeholder).toEqual('');
      expect(component.month).toBeNull();
      expect(component.year).toBeNull();
      expect(component.day).toBeNull();
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
  });

  describe('Using attributes', () => {
    let component;

    beforeEach(async () => {
      const container = new IdsContainer();
      document.body.appendChild(container);
      container.insertAdjacentHTML('beforeend', `
        <ids-date-picker
          label="${name}"
          id="${name}"
          placeholder="${name}"
          tabbable="false"
          value="2021-10-18"
          format="yyyy-MM-dd"
          size="lg"
          first-day-of-week="1"
          show-today="false"
          month="9"
          year="2021"
          day="18"
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
      expect(component.placeholder).toEqual(name);
      expect(component.size).toEqual('lg');
      expect(component.format).toEqual('yyyy-MM-dd');
      expect(component.month).toEqual('9');
      expect(component.year).toEqual('2021');
      expect(component.day).toEqual('18');
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
      expect(component.placeholder).toEqual('changed');
      expect(component.size).toEqual('sm');
      expect(component.format).toEqual('locale');
      expect(component.month).toEqual('4');
      expect(component.year).toEqual('2019');
      expect(component.day).toEqual('22');

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
      expect(component.format).toEqual('locale');
      expect(component.placeholder).toEqual('');
      expect(component.month).toBeNull();
      expect(component.year).toBeNull();
      expect(component.day).toBeNull();
    });
  });

  describe('Using empty component', () => {
    let component;

    beforeEach(async () => {
      const container = new IdsContainer();
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
      document.body.appendChild(comp);
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
      expect(component.placeholder).toEqual('');
      expect(component.size).toBeNull();
      expect(component.validate).toBeNull();
      expect(component.validationEvents).toEqual('change blur');
      expect(component.format).toEqual('locale');
      expect(component.isCalendarToolbar).toBeFalsy();
      expect(component.isDropdown).toBeFalsy();
      expect(component.month).toBeNull();
      expect(component.year).toBeNull();
      expect(component.day).toBeNull();
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
  });
});
