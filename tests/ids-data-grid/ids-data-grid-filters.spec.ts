import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import dataset from '../../src/assets/data/books.json';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import { IdsDataGridColumn } from '../../src/components/ids-data-grid/ids-data-grid-column';

test.describe('IdsDataGrid filter tests', () => {
  const url = '/ids-data-grid/filter-trigger-fields.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('event tests', () => {
    test('fires filtered event when apply or clear conditions', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const selector = '.ids-data-grid-body .ids-data-grid-row';
      const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
      expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        (window as any).filteredCount = 0;
        (window as any).filteredType = '';
        elem.addEventListener('filtered', (e: any) => {
          (window as any).filteredCount++;
          (window as any).filteredType = e.detail.type;
        });
        elem.applyFilter([{ columnId: 'integer', operator: 'equals', value: '200' }]);
      });
      expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(2);
      expect(await page.evaluate(() => (window as any).filteredCount)).toBe(1);
      expect(await page.evaluate(() => (window as any).filteredType)).toBe('apply');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.applyFilter([]);
      });
      expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
      expect(await page.evaluate(() => (window as any).filteredCount)).toBe(2);
      expect(await page.evaluate(() => (window as any).filteredType)).toBe('clear');

      // should not fire filtered event when setting filter conditions
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.filters.setFilterConditions([{
          columnId: 'integer',
          operator: 'equals',
          value: '200'
        }]);
      });
      expect(await page.evaluate(() => (window as any).filteredCount)).toBe(2);
    });

    test('fires open/close filter row event', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        (window as any).filterrowopenedCount = 0;
        (window as any).filterrowclosedCount = 0;
        elem.addEventListener('filterrowopened', () => {
          (window as any).filterrowopenedCount++;
        });
        elem.addEventListener('filterrowclosed', () => {
          (window as any).filterrowclosedCount++;
        });
        elem.filterable = false;
      });
      expect(await page.evaluate(() => (window as any).filterrowopenedCount)).toBe(0);
      expect(await page.evaluate(() => (window as any).filterrowclosedCount)).toBe(1);
      expect(await dataGrid.getAttribute('filterable')).toBe('false');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filterable)).toBeFalsy();

      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.filterable = true;
      });
      expect(await page.evaluate(() => (window as any).filterrowopenedCount)).toBe(1);
      expect(await page.evaluate(() => (window as any).filterrowclosedCount)).toBe(1);
      expect(await dataGrid.getAttribute('filterable')).toBe('true');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filterable)).toBeTruthy();
    });

    test('fires filtered event when disableClientFilter with empty values', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        (window as any).filteredCount = 0;
        elem.addEventListener('filtered', () => {
          (window as any).filteredCount++;
        });
        elem.disableClientFilter = true;
        elem.filters.filterWrapperById('price').querySelector('ids-input').setAttribute('value', '');
        elem.applyFilter([]);
      });
      expect(await page.evaluate(() => (window as any).filteredCount)).toBeGreaterThan(0);
    });

    test('fires filtered event one time when dayselected event on datepicker', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        (window as any).filteredCount = 0;
        elem.addEventListener('filtered', () => {
          (window as any).filteredCount++;
        });
        elem.disableClientFilter = true;
        const event = new CustomEvent('dayselected', {
          bubbles: true,
          detail: { value: '6/4/2024' },
        });
        elem.filters
          .filterWrapperById('publishDate')
          .querySelector('ids-trigger-field')
          .dispatchEvent(event);
      });

      expect(await page.evaluate(() => (window as any).filteredCount)).toBe(1);
    });

    test('fires filtered event one time when timeselected event on timepicker', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        (window as any).filteredCount = 0;
        elem.addEventListener('filtered', () => {
          (window as any).filteredCount++;
        });
        elem.disableClientFilter = true;
        const event = new CustomEvent('timeselected', {
          bubbles: true,
          detail: { value: '6:15 PM' },
        });
        elem.filters
          .filterWrapperById('publishTime')
          .querySelector('ids-trigger-field')
          .dispatchEvent(event);
      });

      expect(await page.evaluate(() => (window as any).filteredCount)).toBe(1);
    });
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

  test('should filter rows as filter type integer', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'integer', operator: 'equals', value: '16' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should filter rows as filter type decimal', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'price', operator: 'equals', value: '15.99' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should filter rows as filter type contents', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'location', operator: 'equals', value: 'United States' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(4);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'location', operator: 'equals', value: '' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(2);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'location', operator: 'equals', value: 'not-filtered' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should filter rows as filter type dropdown', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'useForEmployee', operator: 'equals', value: 'Yes' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(3);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'useForEmployee', operator: 'equals', value: 'not-filtered' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filters.filterWrapperById('useForEmployee')?.querySelector('ids-dropdown')?.setAttribute('value', 'No');
      elem.applyFilter(elem.filters.filterConditions());
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(6);
  });

  test('should filter rows as filter type checkbox', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'active', operator: 'selected', value: '' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(8);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'active', operator: 'not-selected', value: '' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'active', operator: 'selected-notselected', value: 'Yes' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should filter rows as filter type text', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns.push();
      elem.columns.push({
        id: 'description',
        name: 'Description',
        field: 'description',
        sortable: true,
        formatter: elem.formatters.text,
        filterType: elem.filters.text
      });
      elem.redraw();
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test.skip('should filter rows as filter type date', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'publishDate', operator: 'equals', value: '2/23/2021' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'publishDate', operator: 'in-range', value: '2/23/2021' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'publishDate', operator: 'in-range', value: '12/10/2021 - 12/25/2021' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(2);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test.skip('should filter rows as filter type time', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'publishTime', operator: 'equals', value: '8:25 PM' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(6);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should filter rows as filter other operators', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns.push();
      elem.columns.push({
        id: 'description',
        name: 'Description',
        field: 'description',
        sortable: true,
        formatter: elem.formatters.text,
        filterType: elem.filters.text
      });
      elem.redraw();
    });
    const checkFilter = async (filter: any, rowsCount: number) => {
      await dataGrid.evaluate((elem: IdsDataGrid, arg: any) => {
        elem.applyFilter(arg);
      }, filter);
      expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(rowsCount);
    };
    await checkFilter([{ columnId: 'description', operator: 'does-not-equal', value: '105' }], 8);
    await checkFilter([{ columnId: 'description', operator: 'contains', value: '5' }], 1);
    await checkFilter([{ columnId: 'description', operator: 'does-not-contain', value: '5' }], 8);
    await checkFilter([{ columnId: 'description', operator: 'end-with', value: '5' }], 1);
    await checkFilter([{ columnId: 'description', operator: 'does-not-end-with', value: '5' }], 8);
    await checkFilter([{ columnId: 'description', operator: 'start-with', value: '105' }], 1);
    await checkFilter([{ columnId: 'description', operator: 'does-not-start-with', value: '105' }], 8);
    await checkFilter([{ columnId: 'price', operator: 'is-empty', value: '' }], 2);
    // await checkFilter([{ columnId: 'price', operator: 'is-not-empty', value: '' }], 7);
    await checkFilter([{ columnId: 'integer', operator: 'less-than', value: '14' }], 3);
    await checkFilter([{ columnId: 'integer', operator: 'less-equals', value: '14' }], 4);
    await checkFilter([{ columnId: 'integer', operator: 'greater-than', value: '14' }], 3);
    await checkFilter([{ columnId: 'integer', operator: 'greater-equals', value: '14' }], 4);
    await checkFilter([{ columnId: 'integer', operator: 'test', value: '14' }], 9);
    await checkFilter([{ columnId: 'test', operator: 'test', value: 'test' }], 9);
    await checkFilter([], 9);
    await checkFilter([{ columnId: 'test', operator: 'in-range', value: 'test' }], 9);
  });

  test('should keep filter with redraw', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'integer', operator: 'equals', value: '16' }]);
      elem.redraw();
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
      elem.redraw();
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should not filter empty element', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filters.filterWrapperById('integer').innerHTML = '';
      elem.filters.filterConditions();
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should not apply filter without column filter type', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columnDataById('integer').filterType = null;
      elem.applyFilter([{ columnId: 'integer', operator: 'equals', value: '14' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should not filter without filterable setting', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.filterable = false;
      elem.applyFilter([{ columnId: 'integer', operator: 'equals', value: '14' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });

  test('should render columns with filter options', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      const cols = [];
      cols.push({
        id: 'description',
        name: 'Description',
        field: 'description',
        sortable: true,
        formatter: elem.formatters.text,
        filterType: elem.filters.text,
        filterOptions: {
          disabled: true,
          label: 'test text',
          placeholder: 'placeholder test text',
          type: 'text',
          size: 'full'
        }
      });
      cols.push({
        id: 'ledger',
        name: 'Ledger',
        field: 'ledger',
        formatter: elem.formatters.text,
        filterType: elem.filters.text,
        filterOptions: { readonly: true }
      });
      cols.push({
        id: 'publishDate',
        name: 'Pub. Date',
        field: 'publishDate',
        formatter: elem.formatters.date,
        filterType: elem.filters.date,
        filterOptions: {
          disabled: true,
          readonly: true,
          label: 'test date',
          format: 'yyyy-MM-dd',
          placeholder: 'placeholder test date',
          showToday: true,
          firstDayOfWeek: '1'
        }
      });
      cols.push({
        id: 'publishTime',
        name: 'Pub. Time',
        field: 'publishDate',
        formatter: elem.formatters.time,
        filterType: elem.filters.time,
        filterOptions: {
          disabled: true,
          readonly: true,
          label: 'test time',
          format: 'hh:mm:ss a',
          placeholder: 'placeholder test time',
          minuteInterval: '5',
          secondInterval: '10',
          autoselect: true,
          autoupdate: true,
        }
      });
      cols.push({
        id: 'inStock',
        name: 'In Stock',
        field: 'inStock',
        formatter: elem.formatters.text,
        filterType: elem.filters.checkbox,
        filterConditions: []
      });
      cols.push({
        id: 'trackDeprecationHistory',
        name: 'Track Deprecation History',
        field: 'trackDeprecationHistory',
        formatter: elem.formatters.text,
        filterType: elem.filters.dropdown
      });
      cols.push({
        id: 'useForEmployee',
        name: 'Use For Employee',
        field: 'useForEmployee',
        formatter: elem.formatters.text,
        filterType: elem.filters.dropdown,
        filterConditions: []
      });
      cols.push({
        id: 'integer',
        name: 'Price (Int)',
        field: 'price',
        formatter: elem.formatters.integer,
        formatOptions: { locale: 'en-US' } // Data Values are in en-US
      });

      elem.columns = cols as IdsDataGridColumn[];
      elem.data = arg;
      elem.redraw();
    }, dataset);
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'inStock', operator: 'selected', value: '' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(4);
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filters.filterWrapperById('description').querySelector('ids-input').getAttribute('placeholder'))).toBe('placeholder test text');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filters.filterWrapperById('description').querySelector('ids-input').hasAttribute('disabled'))).toBeTruthy();
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.filters.filterWrapperById('ledger').querySelector('ids-input').hasAttribute('readonly'))).toBeTruthy();
  });

  test('should render filters with slot', async ({ page }) => {
    await page.goto('/ids-data-grid/example.html');
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.insertAdjacentHTML('beforeend', `<div slot="filter-active" column-id="active">
        <ids-dropdown label="Slotted dropdown" id="slotted-dropdown" value="not-filtered">
          <ids-list-box>
            <ids-list-box-option id="slotted-dropdown-opt-0" value="not-filtered"></ids-list-box-option>
            <ids-list-box-option id="slotted-dropdown-opt-1" value="Yes">Yes</ids-list-box-option>
            <ids-list-box-option id="slotted-dropdown-opt-2" value="No">No</ids-list-box-option>
          </ids-list-box>
        </ids-dropdown>
      </div>
      <div slot="filter-publishDate" column-id="publishDate">
        <ids-date-picker label="Slotted date picker" id="slotted-date-picker">
        </ids-date-picker>
      </div>
      <div slot="filter-publishTime" column-id="publishTime">
        <ids-time-picker label="Slotted time picker" id="slotted-time-picker">
        </ids-time-picker>
      </div>`);
      elem.redraw();
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
      const activeFilter = elem.filters.filterWrapperById('active').querySelector('slot[name^="filter-"]');
      const publishDateFilter = elem.filters.filterWrapperById('publishDate').querySelector('slot[name^="filter-"]');
      const publishTimeFilter = elem.filters.filterWrapperById('publishTime').querySelector('slot[name^="filter-"]');
      return {
        activeFilter,
        publishDateFilter,
        publishTimeFilter
      };
    });
    expect(results.activeFilter).toBeDefined();
    expect(results.publishDateFilter).toBeDefined();
    expect(results.publishTimeFilter).toBeDefined();
  });

  test('should render filter with slot no operator', async ({ page }) => {
    await page.goto('/ids-data-grid/example.html');
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.insertAdjacentHTML('beforeend', `<div slot="filter-description" column-id="description">
      <ids-input id="input-description" type="text" label="Slotted"></ids-input>
      </div>`);
      elem.filterable = true;
      elem.columnDataById('description').filterType = elem.filters.text;
      elem.redraw();
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const wrapper = elem.filters.filterWrapperById('description');
      const slot = wrapper.querySelector('slot[name^="filter-"]');
      const input = slot.assignedElements()[0].querySelector('ids-input');
      input.value = '105';
      input.dispatchEvent(new Event('keydownend'));
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
  });

  test('should use custom filter', async ({ page }) => {
    await page.goto('/ids-data-grid/example.html');
    const dataGrid = await page.locator('ids-data-grid');
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const getRowsCount = (elem: IdsDataGrid, arg: string) => elem.container?.querySelectorAll(arg).length;
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const customFilter = (opt: any) => {
        const { operator, columnId, value } = opt.condition;
        const val = {
          condition: Number.parseFloat(value),
          data: Number.parseFloat(opt.data[columnId])
        };
        let isMatch = false;
        if (Number.isNaN(val.condition) || Number.isNaN(val.data)) return isMatch;

        if (operator === 'equals') isMatch = (val.data === val.condition);
        if (operator === 'greater-than') isMatch = (val.data > val.condition);
        if (operator === 'greater-equals') isMatch = (val.data >= val.condition);
        if (operator === 'less-than') isMatch = (val.data < val.condition);
        if (operator === 'less-equals') isMatch = (val.data <= val.condition);

        return isMatch;
      };
      elem.insertAdjacentHTML('beforeend', `
        <div slot="filter-price" column-id="price">
          <ids-menu-button id="btn-filter-price" icon="filter-greater-equals" menu="menu-filter-price" dropdown-icon>
            <span class="audible">Greater Than Or Equals</span>
          </ids-menu-button>
          <ids-popup-menu id="menu-filter-price" target="#btn-filter-price">
            <ids-menu-group select="single">
              <ids-menu-item value="equals" icon="filter-equals">Equals</ids-menu-item>
              <ids-menu-item value="greater-than" icon="filter-greater-than">Greater Than</ids-menu-item>
              <ids-menu-item value="greater-equals" icon="filter-greater-equals" selected="true">Greater Than Or Equals</ids-menu-item>
              <ids-menu-item value="less-than" icon="filter-less-than">Less Than</ids-menu-item>
              <ids-menu-item value="less-equals" icon="filter-less-equals">Less Than Or Equals</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
          <ids-input id="input-filter-price" type="text" size="full" placeholder="Slotted price" label="Slotted price input">
          </ids-input>
        </div>
      `);
      elem.filterable = true;
      elem.redraw();
      elem.columnDataById('price').filterFunction = customFilter;
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([{ columnId: 'price', operator: 'equals', value: '13.99' }]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(1);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.applyFilter([]);
    });
    expect(await dataGrid.evaluate(getRowsCount, selector)).toBe(9);
  });
});
