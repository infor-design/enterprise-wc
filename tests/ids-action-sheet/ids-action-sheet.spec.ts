import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsActionSheet from '../../src/components/ids-action-sheet/ids-action-sheet';

test.describe('IdsActionSheet tests', () => {
  const url = '/ids-action-sheet/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Action Sheet Component');
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
      const handle = await page.$('ids-action-sheet');
      const html = await handle?.evaluate((el: IdsActionSheet) => el?.outerHTML);
      await expect(html).toMatchSnapshot('action-sheet-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-action-sheet');
      const html = await handle?.evaluate((el: IdsActionSheet) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('action-sheet-shadow');
    });
  });

  test.describe('mobile tests', () => {
    let asOverlay: any;
    let asCancelBtn: any;
    let as: any;

    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-action-sheet/example.html');
      await page.setViewportSize({ width: 375, height: 900 });
      as = await page.locator('ids-action-sheet');
      await expect(as).toBeAttached;
      asOverlay = await page.locator('ids-overlay');
      await expect(asOverlay).toBeAttached;
      asCancelBtn = await page.locator('[part="cancel-btn"]');
      await expect(asCancelBtn).toBeAttached;
    });

    test('can render page with no errors', async () => {
      await expect(as).toBeDefined();
      expect(test.info().errors).toHaveLength(0);
    });

    test('can set the hidden attribute', async ({ page }) => {
      await expect(page.locator('hidden')).toBeNull;
      await as.evaluate((element: IdsActionSheet) => element.setAttribute('hidden', 'true'));
      await expect(page.locator('hidden')).toBeTruthy();
      await as.evaluate((element: IdsActionSheet) => element.setAttribute('hidden', ''));
      await expect(page.locator('hidden')).toBeNull;
    });

    test('can set the cancelBtnText attribute', async ({ page }) => {
      await expect(page.locator('cancelBtnText')).toBeNull;
      await as.evaluate((element: IdsActionSheet) => element.setAttribute('cancelBtnText', 'Test'));
      await expect(as).toHaveAttribute('cancelBtnText', 'Test');
      await as.evaluate((element: IdsActionSheet) => element.setAttribute('cancelBtnText', ''));
      await expect(page.locator('cancelBtnText')).toBeNull;
    });

    test('can be dismissed on overlay click', async () => {
      await asOverlay.dispatchEvent('click');
      await expect(asOverlay.getAttribute('visible')).toBeNull;
    });

    test.skip('can be dismissed on overlay touchstart', async () => {
      await asOverlay.dispatchEvent('touchstart');
      await expect(asOverlay.getAttribute('visible')).toBeNull;
    });

    test.skip('can be dismissed on cancelBtn touchstart', async () => {
      await asCancelBtn.dispatchEvent('touchstart');
      await expect(asCancelBtn.getAttribute('visible')).toBeNull;
    });
  });
});
