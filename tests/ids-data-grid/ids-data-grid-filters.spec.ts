import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';

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
});
