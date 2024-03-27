import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import menuData from '../../src/assets/data/menu-contents.json';

test.describe('IdsDataGrid contextmenu tests', () => {
  const url = '/ids-data-grid/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  // Header contextmenu dataset
  const headerMenuData = {
    id: 'grid-header-menu',
    contents: [{
      id: 'actions-group',
      items: [
        { id: 'actions-split', value: 'actions-split', text: 'Split' },
        { id: 'actions-sort', value: 'actions-sort', text: 'Sort' },
        { id: 'actions-hide', value: 'actions-hide', text: 'Hide' }
      ]
    }],
  };

  const columnGroups = [{
    colspan: 2,
    id: 'group1',
    name: 'Column Group One'
  }];

  test('can set the header menu data setting', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.headerMenuData)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      elem.headerMenuData = arg;
    }, headerMenuData);
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.headerMenuData)).toEqual(headerMenuData);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.headerMenuData = null;
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.headerMenuData)).toBeNull();
  });

  test('can set the menu data setting', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.menuData)).toBeNull();
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      elem.menuData = arg;
    }, menuData);
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.menuData)).toEqual(menuData);
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.menuData = null;
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.menuData)).toBeNull();
  });

  test('should contextmenu thru data', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      elem.menuData = arg.menuData;
      elem.headerMenuData = arg.headerMenuData;
      elem.columnGroups = arg.columnGroups;
      elem.redraw();
    }, { menuData, headerMenuData, columnGroups });
    const selectors = {
      headerGroupCell: 'ids-data-grid .ids-data-grid-column-groups .ids-data-grid-header-cell',
      headerCell: 'ids-data-grid .ids-data-grid-header [role="row"]:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: 'ids-data-grid .ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };
    expect(await page.locator(selectors.headerGroupCell).isVisible()).toBeTruthy();
    expect(await page.locator(selectors.headerCell).isVisible()).toBeTruthy();
    expect(await page.locator(selectors.bodyCell).isVisible()).toBeTruthy();
    const menuIsVisible = async (isHeader?: boolean) => {
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const headerSlot = elem.shadowRoot?.querySelector<any>('slot[name="header-contextmenu"]');
        const bodySlot = elem.shadowRoot?.querySelector<any>('slot[name="contextmenu"]');
        const headerMenu = headerSlot?.assignedElements?.()?.[0];
        const bodyMenu = bodySlot.assignedElements?.()?.[0];
        return { headerMenu: headerMenu.visible, bodyMenu: bodyMenu.visible };
      });

      if (isHeader) return results.headerMenu;

      return results.bodyMenu;
    };
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.headerGroupCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeTruthy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.bodyCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeTruthy();
    await page.locator(selectors.headerGroupCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeTruthy();
    expect(await menuIsVisible()).toBeFalsy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const headerSlot = elem.shadowRoot?.querySelector<any>('slot[name="header-contextmenu"]');
      const headerMenu = headerSlot?.assignedElements?.()?.[0];
      headerMenu.items[0].select();
    });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.bodyCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const bodySlot = elem.shadowRoot?.querySelector<any>('slot[name="contextmenu"]');
      const bodyMenu = bodySlot.assignedElements?.()?.[0];
      bodyMenu.items[0].select();
    });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
  });

  test('should show contextmenu thru a slot', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      elem.insertAdjacentHTML('beforeend', `
        <ids-popup-menu trigger-type="custom" slot="header-contextmenu">
        <ids-menu-group>
          <ids-menu-item value="header-split">Split</ids-menu-item>
          <ids-menu-item value="header-sort">Sort</ids-menu-item>
          <ids-menu-item value="header-hide">Hide</ids-menu-item>
        </ids-menu-group>
        </ids-popup-menu>
        <ids-popup-menu trigger-type="custom" slot="contextmenu">
          <ids-menu-group>
            <ids-menu-item value="item-one">Item One</ids-menu-item>
            <ids-menu-item value="item-two">Item Two</ids-menu-item>
            <ids-menu-item value="item-three">Item Three</ids-menu-item>
            <ids-menu-item value="item-four">Item Four</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      `);
      elem.columnGroups = arg.columnGroups;
      elem.redraw();
    }, { columnGroups });
    const selectors = {
      headerGroupCell: 'ids-data-grid .ids-data-grid-column-groups .ids-data-grid-header-cell',
      headerCell: 'ids-data-grid .ids-data-grid-header [role="row"]:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: 'ids-data-grid .ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };
    expect(await page.locator(selectors.headerGroupCell).isVisible()).toBeTruthy();
    expect(await page.locator(selectors.headerCell).isVisible()).toBeTruthy();
    expect(await page.locator(selectors.bodyCell).isVisible()).toBeTruthy();
    const menuIsVisible = async (isHeader?: boolean) => {
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const headerSlot = elem.shadowRoot?.querySelector<any>('slot[name="header-contextmenu"]');
        const bodySlot = elem.shadowRoot?.querySelector<any>('slot[name="contextmenu"]');
        const headerMenu = headerSlot?.assignedElements?.()?.[0];
        const bodyMenu = bodySlot.assignedElements?.()?.[0];
        return { headerMenu: headerMenu.visible, bodyMenu: bodyMenu.visible };
      });

      if (isHeader) return results.headerMenu;

      return results.bodyMenu;
    };
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.headerGroupCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeTruthy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.bodyCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeTruthy();
    await page.locator(selectors.headerCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeTruthy();
    expect(await menuIsVisible()).toBeFalsy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const headerSlot = elem.shadowRoot?.querySelector<any>('slot[name="header-contextmenu"]');
      const headerMenu = headerSlot?.assignedElements?.()?.[0];
      headerMenu.items[0].select();
    });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.bodyCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      const bodySlot = elem.shadowRoot?.querySelector<any>('slot[name="contextmenu"]');
      const bodyMenu = bodySlot.assignedElements?.()?.[0];
      bodyMenu.items[0].select();
    });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
  });

  test('should show a contextmenu via id', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      elem.insertAdjacentHTML('afterend', `
        <ids-popup-menu id="grid-header-menu" trigger-type="custom">
          <ids-menu-group>
            <ids-menu-item value="header-split">Split</ids-menu-item>
            <ids-menu-item value="header-sort">Sort</ids-menu-item>
            <ids-menu-item value="header-hide">Hide</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
        <ids-popup-menu id="grid-actions-menu" trigger-type="custom">
          <ids-menu-group>
            <ids-menu-item value="item-one">Item One</ids-menu-item>
            <ids-menu-item value="item-two">Item Two</ids-menu-item>
            <ids-menu-item value="item-three">Item Three</ids-menu-item>
            <ids-menu-item value="item-four">Item Four</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      `);
      elem.columnGroups = arg.columnGroups;
      elem.headerMenuId = 'grid-header-menu';
      elem.menuId = 'grid-actions-menu';
      elem.redraw();
    }, { columnGroups });
    const selectors = {
      headerGroupCell: 'ids-data-grid .ids-data-grid-column-groups .ids-data-grid-header-cell',
      headerCell: 'ids-data-grid .ids-data-grid-header [role="row"]:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: 'ids-data-grid .ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };
    expect(await page.locator(selectors.headerGroupCell).isVisible()).toBeTruthy();
    expect(await page.locator(selectors.headerCell).isVisible()).toBeTruthy();
    expect(await page.locator(selectors.bodyCell).isVisible()).toBeTruthy();
    await page.locator(selectors.headerCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await page.locator('#grid-header-menu').first().evaluate((elem: any) => elem.visible)).toBeTruthy();
    expect(await page.locator('#grid-actions-menu').first().evaluate((elem: any) => elem.visible)).toBeFalsy();
    await page.locator(selectors.bodyCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await page.locator('#grid-header-menu').first().evaluate((elem: any) => elem.visible)).toBeFalsy();
    expect(await page.locator('#grid-actions-menu').first().evaluate((elem: any) => elem.visible)).toBeTruthy();
    await page.locator('#grid-actions-menu').first().evaluate((elem: any) => {
      elem.items[0].select();
    });
    expect(await page.locator('#grid-header-menu').first().evaluate((elem: any) => elem.visible)).toBeFalsy();
    expect(await page.locator('#grid-actions-menu').first().evaluate((elem: any) => elem.visible)).toBeFalsy();
  });

  test('should veto before contextmenu show response', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
      elem.menuData = arg.menuData;
      elem.headerMenuData = arg.headerMenuData;
      elem.columnGroups = arg.columnGroups;
      elem.redraw();
    }, { menuData, headerMenuData, columnGroups });
    const selectors = {
      headerGroupCell: 'ids-data-grid .ids-data-grid-column-groups .ids-data-grid-header-cell',
      headerCell: 'ids-data-grid .ids-data-grid-header [role="row"]:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: 'ids-data-grid .ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.addEventListener('beforemenushow', (e: any) => {
        e.detail.response(false);
      });
    });
    const menuIsVisible = async (isHeader?: boolean) => {
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const headerSlot = elem.shadowRoot?.querySelector<any>('slot[name="header-contextmenu"]');
        const bodySlot = elem.shadowRoot?.querySelector<any>('slot[name="contextmenu"]');
        const headerMenu = headerSlot?.assignedElements?.()?.[0];
        const bodyMenu = bodySlot.assignedElements?.()?.[0];
        return { headerMenu: headerMenu.visible, bodyMenu: bodyMenu.visible };
      });

      if (isHeader) return results.headerMenu;

      return results.bodyMenu;
    };
    await page.locator(selectors.headerGroupCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.bodyCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
    await page.locator(selectors.headerCell).dispatchEvent('contextmenu', { bubbles: true });
    expect(await menuIsVisible(true)).toBeFalsy();
    expect(await menuIsVisible()).toBeFalsy();
  });
});
