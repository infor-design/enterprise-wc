import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridRow from '../../src/components/ids-data-grid/ids-data-grid-row';
import IdsDataGridCell from '../../src/components/ids-data-grid/ids-data-grid-cell';

test.describe('IdsDataGridRow tests', () => {
  const url = '/ids-data-grid/add-row.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
    test('Renders additional rows and filling cells with correct data for each column', async ({ page }) => {
      const dataGridRows = [
        {
          description: 'Item 1',
          ledger: 'AB',
          publishDate: '2021-04-24T18:25:43.511Z',
          publishTime: '12:00:00',
          price: '10.99',
          bookCurrency: 'usd',
          transactionCurrency: 'Book',
          roundPrice: '11',
          location: '',
          postHistory: false,
        },
        {
          description: 'Item 2',
          ledger: 'AC',
          publishDate: '2021-04-25T18:25:43.511Z',
          publishTime: '12:00:00',
          price: '12.99',
          bookCurrency: 'usd',
          transactionCurrency: 'Book',
          roundPrice: '13',
          location: '',
          postHistory: true,
        },
        {
          description: 'Item 3',
          ledger: 'AD',
          publishDate: '2021-04-26T18:25:43.511Z',
          publishTime: '12:00:00',
          price: '9.99',
          bookCurrency: 'usd',
          transactionCurrency: 'Book',
          roundPrice: '10',
          location: '',
          postHistory: false,
        },
        {
          description: 'Item 4',
          ledger: 'AF',
          publishDate: '2021-04-27T18:25:43.511Z',
          publishTime: '12:00:00',
          price: '14.99',
          bookCurrency: 'usd',
          transactionCurrency: 'Book',
          roundPrice: '15',
          location: '',
          postHistory: true,
        }
      ];

      const values = await page.evaluate(async ({ rows }) => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;

        const fillDataToRow = (row: IdsDataGridRow, data: any) => {
          const cells = row.querySelectorAll<IdsDataGridCell>(':scope > ids-data-grid-cell');
          const rowDataNames = Object.keys(data);
          cells.forEach((cell) => {
            if (rowDataNames?.includes(cell?.column?.id)) {
              const cellData = data[cell.column.id];
              cell.updateData(cellData, false);
            }
          });
        };

        const createRowWithButton = (data: any): IdsDataGridRow | null | undefined => {
          document.querySelector<HTMLButtonElement>('#add-row')?.click();

          const selectedRow = dataGrid.container?.querySelector<IdsDataGridRow>('.ids-data-grid-body ids-data-grid-row:last-child');

          if (selectedRow) {
            fillDataToRow(selectedRow, data);
          }

          return selectedRow;
        };

        const deleteLastRow = () => {
          const lastRow = dataGrid.container?.querySelector<IdsDataGridRow>('.ids-data-grid-body ids-data-grid-row:last-child');
          if (lastRow) {
            const checkbox = lastRow?.querySelector('.is-selection-checkbox .ids-data-grid-checkbox');
            lastRow.selected = true;
            checkbox?.classList.add('checked');
            checkbox?.setAttribute('aria-checked', 'true');
            dataGrid.updateDataset(lastRow?.rowIndex, { rowSelected: true });
          }

          document.querySelector<HTMLButtonElement>('#delete-row')?.click();
        };

        const getDataGridValues = () => {
          const gridValues = dataGrid.rows.map((row: IdsDataGridRow) => {
            const cells = row.querySelectorAll<IdsDataGridCell>(':scope > ids-data-grid-cell');
            const rowData: any = {};
            cells.forEach((cell) => {
              rowData[cell.column.id] = cell.value;
            });
            return rowData;
          });

          return gridValues;
        };

        createRowWithButton(rows[0]);
        createRowWithButton(rows[1]);
        createRowWithButton(rows[2]);
        createRowWithButton(rows[3]);

        const dataGridValues = getDataGridValues();
        const results: any = [
          dataGrid.rows.length,
          dataGridValues,
        ];

        deleteLastRow();
        results.push(getDataGridValues());

        deleteLastRow();
        deleteLastRow();

        results.push(getDataGridValues());

        return results;
      }, { rows: dataGridRows });


      const dataGridValues = values[1];
      const oneRemovedValues = values[2];
      const threeRemovedValues = values[3];

      expect(values[0]).toBe(4);
      expect(dataGridValues?.length).toBe(4);
      dataGridRows.forEach((row: any, index: number) => {
        const dataGridRow = dataGridValues[index];
        const columns = Object.keys(row);
        columns.forEach((column: any) => {
          expect(row[column]).toBe(dataGridRow[column]);
        });
      });

      expect(oneRemovedValues.length).toBe(3);
      dataGridRows.slice(0, 3).forEach((row: any, index: number) => {
        const dataGridRow = oneRemovedValues[index];
        const columns = Object.keys(row);
        columns.forEach((column: any) => {
          expect(row[column]).toBe(dataGridRow[column]);
        });
      });

      expect(threeRemovedValues.length).toBe(1);
      dataGridRows.slice(0, 1).forEach((row: any, index: number) => {
        const dataGridRow = threeRemovedValues[index];
        const columns = Object.keys(row);
        columns.forEach((column: any) => {
          expect(row[column]).toBe(dataGridRow[column]);
        });
      });
    });
  });
});
