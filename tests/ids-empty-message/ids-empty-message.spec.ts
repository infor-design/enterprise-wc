import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsEmptyMessage from '../../src/components/ids-empty-message/ids-empty-message';

test.describe('IdsEmptyMessage tests', () => {
  const url = '/ids-empty-message/example.html';
  let emptyMessage: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    emptyMessage = await page.locator('ids-empty-message').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Empty Message Component');
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
        .disableRules('color-contrast')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-empty-message');
      const html = await handle?.evaluate((el: IdsEmptyMessage) => el?.outerHTML);
      await expect(html).toMatchSnapshot('empty-message-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-empty-message');
      const html = await handle?.evaluate((el: IdsEmptyMessage) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('empty-message-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-empty-message-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can update the icon', async () => {
      await expect(emptyMessage).toHaveAttribute('icon', 'empty-error-loading-new');
      await emptyMessage.evaluate((elem: IdsEmptyMessage) => { elem.icon = 'empty-no-data'; });
      await expect(emptyMessage).toHaveAttribute('icon', 'empty-no-data');
    });

    test('can remove the icon', async () => {
      await expect(emptyMessage).toHaveAttribute('icon', 'empty-error-loading-new');
      await emptyMessage.evaluate((elem: IdsEmptyMessage) => { elem.icon = ''; });
      await expect(emptyMessage).not.toHaveAttribute('icon');
    });
  });
});
