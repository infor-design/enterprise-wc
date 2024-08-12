import percySnapshot from '@percy/playwright';
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsListView from '../../src/components/ids-list-view/ids-list-view';

import IdsVirtualScroll from '../../src/components/ids-virtual-scroll/ids-virtual-scroll';
import dataset from '../../src/assets/data/products-100.json';
import datasetProducts from '../../src/assets/data/products.json';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

test.describe('IdsListView tests', () => {
  // Default settings
  const LIST_VIEW_DEFAULTS = {
    hideCheckboxes: false, // Only apply to selectable multiple
    height: '100%',
    label: 'Ids list view',
    selectableOptions: ['single', 'multiple', 'mixed'],
    sortable: false,
    suppressDeactivation: false, // Use with Mixed selection only
    suppressDeselection: false, // Use with Single selection only
    virtualScroll: false
  };
  const url = '/ids-list-view/example.html';
  let idsListView: any;
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    idsListView = await page.locator('ids-list-view').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS List View Component');
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
      const handle = await page.$('ids-list-view');
      const html = await handle?.evaluate((el: IdsListView) => el?.outerHTML);
      await expect(html).toMatchSnapshot('list-view-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-list-view');
      const html = await handle?.evaluate((el: IdsListView) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('list-view-shadow');
    });

    test('should match the visual snapshot in percy (for group headers)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-list-view-group-headers');
    });
  });

  test.describe('event tests', () => {
    test.skip('should fire click event on single selection', async ({ page }) => {
      await page.goto('/ids-list-view/selectable-single.html');
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const comp = document.querySelector<IdsListView>('ids-list-view');
        comp?.addEventListener('click', () => { calls++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item[row-index="2"]');
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire selected event on single selection', async ({ page }) => {
      await page.goto('/ids-list-view/selectable-single.html');
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const comp = document.querySelector<IdsListView>('ids-list-view');
        comp?.addEventListener('selected', () => { calls++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item[row-index="2"]');
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire click event on multiple selection', async ({ page }) => {
      await page.goto('/ids-list-view/selectable-multiple.html');
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const comp = document.querySelector<IdsListView>('ids-list-view');
        comp?.addEventListener('click', () => { calls++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item[row-index="2"]');
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire selected/deselected event on multiple select', async ({ page }) => {
      await page.goto('/ids-list-view/selectable-multiple.html');
      const noOfCalls = await page.evaluate(() => {
        const calls = [0, 0];
        const comp = document.querySelector<IdsListView>('ids-list-view');
        comp?.addEventListener('selected', () => { calls[0]++; });
        comp?.addEventListener('deselected', () => { calls[1]++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item[row-index="2"]');
        item?.dispatchEvent(event);
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls[0]).toBe(1);
      expect(await noOfCalls[1]).toBe(1);
    });

    test('should fire click event on mixed selection', async ({ page }) => {
      await page.goto('/ids-list-view/selectable-mixed.html');
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const comp = document.querySelector<IdsListView>('ids-list-view');
        comp?.addEventListener('click', () => { calls++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item[row-index="2"]');
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire activated/deactivated event on mixed selection', async ({ page }) => {
      await page.goto('/ids-list-view/selectable-mixed.html');
      const noOfCalls = await page.evaluate(() => {
        const calls = [0, 0];
        const comp = document.querySelector<IdsListView>('ids-list-view');
        comp?.addEventListener('activated', () => { calls[0]++; });
        comp?.addEventListener('deactivated', () => { calls[1]++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item[row-index="2"]');
        item?.dispatchEvent(event);
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls[0]).toBe(1);
      expect(await noOfCalls[1]).toBe(1);
    });

    test('should fire selected event on a list view item', async ({ page }) => {
      await page.goto('/ids-list-view/list-view-items.html');
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const comp = document.querySelector<IdsListView>('ids-list-view-item');
        comp?.addEventListener('selected', () => { calls++; });

        const event = new MouseEvent('click', { bubbles: true });
        const item = document.querySelector<IdsListView>('ids-list-view-item');
        item?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });
  });

  test.describe('functionality tests', () => {
    const caseSensitiveData = [
      { id: '1', subject: 'CALIFORNIA' },
      { id: '2', subject: 'california' },
      { id: '3', subject: 'CaLiFoRnIa' },
      { id: '4', subject: 'PENNSYLVANIA' },
      { id: '5', subject: 'pennsylvania' },
      { id: '6', subject: 'PennSylvaNia' }
    ];

    const phraseData = [
      { id: '1', subject: 'I eat chicken' },
      { id: '2', subject: 'You beef' },
      { id: '3', subject: 'He will eat fish' },
      { id: '4', subject: 'Some eat tofu' },
      { id: '5', subject: 'Eat all the things' }
    ];

    const keywordData = [
      { id: '1', subject: 'grape apple kiwi' },
      { id: '2', subject: 'orange strawberry banana' },
      { id: '3', subject: 'blueberry apricot' },
      { id: '4', subject: 'pear banana raspberry' },
      { id: '5', subject: 'apple blackberry starfruit' },
      { id: '6', subject: 'kiwi orange apple' },
      { id: '7', subject: 'blackberry raspberry blueberry' }
    ];

    test.skip('renders the template without virtual scroll', async () => {
      await idsListView.evaluate((listview: IdsListView, dataSet: any) => { listview.data = dataSet; }, dataset);
      const lvData = await idsListView.evaluate((listview: IdsListView) => listview.data.length);
      const lvItem = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      expect(await lvData).toEqual(lvItem);
    });

    test.skip('renders the template with virtual scroll', async ({ page }) => {
      // FIXME  Expected: undefined Received: 1000
      await page.evaluate((datasetproducts) => {
        const listView = document.createElement('ids-list-view') as IdsListView;
        document.body.innerHTML = '';
        listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line

        document.body.appendChild(listView);
        listView.data = datasetproducts;
      }, datasetProducts);
      const vsItems = await idsListView.evaluate((listview: IdsListView) => listview.shadowRoot?.querySelector<IdsVirtualScroll>('ids-virtual-scroll')?.visibleItemCount());
      const lvItem = await idsListView.evaluate((listview: IdsListView) => listview.items.length);

      expect(await lvItem).toEqual(await vsItems);
    });

    test('renders without errors with no template', async ({ page }) => {
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.evaluate((dateSet) => {
        const listView = document.createElement('ids-list-view') as IdsListView;
        document.body.innerHTML = '';
        document.body.appendChild(listView);
        listView.data = dateSet;
      }, dataset);
      const lvItems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvItems).toEqual(100);
      await expect(exceptions).toBeNull();
    });

    test('removes the virtualScroll attribute when reset', async () => {
      let vsItems; let
        lvItems;
      await idsListView.evaluate((listView: IdsListView) => { listView.virtualScroll = true; });
      await expect(idsListView).toHaveAttribute('virtual-scroll', 'true');
      vsItems = await idsListView.evaluate((listview: IdsListView) => listview.shadowRoot?.querySelector<IdsVirtualScroll>('ids-virtual-scroll')?.visibleItemCount());
      lvItems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvItems).toEqual(vsItems);
      await idsListView.evaluate((listView: IdsListView) => { listView.virtualScroll = null; });
      await expect(idsListView).not.toHaveAttribute('virtual-scroll');
      vsItems = await idsListView.evaluate((listview: IdsListView) => listview.shadowRoot?.querySelector<IdsVirtualScroll>('ids-virtual-scroll')?.visibleItemCount());
      lvItems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvItems).toEqual(77);
    });

    test.skip('render with empty data', async () => {
      let lvItems;
      await idsListView.evaluate((listView: IdsListView) => { listView.data = null; });
      lvItems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvItems).toEqual(0);
      await idsListView.evaluate((listView: IdsListView, dataSet: any) => { listView.container?.setAttribute('dir', 'rtl'); listView.data = dataSet; }, dataset);
      lvItems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvItems).toEqual(100);
      await idsListView.evaluate((listView: IdsListView) => { listView.data = []; });
      lvItems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvItems).toEqual(0);
    });

    test('supports setting height', async () => {
      await idsListView.evaluate((listView: IdsListView) => { listView.height = '600px'; });
      await expect(idsListView).toHaveAttribute('height', '600px');
      await idsListView.evaluate((listView: IdsListView) => { listView.height = undefined; });
      await expect(idsListView).toHaveAttribute('height', '100%');
    });

    test('supports setting itemHeight', async () => {
      await idsListView.evaluate((listView: IdsListView) => { listView.itemHeight = '40px'; });
      await expect(idsListView).toHaveAttribute('item-height', '40px');
      await idsListView.evaluate((listView: IdsListView) => { listView.itemHeight = undefined; });
      await expect(idsListView).not.toHaveAttribute('height');
    });

    test('supports setting sortable', async () => {
      await idsListView.evaluate((listView: IdsListView) => { listView.sortable = true; });
      await expect(idsListView).toHaveAttribute('sortable');
      const swappableItem = idsListView.evaluate((listView: IdsListView) => listView.itemsSwappable?.length);
      await expect(await swappableItem).toEqual(0);
      await idsListView.evaluate((listView: IdsListView) => { listView.sortable = null; });
      await expect(idsListView).not.toHaveAttribute('sortable');
    });

    test('supports setting focus', async () => {
      expect(await idsListView.evaluate((listview: IdsListView) => {
        listview.focus();
        return document.activeElement?.nodeName;
      })).toEqual('BODY');
    });

    test('supports sorting', async () => {
      await idsListView.evaluate((listView: IdsListView) => { listView.sortable = true; });
      const sortable = await idsListView.evaluate((listView: IdsListView) => listView.items[0]?.sortable);
      await expect(sortable).toBeTruthy();
    });

    test('focuses on click', async ({ page }) => {
      const liNo3 = await page.locator('ids-list-view-item ').first();
      await liNo3.click();
      await expect(liNo3).toHaveAttribute('tabindex', '0');
      await expect(liNo3).toBeFocused();
    });

    test('can use arrow keys to navigate list after an item was selected', async ({ page }) => {
      let focusedItem;
      const lvItem = await page.locator('ids-list-view-item[row-index="1"]');
      await lvItem.click();
      focusedItem = await page.locator('ids-list-view-item[tabindex="0"] ids-text').first();
      await expect(focusedItem).toContainText('Dentist');
      await page.keyboard.press('ArrowUp');
      focusedItem = await page.locator('ids-list-view-item[tabindex="0"] ids-text').first();
      await expect(focusedItem).toContainText('Discretionary'); // can't use arrow up.
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      focusedItem = await page.locator('ids-list-view-item[tabindex="0"] ids-text').first();
      await expect(focusedItem).toContainText('Dentist'); // can't use arrow up.
      await page.keyboard.press('ArrowDown');
      // Does nothing just the bounds case
      await page.keyboard.press('ArrowLeft');
      focusedItem = await page.locator('ids-list-view-item[tabindex="0"] ids-text').first();
      await expect(focusedItem).toContainText('Team Meeting');
      await page.keyboard.press('Space');
      focusedItem = await page.locator('ids-list-view-item[tabindex="0"] ids-text').first();
      await expect(focusedItem).toContainText('Team Meeting');
    });

    test('can use arrow keys to navigate focused list view rendered from data', async ({ page }) => {
      const listView = await page.locator('ids-list-view');
      const focusableItem = await page.locator('ids-list-view-item[tabindex="0"]');
      await focusableItem.focus();
      await page.keyboard.press('ArrowDown');
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-2');
      await expect(focusableItem).toHaveId('id-2');
      await page.keyboard.press('ArrowUp');
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-1');
      await expect(focusableItem).toHaveId('id-1');
      // should not pass through the first item
      await page.keyboard.press('ArrowUp');
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-1');
      await expect(focusableItem).toHaveId('id-1');

      // should not pass through the last item
      const lastItem = await page.locator('#id-77');
      await lastItem.click();
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-77');
      await expect(focusableItem).toHaveId('id-77');
      await page.keyboard.press('ArrowDown');
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-77');
      await expect(focusableItem).toHaveId('id-77');
    });

    test('can use arrow keys to navigate focused list view with slotted items', async ({ page }) => {
      await page.goto('/ids-list-view/list-view-items.html');
      const listView = await page.locator('ids-list-view');
      const focusableItem = await page.locator('ids-list-view-item[tabindex="0"]');
      await focusableItem.focus();
      await page.keyboard.press('ArrowDown');
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-2');
      await expect(focusableItem).toHaveId('id-2');

      // should skip disabled item (id-3)
      await page.keyboard.press('ArrowDown');
      expect(await listView.evaluate((elem: IdsListView) => elem?.body?.getAttribute('aria-activedescendant'))).toBe('id-4');
      await expect(focusableItem).toHaveId('id-4');
    });

    test('can generate ids for list view items rendered from data', async ({ page }) => {
      const listView = await page.locator('ids-list-view');
      const items = await listView.evaluate((elem: IdsListView) => ({
        ids: elem?.items?.map((item) => item.id),
        expected: elem?.items?.map((item, index) => `id-${index + 1}`)
      }));
      expect(items.ids).toEqual(items.expected);
    });

    test('can generate ids for list view slotted items', async ({ page }) => {
      await page.goto('/ids-list-view/list-view-items.html');
      const listView = await page.locator('ids-list-view');
      const items = await listView.evaluate((elem: IdsListView) => ({
        ids: elem?.items?.map((item) => item.id),
        expected: elem?.items?.map((item, index) => `id-${index + 1}`)
      }));
      expect(items.ids).toEqual(items.expected);
    });

    test.skip('can single select with keyboard', async ({ page }) => {
      let selected;
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;

      await idsListView.evaluate((listView: IdsListView) => { listView.selectable = 'single'; });
      selected = await idsListView.evaluate((listView: IdsListView) => listView.itemsSelected);
      await expect(await selected).toEqual([]);
      await page.locator(sel(0)).focus();
      await page.keyboard.press('Space');

      await page.locator(sel(1)).focus();
      await idsListView.press('ArrowDown');
      selected = await idsListView.evaluate((listView: IdsListView) => {
        const itemSelect = listView.itemsSelected;
        return itemSelect[0].getAttribute('selected');
      });
      await expect(selected).not.toBeTruthy();
      await expect(await page.locator(sel(0))).toHaveAttribute('selected');
      await expect(await page.locator(sel(0))).toContainText('Discretionary Time Off');
      await page.locator(sel(3)).focus();
      await idsListView.press('Space');
      selected = await idsListView.evaluate((listView: IdsListView) => {
        const itemSelect = listView.itemsSelected;
        return itemSelect[0].getAttribute('selected');
      });
      await expect(selected).not.toBeTruthy();
      await expect(await page.locator(sel(3))).toHaveAttribute('selected');
      await expect(await page.locator(sel(3))).toContainText('Moving Offices');
      await page.locator(sel(3)).focus();
      await idsListView.press('Enter');
      selected = await idsListView.evaluate((listView: IdsListView) => {
        const itemSelect = listView.itemsSelected;
        return itemSelect[0].getAttribute('selected');
      });
      await expect(selected).not.toBeTruthy();
      await expect(await page.locator(sel(3))).toHaveAttribute('selected');
      await expect(await page.locator(sel(3))).toContainText('Moving Offices');
    });

    test('can mixed select with keyboard', async ({ page }) => {
      let selected;
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;

      await idsListView.evaluate((listView: IdsListView) => { listView.selectable = 'mixed'; });
      selected = await idsListView.evaluate((listView: IdsListView) => listView.itemsSelected);
      await expect(await selected).toEqual([]);
      await page.locator(sel(1)).focus();
      await page.keyboard.press('Space');
      selected = await idsListView.evaluate((listView: IdsListView) => listView.itemsSelected);
      await expect(selected.length).toEqual(1);
    });

    test('can multiple select with keyboard', async ({ page }) => {
      let selected;
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;

      await idsListView.evaluate((listView: IdsListView) => { listView.selectable = 'multiple'; });
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(0);
      await page.locator(sel(1)).focus();
      await page.keyboard.press('Space');
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(1);
      await page.locator(sel(1)).focus();
      await page.keyboard.press('ArrowDown');
      await page.locator(sel(3)).focus();
      await page.keyboard.press('Space');
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(2);
      await page.locator(sel(3)).focus();
      await page.keyboard.press('Space');
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(1);
    });

    test.skip('can set the aria label text', async () => {
      let label;
      await expect(idsListView).not.toHaveAttribute('aria-label');
      await idsListView.evaluate((listView: IdsListView) => { listView.selectable = 'multiple'; });
      label = await idsListView.evaluate((lView: IdsListView) => lView.label);
      await expect(await label).toEqual(LIST_VIEW_DEFAULTS.label);
      await idsListView.evaluate((listView: IdsListView) => listView.setAttribute('label', 'test'));
      await expect(idsListView).toHaveAttribute('label', 'test');
      await idsListView.evaluate((listView: IdsListView) => listView.removeAttribute('label'));
      await expect(idsListView).not.toHaveAttribute('label');
      label = await idsListView.evaluate((lView: IdsListView) => lView.label);
      const arialabel = await idsListView.evaluate((lView: IdsListView) => lView.body?.getAttribute('aria-label'));
      await expect(await label).toEqual(LIST_VIEW_DEFAULTS.label);
      await expect(await arialabel).toEqual(LIST_VIEW_DEFAULTS.label);
    });

    test('can set the selectable setting', async () => {
      await expect(idsListView).not.toHaveAttribute('selectable');
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'single'; });
      await expect(idsListView).toHaveAttribute('selectable', 'single');
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'multiple'; });
      await expect(idsListView).toHaveAttribute('selectable', 'multiple');
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'mixed'; });
      await expect(idsListView).toHaveAttribute('selectable', 'mixed');
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'test' as any; });
      await expect(idsListView).not.toHaveAttribute('selectable');
    });

    test('can set the setting to allow deselect', async () => {
      let suppressDeselection;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'single'; });
      await expect(idsListView).not.toHaveAttribute('suppress-deselection');
      suppressDeselection = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeselection);
      await expect(suppressDeselection).toEqual(LIST_VIEW_DEFAULTS.suppressDeselection); // Expected: true Received: false
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('suppress-deselection', 'true'); });
      suppressDeselection = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeselection);
      await expect(idsListView).toHaveAttribute('suppress-deselection', 'true');
      await expect(suppressDeselection).toEqual(true);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('suppress-deselection', 'false'); });
      suppressDeselection = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeselection);
      await expect(idsListView).not.toHaveAttribute('suppress-deselection');
      await expect(suppressDeselection).toEqual(false);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('suppress-deselection', 'test'); });
      suppressDeselection = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeselection);
      await expect(idsListView).toHaveAttribute('suppress-deselection', 'test');
      await expect(suppressDeselection).toEqual(true);
      await idsListView.evaluate((lView: IdsListView) => { lView.removeAttribute('suppress-deselection'); });
      await expect(idsListView).not.toHaveAttribute('suppress-deselection');
      suppressDeselection = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeselection);
      await expect(suppressDeselection).toEqual(LIST_VIEW_DEFAULTS.suppressDeselection); // Expected: true Received: false
    });

    test('can set the setting to allow deactivate', async () => {
      let suppressDeactivation;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'mixed'; });
      await expect(idsListView).not.toHaveAttribute('suppress-deactivation');
      suppressDeactivation = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeactivation);
      await expect(suppressDeactivation).toEqual(LIST_VIEW_DEFAULTS.suppressDeactivation);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('suppress-deactivation', 'true'); });
      suppressDeactivation = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeactivation);
      await expect(idsListView).toHaveAttribute('suppress-deactivation', 'true');
      await expect(suppressDeactivation).toEqual(true);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('suppress-deactivation', 'false'); });
      suppressDeactivation = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeactivation);
      await expect(idsListView).not.toHaveAttribute('suppress-deactivation');
      await expect(suppressDeactivation).toEqual(false);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('suppress-deactivation', 'test'); });
      suppressDeactivation = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeactivation);
      await expect(idsListView).toHaveAttribute('suppress-deactivation', 'test');
      await expect(suppressDeactivation).toEqual(true);
      await idsListView.evaluate((lView: IdsListView) => { lView.removeAttribute('suppress-deactivation'); });
      await expect(idsListView).not.toHaveAttribute('suppress-deactivation');
      suppressDeactivation = await idsListView.evaluate((lView: IdsListView) => lView.suppressDeactivation);
      await expect(suppressDeactivation).toEqual(LIST_VIEW_DEFAULTS.suppressDeactivation);
    });

    test('can set the setting to hide checkboxes', async () => {
      let hideCheckboxes;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'multiple'; });
      await expect(idsListView).not.toHaveAttribute('hide-checkboxes');
      hideCheckboxes = await idsListView.evaluate((lView: IdsListView) => lView.hideCheckboxes);
      await expect(hideCheckboxes).toEqual(LIST_VIEW_DEFAULTS.hideCheckboxes);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('hide-checkboxes', 'true'); });
      hideCheckboxes = await idsListView.evaluate((lView: IdsListView) => lView.hideCheckboxes);
      await expect(idsListView).toHaveAttribute('hide-checkboxes', 'true');
      await expect(hideCheckboxes).toEqual(true);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('hide-checkboxes', 'false'); });
      hideCheckboxes = await idsListView.evaluate((lView: IdsListView) => lView.hideCheckboxes);
      await expect(idsListView).not.toHaveAttribute('hide-checkboxes');
      await expect(hideCheckboxes).toEqual(false);
      await idsListView.evaluate((lView: IdsListView) => { lView.setAttribute('hide-checkboxes', 'test'); });
      hideCheckboxes = await idsListView.evaluate((lView: IdsListView) => lView.hideCheckboxes);
      await expect(idsListView).toHaveAttribute('hide-checkboxes', 'test');
      await expect(hideCheckboxes).toEqual(true);
      await idsListView.evaluate((lView: IdsListView) => { lView.removeAttribute('hide-checkboxes'); });
      await expect(idsListView).not.toHaveAttribute('hide-checkboxes');
      hideCheckboxes = await idsListView.evaluate((lView: IdsListView) => lView.hideCheckboxes);
      await expect(hideCheckboxes).toEqual(LIST_VIEW_DEFAULTS.hideCheckboxes);
    });

    test('can set the setting to hide checkboxes with pre selected', async ({ page }) => {
      const ds: any = deepClone(dataset);
      ds[0].itemSelected = true;
      await page.evaluate((data) => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-list-view') as IdsListView;
        document.body.appendChild(elem);
        elem.data = data;
        return elem.getAttribute('hide-checkboxes');
      }, ds);
      idsListView = await page.locator('ids-list-view');

      const selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected);
      await expect(selected).toEqual([]);
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'multiple'; });
      await idsListView.evaluate((lView: IdsListView) => { lView.hideCheckboxes = true; });
      await idsListView.evaluate((lView: IdsListView) => { lView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; });//eslint-disable-line
      await expect(idsListView).toHaveAttribute('hide-checkboxes');
      await expect(await page.evaluate(() => document.querySelectorAll('.list-item-checkbox').length)).toEqual(0);
    });

    test('can veto before selected', async ({ page }) => {
      let selected: any;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'multiple'; });
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;
      const veto = async (val: boolean) => {
        await page.evaluate((vetoed) => {
          const elem: any = document.querySelector('ids-list-view') as IdsListView;

          elem.addEventListener('beforeselected', ((e: CustomEvent) => {
            e.detail.response(vetoed);
          }) as EventListener);
        }, val);
      };
      await veto(false);
      await page.click(sel(3));
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(0);
      await veto(true);
      await page.click(sel(3));
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(1);
    });

    test('can veto before deselected', async ({ page }) => {
      let veto: boolean;
      let selected: any;
      veto = true;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'multiple'; });
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;
      await page.evaluate((vetoed) => {
        const elem: any = document.querySelector('ids-list-view') as IdsListView;

        elem.addEventListener('beforedeselected', ((e: CustomEvent) => {
          e.detail.response(vetoed);
        }) as EventListener);
      }, veto);
      await page.click(sel(3));
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(1);
      await idsListView.evaluate(() => { veto = false; });
      await page.click(sel(3));
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(0);
      await idsListView.evaluate(() => { veto = true; });
      await page.click(sel(3));
      selected = await idsListView.evaluate((lView: IdsListView) => lView.itemsSelected.length);
      await expect(await selected).toEqual(1);
    });

    test('can veto before item activated', async ({ page }) => {
      let activated: any;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'mixed'; });
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;
      const veto = async (val: boolean) => {
        await page.evaluate((vetoed) => {
          const elem: any = document.querySelector('ids-list-view') as IdsListView;

          elem.addEventListener('beforeactivated', ((e: CustomEvent) => {
            e.detail.response(vetoed);
          }) as EventListener);
        }, val);
      };
      await veto(false);
      await page.click(sel(3));
      activated = await idsListView.evaluate((lView: IdsListView) => lView.itemsActivated);
      await expect(activated).toEqual([]);
      await veto(true);

      await page.click(sel(3));
      activated = await idsListView.evaluate((listView: IdsListView) => {
        const itemActivate = listView.itemsActivated;
        return itemActivate[0].getAttribute('activated');
      });
      await expect(await page.locator(sel(3))).toHaveAttribute('activated');
      await expect(await page.locator(sel(3))).toContainText('Moving Offices');
    });

    test.skip('can veto before item deactivated', async ({ page }) => {
      let deactivated: any;
      await idsListView.evaluate((lView: IdsListView) => { lView.selectable = 'mixed'; });
      const sel = (nth: number) => `ids-list-view-item[row-index="${nth}"]`;

      const veto = async (val: boolean) => {
        await page.evaluate((vetoed) => {
          const elem: any = document.querySelector('ids-list-view') as IdsListView;

          elem.addEventListener('beforedeactivated', ((e: CustomEvent) => {
            e.detail.response(vetoed);
          }) as EventListener);
        }, val);
      };
      await page.click(sel(3));
      deactivated = await idsListView.evaluate((listView: IdsListView) => {
        const itemActivate = listView.itemsActivated;
        return itemActivate[0].getAttribute('activated');
      });
      await expect(await page.locator(sel(3))).toHaveAttribute('activated');
      await expect(await page.locator(sel(3))).toContainText('Moving Offices');
      await veto(false);
      await page.click(sel(4));
      deactivated = await idsListView.evaluate((listView: IdsListView) => {
        const itemActivate = listView.itemsActivated;
        return itemActivate[0].getAttribute('activated');
      });
      await expect(await page.locator(sel(4))).toHaveAttribute('activated');
      await expect(await page.locator(sel(4))).toContainText('Scrum');
      await veto(true);
      await page.click(sel(4));
      deactivated = await idsListView.evaluate((lView: IdsListView) => lView.itemsActivated);
      await expect(deactivated).toHaveLength(0);

      await page.click(sel(4));
      deactivated = await idsListView.evaluate((listView: IdsListView) => {
        const itemActivate = listView.itemsActivated;
        return itemActivate[0].getAttribute('activated');
      });
      await expect(await page.locator(sel(4))).toHaveAttribute('activated');
      await expect(await page.locator(sel(4))).toContainText('Scrum');
      await idsListView.evaluate((listView: IdsListView) => { listView.suppressDeactivation = true; });
      await veto(false);
      await page.click(sel(4));
      deactivated = await idsListView.evaluate((listView: IdsListView) => {
        const itemActivate = listView.itemsActivated;
        return itemActivate[0].getAttribute('activated');
      });
      await expect(await page.locator(sel(4))).toHaveAttribute('activated');
      await expect(await page.locator(sel(4))).toContainText('Scrum');
      await veto(true);
      await page.click(sel(4));
      deactivated = await idsListView.evaluate((listView: IdsListView) => {
        const itemActivate = listView.itemsActivated;
        return itemActivate[0].getAttribute('activated');
      });
      await expect(await page.locator(sel(4))).toHaveAttribute('activated');
      await expect(await page.locator(sel(4))).toContainText('Scrum');
    });

    test.skip('can not have errors when changing data by activating an item', async ({ page }) => {
      // FIXME lView.activateItem is not a function
      // let activated: any;
      let activatedItem = -1;

      const activated = await page.evaluate(() => {
        const elem: any = document.createElement('ids-list-view') as IdsListView;
        elem.addEventListener('activated', (e: any) => {
          activatedItem = e.detail.index;

          elem.data = [
            { productName: 'new product 1' },
            { productName: 'new product 2' },
          ];
          return activatedItem;
        });
      });
      // activated = await idsListView.evaluate((lView: IdsListView) => lView.itemsActivated(0)); // not a function
      await expect(activated).toEqual(0);
      // activated = await idsListView.evaluate((lView: IdsListView) => lView.activateItem(1)); // not a function
      await expect(activated).toEqual(1);
    });

    test('Renders properly', async ({ page }) => {
      const oDataset = dataset?.length;
      const dsProdctname = dataset[0]?.productName?.length;

      await expect(oDataset > 0).toBeTruthy();
      await expect(dsProdctname > 0).toBeTruthy();
      const lvChild = await idsListView.evaluate((listview: IdsListView) => listview?.children?.length);
      await expect(lvChild).toBe(1);

      const listViewItems = await page.locator('ids-list-view-item').all();
      expect(listViewItems?.length).toBe(77);
    });

    test('Has a default slot', async () => {
      const slot = await idsListView.locator('slot:not([name])');
      await expect(slot).toBeTruthy();
    });

    test('Ignores ids-list-view-item elements if IdsListView.data attribute is set', async () => {
      const ds: any = deepClone(dataset);
      ds[0].itemSelected = true;
      let childSlots = await idsListView.locator('slot[name^="slot-child"]').all();
      await expect(childSlots.length).toEqual(0);
      await idsListView.evaluate((lView: IdsListView, data: any) => {
        lView.data = data;
      }, ds);
      childSlots = await idsListView.locator('slot[name^="slot-child"]').all();
      await expect(childSlots.length).toEqual(0);
    });

    test.skip('Creates named slots for valid ids-list-view-item child elements', async ({ page }) => {
      // FIXME  no child slot
      const listViewItems = await idsListView.locator('ids-list-view-item').all();
      await expect(listViewItems?.length).toBe(77); // Expected: 100  Received: 77
      const childSlots = await idsListView.locator('slot[name^="slot-child"]').all();
      const numSlots = await childSlots?.length ?? 0;
      await expect(numSlots).toEqual(0);
      await expect(await page.locator('slot[name^="slot-child"]').first()).toHaveAttribute('name', 'slot-child-0');
      await expect(await page.locator('ids-list-view-item').first()).toHaveAttribute('slot', 'slot-child-0');
      const slot = await page.evaluate(() => {
        const listView = document.querySelector('ids-list-view') as IdsListView;
        const ilistViewItems = listView.querySelectorAll('ids-list-view-item');

        const ichildSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
        const inumSlots = ichildSlots?.length ?? 0;
        return {
          childSLot: ichildSlots,
          numSlot: inumSlots,
          nameAttrchildSLot: ichildSlots?.[inumSlots - 1],
          listViewItems: ilistViewItems[inumSlots - 1]
        };
      });
      await expect(slot.nameAttrchildSLot).toHaveProperty('name', `slot-child-${numSlots - 1}`);
      await expect(slot.listViewItems).toHaveProperty('slot', `slot-child-${numSlots - 1}`);
    });

    test('Removes named slots once ids-list-view-item is removed from DOM', async ({ page }) => {
      const listViewItems = await idsListView.locator('ids-list-view-item').all();
      await expect(listViewItems?.length).toBe(77);
      let childSlots = await idsListView.locator('slot[name^="slot-child"]').all();
      await expect(childSlots?.length).toBe(0);
      await page.evaluate(() => {
        const listviewItems = document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelectorAll('ids-list-view-item') as any;
        listviewItems[0].remove();
        listviewItems[1].remove();
        listviewItems[2].remove();
      });
      childSlots = await idsListView.locator('slot[name^="slot-child"]').all();
      await expect(childSlots?.length).toEqual(0);
    });

    test('Ignores child elements that are not valid ids-list-view-item elements', async () => {
      await idsListView.evaluate((listView: IdsListView) => {
        document.body.innerHTML = '';
        listView.innerHTML = `
        <ids-text font-size="16" type="h2">Invalid Item 0</ids-text>
        <ids-list-view-item>
          <ids-text font-size="16" type="h2">Valid Item 1</ids-text>
        </ids-list-view-item>
        <ids-text font-size="16" type="h2">Invalid Item 2</ids-text>
        <ids-list-view-item>
          <ids-text font-size="16" type="h2">Valid Item 3</ids-text>
        </ids-list-view-item>
        <ids-text font-size="16" type="h2">Invalid Item 4</ids-text>
        <ids-list-view-item>
          <ids-text font-size="16" type="h2">Valid Item 5</ids-text>
        </ids-list-view-item>
        <ids-text font-size="16" type="h2">Invalid Item 6</ids-text>
      `;
        document.body.appendChild(listView);
      });
      const lvChild = await idsListView.evaluate((listview: IdsListView) => listview?.children?.length);
      await expect(lvChild).toBe(7);
      const defaultSlot = await idsListView.evaluate((listview: IdsListView) => listview?.container?.querySelector<HTMLSlotElement>('slot:not([name])')?.assignedElements() ?? []);
      await expect(defaultSlot.length).toEqual(7);
      const childSlots = await idsListView.locator('slot[name^="slot-child"]').all();
      await expect(childSlots?.length).toBe(0);
    });

    test.skip('can find text in ids-list-view-item elements when searchable enabled', async ({ page }) => {
      let searchable: any;
      searchable = await idsListView.evaluate((listview: IdsListView) => listview.searchable);
      await expect(searchable).toBeFalsy();
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      searchable = await idsListView.evaluate((listview: IdsListView) => listview.searchable);
      await expect(searchable).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field')).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      let listViewItems = await page.locator('ids-list-view-item').all();
      expect(listViewItems?.length).toBe(77);
      const numBeefProducts = dataset.filter((item) => item.productName.includes('Beef'));
      expect(numBeefProducts.length > 0).toBe(true);
      expect(numBeefProducts.length).toBe(3);
      await idsListView.evaluate((listview: IdsListView, dataSet: any) => { listview.data = dataSet; }, dataset);
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'Beef'; });
      listViewItems = await page.locator('ids-list-view-item').all();
      expect(listViewItems?.length).toBe(numBeefProducts.length);
    });

    test('can set the searchable setting and renders search field', async () => {
      let searchable: any;
      await expect(idsListView).not.toHaveAttribute('searchable');
      searchable = await idsListView.evaluate((listview: IdsListView) => listview.searchable);
      await expect(searchable).toBeFalsy();
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      searchable = await idsListView.evaluate((listview: IdsListView) => listview.searchable);
      await expect(searchable).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field')).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = false; });
      searchable = await idsListView.evaluate((listview: IdsListView) => listview.searchable);
      await expect(idsListView).not.toHaveAttribute('searchable');
      await expect(searchable).toBeFalsy();
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
    });

    test.skip('render search field thru slot', async ({ page }) => {
      // FIXME Missing file extension for "../helpers/create-from-template"
      const searchfieldSlot = page.evaluate(async () => {
        const listView = document.createElement('ids-list-view') as IdsListView;
        // const html = '<ids-list-view><ids-search-field slot="search"></ids-search-field><template>
        // <ids-text type="h2">${subject}</ids-text></template></ids-list-view>'; //eslint-disable-line
        document.body.innerHTML = '';

        // await createFromTemplate(listView, html, container);
        return listView.querySelector('ids-search-field[slot="search"]');
      });
      await expect(searchfieldSlot).toBeTruthy();
    });

    test.skip('render search field thru id', async ({ page }) => {
      // FIXME Missing file extension for "../helpers/create-from-template"
      await page.evaluate(async () => {
        const listView = document.createElement('ids-list-view') as IdsListView;
        const id = 'lv-searchfield-1';
        // const html = `<ids-search-field id="${id}"></ids-search-field>`;
        // await createFromTemplate(null, html, container); // Missing file extension for "../helpers/create-from-template"
        listView.searchFieldId = id;
      });
      let icontainer = await idsListView.evaluate((listview: IdsListView) => listview.closest('ids-container')?.querySelector(`#${listview.searchFieldId}`));
      await expect(icontainer).toBeTruthy();
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await idsListView.evaluate((listview: IdsListView) => { listview.searchFieldId = null; });
      icontainer = await idsListView.evaluate((listview: IdsListView) => listview.closest('ids-container')?.querySelector(`#${listview.searchFieldId}`));
      await expect(icontainer).toBeFalsy();
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
    });

    test('cant set the suppress highlight setting', async () => {
      await expect(idsListView).not.toHaveAttribute('suppress-highlight');
      let suppressHighlight = await idsListView.evaluate((listview: IdsListView) => listview.suppressHighlight);
      await expect(suppressHighlight).toEqual(false);
      await idsListView.evaluate((listview: IdsListView) => { listview.suppressHighlight = true; });
      suppressHighlight = await idsListView.evaluate((listview: IdsListView) => listview.suppressHighlight);
      await expect(suppressHighlight).toEqual(true);
      await expect(idsListView).toHaveAttribute('suppress-highlight', '');
      await idsListView.evaluate((listview: IdsListView) => { listview.suppressHighlight = false; });
      await expect(idsListView).not.toHaveAttribute('suppress-highlight');
      suppressHighlight = await idsListView.evaluate((listview: IdsListView) => listview.suppressHighlight);
      await expect(suppressHighlight).toEqual(false);
    });

    test('can set the search term case sensitive setting', async () => {
      await expect(idsListView).not.toHaveAttribute('search-term-case-sensitive');
      let searchTermCaseSensitive = await idsListView.evaluate((listview: IdsListView) => listview.searchTermCaseSensitive);
      await expect(searchTermCaseSensitive).toEqual(false);
      await idsListView.evaluate((listview: IdsListView) => { listview.searchTermCaseSensitive = true; });
      searchTermCaseSensitive = await idsListView.evaluate((listview: IdsListView) => listview.searchTermCaseSensitive);
      await expect(searchTermCaseSensitive).toEqual(true);
      await expect(idsListView).toHaveAttribute('search-term-case-sensitive', '');
      await idsListView.evaluate((listview: IdsListView) => { listview.searchTermCaseSensitive = false; });
      await expect(idsListView).not.toHaveAttribute('search-term-case-sensitive');
      searchTermCaseSensitive = await idsListView.evaluate((listview: IdsListView) => listview.searchTermCaseSensitive);
      await expect(searchTermCaseSensitive).toEqual(false);
    });

    test('can set the search term min size setting', async () => {
      const defaultVal = 1;
      await expect(idsListView).not.toHaveAttribute('search-term-min-size');
      let searchTermMinSize = await idsListView.evaluate((listview: IdsListView) => listview.searchTermMinSize);
      await expect(searchTermMinSize).toEqual(defaultVal);
      await idsListView.evaluate((listview: IdsListView) => { listview.searchTermMinSize = 3; });
      searchTermMinSize = await idsListView.evaluate((listview: IdsListView) => listview.searchTermMinSize);
      await expect(searchTermMinSize).toEqual(3);
      await expect(idsListView).toHaveAttribute('search-term-min-size', '3');
      await idsListView.evaluate((listview: IdsListView) => { listview.searchTermMinSize = 'test'; });
      await expect(idsListView).not.toHaveAttribute('search-term-min-size');
      searchTermMinSize = await idsListView.evaluate((listview: IdsListView) => listview.searchTermMinSize);
      await expect(searchTermMinSize).toEqual(defaultVal);
    });

    test('can set the search filter mode setting', async () => {
      const modes = ['contains', 'keyword', 'phrase-starts-with', 'word-starts-with'];
      const defaultMode = 'contains';
      await expect(idsListView).not.toHaveAttribute('search-filter-mode');
      let searchFilterMode = await idsListView.evaluate((listview: IdsListView) => listview.searchFilterMode);
      await expect(searchFilterMode).toEqual(defaultMode);

      for (const mode of modes) {
        await idsListView.evaluate((listview: IdsListView, imode: any) => { listview.searchFilterMode = imode; }, mode);
        await expect(idsListView).toHaveAttribute('search-filter-mode', mode);
        searchFilterMode = await idsListView.evaluate((listview: IdsListView) => listview.searchFilterMode);
        await expect(searchFilterMode).toEqual(mode);
      }
      await idsListView.evaluate((listview: IdsListView) => { listview.searchFilterMode = 'test'; });
      searchFilterMode = await idsListView.evaluate((listview: IdsListView) => listview.searchFilterMode);
      await expect(idsListView).not.toHaveAttribute('search-filter-mode');
      await expect(searchFilterMode).toEqual(defaultMode);
    });

    test('can show searched list', async () => {
      const itemCountAll = 77;
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'Discretionary'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('Discretionary');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(2);
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
    });

    test('can show searched list without searchable text callback', async () => {
      const itemCountAll = 77;
      await idsListView.evaluate((listview: IdsListView) => { listview.searchableTextCallback = null; });
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'd'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('d');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(72);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'disc'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('disc');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(3);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
    });

    test('can suppress highlight trem searched list', async ({ page }) => {
      const itemCountAll = 77;
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');

      let suppressHighlight = await idsListView.evaluate((listview: IdsListView) => listview.suppressHighlight);
      await expect(suppressHighlight).toEqual(false);
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'Disc'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('Disc');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(3);
      let item = await page.evaluate(() => document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item ids-text .highlight'));
      // await expect(item).toBeTruthy();

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { listview.suppressHighlight = true; });
      suppressHighlight = await idsListView.evaluate((listview: IdsListView) => listview.suppressHighlight);
      await expect(suppressHighlight).toEqual(true);
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'Disc'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('Disc');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(3);
      item = await page.evaluate(() => document.querySelector<IdsListView>('ids-list-view')?.shadowRoot?.querySelector('ids-list-view-item ids-text .highlight'));
      await expect(item).toBeFalsy();
    });

    test('can show searched list by case sensitive', async () => {
      await idsListView.evaluate((
        listView: IdsListView,
        dataSet: any
      ) => { listView.data = dataSet; }, caseSensitiveData);
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(6);
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      const searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      await expect(lvitems).toEqual(6);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'calif'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('calif');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(3);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(6);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchTermCaseSensitive = true; });
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'calif'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('calif');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(1);
    });

    test('can show searched list by matching the start of an entire phrase', async () => {
      await idsListView.evaluate((
        listView: IdsListView,
        dataSet: any
      ) => { listView.data = dataSet; }, phraseData);
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(5);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      const searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      await expect(lvitems).toEqual(5);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'eat'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('eat');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(4);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(5);

      await idsListView.evaluate(
        (listview: IdsListView) => { listview.searchFilterMode = listview.searchFilterModes.PHRASE_STARTS_WITH; }
      );
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'eat'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('eat');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(0);
    });

    test('can show searched list by matching the start of words in any place in a string', async () => {
      const itemCountAll = 77;
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'day'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('day');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(12);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate(
        (listview: IdsListView) => { listview.searchFilterMode = listview.searchFilterModes.WORD_STARTS_WITH; }
      );
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'day'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('day');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(10);
    });

    test.skip('can show searched list by checking for multiple keywords in each result', async () => {
      await idsListView.evaluate((
        listView: IdsListView,
        dataSet: any
      ) => { listView.data = dataSet; }, keywordData);
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(7);
      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      const searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(7);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'apple orange'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('apple orange');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(0);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(7);

      await idsListView.evaluate(
        (listview: IdsListView) => { listview.searchFilterMode = listview.searchFilterModes.KEYWORD; }
      );
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'apple orange'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('apple orange');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(4);
    });

    test('can show searched list by search term min size', async () => {
      const itemCountAll = 77;
      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'd'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('d');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(72);

      await idsListView.evaluate(
        (listview: IdsListView) => { listview.searchTermMinSize = 3; }
      );
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'd'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('d');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'disc'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('disc');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(3);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
    });

    test('can show searched list with custom filter', async () => {
      await idsListView.evaluate((listview: IdsListView) => {
        listview.searchFilterCallback = (term: string) => {
          const response = (item: any): boolean => {
            const lcTerm = (term || '').toLowerCase();
            const lcText = (item.comments || '').toLowerCase();

            const match = lcText.indexOf(lcTerm) >= 0;
            return !match;
          };
          return response;
        };
      });
      const itemCountAll = 77;

      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'd'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('d');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(25);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'disc'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('disc');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(1);

      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
    });

    test('fires filtered event when apply or clear search', async ({ page }) => {
      const itemCountAll = 77;

      let searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeFalsy();
      let lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);

      await idsListView.evaluate((listview: IdsListView) => { listview.searchable = true; });
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      searchfield = await idsListView.evaluate((listview: IdsListView) => listview.searchField);
      await expect(searchfield).toBeTruthy();
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      // Setup event listener - call only once
      await idsListView.evaluate((element: IdsListView) => {
        (window as any).isEventTriggered = false;
        element.addEventListener('filtered', () => { (window as any).isEventTriggered = true; });
      });
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'day'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('day');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(12);
      // Get value of isEventTriggered - re-use every scenario
      const isEventTriggered = async () => {
        await page.evaluate(() => (window as any).isEventTriggered);
      };
      // Resets value of isEventTriggered - re-use every scenario
      const resetEventTrigFlag = async () => {
        await page.evaluate(() => { (window as any).isEventTriggered = false; });
      };
      await expect(isEventTriggered).toBeTruthy();
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = ''; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      await resetEventTrigFlag();
      await expect(isEventTriggered).toBeTruthy();
      await idsListView.evaluate((listview: IdsListView) => { (listview.searchField as any).value = 'd'; });
      await expect(await idsListView.locator('ids-search-field input')).toHaveValue('d');
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(72);
      await resetEventTrigFlag();
      await expect(isEventTriggered).toBeTruthy();
      await idsListView.evaluate((listview: IdsListView) => listview.searchField?.dispatchEvent(new Event('cleared')));
      lvitems = await idsListView.evaluate((listview: IdsListView) => listview.items.length);
      await expect(lvitems).toEqual(itemCountAll);
      // await expect(mockCallback.mock.calls.length).toBe(4);
      await resetEventTrigFlag();
      await expect(isEventTriggered).toBeTruthy();
    });
  });
});
