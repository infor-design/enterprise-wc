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
  });
});
