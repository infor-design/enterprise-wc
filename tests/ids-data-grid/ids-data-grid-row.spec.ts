import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsButton from '../../src/components/ids-button/ids-button';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridRow from '../../src/components/ids-data-grid/ids-data-grid-row';

test.describe('IdsDataGridRow tests', () => {
  const url = '/ids-data-grid/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
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

    test('renders row data', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;

        return {
          columns: dataGrid.columns.length,
          rows: dataGrid.container?.querySelectorAll('.ids-data-grid-row').length,
          cells: dataGrid.container?.querySelectorAll('.ids-data-grid-cell').length
        };
      });

      expect(results.rows).toBe(10);
      expect(results.cells).toBe(((results.rows || 1) - 1) * results.columns);
    });

    test('skips hidden rows', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.data[0].rowHidden = true;
        dataGrid.redraw();
        const row1 = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1];
        const row2 = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[2];

        return {
          row1: row1?.getAttribute('hidden'),
          row2: row2?.getAttribute('hidden')
        };
      });

      expect(results.row1).toBe('');
      expect(results.row2).toBeNull();
    });

    test('render disabled rows', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.data[0].disabled = true;
        dataGrid.redraw();
        const row1 = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[1];
        const row2 = dataGrid.container?.querySelectorAll('.ids-data-grid-row')[2];

        return {
          row1: row1?.getAttribute('disabled'),
          row2: row2?.getAttribute('disabled')
        };
      });

      expect(results.row1).toBe('');
      expect(results.row2).toBeNull();
    });

    test('skips re-rerender if no data', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.columns = [];
        dataGrid.data = [];
        dataGrid.redrawBody();
        const rows = dataGrid.container?.querySelectorAll('.ids-data-grid-row').length;

        return rows;
      });

      expect(results).toEqual(10);
    });

    test('renders with alternateRowShading option', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;

        dataGrid.alternateRowShading = true;
        const alternaiveRowShadingSet = dataGrid.alternateRowShading;
        const hasClassSet = dataGrid.container?.classList.contains('alt-row-shading');

        dataGrid.alternateRowShading = false;
        const alternaiveRowShadingUnset = dataGrid.alternateRowShading;
        const hasClassUnset = dataGrid.container?.classList.contains('alt-row-shading');

        return {
          alternaiveRowShadingSet,
          hasClassSet,
          alternaiveRowShadingUnset,
          hasClassUnset
        };
      });

      expect(results.alternaiveRowShadingSet).toBeTruthy();
      expect(results.hasClassSet).toBeTruthy();
      expect(results.alternaiveRowShadingUnset).toBeFalsy();
      expect(results.hasClassUnset).toBeFalsy();
    });

    test('renders additional rows when IdsDataGrid.appendData() used', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const initialDataLength = dataGrid.data.length;
        dataGrid.appendData(dataGrid.data);

        return {
          initialDataLength,
          updatedDataLength: dataGrid.data.length
        };
      });

      expect(results.updatedDataLength).toEqual(results.initialDataLength * 2);
    });

    test('can set the rowHeight setting / can set the rowHeight setting in virtualScroll mode', async ({ page }) => {
      const getRowHeightData = async (rowHeight: string | null) => {
        const results = await page.evaluate((attrRowHeight) => {
          const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
          dataGrid.rowHeight = attrRowHeight as string;

          return {
            container: dataGrid.container?.getAttribute('data-row-height'),
            attr: dataGrid.getAttribute('row-height'),
            virtualScrollSettings: dataGrid.virtualScrollSettings?.ROW_HEIGHT
          };
        }, rowHeight);

        return results;
      };

      ['xs', 'sm', 'md', 'lg'].forEach(async (rowHeight) => {
        expect(await getRowHeightData(rowHeight)).toEqual(
          expect.objectContaining({ container: rowHeight, attr: rowHeight })
        );
      });

      expect(await getRowHeightData(null)).toEqual(expect.objectContaining({ container: 'lg', attr: null }));

      await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        dataGrid.virtualScroll = true;
      });

      expect(await getRowHeightData('xs')).toEqual(expect.objectContaining({ virtualScrollSettings: 31 }));
      expect(await getRowHeightData('sm')).toEqual(expect.objectContaining({ virtualScrollSettings: 36 }));
      expect(await getRowHeightData('md')).toEqual(expect.objectContaining({ virtualScrollSettings: 41 }));
      expect(await getRowHeightData('lg')).toEqual(expect.objectContaining({ virtualScrollSettings: 51 }));
      expect(await getRowHeightData(null)).toEqual(expect.objectContaining({ virtualScrollSettings: 51 }));
    });
  });

  test.describe('activation tests', () => {
    test('handles suppress row deactivation', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        dataGrid.rowSelection = 'mixed';
        dataGrid.suppressRowDeactivation = false;
        dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)')?.click();
        const activatedRow1 = dataGrid.activatedRow;
        dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)')?.click();
        const activatedRow2 = dataGrid.activatedRow;

        dataGrid.suppressRowDeactivation = true;
        dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();
        const activatedRow3 = dataGrid.activatedRow;
        dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();
        const activatedRow4 = dataGrid.activatedRow;
        dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(3) .ids-data-grid-cell:nth-child(2)').click();
        const activatedRow5 = dataGrid.activatedRow;

        return {
          activatedRow1,
          activatedRow2,
          activatedRow3,
          activatedRow4,
          activatedRow5
        };
      });

      expect(results.activatedRow1.index).toBe(1);
      expect(results.activatedRow2.index).not.toBeDefined();
      expect(results.activatedRow3.index).toBe(1);
      expect(results.activatedRow4.index).toBe(1);
      expect(results.activatedRow5.index).toBe(2);
    });

    test('should fire the rowactivated event', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        let calls = 0;
        const mockCallback = () => {
          calls++;
        };
        dataGrid.rowSelection = 'mixed';
        dataGrid.addEventListener('rowactivated', mockCallback);
        dataGrid.container?.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();

        return calls;
      });

      expect(results).toBe(1);
    });

    test('handles a deactivateRow method', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<any>('ids-data-grid')!;
        const activatedRow = dataGrid.activatedRow;
        dataGrid.rowSelection = 'mixed';
        dataGrid.activateRow(1);
        const activatedRow1 = dataGrid.activatedRow;
        dataGrid.deactivateRow(1);
        const activatedRow2 = dataGrid.activatedRow;
        dataGrid.activateRow(2);
        const activatedRow3 = dataGrid.activatedRow;
        dataGrid.deactivateRow(null);
        const activatedRow4 = dataGrid.activatedRow;

        return {
          activatedRow,
          activatedRow1,
          activatedRow2,
          activatedRow3,
          activatedRow4
        };
      });

      expect(results.activatedRow.index).not.toBeDefined();
      expect(results.activatedRow1.index).toBe(1);
      expect(results.activatedRow1.data).toBeTruthy();
      expect(results.activatedRow2.index).not.toBeDefined();
      expect(results.activatedRow3.index).toBe(2);
      expect(results.activatedRow4.index).toBe(2);
    });

    test.describe('event tests', () => {
      test('should fire rowcollapsed/rowexpanded event', async ({ page }) => {
        await page.goto('/ids-data-grid/expandable-row.html');
        const expandable = await page.locator('#data-grid-expandable-row');
        const expandableAllowOne = await page.locator('#data-grid-expandable-row-allow-one');
        await expandable.evaluate((elem: IdsDataGrid) => {
          (window as any).expandedEventCount = 0;
          (window as any).collapsedEventCount = 0;
          (window as any).expandedRowIndex = null;
          (window as any).collapsedRowIndex = null;
          elem.addEventListener('rowexpanded', (e: any) => {
            (window as any).expandedRowIndex = e.detail.row;
            (window as any).expandedEventCount++;
          });
          elem.addEventListener('rowcollapsed', (e: any) => {
            (window as any).collapsedRowIndex = e.detail.row;
            (window as any).collapsedEventCount++;
          });
        });
        await expandableAllowOne.evaluate((elem: IdsDataGrid) => {
          (window as any).expandedRowIndexAllowOne = null;
          (window as any).collapsedRowIndexAllowOne = null;
          elem.addEventListener('rowexpanded', (e: any) => {
            (window as any).expandedRowIndexAllowOne = e.detail.row;
            (window as any).expandedEventCountAllowOne++;
          });
          elem.addEventListener('rowcollapsed', (e: any) => {
            (window as any).collapsedRowIndexAllowOne = e.detail.row;
            (window as any).collapsedEventCountAllowOne++;
          });
        });
        const clickOnRow = async (rowIndex: number, grid: Locator) => {
          await grid.evaluate((elem: IdsDataGrid, index: number) => {
            elem?.rowByIndex(index)?.querySelector<HTMLElement>('.expand-button')?.click();
          }, rowIndex);
        };
        // Expandable row tests
        await clickOnRow(0, expandable);
        expect(await expandable.evaluate(() => (window as any).expandedRowIndex)).toBe(0);
        expect(await expandable.evaluate(() => (window as any).collapsedRowIndex)).toBeNull();
        await clickOnRow(1, expandable);
        expect(await expandable.evaluate(() => (window as any).expandedRowIndex)).toBe(1);
        expect(await expandable.evaluate(() => (window as any).collapsedRowIndex)).toBeNull();
        await clickOnRow(3, expandable);
        expect(await expandable.evaluate(() => (window as any).expandedRowIndex)).toBe(3);
        expect(await expandable.evaluate(() => (window as any).collapsedRowIndex)).toBeNull();
        await clickOnRow(0, expandable);
        expect(await expandable.evaluate(() => (window as any).expandedRowIndex)).toBe(3);
        expect(await expandable.evaluate(() => (window as any).collapsedRowIndex)).toBe(0);
        await clickOnRow(1, expandable);
        expect(await expandable.evaluate(() => (window as any).expandedRowIndex)).toBe(3);
        expect(await expandable.evaluate(() => (window as any).collapsedRowIndex)).toBe(1);
        await clickOnRow(3, expandable);
        expect(await expandable.evaluate(() => (window as any).expandedRowIndex)).toBe(3);
        expect(await expandable.evaluate(() => (window as any).collapsedRowIndex)).toBe(3);

        // Expandable row allow one tests
        await clickOnRow(0, expandableAllowOne);
        expect(await expandableAllowOne.evaluate(() => (window as any).collapsedRowIndexAllowOne)).toBeNull();
        expect(await expandableAllowOne.evaluate(() => (window as any).expandedRowIndexAllowOne)).toBe(0);
        await clickOnRow(1, expandableAllowOne);
        expect(await expandableAllowOne.evaluate(() => (window as any).collapsedRowIndexAllowOne)).toBe(0);
        expect(await expandableAllowOne.evaluate(() => (window as any).expandedRowIndexAllowOne)).toBe(1);
        await clickOnRow(1, expandableAllowOne);
        expect(await expandableAllowOne.evaluate(() => (window as any).collapsedRowIndexAllowOne)).toBe(1);
        expect(await expandableAllowOne.evaluate(() => (window as any).expandedRowIndexAllowOne)).toBe(1);
        await clickOnRow(2, expandableAllowOne);
        expect(await expandableAllowOne.evaluate(() => (window as any).collapsedRowIndexAllowOne)).toBe(1);
        expect(await expandableAllowOne.evaluate(() => (window as any).expandedRowIndexAllowOne)).toBe(2);
        await clickOnRow(0, expandableAllowOne);
        expect(await expandableAllowOne.evaluate(() => (window as any).collapsedRowIndexAllowOne)).toBe(2);
        expect(await expandableAllowOne.evaluate(() => (window as any).expandedRowIndexAllowOne)).toBe(0);

        // Expand all/collapse all tests
        await expandable.evaluate((elem: IdsDataGrid) => {
          (window as any).expandedEventCount = 0;
          (window as any).collapsedEventCount = 0;
          elem.expandAll();
        });
        expect(await expandable.evaluate(() => (window as any).expandedEventCount)).toBe(1);
        await expandable.evaluate((elem: IdsDataGrid) => {
          elem.collapseAll(true, false);
        });
        expect(await expandable.evaluate(() => (window as any).collapsedEventCount)).toBe(1);
        const rowsCount = await expandable.evaluate((elem: IdsDataGrid) => elem.rows.length);
        await expandable.evaluate((elem: IdsDataGrid) => {
          (window as any).collapsedEventCount = 0;
          elem.expandAll();
          // trigger event for each row
          elem.collapseAll(false, true);
        });
        expect(await expandable.evaluate(() => (window as any).collapsedEventCount)).toBe(rowsCount);
        await expandable.evaluate((elem: IdsDataGrid) => {
          (window as any).collapsedEventCount = 0;
          elem.expandAll();
          // doesn't trigger the event at all
          elem.collapseAll(false, false);
        });
        expect(await expandable.evaluate(() => (window as any).collapsedEventCount)).toBe(0);
      });
    });
  });
});

test.describe('IdsDataGridRow add tests', () => {
  const url = '/ids-data-grid/add-row.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('add/remove row tests', () => {
    test('can add/remove rows, and row-data maintains the correct order', async ({ page }) => {
      const data = await page.evaluate(() => {
        const CHECKBOX_COLUMN = 0;
        const DESCRIPTION_COLUMN = 1;

        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const addRowButton = document.querySelector<IdsButton>('ids-button#add-row')!;
        const deleteRowButton = document.querySelector<IdsButton>('ids-button#delete-row')!;

        const mouseClick = new MouseEvent('click', { bubbles: true });

        addRowButton.dispatchEvent(mouseClick);
        dataGrid.rows[0]?.cellByIndex(DESCRIPTION_COLUMN)?.editor?.change('FIRST');

        addRowButton.dispatchEvent(mouseClick);
        dataGrid.rows[1]?.cellByIndex(DESCRIPTION_COLUMN)?.editor?.change('SECOND');

        addRowButton.dispatchEvent(mouseClick);
        dataGrid.rows[2]?.cellByIndex(DESCRIPTION_COLUMN)?.editor?.change('THIRD');

        addRowButton.dispatchEvent(mouseClick);
        dataGrid.rows[3]?.cellByIndex(DESCRIPTION_COLUMN)?.editor?.change('FOURTH');

        dataGrid.rows[1]?.cellByIndex(CHECKBOX_COLUMN)?.dispatchEvent(mouseClick);
        deleteRowButton.dispatchEvent(mouseClick);

        return dataGrid.data;
      });

      expect(data.length).toBe(3);
      expect(data[0].description).toBe('FIRST');
      expect(data[1].description).toBe('THIRD');
      expect(data[2].description).toBe('FOURTH');
    });
  });
});
