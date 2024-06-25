import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';

import IdsMonthView from '../../src/components/ids-month-view/ids-month-view';

test.describe('IdsMonthView tests', () => {
  const url = '/ids-month-view/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Month View Component');
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
        .disableRules(['color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-month-view');
      const html = await handle?.evaluate((el: IdsMonthView) => el?.outerHTML);
      await expect(html).toMatchSnapshot('month-view-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-month-view');
      const html = await handle?.evaluate((el: IdsMonthView) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('month-view-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-month-view-light');
    });
  });

  test.describe('functionality test', () => {
    let idsMonthView: Locator;

    test.beforeEach(async ({ page }) => {
      idsMonthView = await page.locator('ids-month-view');
    });

    test('can append early to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-month-view')! as IdsMonthView;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.setAttribute('id', 'new-month-view');
        elem.name = 'test-month-view';
      });
      await page.locator('#new-month-view').waitFor({ state: 'attached' });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can append late to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-month-view')! as IdsMonthView;
        elem.setAttribute('id', 'new-month-view');
        elem.name = 'test-month-view';
        document.querySelector('ids-container')!.appendChild(elem);
      });
      await page.locator('#new-month-view').waitFor({ state: 'attached' });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can be inserted in an element', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        document.querySelector('ids-container')!.insertAdjacentHTML('beforeend', `<ids-month-view id="new-month-view"></ids-month-view>`);
      });
      await page.locator('#new-month-view').waitFor({ state: 'attached' });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can set/get startDate', async () => {
      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.startDate)).toBeNull();
      await expect(idsMonthView).not.toHaveAttribute('start-date');

      expect(await idsMonthView.evaluate((element: IdsMonthView) => {
        element.startDate = '11/11/2011';
        return element.startDate;
      })).toBeValidDate();
      await expect(idsMonthView).toHaveAttribute('start-date');

      expect(await idsMonthView.evaluate((element: IdsMonthView) => {
        element.startDate = new Date('2019-10-23T04:00:00.000Z');
        return element.startDate;
      })).toBeValidDate();
      await expect(idsMonthView).toHaveAttribute('start-date');

      expect(await idsMonthView.evaluate((element: IdsMonthView) => {
        element.startDate = 'Invalid data';
        return element.startDate;
      })).toBeNull();
      await expect(idsMonthView).toHaveAttribute('start-date');
    });

    test('can set/get endDate', async () => {
      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.endDate)).toBeNull();
      await expect(idsMonthView).not.toHaveAttribute('end-date');

      expect(await idsMonthView.evaluate((element: IdsMonthView) => {
        element.endDate = '11/11/2011';
        return element.endDate;
      })).toBeValidDate();
      await expect(idsMonthView).toHaveAttribute('end-date');

      expect(await idsMonthView.evaluate((element: IdsMonthView) => {
        element.endDate = new Date('2019-10-23T04:00:00.000Z');
        return element.endDate;
      })).toBeValidDate();
      await expect(idsMonthView).toHaveAttribute('end-date');

      expect(await idsMonthView.evaluate((element: IdsMonthView) => {
        element.endDate = 'Invalid data';
        return element.endDate;
      })).toBeNull();
      await expect(idsMonthView).toHaveAttribute('end-date');
    });

    test('can set/get compact', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.compact)).toBeFalsy();
      await expect(idsMonthView).not.toHaveAttribute('compact');

      for (const data of testData) {
        expect(await idsMonthView.evaluate((element: IdsMonthView, tData) => {
          element.compact = tData as any;
          return element.compact;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMonthView).toHaveAttribute('compact');
        } else {
          await expect(idsMonthView).not.toHaveAttribute('compact');
        }
      }
    });

    test('can set/get showWeekNumbers', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.showWeekNumbers)).toBeFalsy();
      await expect(idsMonthView).not.toHaveAttribute('show-week-numbers');

      for (const data of testData) {
        expect(await idsMonthView.evaluate((element: IdsMonthView, tData) => {
          element.showWeekNumbers = tData as any;
          return element.showWeekNumbers;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMonthView).toHaveAttribute('show-week-numbers');
        } else {
          await expect(idsMonthView).not.toHaveAttribute('show-week-numbers');
        }
      }
    });

    test('can set/get isDatePicker', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.isDatePicker)).toBeFalsy();
      await expect(idsMonthView).not.toHaveAttribute('is-date-picker');

      for (const data of testData) {
        expect(await idsMonthView.evaluate((element: IdsMonthView, tData) => {
          element.isDatePicker = tData as any;
          return element.isDatePicker;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMonthView).toHaveAttribute('is-date-picker');
        } else {
          await expect(idsMonthView).not.toHaveAttribute('is-date-picker');
        }
      }
    });

    test('can set/get showPicklistYear', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.showPicklistYear)).toBeTruthy();
      await expect(idsMonthView).not.toHaveAttribute('show-picklist-year');

      for (const data of testData) {
        expect(await idsMonthView.evaluate((element: IdsMonthView, tData) => {
          element.showPicklistYear = tData as any;
          return element.showPicklistYear;
        }, data.data)).toEqual(data.expected);
        await expect(idsMonthView).toHaveAttribute('show-picklist-year', data.expected.toString());
      }
    });

    test('can set/get showPicklistMonth', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.showPicklistMonth)).toBeTruthy();
      await expect(idsMonthView).not.toHaveAttribute('show-picklist-month');

      for (const data of testData) {
        expect(await idsMonthView.evaluate((element: IdsMonthView, tData) => {
          element.showPicklistMonth = tData as any;
          return element.showPicklistMonth;
        }, data.data)).toEqual(data.expected);
        await expect(idsMonthView).toHaveAttribute('show-picklist-month', data.expected.toString());
      }
    });

    test('can set/get showPicklistWeek', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMonthView.evaluate((element: IdsMonthView) => element.showPicklistWeek)).toBeFalsy();
      await expect(idsMonthView).not.toHaveAttribute('show-picklist-week');

      for (const data of testData) {
        expect(await idsMonthView.evaluate((element: IdsMonthView, tData) => {
          element.showPicklistWeek = tData as any;
          return element.showPicklistWeek;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMonthView).toHaveAttribute('show-picklist-week');
        } else {
          await expect(idsMonthView).not.toHaveAttribute('show-picklist-week');
        }
      }
    });

    test('can disable days using dayOfWeek', async () => {
      const sundays = await idsMonthView.locator('.month-view-table tr td:first-child').all();
      const saturdays = await idsMonthView.locator('.month-view-table tr td:last-child').all();

      sundays.forEach(async (sunday) => { await expect(sunday).not.toHaveClass(/is-disabled/); });
      saturdays.forEach(async (sunday) => { await expect(sunday).not.toHaveClass(/is-disabled/); });

      await idsMonthView.evaluate((element: IdsMonthView) => { element.disableSettings = { dayOfWeek: [0, 6] }; });
      await idsMonthView.waitFor();

      sundays.forEach(async (sunday) => { await expect(sunday).toHaveClass(/is-disabled/); });
      saturdays.forEach(async (sunday) => { await expect(sunday).toHaveClass(/is-disabled/); });
    });

    test('can disable days using dates', async () => {
      const firstDay = await idsMonthView.locator('.month-view-table tr td[aria-label="Monday, November 15, 2021"]');
      const secondDay = await idsMonthView.locator('.month-view-table tr td[aria-label="Tuesday, November 16, 2021"]');

      await expect(firstDay).not.toHaveClass(/is-disabled/);
      await expect(secondDay).not.toHaveClass(/is-disabled/);

      await idsMonthView.evaluate((element: IdsMonthView) => { element.disableSettings = { dates: ['11/15/2021', '11/16/2021'] }; });
      await idsMonthView.waitFor();

      await expect(firstDay).toHaveClass(/is-disabled/);
      await expect(secondDay).toHaveClass(/is-disabled/);
    });

    test('can disable days using minDate and maxDate', async () => {
      const daysDisabled = await idsMonthView.locator('.month-view-table tr:not(:nth-child(2n)) td').all();
      const daysEnabled = await idsMonthView.locator('.month-view-table tr:nth-child(2) td').all();

      daysDisabled.forEach(async (day) => { await expect(day).not.toHaveClass(/is-disabled/); });
      daysEnabled.forEach(async (day) => { await expect(day).not.toHaveClass(/is-disabled/); });

      await idsMonthView.evaluate((element: IdsMonthView) => {
        element.disableSettings = {
          minDate: '11/6/2021',
          maxDate: '11/14/2021'
        };
      });
      await idsMonthView.waitFor();

      daysDisabled.forEach(async (day) => { await expect(day).toHaveClass(/is-disabled/); });
      daysEnabled.forEach(async (day) => { await expect(day).not.toHaveClass(/is-disabled/); });
    });

    test('can disable days using years', async () => {
      const days = await idsMonthView.locator('.month-view-table tr td').all();

      days.forEach(async (day) => { await expect(day).not.toHaveClass(/is-disabled/); });

      await idsMonthView.evaluate((element: IdsMonthView) => {
        element.disableSettings = {
          years: [2021]
        };
      });
      await idsMonthView.waitFor();

      days.forEach(async (day) => { await expect(day).toHaveClass(/is-disabled/); });
    });

    test('can select day using keyboard', async ({ page }) => {
      const defaultDay = await idsMonthView.locator('.month-view-table tr td[aria-label="Monday, November 15, 2021"]');
      const validateSelectedDay = async (direction: 'up' | 'down' | 'left' | 'right' | 'default' = 'default') => {
        const days = [
          { day: await idsMonthView.locator('.month-view-table tr td[aria-label="Monday, November 8, 2021"]'), direction: 'up' },
          { day: await idsMonthView.locator('.month-view-table tr td[aria-label="Monday, November 22, 2021"]'), direction: 'down' },
          { day: await idsMonthView.locator('.month-view-table tr td[aria-label="Sunday, November 14, 2021"]'), direction: 'left' },
          { day: await idsMonthView.locator('.month-view-table tr td[aria-label="Tuesday, November 16, 2021"]'), direction: 'right' },
          { day: await defaultDay, direction: 'default' }
        ];
        for (const day of days) {
          if (direction === day.direction) {
            await expect(day.day).toHaveClass(/is-selected/);
          } else {
            await expect(day.day).not.toHaveClass(/is-selected/);
          }
        }
      };

      await defaultDay.click({ delay: 50 });
      await validateSelectedDay();

      // Up and go back
      await page.keyboard.press('ArrowUp', { delay: 50 });
      await validateSelectedDay('up');
      await page.keyboard.press('ArrowDown', { delay: 50 });
      await validateSelectedDay();

      // Down and go back
      await page.keyboard.press('ArrowDown', { delay: 50 });
      await validateSelectedDay('down');
      await page.keyboard.press('ArrowUp', { delay: 50 });
      await validateSelectedDay();

      // Right and go back
      await page.keyboard.press('ArrowRight', { delay: 50 });
      await validateSelectedDay('right');
      await page.keyboard.press('ArrowLeft', { delay: 50 });
      await validateSelectedDay();

      // Left and go back
      await page.keyboard.press('ArrowLeft', { delay: 50 });
      await validateSelectedDay('left');
      await page.keyboard.press('ArrowRight', { delay: 50 });
      await validateSelectedDay();
    });
  });
});
