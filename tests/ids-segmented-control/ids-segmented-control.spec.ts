import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('IdsSegmentedControl tests', () => {
  const url = '/ids-segmented-control/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Segmented Control Component');
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
        .disableRules(['nested-interactive', 'scrollable-region-focusable'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const element = document.querySelector('ids-segmented-control');
        return element?.outerHTML;
      });
      await expect(html).toMatchSnapshot('segmented-control-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const shadowRootHtml = await page.evaluate(() => {
        const element = document.querySelector('ids-segmented-control');
        const shadowRoot = element?.shadowRoot;
        shadowRoot?.querySelector('style')?.remove();
        return shadowRoot?.innerHTML;
      });
      await expect(shadowRootHtml).toMatchSnapshot('segmented-control-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-segmented-control-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can handle toggle button clicks', async ({ page }) => {
      const button1 = await page.locator('#btn-toggle-1');
      const button2 = await page.locator('#btn-toggle-2');

      // Click the first button and verify it is pressed
      await button1.click();
      await expect(button1).toHaveAttribute('pressed', 'true');
      await expect(button2).not.toHaveAttribute('pressed');

      // Click the second button and verify the state updates
      await button2.click();
      await expect(button1).not.toHaveAttribute('pressed');
      await expect(button2).toHaveAttribute('pressed', 'true');
    });

    test('should add the "ids-toggle-button-segmented" class to each toggle button', async ({ page }) => {
      const hasSegmentedClass = await page.evaluate(() => {
        const buttons = document.querySelectorAll('ids-toggle-button');
        return Array.from(buttons).every((button) => button.classList.contains('ids-toggle-button-segmented'));
      });
      expect(hasSegmentedClass).toBeTruthy();
    });
  });
});
