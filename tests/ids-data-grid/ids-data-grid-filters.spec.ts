import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';

test.describe('IdsDataGrid filter tests', () => {
  const url = '/ids-data-grid/filter-trigger-fields.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('should set filterable', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filterable)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterable = false;
    });
    const filtersVisible = (elem: IdsDataGrid) => {
      const nodes = elem.container?.querySelectorAll('.ids-data-grid-header-cell-filter-wrapper');
      return ![...(nodes || [])].every((n: any) => n.classList.contains('hidden'));
    };
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'price', operator: 'equals', value: '222' }]);
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows.length)).not.toBe(0);
    expect(await dataGrid.evaluate(filtersVisible)).toBeFalsy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterable = true;
    });
    expect(await dataGrid.getAttribute('filterable')).toBe('true');
    expect(await dataGrid.evaluate(filtersVisible)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'price', operator: 'equals', value: '222' }]);
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows.length)).toBe(0);
  });

  test('should set filter row as disabled state', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const filtersDisabled = (elem: IdsDataGrid) => {
      const nodes = elem.container?.querySelectorAll('.ids-data-grid-header-cell-filter-wrapper');
      return [...(nodes || [])].every((n: any) => n.classList.contains('disabled'));
    };
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterRowDisabled = true;
    });
    expect(await dataGrid.getAttribute('filter-row-disabled')).toBe('true');
    expect(await dataGrid.evaluate(filtersDisabled)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterRowDisabled = false;
    });
    expect(await dataGrid.evaluate(filtersDisabled)).toBeFalsy();
  });

  test('should sets disable client filter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const getRowsCount = (elem: IdsDataGrid) => elem.container?.querySelectorAll('.ids-data-grid-body .ids-data-grid-row').length;
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.disableClientFilter = true;
      elem.applyFilter([{ columnId: 'price', operator: 'equals', value: '222' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.disableClientFilter = false;
      elem.applyFilter([{ columnId: 'price', operator: 'equals', value: '222' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount)).toBe(0);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount)).toBe(9);
  });
});
