import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsLayoutFlex from '../../src/components/ids-layout-flex/ids-layout-flex';
import IdsLayoutFlexItem from '../../src/components/ids-layout-flex/ids-layout-flex-item';

test.describe('IdsLayoutFlex tests', () => {
  const url = '/ids-layout-flex/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Layout Flex Component');
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
      const handle = await page.$('ids-layout-flex');
      const html = await handle?.evaluate((el: IdsLayoutFlex) => el?.outerHTML);
      await expect(html).toMatchSnapshot('layout-flex-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-layout-flex');
      const html = await handle?.evaluate((el: IdsLayoutFlex) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('layout-flex-shadow');
    });

    // Skipping too large image and percy gzip not working
    test.skip('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-layout-flex-light');
    });
  });

  test.describe('IdsLayoutFlex functionality test', () => {
    let idsFlex: Locator;

    // remove all layout grid for visiblity
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        for (const elem of document.querySelectorAll('ids-layout-grid')) {
          elem.parentNode!.removeChild(elem);
        }
        const idsLF = document.createElement('ids-layout-flex') as IdsLayoutFlex;
        idsLF.setAttribute('id', 'test-layout-flex');
        document.querySelector('ids-container')?.appendChild(idsLF);
      });
      idsFlex = await page.locator('#test-layout-flex');
    });

    test('can set/get alignContent attribute', async () => {
      const testData = [
        { data: 'center', expected: 'center' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.alignContent)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tAlign) => {
          element.alignContent = tAlign;
          return element.alignContent;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('align-content', align.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('align-content');
        }
      }
    });

    test('can set/get alignItems attribute', async () => {
      const testData = [
        { data: 'center', expected: 'center' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.alignItems)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tAlign) => {
          element.alignItems = tAlign;
          return element.alignItems;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('align-items', align.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('align-items');
        }
      }
    });

    test('can set/get direction attribute', async () => {
      const testData = [
        { data: 'row', expected: 'row' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.direction)
      ).toBeFalsy();

      for (const direction of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tDirection) => {
          element.direction = tDirection;
          return element.direction;
        }, direction.data)).toEqual(direction.expected);
        if (typeof direction.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('direction', direction.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('direction');
        }
      }
    });

    test('can set/get display attribute', async () => {
      const testData = [
        { data: 'flex', expected: 'flex' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.display)
      ).toBeFalsy();

      for (const display of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tDisplay) => {
          element.display = tDisplay;
          return element.display;
        }, display.data)).toEqual(display.expected);
        if (typeof display.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('display', display.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('display');
        }
      }
    });

    test('can set/get gap attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: 12, expected: '12' },
        { data: 11, expected: null },
        { data: 'invalid', expected: null },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.gap)
      ).toBeNull();

      for (const gap of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tGap) => {
          element.gap = tGap;
          return element.gap;
        }, gap.data)).toEqual(gap.expected);
        if (typeof gap.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('gap', gap.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('gap');
        }
      }
    });

    test('can set/get gapX attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: 12, expected: '12' },
        { data: 11, expected: null },
        { data: 'invalid', expected: null },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.gapX)
      ).toBeNull();

      for (const gap of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tGap) => {
          element.gapX = tGap;
          return element.gapX;
        }, gap.data)).toEqual(gap.expected);
        if (typeof gap.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('gap-x', gap.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('gap-x');
        }
      }
    });

    test('can set/get gapY attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: 12, expected: '12' },
        { data: 11, expected: null },
        { data: 'invalid', expected: null },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.gapY)
      ).toBeNull();

      for (const gap of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tGap) => {
          element.gapY = tGap;
          return element.gapY;
        }, gap.data)).toEqual(gap.expected);
        if (typeof gap.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('gap-y', gap.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('gap-y');
        }
      }
    });

    test('can set/get justifyContent attribute', async () => {
      const testData = [
        { data: 'center', expected: 'center' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.justifyContent)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tAlign) => {
          element.justifyContent = tAlign;
          return element.justifyContent;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('justify-content', align.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('justify-content');
        }
      }
    });

    test('can set/get wrap attribute', async () => {
      const testData = [
        { data: 'wrap', expected: 'wrap' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.wrap)
      ).toBeFalsy();

      for (const wrap of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tWrap) => {
          element.wrap = tWrap;
          return element.wrap;
        }, wrap.data)).toEqual(wrap.expected);
        if (typeof wrap.expected === 'string') {
          await expect(idsFlex).toHaveAttribute('wrap', wrap.expected);
        } else {
          await expect(idsFlex).not.toHaveAttribute('wrap');
        }
      }
    });

    test('can set/get fullHeight attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: false, expected: false },
        { data: 'true', expected: true },
        { data: null, expected: false },
        { data: '', expected: true } // stringToBool evaluates just any string regardless of value to true
      ];

      expect(
        await idsFlex.evaluate((element: IdsLayoutFlex) => element.fullHeight)
      ).toBeFalsy();

      for (const height of testData) {
        expect(await idsFlex.evaluate((element: IdsLayoutFlex, tHeight) => {
          element.fullHeight = tHeight;
          return element.fullHeight;
        }, height.data)).toEqual(height.expected);
        if (height.expected) {
          await expect(idsFlex).toHaveAttribute('full-height', '');
        } else {
          await expect(idsFlex).not.toHaveAttribute('full-height');
        }
      }
    });
  });

  test.describe('IdsLayoutFlexItem functionality test', () => {
    let idsFlex: Locator;
    let idsFlexItem: Locator;

    // remove all layout grid for visiblity
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        for (const elem of document.querySelectorAll('ids-layout-grid')) {
          elem.parentNode!.removeChild(elem);
        }
        const idsLF = document.createElement('ids-layout-flex') as IdsLayoutFlex;
        idsLF.setAttribute('id', 'test-layout-flex');
        document.querySelector('ids-container')?.appendChild(idsLF);
        const idsLFI = document.createElement('ids-layout-flex-item') as IdsLayoutFlexItem;
        idsLFI.setAttribute('id', 'test-layout-flex-item');
        idsLF.appendChild(idsLFI);
      });
      idsFlex = await page.locator('#test-layout-flex');
      idsFlexItem = await idsFlex.locator('#test-layout-flex-item');
    });

    test('can set/get alignSelf attribute', async () => {
      const testData = [
        { data: 'center', expected: 'center' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlexItem.evaluate((element: IdsLayoutFlexItem) => element.alignSelf)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsFlexItem.evaluate((element: IdsLayoutFlexItem, tAlign) => {
          element.alignSelf = tAlign;
          return element.alignSelf;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsFlexItem).toHaveAttribute('align-self', align.expected);
        } else {
          await expect(idsFlexItem).not.toHaveAttribute('align-self');
        }
      }
    });

    test('can set/get grow attribute', async () => {
      const testData = [
        { data: 0, expected: '0' },
        { data: '1', expected: '1' },
        { data: 2, expected: null },
        { data: 'invalid', expected: null },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlexItem.evaluate((element: IdsLayoutFlexItem) => element.grow)
      ).toBeFalsy();

      for (const grow of testData) {
        expect(await idsFlexItem.evaluate((element: IdsLayoutFlexItem, tGrow) => {
          element.grow = tGrow;
          return element.grow;
        }, grow.data)).toEqual(grow.expected);
        if (typeof grow.expected === 'string') {
          await expect(idsFlexItem).toHaveAttribute('grow', grow.expected);
        } else {
          await expect(idsFlexItem).not.toHaveAttribute('grow');
        }
      }
    });

    test('can set/get shrink attribute', async () => {
      const testData = [
        { data: 0, expected: '0' },
        { data: '1', expected: '1' },
        { data: 2, expected: null },
        { data: 'invalid', expected: null },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlexItem.evaluate((element: IdsLayoutFlexItem) => element.shrink)
      ).toBeFalsy();

      for (const shrink of testData) {
        expect(await idsFlexItem.evaluate((element: IdsLayoutFlexItem, tShrink) => {
          element.shrink = tShrink;
          return element.shrink;
        }, shrink.data)).toEqual(shrink.expected);
        if (typeof shrink.expected === 'string') {
          await expect(idsFlexItem).toHaveAttribute('shrink', shrink.expected);
        } else {
          await expect(idsFlexItem).not.toHaveAttribute('shrink');
        }
      }
    });

    test('can set/get overflow attribute', async () => {
      const testData = [
        { data: 'auto', expected: 'auto' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsFlexItem.evaluate((element: IdsLayoutFlexItem) => element.overflow)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsFlexItem.evaluate((element: IdsLayoutFlexItem, tFlow) => {
          element.overflow = tFlow;
          return element.overflow;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsFlexItem).toHaveAttribute('overflow', flow.expected);
        } else {
          await expect(idsFlexItem).not.toHaveAttribute('overflow');
        }
      }
    });
  });
});
