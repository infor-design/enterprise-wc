import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsActionPanel from '../../src/components/ids-action-panel/ids-action-panel';

test.describe('IdsActionPanel tests', () => {
  const url = '/ids-action-panel/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Action Panel Component');
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

  test.describe('IdsActionPanel functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test('responding to toolbar button clicks', async ({ page }) => {
      // open and wait for action panel to be visible
      await page.locator('#cap-trigger-btn').click();
      await page.waitForSelector('ids-action-panel[visible]');

      // click save button inside toolbar
      await page.locator('ids-button#btn-save').click();

      // check that action panel is closed
      await page.waitForSelector('ids-action-panel:not([visible])');
      expect(await page.locator('ids-action-panel').evaluate((cap: IdsActionPanel) => cap.visible)).toEqual(false);
    });

    test('rendering without a toolbar', async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector('ids-action-panel')?.remove();
        const cap = document.createElement('ids-action-panel');
        cap.id = 'cap-no-toolbar';
        document.querySelector('ids-container')?.append(cap);
      });

      expect(await page.locator('#cap-no-toolbar')).toBeDefined();
    });

    test('prevent being opened with "beforeshow" event', async ({ page }) => {
      const capHandle = await page.locator('ids-action-panel');
      await capHandle.evaluate((cap: IdsActionPanel) => {
        cap.addEventListener('beforeshow', (evt: any) => { evt.detail.response(false); });
      });

      await capHandle.evaluate((cap: IdsActionPanel) => cap.show());
      expect(await capHandle.evaluate((cap: IdsActionPanel) => cap.visible)).toEqual(false);
    });

    test('prevent being closed with "beforehide" event', async ({ page }) => {
      // open and wait for action panel to be visible
      await page.locator('#cap-trigger-btn').click();
      await page.waitForSelector('ids-action-panel[visible]');
      const capHandle = await page.locator('ids-action-panel');

      await capHandle.evaluate((cap: IdsActionPanel) => {
        cap.addEventListener('beforehide', (evt: any) => { evt.detail.response(false); });
      });

      // check that action panel doesn't close on click of toolbar button
      await page.locator('ids-button#btn-save').click();
      expect(await capHandle.evaluate((cap: IdsActionPanel) => cap.visible)).toEqual(true);
    });
  });
});
