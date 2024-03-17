import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCalendar from '../../src/components/ids-calendar/ids-calendar';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsCalendarEvent from '../../src/components/ids-calendar/ids-calendar-event';
import { isValidDate } from '../../src/utils/ids-date-utils/ids-date-utils';

test.describe('IdsCalendar tests', () => {
  const url = '/ids-calendar/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Calendar Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .disableRules(['color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-calendar');
      const html = await handle?.evaluate((el: IdsCalendar) => el?.outerHTML);
      await expect(html).toMatchSnapshot('calendar-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-calendar');
      const html = await handle?.evaluate((el: IdsCalendar) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('calendar-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-calendar-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should set suppress-form', async ({ page }) => {
      const locator = await page.locator('ids-calendar').first();
      const handle = await page.$('ids-calendar');
      expect(await handle?.evaluate((el: IdsCalendar) => {
        el.suppressForm = true;
        return el.suppressForm;
      })).toBeTruthy();
      await expect(await locator.getAttribute('suppress-form')).toEqual('');
      expect(await handle?.evaluate((el: IdsCalendar) => {
        el.suppressForm = false;
        return el.suppressForm;
      })).toBeFalsy();
      await expect(await locator.getAttribute('suppress-form')).toEqual(null);
    });

    test('should set day, month, year', async ({ page }) => {
      const handle = await page.$('ids-calendar');

      const date = await handle?.evaluate((calendar: IdsCalendar) => {
        const day = 5;
        const month = 11;
        const year = 2019;
        calendar.date = `${month}/${day}/${year}`;
        return calendar.date;
      });

      expect(date?.getDate()).toEqual(5);
      expect(date?.getMonth()).toEqual(10);
      expect(date?.getFullYear()).toEqual(2019);
    });

    test('should set visiblity of panes', async ({ page }) => {
      const locator = await page.locator('ids-calendar').first();
      const handle = await page.$('ids-calendar');

      // set showing legend and details to true
      await handle?.evaluate((calendar: IdsCalendar) => {
        calendar.showLegend = true;
        calendar.showDetails = true;
      });
      expect(await locator.getAttribute('show-legend')).toEqual('');
      expect(await locator.getAttribute('show-details')).toEqual('');

      // set showing legend and details to false
      await handle?.evaluate((calendar: IdsCalendar) => {
        calendar.showLegend = false;
        calendar.showDetails = false;
      });
      expect(await locator.getAttribute('show-legend')).toEqual(null);
      expect(await locator.getAttribute('show-details')).toEqual(null);
    });
  });

  test.describe('methods/api', () => {
    test('should change view with changeView()', async ({ page }) => {
      const handle = await page.$('ids-calendar');
      let view = '';

      // set to week view
      await handle?.evaluate((calendar: IdsCalendar) => calendar.changeView('week'));
      view = await handle?.evaluate((calendar: IdsCalendar) => calendar.state.view);
      expect(view).toEqual('week');

      // set to day view
      await handle?.evaluate((calendar: IdsCalendar) => calendar.changeView('day'));
      view = await handle?.evaluate((calendar: IdsCalendar) => calendar.state.view);
      expect(view).toEqual('day');

      // set to month view
      await handle?.evaluate((calendar: IdsCalendar) => calendar.changeView('month'));
      view = await handle?.evaluate((calendar: IdsCalendar) => calendar.state.view);
      expect(view).toEqual('month');
    });
  });

  test.describe('calendar functionality tests', async () => {
    let idsCalendar: Locator;

    test.beforeEach(async ({ page }) => {
      idsCalendar = await page.locator('ids-calendar');
    });

    test('can create element via document.createElement', async ({ page }) => {
      const id = 'new-calendar-test';
      await page.evaluate((elementId) => {
        const idsCal = document.createElement('ids-calendar');
        idsCal.setAttribute('id', elementId);
        (document.querySelector<IdsContainer>('ids-container'))!.appendChild(idsCal);
      }, id);
      await expect(page.locator(`ids-calendar[id="${id}"]`)).toBeAttached();
    });

    test('can create new calendar event', async () => {
      await expect(idsCalendar.locator('ids-calendar-event[data-id="test-event-non-modal"]')).not.toBeAttached();
      await idsCalendar.evaluate((element: IdsCalendar) => {
        element.date = new Date();
        element.createNewEvent('test-event-non-modal');
      });
      await expect(idsCalendar.locator('ids-calendar-event[data-id="test-event-non-modal"]')).toBeAttached();

      await expect(idsCalendar.locator('#event-form-popup')).not.toBeAttached();
      await idsCalendar.evaluate((element: IdsCalendar) => {
        element.date = new Date();
        element.createNewEvent('test-event-modal', true);
      });
      await expect(idsCalendar.locator('#event-form-popup')).toBeAttached();
    });

    test('can set/get showToday', async () => {
      const todayBtn = await idsCalendar.locator('#calendar-toolbar > ids-toolbar-section > ids-button.btn-today');

      await expect(todayBtn).toBeAttached();

      expect(await idsCalendar.evaluate((element: IdsCalendar) => {
        element.showToday = false;
        return element.showToday;
      })).toBeFalsy();
      await expect(todayBtn).not.toBeAttached();

      expect(await idsCalendar.evaluate((element: IdsCalendar) => {
        element.showToday = true;
        return element.showToday;
      })).toBeTruthy();
      await expect(todayBtn).toBeAttached();
    });

    test('can set/get date', async () => {
      const currDate = new Intl.DateTimeFormat('en-US').format(new Date());
      expect(new Intl.DateTimeFormat('en-US').format(await idsCalendar.evaluate((element: IdsCalendar, date) => {
        element.date = date;
        return element.date;
      }, currDate))).toEqual(currDate);

      expect(isValidDate(await idsCalendar.evaluate((element: IdsCalendar) => {
        element.date = 'invalid';
        return element.date;
      }))).toBeTruthy();

      // forces an invalid date and retrieve it
      expect(isValidDate(await idsCalendar.evaluate((element: IdsCalendar) => {
        element.setAttribute('date', 'invalid');
        return element.date;
      }))).toBeTruthy();
    });

    test('can change to day view by the overflow-click event', async () => {
      await idsCalendar.evaluate((element: IdsCalendar) => {
        element.triggerEvent('overflow-click', element.container, { detail: { date: new Date() } });
      });

      const viewMonth = idsCalendar.locator('div[class="calendar-view-pane"] > ids-month-view');
      const viewWeek = idsCalendar.locator('div[class="calendar-view-pane"] > ids-week-view');

      await expect(viewMonth).not.toBeAttached();
      await expect(viewWeek).toBeAttached();

      // start date and end date must be the same for the day view
      const startDate = await viewWeek.getAttribute('start-date');
      await expect(viewWeek).toHaveAttribute('end-date', startDate!);
    });

    test('can change view by the viewchange event', async () => {
      const viewMonth = await idsCalendar.locator('div[class="calendar-view-pane"] > ids-month-view');
      const viewWeek = await idsCalendar.locator('div[class="calendar-view-pane"] > ids-week-view');
      await idsCalendar.evaluate((element: IdsCalendar) => {
        element.triggerEvent('viewchange', element, { detail: { date: new Date(), view: 'day' } });
      });
      await expect(viewMonth).not.toBeAttached();
      await expect(viewWeek).toBeAttached();
      // start date and end date must be the same for the day view
      const startDate = await viewWeek.getAttribute('start-date');
      await expect(viewWeek).toHaveAttribute('end-date', startDate!);
    });

    test('can have events presist on different views', async () => {
      const testDate = {
        day: 21,
        month: 10,
        year: 2019,
      };
      // Save the events details for later comparison
      let expectedEvents = await idsCalendar.evaluate((element: IdsCalendar) => element.eventsData);
      expectedEvents = expectedEvents.filter((calEvent) => calEvent.starts.includes(`${testDate.year}-${testDate.month}-${testDate.day}`));

      // day view
      let actualEvents = await idsCalendar.evaluate((element: IdsCalendar, date) => {
        element.date = `${date.month}/${date.day}/${date.year}`;
        element.changeView('day');
        return element.eventsData;
      }, testDate);
      expect(actualEvents.filter((calEvent) => calEvent.starts.includes(`${testDate.year}-${testDate.month}-${testDate.day}`))).toEqual(expectedEvents);

      // week view
      actualEvents = await idsCalendar.evaluate((element: IdsCalendar) => {
        element.changeView('week');
        return element.eventsData;
      });
      expect(actualEvents.filter((calEvent) => calEvent.starts.includes(`${testDate.year}-${testDate.month}-${testDate.day}`))).toEqual(expectedEvents);

      // month view
      actualEvents = await idsCalendar.evaluate((element: IdsCalendar) => {
        element.changeView('month');
        return element.eventsData;
      });
      expect(actualEvents.filter((calEvent) => calEvent.starts.includes(`${testDate.year}-${testDate.month}-${testDate.day}`))).toEqual(expectedEvents);
    });

    // has issues - date returning 12 hours less
    test('can format duration/date range strings', async () => {
      let testData: any = [
        { start: new Date(2022, 7, 15), end: new Date(2022, 7, 18), expected: '3 Days' },
        { start: new Date(2022, 7, 15), end: new Date(2022, 7, 15, 3), expected: '3 Hours' },
        { start: new Date(2022, 7, 15, 0, 10), end: new Date(2022, 7, 15, 0, 15), expected: '5 Minutes' }
      ];
      for (const data of testData) {
        const actual = await idsCalendar.evaluate(
          (element: IdsCalendar, tData) => element.formatDuration(tData.start, tData.end).trim(),
          data
        );
        expect(actual).toEqual(data.expected);
      }
      // When running locally the dates returning are 12 hours less
      // Expected: "August 15, 2022 at 12:00 AM - August 18, 2022 at 12:00 AM"
      // Received: "August 14, 2022 at 12:00 PM - August 17, 2022 at 12:00 PM"
      testData = { start: new Date(2022, 7, 15), end: new Date(2022, 7, 18) };
      expect(await idsCalendar.evaluate(
        (element: IdsCalendar, data: any) => element.formatDateRange(data.start, data.end),
        testData
      )).not.toBeNull();
    });

    test('can show event details when dayselected event is triggered', async () => {
      const testData = {
        day: 24,
        month: 10,
        year: 2019
      };
      const selectedDay = await idsCalendar.locator(`ids-month-view td[data-year="${testData.year}"]`
        + `[data-month="${testData.month - 1}"][data-day="${testData.day}"]:has(ids-calendar-event)`);
      const accordionPanels = await idsCalendar.locator(':scope > div > div.calendar-details-pane > ids-accordion > ids-accordion-panel');
      await expect(accordionPanels).toHaveCount(7);
      const isTriggered = await selectedDay.evaluate((element) => {
        let daySelected = false;
        const calendar = document.querySelector('ids-calendar');
        calendar!.addEventListener('dayselected', () => { daySelected = true; });
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return daySelected;
      });
      expect(isTriggered).toBeTruthy();
      await expect(accordionPanels).toHaveCount(1);
    });

    test('can clear calendar events', async () => {
      expect((await idsCalendar.evaluate((element: IdsCalendar) => element.eventsData)).length).toBeGreaterThan(0);
      await idsCalendar.evaluate((element: IdsCalendar) => element.clearEvents());
      expect((await idsCalendar.evaluate((element: IdsCalendar) => element.eventsData)).length).toEqual(0);
    });

    test('can add/update calendar event', async () => {
      const newEvent = {
        id: 'new-event-test',
        subject: 'Automation Event',
        starts: '2019-10-10T12:00:00.000',
        ends: '2019-10-10T12:15:00.000',
        type: 'dto',
        isAllDay: 'false',
        status: 'test status',
        comments: 'test comment'
      };

      // Add
      await expect(idsCalendar.locator('ids-calendar-event[data-id="new-event-test"]')).not.toBeAttached();
      await idsCalendar.evaluate((element: IdsCalendar, calEvent) => element.addEvent(calEvent), newEvent);
      expect(await idsCalendar.evaluate((element: IdsCalendar) => element.eventsData)).toContainEqual(newEvent);
      await expect(idsCalendar.locator('ids-calendar-event[data-id="new-event-test"]')).toBeAttached();

      // Update
      newEvent.subject = 'Modified Automation Event';
      await idsCalendar.evaluate((element: IdsCalendar, calEvent) => element.updateEvent(calEvent), newEvent);
      expect(await idsCalendar.evaluate((element: IdsCalendar) => element.eventsData)).toContainEqual(newEvent);
      await expect(idsCalendar.locator('ids-calendar-event[data-id="new-event-test"]')).toBeAttached();
    });

    test('can return startDate and endDate properties', async () => {
      const result = await idsCalendar.evaluate(
        (element: IdsCalendar) => ({ startDate: element.startDate, endDate: element.endDate })
      );
      expect(result.startDate).not.toBeNull();
      expect(result.endDate).not.toBeNull();
    });
  });

  test.describe('calendar event functionality tests', async () => {
    let idsCalendarEvent: Locator;

    test.beforeEach(async ({ page }) => {
      idsCalendarEvent = await page.locator('ids-calendar ids-month-view ids-calendar-event[data-id="49"]');
    });

    test('can render calendar event', async ({ page }) => {
      await page.evaluate(() => {
        const calEvt = document.createElement('ids-calendar-event');
        calEvt.setAttribute('id', 'new-cal-event');
        document.querySelector('ids-container')?.appendChild(calEvt);
      });
      await expect(page.locator('#new-cal-event')).toBeAttached();
    });

    test('can get calendar event data', async () => {
      const calEventsData = await idsCalendarEvent.evaluate(
        (element: IdsCalendarEvent) => ({ eventTypeData: element.eventTypeData, eventData: element.eventData })
      );
      expect(calEventsData.eventData).not.toBeNull();
      expect(calEventsData.eventTypeData).not.toBeNull();
    });

    test('can return calendar event duration', async () => {
      const calEventsData = await idsCalendarEvent.evaluate(
        (element: IdsCalendarEvent) => ({ eventData: element.eventData, duration: element.duration })
      );
      calEventsData.eventData!.starts = '2019-10-24T13:00:00.000';
      calEventsData.eventData!.ends = '2019-10-24T15:30:00.000';
      expect(await idsCalendarEvent.evaluate((element: IdsCalendarEvent, modEvent) => {
        element.eventData = modEvent;
        return element.duration;
      }, calEventsData.eventData)).toEqual(2.5);
    });

    test('can set calendar event width and height', async () => {
      await expect(idsCalendarEvent).not.toHaveAttribute('width');
      await expect(idsCalendarEvent).not.toHaveAttribute('height');

      const width = '50px';
      await idsCalendarEvent.evaluate((element: IdsCalendarEvent, mWidth) => { element.width = mWidth; }, width);
      await expect(idsCalendarEvent).toHaveAttribute('width', width);
      await expect(idsCalendarEvent.locator('a')).toHaveAttribute('style', new RegExp(`width: ${width};`, 'g'));

      const height = '100px';
      await idsCalendarEvent.evaluate((element: IdsCalendarEvent, mHeight) => { element.height = mHeight; }, height);
      await expect(idsCalendarEvent).toHaveAttribute('height', height);
      await expect(idsCalendarEvent.locator('a')).toHaveAttribute('style', new RegExp(`height: ${height};`, 'g'));
    });

    test('can set x and y offsets', async () => {
      const yOffset = '10px';
      const beforeYOffset = await idsCalendarEvent.evaluate((element: IdsCalendarEvent, offset) => {
        const beforeOff = element.yOffset;
        element.yOffset = offset;
        return beforeOff;
      }, yOffset);
      expect(yOffset).not.toEqual(beforeYOffset);
      await expect(idsCalendarEvent).toHaveAttribute('y-offset', yOffset);

      const xOffset = '5px';
      const beforeXOffset = await idsCalendarEvent.evaluate((element: IdsCalendarEvent, offset) => {
        const beforeOff = element.xOffset;
        element.xOffset = offset;
        return beforeOff;
      }, xOffset);
      expect(xOffset).not.toEqual(beforeXOffset);
      await expect(idsCalendarEvent).toHaveAttribute('x-offset', xOffset);
    });

    test('can set extra css class', async () => {
      const cssClass = 'dummy-class';
      await expect(idsCalendarEvent.locator('a')).not.toHaveClass(new RegExp(cssClass, 'g'));
      await idsCalendarEvent.evaluate((element: IdsCalendarEvent, nClass) => { element.cssClass = [nClass]; }, cssClass);
      await expect(idsCalendarEvent.locator('a')).toHaveClass(new RegExp(cssClass, 'g'));
    });

    test('can set overflow value', async () => {
      const overFlowValues = ['ellipsis', 'normal', null];
      await expect(idsCalendarEvent).not.toHaveAttribute('overflow');
      for (const overFlow of overFlowValues) {
        await idsCalendarEvent.evaluate((element: IdsCalendarEvent, oValue) => { element.overflow = oValue; }, overFlow);
        await expect(idsCalendarEvent).toHaveAttribute('overflow', (overFlow) ?? 'ellipsis');
      }
    });

    test('can display hour range with displayTime', async () => {
      // returns time
      expect(await idsCalendarEvent.evaluate((element: IdsCalendarEvent) => {
        element.displayTime = true;
        return element.getDisplayTime();
      })).not.toBeNull();

      // returns empty string
      expect(await idsCalendarEvent.evaluate((element: IdsCalendarEvent) => {
        element.displayTime = false;
        return element.getDisplayTime();
      })).toHaveLength(0);
    });
  });
});
