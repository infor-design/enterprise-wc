import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsPagerInput from '../../src/components/ids-pager/ids-pager-input';
import IdsDataGridCell from '../../src/components/ids-data-grid/ids-data-grid-cell';
import IdsDataGridRow from '../../src/components/ids-data-grid/ids-data-grid-row';
import { IdsZip } from '../../src/utils/ids-zip/ids-zip';
import { XLSXFormatter } from '../../src/utils/ids-excel-exporter/ids-excel-formatter';
import { ExcelColumn } from '../../src/utils/ids-excel-exporter/ids-worksheet-templates';
import type IdsInput from '../../src/components/ids-input/ids-input';
import type IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';

test.describe('IdsDataGrid tests', () => {
  const url = '/ids-data-grid/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Data Grid Component');
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
      await page.goto('/ids-data-grid/example.html');
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('client-side paging tests', () => {
    const clientPagingUrl = '/ids-data-grid/pagination-client-side.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(clientPagingUrl);
    });

    test('renders pager', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const dataGridEl = await page.locator('ids-data-grid');
      await expect(await dataGridEl.getAttribute('pagination')).toEqual('client-side');

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');
    });

    test('clear data', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="5"] [aria-colindex="1"]')).click();

      const titleText = await page.locator('#title-text');
      await expect(await titleText.textContent()).toEqual('1 Result');

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');

      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');

      const clearBtn = await page.locator('[aria-label="Clear Row"]');
      await clearBtn.click();

      await expect(await titleText.textContent()).toEqual('');

      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="5"] [aria-colindex="3"]').textContent()).toEqual('');

      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();

      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();

      await clearBtn.click();

      await pagerLastBtn.click();
      await expect(await titleText.textContent()).toEqual('');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="3"]').textContent()).toEqual('');
    });

    test('remove data', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="5"] [aria-colindex="1"]')).click();

      const titleText = await page.locator('#title-text');
      await expect(await titleText.textContent()).toEqual('1 Result');

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');

      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');

      const deleteBtn = await page.locator('[aria-label="Delete Row"]');
      await deleteBtn.click();

      await expect(await titleText.textContent()).toEqual('');

      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');

      await expect(await page.locator('ids-data-grid [aria-rowindex="10"] [aria-colindex="2"]').textContent()).toEqual('21');

      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();

      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await deleteBtn.click();

      await pagerLastBtn.click();
      await expect(await titleText.textContent()).toEqual('');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('993');
    });

    test('navigates pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');

      // Set number input
      const pagerInputHandle = await page.$('ids-data-grid ids-pager-input');
      await pagerInputHandle?.evaluate((el: IdsPagerInput) => {
        el.setAttribute('page-number', '2');
      });
      await expect(await pagerInputHandle?.getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('3');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('21');

      // Click previous button
      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click first button
      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('1');

      // Click last button
      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('100');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('991');
    });

    test('selects across pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      // Check two items on first page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      // Check two items on second page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      const handle = await page.$('ids-data-grid');
      const selectedRows = await handle?.evaluate((el: IdsDataGrid) => el?.selectedRowsAcrossPages);
      await expect(selectedRows?.length).toEqual(4);
    });
  });

  test.describe('server-side paging tests', () => {
    const clientPagingUrl = '/ids-data-grid/pagination-server-side.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(clientPagingUrl);
    });

    test('renders pager', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const dataGridEl = await page.locator('ids-data-grid');
      await expect(await dataGridEl.getAttribute('pagination')).toEqual('server-side');

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');
    });

    test('navigates pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');

      // Set number input
      const pagerInputHandle = await page.$('ids-data-grid ids-pager-input');
      await pagerInputHandle?.evaluate((el: IdsPagerInput) => {
        el.setAttribute('page-number', '2');
      });
      await expect(await pagerInputHandle?.getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('3');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('21');

      // Click previous button
      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click first button
      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('1');

      // Click last button
      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('100');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('991');
    });

    test('selects across pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      // Check two items on first page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      // Check two items on second page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      const handle = await page.$('ids-data-grid');
      const selectedRows = await handle?.evaluate((el: IdsDataGrid) => el?.selectedRowsAcrossPages);
      await expect(selectedRows?.length).toEqual(4);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-data-grid');
      const html = await handle?.evaluate((el: IdsDataGrid) => el?.outerHTML);
      await expect(html).toMatchSnapshot('data-grid-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-data-grid');
      const html = await handle?.evaluate((el: IdsDataGrid) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('data-grid-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-data-grid-light');
    });

    test('should match the visual snapshot in percy (standalone css)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/standalone-css.html');
      await percySnapshot(page, 'ids-data-grid-standalone-light');
    });

    test('should match the visual snapshot in percy (list style)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/list-style.html');
      await percySnapshot(page, 'ids-data-grid-list-style-light');
    });

    test('should match the visual snapshot in percy (auto fit)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/list-style.html');
      await percySnapshot(page, 'ids-data-grid-auto-fit-light');
    });

    test('should not have visual regressions in percy (auto columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-auto.html');
      await percySnapshot(page, 'ids-data-grid-auto-columns-light');
    });

    test('should not have visual regressions in percy (fixed columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-fixed.html');
      await percySnapshot(page, 'ids-data-grid-columns-fixed-light');
    });

    test('should not have visual regressions in percy (percent columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-percent.html');
      await percySnapshot(page, 'ids-data-grid-columns-percent-light');
    });

    test('should not have visual regressions in percy (column formatters)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-formatters.html');
      await percySnapshot(page, 'ids-data-grid-columns-formatters-light');
    });

    test('should not have visual regressions in percy (column alignment)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-alignment.html');
      await percySnapshot(page, 'ids-data-grid-columns-alignment-light');
    });

    test('should not have visual regressions in percy (column groups)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-groups.html');
      await percySnapshot(page, 'ids-data-grid-columns-groups-light');
    });

    test('should not have visual regressions in percy (stretch coluimn)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-stretch.html');
      await percySnapshot(page, 'ids-data-grid-columns-stretch-light');
    });

    test('should not have visual regressions in percy (frozen columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/columns-frozen.html');
      await percySnapshot(page, 'ids-data-grid-columns-frozen-light');
    });

    test('should not have visual regressions in percy (alternate row shading)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/alternate-row-shading.html');
      await percySnapshot(page, 'ids-data-grid-alternate-row-shading-light');
    });

    test('should not have visual regressions in percy (expandable-row)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/expandable-row.html');
      await percySnapshot(page, 'ids-data-grid-expandable-row-light');
    });

    test('should not have visual regressions in percy (tree grid)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/tree-grid.html');
      await percySnapshot(page, 'ids-data-grid-tree-grid-light');
    });

    test('should not have visual regressions in percy (editable inline)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/editable-inline.html');
      await percySnapshot(page, 'ids-data-grid-editable-inline-light');
    });

    test('should not have visual regressions in percy (loading indicator)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-data-grid/loading-indicator.html');
      await percySnapshot(page, 'ids-data-grid-loading-indicator-light');
    });
  });

  test.describe('cell functionality tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-data-grid/columns-formatters.html');
    });

    test('renders rowNumber cells', async ({ page }) => {
      const cell = await page.locator('ids-data-grid ids-data-grid-cell:nth-child(3)').first();
      expect(await cell.innerHTML()).toBe(`<span class="text-ellipsis">1</span>`);
      await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGridCell>('ids-data-grid ids-data-grid-cell:nth-child(2)');
        elem?.renderCell();
      });
      expect(await cell.innerHTML()).toBe(`<span class="text-ellipsis">1</span>`);
    });

    test('renders custom formatters cells', async ({ page }) => {
      const cell = await page.locator('ids-data-grid ids-data-grid-cell:nth-child(24)').first();
      expect(await cell.innerHTML()).toBe(`<span class="text-ellipsis">Custom: 12.99</span>`);
      await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGridCell>('ids-data-grid ids-data-grid-cell:nth-child(24)');
        elem?.renderCell();
      });
      expect(await cell.innerHTML()).toBe(`<span class="text-ellipsis">Custom: 12.99</span>`);
    });

    test.describe('empty message tests', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/ids-data-grid/empty-message.html');
      });

      test('can set empty message description', async ({ page }) => {
        const str = 'test';
        const locator = await page.locator('ids-data-grid');
        expect(await locator.getAttribute('empty-message-description')).toEqual(null);
        const value = await page.evaluate(() => {
          const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          return elem.emptyMessageDescription;
        });
        expect(await value).toEqual(null);

        const value2 = await page.evaluate((testStr: string) => {
          const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          elem.emptyMessageDescription = testStr;
          return elem.emptyMessageDescription;
        }, str);
        expect(await locator.getAttribute('empty-message-description')).toEqual(str);
        expect(await value2).toEqual(str);

        const value3 = await page.evaluate(() => {
          const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          elem.emptyMessageDescription = '';
          return elem.emptyMessageDescription;
        });
        expect(await locator.getAttribute('empty-message-description')).toEqual(null);
        expect(await value3).toEqual(null);

        const value4 = await page.evaluate(() => {
          const elem = document.querySelector('ids-data-grid') as any;
          elem.emptyMessageDescription = true;
          return elem.emptyMessageDescription;
        });
        expect(await locator.getAttribute('empty-message-description')).toEqual(null);
        expect(await value4).toEqual(null);
      });

      test('can set empty message label', async ({ page }) => {
        const str = 'test';
        const locator = await page.locator('ids-data-grid');
        expect(await locator.getAttribute('empty-message-label')).toEqual(null);
        const value = await page.evaluate(() => {
          const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          return elem.emptyMessageLabel;
        });
        expect(await value).toEqual(null);

        const value2 = await page.evaluate((testStr: string) => {
          const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          elem.emptyMessageLabel = testStr;
          return elem.emptyMessageLabel;
        }, str);
        expect(await locator.getAttribute('empty-message-label')).toEqual(str);
        expect(await value2).toEqual(str);

        const value3 = await page.evaluate(() => {
          const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          elem.emptyMessageLabel = '';
          return elem.emptyMessageLabel;
        });
        expect(await locator.getAttribute('empty-message-label')).toEqual(null);
        expect(await value3).toEqual(null);

        const value4 = await page.evaluate(() => {
          const elem = document.querySelector('ids-data-grid') as any;
          elem.emptyMessageLabel = true;
          return elem.emptyMessageLabel;
        });
        expect(await locator.getAttribute('empty-message-label')).toEqual(null);
        expect(await value4).toEqual(null);
      });
    });
  });

  test.describe('loading indicator tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-data-grid/loading-indicator.html');
    });

    test('can set minHeight', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid').first();
      expect(await dataGrid.getAttribute('min-height')).toBe('350px');
      const minHeight = await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.setAttribute('min-height', '450px');
        return elem.container!.style.minHeight;
      });
      expect(await minHeight).toBe(`450px`);
      const values = await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.setAttribute('min-height', '');
        return [elem.container!.style.minHeight, elem.minHeight];
      });
      expect(await values[0]).toBe('');
      expect(await values[1]).toBe('350px');
    });

    test('can start and stop loading indicator minHeight', async ({ page }) => {
      const isStarted = await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.loadingIndicator.start();
        return elem.loadingIndicator.getAttribute('stopped') === null;
      });
      expect(await isStarted).toBe(true);
      const isStopped = await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.loadingIndicator.stop();
        return elem.loadingIndicator.getAttribute('stopped') === '';
      });
      expect(await isStopped).toBe(true);
    });
  });

  test.describe('row tests', () => {
    test('can get rowsHidden', async ({ page }) => {
      const results = await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        return elem.rowsHidden.length;
      });
      expect(results).toBe(0);
      const results2 = await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.container!.querySelector<IdsDataGridRow>('ids-data-grid-row:nth-child(2)')!.hidden = true;
        return elem.rowsHidden.length;
      });
      expect(results2).toBe(1);
    });
  });

  test.describe('excel export tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-data-grid/export-excel.html');
    });

    test('can export to csv', async ({ page }) => {
      await page.on('download', async (download) => {
        // eslint-disable-next-line no-underscore-dangle
        expect(await (download as any)._url).toBeTruthy();
        // eslint-disable-next-line no-underscore-dangle
        expect(await (download as any)._suggestedFilename).toEqual('test.csv');
      });
      await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.exportToExcel('csv', 'test');
      });
    });

    test('can export to xlsx', async ({ page }) => {
      await page.on('download', async (download) => {
        // eslint-disable-next-line no-underscore-dangle
        expect(await (download as any)._url).toBeTruthy();
        // eslint-disable-next-line no-underscore-dangle
        expect(await (download as any)._suggestedFilename).toEqual('test.xlsx');
      });
      await page.evaluate(() => {
        const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        elem.exportToExcel('xlsx', 'test');
      });
    });

    test('can create a zip file', async ({ page }) => {
      await page.exposeFunction('createZip', () => {
        const root = new IdsZip();
        root.file('test.txt', 'test data');
        const zipFile = root.zip('text/*');
        return [zipFile instanceof Blob, zipFile.type];
      });

      const results: any = await page.evaluate(() => (window as any).createZip());

      expect(results[0]).toBeTruthy();
      expect(results[1]).toEqual('text/*');
    });

    test('can generate xlsx worksheet with string types', async ({ page }) => {
      await page.exposeFunction('formatString', () => {
        const xlsxFormatter = new XLSXFormatter();
        const data = [{ name: 'Joe Shmo' }];
        const xlColumns: ExcelColumn[] = [{
          id: 'name',
          name: 'Name',
          field: 'name',
          type: 'string'
        }];
        const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
        return worksheet;
      });

      const worksheet: any = await page.evaluate(() => (window as any).formatString());
      const expectedCell = '<is><t>Joe Shmo</t></is>';
      expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
    });

    test('can generate xlsx worksheet with number types', async ({ page }) => {
      await page.exposeFunction('formatNumber', () => {
        const xlsxFormatter = new XLSXFormatter();
        const data = [{ num: 12345.54321 }];
        const xlColumns: ExcelColumn[] = [{
          id: 'num',
          name: 'Num',
          field: 'num',
          type: 'number'
        }];
        const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
        return worksheet;
      });

      const worksheet: any = await page.evaluate(() => (window as any).formatNumber());
      const expectedCell = '<v>12345.54321</v>';
      expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
    });

    test('can generate xlsx worksheet with date types', async ({ page }) => {
      await page.exposeFunction('formatNumber', () => {
        const xlsxFormatter = new XLSXFormatter();
        const date = new Date(1990, 3, 21);
        const data = [{ date: date.toISOString() }];
        const xlColumns: ExcelColumn[] = [{
          id: 'date',
          name: 'Date',
          field: 'date',
          type: 'date'
        }];
        const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
        return worksheet;
      });

      const dateInExcelFormat = 32984; // days since Jan 1 1900;
      const worksheet: any = await page.evaluate(() => (window as any).formatNumber());
      const expectedCell = `<v>${dateInExcelFormat}</v>`;
      expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
    });

    test('can generate xlsx worksheet with time types', async ({ page }) => {
      await page.exposeFunction('formatNumber', () => {
        const xlsxFormatter = new XLSXFormatter();
        const date = new Date(1990, 3, 21, 3, 25); // April 21 1990 3:25
        const data = [{ time: date.toISOString() }];
        const xlColumns: ExcelColumn[] = [{
          id: 'time',
          name: 'Time',
          field: 'time',
          type: 'time'
        }];
        const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
        return worksheet;
      });

      const dateInExcelFormat = 32984.14236111111;
      const worksheet: any = await page.evaluate(() => (window as any).formatNumber());
      const expectedCell = `<v>${dateInExcelFormat}</v>`;
      expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
    });
  });

  test.describe('editable cell custom validation', () => {
    const validationURL = '/ids-data-grid/editable-validation.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(validationURL);
    });

    test('editable IdsInput validation', async ({ page }) => {
      // activate cell
      const cellSelector = 'ids-data-grid [aria-rowindex="2"] [aria-colindex="1"]';
      const idCell = await page.locator(cellSelector);
      await idCell.click();

      // edit cell
      const inputEditor = await page.locator(`${cellSelector} ids-input`);
      await inputEditor.evaluate((input: IdsInput) => { input.value = 'alphabet'; });
      await inputEditor.press('Enter');

      // check cell is marked as invalid
      expect(await idCell.evaluate((cell: IdsDataGridCell) => cell.classList.contains('is-invalid'))).toBeTruthy();
    });

    test('editable IdsDatePicker validation', async ({ page }) => {
      // activate cell
      const cellSelector = 'ids-data-grid [aria-rowindex="2"] [aria-colindex="2"]';
      const idCell = await page.locator(cellSelector);
      await idCell.click();

      // edit cell
      const triggerField = await page.locator(`${cellSelector} ids-trigger-field`);
      await triggerField.evaluate((input: IdsTriggerField) => { input.value = '4/21/1990'; });
      await triggerField.press('Enter');

      // check cell is marked as invalid
      expect(await idCell.evaluate((cell: IdsDataGridCell) => cell.classList.contains('is-invalid'))).toBeTruthy();
    });

    test('editable IdsDropdown validation', async ({ page }) => {
      // activate cell
      const cellSelector = 'ids-data-grid [aria-rowindex="2"] [aria-colindex="4"]';
      const idCell = await page.locator(cellSelector);
      await idCell.click();

      // click dropdown option
      await page.locator(`ids-data-grid ids-dropdown-list ids-list-box-option[value="yen"]`).click();

      // check cell is marked as invalid
      expect(await idCell.evaluate((cell: IdsDataGridCell) => cell.classList.contains('is-invalid'))).toBeTruthy();
    });
  });
});
