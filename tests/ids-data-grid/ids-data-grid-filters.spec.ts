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

  test('renders as disable and readonly filter elements', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[1] = {
        ...elem.columns[1],
        filterOptions: { disabled: true }
      };
      elem.redraw();
    });
    const selector = '.ids-data-grid-header-cell[aria-colindex="2"] .ids-data-grid-header-cell-filter-wrapper';
    const isDisabled = (elem: IdsDataGrid, arg: string) => elem.container?.querySelector(arg)?.classList.contains('disabled');
    expect(await dataGrid.evaluate(isDisabled, selector)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[1] = {
        ...elem.columns[1],
        filterOptions: { disabled: false, readonly: true }
      };
      elem.redraw();
    });
    const isReadonly = (elem: IdsDataGrid, arg: string) => elem.container?.querySelector(arg)?.querySelector('ids-menu-button')?.hasAttribute('readonly');
    expect(await dataGrid.evaluate(isDisabled, selector)).toBeFalsy();
    expect(await dataGrid.evaluate(isReadonly, selector)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[1] = {
        ...elem.columns[1],
        filterOptions: { disabled: true, readonly: true }
      };
      elem.redraw();
    });
    expect(await dataGrid.evaluate(isDisabled, selector)).toBeTruthy();
    expect(await dataGrid.evaluate(isReadonly, selector)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[1] = {
        ...elem.columns[1],
        filterOptions: {}
      };
      elem.redraw();
    });
    expect(await dataGrid.evaluate(isDisabled, selector)).toBeFalsy();
    expect(await dataGrid.evaluate(isReadonly, selector)).toBeFalsy();
  });

  test('should not filter on selected menu button event', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const event = new CustomEvent('selected');
      elem.wrapper?.dispatchEvent(event);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should close filter button on outside click', async ({ page }) => {
    const buttonEl = await page.locator('ids-data-grid .ids-data-grid-header-cell[column-id="integer"] .ids-data-grid-header-cell-filter-wrapper ids-menu-button');
    await buttonEl.click();
    expect(await buttonEl.evaluate((elem: any) => elem.menuEl.visible)).toBeTruthy();
    await buttonEl.evaluate((elem: any) => elem.menuEl.onOutsideClick());
    expect(await buttonEl.evaluate((elem: any) => elem.menuEl.visible)).toBeFalsy();
  });

  test('should set filter with click on menu button', async ({ page }) => {
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    const wrapSelector = '.ids-data-grid-header-cell[column-id="integer"] .ids-data-grid-header-cell-filter-wrapper';
    const filterWrapper = await page.locator(wrapSelector);
    const setValue = async (value: string) => {
      await filterWrapper.evaluate((elem: any, arg: string) => {
        elem.querySelector('ids-input').value = arg;
      }, value);
    };
    const openMenu = async () => {
      await filterWrapper.evaluate((elem: any) => {
        elem.querySelector('ids-menu-button').click();
      });
    };
    const clickOnMenuItem = async (value: string) => {
      await filterWrapper.evaluate((elem: any, arg: string) => {
        const item = elem.querySelector('ids-menu-button').menuEl.querySelector(`ids-menu-item[value="${arg}"]`);
        item.click();
      }, value);
    };
    await setValue('102');
    await openMenu();
    await clickOnMenuItem('equals');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(0);
    await setValue('200');
    await clickOnMenuItem('equals');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(2);
    await clickOnMenuItem('less-than');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(5);
  });

  test.skip('should sets filter with click on menu button date filter type', async ({ page }) => {
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    const wrapSelector = '.ids-data-grid-header-cell[column-id="publishDate"] .ids-data-grid-header-cell-filter-wrapper';
    const filterWrapper = await page.locator(wrapSelector);
    const setValue = async (value: string) => {
      await filterWrapper.evaluate((elem: any, arg: string) => {
        elem.querySelector('ids-trigger-field').value = arg;
      }, value);
    };
    const openMenu = async () => {
      await filterWrapper.evaluate((elem: any) => {
        elem.querySelector('ids-menu-button').click();
      });
    };
    const clickOnMenuItem = async (value: string) => {
      await filterWrapper.evaluate((elem: any, arg: string) => {
        const item = elem.querySelector('ids-menu-button').menuEl.querySelector(`ids-menu-item[value="${arg}"]`);
        item.click();
      }, value);
    };
    await setValue('12/12/2021');
    await openMenu();
    await clickOnMenuItem('equals');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await setValue('12/11/2021 - 12/13/2021');
    await clickOnMenuItem('in-range');
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
  });

  test('should set filter when typing', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filterWhenTyping)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterWhenTyping = false;
      elem.redraw();
    });
    const nodesHaveClass = (elem: IdsDataGrid) => {
      const nodes = elem.container?.querySelectorAll('.ids-data-grid-header-cell-filter-wrapper');
      return [...(nodes || [])].some((n: any) => n.classList.contains('filter-when-typing'));
    };
    expect(await dataGrid.evaluate(nodesHaveClass)).toBeFalsy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterWhenTyping = true;
      elem.redraw();
    });
    expect(await dataGrid.evaluate(nodesHaveClass)).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const wrapper = elem.filters.filterWrapperById('price');
      const input = wrapper.querySelector('ids-input');
      input?.setAttribute('value', '200.10');
      input?.dispatchEvent(new Event('keydownend'));
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(2);
  });

  test('should get column data by column id or column element', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
      const columnDataById = elem.columnDataById('price');
      const columnDataByHeaderElem = elem.columnDataByHeaderElem(elem.container?.querySelector('[column-id="price"]') as HTMLElement);
      return {
        columnDataById,
        columnDataByHeaderElem
      };
    });
    expect(results.columnDataById.id).toEqual('price');
    expect(results.columnDataById.name).toEqual('Price');
    expect(results.columnDataByHeaderElem.id).toEqual('price');
    expect(results.columnDataByHeaderElem.name).toEqual('Price');
    expect(results.columnDataById).toEqual(results.columnDataByHeaderElem);
  });
});
