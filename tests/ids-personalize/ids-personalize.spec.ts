import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('IdsPersonalize tests', () => {
  const url = '/ids-personalize/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Personalize Component');
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

  test.describe('functionality tests', () => {
    test('defaults to no background color', async ({ page }) => {
      const bgColor = await page.evaluate(() => getComputedStyle((document.querySelector('ids-header') as any).container).backgroundColor);
      expect(bgColor).toEqual('rgb(255, 255, 255)');
    });
  });
});
