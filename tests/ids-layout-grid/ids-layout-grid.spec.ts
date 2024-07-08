import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/components/ids-layout-grid/ids-layout-grid-cell';

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

  test.describe('IdsLayoutGrid functionality test', () => {
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

  test.describe('IdsLayoutGridCell functionality test', () => {
    let idsLayoutGrid: Locator;
    let idsGridCell: Locator;

    // remove all layout grid for visiblity
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        for (const elem of document.querySelectorAll('ids-layout-grid')) {
          elem.parentNode!.removeChild(elem);
        }
        const idsLG = document.createElement('ids-layout-grid') as IdsLayoutGrid;
        idsLG.setAttribute('id', 'test-layout-grid');
        document.querySelector('ids-container')?.appendChild(idsLG);
        const idsLGC = document.createElement('ids-layout-grid-cell') as IdsLayoutGridCell;
        idsLGC.setAttribute('id', 'test-layout-grid-cell');
        idsLG.appendChild(idsLGC);
      });
      idsLayoutGrid = await page.locator('#test-layout-grid');
      idsGridCell = await idsLayoutGrid.locator('#test-layout-grid-cell');
    });

    test('can set/get alignContent attribute', async () => {
      const testData = [
        { data: 'start', expected: 'start' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.alignContent)
      ).toBeNull();

      for (const align of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tAlign) => {
          element.alignContent = tAlign;
          return element.alignContent;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('align-content', align.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('align-content');
        }
      }
    });

    test('can set/get colEnd attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEnd)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEnd = tCol;
          return element.colEnd;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end');
        }
      }
    });

    test('can set/get colEndXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEndXs)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEndXs = tCol;
          return element.colEndXs;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end-xs', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end-xs');
        }
      }
    });

    test('can set/get colEndSm attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEndSm)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEndSm = tCol;
          return element.colEndSm;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end-sm', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end-sm');
        }
      }
    });

    test('can set/get colEndMd attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEndMd)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEndMd = tCol;
          return element.colEndMd;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end-md', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end-md');
        }
      }
    });

    test('can set/get colEndLg attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEndLg)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEndLg = tCol;
          return element.colEndLg;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end-lg', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end-lg');
        }
      }
    });

    test('can set/get colEndXl attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEndXl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEndXl = tCol;
          return element.colEndXl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end-xl', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end-xl');
        }
      }
    });

    test('can set/get colEndXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colEndXxl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colEndXxl = tCol;
          return element.colEndXxl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-end-xxl', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-end-xxl');
        }
      }
    });

    test('can set/get colSpan attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpan)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpan = tCol;
          return element.colSpan;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span');
        }
      }
    });

    test('can set/get colSpanXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpanXs)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpanXs = tCol;
          return element.colSpanXs;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span-xs', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span-xs');
        }
      }
    });

    test('can set/get colSpanSm attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpanSm)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpanSm = tCol;
          return element.colSpanSm;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span-sm', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span-sm');
        }
      }
    });

    test('can set/get colSpanMd attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpanMd)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpanMd = tCol;
          return element.colSpanMd;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span-md', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span-md');
        }
      }
    });

    test('can set/get colSpanLg attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpanLg)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpanLg = tCol;
          return element.colSpanLg;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span-lg', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span-lg');
        }
      }
    });

    test('can set/get colSpanXl attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpanXl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpanXl = tCol;
          return element.colSpanXl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span-xl', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span-xl');
        }
      }
    });

    test('can set/get colSpanXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colSpanXxl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colSpanXxl = tCol;
          return element.colSpanXxl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-span-xxl', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-span-xxl');
        }
      }
    });

    test('can set/get colStart attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStart)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStart = tCol;
          return element.colStart;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start');
        }
      }
    });

    test('can set/get colStartXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStartXs)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStartXs = tCol;
          return element.colStartXs;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start-xs', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start-xs');
        }
      }
    });

    test('can set/get colStartSm attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStartSm)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStartSm = tCol;
          return element.colStartSm;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start-sm', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start-sm');
        }
      }
    });

    test('can set/get colStartMd attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStartMd)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStartMd = tCol;
          return element.colStartMd;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start-md', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start-md');
        }
      }
    });

    test('can set/get colStartLg attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStartLg)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStartLg = tCol;
          return element.colStartLg;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start-lg', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start-lg');
        }
      }
    });

    test('can set/get colStartXl attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStartXl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStartXl = tCol;
          return element.colStartXl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start-xl', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start-xl');
        }
      }
    });

    test('can set/get colStartXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.colStartXxl)
      ).toBeNull();

      for (const col of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tCol) => {
          element.colStartXxl = tCol;
          return element.colStartXxl;
        }, col.data)).toEqual(col.expected);
        if (typeof col.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('col-start-xxl', col.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('col-start-xxl');
        }
      }
    });

    test('can set/get editable attribute', async () => {
      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.editable)
      ).toBeFalsy();

      await expect(idsGridCell).not.toHaveAttribute('editable');
      expect((await idsGridCell.locator('ids-button').all()).length).toEqual(0);

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.editable = true;
        return element.editable;
      })).toBeTruthy();

      await expect(idsGridCell).toHaveAttribute('editable');
      expect((await idsGridCell.locator('ids-button').all()).length).toBeGreaterThan(0);

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.editable = false;
        return element.editable;
      })).toBeFalsy();

      await expect(idsGridCell).not.toHaveAttribute('editable');
    });

    test('can set/get fill attribute', async () => {
      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.fill)
      ).toBeFalsy();

      await expect(idsGridCell).not.toHaveAttribute('fill');

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.fill = true;
        return element.fill;
      })).toBeTruthy();

      await expect(idsGridCell).toHaveAttribute('fill');

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.fill = false;
        return element.fill;
      })).toBeFalsy();

      await expect(idsGridCell).not.toHaveAttribute('fill');
    });

    test('can set/get height attribute', async () => {
      const testData = [
        { data: '100px', expected: '100px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.height)
      ).toBeNull();

      for (const height of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tHeight) => {
          element.height = tHeight;
          return element.height;
        }, height.data)).toEqual(height.expected);
        if (typeof height.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('height', height.expected);
          await expect(idsGridCell).toHaveCSS('height', (height.expected.length === 0) ? '0px' : height.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('height');
          await expect(idsGridCell).toHaveAttribute('style', '');
        }
      }
    });

    test('can set/get justifyContent attribute', async () => {
      const testData = [
        { data: 'start', expected: 'start' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.justifyContent)
      ).toBeNull();

      for (const align of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tAlign) => {
          element.justifyContent = tAlign;
          return element.justifyContent;
        }, align.data)).toEqual(align.expected);
        if (typeof align.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('justify-content', align.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('justify-content');
        }
      }
    });

    test('can set/get minHeight attribute', async () => {
      const testData = [
        { data: '100px', expected: '100px' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.minHeight)
      ).toBeNull();

      for (const height of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tHeight) => {
          element.minHeight = tHeight;
          return element.minHeight;
        }, height.data)).toEqual(height.expected);
        if (typeof height.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('min-height', height.expected);
          await expect(idsGridCell).toHaveCSS('min-height', (height.expected.length === 0) ? 'auto' : height.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('min-height');
          await expect(idsGridCell).toHaveAttribute('style', '');
        }
      }
    });

    test('can set/get order attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.order)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.order = tOrder;
          return element.order;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order');
        }
      }
    });

    test('can set/get orderXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.orderXs)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.orderXs = tOrder;
          return element.orderXs;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order-xs', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order-xs');
        }
      }
    });

    test('can set/get orderSm attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.orderSm)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.orderSm = tOrder;
          return element.orderSm;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order-sm', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order-sm');
        }
      }
    });

    test('can set/get orderMd attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.orderMd)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.orderMd = tOrder;
          return element.orderMd;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order-md', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order-md');
        }
      }
    });

    test('can set/get orderLg attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.orderLg)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.orderLg = tOrder;
          return element.orderLg;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order-lg', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order-lg');
        }
      }
    });

    test('can set/get orderXl attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.orderXl)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.orderXl = tOrder;
          return element.orderXl;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order-xl', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order-xl');
        }
      }
    });

    test('can set/get orderXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.orderXxl)
      ).toBeNull();

      for (const order of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tOrder) => {
          element.orderXxl = tOrder;
          return element.orderXxl;
        }, order.data)).toEqual(order.expected);
        if (typeof order.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('order-xxl', order.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('order-xxl');
        }
      }
    });

    test('can set/get padding attribute', async () => {
      const testData = [
        { data: 'md', expected: 'md' },
        { data: null, expected: null },
        { data: 'invalid', expected: null }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.padding)
      ).toBeNull();

      for (const padding of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tPadding) => {
          element.padding = tPadding;
          return element.padding;
        }, padding.data)).toEqual(padding.expected);
        if (typeof padding.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('padding', padding.expected as string);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('padding');
        }
      }
    });

    test('can set/get rowSpan attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpan)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpan = tRow;
          return element.rowSpan;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span');
        }
      }
    });

    test('can set/get rowSpanXs attribute', async () => {
      const testData = [
        { data: '1', expected: '1' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpanXs)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpanXs = tRow;
          return element.rowSpanXs;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span-xs', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span-xs');
        }
      }
    });

    test('can set/get rowSpanSm attribute', async () => {
      const testData = [
        { data: '2', expected: '2' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpanSm)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpanSm = tRow;
          return element.rowSpanSm;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span-sm', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span-sm');
        }
      }
    });

    test('can set/get rowSpanMd attribute', async () => {
      const testData = [
        { data: '3', expected: '3' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpanMd)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpanMd = tRow;
          return element.rowSpanMd;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span-md', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span-md');
        }
      }
    });

    test('can set/get rowSpanLg attribute', async () => {
      const testData = [
        { data: '4', expected: '4' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpanLg)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpanLg = tRow;
          return element.rowSpanLg;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span-lg', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span-lg');
        }
      }
    });

    test('can set/get rowSpanXl attribute', async () => {
      const testData = [
        { data: '5', expected: '5' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpanXl)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpanXl = tRow;
          return element.rowSpanXl;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span-xl', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span-xl');
        }
      }
    });

    test('can set/get rowSpanXxl attribute', async () => {
      const testData = [
        { data: '6', expected: '6' },
        { data: null, expected: null },
        { data: '', expected: '' }
      ];

      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.rowSpanXxl)
      ).toBeNull();

      for (const row of testData) {
        expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, tRow) => {
          element.rowSpanXxl = tRow;
          return element.rowSpanXxl;
        }, row.data)).toEqual(row.expected);
        if (typeof row.expected === 'string') {
          await expect(idsGridCell).toHaveAttribute('row-span-xxl', row.expected);
        } else {
          await expect(idsGridCell).not.toHaveAttribute('row-span-xxl');
        }
      }
    });

    test('can set/get sticky attribute', async () => {
      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.sticky)
      ).toBeFalsy();
      await expect(idsGridCell).not.toHaveAttribute('sticky');
      await expect(idsGridCell).not.toHaveClass(/ids-layout-grid-sticky/);
      await expect(idsGridCell).not.toHaveAttribute('style');

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.sticky = true;
        return element.sticky;
      })).toBeTruthy();
      await expect(idsGridCell).toHaveAttribute('sticky');
      await expect(idsGridCell).toHaveClass(/ids-layout-grid-sticky/);
      await expect(idsGridCell).toHaveCSS('--sticky-position', '0');

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.sticky = false;
        return element.sticky;
      })).toBeFalsy();
      await expect(idsGridCell).not.toHaveAttribute('sticky');
      await expect(idsGridCell).not.toHaveClass(/ids-layout-grid-sticky/);
      await expect(idsGridCell).toHaveAttribute('style', '');
    });

    test('can set/get sticky position attribute', async () => {
      expect(
        await idsGridCell.evaluate((element: IdsLayoutGridCell) => element.stickyPosition)
      ).toBeFalsy();
      await expect(idsGridCell).not.toHaveAttribute('sticky-position');
      await expect(idsGridCell).not.toHaveAttribute('style');

      const stickyValue = 'stickyPosition';
      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell, value) => {
        element.stickyPosition = value;
        return element.stickyPosition;
      }, stickyValue)).toEqual(stickyValue);
      await expect(idsGridCell).toHaveAttribute('sticky-position');
      await expect(idsGridCell).toHaveCSS('--sticky-position', stickyValue);

      expect(await idsGridCell.evaluate((element: IdsLayoutGridCell) => {
        element.stickyPosition = null;
        return element.stickyPosition;
      })).toBeNull();
      await expect(idsGridCell).not.toHaveAttribute('sticky-position');
      await expect(idsGridCell).toHaveAttribute('style', '');
    });

    test('can set/get templateRows attribute', async () => {
      const testData = [
        { data: '100px 200px', expected: '100px 200px' },
        { data: null, expected: null },
        { data: '', expected: null } // Treating empty string as null
      ];

      expect(
        await idsLayoutGrid.evaluate((element: IdsLayoutGrid) => element.templateRows)
      ).toBeNull();

      for (const rows of testData) {
        const result = await idsLayoutGrid.evaluate((element: IdsLayoutGrid, tRows) => {
          element.templateRows = tRows;
          const templateRowsValue = element.templateRows === '' ? null : element.templateRows;
          return {
            templateRows: templateRowsValue,
            hasAttribute: element.hasAttribute('template-rows'),
            attributeValue: element.getAttribute('template-rows'),
            styleValue: element.style.getPropertyValue('--grid-template-rows')
          };
        }, rows.data);

        expect(result.templateRows).toEqual(rows.expected);

        if (rows.expected !== null) {
          expect(result.hasAttribute).toBeTruthy();
          expect(result.attributeValue).toEqual(rows.expected);
          expect(result.styleValue).toEqual(rows.expected);
        }
      }
    });
  });
});
