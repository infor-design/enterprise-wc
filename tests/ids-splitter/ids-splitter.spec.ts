import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSplitter from '../../src/components/ids-splitter/ids-splitter';

test.describe('IdsSplitter tests', () => {
  const url = '/ids-splitter/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Splitter Component');
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
      const handle = await page.$('ids-splitter');
      const html = await handle?.evaluate((el: IdsSplitter) => el?.outerHTML);
      await expect(html).toMatchSnapshot('splitter-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-splitter');
      const html = await handle?.evaluate((el: IdsSplitter) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('splitter-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-splitter-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should expand and collapse the splitter', async ({ page }) => {
      await page.goto('/ids-splitter/expand-collapse.html');
      const btn = await page.locator('#expand-collapse-btn');
      const leftPane = await page.locator('#left-pane');
      await btn.click();
      await expect(leftPane).toHaveAttribute('collapsed');
      await btn.click();
      await expect(leftPane).not.toHaveAttribute('collapsed');
      expect(await leftPane.getAttribute('style')).toContain('width: 25%');
      // resize to have a collapsed pane
      const resizer = await page.locator('ids-splitter ids-draggable').first();
      await resizer.hover();
      await page.mouse.down();
      await page.mouse.move(0, 0);
      await page.mouse.up();
      expect(await leftPane.getAttribute('style')).toContain('width: 0%');
      await expect(leftPane).toHaveAttribute('collapsed');
      await btn.click();
      await expect(leftPane).not.toHaveAttribute('collapsed');
      expect(await leftPane.getAttribute('style')).toContain('width: 25%');
    });
  });
});
