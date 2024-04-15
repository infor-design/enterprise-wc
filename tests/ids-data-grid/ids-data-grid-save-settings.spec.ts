import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';

test.describe('IdsDataGrid save settings tests', () => {
  const url = '/ids-data-grid/example.html';
  const uniqueId = 'some-uniqueid-1';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.uniqueId = arg;
    }, uniqueId);
  });

  test('should save/restore active page with local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const setting = 'active-page';
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.saveActivePage = true;
      elem.saveSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toEqual(1);
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-active-page`), uniqueId)).toBe('1');
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.restoreSetting(arg);
      elem.clearSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-active-page`), uniqueId)).toBeNull();
  });

  test('should save/restore columns with local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const setting = 'columns';
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.saveColumns = true;
      elem.saveSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      const saved = elem.savedSetting(arg);
      return saved;
    }, setting)).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'description' }),
      expect.objectContaining({ id: 'ledger' })
    ]));
    expect(await page.evaluate((arg) => {
      const saved = JSON.parse(localStorage.getItem(`ids-data-grid-usersettings-${arg}-columns`) as string);
      return saved;
    }, uniqueId)).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'description' }),
      expect.objectContaining({ id: 'ledger' })
    ]));
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.restoreSetting(arg);
      elem.clearSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-active-page`), uniqueId)).toBeNull();
  });

  test('should save/restore filter with local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const setting = 'filter';
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.filterable = true;
      elem.columnDataById('description').filterType = elem.filters.text;
      elem.redraw();
      elem.saveFilter = true;
      elem.saveSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toEqual([]);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ columnId: 'description' }),
        expect.objectContaining({ operator: 'equals' }),
        expect.objectContaining({ value: '105' })
      ])
    );
    expect(await page.evaluate((arg) => {
      const saved = JSON.parse(localStorage.getItem(`ids-data-grid-usersettings-${arg}-filter`) as string);
      return saved;
    }, uniqueId)).toEqual(expect.arrayContaining([
      expect.objectContaining({ columnId: 'description' }),
      expect.objectContaining({ operator: 'equals' }),
      expect.objectContaining({ value: '105' })
    ]));
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.restoreSetting(arg);
      elem.clearSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-filter`), uniqueId)).toBeNull();
  });

  test('should save/restore page size with local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const setting = 'page-size';
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.pageSize = 5;
      elem.savePageSize = true;
      elem.saveSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toEqual(5);
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-page-size`), uniqueId)).toBe('5');
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.restoreSetting(arg);
      elem.clearSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-page-size`), uniqueId)).toBeNull();
  });

  test('should save/restore row height with local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const setting = 'row-height';
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.rowHeight = 'xs';
      elem.saveRowHeight = true;
      elem.saveSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toEqual('xs');
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-row-height`), uniqueId)).toContain('xs');
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.restoreSetting(arg);
      elem.clearSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-row-height`), uniqueId)).toBeNull();
  });

  test('should save/restore sort order to local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const setting = 'sort-order';
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.saveSortOrder = true;
      elem.setSortColumn('description', true);
      elem.saveSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      const saved = elem.savedSetting(arg);
      return saved;
    }, setting)).toEqual(expect.objectContaining({
      id: 'description',
      ascending: true
    }));
    expect(await page.evaluate((arg) => {
      const saved = JSON.parse(localStorage.getItem(`ids-data-grid-usersettings-${arg}-sort-order`) as string);
      return saved;
    }, uniqueId)).toEqual(expect.objectContaining({
      id: 'description',
      ascending: true
    }));

    await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => {
      elem.restoreSetting(arg);
      elem.clearSetting(arg);
    }, setting);
    expect(await dataGrid.evaluate((elem: IdsDataGrid, arg: string) => elem.savedSetting(arg), setting)).toBeNull();
    expect(await page.evaluate((arg) => localStorage.getItem(`ids-data-grid-usersettings-${arg}-sort-order`), uniqueId)).toBeNull();
  });

  test('should save all user settings to local storage', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.saveUserSettings = true;
      elem.pageSize = 5;
      elem.setSortColumn('description', true);
      elem.saveActivePage = true;
      elem.saveColumns = true;
      elem.saveFilter = true;
      elem.savePageSize = true;
      elem.saveRowHeight = true;
      elem.saveSortOrder = true;
      elem.saveAllSettings();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: 1,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'lg',
        sortOrder: expect.objectContaining({
          id: 'description',
          ascending: true
        })
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.restoreAllSettings();
      elem.clearAllSettings();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
  });

  test('should auto save user settings', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.pageSize = 5;
      elem.setSortColumn('description', true);
      elem.saveActivePage = true;
      elem.saveColumns = true;
      elem.saveFilter = true;
      elem.savePageSize = true;
      elem.saveRowHeight = true;
      elem.saveSortOrder = true;
      elem.saveSettings();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: 1,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'lg',
        sortOrder: expect.objectContaining({
          id: 'description',
          ascending: true
        })
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.clearAllSettings();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.saveActivePage = false;
      elem.saveColumns = false;
      elem.saveFilter = false;
      elem.savePageSize = false;
      elem.saveRowHeight = false;
      elem.saveSortOrder = false;
      elem.saveSettings();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.saveUserSettings = true;
      elem.saveSettings();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: 1,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'lg',
        sortOrder: expect.objectContaining({
          id: 'description',
          ascending: true
        })
      })
    );
  });

  test('should save on pager change', async ({ page }) => {
    await page.goto('/ids-data-grid/pagination-client-side.html');
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.pagination = 'client-side';
      elem.pageSize = 2;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.pager.dispatchEvent(new CustomEvent('pagenumberchange', { detail: { value: 2 } }));
      elem.saveUserSettings = true;
      elem.pager.dispatchEvent(new CustomEvent('pagesizechange', { detail: { value: 5 } }));
    });

    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.allSavedSettings())).toEqual(
      expect.objectContaining({
        activePage: 2,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'color' }),
          expect.objectContaining({ id: 'inStock' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'md',
        sortOrder: null
      })
    );
  });
});
