import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';
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

    test('can set/get startDate', async () => {
      expect(await idsWeekView.evaluate((element: IdsWeekView) => element.startDate)).toContain('Oct 23 2019');
    });
  });
});
