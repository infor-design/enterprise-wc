import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsBlockGrid from '../../src/components/ids-block-grid/ids-block-grid';
import IdsBlockgridItem from '../../src/components/ids-block-grid/ids-block-grid-item';

test.describe('IdsBlockGrid tests', () => {
  const url = '/ids-block-grid/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Block Grid Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-block-grid');
      const html = await handle?.evaluate((el: IdsBlockGrid) => el?.outerHTML);
      await expect(html).toMatchSnapshot('block-grid-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-block-grid');
      const html = await handle?.evaluate((el: IdsBlockGrid) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('block-grid-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-block-grid-light');
    });
  });

  test.describe('idsBlockGrid functional tests', () => {
    let idsBlockGrid: Locator;

    test.beforeEach(async ({ page }) => {
      idsBlockGrid = await page.locator('ids-block-grid').first();
    });

    test('can set and get alignment', async () => {
      await expect(idsBlockGrid).toHaveAttribute('align', 'center');
      await expect(idsBlockGrid).toHaveAttribute('style', 'text-align: center;');

      // null
      let align: string | null = await idsBlockGrid.evaluate((element: IdsBlockGrid) => {
        element.align = null;
        return element.align;
      });
      expect(align).toEqual(null);
      await expect(idsBlockGrid).not.toHaveAttribute('align', 'center');
      await expect(idsBlockGrid).not.toHaveAttribute('style', 'text-align: center;');

      // center
      align = await idsBlockGrid.evaluate((element: IdsBlockGrid) => {
        element.align = 'center';
        return element.align;
      });
      expect(align).toEqual('center');
      await expect(idsBlockGrid).toHaveAttribute('align', 'center');
      await expect(idsBlockGrid).toHaveAttribute('style', 'text-align: center;');
    });

    test('can get component attributes', async () => {
      expect(await idsBlockGrid.evaluate((element: IdsBlockGrid) => element.attributes)).not.toBeNull();
    });

    // redraw removes grid items then adds them again - ensures the count is still the same
    test('can redraw grid items', async () => {
      const prevCount = (await idsBlockGrid.locator('ids-block-grid-item').all()).length;
      await idsBlockGrid.evaluate((element: IdsBlockGrid) => element.redraw);
      expect((await idsBlockGrid.locator('ids-block-grid-item').all()).length).toEqual(prevCount);
    });

    test('can create and retrieve data (IdsBlockGridItem)', async () => {
      const data = [
        {
          id: 1,
          url: '../../../assets/images/placeholder-200x200.png',
          name: 'Sheena Taylor1',
          title: 'Infor, Developer'
        },
        {
          id: 2,
          url: '../../../assets/images/placeholder-200x200.png',
          name: 'Sheena Taylor2',
          title: 'Infor, Developer'
        },
        {
          id: 3,
          url: '../../../assets/images/placeholder-200x200.png',
          name: 'Sheena Taylor3',
          title: 'Infor, Developer'
        }];
      let afterData = await idsBlockGrid.evaluate((element: IdsBlockGrid, tData) => {
        element.data = tData;
        return element.data;
      }, data);
      expect((await idsBlockGrid.locator('ids-block-grid-item').all()).length).toEqual(data.length);
      expect(data).toEqual(afterData);

      // can set null to data
      await expect(idsBlockGrid.locator('ids-page')).not.toBeAttached();
      afterData = await idsBlockGrid.evaluate((element: IdsBlockGrid) => {
        element.data = null;
        // doesn't remove the data on the page, but returns []
        element.redraw();
        return element.data;
      });
      expect(afterData).toEqual([]);
      await expect(idsBlockGrid.locator('ids-page')).not.toBeAttached();
    });

    // seems to be a bug where the attribute values are updated to 'null'
    test('can set selection to all elements under', async () => {
      for (const idsBlockGridItem of await idsBlockGrid.locator('ids-block-grid-item').all()) {
        // only checking if has selection attribute
        await expect(idsBlockGridItem).not.toHaveAttribute('selection');
      }
      await idsBlockGrid.evaluate((element: IdsBlockGrid) => { element.selection = 'single'; });
      for (const idsBlockGridItem of await idsBlockGrid.locator('ids-block-grid-item').all()) {
        // only checking if has selection attribute
        await expect(idsBlockGridItem).toHaveAttribute('selection');
      }
    });
  });

  test.describe('IdsBlockGridItem functional test', () => {
    let idsBlockGridItem: Locator;
    let anotherIdsBlockGridItem: Locator;
    let checkBox: Locator;
    let anotherCheckBox: Locator;

    test.beforeEach(async ({ page }) => {
      idsBlockGridItem = await page.locator('ids-block-grid-item').first();
      anotherIdsBlockGridItem = (await page.locator('ids-block-grid-item').all())[1];
      checkBox = await idsBlockGridItem.locator('ids-checkbox');
      anotherCheckBox = await anotherIdsBlockGridItem.locator('ids-checkbox');
    });

    test('can set/get selection', async () => {
      const container = await idsBlockGridItem.locator('div').first();
      const selections = ['single', 'multiple', 'mixed', 'invalid'];
      await expect(idsBlockGridItem).not.toHaveAttribute('selection');
      for (const selection of selections) {
        const selValue = await idsBlockGridItem.evaluate((element: IdsBlockgridItem, select) => {
          element.selection = select;
          return element.selection;
        }, selection);
        expect(selection).toEqual(selValue);
        if (selection !== 'invalid') {
          await expect(idsBlockGridItem).toHaveAttribute('selection', selection);
          await expect(container).toHaveClass(/is-selectable/);
        } else {
          await expect(idsBlockGridItem).toHaveAttribute('selection');
          await expect(container).not.toHaveClass(/is-selectable/);
        }
      }
    });

    test('can render multiple selection', async () => {
      await expect(checkBox).not.toHaveAttribute('checked');
      await expect(anotherCheckBox).not.toHaveAttribute('checked');
      await expect(idsBlockGridItem).not.toHaveAttribute('selection', 'multiple');
      await expect(idsBlockGridItem).not.toHaveAttribute('selected', 'true');
      await expect(anotherIdsBlockGridItem).not.toHaveAttribute('selection', 'multiple');
      await expect(anotherIdsBlockGridItem).not.toHaveAttribute('selected', 'true');

      await idsBlockGridItem.evaluate((element: IdsBlockgridItem) => { element.selection = 'multiple'; });
      await expect(idsBlockGridItem).toHaveAttribute('selection', 'multiple');

      await anotherIdsBlockGridItem.evaluate((element: IdsBlockgridItem) => { element.selection = 'multiple'; });
      await expect(anotherIdsBlockGridItem).toHaveAttribute('selection', 'multiple');

      await idsBlockGridItem.click();
      await expect(idsBlockGridItem).toHaveAttribute('selected', 'true');
      await expect(checkBox).toHaveAttribute('checked', 'true');
      await expect(anotherCheckBox).not.toHaveAttribute('checked');

      await anotherIdsBlockGridItem.click();
      await expect(anotherIdsBlockGridItem).toHaveAttribute('selected', 'true');
      await expect(checkBox).toHaveAttribute('checked', 'true');
      await expect(anotherCheckBox).toHaveAttribute('checked', 'true');
    });

    test('can support grid selection by keyboard keys', async () => {
      await idsBlockGridItem.evaluate((element: IdsBlockgridItem) => {
        element.selection = 'multiple';
        // focusing on the element makes it already the document.activeElement
        // which defeats the purpose of using keyboard keys
        // element.container?.focus();
      });
      // this will be failing if the tab ordering changed in the future
      await idsBlockGridItem.press('Tab');
      await idsBlockGridItem.press('Tab');
      await idsBlockGridItem.press('Tab');
      await expect(idsBlockGridItem).toBeFocused();

      await expect(checkBox).not.toHaveAttribute('checked', 'true');
      await expect(anotherCheckBox).not.toHaveAttribute('checked', 'true');
      await anotherIdsBlockGridItem.evaluate((element: IdsBlockgridItem) => {
        element.selection = 'multiple';
        element.container?.focus();
      });
      await anotherIdsBlockGridItem.press('Space');
      await expect(anotherCheckBox).toHaveAttribute('checked', 'true');
      await expect(checkBox).not.toHaveAttribute('checked', 'true');
    });

    test('can render mixed selection', async () => {
      await expect(idsBlockGridItem).not.toHaveAttribute('selection');
      await expect(idsBlockGridItem).not.toHaveAttribute('preselected');
      await expect(idsBlockGridItem).not.toHaveAttribute('selected');
      await expect(checkBox).not.toHaveAttribute('checked');

      await idsBlockGridItem.evaluate((element: IdsBlockgridItem) => { element.selection = 'mixed'; });
      await expect(idsBlockGridItem).toHaveAttribute('selection', 'mixed');

      await idsBlockGridItem.click();
      await expect(idsBlockGridItem).toHaveAttribute('preselected', 'true');
      await expect(idsBlockGridItem).toHaveAttribute('selection', 'mixed');
      await expect(idsBlockGridItem).not.toHaveAttribute('selected');
      await expect(checkBox).not.toHaveAttribute('checked');

      await checkBox.click();
      await expect(idsBlockGridItem).toHaveAttribute('preselected', 'true');
      await expect(idsBlockGridItem).toHaveAttribute('selection', 'mixed');
      await expect(idsBlockGridItem).toHaveAttribute('selected', 'true');
      await expect(checkBox).toHaveAttribute('checked', 'true');
    });

    test('can trigger selectionchanged event', async () => {
      const isEventTriggered = await idsBlockGridItem.evaluate((element: IdsBlockgridItem) => {
        let flag = false;
        element.selection = 'multiple';
        element.addEventListener('selectionchanged', () => { flag = true; });
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return flag;
      });
      expect(isEventTriggered).toBeTruthy();
    });
  });
});
