/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsTimePicker from '../../src/components/ids-time-picker/ids-time-picker';
import { attributes } from '../../src/core';

describe('IdsTimePicker Component', () => {
  let timepicker;

  beforeEach(async () => {
    const element = new IdsTimePicker();
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

    const {
      dropdowns,
      input,
      popup,
      setTimeButton,
      triggerButton,
      triggerField,
    } = timepicker.elements;

    expect(dropdowns.hours).toBeDefined();
    expect(dropdowns.minutes).toBeDefined();
    expect(dropdowns.seconds).toBeDefined();
    expect(dropdowns.period).toBeDefined();
    expect(input).toBeDefined();
    expect(popup).toBeDefined();
    expect(setTimeButton).toBeDefined();
    expect(triggerButton).toBeDefined();
    expect(triggerField).toBeDefined();
  });

  it('renders separators', () => {
    timepicker.format = 'hh:mm:ss a';
    expect(timepicker.elements.popup.querySelectorAll('.separator')).toHaveLength(3);

    timepicker.format = 'hh:mm:ss';
    expect(timepicker.elements.popup.querySelectorAll('.separator')).toHaveLength(2);

    timepicker.format = 'hh:mm';
    expect(timepicker.elements.popup.querySelectorAll('.separator')).toHaveLength(1);
  });

  it('renders placeholder', () => {
    const { input } = timepicker.elements;
    expect(timepicker.placeholder).toBe('');

    const text = 'Placeholder text here';
    timepicker.setAttribute(attributes.PLACEHOLDER, text);
    expect(timepicker.placeholder).toContain(text);
    expect(input.getAttribute(attributes.PLACEHOLDER)).toContain(text);

    const text2 = 'Another placeholder';
    timepicker.placeholder = text2;
    expect(timepicker.getAttribute(attributes.PLACEHOLDER)).toContain(text2);
    expect(input.getAttribute(attributes.PLACEHOLDER)).toContain(text2);
  });

  it('renders label', () => {
    const { triggerField } = timepicker.elements;
    expect(timepicker.label).toBe('');
    const text = 'Label text here';
    timepicker.setAttribute(attributes.LABEL, text);
    expect(timepicker.label).toContain(text);
    expect(triggerField.elements.label.textContent).toContain(text);

    const text2 = 'Another label';
    timepicker.label = text2;
    expect(timepicker.getAttribute(attributes.LABEL)).toContain(text2);
    expect(triggerField.elements.label.textContent).toContain(text2);
  });

  it('renders 12 hours', () => {
    timepicker.format = 'hh:mm';
    timepicker.setTimeOnField({ hours: '12', minutes: '00' });
    expect(timepicker.value).toBe('12:00');
  });

  it('renders 24 hours', () => {
    timepicker.format = 'HH:mm';

    timepicker.setTimeOnField({ hours: '23', minutes: '00' });
    expect(timepicker.value).toBe('23:00');

    timepicker.setTimeOnField({ hours: '11', minutes: '30' });
    expect(timepicker.value).toBe('11:30');
  });

  it('renders minutes', () => {
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm');
    timepicker.replaceWith(timepicker);

    timepicker.setTimeOnField({ hours: '10', minutes: '33' });
    expect(timepicker.value).toBe('10:33');

    timepicker.setTimeOnField({ hours: '9', minutes: '4' });
    expect(timepicker.value).toBe('09:04');
  });

  it('renders minutes intervals', () => {
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm');
    timepicker.replaceWith(timepicker);

    expect(timepicker.intervals.minutes).toBeFalsy();

    timepicker.setAttribute(attributes.MINUTE_INTERVAL, '5');
    expect(timepicker.intervals.minutes).toBe(5);
    expect(timepicker.options.minutes).toStrictEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);

    timepicker.setAttribute(attributes.MINUTE_INTERVAL, '10');
    expect(timepicker.intervals.minutes).toBe(10);
    expect(timepicker.options.minutes).toStrictEqual([0, 10, 20, 30, 40, 50]);

    timepicker.setAttribute(attributes.MINUTE_INTERVAL, '15');
    expect(timepicker.intervals.minutes).toBe(15);
    expect(timepicker.options.minutes).toStrictEqual([0, 15, 30, 45]);
  });

  it('renders seconds', () => {
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm:ss');

    timepicker.elements.dropdowns.hours.value = '10';
    timepicker.elements.dropdowns.minutes.value = '10';

    timepicker.setTimeOnField({ seconds: '33' });
    expect(timepicker.value).toBe('10:10:33');

    timepicker.setTimeOnField({ seconds: '4' });
    expect(timepicker.value).toBe('10:10:04');

    timepicker.setTimeOnField({ seconds: '0' });
    expect(timepicker.value).toBe('10:10:00');
  });

  it('renders seconds intervals', () => {
    timepicker.setAttribute(attributes.FORMAT, 'hh:mm:ss');
    timepicker.replaceWith(timepicker);

    expect(timepicker.intervals.seconds).toBeFalsy();

    timepicker.setAttribute(attributes.SECOND_INTERVAL, '5');
    expect(timepicker.intervals.seconds).toBe(5);
    expect(timepicker.options.seconds).toStrictEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);

    timepicker.setAttribute(attributes.SECOND_INTERVAL, '10');
    expect(timepicker.intervals.seconds).toBe(10);
    expect(timepicker.options.seconds).toStrictEqual([0, 10, 20, 30, 40, 50]);

    timepicker.setAttribute(attributes.SECOND_INTERVAL, '15');
    expect(timepicker.intervals.seconds).toBe(15);
    expect(timepicker.options.seconds).toStrictEqual([0, 15, 30, 45]);
  });

  it('does not render seconds', () => {
    timepicker.format = 'hh:mm';

    const { dropdowns } = timepicker.elements;
    dropdowns.hours.value = '10';
    dropdowns.minutes.value = '10';

    timepicker.setTimeOnField({ seconds: '33' });
    expect(timepicker.value).toBe('10:10');

    timepicker.setTimeOnField({ seconds: '4' });
    expect(timepicker.value).toBe('10:10');
  });

  it('renders am/pm', () => {
    timepicker.format = 'hh:mm a';

    const { dropdowns } = timepicker.elements;
    dropdowns.hours.value = '10';
    dropdowns.minutes.value = '00';

    timepicker.setTimeOnField({ period: 'AM' });
    expect(timepicker.value).toBe('10:00 AM');

    timepicker.setTimeOnField({ period: 'am' });
    expect(timepicker.value).toBe('10:00 AM');

    timepicker.setTimeOnField({ period: 'PM' });
    expect(timepicker.value).toBe('10:00 PM');

    timepicker.setTimeOnField({ period: 'pm' });
    expect(timepicker.value).toBe('10:00 PM');
  });

  it('does not render period (am/pm)', () => {
    timepicker.format = 'hh:mm';

    const { dropdowns } = timepicker.elements;
    dropdowns.hours.value = '10';
    dropdowns.minutes.value = '00';

    timepicker.setTimeOnField({ period: 'AM' });
    expect(timepicker.value).toBe('10:00');

    timepicker.setTimeOnField({ period: 'PM' });
    expect(timepicker.value).toBe('10:00');
  });

  it('can show and hide popup', () => {
    expect(timepicker.isOpen).toBe(false);

    timepicker.openTimePopup();
    expect(timepicker.isOpen).toBe(true);

    timepicker.closeTimePopup();
    expect(timepicker.isOpen).toBe(false);
  });

  it('with autoselect attribute, can auto show the popup', () => {
    const { input } = timepicker.elements;
    expect(timepicker.autoselect).toBe(false);
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeFalsy();
    expect(timepicker.isOpen).toBe(false);

    timepicker.autoselect = true;
    expect(timepicker.autoselect).toBeTruthy();
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeTruthy();

    input.focus();
    expect(timepicker.isOpen).toBe(true);

    timepicker.autoselect = false;
    expect(timepicker.autoselect).toBe(false);
    expect(timepicker.getAttribute(attributes.AUTOSELECT)).toBeFalsy();
  });

  it('can update the timestring value with the "Set Time" button', () => {
    timepicker.format = 'hh:mm';

    const { dropdowns, setTimeButton } = timepicker.elements;

    timepicker.value = '';
    expect(timepicker.value).toBe('');
    expect(timepicker.getAttribute('value')).toBe('');

    dropdowns.hours.value = 1;
    dropdowns.minutes.value = 30;

    timepicker.openTimePopup();
    timepicker.triggerEvent('mouseup', setTimeButton);
    expect(timepicker.value).toBe('01:30');
  });

  it('with autoupdate attribute, can hide the "Set Time" button', () => {
    const { setTimeButton } = timepicker.elements;
    expect(timepicker.autoupdate).toBe(false);
    expect(timepicker.getAttribute(attributes.AUTOUPDATE)).toBeFalsy();
    expect(setTimeButton).toBeDefined();

    timepicker.autoupdate = true;
    expect(timepicker.autoupdate).toBeTruthy();
    expect(timepicker.getAttribute(attributes.AUTOUPDATE)).toBeTruthy();
    expect(setTimeButton.classList.contains('hidden')).toBe(true);

    timepicker.autoupdate = false;
    expect(timepicker.autoupdate).toBe(false);
    expect(timepicker.getAttribute(attributes.AUTOUPDATE)).toBeFalsy();
    expect(setTimeButton.classList.contains('hidden')).toBe(false);
  });

  it('with autoupdate attribute, fires dropdown change-event for hours', () => {
    timepicker.format = 'hh:mm';

    const { dropdowns } = timepicker.elements;
    dropdowns.minutes.value = 30;

    timepicker.autoupdate = true;
    timepicker.replaceWith(timepicker);
    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.hours, value: '5' } });
    expect(timepicker.value).toBe('05:30');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.hours, value: '21' } });
    expect(timepicker.value).toBe('21:30');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.hours, value: '67' } });
    expect(timepicker.value).toBe('21:30');
  });

  it('with autoupdate attribute, fires dropdown change-event for minutes', () => {
    timepicker.format = 'HH:mm';

    const { dropdowns } = timepicker.elements;
    dropdowns.hours.value = 7;

    timepicker.autoupdate = true;
    timepicker.replaceWith(timepicker);
    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.minutes, value: '5' } });
    expect(timepicker.value).toBe('07:05');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.minutes, value: '21' } });
    expect(timepicker.value).toBe('07:21');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.minutes, value: '67' } });
    expect(timepicker.value).toBe('07:21');
  });

  it('with autoupdate attribute, fires dropdown change-event for seconds', () => {
    timepicker.format = 'hh:mm:ss';

    const { dropdowns } = timepicker.elements;
    dropdowns.hours.value = 4;
    dropdowns.minutes.value = 15;

    timepicker.autoupdate = true;
    timepicker.replaceWith(timepicker);
    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.seconds, value: '5' } });
    expect(timepicker.value).toBe('04:15:05');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.seconds, value: '21' } });
    expect(timepicker.value).toBe('04:15:21');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.seconds, value: '67' } });
    expect(timepicker.value).toBe('04:15:00');
  });

  it('with autoupdate attribute, fires dropdown change-event for period (am/pm)', () => {
    timepicker.format = 'hh:mm a';

    const { dropdowns } = timepicker.elements;
    dropdowns.hours.value = 9;
    dropdowns.minutes.value = 12;

    timepicker.autoupdate = true;
    timepicker.replaceWith(timepicker);
    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.period, value: 'pm' } });
    expect(timepicker.value).toBe('09:12 PM');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.period, value: 'am' } });
    expect(timepicker.value).toBe('09:12 AM');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.period, value: 'PM' } });
    expect(timepicker.value).toBe('09:12 PM');

    timepicker.triggerEvent('change', timepicker.container, { detail: { elem: dropdowns.period, value: 'AM' } });
    expect(timepicker.value).toBe('09:12 AM');
  });

  it('can show and hide popup on clicking the trigger-button', () => {
    const { triggerButton } = timepicker.elements;
    expect(timepicker.isOpen).toBe(false);
    timepicker.triggerEvent('mouseup', triggerButton);
    expect(timepicker.isOpen).toBe(true);

    timepicker.triggerEvent('mouseup', triggerButton);
    expect(timepicker.isOpen).toBe(false);
  });

  it('can show and hide popup on keyboard-Enter', () => {
    expect(timepicker.isOpen).toBe(false);

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(timepicker.isOpen).toBe(true);

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(timepicker.isOpen).toBe(false);
  });

  it('can show popup with keyboard-ArrowDown', () => {
    expect(timepicker.isOpen).toBe(false);

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(timepicker.isOpen).toBe(true);
  });

  it('can hide popup on keyboard-Escape', () => {
    timepicker.openTimePopup();
    expect(timepicker.isOpen).toBe(true);

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(timepicker.isOpen).toBe(false);
  });

  it('can hide popup on keyboard-Backspace', () => {
    timepicker.openTimePopup();
    expect(timepicker.isOpen).toBe(true);

    timepicker.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(timepicker.isOpen).toBe(false);
  });

  it('can be disabled', () => {
    const morning = '01:00:00 AM';
    const evening = '06:30:00 PM';

    timepicker.value = morning;
    expect(timepicker.value).toBe(morning);
    expect(timepicker.disabled).toBe(false);

    timepicker.setAttribute(attributes.DISABLED, true);
    expect(timepicker.disabled).toBe('true');

    timepicker.value = evening;
    expect(timepicker.value).toBe(morning);

    timepicker.disabled = false;
    expect(timepicker.getAttribute(attributes.DISABLED)).toBe(false);
    expect(timepicker.disabled).toBe(false);

    timepicker.value = evening;
    expect(timepicker.value).toBe(evening);
  });

  it('can be readonly', () => {
    const morning = '01:00:00 AM';
    const evening = '06:30:00 PM';

    timepicker.value = morning;
    expect(timepicker.value).toBe(morning);
    expect(timepicker.readonly).toBe(false);

    timepicker.setAttribute(attributes.READONLY, true);
    expect(timepicker.readonly).toBe('true');

    timepicker.value = evening;
    expect(timepicker.value).toBe(morning);

    timepicker.readonly = false;
    expect(timepicker.getAttribute(attributes.READONLY)).toBe(false);
    expect(timepicker.readonly).toBe(false);

    timepicker.value = evening;
    expect(timepicker.value).toBe(evening);
  });

  it('can validate/enforce required', () => {});
});
