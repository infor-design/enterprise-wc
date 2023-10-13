import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsAlert from '../../src/components/ids-alert/ids-alert';

test.describe('IdsAlert tests', () => {
  const url = '/ids-alert/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('has a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Alert Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') test.skip();
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('setting/attribute tests', () => {
    test('be able to set and reset size', async ({ page }) => {
      const tagLocator = await page.locator('ids-alert').first();
      const tagHandle = await page.$('ids-alert');
      await tagHandle?.evaluate((node: IdsAlert) => {
        node.size = 'large';
      });
      expect(await tagLocator.getAttribute('size')).toEqual('large');
      await tagHandle?.evaluate((node: IdsAlert) => {
        node.size = '';
      });
      expect(await tagLocator.getAttribute('size')).toEqual(null);
    });
  });
});
