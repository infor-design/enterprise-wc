import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsModuleNav from '../../src/components/ids-module-nav/ids-module-nav';

test.describe('IdsModuleNav tests', () => {
  const url = '/ids-module-nav/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Module Nav Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions: Error | null = null;
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
        .disableRules(['nested-interactive'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-module-nav');
      const html = await handle?.evaluate((el: IdsModuleNav) => el?.outerHTML);
      await expect(html).toMatchSnapshot('module-nav-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-module-nav');
      const html = await handle?.evaluate((el: IdsModuleNav) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('module-nav-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-module-nav-light');
    });

    test('should match the visual snapshot in percy (with masthead)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      await page.goto('/ids-module-nav/with-masthead.html');
      await percySnapshot(page, 'ids-module-nav-masthead-light');
    });
  });

  test.describe('sandbox tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-module-nav/sandbox.html');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions: Error | null = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });

    test('should render IdsModuleNavUser', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      // Open the Module Nav (click trigger)
      await (await page.locator('#module-nav-trigger')).click();

      // Use Hyperlink
      await (await page.locator('#guest-hyperlink')).click();

      // Wait for next console message from link click
      // (fires a few ticks after the click due to event delegation)
      page.on('console', async (msg) => {
        if (msg.type() === 'info') {
          await expect(await msg.text()).toContain('Guest Hyperlink was clicked');
        }
      });
    });
  });
});
