import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsAppMenu from '../../src/components/ids-app-menu/ids-app-menu';

test.describe('IdsAppMenu tests', () => {
  const url = '/ids-app-menu/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS App Menu Component');
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
      const handle = await page.$('ids-app-menu');
      const html = await handle?.evaluate((el: IdsAppMenu) => el?.outerHTML);
      await expect(html).toMatchSnapshot('app-menu-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-app-menu');
      const html = await handle?.evaluate((el: IdsAppMenu) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('app-menu-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-app-menu-light');
    });
  });

  test.describe('appmenu component', () => {
    test('has default settings', async ({ page, browserName }) => {
      const appmenu = await page.$('ids-app-menu');
      let appMenuType = await appmenu.evaluate((element: IdsAppMenu) =>  element.type );
      let appMenuEdge = await appmenu.evaluate((element: IdsAppMenu) =>  element.edge );
      expect(appMenuType).toBe('app-menu');
      expect(appMenuEdge).toBe('start');
    });
    test('should convert inner accordions to use the "app-menu" color variant', async () => {
      //????
    });
    test('can close by pressing the escape key', async ({ page }) => {
      await page.locator('#app-menu-trigger').click();
      await expect(page.locator('#app-menu')).toHaveAttribute('visible');
      await page.keyboard.press('Escape');
      await expect(page.locator('#app-menu')).not.toHaveAttribute('visible');
    });
  });
});
