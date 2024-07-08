import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsColor from '../../src/components/ids-color/ids-color';

test.describe('IdsColor tests', () => {
  const url = '/ids-color/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Color Component');
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
      const handle = await page.$('ids-color');
      const html = await handle?.evaluate((el: IdsColor) => el?.outerHTML);
      await expect(html).toMatchSnapshot('color-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-color');
      const html = await handle?.evaluate((el: IdsColor) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('color-shadow');
    });

    test.skip('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-color-light');
    });
  });
  test.describe('functionality test', async () => {
    test('shows transparent background for default hex', async ({ page }) => {
      const color = await page.locator('ids-color').first();
      await expect(color).toHaveAttribute('hex', '');
      const background = await color.evaluate((element: IdsColor) => element.container?.style.backgroundColor);
      await expect(color).toHaveAttribute('hex', '');
      expect(background).toEqual('transparent');
    });

    test('hex attribute updates background-color', async ({ page }) => {
      const color = await page.locator('ids-color').first();
      const container = await color.locator(':scope > div.ids-color');
      const testData = [
        { color: '#000000', rgb: 'rgb(0, 0, 0)' },
        { color: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
        { color: '#F00', rgb: 'rgb(255, 0, 0)' },
        { color: 'red', rgb: 'red' }
      ];
      for (const data of testData) {
        const hex = await color.evaluate((element: IdsColor, tColor) => {
          element.hex = tColor;
          return element.hex;
        }, data.color);
        await expect(color).toHaveAttribute('hex', data.color);
        await expect(container).toHaveAttribute('style', `background-color: ${data.rgb};`);
        expect(hex).toEqual(data.color);
      }
    });

    test('can set/get color label', async ({ page }) => {
      const color = await page.locator('ids-color').first();

      expect(await color.evaluate((element: IdsColor) => {
        element.hex = 'red';
        element.label = 'Red';
        return element.label;
      })).toEqual('Red');
      await expect(color).toHaveAttribute('label', 'Red');
      expect(await color.evaluate((element: IdsColor) => {
        element.hex = 'red';
        element.label = '';
        return element.label;
      })).toEqual('');
      await expect(color).toHaveAttribute('label');
    });

    test('can disable/enable color', async ({ page }) => {
      const color = await page.locator('ids-color').first();

      expect(await color.evaluate((element: IdsColor) => element.disabled)).toBeFalsy();
      await expect(color).not.toHaveAttribute('disabled');
      expect(await color.evaluate((element: IdsColor) => {
        element.disabled = true;
        return element.disabled;
      })).toBeTruthy();
      await expect(color).toHaveAttribute('disabled');
    });

    test('can show/unshow color label', async ({ page }) => {
      const color = await page.locator('ids-color').first();

      expect(await color.evaluate((element: IdsColor) => element.showLabel)).toBeFalsy();
      await expect(color).not.toHaveAttribute('show-label');
      expect(await color.evaluate((element: IdsColor) => {
        element.showLabel = true;
        return element.showLabel;
      })).toBeTruthy();
      await expect(color).toHaveAttribute('show-label');
    });

    test('can set/get color tooltip', async ({ page }) => {
      const color = await page.locator('ids-color').first();

      expect(await color.evaluate((element: IdsColor) => element.tooltip)).toEqual('');
      await expect(color).not.toHaveAttribute('tooltip');
      expect(await color.evaluate((element: IdsColor) => {
        element.tooltip = 'set-tooltip';
        element.showTooltip();
        return element.tooltip;
      })).toEqual('set-tooltip');
      await expect(color).toHaveAttribute('tooltip');
      await expect(color.locator('ids-tooltip').first()).toHaveText('set-tooltip');
      expect(await color.evaluate((element: IdsColor) => {
        element.tooltip = 'set-tooltip';
        element.disabled = true;
        element.hideTooltip();
        return element.tooltip;
      })).toEqual('');
      await expect(color).toHaveAttribute('tooltip');
    });

    test('can set/get size', async ({ page }) => {
      const color = await page.locator('ids-color').first();

      expect(await color.evaluate((element: IdsColor) => element.size)).toEqual('');
      await expect(color).not.toHaveAttribute('size');
      expect(await color.evaluate((element: IdsColor) => {
        element.size = 'xs';
        return element.size;
      })).toEqual('xs');
      await expect(color).toHaveAttribute('size', 'xs');
      await color.evaluate((element: IdsColor) => {
        element.size = 'invalid' as any;
        return element.size;
      });
      await expect(color).toHaveAttribute('size', 'xs');
      await expect(color.locator('div').first()).not.toHaveClass(/xs/);
    });

    test('can set/get clickable', async ({ page }) => {
      const color = await page.locator('ids-color').first();

      expect(await color.evaluate((element: IdsColor) => element.clickable)).toBeTruthy();
      await expect(color).not.toHaveAttribute('clickable');
      expect(await color.evaluate((element: IdsColor) => {
        element.clickable = false;
        return element.clickable;
      })).toBeFalsy();
      await expect(color).toHaveAttribute('clickable');
    });
  });
});
