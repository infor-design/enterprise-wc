import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('IdsGlobal tests', () => {
  const url = '/ids-global/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Global Component');
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
        .disableRules('nested-interactive')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('functionality tests', () => {
    test('has a window attribute', async ({ page }) => {
      const values = await page.evaluate(() => [
        window.IdsGlobal.version,
        window.IdsGlobal.themeName,
        window.IdsGlobal.customIconData,
        window.IdsGlobal.personalize,
        window.IdsGlobal.themeLoaded
      ]);
      expect(values[0]).toContain('1.2.0');
      expect(values[1]).toBe('default-light');
      expect(values[2]).toBeFalsy();
      expect(values[3]).toBeTruthy();
      expect(values[4]).toBeTruthy();
    });
  });
});
