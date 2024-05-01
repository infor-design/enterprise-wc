import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHidden from '../../src/components/ids-hidden/ids-hidden';

test.describe('IdsHidden tests', () => {
  const url = '/ids-hidden/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Hidden Component');
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
      const handle = await page.$('ids-hidden');
      const html = await handle?.evaluate((el: IdsHidden) => el?.outerHTML);
      await expect(html).toMatchSnapshot('hidden-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-hidden');
      const html = await handle?.evaluate((el: IdsHidden) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('hidden-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-hidden-light');
    });
  });

  test.describe('functionality test', async () => {
    test('can set/get hideDown attribute', async ({ page }) => {
      const hidden = await page.locator('ids-hidden').first();

      expect(await hidden.evaluate((element: IdsHidden) => {
        element.hideDown = 'sm';
        return element.hideDown;
      })).toEqual('sm');
      await expect(hidden).toHaveAttribute('hide-down', 'sm');
      expect(await hidden.evaluate((element: IdsHidden) => {
        element.hideDown = null;
        return element.hideDown;
      })).toBeNull();
      await expect(hidden).not.toHaveAttribute('hide-down');
    });

    test('can set/get hideUp attribute', async ({ page }) => {
      const hidden = await page.locator('ids-hidden').first();

      expect(await hidden.evaluate((element: IdsHidden) => {
        element.hideUp = 'ss';
        return element.hideUp;
      })).toEqual('ss');
      await expect(hidden).toHaveAttribute('hide-up', 'ss');
      expect(await hidden.evaluate((element: IdsHidden) => {
        element.hideUp = null;
        return element.hideDown;
      })).toBeNull();
      await expect(hidden).not.toHaveAttribute('hide-up');
    });

    test('can set/get visible attribute', async ({ page }) => {
      const hidden = await page.locator('ids-hidden').first();

      expect(await hidden.evaluate((element: IdsHidden) => element.visible)).toBeFalsy();
      await expect(hidden).not.toHaveAttribute('visible');
      expect(await hidden.evaluate((element: IdsHidden) => {
        element.visible = true;
        return element.visible;
      })).toBeTruthy();
      await expect(hidden).toHaveAttribute('visible');

      expect(await hidden.evaluate((element: IdsHidden) => {
        element.visible = null;
        return element.visible;
      })).toBeFalsy();
      await expect(hidden).not.toHaveAttribute('visible');

      expect(await hidden.evaluate((element: IdsHidden) => {
        element.visible = true;
        return element.visible;
      })).toBeTruthy();
      await expect(hidden).toHaveAttribute('visible');

      expect(await hidden.evaluate((element: IdsHidden) => {
        element.visible = false;
        return element.visible;
      })).toBeFalsy();
      await expect(hidden).not.toHaveAttribute('visible');
    });

    test('can set/get value and condition attribute', async ({ page }) => {
      const hidden = await page.locator('ids-hidden').first();

      const testData = [
        { value: 'test', condition: 'true', expected: true },
        { value: 'test', condition: 'false', expected: false },
        { value: 'false', condition: 'false', expected: true },
        { value: 'test-1', condition: 'test-1', expected: true },
        { value: 'test-1', condition: 'test-2', expected: false },
        { value: 'true', condition: 'true', expected: true },
        { value: 'true', condition: 'false', expected: false },
        { value: '', condition: '', expected: true }
      ];
      for (const data of testData) {
        expect(await hidden.evaluate((element: IdsHidden, tData) => {
          element.value = tData.value;
          element.condition = tData.condition;
          return element.hidden;
        }, data)).toEqual(data.expected);
      }
    });
  });
});
