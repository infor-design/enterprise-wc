import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridCell from '../../src/components/ids-data-grid/ids-data-grid-cell';

test.describe('IdsDataGridCell tests', () => {
  const url = '/ids-data-grid/columns-formatters.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
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

    test('should get cell with cellByIndex', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const cell = await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(2, 3)?.textContent);
      expect(cell).toBe('103');
    });
  });
});
