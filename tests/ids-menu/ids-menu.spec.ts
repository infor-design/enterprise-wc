import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMenu from '../../src/components/ids-menu/ids-menu';
import IdsMenuGroup from '../../src/components/ids-menu/ids-menu-group';
import IdsMenuItem from '../../src/components/ids-menu/ids-menu-item';

test.describe('IdsMenu tests', () => {
  const url = '/ids-menu/example.html';
  let idsMenu: any;
  let idsMenu2: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    idsMenu = await page.locator('ids-menu').first();
    idsMenu2 = await page.locator('#complex-menu').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Menu Component');
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

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-menu');
      const html = await handle?.evaluate((el: IdsMenu) => el?.outerHTML);
      await expect(html).toMatchSnapshot('menu-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-menu');
      const html = await handle?.evaluate((el: IdsMenu) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('menu-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-menu-light');
    });
  });

  test.describe('functionality tests', () => {
    const getAllselectedItems = async (menu: IdsMenu) => {
      const selected = await menu.evaluate(
        (Menu: IdsMenu) => Menu.getSelectedItems(),
      );
      return {
        selected,
        length: selected.length
      };
    };
    const getselectedItems = async (menu: IdsMenu, group: any) => {
      const selected = await menu.evaluate(
        (Menu: IdsMenu, Group: any) => Menu.getSelectedItems(document.querySelector(Group)),
        group
      );
      return {
        selected,
        length: selected.length
      };
    };
    const getselectedValues = async (menu: IdsMenu) => {
      const selected = await menu.evaluate((Menu: IdsMenu) => Menu.getSelectedValues());
      return {
        selected,
        length: selected.length
      };
    };
    const setselectedValue = async (menu: IdsMenu, values: any, menuGroup: any) => {
      await menu.evaluate(
        (Menu: IdsMenu, value: any, menGroup: any) => Menu.setSelectedValues(value, menGroup),
        values,
        menuGroup
      );
    };

    const Isselected = async (menuItem: any) => {
      const selected = await idsMenu.evaluate(
        (_menu: IdsMenu, id: any) => document.querySelector<IdsMenuItem>(id)?.selected,
        menuItem
      );
      return selected;
    };

    const select = async (sel: any) => {
      await idsMenu.evaluate((_menu: IdsMenu, el: any) => document.querySelector<IdsMenuItem>(el)?.select(), sel);
    };

    const deselect = (sel: any) => {
      idsMenu.evaluate((_menu: IdsMenu, el: any) => document.querySelector<IdsMenuItem>(el)?.deselect(), sel);
    };
    test('can render', async ({ page }) => {
      await expect(idsMenu).toBeDefined();
      await expect(idsMenu2).toBeDefined();
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });
      await expect(exceptions).toBeNull();
    });

    test('can get a list of its groups', async () => {
      const groups = await idsMenu.evaluate((menu: IdsMenu) => menu.groups);
      await expect(groups).toBeDefined();
      await expect(groups).toHaveLength(1);
    });

    test('can get a list of its items', async () => {
      const items = await idsMenu.evaluate((menu: IdsMenu) => menu.items);

      await expect(items).toBeDefined();
      await expect(items).toHaveLength(3);
    });

    test('can announce what is focused and navigate among its items', async () => {
      const items = await idsMenu.evaluate((menu: IdsMenu) => menu.items);
      await idsMenu.evaluate((menu: IdsMenu) => menu.navigate(2, true));
      const isfocused = await idsMenu.evaluate((menu: IdsMenu) => menu.focused);

      // The component should be able to explain which of its items is focused
      await expect(isfocused).toEqual(items[2]);
      await idsMenu.evaluate((menu: IdsMenu) => menu.navigate(-1, true));
      await expect(isfocused).toEqual(items[1]);
      await idsMenu.evaluate((menu: IdsMenu) => menu.navigate('forward', true));
      await expect(isfocused).toEqual(items[1]);
    });

    test('navigates nowhere if no number of steps is provided', async ({ page }) => {
      const item1 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)');
      await item1.focus();
      await idsMenu.evaluate((menu: IdsMenu) => menu.navigate());
      expect(await idsMenu.evaluate((menu: IdsMenu) => {
        menu.focus();
        return document.activeElement?.nodeName;
      })).toEqual('IDS-MENU-ITEM');
    });

    test('navigates from the last-hovered menu item, if applicable', async ({ page }) => {
      const item = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)') as Locator;
      await item.focus();
      const item3 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)') as Locator;

      await idsMenu.evaluate((menu: IdsMenu) => {
        menu.navigate(1, true);
        const item2 = document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)');
        menu.lastHovered = item2 as any;
        menu.navigate(1, true);
      });
      expect(await idsMenu.evaluate(() => document.activeElement?.nodeName)).toEqual('IDS-MENU-ITEM');
      await expect(item3).toBeFocused();
    });

    test('loops around if `navigate()` tries to go too far', async ({ page }) => {
      const item6 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)');
      await item6.focus();
      const items = await idsMenu2.evaluate((menu: IdsMenu) => menu.items);
      await idsMenu.evaluate((menu: IdsMenu) => menu.navigate(1, true));
      const isfocused = await idsMenu.evaluate((menu: IdsMenu) => menu.focused);
      await idsMenu.evaluate((menu: IdsMenu) => menu.navigate(-1, true));
      await expect(isfocused).toEqual(items[1]);
    });

    test('skips disabled items while navigating', async ({ page }) => {
      const item1 = await page.locator('#main-settings > ids-menu-item:nth-child(1)');
      // FIXME PLS
      await item1.focus();
      await idsMenu2.evaluate((menu: IdsMenu) => {
        menu.items[1].focus();
      });
      const items = await idsMenu2.evaluate((menu2: IdsMenu) => menu2.items);
      await idsMenu2.evaluate((menu: IdsMenu) => menu.navigate(3, true));
      const isfocused = await idsMenu2.evaluate((menu2: IdsMenu) => menu2.focused);
      await expect(isfocused).toEqual(items[5]);
      const menuItem5 = await page.locator('ids-menu-item[value ="more-actions"]');
      expect(await idsMenu2.evaluate(() => document.activeElement?.ENTITY_NODE)).toEqual(6);
      await expect(menuItem5).toHaveAttribute('highlighted', 'true');
    });

    test('can select items (default)', async ({ page }) => {
      let value;
      // FIXME PLS
      await page.evaluate(() => {
        const group1 = document.querySelector<IdsMenuGroup>('#simple-menu > ids-menu-group')!;
        group1.select = 'single';
      });

      const getselected = async (menu: IdsMenu, item: any) => {
        const selected = await menu.evaluate((Menu: IdsMenu, Item: any) => {
          Menu.selectItem(document.querySelector(Item));
          return Menu.getSelectedItems();
        }, item);
        return {
          selected,
          length: selected.length
        };
      };

      const item2 = '#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)';
      const menuitem2 = await page.evaluate(() => document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)'));
      const item3 = '#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)';
      const menuitem3 = await page.evaluate(() => document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)'));
      value = await getselected(idsMenu, item2);
      await expect(value.length).toEqual(1);
      await expect(value.selected[0]).toEqual(menuitem2);
      value = await getselected(idsMenu, item3);
      await expect(value.length).toEqual(1);
      await expect(value.selected[0]).toEqual(menuitem3);
    });

    test('can select items (single)', async ({ page }) => {
      // FIXME PLS
      let value;
      await page.evaluate(() => {
        const group1 = document.querySelector<IdsMenuGroup>('#simple-menu > ids-menu-group')!;
        group1.select = 'single';
      });
      const getselected = async (menu: IdsMenu, item: any) => {
        const selected = await menu.evaluate((Menu: IdsMenu, Item: any) => {
          Menu.selectItem(document.querySelector(Item));
          return Menu.getSelectedItems();
        }, item);
        return {
          selected,
          length: selected.length
        };
      };
      await select('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)');
      const item2 = '#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)';
      const menuitem2 = await page.evaluate(() => document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)'));
      const item3 = '#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)';
      const menuitem3 = await page.evaluate(() => document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)'));
      value = await getselected(idsMenu, item2);
      await expect(value.length).toEqual(1);
      await expect(value.selected[0]).toEqual(menuitem2);
      await expect(await Isselected('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)')).toBeTruthy;
      await select('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)');
      value = await getselected(idsMenu, item3);
      await expect(value.length).toEqual(1);
      await expect(value.selected[0]).toEqual(menuitem3);
      await expect(await Isselected('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)')).toBeFalsy();
      await expect(await Isselected('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)')).toBeTruthy();
    });

    test('can select items (multiple)', async ({ page }) => {
      let value;
      // FIXME PLS
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'multiple';
      });
      const getselected = async (menu: IdsMenu, item: any) => {
        const selected = await menu.evaluate((Menu: IdsMenu, Item: any) => {
          Menu.selectItem(document.querySelector(Item));
          return Menu.getSelectedItems();
        }, item);
        return {
          selected,
          length: selected.length
        };
      };

      const item5 = '#complex-menu > ids-menu-group > ids-menu-item:nth-child(5)';
      const menuitem5 = await page.evaluate(() => document.querySelector('#complex-menu > ids-menu-group > ids-menu-item:nth-child(5)'));
      const item3 = '#complex-menu > ids-menu-group > ids-menu-item:nth-child(3)';
      const menuitem3 = await page.evaluate(() => document.querySelector('#complex-menu > ids-menu-group > ids-menu-item:nth-child(3)'));

      value = await getselected(idsMenu2, item5);
      await expect(value.length).toEqual(1);
      await expect(value.selected[0]).toEqual(menuitem5);
      await expect(await Isselected('#complex-menu > ids-menu-group > ids-menu-item:nth-child(5)')).toBeTruthy;

      value = await getselected(idsMenu2, item3);
      await expect(value.length).toEqual(2);
      await expect(value.selected[1]).toEqual(menuitem3);
      await expect(await Isselected('#complex-menu > ids-menu-group > ids-menu-item:nth-child(5)')).toBeTruthy();
      await expect(await Isselected('#complex-menu > ids-menu-group > ids-menu-item:nth-child(3)')).toBeTruthy();

      // Deselect Item 5
      await deselect('#complex-menu > ids-menu-group > ids-menu-item:nth-child(5)');
      await expect((await getAllselectedItems(idsMenu2)).length).toEqual(1);
      await expect(await Isselected('#complex-menu > ids-menu-group > ids-menu-item:nth-child(5)')).toBeFalsy();
      await expect(await Isselected('#complex-menu > ids-menu-group > ids-menu-item:nth-child(3)')).toBeTruthy();
    });

    test('can get/clear selected values', async ({ page }) => {
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'multiple';
      });
      await page.getByText('Mail').click();
      await page.getByText('Filter').click();
      const length = (await getselectedValues(idsMenu2)).length;
      await expect(length).toEqual(2);

      // Clear selected values
      await idsMenu2.evaluate((menu: IdsMenu) => menu.clearSelectedItems());
      const newvalue = (await getselectedValues(idsMenu2)).length;
      await expect(newvalue).toEqual(0);
      await expect(await Isselected('ids-menu-item[value="mail"]')).toBeFalsy();
    });

    test('can select items by value (single)', async ({ page }) => {
      // FIXME PLS
      let value;
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'single';
      });
      const expected = 'mail';

      const group2 = 'document.querySelector("#complex-menu > ids-menu-group")';
      await setselectedValue(idsMenu2, expected, group2);
      value = await getselectedValues(idsMenu2);
      await expect(value.length).toBe(1);
      await expect(value.selected).toEqual(['mail']);

      // can set selected by passing values as array
      await setselectedValue(idsMenu2, ['filter'], group2);
      value = await getselectedValues(idsMenu2);
      await expect(value.length).toBe(1);
      await expect(value.selected).toEqual(['filter']);

      await expect(await Isselected('#complex-menu > ids-menu-group > ids-menu-item:nth-child(1)')).toBeFalsy();
    });

    test('can select items by value (multiple)', async ({ page }) => {
      let value;
      const expected = ['mail', 'filter'];
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'multiple';
      });
      const group2 = 'document.querySelector("#complex-menu > ids-menu-group")';
      await setselectedValue(idsMenu2, expected, group2);
      value = await getselectedValues(idsMenu2);
      await expect(value.length).toBe(2);
      await expect(value.selected).toEqual(expected);

      // ignores values that don't exist
      const notExpected = [...expected, 'foobar', 'lorem-ipsum'];
      await setselectedValue(idsMenu2, notExpected, group2);
      value = await getselectedValues(idsMenu2);
      await expect(value.length).toBe(2);
      await expect(value.selected).toEqual(expected);
    });

    test('can get/clear selected items in a specific group', async ({ page }) => {
      let value;
      let group2;
      await page.evaluate(() => {
        group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        const group3 = document.querySelector<IdsMenuGroup>('#more-settings')!;
        group2.select = 'multiple';
        group3.select = 'single';
      });
      await idsMenu2.evaluate((menu: IdsMenu) => {
        const item1 = 'document.querySelector("#complex-menu > ids-menu-group > ids-menu-item:nth-child(1)")';
        const item2 = 'document.querySelector("#complex-menu > ids-menu-group > ids-menu-item:nth-child(2)")';
        const item3 = 'document.querySelector("#complex-menu > ids-menu-group > ids-menu-item[value="more-actions"]")';
        menu.selectItem(item1);
        menu.selectItem(item2);
        menu.selectItem(item3);
      });
      await page.getByText('mail').first().click();
      await page.getByText('filter').first().click();
      await page.locator('ids-menu-item[value="more-actions"]').first().click();
      group2 = '#main-settings';

      value = await getselectedItems(idsMenu2, group2);
      await expect(value.length).toEqual(2);

      // Only clear group 2
      await idsMenu2.evaluate((menu: IdsMenu) => {
        group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        menu.clearSelectedItems(group2);
      });
      value = await getAllselectedItems(idsMenu2);
      await expect(value.length).toEqual(1);
    });

    test('can set menu item textAlign', async ({ page }) => {
      let item1;
      item1 = await page.evaluate(() => document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)')?.textAlign);
      await expect(item1).toBe(null);

      await page.evaluate(() => {
        const item = document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)');
        item!.textAlign = 'start';
        item!.setAttribute('text-align', 'start');
      });
      item1 = await page.evaluate(() => document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)')?.textAlign);
      const menuitem1 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)');
      await expect(item1).toBe('start');
      await expect(menuitem1).toHaveAttribute('text-align');
    });

    test('can navigate menu items using the keyboard', async ({ page }) => {
      await page.evaluate(() => {
        const item = document.querySelector('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)');
        item?.focus();
      });
      const menuitem1 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)');
      await expect(menuitem1).toBeFocused();
      await page.evaluate(() => {
        const menu = document.querySelector('#simple-menu');
        const navigateDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        menu?.dispatchEvent(navigateDownEvent);
      });
      const menuitem2 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)');
      await expect(menuitem2).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(menuitem1).toBeFocused();
      await page.keyboard.press('ArrowUp');
      const menuitem3 = await page.locator('#simple-menu > ids-menu-group > ids-menu-item:nth-child(3)');
      await expect(menuitem3).toBeFocused();
    });

    test('tab should not change navigation in the menu', async ({ page }) => {
      await page.evaluate(() => {
        const item = document.querySelector('#complex-menu > ids-menu-group > ids-menu-item:nth-child(1)');
        item?.focus();
      });
      const menuitem1 = await page.getByText('Mail');
      await expect(menuitem1).toBeFocused();

      // Tab should not change navigation in the menu
      await page.evaluate(() => {
        const tabKeyEvent = new KeyboardEvent('keydown', { key: 'Tab' });
        document.body.dispatchEvent(tabKeyEvent);
      });
      await expect(menuitem1).toBeFocused();

      await page.evaluate(() => {
        const menu = document.querySelector('#complex-menu');
        const navigateDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        menu?.dispatchEvent(navigateDownEvent);
      });
      const menuitem2 = await page.getByText('Filter');
      await expect(menuitem2).toBeFocused();

      // Tab should not change navigation in the menu
      await page.evaluate(() => {
        const tabKeyEvent = new KeyboardEvent('keydown', { key: 'Tab' });
        document.body.dispatchEvent(tabKeyEvent);
        document.body.dispatchEvent(tabKeyEvent);
      });
      await expect(menuitem2).toBeFocused();

      // Only focused item should be tabbable
      const tabindex = (el: any) => idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector<IdsMenuItem>(item)
        ?.tabIndex, el);
      await expect(await tabindex('ids-menu-item[value="mail"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="filter"]')).toEqual(0);
      await expect(await tabindex('ids-menu-item[value="settings"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="long-no-icons"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="big-with-icons"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="more-actions"]')).toEqual(-1);

      // Navigate up two items (navigation will wrap to the bottom item)
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await expect(await tabindex('ids-menu-item[value="mail"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="filter"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="settings"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="long-no-icons"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="big-with-icons"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="more-actions"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="even-more-actions"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="no-select"]')).toEqual(-1);
      await expect(await tabindex('ids-menu-item[value="other-items"]')).toEqual(0);
    });

    test('can highlight a menu item on click', async ({ page }) => {
      const menuitem1 = await page.getByText('Mail');
      await menuitem1.click();
      await select('ids-menu-item[value="filter"]');

      const selected = (await getAllselectedItems(idsMenu2)).selected.includes();
      await expect(selected).toBeFalsy();

      const lastNavigated = await idsMenu2.evaluate((menu: IdsMenu) => menu.lastNavigated?.isEqualNode(document.querySelector('ids-menu-item[value="mail"]')));
      await expect(lastNavigated).toBeTruthy();
    });

    test('can get reference to highlighted items at the menu level', async () => {
      // FIXME PLS
      await idsMenu.evaluate(() => document.querySelector<IdsMenuItem>('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)')!.highlight());
      await idsMenu.evaluate(() => document.querySelector<IdsMenuItem>('#simple-menu > ids-menu-group > ids-menu-item:nth-child(2)')!.highlight());
      const highlighted = await idsMenu.evaluate((menu: IdsMenu) => {
        const value = menu.highlighted;
        const menuitem = document.querySelector<IdsMenuItem>('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)');
        return {
          item1: menuitem,
          length: value.length
        };
      });
      await expect(highlighted.length).toBe(2);
      await expect(highlighted.item1).toBeTruthy();
    });

    test('won\'t highlight items that are disabled', async () => {
      await idsMenu.evaluate(() => {
        document.querySelector<IdsMenuItem>('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)')!
          .disabled = true;
      });
      await idsMenu.evaluate(() => document.querySelector<IdsMenuItem>('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)')!.highlight());

      const highlighted = await idsMenu.evaluate((menu: IdsMenu) => {
        const value = menu.highlighted;
        const menuitem = document.querySelector<IdsMenuItem>('#simple-menu > ids-menu-group > ids-menu-item:nth-child(1)')!.highlighted;
        return {
          item1: menuitem,
          length: value.length
        };
      });
      await expect(highlighted.length).toBe(0);
      await expect(highlighted.item1).toBeFalsy();
    });

    test('listens for Enter key on a menu item and stores information', async () => {
      await select('ids-menu-item[value="filter"]');
      await idsMenu2.evaluate(() => {
        const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        const item1 = document.querySelector('ids-menu-item[value="mail"]');
        item1?.dispatchEvent(enterKeyEvent);
      });
      const isItem2seclected = await idsMenu2.evaluate((menu: IdsMenu) => menu.getSelectedItems().includes(document.querySelector('ids-menu-item[value="filter"]')));
      const lastNavigated = await idsMenu2.evaluate((menu: IdsMenu) => menu.lastNavigated?.isEqualNode(document.querySelector('ids-menu-item[value="mail"]')));
      await expect(isItem2seclected).toBeFalsy;
      await expect(lastNavigated).toBeTruthy;
    });

    test('can explain which of its items should be focused', async ({ page }) => {
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'single';
      });
      let focusTarget;
      // Default value is the first available menu item
      focusTarget = await idsMenu2.evaluate((menu: IdsMenu) => menu.focusTarget.isEqualNode(menu.getFirstAvailableItem()));
      await expect(focusTarget).toBeTruthy();

      // If items are selected, the first selected item is the target
      await select('ids-menu-item[value="filter"]');
      focusTarget = await idsMenu2.evaluate((menu: IdsMenu) => menu.focusTarget.isEqualNode(document.querySelector('ids-menu-item[value="filter"]')));
      await expect(focusTarget).toBeTruthy();

      // If a `lastHovered` property is set, this becomes the target
      const lastHovered = await idsMenu2.evaluate((menu: IdsMenu) => {
        menu!.lastHovered = document.querySelector<IdsMenuItem>('ids-menu-item[value="long-no-icons"]');
        return menu.focusTarget.isEqualNode(document.querySelector('ids-menu-item[value="long-no-icons"]'));
      });
      await expect(lastHovered).toBeTruthy();
    });

    test('can get the first available item in the list', async () => {
      // FIXME PLS
      let FirstAvailableItem;
      FirstAvailableItem = await idsMenu2.evaluate((menu: IdsMenu) => menu.getFirstAvailableItem().isEqualNode(document.querySelector('ids-menu-item[value="mail"]')));
      await expect(FirstAvailableItem).toBeTruthy();

      await idsMenu2.evaluate(() => {
        document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!.disabled = true;
        document.querySelector<IdsMenuItem>('ids-menu-item[value="filter"]')!.hidden = true;
      });
      FirstAvailableItem = await idsMenu2.evaluate((menu: IdsMenu) => menu.getFirstAvailableItem().isEqualNode(document.querySelector('ids-menu-item[value="settings"]')));
      await expect(FirstAvailableItem).toBeTruthy();
    });

    test('won\'t select an item at the menu level that is disabled', async () => {
      const menuitem1 = await idsMenu2.evaluate((menu: IdsMenu) => {
        document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!.disabled = true;
        menu.selectItem(document.querySelector('ids-menu-item[value="mail"]'));
        const item1 = document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!.selected;
        return item1;
      });
      await expect(await menuitem1.selected).toBeFalsy();
    });

    test('can be disabled/enabled', async ({ page }) => {
      const isDisabled = await idsMenu2.evaluate((menu: IdsMenu) => {
        menu.disabled = true;
        const classList = menu.container?.classList;
        const item = document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!.disabled;
        return {
          classList,
          item
        };
      });
      const idsmenu = await page.locator('#complex-menu').first();
      await expect(isDisabled.classList[1]).toContain('disabled');
      await expect(idsmenu).toHaveAttribute('disabled');
      await expect(isDisabled.item).toBeTruthy();

      const menu2 = await page.locator('#complex-menu').first();

      const isEnabled = await menu2.evaluate((menu: IdsMenu) => {
        menu.disabled = false;
        const classList = menu.container?.classList;
        const item = document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!;
        return {
          classList,
          item
        };
      });
      await expect(isEnabled.classList).not.toContainEqual({ 1: 'disabled' });
      await expect(idsmenu).not.toHaveAttribute('disabled');
      await expect(isEnabled.item).toBeTruthy();
    });
  });

  test.describe('IdsMenuItem functionality tests', () => {
    const idsMenuItem = async (Menu: IdsMenu, sel: any) => {
      const menuitem = await Menu.evaluate(
        (menu: IdsMenu, Sel: any) => {
          const item = menu.querySelector(Sel)!;
          return {
            sel: item.selected,
            clas: item.container?.classList,
            highlight: item.highlighted
          };
        },
        sel
      );
      return {
        selected: menuitem.sel,
        classList: menuitem.clas,
        highlighted: menuitem.highlight,
      };
    };

    test('can render a new item correctly', async ({ page }) => {
      const newItem = await page.evaluate(() => {
        document.body.innerHTML = '';
        const exampleHTML = `
  <ids-menu-header>My Items</ids-menu-header>
  <ids-menu-group id="primary" select="single">
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="secondary">
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item icon="settings" id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6" value="6">Item 6</ids-menu-item>
  </ids-menu-group>
`;
        const idsmenu = document.createElement('ids-menu-item') as IdsMenuItem;
        document.body.appendChild(idsmenu);
        idsmenu.insertAdjacentHTML('afterbegin', exampleHTML);

        const group1 = document.querySelector('#primary');
        // const group2 = document.querySelector('#secondary');
        // const item1 = document.querySelector('#item1');
        // const item2 = document.querySelector('#item2');
        // const item3 = document.querySelector('#item3');
        // const item4 = document.querySelector('#item4');
        // const item5 = document.querySelector('#item5');
        // const item6 = document.querySelector('#item6');
        const newmenuItem: any = document.createElement('ids-menu-item') as IdsMenuItem;

        newmenuItem.id = 'newitem';
        newmenuItem.disabled = true;
        newmenuItem.icon = 'settings';
        newmenuItem.viewbox = '0 0 20 20';
        newmenuItem.selected = true;
        newmenuItem.value = 1;
        newmenuItem.tabIndex = 1;
        group1!.appendChild(newmenuItem);
        newmenuItem.template();
        return newmenuItem.outerHTML;
      });
      await expect(newItem).toMatchSnapshot({ name: 'ids-menu-item.snap', });
    });

    test('can be disabled/enabled', async ({ page }) => {
      let menuItem1; let
        item;
      item = await idsMenu2.evaluate(() => {
        const item1 = document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!;
        item1.disabled = true;
        const disabled = item1!.disabled;
        const tabIndex = item1?.tabIndex;
        const classList = item1.container?.classList;
        return {
          disabled,
          tabIndex,
          classList
        };
      });
      menuItem1 = await page.locator('ids-menu-item[value="mail"]').first();
      await expect(await item?.classList[2]).toContain('disabled');
      await expect(menuItem1).toHaveAttribute('disabled');
      await expect(item.disabled).toBeTruthy();
      await expect(item.tabIndex).toEqual(-1);

      menuItem1 = await page.locator('ids-menu-item[value="mail"]').first();
      item = await idsMenu2.evaluate(() => {
        const item1 = document.querySelector<IdsMenuItem>('ids-menu-item[value="mail"]')!;
        item1.disabled = false;
        const menuItem = item1!.disabled;
        const tabIndex = item1?.tabIndex;
        const classList = item1.container?.classList;
        return {
          menuItem,
          tabIndex,
          classList
        };
      });

      await expect(await item?.classList).not.toContainEqual('disabled');
      await expect(menuItem1).not.toHaveAttribute('disabled');
      await expect(item.menuItem).toBeFalsy();
      await expect(item.tabIndex).toEqual(0);
    });

    test('can be selected/deselected', async ({ page }) => {
      let menuitem;
      const item1 = 'ids-menu-item[value="mail"]';
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'single';
      });
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => { menu.querySelector(item)!.selected = true; }, item1);
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.selected).toBeTruthy();
      await expect(menuitem.classList[3]).toEqual('selected');

      await idsMenu2.evaluate((menu: IdsMenu, item: any) => { menu.querySelector(item)!.selected = false; }, item1);
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.selected).toBeFalsy();
      await expect(menuitem.classList[3]).not.toEqual('selected');
      await idsMenu2.evaluate((Menu: IdsMenu) => Menu.querySelector('ids-menu-item[value="mail"]')!.setAttribute('selected', 'true'));
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.selected).toBeTruthy();
      await expect(menuitem.classList[3]).toEqual('selected');
      await idsMenu2.evaluate((Menu: IdsMenu) => Menu.querySelector('ids-menu-item[value="mail"]')!.setAttribute('selected', 'false'));
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.selected).toBeFalsy();
      await expect(menuitem.classList[3]).not.toEqual('selected');
      await idsMenu2.evaluate((Menu: IdsMenu) => Menu.querySelector('ids-menu-item[value="mail"]')!.removeAttribute('selected'));
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.selected).toBeFalsy();
      await expect(menuitem.classList[3]).toBeFalsy();
    });

    test('can be highlighted/unhighlighted programmatically', async ({ page }) => {
      let menuitem;
      const item1 = 'ids-menu-item[value="mail"]';
      await page.evaluate(() => {
        const group2 = document.querySelector<IdsMenuGroup>('#complex-menu > ids-menu-group')!;
        group2.select = 'single';
      });
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => { menu.querySelector(item)!.highlighted = true; }, item1);
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.highlighted).toBeTruthy();
      await expect(menuitem.classList[3]).toEqual('highlighted');

      await idsMenu2.evaluate((menu: IdsMenu, item: any) => { menu.querySelector(item)!.highlighted = false; }, item1);
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.highlighted).toBeFalsy();
      await expect(menuitem.classList[3]).not.toEqual('highlighted');
      await idsMenu2.evaluate((Menu: IdsMenu) => Menu.querySelector('ids-menu-item[value="mail"]')!.setAttribute('highlighted', 'true'));
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.highlighted).toBeTruthy();
      await expect(menuitem.classList[3]).toEqual('highlighted');
      await idsMenu2.evaluate((Menu: IdsMenu) => Menu.querySelector('ids-menu-item[value="mail"]')!.setAttribute('highlighted', 'false'));
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.highlighted).toBeFalsy();
      await expect(menuitem.classList[3]).not.toEqual('highlighted');
      await idsMenu2.evaluate((Menu: IdsMenu) => Menu.querySelector('ids-menu-item[value="mail"]')!.removeAttribute('highlighted'));
      menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.highlighted).toBeFalsy();
      await expect(menuitem.classList[3]).toBeFalsy();
    });

    test('cannot be highlighted if it\'s disabled', async () => {
      const item1 = 'ids-menu-item[value="mail"]';
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.disabled = true;
        menu.querySelector(item)!.highlighted = true;
      }, item1);

      const menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.highlighted).toBeFalsy();
      await expect(menuitem.classList[3]).not.toEqual('highlighted');
    });

    test('can have an icon set/removed', async ({ page }) => {
      let icon: any;
      const item1 = 'ids-menu-item[value="mail"]';
      const item1icon = await page.locator('ids-menu-item[value="mail"] > ids-icon');
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.icon = 'settings';
      }, item1);
      icon = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.icon, item1);
      expect(icon).toEqual('settings');
      expect(await item1icon.count()).toEqual(1);
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.icon = null;
      }, item1);
      icon = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.icon, item1);
      expect(icon).toBeUndefined();
      expect(await item1icon.count()).toEqual(0);
    });

    test('can have an icon viewbox set/removed', async ({ page }) => {
      let icon: any;
      let viewbox: any;
      const item1 = 'ids-menu-item[value="mail"]';
      const item1icon = await page.locator('ids-menu-item[value="mail"] > ids-icon');
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.icon = 'settings';
        menu.querySelector(item)!.viewbox = '0 0 20 20';
      }, item1);
      icon = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.icon, item1);
      viewbox = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.viewbox, item1);
      expect(icon).toEqual('settings');
      expect(viewbox).toBe('0 0 20 20');
      expect(await item1icon.count()).toEqual(1);
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.viewbox = null;
      }, item1);
      icon = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.icon, item1);
      viewbox = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.viewbox, item1);
      expect(icon).toEqual('settings');
      expect(viewbox).toBe(null);
      expect(await item1icon.count()).toEqual(1);
    });

    test('can set tabindex', async () => {
      let tabIndex: any;
      const item1 = 'ids-menu-item[value="mail"]';
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.tabIndex = '-1';
      }, item1);
      tabIndex = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.tabIndex, item1);
      expect(tabIndex).toEqual(-1);
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.tabIndex = '0';
      }, item1);
      tabIndex = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.tabIndex, item1);
      expect(tabIndex).toEqual(0);
    });

    test('won\'t change a tabIndex that isn\'t different', async () => {
      const item1 = 'ids-menu-item[value="mail"]';
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.attributeChangedCallback('tabindex', '0', '0');
      }, item1);
      const tabIndex = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.tabIndex, item1);
      expect(tabIndex).toEqual(0);
    });

    test('can get text content', async ({ page }) => {
      const item1 = 'ids-menu-item[value="mail"]';
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.textContent = 'The First Item';
      }, item1);
      const menuItem1 = await page.locator(item1);
      await expect(menuItem1).toHaveText('The First Item');

      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        menu.querySelector(item)!.innerHTML = '<ids-text font-size="20">The First Item(ids-text)</ids-text>';
      }, item1);
      await expect(menuItem1).toHaveText('The First Item(ids-text)');
    });

    test('can explain what menu it exists within', async () => {
      // FIXME PLS
      const item1 = 'ids-menu-item[value="mail"]';
      const thisMenu = await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        const menuitem = menu.querySelector(item)!;
        const menuEl = menuitem.menu;
        const id = menuEl.id;
        return {
          Menu: menuEl,
          id,
        };
      }, item1);
      const idsmenu = await idsMenu2.evaluate((menu: IdsMenu) => menu, item1);
      expect(thisMenu.Menu).toEqual(idsmenu);
      expect(thisMenu.id).toEqual('complex-menu');
    });

    test('can explain what group it exists within', async () => {
      const item1 = 'ids-menu-item[value="mail"]';
      const thisGroup = await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        const menuitem = menu.querySelector(item)!;
        const group = menuitem.group;
        const id = group.id;
        return {
          group,
          id,
        };
      }, item1);
      const menuGroup = await idsMenu2.evaluate((menu: IdsMenu) => menu.querySelector('#main-settings'), item1);
      expect(thisGroup.group).toEqual(menuGroup);
      expect(thisGroup.id).toEqual('main-settings');
    });

    test('can get/set a value (property only)', async () => {
      let menuitemValue: any;
      const item1 = 'ids-menu-item[value="mail"]';
      menuitemValue = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.value, item1);
      expect(menuitemValue).toEqual('mail');
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => { menu.querySelector(item)!.value = 1; }, item1);
      menuitemValue = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.value, item1);
      expect(menuitemValue).toEqual(1);
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => { menu.querySelector(item)!.value = true; }, item1);
      menuitemValue = await idsMenu2.evaluate((menu: IdsMenu, item: any) => menu.querySelector(item)!.value, item1);
      expect(menuitemValue).toEqual(true);
      expect(menuitemValue).toBeTruthy();
    });

    test('can cancel selection with a vetoed `beforeselected` event handler', async () => {
      const item1 = 'ids-menu-item[value="mail"]';
      await idsMenu2.evaluate((menu: IdsMenu, item: any) => {
        const Menuitem = menu.querySelector(item)!;
        Menuitem.addEventListener('beforeselected', (e: any) => {
          e.detail.response(false);
          Menuitem.select();
        });
        Menuitem.select();
      }, item1);
      const menuitem = await idsMenuItem(idsMenu2, item1);
      await expect(menuitem.selected).toBeFalsy();
    });
  });
});
