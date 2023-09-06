/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import { timeNumberWithinRange } from '../helpers/time-number-within-range';

import IdsTimePicker from '../../src/components/ids-time-picker/ids-time-picker';
import IdsContainer from '../../src/components/ids-container/ids-container';

import '../../src/components/ids-time-picker/ids-time-picker-popup';

import { attributes } from '../../src/core/ids-attributes';
import { hoursTo12 } from '../../src/utils/ids-date-utils/ids-date-utils';
import { messages as esMessages } from '../../src/components/ids-locale/data/es-messages';
import { locale as es419Locale } from '../../src/components/ids-locale/data/es-419';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsTimePicker Component', () => {
  let timepicker: any;
  let container: any;

  beforeEach(async () => {
    container = new IdsContainer();
    document.body.appendChild(container);
    const element: any = new IdsTimePicker();
    document.body.appendChild(element);
    timepicker = document.querySelector('ids-time-picker');

    IdsGlobal.getLocale().loadedLanguages.set('es', esMessages);
    IdsGlobal.getLocale().loadedLocales.set('es-419', es419Locale);
    IdsGlobal.getLocale().setLocale('en-US');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    timepicker = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-time-picker').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('render via document.createElement (append late)', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = document.createElement('ids-time-picker');

    elem.format = 'hh:mm';
    elem.value = '12:00';
    document.body.appendChild(elem);

    expect(elem.value).toBe('12:00');
    expect(errors).not.toHaveBeenCalled();
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
    expect(timepicker.format).toEqual(timepicker.localeAPI.calendar().timeFormat);
    await IdsGlobal.getLocale().setLocale('es-419');

    expect(timepicker.format).toEqual('HH:mm');
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

  it('should set 12 am/pm time', () => {
    timepicker.useCurrentTime = false;
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
    timepicker.useCurrentTime = false;
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

  it('should show current time', () => {
    timepicker.format = 'HH:mm:ss';
    timepicker.minuteInterval = 1;
    timepicker.secondInterval = 1;
    timepicker.useCurrentTime = true;

    timepicker.value = '';
    let testDate = new Date();
    let seconds = testDate.getSeconds();

    expect(timepicker.hours).toEqual(testDate.getHours());
    expect(timepicker.minutes).toEqual(testDate.getMinutes());
    expect(timeNumberWithinRange(timepicker.seconds, seconds - 1, seconds + 1)).toBeTruthy();

    timepicker.value = '22:33:44';

    expect(timepicker.hours).toEqual(22);
    expect(timepicker.minutes).toEqual(33);
    expect(timepicker.seconds).toEqual(44);

    timepicker.format = 'hh:mm:ss a';
    timepicker.value = '';
    testDate = new Date();
    seconds = testDate.getSeconds();

    expect(timepicker.hours).toEqual(hoursTo12(testDate.getHours()));
    expect(timepicker.minutes).toEqual(testDate.getMinutes());
    expect(timeNumberWithinRange(timepicker.seconds, seconds - 1, seconds + 1)).toBeTruthy();
    expect(timepicker.period).toEqual(testDate.getHours() >= 12 ? 'PM' : 'AM');

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
    expect(timepicker.picker.popup.visible).toBeFalsy();

    timepicker.open();
    expect(timepicker.picker.popup.visible).toBeTruthy();

    timepicker.close();
    expect(timepicker.picker.popup.visible).toBeFalsy();
  });

  it('with autoselect attribute, can auto show the popup', () => {
    expect(timepicker.autoselect).toBeFalsy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeFalsy();
    expect(timepicker.picker.popup.visible).toBeFalsy();

    timepicker.autoselect = true;
    expect(timepicker.autoselect).toBeTruthy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeTruthy();

    timepicker.input.focus();
    expect(timepicker.picker.popup.visible).toBeTruthy();
    timepicker.close();

    timepicker.autoselect = false;
    expect(timepicker.autoselect).toBeFalsy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeFalsy();

    timepicker.input.focus();
    expect(timepicker.picker.popup.visible).toBeFalsy();
  });

  it('can show and hide popup on clicking the trigger-button', () => {
    expect(timepicker.picker.popup.visible).toBeFalsy();
    const triggerButton = timepicker.container.querySelector('ids-trigger-button');
    timepicker.triggerEvent('click', triggerButton);
    expect(timepicker.picker.popup.visible).toBeTruthy();

    timepicker.triggerEvent('click', triggerButton);
    expect(timepicker.picker.popup.visible).toBeFalsy();
  });

  it('can show popup with keyboard ArrowDown', () => {
    expect(timepicker.picker.popup.visible).toBeFalsy();

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(timepicker.picker.popup.visible).toBeTruthy();
  });

  it('can hide popup on keyboard Escape', () => {
    timepicker.open();
    expect(timepicker.picker.popup.visible).toBeTruthy();

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(timepicker.picker.popup.visible).toBeFalsy();
  });

  it('can hide popup on keyboard Backspace', () => {
    timepicker.open();
    expect(timepicker.picker.popup.visible).toBeTruthy();

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(timepicker.picker.popup.visible).toBeFalsy();
  });

  it('should set ID', () => {
    expect(timepicker.id).toEqual('');

    timepicker.id = 'example';
    expect(timepicker.id).toEqual('example');
    expect(timepicker.input?.getAttribute('id')).toEqual('example');

    timepicker.removeAttribute('id');
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
    timepicker.picker.onOutsideClick({ target: document.body });
    expect(timepicker.picker.popup.visible).toBeFalsy();
  });

  it('should handle embeddable setting', () => {
    document.querySelector('ids-container')?.insertAdjacentHTML('afterbegin', `
      <ids-time-picker id="embeddable" embeddable="true"></ids-time-picker>
    `);
    const embeddableTimePicker = document.querySelector<IdsTimePicker>('#embeddable')!;

    expect(embeddableTimePicker.input).toBeNull();
    expect(embeddableTimePicker.picker).toBeNull();
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
