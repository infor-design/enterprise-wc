import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';
import IdsWeekView from '../../src/components/ids-week-view/ids-week-view';

test.describe('IdsWeekView tests', () => {
  const url = '/ids-week-view/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Week View Component');
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
        .disableRules('scrollable-region-focusable')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test.skip('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-week-view-light');
    });
  });

  test.describe('functionality test', () => {
    let idsWeekView: Locator;

    test.beforeEach(async ({ page }) => {
      idsWeekView = await page.locator('ids-week-view').first();
    });

    test('can append early to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-week-view')! as IdsWeekView;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.setAttribute('id', 'new-week-view');
        elem.name = 'test-week-view';
      });
      await page.locator('#new-week-view').waitFor({ state: 'attached' });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can append late to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-week-view')! as IdsWeekView;
        elem.setAttribute('id', 'new-week-view');
        elem.name = 'test-week-view';
        document.querySelector('ids-container')!.appendChild(elem);
      });
      await page.locator('#new-week-view').waitFor({ state: 'attached' });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can be inserted in an element', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        document.querySelector('ids-container')!.insertAdjacentHTML('beforeend', `<ids-week-view id="new-week-view"></ids-week-view>`);
      });
      await page.locator('#new-week-view').waitFor({ state: 'attached' });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can set/get showToday', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.showToday)).toBeTruthy();
      await expect(idsWeekView).toHaveAttribute('show-today', 'true');

      for (const data of testData) {
        expect(await idsWeekView.evaluate((element: IdsWeekView, tData) => {
          element.showToday = tData as any;
          return element.showToday;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsWeekView).toHaveAttribute('show-today', 'true');
        } else {
          await expect(idsWeekView).not.toHaveAttribute('show-today');
        }
      }
    });

    test.skip('can set/get startDate', async () => {
      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.startDate)).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('start-date');

      expect(await idsWeekView.evaluate((element: IdsWeekView) => {
        element.startDate = '11/11/2011';
        return element.startDate;
      })).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('start-date');

      expect(await idsWeekView.evaluate((element: IdsWeekView) => {
        element.startDate = new Date('2019-10-23T04:00:00.000Z');
        return element.startDate;
      })).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('start-date');

      expect(await idsWeekView.evaluate((element: IdsWeekView) => {
        element.startDate = 'Invalid data';
        return element.startDate;
      })).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('start-date');
    });

    test.skip('can set/get endDate', async () => {
      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.endDate)).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('end-date');

      expect(await idsWeekView.evaluate((element: IdsWeekView) => {
        element.endDate = '11/11/2011';
        return element.endDate;
      })).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('end-date');

      expect(await idsWeekView.evaluate((element: IdsWeekView) => {
        element.endDate = new Date('2019-10-23T04:00:00.000Z');
        return element.endDate;
      })).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('end-date');

      expect(await idsWeekView.evaluate((element: IdsWeekView) => {
        element.endDate = 'Invalid data';
        return element.endDate;
      })).toBeValidDate();
      await expect(idsWeekView).toHaveAttribute('end-date');
    });

    test('can set/get startHour', async () => {
      const defHour = 7;
      const testData = [
        { data: 9, expected: 9 },
        { data: '25', expected: defHour },
        { data: '10', expected: 10 },
        { data: null, expected: defHour },
        { data: 8.5, expected: 8.5 },
        { data: '', expected: defHour },
        { data: 0, expected: 0 },
        { data: '-1', expected: defHour }
      ];

      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.startHour)).toEqual(defHour);
      await expect(idsWeekView).not.toHaveAttribute('start-hour');

      for (const data of testData) {
        expect(await idsWeekView.evaluate((element: IdsWeekView, tData) => {
          element.startHour = tData as any;
          return element.startHour;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null
          && !Number.isNaN(parseFloat(data.data.toString()))
          && parseFloat(data.data.toString()) <= 24
          && parseFloat(data.data.toString()) >= 0
        ) {
          await expect(idsWeekView).toHaveAttribute('start-hour', data.expected.toString());
        } else {
          await expect(idsWeekView).not.toHaveAttribute('start-hour');
        }
      }
    });

    test('can set/get endHour', async () => {
      const defHour = 19;
      const testData = [
        { data: 9, expected: 9 },
        { data: '25', expected: defHour },
        { data: '10', expected: 10 },
        { data: null, expected: defHour },
        { data: 8.5, expected: 8.5 },
        { data: '', expected: defHour },
        { data: 0, expected: 0 },
        { data: '-1', expected: defHour }
      ];

      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.endHour)).toEqual(defHour);
      await expect(idsWeekView).not.toHaveAttribute('end-hour');

      for (const data of testData) {
        expect(await idsWeekView.evaluate((element: IdsWeekView, tData) => {
          element.endHour = tData as any;
          return element.endHour;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null
          && !Number.isNaN(parseFloat(data.data.toString()))
          && parseFloat(data.data.toString()) <= 24
          && parseFloat(data.data.toString()) >= 0
        ) {
          await expect(idsWeekView).toHaveAttribute('end-hour', data.expected.toString());
        } else {
          await expect(idsWeekView).not.toHaveAttribute('end-hour');
        }
      }
    });

    test('can set/get showTimeline', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.showTimeline)).toBeFalsy();
      await expect(idsWeekView).toHaveAttribute('show-timeline', 'false');

      for (const data of testData) {
        expect(await idsWeekView.evaluate((element: IdsWeekView, tData) => {
          element.showTimeline = tData as any;
          return element.showTimeline;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsWeekView).toHaveAttribute('show-timeline', 'true');
        } else {
          await expect(idsWeekView).toHaveAttribute('show-timeline', 'false');
        }
      }
    });

    test('can set/get timelineInterval', async () => {
      const defTime = 30000;
      const testData = [
        { data: '1000', expected: 1000 },
        { data: 0, expected: defTime },
        { data: 3000, expected: 3000 },
        { data: null, expected: defTime },
        { data: '5.5', expected: 5.5 },
        { data: '', expected: defTime }
      ];

      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.timelineInterval)).toEqual(defTime);
      await expect(idsWeekView).not.toHaveAttribute('timeline-interval');

      for (const data of testData) {
        expect(await idsWeekView.evaluate((element: IdsWeekView, tData) => {
          element.timelineInterval = tData as any;
          return element.timelineInterval;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null
          && !Number.isNaN(parseFloat(data.data.toString()))
          && parseFloat(data.data.toString()) > 0
        ) {
          await expect(idsWeekView).toHaveAttribute('timeline-interval', data.expected.toString());
        } else {
          await expect(idsWeekView).not.toHaveAttribute('timeline-interval');
        }
      }
    });

    test('can trigger calendar event\'s events', async ({ eventsTest }) => {
      const eventItems = [
        {
          id: '1',
          subject: 'Intraday Event',
          starts: '2019-10-23T12:00:00.000',
          ends: '2019-10-23T12:15:00.000',
          type: 'dto',
          isAllDay: 'false'
        },
        {
          id: '2',
          subject: 'All Day Event',
          starts: '2019-10-24T00:00:00.000',
          ends: '2019-10-24T23:59:59.999',
          type: 'admin',
          isAllDay: 'true'
        }
      ];

      const eventTypes = [
        {
          id: 'dto',
          label: 'Discretionary Time Off',
          translationKey: 'DiscretionaryTimeOff',
          color: 'blue',
          checked: true
        },
        {
          id: 'admin',
          label: 'Admin',
          translationKey: 'AdministrativeLeave',
          color: 'purple',
          checked: true
        }
      ];
      const handle = (await idsWeekView.elementHandle())!;
      await eventsTest.onEvent('ids-week-view', 'beforeeventrendered', handle);
      await eventsTest.onEvent('ids-week-view', 'aftereventrendered', handle);

      await idsWeekView.evaluate((element: IdsWeekView, data: any) => {
        element.eventTypesData = data.eventTypes;
        element.eventsData = data.eventItems;
      }, { eventItems, eventTypes });

      expect(await eventsTest.isEventTriggered('ids-week-view', 'beforeeventrendered')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('ids-week-view', 'aftereventrendered')).toBeTruthy();
    });
  });
});
