import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPopup from '../../src/components/ids-popup/ids-popup';

test.describe('IdsPopup tests', () => {
  const url = '/ids-popup/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Popup Component');
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
      const handle = await page.$('ids-popup');
      const html = await handle?.evaluate((el: IdsPopup) => el?.outerHTML);
      await expect(html).toMatchSnapshot('popup-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-popup');
      const html = await handle?.evaluate((el: IdsPopup) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('popup-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-popup-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire show event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup?.addEventListener('show', () => { calls++; });
        popup.visible = true;
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire hide event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup.visible = true;
        popup?.addEventListener('hide', () => { calls++; });
        popup.visible = false;
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('can set visibility', async ({ page }) => {
      const locator = await page.locator('#popup-1').first();
      await page.evaluate(() => {
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup.visible = true;
      });

      expect(await locator.getAttribute('aria-hidden')).toBeFalsy();
      expect(await locator.getAttribute('visible')).toBe('');

      await page.evaluate(() => {
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup.visible = false;
      });
      expect(await locator.getAttribute('visible')).toBeFalsy();
      expect(await locator.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
