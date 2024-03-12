import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsBadge from '../../src/components/ids-badge/ids-badge';
import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsBadge tests', () => {
  const url = '/ids-badge/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Badge Component');
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
      const handle = await page.$('ids-badge');
      const html = await handle?.evaluate((el: IdsBadge) => el?.outerHTML);
      await expect(html).toMatchSnapshot('badge-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-badge');
      const html = await handle?.evaluate((el: IdsBadge) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('badge-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-badge-light');
    });
  });
  test.describe('functionality test', async () => {
    test('can change color', async ({ page }) => {
      const colors = ['alert', 'error', 'info', 'warning', 'success', 'invalid', null];
      const badge = page.locator('ids-badge:first-child');
      const span = badge.locator('span');
      for (const color of colors) {
        await badge.evaluate((element: IdsBadge, tColor) => {
          element.color = tColor;
        }, color);
        if (color) {
          await expect(badge).toHaveAttribute('color', color);
          await expect(span).toHaveAttribute('color', color);
        } else {
          await expect(badge).not.toHaveAttribute('color');
          await expect(span).not.toHaveAttribute('color');
        }
      }
    });

    test('can change shape', async ({ page }) => {
      const shapes = ['round', 'normal', null];
      const badge = page.locator('ids-badge:first-child');
      const span = badge.locator('span');
      for (const shape of shapes) {
        await badge.evaluate((element: IdsBadge, tShape) => {
          element.shape = tShape;
        }, shape);
        if (shape) {
          await expect(badge).toHaveAttribute('shape', shape);
          await expect(span).toHaveClass(new RegExp(shape, 'g'));
        } else {
          await expect(badge).not.toHaveAttribute('shape');
          await expect(span).toHaveClass(/normal/);
        }
      }
    });

    // to improve code
    test('able to set attributes before append', async ({ page }) => {
      await page.evaluate(() => {
        const element = document.createElement('ids-badge') as IdsBadge;
        element.setAttribute('id', 'test-badge');
        element.color = 'error';
        element.shape = 'round';
        (document.querySelector<IdsContainer>('ids-container'))!.appendChild(element);
      });
      const badge = page.locator('#test-badge');
      await expect(badge).toBeAttached();
      await expect(badge).toHaveAttribute('color', 'error');
    });

    test('able to set attributes after append', async ({ page }) => {
      await page.evaluate(() => {
        const element = document.createElement('ids-badge') as IdsBadge;
        element.setAttribute('id', 'test-badge');
        (document.querySelector<IdsContainer>('ids-container'))!.appendChild(element);
        element.color = 'error';
        element.shape = 'round';
      });
      const badge = page.locator('#test-badge');
      await expect(badge).toBeAttached();
      await expect(badge).toHaveAttribute('color', 'error');
    });

    test('can disabled/enabled', async ({ page }) => {
      const badge = page.locator('ids-badge:first-child');
      await expect(badge).toBeEnabled();
      await badge.evaluate((element: IdsBadge) => { element.disabled = true; });
      await expect(badge).toHaveAttribute('disabled');
      await badge.evaluate((element: IdsBadge) => { element.disabled = false; });
      await expect(badge).not.toHaveAttribute('enabled');
    });

    test('removes the color attribute', async ({ page }) => {
      let badge = page.locator('ids-badge[color="error"]').first();
      let span = badge.locator('span');
      await expect(badge).toHaveAttribute('color');
      await expect(span).toHaveAttribute('color');
      await badge.evaluate((element: IdsBadge) => {
        element.removeAttribute('color');
        element.setAttribute('id', 'test-badge');
      });
      badge = page.locator('#test-badge');
      span = badge.locator('span');
      await expect(badge).not.toHaveAttribute('color');
      await expect(span).not.toHaveAttribute('color');
    });

    test('removes the shape attribute', async ({ page }) => {
      let badge = page.locator('ids-badge[color="warning"][shape="round"]').first();
      let span = badge.locator('span');
      await expect(badge).toHaveAttribute('shape');
      await expect(span).toHaveClass(/round/);
      await badge.evaluate((element: IdsBadge) => {
        element.removeAttribute('shape');
        element.setAttribute('id', 'test-badge');
      });
      badge = page.locator('#test-badge');
      span = badge.locator('span');
      await expect(badge).not.toHaveAttribute('shape');
      await expect(span).not.toHaveClass(/round/);
    });
  });
});
