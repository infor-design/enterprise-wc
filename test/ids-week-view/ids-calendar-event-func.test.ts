/**
 * @jest-environment jsdom
 */
import '../../src/mixins/ids-locale-mixin/ids-locale-mixin';
import '../../src/components/ids-text/ids-text';
import IdsCalendarEvent from '../../src/components/ids-week-view/ids-calendar-event';
import IdsContainer from '../../src/components/ids-container/ids-container';
import wait from '../helpers/wait';

const EVENT_ITEM = {
  id: '9',
  subject: 'Autumn Foliage Trip',
  shortSubject: 'Autumn Foliage Trip',
  comments: 'Autumn Foliage Trip',
  status: 'Pending',
  starts: '2018-10-22T00:00:00.000',
  ends: '2018-10-22T02:00:00.000',
  icon: 'clock',
  type: 'dto',
  isAllDay: 'false'
};

const EVENT_TYPE = {
  id: 'dto',
  label: 'Discretionary Time Off',
  translationKey: 'DiscretionaryTimeOff',
  color: 'azure',
  checked: true
};

describe('IdsCalendarEvent Component', () => {
  const name = 'ids-calendar-event';
  let idsContainer: any;
  let calendarEvent: any;
  let idsText: any;

  beforeAll(() => {
    idsContainer = new IdsContainer();
    document.body.appendChild(idsContainer);
  });

  beforeEach(() => {
    idsContainer.innerHTML = '';
    calendarEvent = new IdsCalendarEvent();
    calendarEvent.eventType = EVENT_TYPE;
    calendarEvent.event = EVENT_ITEM;
    idsText = calendarEvent.container.querySelector('ids-text');
    idsContainer.appendChild(calendarEvent);
    idsContainer.setLocale('en-US');
    idsContainer.setLanguage('en');
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');
    calendarEvent.eventType = EVENT_TYPE;
    calendarEvent.event = EVENT_ITEM;

    expect(document.querySelector('ids-calendar-event')).toBeDefined();
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    calendarEvent.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('caches event data', () => {
    expect(calendarEvent.event).toEqual(EVENT_ITEM);
    expect(calendarEvent.eventType).toEqual(EVENT_TYPE);
  });

  it('calculates duration in hours', () => {
    expect(calendarEvent.duration).toEqual(2);

    // set duration to 2.5 hours
    const twoHalfHourEvent = {
      ...EVENT_ITEM,
      starts: '2018-10-22T00:00:00.000',
      ends: '2018-10-22T02:30:00.000',
    };

    calendarEvent.event = twoHalfHourEvent;
    expect(calendarEvent.duration).toEqual(2.5);
  });

  it('allows setting width and height', () => {
    const width = '50px';
    calendarEvent.width = width;
    expect(calendarEvent.width).toEqual(width);
    expect(calendarEvent.container.style.width).toEqual(width);

    const height = '100px';
    calendarEvent.height = height;
    expect(calendarEvent.height).toEqual(height);
    expect(calendarEvent.container.style.height).toEqual(height);
  });

  it('allows setting x any y offsets', () => {
    const yOffset = '10px';
    calendarEvent.yOffset = yOffset;
    expect(calendarEvent.yOffset).toEqual(yOffset);
    expect(calendarEvent.container.style.top).toEqual(yOffset);

    const xOffset = '5px';
    calendarEvent.xOffset = xOffset;
    expect(calendarEvent.xOffset).toEqual(xOffset);
    expect(calendarEvent.container.style.left).toEqual(xOffset);

    // test rtl
    idsContainer.setLocale('ar-SA');
    idsContainer.setLanguage('ar');
    calendarEvent.xOffset = xOffset;
    expect(calendarEvent.container.style.right).toEqual(xOffset);
  });

  it('allows setting extra css classes', () => {
    const cssClass = 'dummy-class';
    calendarEvent.cssClass = [cssClass];
    expect(calendarEvent.container.classList.contains(cssClass)).toBeTruthy();
  });

  it('allows setting overflow', () => {
    // ellipsis by default
    expect(calendarEvent.overflow).toEqual('ellipsis');
    expect(idsText.overflow).toEqual('ellipsis');

    const overflow = 'normal';
    calendarEvent.overflow = overflow;
    expect(calendarEvent.overflow).toEqual(overflow);
  });

  it('displays hour range when displayTime is set', () => {
    calendarEvent.displayTime = true;
    expect(calendarEvent.getDisplayTime()).toEqual('12 - 2:00 AM');
    calendarEvent.displayTime = false;
    expect(calendarEvent.getDisplayTime()).toEqual('');
  });

  it('triggers event when clicked', async () => {
    const spy = jest.spyOn(calendarEvent, 'triggerEvent');
    const clickEvent = new MouseEvent('click');
    calendarEvent.container.dispatchEvent(clickEvent);
    await wait(1000);
    expect(spy).toHaveBeenCalled();
  });

  it('triggers event when dbl clicked', () => {
    const spy = jest.spyOn(calendarEvent, 'triggerEvent');
    const clickEvent = new MouseEvent('dblclick');
    calendarEvent.container.dispatchEvent(clickEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can render without event type', () => {
    const errors = jest.spyOn(global.console, 'error');
    calendarEvent.eventType = null;
    expect(errors).not.toHaveBeenCalled();
  });
});
