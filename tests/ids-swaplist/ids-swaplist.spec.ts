import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSwaplist from '../../src/components/ids-swaplist/ids-swaplist';

test.describe('IdsSwaplist tests', () => {
  const url = '/ids-swaplist/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Swaplist Component');
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
      const handle = await page.$('ids-swaplist');
      const html = await handle?.evaluate((el: IdsSwaplist) => el?.outerHTML);
      await expect(html).toMatchSnapshot('swaplist-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-swaplist');
      const html = await handle?.evaluate((el: IdsSwaplist) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('swaplist-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-swaplist-light');
    });
  });

  test.describe('setting tests', () => {
    test('can use the DOM for the default template', async ({ page }) => {
      const tmpl = await page.evaluate(() => {
        const elem = document.createElement('ids-swaplist') as any;
        return elem.defaultTemplate;
      });
      expect(tmpl).toEqual(undefined);
    });

    test('can set the default template', async ({ page }) => {
      const tmpl = await page.evaluate(() => {
        const elem = document.createElement('ids-swaplist') as any;
        // eslint-disable-next-line no-template-curly-in-string
        elem.defaultTemplate = '<div>${field}</div>';
        return elem.defaultTemplate;
      });
      // eslint-disable-next-line no-template-curly-in-string
      expect(tmpl).toEqual('<div>${field}</div>');
    });
  });

  test.describe('edge case tests', () => {
    test('should still render after reattaching', async ({ page }) => {
      await page.goto('/ids-swaplist/reattach.html');
      expect(await page.locator('ids-swappable-item').count()).toBe(3);
      await page.locator('#reattach').click();
      expect(await page.locator('ids-swaplist ids-swappable-item').count()).toBe(3);
    });
  });
});
