/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import { attributes } from '../../src/core/ids-attributes';
import IdsTimePickerPopup from '../../src/components/ids-time-picker/ids-time-picker-popup';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsTimePickerPopup Component', () => {
  let timepickerPopup: any;

  beforeEach(async () => {
    const container: any = new IdsContainer();
    IdsGlobal.getLocale().setLocale('en-US');
    document.body.appendChild(container);
    const element: any = new IdsTimePickerPopup();
    document.body.appendChild(element);
    timepickerPopup = document.querySelector('ids-time-picker-popup');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    timepickerPopup = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-time-picker-popup').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders am/pm', () => {
    timepickerPopup.autoupdate = true;
    timepickerPopup.format = 'hh:mm a';

    timepickerPopup.hours = '10';
    timepickerPopup.minutes = '00';
    timepickerPopup.period = 'AM';

    expect(timepickerPopup.value).toBe('10:00 AM');

    timepickerPopup.period = 'am';
    expect(timepickerPopup.value).toBe('10:00 AM');

    timepickerPopup.period = 'PM';
    expect(timepickerPopup.value).toBe('10:00 PM');

    timepickerPopup.period = 'pm';
    expect(timepickerPopup.value).toBe('10:00 PM');

    timepickerPopup.period = null;
    expect(timepickerPopup.value).toBe('10:00 AM');
  });

  it('renders minutes intervals', () => {
    timepickerPopup.setAttribute(attributes.FORMAT, 'hh:mm');

    timepickerPopup.minuteInterval = null;

    // Default value
    expect(timepickerPopup.minuteInterval).toEqual(5);

    timepickerPopup.minuteInterval = 10;

    const getOptions = (id: string): Array<number> => Array.from(timepickerPopup.container.querySelector(id)?.options)
      .map((item: any) => +item.textContent);

    expect(timepickerPopup.minuteInterval).toBe(10);
    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#minutes')).toStrictEqual([0, 10, 20, 30, 40, 50]);

    timepickerPopup.setAttribute(attributes.MINUTE_INTERVAL, 1);
    expect(timepickerPopup.minuteInterval).toBe(1);
    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#minutes')).toStrictEqual(Array.from({ length: 60 }).map((_, index) => index));
  });

  it('renders separators', () => {
    timepickerPopup.format = 'hh:mm:ss a';
    timepickerPopup.replaceWith(timepickerPopup);
    expect(timepickerPopup.container?.querySelectorAll('.separator')).toHaveLength(3);

    timepickerPopup.format = 'hh:mm:ss';
    timepickerPopup.replaceWith(timepickerPopup);
    expect(timepickerPopup.container?.querySelectorAll('.separator')).toHaveLength(2);

    timepickerPopup.format = 'hh:mm';
    timepickerPopup.replaceWith(timepickerPopup);
    expect(timepickerPopup.container?.querySelectorAll('.separator')).toHaveLength(1);
  });

  it('renders seconds intervals', () => {
    timepickerPopup.setAttribute(attributes.FORMAT, 'hh:mm:ss');

    timepickerPopup.secondInterval = null;

    // Default value
    expect(timepickerPopup.secondInterval).toEqual(5);

    const getOptions = (id: string): Array<number> => Array.from(timepickerPopup.container.querySelector(id)?.options)
      .map((item: any) => +item.textContent);

    timepickerPopup.secondInterval = 10;
    expect(timepickerPopup.secondInterval).toBe(10);
    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#seconds')).toStrictEqual([0, 10, 20, 30, 40, 50]);

    timepickerPopup.setAttribute(attributes.SECOND_INTERVAL, '1');
    expect(timepickerPopup.secondInterval).toBe(1);
    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#seconds')).toStrictEqual(Array.from({ length: 60 }).map((_, index) => index));
  });

  it('should handle embeddable setting', () => {
    const containerEl = document.querySelector<IdsContainer>('ids-container')!;
    containerEl.insertAdjacentHTML('beforeend', `<ids-time-picker-popup id="embedded" embeddable="true"></ids-time-picker-popup>`);

    const embeddedEl = document.querySelector<IdsTimePickerPopup>('#embedded')!;
    expect(embeddedEl.getAttribute(attributes.EMBEDDABLE)).toBeTruthy();
    expect(embeddedEl.shadowRoot?.querySelector('ids-popup')).toBeNull();
    expect(embeddedEl.shadowRoot?.querySelector('.embedded')).not.toBeNull();

    // Check defaults
    expect(timepickerPopup.getAttribute(attributes.EMBEDDABLE)).toBeFalsy();
    expect(timepickerPopup.shadowRoot?.querySelector('ids-popup')).not.toBeNull();
    expect(timepickerPopup.shadowRoot?.querySelector('.embedded')).toBeNull();
  });

  it('can update the timestring value with the "Set Time" button', () => {
    timepickerPopup.useCurrentTime = false;
    timepickerPopup.autoupdate = false;
    timepickerPopup.format = 'hh:mm';

    timepickerPopup.value = '';
    expect(timepickerPopup.value).toBe('01:00');

    timepickerPopup.hours = 2;
    timepickerPopup.minutes = 30;

    timepickerPopup.show();
    timepickerPopup.applyButtonEl?.click();
    expect(timepickerPopup.value).toBe('02:30');
  });

  it('with autoupdate attribute, can hide the "Set Time" button', () => {
    expect(timepickerPopup.autoupdate).toBeFalsy();
    expect(timepickerPopup.getAttribute(attributes.AUTOUPDATE)).toBeFalsy();
    expect(timepickerPopup.applyButtonEl).toBeDefined();

    timepickerPopup.autoupdate = true;
    expect(timepickerPopup.autoupdate).toBeTruthy();
    expect(timepickerPopup.getAttribute(attributes.AUTOUPDATE)).toBeTruthy();
    expect(timepickerPopup.applyButtonEl?.hidden).toBeTruthy();

    timepickerPopup.autoupdate = false;
    expect(timepickerPopup.autoupdate).toBe(false);
    expect(timepickerPopup.getAttribute(attributes.AUTOUPDATE)).toBeFalsy();
    expect(timepickerPopup.applyButtonEl?.hidden).toBeFalsy();
  });

  it('should handle option to limit hours', () => {
    const getOptions = (id: string): Array<number> => Array.from(timepickerPopup.container.querySelector(id)?.options)
      .map((item: any) => +item.textContent);

    timepickerPopup.value = '';
    timepickerPopup.format = 'HH:mm:ss';
    expect(timepickerPopup.startHour).toBe(0);
    expect(timepickerPopup.endHour).toBe(24);

    timepickerPopup.startHour = 5;
    timepickerPopup.endHour = 15;

    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#hours')).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    timepickerPopup.startHour = 0;
    timepickerPopup.endHour = 5;

    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#hours')).toEqual([0, 1, 2, 3, 4, 5]);

    timepickerPopup.startHour = 12;
    timepickerPopup.endHour = 18;

    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#hours')).toEqual([12, 13, 14, 15, 16, 17, 18]);

    timepickerPopup.startHour = null;
    timepickerPopup.endHour = null;
    expect(timepickerPopup.startHour).toBe(0);
    expect(timepickerPopup.endHour).toBe(24);

    timepickerPopup.format = 'h:mm a';

    timepickerPopup.startHour = 5;
    timepickerPopup.endHour = 15;

    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#hours')).toEqual([5, 6, 7, 8, 9, 10, 11]);

    timepickerPopup.period = 'PM';

    expect(getOptions('#hours')).toEqual([1, 2, 3, 12]);

    timepickerPopup.startHour = 18;
    timepickerPopup.endHour = 23;

    timepickerPopup.replaceWith(timepickerPopup);
    timepickerPopup.period = 'PM';
    expect(getOptions('#hours')).toEqual([6, 7, 8, 9, 10, 11]);

    timepickerPopup.startHour = 0;
    timepickerPopup.endHour = 11;
    timepickerPopup.period = 'AM';
    expect(getOptions('#hours')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    timepickerPopup.startHour = 18;
    timepickerPopup.endHour = 24;
    timepickerPopup.period = 'PM';
    timepickerPopup.replaceWith(timepickerPopup);

    expect(getOptions('#hours')).toEqual([6, 7, 8, 9, 10, 11]);

    timepickerPopup.startHour = 0;
    timepickerPopup.endHour = 13;
    timepickerPopup.period = 'AM';
    timepickerPopup.replaceWith(timepickerPopup);
    expect(getOptions('#hours')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    timepickerPopup.period = 'PM';
    expect(getOptions('#hours')).toEqual([1, 12]);
  });
});
