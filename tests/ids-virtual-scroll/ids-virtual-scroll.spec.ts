import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsVirtualScroll from '../../src/components/ids-virtual-scroll/ids-virtual-scroll';

test.describe('IdsVirtualScroll tests', () => {
  const url = '/ids-virtual-scroll/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Virtual Scroll Component');
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
        .disableRules(['scrollable-region-focusable'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-virtual-scroll-light');
    });
  });

  test.describe('functionality tests', () => {
    let idsScroll: Locator;

    test.beforeEach(async ({ page }) => {
      idsScroll = await page.locator('#virtual-scroll-1').first();
    });

    test('can set/get height attribute', async () => {
      const defHeight = '100dvh';
      const testData = [
        { data: '200px', expected: '200px', expectedCSS: '200px' },
        { data: 100, expected: '100', expectedCSS: '200px' }, // css dependent on previous item
        { data: null, expected: defHeight, expectedCSS: '200px' },
        { data: '150dvh', expected: '150dvh', expectedCSS: '150dvh' }
      ];
      let actual = await idsScroll.evaluate((element: IdsVirtualScroll) => {
        const result = {
          cssText: element.style.cssText,
          height: element.height
        };
        return result;
      });
      expect(actual.height).toEqual(defHeight);
      expect(actual.cssText).toContain(defHeight);

      for (const data of testData) {
        actual = await idsScroll.evaluate((element: IdsVirtualScroll, tData) => {
          element.height = tData;
          const result = {
            cssText: element.style.cssText,
            height: element.height
          };
          return result;
        }, data.data);
        expect(actual.height).toEqual(data.expected);
        expect(actual.cssText).toContain(data.expectedCSS);
      }
    });

    test('can set/get itemHeight attribute', async () => {
      const defHeight = 50;
      const testData = [
        { data: '10', expected: 10 },
        { data: '', expected: defHeight },
        { data: 33, expected: 33 },
        { data: null, expected: defHeight },
        { data: 'A', expected: defHeight },
      ];

      expect(await idsScroll.evaluate((element: IdsVirtualScroll) => element.itemHeight)).toEqual(20);
      await expect(idsScroll).toHaveAttribute('item-height', '20');

      for (const data of testData) {
        expect(await idsScroll.evaluate((element: IdsVirtualScroll, tData) => {
          element.itemHeight = tData as any;
          return element.itemHeight;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          if (!Number.isNaN(parseFloat(data.data.toString()))) {
            await expect(idsScroll).toHaveAttribute('item-height', data.expected.toString());
          } else {
            await expect(idsScroll).toHaveAttribute('item-height', data.data!.toString());
          }
        } else {
          await expect(idsScroll).not.toHaveAttribute('item-height');
        }
      }
    });

    test('can set/get bufferSize attribute', async () => {
      const defSize = 10;
      const testData = [
        { data: '5', expected: 5 },
        { data: '', expected: defSize },
        { data: 33, expected: 33 },
        { data: null, expected: defSize },
        { data: 'A', expected: defSize },
      ];

      expect(await idsScroll.evaluate((element: IdsVirtualScroll) => element.bufferSize)).toEqual(3);
      await expect(idsScroll).toHaveAttribute('buffer-size', '3');

      for (const data of testData) {
        expect(await idsScroll.evaluate((element: IdsVirtualScroll, tData) => {
          element.bufferSize = tData as any;
          return element.bufferSize;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          if (!Number.isNaN(parseFloat(data.data.toString()))) {
            await expect(idsScroll).toHaveAttribute('buffer-size', data.expected.toString());
          } else {
            await expect(idsScroll).toHaveAttribute('buffer-size', data.data!.toString());
          }
        } else {
          await expect(idsScroll).not.toHaveAttribute('buffer-size');
        }
      }
    });

    test('can get contentHeight', async () => {
      await idsScroll.waitFor();
      expect(await idsScroll.evaluate((element: IdsVirtualScroll) => element.contentHeight)).toBeTruthy();
    });

    test('can get itemCount', async () => {
      expect(await idsScroll.evaluate((element: IdsVirtualScroll) => element.itemCount)).toBeTruthy();
    });

    test('can get offsetY', async () => {
      expect(await idsScroll.evaluate((element: IdsVirtualScroll) => element.offsetY)).toEqual(0);
    });

    test('can get startIndex', async () => {
      expect(await idsScroll.evaluate((element: IdsVirtualScroll) => element.startIndex)).toEqual(0);
    });

    test('can set/get data', async () => {
      await idsScroll.waitFor();
      const defLen = 1000;
      let actual = await idsScroll.evaluate((element: IdsVirtualScroll) => element.data);
      expect(actual).toBeTruthy();
      expect(actual).toHaveLength(defLen);

      const testData = [
        { data: actual.splice(1, 50), expectedLen: 50 },
        { data: null, expectedLen: null },
        { data: actual.splice(1, 500), expectedLen: 500 },
        { data: [], expectedLen: 0 }
      ];

      for (const data of testData) {
        actual = await idsScroll.evaluate((element: IdsVirtualScroll, tData) => {
          element.data = tData;
          return element.data;
        }, data.data);
        if (data.expectedLen !== null) {
          expect(actual).toBeTruthy();
          expect(actual).toHaveLength(data.expectedLen!);
        } else {
          expect(actual).toBeFalsy();
        }
      }
    });

    // https://github.com/infor-design/enterprise-wc/issues/2281
    // probably validate by visual comparison
    test.skip('can scroll into view', async () => {
      await expect(idsScroll).toHaveAttribute('scroll-top', '0');
    });

    test('can scroll with mouse wheel', async ({ page }) => {
      const target = await page.locator('ids-card').first().boundingBox();

      await expect(idsScroll).toHaveAttribute('scroll-top', '0');
      await page.mouse.move(target!.x + (target!.width / 2), target!.y + (target!.height / 2));
      await page.mouse.wheel(0, 2000);
      await expect(idsScroll).toHaveAttribute('scroll-top', '2000');
    });

    test('can render list items', async ({ page }) => {
      await page.waitForLoadState();
      await idsScroll.waitFor();
      expect((await idsScroll.locator('div[part="list-item"]').all()).length).toBeGreaterThan(0);
    });

    test('can render row items', async ({ page }) => {
      await page.waitForLoadState();
      await page.waitForSelector('#virtual-scroll-2');
      const idsScrollRows = await page.locator('#virtual-scroll-2 div.ids-data-grid-row').all();
      expect(idsScrollRows.length).toBeGreaterThan(0);
    });
  });
});
