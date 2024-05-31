import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSkipLink from '../../src/components/ids-skip-link/ids-skip-link';

test.describe('IdsSkipLink tests', () => {
  const url = '/ids-skip-link/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Skip Link Component');
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
      const handle = await page.$('ids-skip-link');
      const html = await handle?.evaluate((el: IdsSkipLink) => el?.outerHTML);
      await expect(html).toMatchSnapshot('skip-link-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-skip-link');
      const html = await handle?.evaluate((el: IdsSkipLink) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('skip-link-shadow');
    });
  });

  test.describe('functionality test', async () => {
    test('renders href setting then removes it', async ({ page }) => {
      const skiplink = await page.locator('ids-skip-link').first();
      expect(await skiplink.evaluate((element: IdsSkipLink) => {
        element.href = 'href';
        return element.href;
      })).toEqual('href');
      await expect(skiplink).toHaveAttribute('href');

      expect(await skiplink.evaluate((element: IdsSkipLink) => {
        element.href = null;
        return element.href;
      })).toBeNull();
      await expect(skiplink).not.toHaveAttribute('href');
    });
  });
});
