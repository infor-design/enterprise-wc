/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsTimePicker from '../../src/components/ids-time-picker/ids-time-picker';
import IdsContainer from '../../src/components/ids-container/ids-container';
import { attributes } from '../../src/core/ids-attributes';
import { hoursTo12 } from '../../src/utils/ids-date-utils/ids-date-utils';

describe('IdsTimePicker Component', () => {
  let timepicker: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    container.setLocale('en-US');
    document.body.appendChild(container);
    const element: any = new IdsTimePicker();
    document.body.appendChild(element);
    timepicker = document.querySelector('ids-time-picker');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-time-picker').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders separators', () => {
    timepicker.format = 'hh:mm:ss a';
    timepicker.replaceWith(timepicker);
    expect(timepicker.container.querySelectorAll('.separator')).toHaveLength(3);

    timepicker.format = 'hh:mm:ss';
    timepicker.replaceWith(timepicker);
    expect(timepicker.container.querySelectorAll('.separator')).toHaveLength(2);

    timepicker.format = 'hh:mm';
    timepicker.replaceWith(timepicker);
    expect(timepicker.container.querySelectorAll('.separator')).toHaveLength(1);
  });

  it('renders placeholder', () => {
    expect(timepicker.placeholder).toBe('');

    const text = 'Placeholder text here';
    timepicker.setAttribute(attributes.PLACEHOLDER, text);
    expect(timepicker.placeholder).toContain(text);
    expect(timepicker.input.getAttribute(attributes.PLACEHOLDER)).toContain(text);

    const text2 = 'Another placeholder';
    timepicker.placeholder = text2;
    expect(timepicker.getAttribute(attributes.PLACEHOLDER)).toContain(text2);
    expect(timepicker.input.getAttribute(attributes.PLACEHOLDER)).toContain(text2);

    timepicker.placeholder = null;
    expect(timepicker.getAttribute(attributes.PLACEHOLDER)).toBeNull();
    expect(timepicker.input.placeholder).toBeNull();
  });

  it('renders label', () => {
    expect(timepicker.label).toBe('');
    const text = 'Label text here';
    timepicker.setAttribute(attributes.LABEL, text);
    expect(timepicker.label).toContain(text);
    expect(timepicker.input.label).toContain(text);

    const text2 = 'Another label';
    timepicker.label = text2;
    expect(timepicker.getAttribute(attributes.LABEL)).toContain(text2);
    expect(timepicker.input.label).toContain(text2);

    timepicker.label = null;
    expect(timepicker.getAttribute(attributes.LABEL)).toBeNull();
    expect(timepicker.input.label).toBe('');
  });

  it('renders 12 hours', () => {
    timepicker.format = 'hh:mm';
    timepicker.autoupdate = true;
    timepicker.hours = 12;
    timepicker.minutes = 0;
    expect(timepicker.value).toBe('12:00');
  });

  it('renders 24 hours', () => {
    timepicker.format = 'HH:mm';
    timepicker.autoupdate = true;
    timepicker.hours = 23;
    timepicker.minutes = 0;

    expect(timepicker.value).toBe('23:00');

    timepicker.hours = 11;
    timepicker.minutes = 30;

    expect(timepicker.value).toBe('11:30');
  });

  it('renders minutes', () => {
    timepicker.autoupdate = true;
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm');

    timepicker.hours = 10;
    timepicker.minutes = 35;

    expect(timepicker.value).toBe('10:35');

    timepicker.hours = 9;
    timepicker.minutes = 5;

    expect(timepicker.value).toBe('09:05');
  });

  it('should handle locale time format', async () => {
    timepicker.format = 'hh:mm';

    expect(timepicker.getAttribute(attributes.FORMAT)).toBe('hh:mm');

    timepicker.format = null;

    expect(timepicker.getAttribute(attributes.FORMAT)).toBeNull();
    expect(timepicker.format).toEqual(timepicker.locale.calendar().timeFormat);

    await (document.querySelector('ids-container') as any)?.setLocale('es-419');

    expect(timepicker.format).toEqual('HH:mm');
  });

  it('renders minutes intervals', () => {
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm');

    timepicker.minuteInterval = null;

    // Default value
    expect(timepicker.minuteInterval).toEqual(5);

    timepicker.minuteInterval = 10;

    const getOptions = (id: string): Array<number> => Array.from(timepicker.container.querySelector(id)?.options)
      .map((item: any) => +item.textContent);

    expect(timepicker.minuteInterval).toBe(10);
    timepicker.replaceWith(timepicker);
    expect(getOptions('#minutes')).toStrictEqual([0, 10, 20, 30, 40, 50]);

    timepicker.setAttribute(attributes.MINUTE_INTERVAL, 1);
    expect(timepicker.minuteInterval).toBe(1);
    timepicker.replaceWith(timepicker);
    expect(getOptions('#minutes')).toStrictEqual(Array.from({ length: 60 }).map((_, index) => index));
  });

  it('renders seconds', () => {
    timepicker.autoupdate = true;
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm:ss');

    timepicker.hours = '10';
    timepicker.minutes = '10';
    timepicker.seconds = '35';

    expect(timepicker.value).toBe('10:10:35');

    timepicker.seconds = 5;
    expect(timepicker.value).toBe('10:10:05');

    timepicker.seconds = 0;
    expect(timepicker.value).toBe('10:10:00');
  });

  it('renders seconds intervals', () => {
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm:ss');

    timepicker.secondInterval = null;

    // Default value
    expect(timepicker.secondInterval).toEqual(5);

    const getOptions = (id: string): Array<number> => Array.from(timepicker.container.querySelector(id)?.options)
      .map((item: any) => +item.textContent);

    timepicker.secondInterval = 10;
    expect(timepicker.secondInterval).toBe(10);
    timepicker.replaceWith(timepicker);
    expect(getOptions('#seconds')).toStrictEqual([0, 10, 20, 30, 40, 50]);

    timepicker.setAttribute(attributes.SECOND_INTERVAL, '1');
    expect(timepicker.secondInterval).toBe(1);
    timepicker.replaceWith(timepicker);
    expect(getOptions('#seconds')).toStrictEqual(Array.from({ length: 60 }).map((_, index) => index));
  });

  it('does not render seconds', () => {
    timepicker.autoupdate = true;
    timepicker.format = 'hh:mm';

    timepicker.hours = 10;
    timepicker.minutes = 10;
    timepicker.seconds = 35;

    expect(timepicker.value).toBe('10:10');

    timepicker.seconds = 5;
    expect(timepicker.value).toBe('10:10');
  });

  it('renders am/pm', () => {
    timepicker.autoupdate = true;
    timepicker.format = 'hh:mm a';

    timepicker.hours = '10';
    timepicker.minutes = '00';
    timepicker.period = 'AM';

    expect(timepicker.value).toBe('10:00 AM');

    timepicker.period = 'am';
    expect(timepicker.value).toBe('10:00 AM');

    timepicker.period = 'PM';
    expect(timepicker.value).toBe('10:00 PM');

    timepicker.period = 'pm';
    expect(timepicker.value).toBe('10:00 PM');

    timepicker.period = null;
    expect(timepicker.value).toBe('10:00 AM');
  });

  it('should set 12 am/pm time', () => {
    timepicker.autoupdate = true;

    timepicker.hours = 12;
    timepicker.minutes = 0;
    timepicker.period = 'AM';

    expect(timepicker.value).toBe('12:00 AM');

    timepicker.period = 'PM';

    expect(timepicker.value).toBe('12:00 PM');

    timepicker.hours = null;

    expect(timepicker.value).toBe('1:00 PM');

    timepicker.minutes = null;
    timepicker.seconds = null;

    expect(timepicker.value).toBe('1:00 PM');
  });

  it('should parse input value', () => {
    expect(timepicker.value).toBe('');
    timepicker.minuteInterval = 1;
    timepicker.secondInterval = 1;

    timepicker.value = '12:22 AM';

    expect(timepicker.hours).toBe(12);
    expect(timepicker.minutes).toBe(22);
    expect(timepicker.period).toBe('AM');

    timepicker.value = '12:22 PM';

    expect(timepicker.hours).toBe(12);
    expect(timepicker.minutes).toBe(22);
    expect(timepicker.period).toBe('PM');

    timepicker.value = '1:59 AM';

    expect(timepicker.hours).toBe(1);
    expect(timepicker.minutes).toBe(59);
    expect(timepicker.period).toBe('AM');

    timepicker.value = '';

    expect(timepicker.hours).toBe(1);
    expect(timepicker.minutes).toBe(0);
    expect(timepicker.period).toBe('AM');

    timepicker.format = 'HH:mm:ss';

    timepicker.value = '23:12:18';

    expect(timepicker.hours).toBe(23);
    expect(timepicker.minutes).toBe(12);
    expect(timepicker.seconds).toBe(18);

    timepicker.value = '00:00:00';

    expect(timepicker.hours).toBe(0);
    expect(timepicker.minutes).toBe(0);
    expect(timepicker.seconds).toBe(0);

    timepicker.value = '12:00:00';

    expect(timepicker.hours).toBe(12);
    expect(timepicker.minutes).toBe(0);
    expect(timepicker.seconds).toBe(0);
  });

  it('should handle option to limit hours', () => {
    const getOptions = (id: string): Array<number> => Array.from(timepicker.container.querySelector(id)?.options)
      .map((item: any) => +item.textContent);

    timepicker.value = '';
    timepicker.format = 'HH:mm:ss';
    expect(timepicker.startHour).toBe(0);
    expect(timepicker.endHour).toBe(24);

    timepicker.startHour = 5;
    timepicker.endHour = 15;

    timepicker.replaceWith(timepicker);
    expect(getOptions('#hours')).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    timepicker.startHour = 0;
    timepicker.endHour = 5;

    timepicker.replaceWith(timepicker);
    expect(getOptions('#hours')).toEqual([0, 1, 2, 3, 4, 5]);

    timepicker.startHour = 12;
    timepicker.endHour = 18;

    timepicker.replaceWith(timepicker);
    expect(getOptions('#hours')).toEqual([12, 13, 14, 15, 16, 17, 18]);

    timepicker.startHour = null;
    timepicker.endHour = null;
    expect(timepicker.startHour).toBe(0);
    expect(timepicker.endHour).toBe(24);

    timepicker.format = 'h:mm a';

    timepicker.startHour = 5;
    timepicker.endHour = 15;

    timepicker.replaceWith(timepicker);
    expect(getOptions('#hours')).toEqual([5, 6, 7, 8, 9, 10, 11]);

    timepicker.period = 'PM';

    expect(getOptions('#hours')).toEqual([1, 2, 3, 12]);

    timepicker.startHour = 18;
    timepicker.endHour = 23;

    timepicker.replaceWith(timepicker);
    timepicker.period = 'PM';
    expect(getOptions('#hours')).toEqual([6, 7, 8, 9, 10, 11]);

    timepicker.startHour = 0;
    timepicker.endHour = 11;
    timepicker.period = 'AM';
    expect(getOptions('#hours')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    timepicker.startHour = 18;
    timepicker.endHour = 24;
    timepicker.period = 'PM';
    timepicker.replaceWith(timepicker);

    expect(getOptions('#hours')).toEqual([6, 7, 8, 9, 10, 11]);

    timepicker.startHour = 0;
    timepicker.endHour = 13;
    timepicker.period = 'AM';
    timepicker.replaceWith(timepicker);
    expect(getOptions('#hours')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    timepicker.period = 'PM';
    expect(getOptions('#hours')).toEqual([1, 12]);
  });

  it('should show current time', () => {
    timepicker.format = 'HH:mm:ss';
    timepicker.minuteInterval = 1;
    timepicker.secondInterval = 1;
    timepicker.useCurrentTime = true;
    timepicker.value = '';

    expect(timepicker.hours).toEqual(new Date().getHours());
    expect(timepicker.minutes).toEqual(new Date().getMinutes());
    expect(timepicker.seconds).toEqual(new Date().getSeconds());

    timepicker.value = '22:33:44';

    expect(timepicker.hours).toEqual(22);
    expect(timepicker.minutes).toEqual(33);
    expect(timepicker.seconds).toEqual(44);

    timepicker.format = 'hh:mm:ss a';
    timepicker.value = '';

    expect(timepicker.hours).toEqual(hoursTo12(new Date().getHours()));
    expect(timepicker.minutes).toEqual(new Date().getMinutes());
    expect(timepicker.seconds).toEqual(new Date().getSeconds());
    expect(timepicker.period).toEqual(new Date().getHours() >= 12 ? 'PM' : 'AM');

    timepicker.useCurrentTime = null;
    timepicker.value = '';

    expect(timepicker.hours).toEqual(1);
    expect(timepicker.minutes).toEqual(0);
    expect(timepicker.seconds).toEqual(0);
    expect(timepicker.period).toEqual('AM');
  });

  it('does not render period (am/pm)', () => {
    timepicker.autoupdate = true;
    timepicker.format = 'hh:mm';

    timepicker.hours = '10';
    timepicker.minutes = '00';
    timepicker.period = 'AM';

    expect(timepicker.value).toBe('10:00');

    timepicker.period = 'PM';
    expect(timepicker.value).toBe('10:00');
  });

  it('can show and hide popup', () => {
    expect(timepicker.popup.visible).toBeFalsy();

    timepicker.open();
    expect(timepicker.popup.visible).toBeTruthy();

    timepicker.close();
    expect(timepicker.popup.visible).toBeFalsy();
  });

  it('with autoselect attribute, can auto show the popup', () => {
    expect(timepicker.autoselect).toBeFalsy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeFalsy();
    expect(timepicker.popup.visible).toBeFalsy();

    timepicker.autoselect = true;
    expect(timepicker.autoselect).toBeTruthy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeTruthy();

    timepicker.input.focus();
    expect(timepicker.popup.visible).toBeTruthy();
    timepicker.close();

    timepicker.autoselect = false;
    expect(timepicker.autoselect).toBeFalsy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeFalsy();

    timepicker.input.focus();
    expect(timepicker.popup.visible).toBeFalsy();
  });

  it('can update the timestring value with the "Set Time" button', () => {
    timepicker.autoupdate = false;
    timepicker.format = 'hh:mm';

    timepicker.value = '';
    expect(timepicker.value).toBe('');
    expect(timepicker.getAttribute('value')).toBe('');

    timepicker.hours = 2;
    timepicker.minutes = 30;

    timepicker.open();
    timepicker.container.querySelector('.popup-btn')?.click();
    expect(timepicker.value).toBe('02:30');
  });

  it('with autoupdate attribute, can hide the "Set Time" button', () => {
    expect(timepicker.autoupdate).toBeFalsy();
    expect(timepicker.getAttribute(attributes.AUTOUPDATE)).toBeFalsy();
    expect(timepicker.container.querySelector('.popup-btn')).toBeDefined();

    timepicker.autoupdate = true;
    expect(timepicker.autoupdate).toBeTruthy();
    expect(timepicker.getAttribute(attributes.AUTOUPDATE)).toBeTruthy();
    expect(timepicker.container.querySelector('.popup-btn')?.hidden).toBeTruthy();

    timepicker.autoupdate = false;
    expect(timepicker.autoupdate).toBe(false);
    expect(timepicker.getAttribute(attributes.AUTOUPDATE)).toBeFalsy();
    expect(timepicker.container.querySelector('.popup-btn')?.hidden).toBeFalsy();
  });

  it('can show and hide popup on clicking the trigger-button', () => {
    expect(timepicker.popup.visible).toBeFalsy();
    const triggerButton = timepicker.container.querySelector('ids-trigger-button');
    timepicker.triggerEvent('click', triggerButton);
    expect(timepicker.popup.visible).toBeTruthy();

    timepicker.triggerEvent('click', triggerButton);
    expect(timepicker.popup.visible).toBeFalsy();
  });

  it('can show popup with keyboard ArrowDown', () => {
    expect(timepicker.popup.visible).toBeFalsy();

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(timepicker.popup.visible).toBeTruthy();
  });

  it('can hide popup on keyboard Escape', () => {
    timepicker.open();
    expect(timepicker.popup.visible).toBeTruthy();

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(timepicker.popup.visible).toBeFalsy();
  });

  it('can hide popup on keyboard Backspace', () => {
    timepicker.open();
    expect(timepicker.popup.visible).toBeTruthy();

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(timepicker.popup.visible).toBeFalsy();
  });

  it('should set ID', () => {
    expect(timepicker.id).toEqual('');

    timepicker.id = 'example';
    expect(timepicker.id).toEqual('example');
    expect(timepicker.input?.getAttribute('id')).toEqual('example');

    timepicker.id = null;
    expect(timepicker.id).toEqual('');
  });

  it('can be disabled', () => {
    const morning = '01:00:00 AM';
    const evening = '06:30:00 PM';

    timepicker.value = morning;
    expect(timepicker.value).toBe(morning);
    expect(timepicker.disabled).toBeFalsy();

    timepicker.setAttribute(attributes.DISABLED, true);
    expect(timepicker.disabled).toBeTruthy();

    timepicker.value = evening;
    expect(timepicker.value).toBe(morning);

    timepicker.disabled = false;
    expect(timepicker.getAttribute(attributes.DISABLED)).toBeFalsy();
    expect(timepicker.disabled).toBeFalsy();

    timepicker.value = evening;
    expect(timepicker.value).toBe(evening);
  });

  it('can be readonly', () => {
    const morning = '01:00:00 AM';
    const evening = '06:30:00 PM';

    timepicker.value = morning;
    expect(timepicker.value).toBe(morning);
    expect(timepicker.readonly).toBeFalsy();

    timepicker.setAttribute(attributes.READONLY, true);
    expect(timepicker.readonly).toBeTruthy();

    timepicker.value = evening;
    expect(timepicker.value).toBe(morning);

    timepicker.readonly = false;
    expect(timepicker.getAttribute(attributes.READONLY)).toBeFalsy();
    expect(timepicker.readonly).toBeFalsy();

    timepicker.value = evening;
    expect(timepicker.value).toBe(evening);
  });

  it('will hide on outside click', () => {
    timepicker.open();
    timepicker.onOutsideClick({ target: document.body });
    expect(timepicker.popup.visible).toBeFalsy();
  });

  it('should handle embeddable setting', () => {
    document.querySelector('ids-container')?.insertAdjacentHTML('afterbegin', `
      <ids-time-picker id="embeddable" embeddable="true"></ids-time-picker>
    `);
    const embeddableTimePicker: any = document.querySelector('#embeddable');

    expect(embeddableTimePicker.input).toBeNull();
    expect(embeddableTimePicker.popup).toBeNull();
    expect(embeddableTimePicker.container.querySelector('.dropdowns')).not.toBeNull();

    embeddableTimePicker.embeddable = false;
    expect(embeddableTimePicker.getAttribute(attributes.EMBEDDABLE)).toBeFalsy();
  });

  it('should handle tabbable setting', () => {
    expect(timepicker.tabbable).toBeTruthy();

    timepicker.tabbable = false;
    expect(timepicker.tabbable).toBeFalsy();
    expect(timepicker.getAttribute(attributes.TABBABLE)).toBe('false');
  });

  it('can validate/enforce required', () => {
    let isValid;
    timepicker.value = '';
    timepicker.validate = 'required';
    timepicker.value = '1:00 AM';
    timepicker.input.addEventListener('validate', (e: any) => {
      isValid = e.detail.isValid;
    });
    timepicker.input.checkValidation();
    expect(isValid).toBeTruthy();

    timepicker.value = '';
    expect(isValid).toBeFalsy();

    timepicker.validate = null;
    expect(timepicker.getAttribute(attributes.VALIDATE)).toBeNull();

    timepicker.validationEvents = null;
    expect(timepicker.validationEvents).toBe('change blur');

    timepicker.validationEvents = 'blur';
    expect(timepicker.getAttribute(attributes.VALIDATION_EVENTS)).toBe('blur');
  });

  it('can validate time', () => {
    let isValid;
    timepicker.value = '1:00 AM';
    timepicker.validate = 'time';
    timepicker.input.addEventListener('validate', (e: any) => {
      isValid = e.detail.isValid;
    });
    timepicker.input.checkValidation();
    expect(isValid).toBeTruthy();

    timepicker.value = '99:00 AM';
    expect(isValid).toBeFalsy();
  });

  it('should render field height', () => {
    const heights = ['xs', 'sm', 'md', 'lg'];
    const defaultHeight = 'md';
    const className = (h: any) => `field-height-${h}`;
    const checkHeight = (height: any) => {
      timepicker.fieldHeight = height;

      expect(timepicker.input.getAttribute('field-height')).toEqual(height);
      expect(timepicker.container.classList).toContain(className(height));
      heights.filter((h) => h !== height).forEach((h) => {
        expect(timepicker.container.classList).not.toContain(className(h));
      });
    };

    expect(timepicker.getAttribute('field-height')).toEqual(null);
    heights.filter((h) => h !== defaultHeight).forEach((h) => {
      expect(timepicker.container.classList).not.toContain(className(h));
    });

    expect(timepicker.container.classList).toContain(className(defaultHeight));
    heights.forEach((h) => checkHeight(h));
    timepicker.removeAttribute('field-height');
    timepicker.removeAttribute('compact');

    expect(timepicker.getAttribute('field-height')).toEqual(null);
    heights.filter((h) => h !== defaultHeight).forEach((h) => {
      expect(timepicker.container.classList).not.toContain(className(h));
    });
    timepicker.onFieldHeightChange();

    expect(timepicker.container.classList).toContain(className(defaultHeight));
  });

  it('should set compact height', () => {
    timepicker.compact = true;

    expect(timepicker.hasAttribute('compact')).toBeTruthy();
    expect(timepicker.container.classList.contains('compact')).toBeTruthy();
    timepicker.compact = false;

    expect(timepicker.hasAttribute('compact')).toBeFalsy();
    expect(timepicker.container.classList.contains('compact')).toBeFalsy();
  });

  it('should set size', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const defaultSize = 'sm';
    const checkSize = (size: any) => {
      timepicker.size = size;

      expect(timepicker.getAttribute('size')).toEqual(size);
      expect(timepicker.input.getAttribute('size')).toEqual(size);
    };

    expect(timepicker.getAttribute('size')).toEqual(null);
    expect(timepicker.input.getAttribute('size')).toEqual(defaultSize);
    sizes.forEach((s) => checkSize(s));
    timepicker.size = null;

    expect(timepicker.getAttribute('size')).toEqual(null);
    expect(timepicker.input.getAttribute('size')).toEqual(defaultSize);
  });

  it('should set no margins', () => {
    expect(timepicker.getAttribute('no-margins')).toEqual(null);
    expect(timepicker.noMargins).toEqual(false);
    expect(timepicker.input.getAttribute('no-margins')).toEqual(null);
    timepicker.noMargins = true;

    expect(timepicker.getAttribute('no-margins')).toEqual('true');
    expect(timepicker.noMargins).toEqual(true);
    expect(timepicker.input.getAttribute('no-margins')).toEqual('');
    timepicker.noMargins = false;

    expect(timepicker.getAttribute('no-margins')).toEqual(null);
    expect(timepicker.noMargins).toEqual(false);
    expect(timepicker.input.getAttribute('no-margins')).toEqual(null);
  });

  it('should set values thru template', () => {
    expect(timepicker.colorVariant).toEqual(null);
    expect(timepicker.labelState).toEqual(null);
    expect(timepicker.compact).toEqual(false);
    expect(timepicker.noMargins).toEqual(false);
    timepicker.colorVariant = 'alternate-formatter';
    timepicker.labelState = 'collapsed';
    timepicker.compact = true;
    timepicker.noMargins = true;
    timepicker.template();

    expect(timepicker.colorVariant).toEqual('alternate-formatter');
    expect(timepicker.labelState).toEqual('collapsed');
    expect(timepicker.compact).toEqual(true);
    expect(timepicker.noMargins).toEqual(true);
  });

  it('should set dirty tracking', () => {
    expect(timepicker.dirtyTracker).toBeFalsy();
    expect(timepicker.getAttribute('dirty-tracker')).toEqual(null);
    expect(timepicker.input.getAttribute('dirty-tracker')).toEqual(null);
    timepicker.dirtyTracker = true;

    expect(timepicker.dirtyTracker).toEqual(true);
    expect(timepicker.getAttribute('dirty-tracker')).toEqual('true');
    expect(timepicker.input.getAttribute('dirty-tracker')).toEqual('true');
    timepicker.dirtyTracker = false;

    expect(timepicker.dirtyTracker).toEqual(false);
    expect(timepicker.getAttribute('dirty-tracker')).toEqual(null);
    expect(timepicker.input.getAttribute('dirty-tracker')).toEqual(null);
  });

  it('should set mask', () => {
    expect(timepicker.mask).toBeFalsy();

    timepicker.mask = true;
    expect(timepicker.mask).toBeTruthy();
    expect(timepicker.input?.getAttribute('mask')).toEqual('date');

    timepicker.format = 'HH:mm:ss';
    expect(timepicker.input.maskOptions.format).toEqual(timepicker.format);

    timepicker.mask = null;
    expect(timepicker.mask).toBeFalsy();
    expect(timepicker.input?.getAttribute('mask')).toBeNull();
  });
});
