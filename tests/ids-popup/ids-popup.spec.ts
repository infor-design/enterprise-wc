import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
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

  test.describe('IdsPopUp functionality test', () => {
    let idsPopup: Locator;

    test.beforeEach(async ({ page }) => {
      idsPopup = await page.locator('#popup-1');
    });

    test('can set/get alignTarget', async ({ page }) => {
      const idsTextElement = await page.locator('ids-text').first().evaluateHandle((node) => node);
      const idsButtonElement = await page.locator('#popup-trigger-btn').evaluateHandle((node) => node);

      // default alignment at ids-button
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => element.alignTarget!.isSameNode(handle), idsButtonElement)).toBeTruthy();

      // changed to ids-text
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.alignTarget = handle;
        return element.alignTarget!.isSameNode(handle);
      }, idsTextElement)).toBeTruthy();

      // change again to button via selector string
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.alignTarget = '#popup-trigger-btn';
        return element.alignTarget!.isSameNode(handle);
      }, idsButtonElement)).toBeTruthy();
    });

    test('can set/get align', async () => {
      const defAlign = 'center';
      const testData = [
        { data: 'bottom', expected: 'bottom' },
        { data: 5, expected: defAlign },
        { data: 'left, top', expected: 'left, top' },
        { data: 'left, right', expected: 'left, top' }, // retains previous state
        { data: null, expected: defAlign },
        { data: 'right, left', expected: 'left' }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.align)).toEqual('right');
      await expect(idsPopup).toHaveAttribute('align', 'right');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.align = tData as any;
          return element.align;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('align', data.expected);
      }
    });

    test('can set/get alignX', async () => {
      expect(await idsPopup.evaluate((element: IdsPopup) => element.alignX)).toEqual('right');
      await expect(idsPopup).not.toHaveAttribute('align-x');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignX = 'left';
        return element.alignX;
      })).toEqual('left');
      await expect(idsPopup).not.toHaveAttribute('align-x');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignX = 'test';
        return element.alignX;
      })).toEqual('center');
      await expect(idsPopup).not.toHaveAttribute('align-x');
    });

    test('can set/get alignY', async () => {
      expect(await idsPopup.evaluate((element: IdsPopup) => element.alignY)).toEqual('center');
      await expect(idsPopup).not.toHaveAttribute('align-y');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignY = 'top';
        return element.alignY;
      })).toEqual('top');
      await expect(idsPopup).not.toHaveAttribute('align-y');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignY = 'test';
        return element.alignY;
      })).toEqual('center');
      await expect(idsPopup).not.toHaveAttribute('align-y');
    });
  });
});
