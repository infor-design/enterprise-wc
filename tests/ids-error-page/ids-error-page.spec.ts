import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsErrorPage from '../../src/components/ids-error-page/ids-error-page';

test.describe('IdsErrorPage tests', () => {
  const url = '/ids-error-page/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Error Page Component');
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
        .disableRules('color-contrast')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-error-page');
      const html = await handle?.evaluate((el: IdsErrorPage) => el?.outerHTML);
      await expect(html).toMatchSnapshot('error-page-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-error-page');
      const html = await handle?.evaluate((el: IdsErrorPage) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('error-page-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-error-page-light');
    });
  });

  test.describe('IdsErrorPage settings tests', () => {
    test('setting error page icon', async ({ page }) => {
      const epHandle = await page.locator('ids-error-page');

      // set icon to empty-error-loading
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.icon = 'empty-error-loading'; });
      expect(await page.locator('ids-error-page ids-empty-message').getAttribute('icon')).toEqual('empty-error-loading');

      // set icon to null
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.icon = null; });
      expect(await page.locator('ids-error-page ids-empty-message').getAttribute('icon')).toEqual(null);
    });

    test('setting error page label', async ({ page }) => {
      const epHandle = await page.locator('ids-error-page');

      // set label to "Error Alert"
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.label = 'Error Alert'; });
      expect(await epHandle.getAttribute('label')).toEqual('Error Alert');
      expect(await page.locator('ids-error-page ids-text[slot="label"]')).toHaveText(/Error Alert/);

      // set label to null
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.label = null; });
      expect(await epHandle.getAttribute('label')).toEqual(null);
      expect(await page.locator('ids-error-page ids-text[slot="label"]')).toHaveText('');
    });

    test('setting error page description', async ({ page }) => {
      const epHandle = await page.locator('ids-error-page');

      // set description to "Test Description"
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.description = 'Test Description'; });
      expect(await epHandle.getAttribute('description')).toEqual('Test Description');
      expect(await page.locator('ids-error-page ids-text[slot="description"]')).toHaveText(/Test Description/);

      // set description to null
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.description = null; });
      expect(await epHandle.getAttribute('description')).toEqual(null);
      expect(await page.locator('ids-error-page ids-text[slot="description"]')).toHaveText('');
    });

    test('setting error page button text', async ({ page }) => {
      const epHandle = await page.locator('ids-error-page');

      // set buttonText to "Button Test"
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.buttonText = 'Button Test'; });
      expect(await epHandle.getAttribute('button-text')).toEqual('Button Test');
      expect(await page.locator('ids-error-page ids-button[slot="button"]')).toHaveText(/Button Test/);

      // set buttonText to null
      await epHandle.evaluate((ep: IdsErrorPage) => { ep.buttonText = null; });
      expect(await epHandle.getAttribute('button-text')).toEqual(null);
      expect(await page.locator('ids-error-page ids-button[slot="button"]')).toHaveText('');
    });

    test('triggering action-button event', async ({ page }) => {
      const epHandle = await page.locator('ids-error-page');
      const buttonCallback = await epHandle.evaluate((ep: IdsErrorPage) => new Promise((resolve) => {
        ep.addEventListener('action-button', () => resolve('fired'), { once: true });
        ep.container?.querySelector('ids-button[slot="button"]')?.dispatchEvent(new Event('click'));
      }));
      expect(buttonCallback).toEqual('fired');
    });
  });
});
