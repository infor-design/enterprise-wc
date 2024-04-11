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

    test('should match the visual snapshot in percy (with masthead)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      await page.goto('/ids-app-menu/with-masthead.html');
      await percySnapshot(page, 'ids-app-menu-masthead-light');
    });
  });

  test.describe('appmenu component tests', () => {
    test('should have default settings', async ({ page }) => {
      const appmenu = await page.locator('ids-app-menu');
      const appMenuType = await appmenu.evaluate((element: IdsAppMenu) => element.type);
      const appMenuEdge = await appmenu.evaluate((element: IdsAppMenu) => element.edge);
      expect(appMenuType).toBe('app-menu');
      expect(appMenuEdge).toBe('start');
    });

    test('can convert inner accordions to use the "app-menu" color variant', async ({ page }) => {
      const acc = await page.locator('ids-accordion');
      await expect(acc).toBeDefined();
    });

    test('can close by pressing the escape key', async ({ page }) => {
      await page.locator('#app-menu-trigger').click();
      await expect(page.locator('#app-menu')).toHaveAttribute('visible');
      await page.keyboard.press('Escape');
      await expect(page.locator('#app-menu')).not.toHaveAttribute('visible');
    });

    test('should not close by pressing any key but escape', async ({ page }) => {
      await page.locator('#app-menu-trigger').click();
      await expect(page.locator('#app-menu')).toHaveAttribute('visible');
      await page.keyboard.press('A');
      await page.keyboard.press('0');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('F12');
      await expect(page.locator('#app-menu')).toHaveAttribute('visible');
      await page.keyboard.press('Escape');
      await expect(page.locator('#app-menu')).not.toHaveAttribute('visible');
    });

    test('can filter its navigation accordion when the search field is used', async ({ page }) => {
      await page.locator('#app-menu-trigger').click();
      await expect(page.locator('#app-menu')).toHaveAttribute('visible');
      const sf = await page.locator('#search');
      await expect(sf).toBeDefined();
      await page.locator('.ids-input-field').fill('Second');
      const acc = await page.locator('ids-accordion-header').first();
      await expect(acc).toHaveAttribute('hidden-by-filter');
      await page.locator('.ids-input-field').fill('');
      await expect(acc).not.toHaveAttribute('hidden-by-filter');
    });
  });
});
