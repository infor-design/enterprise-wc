import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';

test.describe('IdsLayoutGrid tests', () => {
  const url = '/ids-layout-grid/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Layout Grid Component');
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
      const handle = await page.$('ids-layout-grid');
      const html = await handle?.evaluate((el: IdsLayoutGrid) => el?.outerHTML);
      await expect(html).toMatchSnapshot('layout-grid-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-layout-grid');
      const html = await handle?.evaluate((el: IdsLayoutGrid) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('layout-grid-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-layout-grid-light');
    });
  });

  test.describe('end to end tests', () => {
    test('can render 8 column grid with child elements', async ({ page }) => {
      const idsLayoutGrid = await page.locator('#eight-column-grid');
      await expect(idsLayoutGrid).toBeAttached();
      await expect(idsLayoutGrid).toHaveAttribute('cols', '8');
      await expect(idsLayoutGrid.locator('ids-layout-grid-cell')).toHaveCount(21);

      const expectedAttributes = [
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '1' },
        { colSpan: '2' },
        { colSpan: '2' },
        { colSpan: '2' },
        { colSpan: '2' },
        { colSpan: '4' },
        { colSpan: '4' },
        { colSpan: '5' },
        { colSpan: '3' },
        { colSpan: '6' },
        { colSpan: '2' },
        { colSpan: '7' },
        { colSpan: '1' },
        { colSpan: '8' },
      ];
      (await idsLayoutGrid.locator('ids-layout-grid-cell').all()).forEach(async (elem, index) => {
        await expect(elem).toHaveAttribute('col-span', expectedAttributes[index].colSpan);
      });
    });
  });

  test.describe('functionality test', () => {
    let idsLayoutGrid: Locator;

    // remove all layout grid for visiblity
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        for (const elem of document.querySelectorAll('ids-layout-grid')) {
          elem.parentNode!.removeChild(elem);
        }
        const idsLG = document.createElement('ids-layout-grid') as IdsLayoutGrid;
        idsLG.setAttribute('id', 'test-layout-grid');
        document.querySelector('ids-container')?.appendChild(idsLG);
      });
      idsLayoutGrid = await page.locator('#test-layout-grid');
    });

    test('can set/get alignContent attribute', async () => {
      const testData = [
        { data: 'center', expected: 'center' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.alignContent)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tAlign) => {
          element.alignContent = tAlign;
          return element.alignContent;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('align-content', align.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('align-content');
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
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.alignItems)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tAlign) => {
          element.alignItems = tAlign;
          return element.alignItems;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('align-items', align.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('align-items');
        }
      }
    });

    test('can set/get autoFit attribute', async () => {
      const testData = [
        { data: 'true', expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false },
        { data: '', expected: true }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.autoFit)
      ).toBeFalsy();

      for (const fitStyle of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, fit) => {
          element.autoFit = fit;
          return element.autoFit;
        }, fitStyle.data)).toEqual(fitStyle.expected);
        if (fitStyle.expected) {
          await expect(idsLayoutGrid).toHaveAttribute('auto-fit', '');
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('auto-fit');
        }
      }
    });

    test('can set/get autoFill attribute', async () => {
      const testData = [
        { data: 'true', expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false },
        { data: '', expected: true }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.autoFill)
      ).toBeFalsy();

      for (const fill of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFill) => {
          element.autoFill = tFill;
          return element.autoFill;
        }, fill.data)).toEqual(fill.expected);
        if (fill.expected) {
          await expect(idsLayoutGrid).toHaveAttribute('auto-fill', '');
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('auto-fill');
        }
      }
    });

    test('can set/get cols attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.cols)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.cols = tCol;
          return element.cols;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols');
        }
      }
    });

    test('can set/get colsXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.colsXs)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.colsXs = tCol;
          return element.colsXs;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols-xs', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols-xs');
        }
      }
    });

    test('can set/get colsSm attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.colsSm)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.colsSm = tCol;
          return element.colsSm;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols-sm', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols-sm');
        }
      }
    });

    test('can set/get colsMd attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.colsMd)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.colsMd = tCol;
          return element.colsMd;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols-md', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols-md');
        }
      }
    });

    test('can set/get colsLg attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.colsLg)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.colsLg = tCol;
          return element.colsLg;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols-lg', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols-lg');
        }
      }
    });

    test('can set/get colsXl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.colsXl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.colsXl = tCol;
          return element.colsXl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols-xl', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols-xl');
        }
      }
    });

    test('can set/get colsXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.colsXxl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tCol) => {
          element.colsXxl = tCol;
          return element.colsXxl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('cols-xxl', col.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('cols-xxl');
        }
      }
    });

    test('can set/get minColWidth attribute', async () => {
      const testData = [
        { data: '200px', expected: '200px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.minColWidth)
      ).toBeNull();

      for (const width of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tWidth) => {
          element.minColWidth = tWidth;
          return element.minColWidth;
        }, width.data)).toEqual(width.expected);
        if (typeof width.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('min-col-width', width.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('min-col-width');
        }

        if (width.data) {
          await expect(idsLayoutGrid).toHaveCSS('--min-col-width', width.expected);
        } else {
          await expect(idsLayoutGrid).toHaveAttribute('style', '');
        }
      }
    });

    test('can set/get maxColWidth attribute', async () => {
      const testData = [
        { data: '200px', expected: '200px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.maxColWidth)
      ).toBeNull();

      for (const width of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tWidth) => {
          element.maxColWidth = tWidth;
          return element.maxColWidth;
        }, width.data)).toEqual(width.expected);
        if (typeof width.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('max-col-width', width.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('max-col-width');
        }

        if (width.data) {
          await expect(idsLayoutGrid).toHaveCSS('--max-col-width', width.expected);
        } else {
          await expect(idsLayoutGrid).toHaveAttribute('style', '');
        }
      }
    });

    test('can set/get minRowHeight attribute', async () => {
      const testData = [
        { data: '200px', expected: '200px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.minRowHeight)
      ).toBeNull();

      for (const height of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tHeight) => {
          element.minRowHeight = tHeight;
          return element.minRowHeight;
        }, height.data)).toEqual(height.expected);
        if (typeof height.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('min-row-height', height.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('min-row-height');
        }

        if (height.data) {
          await expect(idsLayoutGrid).toHaveCSS('--min-row-height', height.expected);
        } else {
          await expect(idsLayoutGrid).toHaveAttribute('style', '');
        }
      }
    });

    test('can set/get maxRowHeight attribute', async () => {
      const testData = [
        { data: '200px', expected: '200px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.maxRowHeight)
      ).toBeNull();

      for (const height of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tHeight) => {
          element.maxRowHeight = tHeight;
          return element.maxRowHeight;
        }, height.data)).toEqual(height.expected);
        if (typeof height.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('max-row-height', height.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('max-row-height');
        }

        if (height.data) {
          await expect(idsLayoutGrid).toHaveCSS('--max-row-height', height.expected);
        } else {
          await expect(idsLayoutGrid).toHaveAttribute('style', '');
        }
      }
    });

    test('can set/get gap attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.gap)
      ).toBeNull();

      for (const gap of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tGap) => {
          element.gap = tGap;
          return element.gap;
        }, gap.data)).toEqual(gap.expected);
        if (typeof gap.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('gap', gap.expected as string);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('gap');
        }
      }
    });

    test('can set/get margin attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.margin)
      ).toBeNull();

      for (const margin of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tMargin) => {
          element.margin = tMargin;
          return element.margin;
        }, margin.data)).toEqual(margin.expected);
        if (typeof margin.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('margin', margin.expected as string);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('margin');
        }
      }
    });

    test('can set/get marginY attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.marginY)
      ).toBeNull();

      for (const margin of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tMargin) => {
          element.marginY = tMargin;
          return element.marginY;
        }, margin.data)).toEqual(margin.expected);
        if (typeof margin.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('margin-y', margin.expected as string);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('margin-y');
        }
      }
    });

    test('can set/get maxWidth attribute', async () => {
      // data sequence is important in this test
      // after setting 200px, style is not removed when width is set invalid or null afterwards
      const testData = [
        { data: '200px', expected: '200px' },
        { data: 'invalid', expected: null },
        { data: 'xs', expected: 'xs' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.maxWidth)
      ).toBeNull();

      for (const width of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tWidth) => {
          element.maxWidth = tWidth;
          return element.maxWidth;
        }, width.data)).toEqual(width.expected);
        if (width.expected) {
          await expect(idsLayoutGrid).toHaveAttribute('max-width', width.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('max-width');
        }

        if (width.expected?.endsWith('px')) await expect(idsLayoutGrid).toHaveCSS('--max-width', width.expected);
      }
    });

    test('can set/get padding attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.padding)
      ).toBeNull();

      for (const padding of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tPadding) => {
          element.padding = tPadding;
          return element.padding;
        }, padding.data)).toEqual(padding.expected);
        if (typeof padding.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('padding', padding.expected as string);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('padding');
        }
      }
    });

    test('can set/get paddingX attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.paddingX)
      ).toBeNull();

      for (const padding of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tPadding) => {
          element.paddingX = tPadding;
          return element.paddingX;
        }, padding.data)).toEqual(padding.expected);
        if (typeof padding.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('padding-x', padding.expected as string);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('padding-x');
        }
      }
    });

    test('can set/get paddingY attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.paddingY)
      ).toBeNull();

      for (const padding of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tPadding) => {
          element.paddingY = tPadding;
          return element.paddingY;
        }, padding.data)).toEqual(padding.expected);
        if (typeof padding.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('padding-y', padding.expected as string);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('padding-y');
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
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.justifyContent)
      ).toBeFalsy();

      for (const align of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tAlign) => {
          element.justifyContent = tAlign;
          return element.justifyContent;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('justify-content', align.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('justify-content');
        }
      }
    });

    test('can set/get flow attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flow)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flow = tFlow;
          return element.flow;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow');
        }
      }
    });

    test('can set/get flowXs attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flowXs)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flowXs = tFlow;
          return element.flowXs;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow-xs', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow-xs');
        }
      }
    });

    test('can set/get flowSm attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flowSm)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flowSm = tFlow;
          return element.flowSm;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow-sm', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow-sm');
        }
      }
    });

    test('can set/get flowMd attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flowMd)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flowMd = tFlow;
          return element.flowMd;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow-md', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow-md');
        }
      }
    });

    test('can set/get flowLg attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flowLg)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flowLg = tFlow;
          return element.flowLg;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow-lg', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow-lg');
        }
      }
    });

    test('can set/get flowXl attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flowXl)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flowXl = tFlow;
          return element.flowXl;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow-xl', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow-xl');
        }
      }
    });

    test('can set/get flowXxl attribute', async () => {
      const testData = [
        { data: 'dense', expected: 'dense' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.flowXxl)
      ).toBeFalsy();

      for (const flow of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tFlow) => {
          element.flowXxl = tFlow;
          return element.flowXxl;
        }, flow.data)).toEqual(flow.expected);
        if (typeof flow.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('flow-xxl', flow.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('flow-xxl');
        }
      }
    });

    test('can set/get rows attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rows)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rows = tRow;
          return element.rows;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows');
        }
      }
    });

    test('can set/get rowsXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowsXs)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rowsXs = tRow;
          return element.rowsXs;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows-xs', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows-xs');
        }
      }
    });

    test('can set/get rowsSm attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowsSm)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rowsSm = tRow;
          return element.rowsSm;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows-sm', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows-sm');
        }
      }
    });

    test('can set/get rowsMd attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowsMd)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rowsMd = tRow;
          return element.rowsMd;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows-md', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows-md');
        }
      }
    });

    test('can set/get rowsLg attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowsLg)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rowsLg = tRow;
          return element.rowsLg;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows-lg', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows-lg');
        }
      }
    });

    test('can set/get rowsXl attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowsXl)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rowsXl = tRow;
          return element.rowsXl;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows-xl', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows-xl');
        }
      }
    });

    test('can set/get rowsXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowsXxl)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRow) => {
          element.rowsXxl = tRow;
          return element.rowsXxl;
        }, row.data)).toEqual(row.expected);
        if (typeof row.data === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('rows-xxl', row.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('rows-xxl');
        }
      }
    });

    test('can set/get rowHeight attribute', async () => {
      const testData = [
        { data: '200px', expected: '200px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.rowHeight)
      ).toBeNull();

      for (const height of testData) {
        expect(await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tHeight) => {
          element.rowHeight = tHeight;
          return element.rowHeight;
        }, height.data)).toEqual(height.expected);
        if (typeof height.expected === 'string') {
          await expect(idsLayoutGrid).toHaveAttribute('row-height', height.expected);
        } else {
          await expect(idsLayoutGrid).not.toHaveAttribute('row-height');
        }

        if (height.data) {
          await expect(idsLayoutGrid).toHaveCSS('--grid-auto-row-height', height.expected);
          await expect(idsLayoutGrid).toHaveClass(/ids-layout-grid-auto-row-height/);
        } else {
          await expect(idsLayoutGrid).toHaveAttribute('style', '');
        }
      }
    });
  });
});
