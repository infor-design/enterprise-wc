/**
 * @jest-environment jsdom
 */
import '../../src/mixins/ids-locale-mixin/ids-locale-mixin';
import '../../src/components/ids-text/ids-text';
import IdsCalendarEvent from '../../src/components/ids-calendar/ids-calendar-event';
import IdsContainer from '../../src/components/ids-container/ids-container';

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
  color: 'blue',
  checked: true
};

describe('IdsCalendarEvent Component', () => {
  const name = 'ids-calendar-event';
  let idsContainer: any;
  let calendarEvent: any;

  beforeAll(() => {
    idsContainer = new IdsContainer();
    document.body.appendChild(idsContainer);
  });

  beforeEach(() => {
    calendarEvent = new IdsCalendarEvent();
    calendarEvent.eventTypeData = EVENT_TYPE;
    calendarEvent.eventData = EVENT_ITEM;
    idsContainer.appendChild(calendarEvent);
  });

  afterEach(() => {
    idsContainer.innerHTML = '';
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');
    calendarEvent.eventTypeData = EVENT_TYPE;
    calendarEvent.eventData = EVENT_ITEM;

    expect(document.querySelector('ids-calendar-event')).toBeDefined();
    expect(errors).not.toHaveBeenCalled();
  });

  test('can be instantiated with createElement', () => {
    const errors = jest.spyOn(global.console, 'error');
    document.createElement('ids-calendar-event');
    expect(errors).not.toHaveBeenCalled();
  });

  test('caches event data', () => {
    expect(calendarEvent.eventData).toEqual(EVENT_ITEM);
    expect(calendarEvent.eventTypeData).toEqual(EVENT_TYPE);
  });

  test('calculates duration in hours', () => {
    expect(calendarEvent.duration).toEqual(2);

    // set duration to 2.5 hours
    const twoHalfHourEvent = {
      ...EVENT_ITEM,
      starts: '2018-10-22T00:00:00.000',
      ends: '2018-10-22T02:30:00.000',
    };

    calendarEvent.eventData = twoHalfHourEvent;
    expect(calendarEvent.duration).toEqual(2.5);
  });

  test('allows setting width and height', () => {
    const width = '50px';
    calendarEvent.width = width;
    expect(calendarEvent.width).toEqual(width);
    expect(calendarEvent.container.style.width).toEqual(width);

    const height = '100px';
    calendarEvent.height = height;
    expect(calendarEvent.height).toEqual(height);
    expect(calendarEvent.container.style.height).toEqual(height);
  });

  test('allows setting x any y offsets', () => {
    const yOffset = '10px';
    calendarEvent.yOffset = yOffset;
    expect(calendarEvent.yOffset).toEqual(yOffset);
    expect(calendarEvent.container.style.top).toEqual(yOffset);

    const xOffset = '5px';
    calendarEvent.xOffset = xOffset;
    expect(calendarEvent.xOffset).toEqual(xOffset);
    expect(calendarEvent.container.style.left).toEqual(xOffset);
  });

  test('allows setting extra css classes', () => {
    const cssClass = 'dummy-class';
    calendarEvent.cssClass = [cssClass];
    expect(calendarEvent.container.classList.contains(cssClass)).toBeTruthy();
  });

  test('allows setting overflow', () => {
    // ellipsis by default
    expect(calendarEvent.overflow).toEqual('ellipsis');

    const overflow = 'normal';
    calendarEvent.overflow = overflow;
    expect(calendarEvent.overflow).toEqual(overflow);
  });

  test('displays hour range when displayTime is set', () => {
    calendarEvent.displayTime = true;
    expect(calendarEvent.getDisplayTime()).toEqual('12 - 2:00 AM');
    calendarEvent.displayTime = false;
    expect(calendarEvent.getDisplayTime()).toEqual('');
  });

  test('can render without event type', () => {
    const errors = jest.spyOn(global.console, 'error');
    calendarEvent.eventTypeData = null;
    expect(errors).not.toHaveBeenCalled();
  });
});
