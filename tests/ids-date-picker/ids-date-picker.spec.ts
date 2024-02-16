import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDatePicker from '../../src/components/ids-date-picker/ids-date-picker';

test.describe('IdsDatePicker tests', () => {
  const url = '/ids-date-picker/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Date Picker Component');
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
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-date-picker');
      const html = await handle?.evaluate((el: IdsDatePicker) => el?.outerHTML);
      await expect(html).toMatchSnapshot('date-picker-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-date-picker');
      const html = await handle?.evaluate((el: IdsDatePicker) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('date-picker-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-date-picker-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const datePicker = document.querySelector('ids-date-picker') as IdsDatePicker;
        datePicker.addEventListener('change', () => { changeCount++; });
        datePicker.value = '3/20/2016';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const datePicker = document.querySelector('ids-date-picker') as IdsDatePicker;
        datePicker.addEventListener('input', () => { changeCount++; });
        datePicker.value = '3/20/2016';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });
});
