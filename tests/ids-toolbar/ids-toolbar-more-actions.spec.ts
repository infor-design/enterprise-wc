import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('IdsToolbar More Actions tests', () => {
  const url = '/ids-toolbar/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Toolbar Component');
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
        .disableRules(['nested-interactive'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('functionality tests', () => {
    test('has a menu button', async ({ page }) => {
      const values = await page.evaluate(() => {
        const sectionMore = document.querySelector<any>('ids-toolbar-more-actions')!;
        return [
          sectionMore.menu?.tagName,
          sectionMore.button?.tagName
        ];
      });

      expect(values[0]).toBe('IDS-POPUP-MENU');
      expect(values[1]).toBe('IDS-MENU-BUTTON');
    });

    test('has disabled menu item', async ({ page }) => {
      const values = await page.evaluate(() => {
        const sectionMore = document.querySelector<any>('ids-toolbar-more-actions')!;
        const disabledMenuItem = sectionMore?.querySelector('ids-menu-item[value="1"]');
        sectionMore.visible = true;
        return [
          disabledMenuItem?.disabled,
        ];
      });

      expect(values[0]).toBeTruthy();
    });
  });
});
