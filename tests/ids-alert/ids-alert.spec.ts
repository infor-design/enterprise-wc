import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsAlert from '../../src/components/ids-alert/ids-alert';

test.describe('IdsAlert tests', () => {
  const url = '/ids-alert/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Alert Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
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
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page }) => {
      const handle = await page.$('ids-alert');
      const html = await handle?.evaluate((node: IdsAlert) => node?.outerHTML);
      await expect(html).toMatchSnapshot('alert-html');
    });

    test('should match shadowRoot snapshot', async ({ page }) => {
      const handle = await page.$('ids-alert');
      const html = await handle?.evaluate((node: IdsAlert) => {
        node?.shadowRoot?.querySelector('style')?.remove();
        return node?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('alert-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-alert-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able to set size', async ({ page }) => {
      const locator = await page.locator('ids-alert').first();
      const handle = await page.$('ids-alert');
      await handle?.evaluate((node: IdsAlert) => {
        node.size = 'large';
      });
      expect(await locator.getAttribute('size')).toEqual('large');
      await handle?.evaluate((node: IdsAlert) => {
        node.size = '';
      });
      expect(await locator.getAttribute('size')).toEqual(null);
    });

    test('should be able to set disabled', async ({ page }) => {
      const handle = await page.$('ids-alert');
      let result = await handle?.evaluate((node: IdsAlert) => {
        node.setAttribute('disabled', 'true');
        return node.disabled;
      });
      await expect(result).toEqual(true);
      result = await handle?.evaluate((node2: IdsAlert) => {
        node2.setAttribute('disabled', 'false');
        return node2.disabled;
      });
      await expect(await handle?.getAttribute('disabled')).toEqual(null);
    });
  });
});
