import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridCell from '../../src/components/ids-data-grid/ids-data-grid-cell';
import { IdsZip } from '../../src/utils/ids-zip/ids-zip';
import { XLSXFormatter } from '../../src/utils/ids-excel-exporter/ids-excel-formatter';
import { ExcelColumn } from '../../src/utils/ids-excel-exporter/ids-worksheet-templates';
import datasetTree from '../../src/assets/data/tree-buildings.json';
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
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
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
      await page.goto('ids-data-grid/standalone-css.html');
      await percySnapshot(page, 'ids-data-grid-standalone-light');
    });

    test('should match the visual snapshot in percy (list style)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/list-style.html');
      await percySnapshot(page, 'ids-data-grid-list-style-light');
    });

    test('should match the visual snapshot in percy (auto fit)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/list-style.html');
      await percySnapshot(page, 'ids-data-grid-auto-fit-light');
    });

    test('should not have visual regressions in percy (auto columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-auto.html');
      await percySnapshot(page, 'ids-data-grid-auto-columns-light');
    });

    test('should not have visual regressions in percy (fixed columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-fixed.html');
      await percySnapshot(page, 'ids-data-grid-columns-fixed-light');
    });

    test('should not have visual regressions in percy (percent columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-percent.html');
      await percySnapshot(page, 'ids-data-grid-columns-percent-light');
    });

    test('should not have visual regressions in percy (column formatters )', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-formatters.html');
      await percySnapshot(page, 'ids-data-grid-columns-formatters-light');
    });

    test('should not have visual regressions in percy (column alignment)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-alignment.html');
      await percySnapshot(page, 'ids-data-grid-columns-alignment-light');
    });

    test('should not have visual regressions in percy (column groups)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-groups.html');
      await percySnapshot(page, 'ids-data-grid-columns-groups-light');
    });

    test('should not have visual regressions in percy (stretch coluimn)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-stretch.html');
      await percySnapshot(page, 'ids-data-grid-columns-stretch-light');
    });

    test('should not have visual regressions in percy (frozen columns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/columns-frozen.html');
      await percySnapshot(page, 'ids-data-grid-columns-frozen-light');
    });

    test('should not have visual regressions in percy (alternate row shading)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/alternate-row-shading.html');
      await percySnapshot(page, 'ids-data-grid-alternate-row-shading-light');
    });

    test('should not have visual regressions in percy (expandable-row)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/expandable-row.html');
      await percySnapshot(page, 'ids-data-grid-expandable-row-light');
    });

    test('should not have visual regressions in percy (tree grid)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/tree-grid.html');
      await percySnapshot(page, 'ids-data-grid-tree-grid-light');
    });

    test('should not have visual regressions in percy (editable inline)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/editable-inline.html');
      await percySnapshot(page, 'ids-data-grid-editable-inline-light');
    });

    test('should not have visual regressions in percy (loading indicator)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-data-grid/loading-indicator.html');
      await percySnapshot(page, 'ids-data-grid-loading-indicator-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire rowclick event', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let dataIndex;
        const clickCallback = (e: any) => {
          dataIndex = e.detail.row?.getAttribute('data-index');
        };

        dataGrid.addEventListener('rowclick', clickCallback);

        const firstCellInRow = dataGrid.container?.querySelector<HTMLElement>('.ids-data-grid-body .ids-data-grid-cell');
        firstCellInRow?.click();
        return dataIndex;
      });

      expect(results).toEqual('0');
    });

    test('should fire double click event', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elemType = '';
        const dblClickCallback = (e: any) => {
          elemType = e.detail.type;
        };
        const dblClickEvent = new MouseEvent('dblclick', { bubbles: true });

        dataGrid.addEventListener('dblclick', dblClickCallback);

        const headerTitle = dataGrid.container?.querySelector('.ids-data-grid-header .ids-data-grid-header-cell');
        headerTitle?.dispatchEvent(dblClickEvent);
        const headerElementType = elemType;

        const headerIcon = dataGrid.container?.querySelector('.ids-data-grid-header .ids-data-grid-header-icon');
        headerIcon?.dispatchEvent(dblClickEvent);
        const headerIconType = elemType;

        const headerFilter = dataGrid.container?.querySelector('.ids-data-grid-header .ids-data-grid-header-cell-filter-wrapper');
        headerFilter?.dispatchEvent(dblClickEvent);
        const headerFilterType = elemType;

        const headerFilterButton = dataGrid.container?.querySelector('.ids-data-grid-header .ids-data-grid-header-cell-filter-wrapper [data-filter-conditions-button]');
        headerFilterButton?.dispatchEvent(dblClickEvent);
        const headerFilterButtonType = elemType;

        const bodyCell = dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-cell');
        bodyCell?.dispatchEvent(dblClickEvent);
        const bodyCellType = elemType;

        dataGrid.editable = true;
        const editableCell = dataGrid.container?.querySelector<any>('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
        editableCell?.startCellEdit?.();
        const hasEditingClass = editableCell?.classList.contains('is-editing');
        editableCell?.dispatchEvent(dblClickEvent);
        const editableCellType = elemType;

        return {
          headerElementType,
          headerIconType,
          headerFilterType,
          headerFilterButtonType,
          bodyCellType,
          hasEditingClass,
          editableCellType
        };
      });

      expect(results.headerElementType).toEqual('header-title');
      expect(results.bodyCellType).toEqual('body-cell');
    });

    test('should fire activecellchanged cell event on click', async ({ page }) => {
      const results: any = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let activeCell;
        const activeCellChangeCallback = (e: any) => {
          activeCell = e.detail.activeCell;
        };

        dataGrid.addEventListener('activecellchanged', activeCellChangeCallback);

        dataGrid.container?.querySelectorAll('.ids-data-grid-row')?.[3]?.querySelectorAll<HTMLElement>('.ids-data-grid-cell')?.[3]?.click();

        return activeCell;
      });

      expect(results?.row).toEqual(2);
      expect(results?.cell).toEqual(3);
    });

    test.skip('should fire afterrendered event after redraw', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let rendered = 0;
        const mockCallback = () => {
          rendered++;
        };

        dataGrid.addEventListener('afterrendered', mockCallback);
        dataGrid.redraw();

        return rendered;
      });

      expect(results).toEqual(1);
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

  test.describe('column functionality tests', () => {
    test('can hide / show column with setColumnVisible', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setColumnVisible('description', false);
        const hiddenColumn = dataGrid.container?.querySelector('[column-id="description"]');
        dataGrid.setColumnVisible('description', true);
        const visibleColumn = dataGrid.container?.querySelector('[column-id="description"]');

        return {
          hiddenColumn,
          visibleColumn
        };
      });

      expect(results.hiddenColumn).toBeNull();
      expect(results.visibleColumn).toBeDefined();
    });

    test('renders column when set to empty', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns = null;
        dataGrid.redraw();
        const columns = dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell').length;

        return columns;
      });

      expect(results).toEqual(1);
    });

    test('renders column with no all set widths', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns = dataGrid.columns.slice(0, 2);
        dataGrid.redraw();
        const columns = dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell').length;

        return columns;
      });

      expect(results).toEqual(2);
    });

    test('supports hidden columns', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const initialColumns = dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell').length;
        dataGrid.columns[2].hidden = true;
        dataGrid.redraw();
        const updatedColumns = dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell').length;

        return {
          initialColumns,
          updatedColumns
        };
      });

      expect(results.updatedColumns).toEqual((results.initialColumns || 1) - 1);
    });

    test('supports cssPart and cellSelectedCssPart settings', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[4].cssPart = 'custom-cell';
        dataGrid.columns[5].cssPart = (row: number) => ((row % 2 === 0) ? 'custom-cell' : '');
        dataGrid.redraw();
        const customCell = dataGrid.container?.querySelectorAll('[part="custom-cell"]').length;
        dataGrid.columns[4].cellSelectedCssPart = 'custom-cell-selected';
        dataGrid.columns[5].cellSelectedCssPart = (row: number) => ((row % 2 === 0) ? 'custom-cell-selected' : '');
        dataGrid.redraw();
        dataGrid.selectAllRows();
        const customCellSelected = dataGrid.container?.querySelectorAll('[part="custom-cell-selected"]').length;

        return {
          customCell,
          customCellSelected
        };
      });

      expect(results.customCell).toEqual(14);
      expect(results.customCellSelected).toEqual(14);
    });

    test('supports setting frozen columns', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const hasFrozenColumnsInitial = dataGrid.hasFrozenColumns;
        dataGrid.columns[0].frozen = 'left';
        dataGrid.columns[1].frozen = 'left';
        dataGrid.columns[2].frozen = 'left';
        dataGrid.columns[3].frozen = 'left';
        dataGrid.columns[4].frozen = 'left';
        dataGrid.columns[5].frozen = 'left';
        dataGrid.redraw();
        const frozenColumns = dataGrid.container?.querySelectorAll('.frozen').length;
        const frozenLeftColumns = dataGrid.container?.querySelectorAll('.frozen-left').length;
        const frozenLastColumns = dataGrid.container?.querySelectorAll('.frozen-last').length;
        const hasFrozenColumnsUpdated = dataGrid.hasFrozenColumns;

        return {
          frozenColumns,
          frozenLeftColumns,
          frozenLastColumns,
          hasFrozenColumnsInitial,
          hasFrozenColumnsUpdated
        };
      });

      expect(results.frozenColumns).toEqual(60);
      expect(results.frozenLeftColumns).toEqual(60);
      expect(results.frozenLastColumns).toEqual(10);
      expect(results.hasFrozenColumnsInitial).toEqual(false);
      expect(results.hasFrozenColumnsUpdated).toEqual(true);
    });

    test('supports setting cell alignment', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[0].align = 'center';
        dataGrid.columns[1].align = 'right';
        dataGrid.columns[2].align = 'left';
        dataGrid.redraw();
        const alignCenter = dataGrid.container?.querySelectorAll('.align-center').length;
        const alignRight = dataGrid.container?.querySelectorAll('.align-right').length;
        const alignLeft = dataGrid.container?.querySelectorAll('.align-left').length;
        const alignCenterHasClass = dataGrid.container?.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(1)')?.classList.contains('align-center');
        const alignRightHasClass = dataGrid.container?.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(2)')?.classList.contains('align-right');
        const alignLeftHasClass = dataGrid.container?.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(3)')?.classList.contains('align-left');

        return {
          alignCenter,
          alignRight,
          alignLeft,
          alignCenterHasClass,
          alignRightHasClass,
          alignLeftHasClass
        };
      });

      expect(results.alignCenter).toEqual(10);
      expect(results.alignRight).toEqual(10);
      expect(results.alignLeft).toEqual(10);
      expect(results.alignCenterHasClass).toBeTruthy();
      expect(results.alignRightHasClass).toBeTruthy();
      expect(results.alignLeftHasClass).toBeTruthy();
    });

    test('supports setting header alignment', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[0].headerAlign = 'center';
        dataGrid.columns[1].headerAlign = 'right';
        dataGrid.columns[2].headerAlign = 'left';
        dataGrid.redraw();
        const alignCenter = dataGrid.container?.querySelector('.ids-data-grid-header-cell:nth-child(1)')?.classList.contains('align-center');
        const alignRight = dataGrid.container?.querySelector('.ids-data-grid-header-cell:nth-child(2)')?.classList.contains('align-right');
        const alignLeft = dataGrid.container?.querySelector('.ids-data-grid-header-cell:nth-child(3)')?.classList.contains('align-left');

        return {
          alignCenter,
          alignRight,
          alignLeft
        };
      });

      expect(results.alignCenter).toBeTruthy();
      expect(results.alignRight).toBeTruthy();
      expect(results.alignLeft).toBeTruthy();
    });

    test('supports setting custom/percent width', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[3].width = '31%';
        dataGrid.columns[4].width = 'minmax(131px, 4fr)';
        dataGrid.redraw();

        return dataGrid.container?.style.getPropertyValue('--ids-data-grid-column-widths');
      });

      expect(results).toContain('minmax(31%, 1fr)');
      expect(results).toContain('minmax(131px, 4fr)');
    });

    test('supports setting column width with setColumnWidth', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setColumnWidth('description', 101);
        return dataGrid.columns[2].width;
      });
      expect(results).toBe(101);
    });

    test('supports setting column width defaults', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        // selectionCheckbox column
        dataGrid.columns[0].width = undefined;
        dataGrid.redraw();
        return dataGrid.columns[0].width;
      });

      expect(results).toBe(45);
    });

    test('supports not setting min column width (12)', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setColumnWidth('description', 1);
        dataGrid.redraw();
        return dataGrid.columns[2].width;
      });

      expect(results).not.toBeDefined();
    });

    test('supports setting uppercase', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[2].uppercase = true;
        dataGrid.redraw();
        return dataGrid.container?.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(3)')?.classList.contains('is-uppercase');
      });

      expect(results).toBeTruthy();
    });

    test('supports getting columnIdxById', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        return {
          rowNumber: dataGrid.columnIdxById('rowNumber'),
          nonExistant: dataGrid.columnIdxById('non-existant')
        };
      });

      expect(results.rowNumber).toEqual(1);
      expect(results.nonExistant).toEqual(-1);
    });

    test('supports column groups', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[3].hidden = true;
        dataGrid.columnGroups = [
          {
            colspan: 3,
            id: 'group1',
            name: 'Column Group One',
            align: 'center'
          },
          {
            colspan: 2,
            id: 'group2',
            name: ''
          },
          {
            colspan: 2,
            id: 'group3',
            name: 'Column Group Three',
            align: 'right'
          },
          {
            colspan: 10,
            name: 'Column Group Four',
            align: 'left'
          }
        ];
        const nodes = dataGrid.container?.querySelectorAll('.ids-data-grid-column-groups > *');
        return {
          nodesLength: nodes?.length,
          node1Text: nodes?.[0].textContent,
          node2Text: nodes?.[1].textContent,
          node3Text: nodes?.[3].textContent,
          node3Attr: nodes?.[3].getAttribute('column-group-id'),
          node1Align: nodes?.[0].classList.contains('align-center'),
          node3Align: nodes?.[2].classList.contains('align-right')
        };
      });

      expect(results.nodesLength).toEqual(4);
      expect(results.node1Text).toContain('Column Group One');
      expect(results.node2Text?.replace(/^\s+|\s+$/gm, '')).toBe('');
      expect(results.node3Text).toContain('Column Group Four');
      expect(results.node3Attr).toBe('id');
      expect(results.node1Align).toBeTruthy();
      expect(results.node3Align).toBeTruthy();
    });

    test('supports nested data', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns = [{
          id: 'price',
          name: 'Price',
          field: 'price.level1.name',
          align: 'center',
          width: '50%'
        },
        {
          id: 'bookCurrency',
          name: 'Currency',
          field: 'price.name',
          align: 'right',
          width: '50%'
        }];
        dataGrid.data = [
          { price: { name: 'test', level1: { name: 'test' } } },
          { price: { name: 'test2', level1: { name: 'test2' } } },
        ];
        return {
          cell1: dataGrid.container?.querySelector('.ids-data-grid-row[aria-rowindex="1"] > .ids-data-grid-cell:nth-child(1) span')?.textContent,
          cell2: dataGrid.container?.querySelector('.ids-data-grid-row[aria-rowindex="1"] > .ids-data-grid-cell:nth-child(2) span')?.textContent,
          cell3: dataGrid.container?.querySelector('.ids-data-grid-row[aria-rowindex="2"] > .ids-data-grid-cell:nth-child(1) span')?.textContent,
          cell4: dataGrid.container?.querySelector('.ids-data-grid-row[aria-rowindex="2"] > .ids-data-grid-cell:nth-child(2) span')?.textContent
        };
      });

      expect(results.cell1).toBe('test');
      expect(results.cell2).toBe('test');
      expect(results.cell3).toBe('test2');
      expect(results.cell4).toBe('test2');
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

  test.describe('functionality tests', () => {
    test('should have initial/default properties', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        return {
          header: dataGrid.header,
          body: dataGrid.body,
          wrapper: dataGrid.wrapper,
          cellFocused: dataGrid.cellFocused,
          cellLastActive: dataGrid.cellLastActive,
          rows: dataGrid.rows.length,
          rowsHidden: dataGrid.rowsHidden.length,
          rowsVisible: dataGrid.rowsVisible.length,
          virtualRows: dataGrid.virtualRows.length,
          columns: dataGrid.columns.length,
          visibleColumns: dataGrid.visibleColumns.length,
          rightFrozenColumns: dataGrid.rightFrozenColumns.length,
          leftFrozenColumns: dataGrid.leftFrozenColumns.length,
          showHeaderExpander: dataGrid.showHeaderExpander,
          alternateRowShading: dataGrid.alternateRowShading,
          headerMenuId: dataGrid.headerMenuId,
          columnGroups: dataGrid.columnGroups,
          emptyMessageDescription: dataGrid.emptyMessageDescription,
          emptyMessageLabel: dataGrid.emptyMessageLabel,
          emptyMessageIcon: dataGrid.emptyMessageIcon,
          hasFrozenColumns: dataGrid.hasFrozenColumns,
          label: dataGrid.label,
          listStyle: dataGrid.listStyle,
          minHeight: dataGrid.minHeight,
          rowHeight: dataGrid.rowHeight,
          uniqueId: dataGrid.uniqueId,
          virtualScroll: dataGrid.virtualScroll,
          editable: dataGrid.editable,
          headerMenuData: dataGrid.headerMenuData,
          menuId: dataGrid.menuId,
          menuData: dataGrid.menuData,
          scrollMaxRows: dataGrid.scrollMaxRows,
          rowStart: dataGrid.rowStart,
          rowNavigation: dataGrid.rowNavigation,
          rowSelection: dataGrid.rowSelection,
          suppressEmptyMessage: dataGrid.suppressEmptyMessage,
          suppressRowClickSelection: dataGrid.suppressRowClickSelection,
          suppressRowDeselection: dataGrid.suppressRowDeselection,
          suppressRowDeactivation: dataGrid.suppressRowDeactivation,
          selectedRows: dataGrid.selectedRows.length,
          selectedRowsAcrossPages: dataGrid.selectedRowsAcrossPages.length,
          activatedRow: dataGrid.activatedRow,
          isEditable: dataGrid.isEditable,
          rowCount: dataGrid.rowCount,
          rowPixelHeight: dataGrid.rowPixelHeight,
          autoFit: dataGrid.autoFit,
          suppressCaching: dataGrid.suppressCaching,
          disableClientFilter: dataGrid.disableClientFilter,
          filterable: dataGrid.filterable,
          filterRowDisabled: dataGrid.filterRowDisabled,
          filterWhenTyping: dataGrid.filterWhenTyping,
          treeGrid: dataGrid.treeGrid,
          groupSelectsChildren: dataGrid.groupSelectsChildren,
          idColumn: dataGrid.idColumn,
          expandableRow: dataGrid.expandableRow,
          expandableRowTemplate: dataGrid.expandableRowTemplate,
          editNextOnEnterPress: dataGrid.editNextOnEnterPress,
          addNewAtEnd: dataGrid.addNewAtEnd,
          invalidCells: dataGrid.invalidCells,
          dirtyCells: dataGrid.dirtyCells,
          suppressTooltips: dataGrid.suppressTooltips,
          saveActivePage: dataGrid.saveActivePage,
          saveColumns: dataGrid.saveColumns,
          saveFilter: dataGrid.saveFilter,
          savePageSize: dataGrid.savePageSize,
          saveRowHeight: dataGrid.saveRowHeight,
          saveSortOrder: dataGrid.saveSortOrder,
          saveUserSettings: dataGrid.saveUserSettings,
        };
      });

      expect(results.header).toBeDefined();
      expect(results.body).toBeDefined();
      expect(results.wrapper).toBeDefined();
      expect(results.cellFocused).toBeDefined();
      expect(results.cellLastActive).toBeDefined();
      expect(results.rows).toEqual(9);
      expect(results.rowsHidden).toEqual(0);
      expect(results.rowsVisible).toEqual(9);
      expect(results.virtualRows).toEqual(9);
      expect(results.columns).toEqual(18);
      expect(results.visibleColumns).toEqual(18);
      expect(results.rightFrozenColumns).toEqual(0);
      expect(results.leftFrozenColumns).toEqual(0);
      expect(results.showHeaderExpander).toBeFalsy();
      expect(results.alternateRowShading).toBeFalsy();
      expect(results.columnGroups).toBeNull();
      expect(results.emptyMessageDescription).toBeNull();
      expect(results.emptyMessageLabel).toBeNull();
      expect(results.hasFrozenColumns).toBeFalsy();
      expect(results.label).toBe('Books');
      expect(results.listStyle).toBeFalsy();
      expect(results.minHeight).toBe('350px');
      expect(results.rowHeight).toBe('lg');
      expect(results.uniqueId).toBeNull();
      expect(results.virtualScroll).toBeFalsy();
      expect(results.editable).toBeFalsy();
      expect(results.headerMenuData).toBeNull();
      expect(results.menuData).toBeNull();
      expect(results.scrollMaxRows).toBe(100);
      expect(results.rowStart).toBe(0);
      expect(results.rowNavigation).toBeFalsy();
      expect(results.rowSelection).toEqual('multiple');
      expect(results.suppressEmptyMessage).toBeFalsy();
      expect(results.suppressRowClickSelection).toBeFalsy();
      expect(results.suppressRowDeselection).toBeFalsy();
      expect(results.suppressRowDeactivation).toBeFalsy();
      expect(results.selectedRows).toEqual(0);
      expect(results.selectedRowsAcrossPages).toEqual(0);
      expect(results.activatedRow).toEqual({});
      expect(results.isEditable).toBeFalsy();
      expect(results.rowCount).toBe(9);
      expect(results.rowPixelHeight).toBe(51);
      expect(results.autoFit).toBeFalsy();
      expect(results.suppressCaching).toBeFalsy();
      expect(results.disableClientFilter).toBeFalsy();
      expect(results.filterable).toBeTruthy();
      expect(results.filterRowDisabled).toBeFalsy();
      expect(results.filterWhenTyping).toBeTruthy();
      expect(results.treeGrid).toBeFalsy();
      expect(results.groupSelectsChildren).toBeFalsy();
      expect(results.idColumn).toEqual('id');
      expect(results.expandableRow).toBeFalsy();
      expect(results.expandableRowTemplate).toEqual('');
      expect(results.editNextOnEnterPress).toBeFalsy();
      expect(results.addNewAtEnd).toBeFalsy();
      expect(results.invalidCells).toEqual([]);
      expect(results.dirtyCells).toEqual([]);
      expect(results.suppressTooltips).toBeFalsy();
      expect(results.saveActivePage).toBeFalsy();
      expect(results.saveColumns).toBeFalsy();
      expect(results.saveFilter).toBeFalsy();
      expect(results.savePageSize).toBeFalsy();
      expect(results.saveRowHeight).toBeFalsy();
      expect(results.saveSortOrder).toBeFalsy();
      expect(results.saveUserSettings).toBeFalsy();
    });

    test('should set properties', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.showHeaderExpander = true;
        const showHeaderExpanderSet = dataGrid.showHeaderExpander;
        dataGrid.showHeaderExpander = false;
        const showHeaderExpanderUnset = dataGrid.showHeaderExpander;

        dataGrid.alternateRowShading = true;
        const alternateRowShadingSet = dataGrid.alternateRowShading;
        dataGrid.alternateRowShading = false;
        const alternateRowShadingUnset = dataGrid.alternateRowShading;

        dataGrid.columnGroups = [{
          colspan: 3,
          id: 'group1',
          name: 'Column Group One',
          align: 'center'
        }];
        const columnGroupsSet = dataGrid.columnGroups;
        dataGrid.columnGroups = null;
        const columnGroupsUnset = dataGrid.columnGroups;

        dataGrid.emptyMessageDescription = 'emptyMessageDescription';
        const emptyMessageDescriptionSet = dataGrid.emptyMessageDescription;
        dataGrid.emptyMessageDescription = null;
        const emptyMessageDescriptionUnset = dataGrid.emptyMessageDescription;

        dataGrid.emptyMessageLabel = 'emptyMessageLabel';
        const emptyMessageLabelSet = dataGrid.emptyMessageLabel;
        dataGrid.emptyMessageLabel = null;
        const emptyMessageLabelUnset = dataGrid.emptyMessageLabel;

        dataGrid.emptyMessageIcon = 'emptyMessageIcon';
        const emptyMessageIconSet = dataGrid.emptyMessageIcon;
        dataGrid.emptyMessageIcon = null;
        const emptyMessageIconUnset = dataGrid.emptyMessageIcon;

        dataGrid.label = 'Label changed';
        const labelSet = dataGrid.label;
        dataGrid.label = null;
        const labelUnset = dataGrid.label;

        dataGrid.listStyle = true;
        const listStyleSet = dataGrid.listStyle;
        dataGrid.listStyle = false;
        const listStyleUnset = dataGrid.listStyle;

        dataGrid.minHeight = '100px';
        const minHeightSet = dataGrid.minHeight;
        dataGrid.minHeight = null;
        const minHeightUnset = dataGrid.minHeight;

        dataGrid.rowHeight = 'md';
        const rowHeightSet = dataGrid.rowHeight;
        dataGrid.rowHeight = null;
        const rowHeightUnset = dataGrid.rowHeight;

        dataGrid.uniqueId = 'some-uniqueid';
        const uniqueIdSet = dataGrid.uniqueId;
        dataGrid.uniqueId = null;
        const uniqueIdUnset = dataGrid.uniqueId;

        dataGrid.virtualScroll = true;
        const virtualScrollSet = dataGrid.virtualScroll;
        dataGrid.virtualScroll = false;
        const virtualScrollUnset = dataGrid.virtualScroll;

        dataGrid.editable = true;
        const editableSet = dataGrid.editable;
        dataGrid.editable = false;
        const editableUnset = dataGrid.editable;

        dataGrid.headerMenuData = [];
        dataGrid.menuData = [];

        dataGrid.scrollMaxRows = 200;
        const scrollMaxRowsSet = dataGrid.scrollMaxRows;
        dataGrid.scrollMaxRows = null;
        const scrollMaxRowsUnset = dataGrid.scrollMaxRows;

        dataGrid.rowStart = 1;
        const rowStartSet = dataGrid.rowStart;
        dataGrid.rowStart = null;
        const rowStartUnset = dataGrid.rowStart;

        dataGrid.rowNavigation = true;
        const rowNavigationSet = dataGrid.rowNavigation;
        dataGrid.rowNavigation = false;
        const rowNavigationUnset = dataGrid.rowNavigation;

        dataGrid.rowSelection = 'single';
        const rowSelectionSet = dataGrid.rowSelection;
        dataGrid.rowSelection = null;
        const rowSelectionUnset = dataGrid.rowSelection;

        dataGrid.suppressEmptyMessage = true;
        const suppressEmptyMessageSet = dataGrid.suppressEmptyMessage;
        dataGrid.suppressEmptyMessage = false;
        const suppressEmptyMessageUnset = dataGrid.suppressEmptyMessage;

        dataGrid.autoFit = true;
        const autoFitSet = dataGrid.autoFit;
        dataGrid.autoFit = false;
        const autoFitUnset = dataGrid.autoFit;

        dataGrid.suppressCaching = true;
        const suppressCachingSet = dataGrid.suppressCaching;
        dataGrid.suppressCaching = false;
        const suppressCachingUnset = dataGrid.suppressCaching;

        dataGrid.disableClientFilter = true;
        const disableClientFilterSet = dataGrid.disableClientFilter;
        dataGrid.disableClientFilter = false;
        const disableClientFilterUnset = dataGrid.disableClientFilter;

        dataGrid.filterable = true;
        const filterableSet = dataGrid.filterable;
        dataGrid.filterable = false;
        const filterableUnset = dataGrid.filterable;

        dataGrid.filterRowDisabled = true;
        const filterRowDisabledSet = dataGrid.filterRowDisabled;
        dataGrid.filterRowDisabled = false;
        const filterRowDisabledUnset = dataGrid.filterRowDisabled;

        dataGrid.filterWhenTyping = true;
        const filterWhenTypingSet = dataGrid.filterWhenTyping;
        dataGrid.filterWhenTyping = false;
        const filterWhenTypingUnset = dataGrid.filterWhenTyping;

        dataGrid.treeGrid = true;
        const treeGridSet = dataGrid.treeGrid;
        dataGrid.treeGrid = false;
        const treeGridUnset = dataGrid.treeGrid;

        dataGrid.groupSelectsChildren = true;
        const groupSelectsChildrenSet = dataGrid.groupSelectsChildren;
        dataGrid.groupSelectsChildren = false;
        const groupSelectsChildrenUnset = dataGrid.groupSelectsChildren;

        dataGrid.idColumn = 'changed';
        const idColumnSet = dataGrid.idColumn;
        dataGrid.idColumn = null;
        const idColumnUnset = dataGrid.idColumn;

        dataGrid.expandableRow = 'true';
        const expandableRowSet = dataGrid.expandableRow;
        dataGrid.expandableRow = null;
        const expandableRowUnset = dataGrid.expandableRow;

        dataGrid.expandableRowTemplate = 'template';
        const expandableRowTemplateSet = dataGrid.expandableRowTemplate;
        dataGrid.expandableRowTemplate = null;
        const expandableRowTemplateUnset = dataGrid.expandableRowTemplate;

        dataGrid.editNextOnEnterPress = true;
        const editNextOnEnterPressSet = dataGrid.editNextOnEnterPress;
        dataGrid.editNextOnEnterPress = false;
        const editNextOnEnterPressUnset = dataGrid.editNextOnEnterPress;

        dataGrid.addNewAtEnd = true;
        const addNewAtEndSet = dataGrid.addNewAtEnd;
        dataGrid.addNewAtEnd = false;
        const addNewAtEndUnset = dataGrid.addNewAtEnd;

        dataGrid.suppressTooltips = true;
        const suppressTooltipsSet = dataGrid.suppressTooltips;
        dataGrid.suppressTooltips = false;
        const suppressTooltipsUnset = dataGrid.suppressTooltips;

        dataGrid.saveActivePage = true;
        const saveActivePageSet = dataGrid.saveActivePage;
        dataGrid.saveActivePage = false;
        const saveActivePageUnset = dataGrid.saveActivePage;

        dataGrid.saveColumns = true;
        const saveColumnsSet = dataGrid.saveColumns;
        dataGrid.saveColumns = false;
        const saveColumnsUnset = dataGrid.saveColumns;

        dataGrid.saveFilter = true;
        const saveFilterSet = dataGrid.saveFilter;
        dataGrid.saveFilter = false;
        const saveFilterUnset = dataGrid.saveFilter;

        dataGrid.savePageSize = true;
        const savePageSizeSet = dataGrid.savePageSize;
        dataGrid.savePageSize = false;
        const savePageSizeUnset = dataGrid.savePageSize;

        dataGrid.saveRowHeight = true;
        const saveRowHeightSet = dataGrid.saveRowHeight;
        dataGrid.saveRowHeight = false;
        const saveRowHeightUnset = dataGrid.saveRowHeight;

        dataGrid.saveSortOrder = true;
        const saveSortOrderSet = dataGrid.saveSortOrder;
        dataGrid.saveSortOrder = false;
        const saveSortOrderUnset = dataGrid.saveSortOrder;

        dataGrid.saveUserSettings = true;
        const saveUserSettingsSet = dataGrid.saveUserSettings;
        dataGrid.saveUserSettings = false;
        const saveUserSettingsUnset = dataGrid.saveUserSettings;

        dataGrid.headerMenuId = 'header-menu';
        const headerMenuIdSet = dataGrid.headerMenuId;
        dataGrid.headerMenuId = null;
        const headerMenuIdUnset = dataGrid.headerMenuId;

        dataGrid.menuId = 'menu';
        const menuIdSet = dataGrid.menuId;
        dataGrid.menuId = null;
        const menuIdUnset = dataGrid.menuId;

        dataGrid.suppressRowClickSelection = true;
        const suppressRowClickSelectionSet = dataGrid.suppressRowClickSelection;
        dataGrid.suppressRowClickSelection = false;
        const suppressRowClickSelectionUnset = dataGrid.suppressRowClickSelection;

        dataGrid.suppressRowDeselection = true;
        const suppressRowDeselectionSet = dataGrid.suppressRowDeselection;
        dataGrid.suppressRowDeselection = false;
        const suppressRowDeselectionUnset = dataGrid.suppressRowDeselection;

        dataGrid.suppressRowDeactivation = true;
        const suppressRowDeactivationSet = dataGrid.suppressRowDeactivation;
        dataGrid.suppressRowDeactivation = false;
        const suppressRowDeactivationUnset = dataGrid.suppressRowDeactivation;

        return {
          showHeaderExpanderSet,
          showHeaderExpanderUnset,
          alternateRowShadingSet,
          alternateRowShadingUnset,
          columnGroupsSet,
          columnGroupsUnset,
          emptyMessageDescriptionSet,
          emptyMessageDescriptionUnset,
          emptyMessageLabelSet,
          emptyMessageLabelUnset,
          emptyMessageIconSet,
          emptyMessageIconUnset,
          labelSet,
          labelUnset,
          listStyleSet,
          listStyleUnset,
          minHeightSet,
          minHeightUnset,
          rowHeightSet,
          rowHeightUnset,
          uniqueIdSet,
          uniqueIdUnset,
          virtualScrollSet,
          virtualScrollUnset,
          editableSet,
          editableUnset,
          scrollMaxRowsSet,
          scrollMaxRowsUnset,
          rowStartSet,
          rowStartUnset,
          rowNavigationSet,
          rowNavigationUnset,
          rowSelectionSet,
          rowSelectionUnset,
          suppressEmptyMessageSet,
          suppressEmptyMessageUnset,
          autoFitSet,
          autoFitUnset,
          suppressCachingSet,
          suppressCachingUnset,
          disableClientFilterSet,
          disableClientFilterUnset,
          filterableSet,
          filterableUnset,
          filterRowDisabledSet,
          filterRowDisabledUnset,
          filterWhenTypingSet,
          filterWhenTypingUnset,
          treeGridSet,
          treeGridUnset,
          groupSelectsChildrenSet,
          groupSelectsChildrenUnset,
          idColumnSet,
          idColumnUnset,
          expandableRowSet,
          expandableRowUnset,
          expandableRowTemplateSet,
          expandableRowTemplateUnset,
          editNextOnEnterPressSet,
          editNextOnEnterPressUnset,
          addNewAtEndSet,
          addNewAtEndUnset,
          suppressTooltipsSet,
          suppressTooltipsUnset,
          saveActivePageSet,
          saveActivePageUnset,
          saveColumnsSet,
          saveColumnsUnset,
          saveFilterSet,
          saveFilterUnset,
          savePageSizeSet,
          savePageSizeUnset,
          saveRowHeightSet,
          saveRowHeightUnset,
          saveSortOrderSet,
          saveSortOrderUnset,
          saveUserSettingsSet,
          saveUserSettingsUnset,
          headerMenuIdSet,
          headerMenuIdUnset,
          menuIdSet,
          menuIdUnset,
          suppressRowClickSelectionSet,
          suppressRowClickSelectionUnset,
          suppressRowDeselectionSet,
          suppressRowDeselectionUnset,
          suppressRowDeactivationSet,
          suppressRowDeactivationUnset
        };
      });

      expect(results.showHeaderExpanderSet).toBeTruthy();
      expect(results.showHeaderExpanderUnset).toBeFalsy();
      expect(results.alternateRowShadingSet).toBeTruthy();
      expect(results.alternateRowShadingUnset).toBeFalsy();
      expect(results.columnGroupsSet).toBeDefined();
      expect(results.columnGroupsUnset).toBeNull();
      expect(results.emptyMessageDescriptionSet).toEqual('emptyMessageDescription');
      expect(results.emptyMessageDescriptionUnset).toBeNull();
      expect(results.emptyMessageLabelSet).toEqual('emptyMessageLabel');
      expect(results.emptyMessageLabelUnset).toBeNull();
      expect(results.emptyMessageIconSet).toEqual('emptyMessageIcon');
      expect(results.emptyMessageIconUnset).toBeNull();
      expect(results.labelSet).toEqual('Label changed');
      expect(results.labelUnset).toEqual('Data Grid');
      expect(results.listStyleSet).toBeTruthy();
      expect(results.listStyleUnset).toBeFalsy();
      expect(results.minHeightSet).toEqual('100px');
      expect(results.minHeightUnset).toEqual('350px');
      expect(results.rowHeightSet).toEqual('md');
      expect(results.rowHeightUnset).toEqual('lg');
      expect(results.uniqueIdSet).toEqual('some-uniqueid');
      expect(results.uniqueIdUnset).toBeNull();
      expect(results.virtualScrollSet).toBeTruthy();
      expect(results.virtualScrollUnset).toBeFalsy();
      expect(results.editableSet).toBeTruthy();
      expect(results.editableUnset).toBeFalsy();
      expect(results.scrollMaxRowsSet).toEqual(200);
      expect(results.scrollMaxRowsUnset).toEqual(0);
      expect(results.rowStartSet).toEqual(1);
      expect(results.rowStartUnset).toEqual(0);
      expect(results.rowNavigationSet).toBeTruthy();
      expect(results.rowNavigationUnset).toBeFalsy();
      expect(results.rowSelectionSet).toEqual('single');
      expect(results.rowSelectionUnset).toBeFalsy();
      expect(results.suppressEmptyMessageSet).toBeTruthy();
      expect(results.suppressEmptyMessageUnset).toBeFalsy();
      expect(results.autoFitSet).toBeTruthy();
      expect(results.autoFitUnset).toBeFalsy();
      expect(results.suppressCachingSet).toBeTruthy();
      expect(results.suppressCachingUnset).toBeFalsy();
      expect(results.disableClientFilterSet).toBeTruthy();
      expect(results.disableClientFilterUnset).toBeFalsy();
      expect(results.filterableSet).toBeTruthy();
      expect(results.filterableUnset).toBeFalsy();
      expect(results.filterRowDisabledSet).toBeTruthy();
      expect(results.filterRowDisabledUnset).toBeFalsy();
      expect(results.filterWhenTypingSet).toBeTruthy();
      expect(results.filterWhenTypingUnset).toBeFalsy();
      expect(results.treeGridSet).toBeTruthy();
      expect(results.treeGridUnset).toBeFalsy();
      expect(results.groupSelectsChildrenSet).toBeTruthy();
      expect(results.groupSelectsChildrenUnset).toBeFalsy();
      expect(results.idColumnSet).toEqual('changed');
      expect(results.idColumnUnset).toEqual('id');
      expect(results.expandableRowSet).toBeTruthy();
      expect(results.expandableRowUnset).toBeFalsy();
      expect(results.expandableRowTemplateSet).toEqual('template');
      expect(results.expandableRowTemplateUnset).toEqual('');
      expect(results.editNextOnEnterPressSet).toBeTruthy();
      expect(results.editNextOnEnterPressUnset).toBeFalsy();
      expect(results.addNewAtEndSet).toBeTruthy();
      expect(results.addNewAtEndUnset).toBeFalsy();
      expect(results.suppressTooltipsSet).toBeTruthy();
      expect(results.suppressTooltipsUnset).toBeFalsy();
      expect(results.saveActivePageSet).toBeTruthy();
      expect(results.saveActivePageUnset).toBeFalsy();
      expect(results.saveColumnsSet).toBeTruthy();
      expect(results.saveColumnsUnset).toBeFalsy();
      expect(results.saveFilterSet).toBeTruthy();
      expect(results.saveFilterUnset).toBeFalsy();
      expect(results.savePageSizeSet).toBeTruthy();
      expect(results.savePageSizeUnset).toBeFalsy();
      expect(results.saveRowHeightSet).toBeTruthy();
      expect(results.saveRowHeightUnset).toBeFalsy();
      expect(results.saveSortOrderSet).toBeTruthy();
      expect(results.saveSortOrderUnset).toBeFalsy();
      expect(results.saveUserSettingsSet).toBeTruthy();
      expect(results.saveUserSettingsUnset).toBeFalsy();
      expect(results.headerMenuIdSet).toEqual('header-menu');
      expect(results.headerMenuIdUnset).toBeNull();
      expect(results.menuIdSet).toEqual('menu');
      expect(results.menuIdUnset).toBeNull();
      expect(results.suppressRowClickSelectionSet).toBeTruthy();
      expect(results.suppressRowClickSelectionUnset).toBeFalsy();
      expect(results.suppressRowDeselectionSet).toBeTruthy();
      expect(results.suppressRowDeselectionUnset).toBeFalsy();
      expect(results.suppressRowDeactivationSet).toBeTruthy();
      expect(results.suppressRowDeactivationUnset).toBeFalsy();
    });

    test('can null dataset returns an array', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.datasource.data = null;
        dataGrid.data = null;
        return dataGrid.data;
      });
      expect(results).toEqual([]);
    });

    test('can set the label setting', async ({ page }) => {
      const label = 'Books';

      const results = await page.evaluate((attrLabel) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.label = attrLabel;

        const ariaLabelSet = dataGrid.container.getAttribute('aria-label');
        const attrLabelSet = dataGrid.getAttribute('label');

        dataGrid.label = null;

        const ariaLabelUnset = dataGrid.container.getAttribute('aria-label');
        const attrLabelUnset = dataGrid.getAttribute('label');

        return {
          ariaLabelSet,
          attrLabelSet,
          ariaLabelUnset,
          attrLabelUnset
        };
      }, label);

      expect(results.ariaLabelSet).toEqual(label);
      expect(results.attrLabelSet).toEqual(label);
      expect(results.ariaLabelUnset).toEqual('Data Grid');
      expect(results.attrLabelUnset).toBeNull();
    });

    test('renders one single column', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns = [{
          id: 'rowNumber',
          formatter: dataGrid.formatters.rowNumber,
          width: 20
        }];

        return {
          columnsCount: dataGrid.columns?.length,
          headerCellsCount: dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell')?.length
        };
      });

      expect(results.columnsCount).toEqual(results.headerCellsCount);
    });

    test('should set user unique Id', async ({ page }) => {
      const uniqueId = 'some-uniqueid';

      expect(await page.locator('ids-data-grid').getAttribute('unique-id')).toEqual(null);

      const uniqueIdSet = await page.evaluate((attrId) => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.uniqueId = attrId;

        return dataGrid.uniqueId;
      }, uniqueId);

      expect(uniqueIdSet).toEqual(uniqueId);
      expect(await page.locator('ids-data-grid').getAttribute('unique-id')).toEqual(uniqueId);

      const uniqueIdUnset = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.uniqueId = null;

        return dataGrid.uniqueId;
      });

      expect(uniqueIdUnset).toBeNull();
      expect(await page.locator('ids-data-grid').getAttribute('unique-id')).toBeNull();
    });

    test('renders with listStyle option', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;

        dataGrid.listStyle = true;
        const listStyleSet = dataGrid.listStyle;
        const hasClassSet = dataGrid.container?.classList.contains('is-list-style');

        dataGrid.listStyle = false;
        const listStyleUnset = dataGrid.listStyle;
        const hasClassUnset = dataGrid.container?.classList.contains('is-list-style');

        return {
          listStyleSet,
          hasClassSet,
          listStyleUnset,
          hasClassUnset
        };
      });

      expect(results.listStyleSet).toBeTruthy();
      expect(results.hasClassSet).toBeTruthy();
      expect(results.listStyleUnset).toBeFalsy();
      expect(results.hasClassUnset).toBeFalsy();
    });
  });

  test.describe('sorting tests', () => {
    test('fires sorted event on sort', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elem;
        let sortColumnId;
        let sortColumnAscending;
        const mockCallback = (e: any) => {
          elem = e.detail.elem;
          sortColumnId = e.detail.sortColumn.id;
          sortColumnAscending = e.detail.sortColumn.ascending;
        };

        dataGrid.addEventListener('sorted', mockCallback);
        dataGrid.setSortColumn('description', true);

        return {
          elem,
          sortColumnId,
          sortColumnAscending
        };
      });

      expect(results.elem).toBeTruthy();
      expect(results.sortColumnId).toEqual('description');
      expect(results.sortColumnAscending).toBeTruthy();
    });

    test('fires defaults to ascending sort', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elem;
        let sortColumnId;
        let sortColumnAscending;
        const mockCallback = (e: any) => {
          elem = e.detail.elem;
          sortColumnId = e.detail.sortColumn.id;
          sortColumnAscending = e.detail.sortColumn.ascending;
        };

        dataGrid.addEventListener('sorted', mockCallback);
        dataGrid.setSortColumn('description');

        return {
          elem,
          sortColumnId,
          sortColumnAscending
        };
      });

      expect(results.elem).toBeTruthy();
      expect(results.sortColumnId).toEqual('description');
      expect(results.sortColumnAscending).toBeTruthy();
    });

    test('can sort by field vs id', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elem;
        let sortColumnId;
        let sortColumnAscending;
        const mockCallback = (e: any) => {
          elem = e.detail.elem;
          sortColumnId = e.detail.sortColumn.id;
          sortColumnAscending = e.detail.sortColumn.ascending;
        };

        dataGrid.addEventListener('sorted', mockCallback);
        dataGrid.setSortColumn('publishTime', true);

        return {
          elem,
          sortColumnId,
          sortColumnAscending
        };
      });

      expect(results.elem).toBeTruthy();
      expect(results.sortColumnId).toEqual('publishTime');
      expect(results.sortColumnAscending).toBeTruthy();
    });

    test('sets sort state via the API', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setSortState('description');
        return dataGrid.container?.querySelectorAll('[column-id]')[2].getAttribute('aria-sort');
      });

      expect(results).toEqual('ascending');
    });

    test('sets sort state via the API with direction', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setSortState('description', false);
        const descending = dataGrid.container?.querySelectorAll('[column-id]')[2].getAttribute('aria-sort');
        dataGrid.setSortState('description', true);
        const ascending = dataGrid.container?.querySelectorAll('[column-id]')[2].getAttribute('aria-sort');
        return {
          ascending,
          descending
        };
      });
      expect(results.ascending).toEqual('ascending');
      expect(results.descending).toEqual('descending');
    });

    test('do not error when not sortable', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns[2].sortable = false;
        dataGrid.setSortState('description');
      });
      expect(hasConsoleError).toBeFalsy();
    });

    test('wont error in columnDataByHeaderElem', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const data = dataGrid.columnDataByHeaderElem(dataGrid?.container?.querySelector<any>('.ids-data-grid-header-cell:nth-child(1000)'));
        return data;
      });

      expect(results).not.toBeDefined();
    });

    test('handles wrong ID on sort', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setSortColumn('bookx', false);
      });

      expect(hasConsoleError).toBeFalsy();
    });

    test('fires sorted event on click', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elem;
        let sortColumnId;
        let sortColumnAscending;
        const mockCallback = (e: any) => {
          elem = e.detail.elem;
          sortColumnId = e.detail.sortColumn.id;
          sortColumnAscending = e.detail.sortColumn.ascending;
        };

        dataGrid.addEventListener('sorted', mockCallback);
        const headers = dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell');
        headers?.[2]?.querySelector<any>('.ids-data-grid-header-cell-content')?.click();

        return {
          elem,
          sortColumnId,
          sortColumnAscending
        };
      });

      expect(results.elem).toBeTruthy();
      expect(results.sortColumnId).toEqual('description');
      expect(results.sortColumnAscending).toBeTruthy();
    });

    test('should not error clicking on a non sortable column', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elem = null;
        const mockCallback = (e: any) => {
          elem = e.detail.elem;
        };
        dataGrid.addEventListener('sorted', mockCallback);
        dataGrid.container?.querySelector<any>('.ids-data-grid-header-cell')?.[5]?.click();

        return elem;
      });

      expect(hasConsoleError).toBeFalsy();
      expect(results).toBeNull();
    });

    test('skips sort on resize click ', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        let elem = null;
        const mockCallback = (e: any) => {
          elem = e.detail.elem;
        };
        dataGrid.addEventListener('sorted', mockCallback);
        dataGrid.isResizing = true;

        const headers = dataGrid.container?.querySelectorAll('.ids-data-grid-header-cell');
        headers?.[2]?.querySelector<any>('.ids-data-grid-header-cell-content')?.click();

        return elem;
      });

      expect(results).toBeNull();
    });
  });

  test.describe('expandable row tests', () => {
    test('can render a template', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        // eslint-disable-next-line no-template-curly-in-string
        dataGrid.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
        dataGrid.expandableRow = true;
        dataGrid.expandableRowTemplate = `template-id`;
        dataGrid.data[1].rowExpanded = true;

        dataGrid.columns[2].formatter = dataGrid.formatters.expander;
        dataGrid.redraw();

        return dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-expandable-row').innerHTML;
      });

      expect(results).toBe('<span>101</span>');
    });

    test('can handle invalid expandableRowTemplate', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.expandableRow = true;
        dataGrid.expandableRowTemplate = `template-idxx`;
        dataGrid.data[1].rowExpanded = true;

        dataGrid.columns[2].formatter = dataGrid.formatters.expander;
        dataGrid.redraw();

        return dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-expandable-row').innerHTML;
      });

      expect(results).toBe('');
    });

    test('can expand/collapse expandableRow', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        // eslint-disable-next-line no-template-curly-in-string
        dataGrid.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
        dataGrid.expandableRow = true;
        dataGrid.expandableRowTemplate = `template-id`;
        dataGrid.resetCache();
        dataGrid.columns[2].formatter = dataGrid.formatters.expander;
        dataGrid.redraw();
        const getFirstRow = () => dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1];
        const expandedAttr = getFirstRow().getAttribute('aria-expanded');
        const expandedHidden = getFirstRow().querySelector('.ids-data-grid-expandable-row').hasAttribute('hidden');

        const expandButton = dataGrid.container?.querySelector('.expand-button');
        expandButton?.click();

        const expandedAttrExpanded = getFirstRow().getAttribute('aria-expanded');
        const expandedHiddenExpanded = getFirstRow().querySelector('.ids-data-grid-expandable-row').hasAttribute('hidden');

        expandButton?.click();

        const expandedAttrCollapsed = getFirstRow().getAttribute('aria-expanded');
        const expandedHiddenCollapsed = getFirstRow().querySelector('.ids-data-grid-expandable-row').hasAttribute('hidden');

        return {
          expandedAttr,
          expandedHidden,
          expandedAttrExpanded,
          expandedHiddenExpanded,
          expandedAttrCollapsed,
          expandedHiddenCollapsed
        };
      });

      expect(results.expandedAttr).toEqual('false');
      expect(results.expandedHidden).toBeTruthy();
      expect(results.expandedAttrExpanded).toEqual('true');
      expect(results.expandedHiddenExpanded).toBeFalsy();
      expect(results.expandedAttrCollapsed).toEqual('false');
      expect(results.expandedHiddenCollapsed).toBeTruthy();
    });
  });

  test.describe('tree grid tests', () => {
    const treeColumnsData = [
      {
        id: 'selectionCheckbox',
        name: 'selection',
        sortable: false,
        resizable: false,
        align: 'center',
        frozen: 'left'
      },
      {
        id: 'name',
        name: 'Name',
        field: 'name',
        sortable: true,
        resizable: true,
      },
      {
        id: 'id',
        name: 'Id',
        field: 'id',
        sortable: true,
        resizable: true,
      }
    ];

    test('can render a tree', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.data = data.datasetTree;
        dataGrid.redraw();

        return dataGrid.container?.querySelectorAll('.ids-data-grid-row').length;
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results).toBe(23);
    });

    test('can expand/collapse all tree rows', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.data = data.datasetTree;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.rowSelection = 'multiple';
        dataGrid.showHeaderExpander = true;
        dataGrid.suppressRowClickSelection = true;
        dataGrid.redraw();

        const all = () => dataGrid.rows.filter((r: any) => r?.hasAttribute('aria-expanded')) || [];
        const collapsedRows = () => all().filter((r: any) => r?.getAttribute('aria-expanded') === 'false');

        const allExpandedInitial = all().length;
        const allCollapsedInitial = collapsedRows().length;

        dataGrid.collapseAll();
        const allExpandedAfterCollapse = all().length;
        const allCollapsedAfterCollapse = collapsedRows().length;

        dataGrid.expandAll();
        const allExpandedAfterExpand = all().length;
        const allCollapsedAfterExpand = collapsedRows().length;

        dataGrid.collapseAll();
        const firstRow = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1];
        const rowAttrAfterCollapse = firstRow.getAttribute('aria-expanded');
        const expandButton = dataGrid.container?.querySelector('.expand-button');
        expandButton?.click();
        const rowAttrAfterExpand = firstRow.getAttribute('aria-expanded');
        const allExpandedAfterClick = all().length;
        const allCollapsedAfterClick = collapsedRows().length;

        return {
          allExpandedInitial,
          allCollapsedInitial,
          allExpandedAfterCollapse,
          allCollapsedAfterCollapse,
          allExpandedAfterExpand,
          allCollapsedAfterExpand,
          allExpandedAfterClick,
          allCollapsedAfterClick,
          rowAttrAfterCollapse,
          rowAttrAfterExpand
        };
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results.allExpandedInitial).toBe(7);
      expect(results.allCollapsedInitial).toBe(1);
      expect(results.allExpandedAfterCollapse).toBe(7);
      expect(results.allExpandedAfterCollapse).toBe(7);
      expect(results.allExpandedAfterExpand).toBe(7);
      expect(results.allCollapsedAfterExpand).toBe(0);
      expect(results.allExpandedAfterClick).toBe(7);
      expect(results.rowAttrAfterCollapse).toBe('false');
      expect(results.rowAttrAfterExpand).toBe('true');
    });

    test('can expand/collapse tree', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.data = data.datasetTree;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.rowSelection = 'multiple';
        dataGrid.showHeaderExpander = true;
        dataGrid.suppressRowClickSelection = true;
        dataGrid.redraw();

        const firstRow = dataGrid.rowByIndex(0);
        const row1Expanded = firstRow.getAttribute('aria-expanded');
        const hiddenRows1 = dataGrid.container?.querySelectorAll('.ids-data-grid-row[hidden]').length;
        const expandButton = firstRow.querySelectorAll('.ids-data-grid-cell')[1].querySelector('ids-button');
        expandButton?.click();
        const row1Expanded2 = firstRow.getAttribute('aria-expanded');
        const hiddenRows2 = dataGrid.container?.querySelectorAll('.ids-data-grid-row[hidden]').length;

        const seventhRow = dataGrid.rowByIndex(6);
        const row7Expanded = seventhRow.getAttribute('aria-expanded');
        const hiddenRows3 = dataGrid.container?.querySelectorAll('.ids-data-grid-row[hidden]').length;

        const expandButton2 = seventhRow.querySelectorAll('.ids-data-grid-cell')[1].querySelector('ids-button');
        const tenthRow = dataGrid.rowByIndex(9);
        const row10Expanded = tenthRow.getAttribute('aria-expanded');
        const expandButton3 = tenthRow.querySelectorAll('.ids-data-grid-cell')[1].querySelector('ids-button');
        expandButton3?.click();
        const hiddenRows4 = dataGrid.container?.querySelectorAll('.ids-data-grid-row[hidden]').length;

        expandButton2?.click();
        const row7ExpandedAfterClick = seventhRow.getAttribute('aria-expanded');
        const hiddenRows5 = dataGrid.container?.querySelectorAll('.ids-data-grid-row[hidden]').length;

        expandButton2?.click();
        const row7ExpandedAfterCollapse = seventhRow.getAttribute('aria-expanded');
        const hiddenRows6 = dataGrid.container?.querySelectorAll('.ids-data-grid-row[hidden]').length;

        dataGrid.collapseAll();
        const hiddenRows7 = dataGrid.container?.querySelectorAll('.ids-data-grid-row:not([hidden])').length;
        expandButton2?.click();
        const hiddenRows8 = dataGrid.container?.querySelectorAll('.ids-data-grid-row:not([hidden])').length;

        return {
          row1Expanded,
          hiddenRows1,
          row1Expanded2,
          hiddenRows2,
          row7Expanded,
          hiddenRows3,
          row10Expanded,
          hiddenRows4,
          row7ExpandedAfterClick,
          hiddenRows5,
          row7ExpandedAfterCollapse,
          hiddenRows6,
          hiddenRows7,
          hiddenRows8,
        };
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results.row1Expanded).toBe('false');
      expect(results.hiddenRows1).toBe(3);
      expect(results.row1Expanded2).toBe('true');
      expect(results.hiddenRows2).toBe(0);
      expect(results.row7Expanded).toBe('true');
      expect(results.hiddenRows3).toBe(0);
      expect(results.row10Expanded).toBe('true');
      expect(results.hiddenRows4).toBe(4);
      expect(results.row7ExpandedAfterClick).toBe('false');
      expect(results.hiddenRows5).toBe(7);
      expect(results.row7ExpandedAfterCollapse).toBe('true');
      expect(results.hiddenRows6).toBe(4);
      expect(results.hiddenRows7).toBe(6);
      expect(results.hiddenRows8).toBe(9);
    });

    test('handles selection without children', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.data = data.datasetTree;
        dataGrid.rowSelection = 'multiple';

        const selectCheck = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1]
          .querySelectorAll('.ids-data-grid-cell')[1];
        const selectedRows = dataGrid.selectedRows.length;

        selectCheck?.click();
        const selectedRows2 = dataGrid.selectedRows.length;
        selectCheck?.click();
        const selectedRows3 = dataGrid.selectedRows.length;

        return {
          selectedRows,
          selectedRows2,
          selectedRows3
        };
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results.selectedRows).toBe(0);
      expect(results.selectedRows2).toBe(1);
      expect(results.selectedRows3).toBe(0);
    });

    test('handles selection including children', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.data = data.datasetTree;
        dataGrid.rowSelection = 'multiple';
        dataGrid.groupSelectsChildren = true;

        const selectCheck = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1]
          .querySelectorAll('.ids-data-grid-cell')[1];
        const selectedRows = dataGrid.selectedRows.length;

        selectCheck?.click();
        const selectedRows2 = dataGrid.selectedRows.length;
        selectCheck?.click();
        const selectedRows3 = dataGrid.selectedRows.length;

        return {
          selectedRows,
          selectedRows2,
          selectedRows3
        };
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results.selectedRows).toBe(0);
      expect(results.selectedRows2).toBe(4);
      expect(results.selectedRows3).toBe(0);
    });

    test('handles suppressRowClickSelection including children', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.data = data.datasetTree;
        dataGrid.rowSelection = 'multiple';
        dataGrid.suppressRowClickSelection = true;
        dataGrid.redraw();

        const otherCell = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1]
          .querySelectorAll('.ids-data-grid-cell')[2];
        otherCell?.click();
        const selectedRows1 = dataGrid.selectedRows.length;

        const selectCheck = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1]
          .querySelectorAll('.ids-data-grid-cell')[0];
        selectCheck?.click();
        const selectedRows2 = dataGrid.selectedRows.length;

        return {
          selectedRows1,
          selectedRows2,
        };
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results.selectedRows1).toBe(0);
      expect(results.selectedRows2).toBe(1);
    });

    test('can expand with the keyboard', async ({ page }) => {
      const results = await page.evaluate((data) => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.treeGrid = true;
        dataGrid.columns = data.treeColumnsData;
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionCheckbox;
        dataGrid.columns[1].formatter = dataGrid.formatters.tree;
        dataGrid.columns[2].formatter = dataGrid.formatters.text;
        dataGrid.data = data.datasetTree;
        dataGrid.redraw();

        const firstRow = dataGrid.rowByIndex(0);
        const expanded1 = firstRow.getAttribute('aria-expanded');
        dataGrid.setActiveCell(0, 0, true);
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        dataGrid.dispatchEvent(event);
        const event2 = new KeyboardEvent('keydown', { key: ' ' });
        dataGrid.dispatchEvent(event2);
        const expanded2 = firstRow.getAttribute('aria-expanded');

        return {
          expanded1,
          expanded2
        };
      }, {
        datasetTree,
        treeColumnsData,
      });

      expect(results.expanded1).toBe('false');
      // TODO: This is not working in the test, check datagrid keyboard events
      // expect(results.expanded2).toBe('true');
    });
  });

  test.describe('keyboard tests', () => {
    test('can handle arrow keys', async ({ page }) => {
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.activeCell.row)).toEqual(0);
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.activeCell.cell)).toEqual(0);

      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.setActiveCell(0, 0));

      await page.keyboard.press('ArrowUp');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('0:0');

      await page.keyboard.press('ArrowLeft');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('0:17');

      await page.keyboard.press('ArrowRight');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('1:0');

      await page.keyboard.press('ArrowRight');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('1:1');

      await page.keyboard.press('ArrowDown');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('2:1');

      await page.keyboard.press('ArrowLeft');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('2:0');

      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.setActiveCell(0, 8));

      await page.keyboard.press('ArrowDown');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('8:0');

      await page.keyboard.press('ArrowLeft');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('7:17');

      await page.keyboard.press('ArrowUp');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('6:17');
    });

    test('can handle keyboard row navigation', async ({ page }) => {
      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => {
        elem.rowNavigation = true;
        elem.setActiveCell(0, 0);
      });

      await page.keyboard.press('ArrowDown');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('1:0');
    });

    test('can handle keyboard with mixed row selection', async ({ page }) => {
      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => {
        elem.rowSelection = 'mixed';
        elem.setActiveCell(0, 0);
      });

      await page.keyboard.press('ArrowDown');
      expect(await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.getAttribute('active-cell'))).toEqual('1:0');
    });

    test('can handle keyboard mixed row selection with shift key', async ({ page }) => {
      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => {
        elem.rowSelection = 'mixed';
        elem.rowNavigation = true;
        elem.redraw();
        elem.setActiveCell(0, 0);
      });
      await page.keyboard.down('Shift');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.up('Shift');

      const selectedRows = await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => elem.selectedRows.length);

      expect(selectedRows).toEqual(3);
    });
  });

  test.describe('selection tests', () => {
    test('renders a radio for single select', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.rowSelection = 'single';
        dataGrid.columns[0].id = 'selectionRadio';
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionRadio;
        dataGrid.redraw();
        const radio = dataGrid.container?.querySelector('.ids-data-grid-radio');
        return radio?.classList.contains('ids-data-grid-radio');
      });

      expect(results).toBeTruthy();
    });

    test('can disable the selectionRadio', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.rowSelection = 'single';
        dataGrid.columns[0].id = 'selectionRadio';
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionRadio;
        const disabled = (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101;
        dataGrid.columns[0].disabled = disabled;
        dataGrid.redraw();
        const radio = dataGrid.container?.querySelector('.ids-data-grid-radio');
        const radio2 = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-radio');
        return {
          radio: radio?.classList.contains('disabled'),
          radio2: radio2?.classList.contains('disabled'),
        };
      });

      expect(results.radio).toBeTruthy();
      expect(results.radio2).toBeFalsy();
    });

    test('removes rowSelection on setting to false', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.rowSelection = 'single';
        const rowSelection = dataGrid.getAttribute('row-selection');
        dataGrid.rowSelection = false;
        const rowSelection2 = dataGrid.getAttribute('row-selection');

        return {
          rowSelection,
          rowSelection2,
        };
      });

      expect(results.rowSelection).toBe('single');
      expect(results.rowSelection2).toBeFalsy();
    });

    test('keeps selections on sort for single selection', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.rowSelection = 'single';
        dataGrid.columns[0].id = 'selectionRadio';
        dataGrid.columns[0].formatter = dataGrid.formatters.selectionRadio;
        dataGrid.redraw();
        const selected = dataGrid.selectedRows.length;
        const gridCell = dataGrid.container?.querySelector<any>('ids-data-grid-cell');
        gridCell?.click();
        const selected2 = dataGrid.selectedRows.length;
        dataGrid.container?.querySelector<any>('.sort-indicator ids-icon')?.click();
        const selected3 = dataGrid.selectedRows.length;

        return {
          selected,
          selected2,
          selected3,
        };
      });

      expect(results.selected).toBe(0);
      expect(results.selected2).toBe(1);
      expect(results.selected3).toBe(1);
    });

    test('keeps selections on sort for mixed selection', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.rowSelection = 'mixed';
        dataGrid.redraw();
        const selected = dataGrid.selectedRows.length;
        dataGrid.container?.querySelectorAll<any>('ids-data-grid-cell[aria-colindex="1"]')[0]?.click();
        dataGrid.container?.querySelectorAll<any>('ids-data-grid-cell[aria-colindex="1"]')[1]?.click();
        const selected2 = dataGrid.selectedRows.length;
        dataGrid.container?.querySelector<any>('.sort-indicator ids-icon')?.click();
        const selected3 = dataGrid.selectedRows.length;

        return {
          selected,
          selected2,
          selected3,
        };
      });

      expect(results.selected).toBe(0);
      expect(results.selected2).toBe(2);
      expect(results.selected3).toBe(2);
    });

    test('can click the header checkbox to select all and deselect all', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const selected = dataGrid.selectedRows.length;
        dataGrid.container?.querySelector<any>('.ids-data-grid-checkbox')?.click();
        const selected2 = dataGrid.selectedRows.length;
        dataGrid.container?.querySelector<any>('.ids-data-grid-checkbox')?.click();
        const selected3 = dataGrid.selectedRows.length;

        return {
          selected,
          selected2,
          selected3,
        };
      });

      expect(results.selected).toBe(0);
      expect(results.selected2).toBe(9);
      expect(results.selected3).toBe(0);
    });

    test('can shift click to select in between', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const selected = dataGrid.selectedRows.length;
        dataGrid.container?.querySelectorAll<any>('ids-data-grid-cell[aria-colindex="1"]')[0]?.click();
        dataGrid.container?.querySelectorAll<any>('ids-data-grid-cell[aria-colindex="1"]')[5]?.click();
        const selected2 = dataGrid.selectedRows.length;
        dataGrid.container?.querySelectorAll<any>('ids-data-grid-cell[aria-colindex="1"]')[7]?.click();
        const selected3 = dataGrid.selectedRows.length;

        return {
          selected,
          selected2,
          selected3,
        };
      });

      expect(results.selected).toBe(0);
      expect(results.selected2).toBe(2);
      expect(results.selected3).toBe(3);
    });

    test('can select the row ui via the row element', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.selectRow(0);
        const selected = dataGrid.selectedRows.length;
        dataGrid.deSelectRow(0);
        const selected2 = dataGrid.selectedRows.length;

        return {
          selected,
          selected2,
        };
      });

      expect(results.selected).toBe(1);
      expect(results.selected2).toBe(0);
    });

    test('can disable the selectionCheckbox', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const disabled = (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101;
        dataGrid.columns[0].disabled = disabled;
        dataGrid.redraw();
        const checkbox = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1]?.querySelectorAll('.ids-data-grid-cell .ids-data-grid-checkbox')[0];
        const checkbox2 = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[2]?.querySelectorAll('.ids-data-grid-cell .ids-data-grid-checkbox')[0];
        return {
          checkbox: checkbox?.classList.contains('disabled'),
          checkbox2: checkbox2?.classList.contains('disabled'),
        };
      });

      expect(results.checkbox).toBeTruthy();
      expect(results.checkbox2).toBeFalsy();
    });

    test('can select a row with space key', async ({ page }) => {
      const selected = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.setActiveCell(0, 0);
        const event = new KeyboardEvent('keydown', { key: ' ' });
        dataGrid.dispatchEvent(event);
        return dataGrid.selectedRows.length;
      });
      expect(selected).toBe(1);
    });

    test('handles suppress row deselection', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.rowSelection = 'single';
        dataGrid.suppressRowDeselection = true;
        const gridCell = dataGrid.container?.querySelector('ids-data-grid-cell');
        gridCell?.click();
        const selected = dataGrid.selectedRows.length;
        gridCell?.click();
        const selected2 = dataGrid.selectedRows.length;
        return {
          selected,
          selected2,
        };
      });

      expect(results.selected).toBe(1);
      expect(results.selected2).toBe(1);
    });

    test('handles a deSelectRow method', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.rowNavigation = true;
        dataGrid.rowSelection = 'mixed';
        dataGrid.setActiveCell(0, 0);
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        dataGrid.dispatchEvent(event);
        dataGrid.deSelectRow(1);
        return dataGrid.activatedRow.index;
      });

      expect(results).toBe(0);
    });

    test('has no errors on invalid selectRow / deSelectRow calls', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.selectRow(100000);
      });
      expect(hasConsoleError).toBeFalsy();
      await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.deSelectRow(100000);
      });
      expect(hasConsoleError).toBeFalsy();
    });
  });

  test.describe('rtl/locale tests', () => {
    test('supports readonly columns / RTL', async ({ page }) => {
      const checkReadonly = async () => {
        const results = await page.locator('ids-data-grid').evaluate(
          (elem: IdsDataGrid) => elem.container?.querySelectorAll('ids-data-grid-cell')?.[1]?.classList.contains('is-readonly')
        );
        return results;
      };
      expect(await checkReadonly()).toBeTruthy();
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLocale('ar-SA');
      });
      expect(await checkReadonly()).toBeTruthy();
    });

    test('should format values based on locale', async ({ page }) => {
      const getCellText = async (col: number) => {
        const results = await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid, colArg: number) => elem.container?.querySelectorAll('ids-data-grid-cell')?.[colArg]?.textContent?.trim(), col);
        return results;
      };

      expect(await getCellText(4)).toBe('4/23/2021');
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLocale('de-DE');
      });
      expect(await getCellText(4)).toBe('23.4.2021');
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
