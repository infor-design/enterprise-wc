import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsPagerInput from '../../src/components/ids-pager/ids-pager-input';

test.describe('IdsDataGrid paging tests', () => {
  test.describe('client-side paging tests', () => {
    const clientPagingUrl = '/ids-data-grid/pagination-client-side.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(clientPagingUrl);
    });

    test('renders pager', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const dataGridEl = await page.locator('ids-data-grid');
      await expect(await dataGridEl.getAttribute('pagination')).toEqual('client-side');

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');
    });

    test('clear data', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="5"] [aria-colindex="1"]')).click();

      const titleText = await page.locator('#title-text');
      await expect(await titleText.textContent()).toEqual('1 Result');

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');

      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');

      const clearBtn = await page.locator('[aria-label="Clear Row"]');
      await clearBtn.click();

      await expect(await titleText.textContent()).toEqual('');

      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="5"] [aria-colindex="3"]').textContent()).toEqual('');

      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();

      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await clearBtn.click();

      await pagerLastBtn.click();
      await expect(await titleText.textContent()).toEqual('');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="3"]').textContent()).toEqual('');
    });

    test('remove data', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="5"] [aria-colindex="1"]')).click();

      const titleText = await page.locator('#title-text');
      await expect(await titleText.textContent()).toEqual('1 Result');

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');

      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');

      const deleteBtn = await page.locator('[aria-label="Delete Row"]');
      await deleteBtn.click();

      await expect(await titleText.textContent()).toEqual('');

      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');

      await expect(await page.locator('ids-data-grid [aria-rowindex="10"] [aria-colindex="2"]').textContent()).toEqual('21');

      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();

      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();

      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();

      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await deleteBtn.click();

      await pagerLastBtn.click();
      await expect(await titleText.textContent()).toEqual('');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('993');
    });

    test('navigates pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');

      // Set number input
      const pagerInputHandle = await page.$('ids-data-grid ids-pager-input');
      await pagerInputHandle?.evaluate((el: IdsPagerInput) => {
        el.setAttribute('page-number', '2');
      });
      await expect(await pagerInputHandle?.getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('3');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('21');

      // Click previous button
      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click first button
      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('1');

      // Click last button
      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('100');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('991');
    });

    test('selects across pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      // Check two items on first page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      // Check two items on second page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      const handle = await page.$('ids-data-grid');
      const selectedRows = await handle?.evaluate((el: IdsDataGrid) => el?.selectedRowsAcrossPages);
      await expect(selectedRows?.length).toEqual(4);
    });

    test('page-size popup-menu has options for: 10, 25, 50, 100', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const pagerDropdown = elem.pager.querySelector<any>('ids-pager-dropdown');
        const popupMenu = pagerDropdown?.popupMenu;
        const select10 = popupMenu.querySelector('ids-menu-item[value="10"]');
        const select25 = popupMenu.querySelector('ids-menu-item[value="25"]');
        const select50 = popupMenu.querySelector('ids-menu-item[value="50"]');
        const select100 = popupMenu.querySelector('ids-menu-item[value="100"]');
        const menuButton = pagerDropdown.menuButton;
        select10.click();
        const menuButtonText = menuButton.textContent;
        select25.click();
        const menuButtonText2 = menuButton.textContent;
        select50.click();
        const menuButtonText3 = menuButton.textContent;
        select100.click();
        const menuButtonText4 = menuButton.textContent;

        return {
          pagerDropdown,
          select10,
          select25,
          select50,
          select100,
          menuButtonText,
          menuButtonText2,
          menuButtonText3,
          menuButtonText4
        };
      });

      expect(results.select10).toBeDefined();
      expect(results.select25).toBeDefined();
      expect(results.select50).toBeDefined();
      expect(results.select100).toBeDefined();
      expect(results.menuButtonText).toContain('10 Records per page');
      expect(results.menuButtonText2).toContain('25 Records per page');
      expect(results.menuButtonText3).toContain('50 Records per page');
      expect(results.menuButtonText4).toContain('100 Records per page');
    });
  });

  test.describe('server-side paging tests', () => {
    const clientPagingUrl = '/ids-data-grid/pagination-server-side.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(clientPagingUrl);
    });

    test('renders pager', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const dataGridEl = await page.locator('ids-data-grid');
      await expect(await dataGridEl.getAttribute('pagination')).toEqual('server-side');

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');
    });

    test('navigates pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      const pagerInputEl = await page.locator('ids-data-grid ids-pager-input');
      await expect(await pagerInputEl?.getAttribute('page-number')).toEqual('1');

      // Set number input
      const pagerInputHandle = await page.$('ids-data-grid ids-pager-input');
      await pagerInputHandle?.evaluate((el: IdsPagerInput) => {
        el.setAttribute('page-number', '2');
      });
      await expect(await pagerInputHandle?.getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('3');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('21');

      // Click previous button
      const pagerPrevBtn = await page.locator('ids-pager-button[previous]');
      await pagerPrevBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('2');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('11');

      // Click first button
      const pagerFirstBtn = await page.locator('ids-pager-button[first]');
      await pagerFirstBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('1');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('1');

      // Click last button
      const pagerLastBtn = await page.locator('ids-pager-button[last]');
      await pagerLastBtn.click();
      await expect(await page.locator('ids-data-grid ids-pager-input').getAttribute('page-number')).toEqual('100');
      await expect(await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="2"]').textContent()).toEqual('991');
    });

    test('selects across pages', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      // Check two items on first page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      // Click next button
      const pagerNextBtn = await page.locator('ids-pager-button[next]');
      await pagerNextBtn.click();

      // Check two items on second page
      await (await page.locator('ids-data-grid [aria-rowindex="1"] [aria-colindex="1"]')).click();
      await (await page.locator('ids-data-grid [aria-rowindex="3"] [aria-colindex="1"]')).click();

      const handle = await page.$('ids-data-grid');
      const selectedRows = await handle?.evaluate((el: IdsDataGrid) => el?.selectedRowsAcrossPages);
      await expect(selectedRows?.length).toEqual(4);
    });
  });

  test.describe('functionality tests', () => {
    const url = '/ids-data-grid/example.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test('should show/hide pager on pagination attr change', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      expect(await dataGrid.getAttribute('pagination')).toBeNull();
      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'client-side';
        elem.pageSize = 5;
        elem.pager = elem.pager;
        elem.redraw();
      });
      expect(await dataGrid.getAttribute('pagination')).toEqual('client-side');
      const rows = await dataGrid.evaluate((elem: IdsDataGrid) => elem.container?.querySelectorAll('.ids-data-grid-body ids-data-grid-row').length);
      expect(rows).toEqual(5);
      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'none';
        elem.redraw();
      });
      expect(await dataGrid.getAttribute('pagination')).toEqual('none');
    });

    test('shows pager when pagination attribute is "standalone"', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'standalone';
        elem.pageSize = 5;
        elem.pager = elem.pager;
        elem.redraw();
      });
      expect(await dataGrid.getAttribute('pagination')).toEqual('standalone');
      const rows = await dataGrid.evaluate((elem: IdsDataGrid) => elem.container?.querySelectorAll('.ids-data-grid-body ids-data-grid-row').length);
      expect(rows).toEqual(5);
    });

    test('has pageTotal, pageSize, pageNumber, pageCount parameters', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'client-side';
        elem.pageSize = 5;
        elem.pager = elem.pager;
        elem.redraw();
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageTotal)).toEqual(9);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageSize)).toEqual(5);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(1);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pager.pageCount)).toEqual(2);
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.pageNumber = 2;
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(2);
    });

    test.skip('always shows correct page number in pager input field', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'client-side';
        elem.pageSize = 5;
        elem.pager = elem.pager;
        elem.redraw();
        elem.pageNumber = 2;
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pager?.querySelector<any>('ids-pager-input')?.input?.value)).toBe('2');
    });

    test('should paginate pages', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'client-side';
        elem.pageSize = 2;
        elem.pager = elem.pager;
        elem.redraw();
      });
      const paginate = async (type: string) => {
        await page.locator('ids-data-grid').evaluate((elem: IdsDataGrid, typeArg: string) => {
          const { buttons } = elem.pager.elements;
          if (typeArg === 'next') {
            buttons.next.button.click();
          } else if (typeArg === 'last') {
            buttons.last.button.click();
          } else if (typeArg === 'previous') {
            buttons.previous.button.click();
          } else if (typeArg === 'first') {
            buttons.first.button.click();
          }
        }, type);
      };

      await paginate('next');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(2);
      await paginate('next');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(3);

      await paginate('last');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(5);

      await paginate('previous');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(4);
      await paginate('previous');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(3);

      await paginate('first');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.pageNumber)).toEqual(1);
    });

    test('only fires pager events when pagination is "standalone"', async ({ page }) => {
      await page.goto('/ids-data-grid/pagination-standalone.html');
      const dataGrid = await page.locator('ids-data-grid');
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.pageSize = 2;
        elem.pageNumber = 1;
        let pageNumber = 1;
        elem.pager.addEventListener('pagenumberchange', (e: Event) => {
          pageNumber = (<CustomEvent>e).detail.value;
        });
        const { buttons } = elem.pager.elements;
        buttons.next.button.click();
        const nextPageNumber = pageNumber;
        buttons.previous.button.click();
        const prevPageNumber = pageNumber;

        return {
          nextPageNumber,
          prevPageNumber
        };
      });

      expect(results.nextPageNumber).toEqual(2);
      expect(results.prevPageNumber).toEqual(1);
    });

    test('shows page-size popup-menu in the end-slot', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.pagination = 'client-side';
        elem.pageSize = 2;
        elem.pager = elem.pager;
        elem.redraw();
      });
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const { slots } = elem.pager.elements;
        const endSlotNodes = slots.end.assignedNodes();
        return {
          startSlot: slots.start,
          middleSlot: slots.middle,
          endSlot: slots.end,
          menuButton: endSlotNodes[0].querySelector('ids-menu-button'),
          popupMenu: endSlotNodes[0].querySelector('ids-popup-menu')
        };
      });

      expect(results.startSlot).toBeDefined();
      expect(results.middleSlot).toBeDefined();
      expect(results.endSlot).toBeDefined();
      expect(results.menuButton).toBeDefined();
      expect(results.popupMenu).toBeDefined();
    });
  });
});
