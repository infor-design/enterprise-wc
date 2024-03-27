import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';

test.describe('IdsDataGrid empty message tests', () => {
  const url = '/ids-data-grid/empty-message.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
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

    test('should set empty message icon', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.emptyMessageIcon = 'empty-no-alerts-new';
      });
      expect(await page.locator('ids-data-grid ids-empty-message').getAttribute('icon')).toEqual('empty-no-alerts-new');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.emptyMessageIcon = null;
      });
    });

    test('should toggle empty message with filter', async ({ page }) => {
      await page.goto('/ids-data-grid/filter.html');
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.applyFilter([{ columnId: 'color', operator: 'equals', value: 'non exist' }]);
      });
      expect(await page.locator('ids-data-grid ids-empty-message').isVisible()).toBeTruthy();
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.emptyMessageElements?.em?.hidden)).toBeFalsy();
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.container?.querySelectorAll('ids-data-grid-row').length)).toBe(1);
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.applyFilter([{ columnId: 'color', operator: 'equals', value: 'green' }]);
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.emptyMessageElements?.em?.hidden)).toBeTruthy();
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.suppressEmptyMessage = true;
        elem.applyFilter([{ columnId: 'color', operator: 'equals', value: 'non exist' }]);
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.emptyMessageElements?.em?.hidden)).toBeTruthy();
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.container?.querySelectorAll('ids-data-grid-row').length)).toBe(1);
    });

    test('should toggle empty message with virtual scroll', async ({ page }) => {
      await page.goto('/ids-data-grid/virtual-scroll.html');
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.data = [];
      });
      expect(await page.locator('ids-data-grid ids-empty-message').isVisible()).toBeTruthy();
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.emptyMessageElements?.em?.hidden)).toBeFalsy();
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem?.container?.querySelectorAll('ids-data-grid-row').length)).toBe(1);
    });
  });
});
