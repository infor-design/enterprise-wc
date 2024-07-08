import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';

test.describe('IdsDataGrid column tests', () => {
  const url = '/ids-data-grid/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
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

    test('can hide / show column with hide/showColumn', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.hideColumn('description');
        const hiddenColumn = dataGrid.container?.querySelector('[column-id="description"]');
        dataGrid.showColumn('description', true);
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

  test.describe('reordering tests', () => {
    test('supports column reorder', async ({ page }) => {
      const drogColumns = async (from: number, to: number) => {
        const col1 = await page.locator(`ids-data-grid .ids-data-grid-header-cell[aria-colindex="${from}"] .reorderer`);
        const col2 = await page.locator(`ids-data-grid .ids-data-grid-header-cell[aria-colindex="${to}"] .reorderer`);
        await col1.hover();
        await page.mouse.down();
        await col2.hover();
        await page.mouse.up();
      };
      const dataGrid = await page.locator('ids-data-grid');
      // from left to right
      await drogColumns(2, 3);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[1].id)).toBe('description');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[2].id)).toBe('rowNumber');

      // from right to left
      await drogColumns(8, 7);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[6].id)).toBe('bookCurrency');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[7].id)).toBe('price');
    });

    test('supports moveColumn', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.moveColumn(0, 1);
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[0].id)).toBe('rowNumber');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[1].id)).toBe('selectionCheckbox');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.moveColumn(4, 3);
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[3].id)).toBe('publishDate');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[4].id)).toBe('ledger');
    });
  });

  test.describe('resizing tests', () => {
    test('supports column resize', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const resizeColumn = async (colNumber: number, x: number) => {
        const resizer = await page.locator(`ids-data-grid .ids-data-grid-header-cell[aria-colindex="${colNumber}"] .resizer`);
        const column = await page.locator(`ids-data-grid .ids-data-grid-header-cell[aria-colindex="${colNumber}"]`);
        const columnBoxBefore = await column.boundingBox();
        const box = await resizer.boundingBox();
        const xMove = (box?.x || 0) + x + 4;
        await resizer.hover();
        await page.mouse.down();
        await page.mouse.move(xMove, (box?.y || 0));
        await page.mouse.up();
        const columnBoxAfter = await column.boundingBox();
        return {
          colWidthBefore: columnBoxBefore?.width,
          colWidthAfter: columnBoxAfter?.width
        };
      };
      let column = await resizeColumn(2, 15);
      expect(column.colWidthBefore).toBe(65);
      expect(column.colWidthAfter).toBe(65 + 15);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[1].width)).toBe(65 + 15);

      column = await resizeColumn(3, 10);
      expect(column.colWidthBefore).toBe(110);
      expect(column.colWidthAfter).toBe(110 + 10);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[2].width)).toBe(110 + 10);

      column = await resizeColumn(4, -10);
      expect(column.colWidthBefore).toBe(110);
      expect(column.colWidthAfter).toBe(110 - 10);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[3].width)).toBe(110 - 10);
    });

    test('supports column resize on RTL', async ({ page }) => {
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLocale('ar-SA');
      });
      const dataGrid = await page.locator('ids-data-grid');
      expect(await dataGrid.getAttribute('dir')).toBe('rtl');
      const resizeColumn = async (colNumber: number, x: number) => {
        const resizer = await page.locator(`ids-data-grid .ids-data-grid-header-cell[aria-colindex="${colNumber}"] .resizer`);
        const column = await page.locator(`ids-data-grid .ids-data-grid-header-cell[aria-colindex="${colNumber}"]`);
        const columnBoxBefore = await column.boundingBox();
        const box = await resizer.boundingBox();
        const xMove = (box?.x || 0) + x + 2;
        await resizer.hover();
        await page.mouse.down();
        await page.mouse.move(xMove, (box?.y || 0));
        await page.mouse.up();
        const columnBoxAfter = await column.boundingBox();
        return {
          colWidthBefore: columnBoxBefore?.width,
          colWidthAfter: columnBoxAfter?.width
        };
      };
      let column = await resizeColumn(2, -15);
      expect(column.colWidthBefore).toBe(65);
      expect(column.colWidthAfter).toBe(65 + 15);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[1].width)).toBe(65 + 15);

      column = await resizeColumn(3, -10);
      expect(column.colWidthBefore).toBe(110);
      expect(column.colWidthAfter).toBe(110 + 10);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[2].width)).toBe(110 + 10);

      column = await resizeColumn(4, 10);
      expect(column.colWidthBefore).toBe(110);
      expect(column.colWidthAfter).toBe(110 - 10);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.columns[3].width)).toBe(110 - 10);
    });
  });
});
