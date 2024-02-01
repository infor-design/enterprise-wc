import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsTimePicker from '../../src/components/ids-time-picker/ids-time-picker';

test.describe('IdsTimePicker tests', () => {
  const url = '/ids-time-picker/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Time Picker Component');
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
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-time-picker-light');
    });
  });

  test.describe('IdsTimePicker events', () => {
    test('should fire change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const timePicker = document.querySelector('ids-time-picker') as IdsTimePicker;
        timePicker.addEventListener('change', () => { changeCount++; });
        timePicker.value = '3:15 PM';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });
});
