import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsToolbar from '../../src/components/ids-toolbar/ids-toolbar';
import IdsToolbarSection from '../../src/components/ids-toolbar/ids-toolbar-section';
import IdsToolbarMoreActions from '../../src/components/ids-toolbar/ids-toolbar-more-actions';

test.describe('IdsToolbar tests', () => {
  const url = '/ids-toolbar/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Toolbar Component');
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
        .disableRules(['nested-interactive'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-toolbar');
      const html = await handle?.evaluate((el: IdsToolbar) => el?.outerHTML);
      await expect(html).toMatchSnapshot('toolbar-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-toolbar');
      const html = await handle?.evaluate((el: IdsToolbar) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('toolbar-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-toolbar-light');
    });
  });

  test.describe('IdsToolbar functionality test', () => {
    let idsToolbar: Locator;

    test.beforeEach(async ({ page }) => {
      idsToolbar = await page.locator('#my-toolbar');
    });

    test('can append early to DOM', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text); });
      await page.evaluate(() => {
        const elem = document.querySelector('ids-toolbar')! as IdsToolbar;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.setAttribute('id', 'toolbar-test');
        elem.tabbable = true;
      });
      await expect(page.locator('#toolbar-test')).toBeAttached();
      expect(errors).toEqual([]);
    });

    test('can append late to DOM', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text); });
      await page.evaluate(() => {
        const elem = document.querySelector('ids-toolbar')! as IdsToolbar;
        elem.setAttribute('id', 'toolbar-test');
        elem.tabbable = true;
        document.querySelector('ids-container')!.appendChild(elem);
      });
      await expect(page.locator('#toolbar-test')).toBeAttached();
      expect(errors).toEqual([]);
    });

    test('can trigger selected event', async ({ eventsTest }) => {
      const button = await idsToolbar.locator('#button-1');
      await eventsTest.onEvent('#button-1', 'selected');
      await button.dispatchEvent('click');
      expect(await eventsTest.isEventTriggered('#button-1', 'selected')).toBeTruthy();
    });

    test('can get list of sections', async () => {
      const availableSections = ['ids-toolbar-section', 'ids-toolbar-more-actions'];
      const sections = await idsToolbar.evaluate((element: IdsToolbar) => {
        const sect = element.sections;
        return { sections: sect, nodeNames: sect.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(sections.sections).toBeTruthy();
      sections.nodeNames.forEach((name) => expect(availableSections.includes(name)).toBeTruthy());
    });

    test('can get list of items', async () => {
      const items = await idsToolbar.evaluate((element: IdsToolbar) => {
        const it = element.items;
        return { items: it, nodeNames: it.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(items.items).toBeTruthy();
      expect(items.items.length).toBeGreaterThan(0);
      items.nodeNames.forEach((name) => expect(name).toContain('ids'));
    });

    test('can set/get disabled', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];
      const container = await idsToolbar.locator('div.ids-toolbar').first();
      // validate children, but only after the section children
      const checkElementsDisabled = async (parent: Locator, isDisabled: boolean) => {
        const sections = ['ids-toolbar-section', 'ids-toolbar-more-actions'];
        const children = await parent.locator(':scope>*').all();
        for (const child of children) {
          const name = (await child.evaluate((node) => node.nodeName)).toLowerCase();
          if (sections.includes(name)) {
            if (isDisabled && name === 'ids-toolbar-more-actions') {
              await expect(child).toHaveAttribute('disabled');
            } else {
              await expect(child).not.toHaveAttribute('disabled');
            }
            const grandChildren = await child.locator(':scope>*').all();
            for (const gChild of grandChildren) {
              const gName = (await gChild.evaluate((node) => node.nodeName)).toLowerCase();
              if (gName.includes('ids')) {
                if (isDisabled) {
                  await expect(gChild).toHaveAttribute('disabled');
                } else {
                  await expect(gChild).not.toHaveAttribute('disabled');
                }
              }
            }
          }
        }
      };

      for (const data of testData) {
        expect(await idsToolbar.evaluate((element: IdsToolbar, tData) => {
          element.disabled = tData as any;
          return element.disabled;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsToolbar).toHaveAttribute('disabled');
          await expect(container).toHaveClass(/disabled/);
        } else {
          await expect(idsToolbar).not.toHaveAttribute('disabled');
          await expect(container).not.toHaveClass(/disabled/);
        }
        await checkElementsDisabled(idsToolbar, data.expected);
      }
    });

    test('can set/get tabbable', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsToolbar.evaluate((element: IdsToolbar) => element.tabbable)).toBeFalsy();
      await expect(idsToolbar).not.toHaveAttribute('tabbable');

      for (const data of testData) {
        expect(await idsToolbar.evaluate((element: IdsToolbar, tData) => {
          element.tabbable = tData as any;
          return element.tabbable;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsToolbar).toHaveAttribute('tabbable');
        } else {
          await expect(idsToolbar).not.toHaveAttribute('tabbable');
        }
      }
    });

    test('can set/get type', async () => {
      const testData = [
        { data: 'formatter', expected: 'formatter' },
        { data: null, expected: null },
        { data: 'test', expected: null },
        { data: '', expected: null }
      ];

      expect(await idsToolbar.evaluate((element: IdsToolbar) => element.type)).toBeNull();
      await expect(idsToolbar).not.toHaveAttribute('type');

      for (const data of testData) {
        expect(await idsToolbar.evaluate((element: IdsToolbar, tData) => {
          element.type = tData;
          return element.type;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsToolbar).toHaveAttribute('type', data.expected);
        } else {
          await expect(idsToolbar).not.toHaveAttribute('type');
        }
      }
    });

    test('can set/get padding', async () => {
      const testData = [
        { data: 50, expected: '50' },
        { data: null, expected: null },
        { data: '30', expected: '30' }
      ];
      const container = await idsToolbar.locator('div.ids-toolbar').first();

      expect(await idsToolbar.evaluate((element: IdsToolbar) => element.padding)).toBeNull();
      await expect(container).toHaveCSS('padding-bottom', /0px/);

      for (const data of testData) {
        expect(await idsToolbar.evaluate((element: IdsToolbar, tData) => {
          element.padding = tData;
          return element.padding;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsToolbar).toHaveAttribute('padding', data.expected);
          await expect(container).toHaveCSS('padding-bottom', new RegExp(`${data.expected}px`));
        } else {
          await expect(idsToolbar).not.toHaveAttribute('padding');
          await expect(container).toHaveCSS('padding-bottom', /0px/);
        }
      }
    });

    test('can navigate and focus child components', async ({ page }) => {
      const navigate = async (amt: any, doFocus: boolean, itemPosToValidate: number) => {
        const result: any = await idsToolbar.evaluate((
          elem: IdsToolbar,
          opt
        ) => {
          const items = elem.items;
          const ret = elem.navigate(opt.amt, opt.doFocus);
          return {
            element: ret,
            isSameNode: ret.isEqualNode(items[opt.itemPosToValidate]),
            isItemFocused: document.activeElement!.isEqualNode(items[opt.itemPosToValidate]),
            itemIndex: items.indexOf(ret)
          };
        }, { amt, doFocus, itemPosToValidate });
        return result;
      };

      // Forward navigation by 1
      let result = await navigate(1, true, 1);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 1 }));
      result = await navigate(1, true, 2);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 2 }));
      result = await navigate(1, true, 3);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 3 }));

      // Backward navigation by 1
      await page.reload();
      result = await navigate(-1, true, 7);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 7 }));
      result = await navigate(-1, true, 6);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 6 }));
      result = await navigate(-1, true, 4);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 4 }));

      // Zero navigation
      await page.reload();
      result = await navigate(0, true, 0);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 0 }));
      result = await navigate(0, true, 0);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: true, itemIndex: 0 }));

      // Invalid navigation amount
      await page.reload();
      result = await navigate('forward', true, 0);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: false, itemIndex: 0 }));
      result = await navigate('forward', true, 0);
      expect(result).toEqual(expect.objectContaining({ isSameNode: true, isItemFocused: false, itemIndex: 0 }));
    });

    test('can navigate using keyboard', async ({ page }) => {
      const menu = await idsToolbar.locator('ids-button[icon="menu"][role="button"] button');
      const button1 = await idsToolbar.locator('#button-1 button');
      const button2 = await idsToolbar.locator('#button-2 button');
      const button3 = await idsToolbar.locator('#button-3 button');

      await menu.focus();

      await page.keyboard.press('ArrowRight');
      await expect(button1).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(button2).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(button3).toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await expect(button2).toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await expect(button1).toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await expect(menu).toBeFocused();
    });

    test('can navigate only on open menu button', async ({ page }) => {
      const button = await idsToolbar.locator('#button-3 button');
      const menu = await idsToolbar.locator('#button-4 button');
      const delBtn = await idsToolbar.locator('#button-6 button');

      await menu.click();

      await page.keyboard.press('ArrowRight');
      await expect(button).not.toBeFocused();
      await expect(delBtn).not.toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await expect(button).not.toBeFocused();
      await expect(delBtn).not.toBeFocused();
    });
  });

  test.describe('IdsToolbarSection functionality test', () => {
    let idsToolbar: Locator;
    let idsButtonSection: Locator;
    let idsTitleSection: Locator;

    test.beforeEach(async ({ page }) => {
      idsToolbar = await page.locator('#my-toolbar');
      await idsToolbar.evaluate((
        node
      ) => {
        node.querySelector('ids-toolbar-section[type="title"]')!.setAttribute('id', 'title-section-test');
        node.querySelector('ids-toolbar-section[type="buttonset"]')!.setAttribute('id', 'button-section-test');
      });
      idsTitleSection = await idsToolbar.locator('#title-section-test');
      idsButtonSection = await idsToolbar.locator('#button-section-test');
    });

    test('can get attributes', async () => {
      expect(await idsButtonSection.evaluate((element: IdsToolbarSection) => element.attributes)).toBeTruthy();
    });

    test('can get list of items', async () => {
      const tagNames = [
        'ids-button',
        'ids-checkbox',
        'ids-input',
        'ids-menu-button',
        'ids-radio',
        'ids-toolbar-more-actions'
      ];
      const items = await idsButtonSection.evaluate((element: IdsToolbarSection) => {
        const it = element.items;
        return { items: it, nodeNames: it.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(items.items).toBeTruthy();
      expect(items.items.length).toBeGreaterThan(0);
      items.nodeNames.forEach((name) => expect(tagNames.includes(name)).toBeTruthy());
    });

    test('can get list of textElems', async () => {
      const tagNames = ['ids-text'];
      const items = await idsTitleSection.evaluate((element: IdsToolbarSection) => {
        const it = element.textElems;
        return { items: it, nodeNames: it.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(items.items).toBeTruthy();
      expect(items.items.length).toBeGreaterThan(0);
      items.nodeNames.forEach((name) => expect(tagNames.includes(name)).toBeTruthy());
    });

    test('can get list of separators', async () => {
      const tagNames = ['ids-separator'];
      const items = await idsTitleSection.evaluate((element: IdsToolbarSection) => {
        element.insertAdjacentHTML('afterbegin', '<ids-separator vertical="true"></ids-separator>');
        element.insertAdjacentHTML('beforeend', '<ids-separator></ids-separator>');
        const it = element.separators;
        return { items: it, nodeNames: it.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(items.items).toBeTruthy();
      expect(items.items.length).toBeGreaterThan(0);
      items.nodeNames.forEach((name) => expect(tagNames.includes(name)).toBeTruthy());
    });

    test('can get toolbar parent', async () => {
      expect(await idsTitleSection.evaluate((element: IdsToolbarSection) => element.toolbar)).toBeTruthy();
      expect(await idsButtonSection.evaluate((element: IdsToolbarSection) => element.toolbar)).toBeTruthy();
    });

    test('can set/get align', async () => {
      const defAlign = 'start';
      const testData = [
        { data: 'center', expected: 'center' },
        { data: 'align-center-even', expected: defAlign },
        { data: 5, expected: defAlign },
        { data: 'start', expected: 'start' },
        { data: '', expected: defAlign },
        { data: null, expected: defAlign }
      ];

      expect(await idsTitleSection.evaluate((element: IdsToolbarSection) => element.align)).toEqual(defAlign);
      await expect(idsTitleSection).not.toHaveAttribute('align');

      for (const data of testData) {
        expect(await idsTitleSection.evaluate((element: IdsToolbarSection, tData) => {
          element.align = tData as any;
          return element.align;
        }, data.data)).toEqual(data.expected);
        if (data.data && [defAlign, 'center', 'center-even', 'end'].includes(data.data.toString())) {
          await expect(idsTitleSection).toHaveAttribute('align', data.expected);
        } else {
          await expect(idsTitleSection).not.toHaveAttribute('align');
        }
      }
    });

    test('can set/get favor', async () => {
      const container = await idsTitleSection.locator('div[part="container"]');
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTitleSection.evaluate((element: IdsToolbarSection) => element.favor)).toBeTruthy();
      await expect(idsTitleSection).toHaveAttribute('favor');
      await expect(container).toHaveClass(/favor/);

      for (const data of testData) {
        expect(await idsTitleSection.evaluate((element: IdsToolbarSection, tData) => {
          element.favor = tData as any;
          return element.favor;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTitleSection).toHaveAttribute('favor');
          await expect(container).toHaveClass(/favor/);
        } else {
          await expect(idsTitleSection).not.toHaveAttribute('favor');
          await expect(container).not.toHaveClass(/favor/);
        }
      }
    });

    test('can set/get inactive', async () => {
      const container = await idsTitleSection.locator('div[part="container"]');
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTitleSection.evaluate((element: IdsToolbarSection) => element.inactive)).toBeFalsy();
      await expect(idsTitleSection).not.toHaveAttribute('inactive');
      await expect(container).not.toHaveClass(/inactive/);

      for (const data of testData) {
        expect(await idsTitleSection.evaluate((element: IdsToolbarSection, tData) => {
          element.inactive = tData as any;
          return element.inactive;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTitleSection).toHaveAttribute('inactive');
          await expect(container).toHaveClass(/inactive/);
        } else {
          await expect(idsTitleSection).not.toHaveAttribute('inactive');
          await expect(container).not.toHaveClass(/inactive/);
        }
      }
    });

    test('can set/get type', async () => {
      const container = await idsTitleSection.locator('div[part="container"]');
      const defType = 'static';
      const testData = [
        { data: 'fluid', expected: 'fluid' },
        { data: 'junk', expected: defType },
        { data: 'more', expected: 'more' },
        { data: '', expected: defType },
        { data: 'button', expected: 'button' },
        { data: null, expected: defType },
        { data: 'buttonset', expected: 'buttonset' },
        { data: 6, expected: defType },
      ];

      expect(await idsTitleSection.evaluate((element: IdsToolbarSection) => element.type)).toEqual('title');
      await expect(idsTitleSection).toHaveAttribute('type', 'title');
      await expect(container).toHaveClass(/title/);

      for (const data of testData) {
        expect(await idsTitleSection.evaluate((element: IdsToolbarSection, tData) => {
          element.type = tData as any;
          return element.type;
        }, data.data)).toEqual(data.expected);
        await expect(idsTitleSection).toHaveAttribute('type', data.expected);
        await expect(container).toHaveClass(new RegExp(data.expected, 'g'));
      }
    });

    test('can set/get toolbarType', async () => {
      const container = await idsTitleSection.locator('div[part="container"]');
      const testData = [
        { data: 'formatter', expected: 'formatter' },
        { data: '', expected: null },
        { data: 'start', expected: null },
        { data: null, expected: null }
      ];

      expect(await idsTitleSection.evaluate((element: IdsToolbarSection) => element.toolbarType)).toBeNull();
      await expect(idsTitleSection).not.toHaveAttribute('toolbar-type');
      await expect(container).not.toHaveClass(/formatter/);

      for (const data of testData) {
        expect(await idsTitleSection.evaluate((element: IdsToolbarSection, tData) => {
          element.toolbarType = tData as any;
          return element.toolbarType;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTitleSection).toHaveAttribute('toolbar-type', data.expected);
          await expect(container).toHaveClass(new RegExp(data.expected, 'g'));
        } else {
          await expect(idsTitleSection).not.toHaveAttribute('toolbar-type');
        }
      }
    });
  });

  test.describe('IdsToolbarMoreActions functionality test', () => {
    let idsToolbar: Locator;
    let idsMoreAction: Locator;

    test.beforeEach(async ({ page }) => {
      idsToolbar = await page.locator('#my-toolbar');
      idsMoreAction = await idsToolbar.locator('ids-toolbar-more-actions').first();
    });

    test('can get button', async () => {
      const button = await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        const node = element.button;
        return { node, nodeName: node!.nodeName.toLowerCase() };
      });
      expect(button).toBeTruthy();
      expect(button.nodeName).toEqual('ids-menu-button');
    });

    test('can get menu', async () => {
      const menu = await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        const node = element.menu;
        return { node, nodeName: node!.nodeName.toLowerCase() };
      });
      expect(menu).toBeTruthy();
      expect(menu.nodeName).toEqual('ids-popup-menu');
    });

    test('can get menuItems', async () => {
      const menuItems = await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        const nodes = element.menuItems;
        return { nodes, nodeName: nodes!.map((node) => node!.nodeName.toLowerCase()) };
      });
      expect(menuItems).toBeTruthy();
      menuItems.nodeName.forEach((name) => expect(name).toEqual('ids-menu-item'));
    });

    test('can get predefinedMenuItems', async () => {
      const menuItems = await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        const nodes = element.predefinedMenuItems;
        return { nodes, nodeName: nodes!.map((node) => node!.nodeName.toLowerCase()) };
      });
      expect(menuItems).toBeTruthy();
      menuItems.nodeName.forEach((name) => expect(name).toEqual('ids-menu-item'));
      expect(menuItems.nodes).toHaveLength(4);
    });

    test('can get overflowMenuItems', async () => {
      const menuItems = await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        const nodes = element.overflowMenuItems;
        return { nodes, nodeName: nodes!.map((node) => node!.nodeName.toLowerCase()) };
      });
      expect(menuItems).toBeTruthy();
      menuItems.nodeName.forEach((name) => expect(name).toEqual('ids-menu-item'));
      expect(menuItems.nodes).toHaveLength(8);
    });

    test('can get toolbar', async () => {
      const toolbar = await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        const node = element.toolbar;
        return { node, nodeName: node!.nodeName.toLowerCase() };
      });
      expect(toolbar.node).toBeTruthy();
      expect(toolbar.nodeName).toEqual('ids-toolbar');
    });

    test('can set/get disabled', async () => {
      const button = await idsMoreAction.locator('ids-menu-button').first();
      const container = await idsMoreAction.locator('div.ids-toolbar-more-actions').first();
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => element.disabled)).toBeFalsy();
      await expect(idsMoreAction).not.toHaveAttribute('disabled');
      await expect(button).not.toHaveAttribute('disabled');
      await expect(container).not.toHaveClass(/disabled/);

      for (const data of testData) {
        expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions, tData) => {
          element.disabled = tData as any;
          return element.disabled;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMoreAction).toHaveAttribute('disabled');
          await expect(button).toHaveAttribute('disabled');
          await expect(container).toHaveClass(/disabled/);
        } else {
          await expect(idsMoreAction).not.toHaveAttribute('disabled');
          await expect(button).not.toHaveAttribute('disabled');
          await expect(container).not.toHaveClass(/disabled/);
        }
      }
    });

    test('can set/get overflow', async () => {
      const testData = [
        { data: 'false', expected: false },
        { data: true, expected: true },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => element.overflow)).toBeTruthy();
      await expect(idsMoreAction).toHaveAttribute('overflow');

      for (const data of testData) {
        expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions, tData) => {
          element.overflow = tData as any;
          return element.overflow;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMoreAction).toHaveAttribute('overflow');
        } else {
          await expect(idsMoreAction).not.toHaveAttribute('overflow');
        }
      }
    });

    test('can set/get toolbarType', async () => {
      const container = await idsMoreAction.locator('div.ids-toolbar-more-actions').first();
      const testData = [
        { data: 'formatter', expected: 'formatter' },
        { data: '', expected: null },
        { data: 'start', expected: null },
        { data: null, expected: null }
      ];

      expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => element.toolbarType)).toBeNull();
      await expect(idsMoreAction).not.toHaveAttribute('toolbar-type');
      await expect(container).not.toHaveClass(/formatter/);

      for (const data of testData) {
        expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions, tData) => {
          element.toolbarType = tData as any;
          return element.toolbarType;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMoreAction).toHaveAttribute('toolbar-type', data.expected);
          await expect(container).toHaveClass(new RegExp(data.expected, 'g'));
        } else {
          await expect(idsMoreAction).not.toHaveAttribute('toolbar-type');
        }
      }
    });

    test('can set/get type', async () => {
      expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => {
        element.type = 'test';
        return element.type;
      })).toEqual('more');
    });

    test('can set/get visible', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => element.visible)).toBeFalsy();
      await expect(idsMoreAction).not.toHaveAttribute('visible');

      for (const data of testData) {
        // Needs two different evalaute for set and get due to timing issue (opening of menu delay)
        // if not, a waiting logic must be implemented before returing the visible value
        await idsMoreAction.evaluate((
          element: IdsToolbarMoreActions,
          tData
        ) => { element.visible = tData as any; }, data.data);
        expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => element.visible)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsMoreAction).toHaveAttribute('visible');
        } else {
          await expect(idsMoreAction).not.toHaveAttribute('visible');
        }
      }
    });

    test('can trigger events on pop up menu', async ({ eventsTest }) => {
      await eventsTest.onEvent('#more-actions-menu', 'selected');
      await eventsTest.onEvent('#more-actions-menu', 'show');
      await eventsTest.onEvent('#more-actions-menu', 'hide');
      await idsMoreAction.locator('button').dispatchEvent('click');
      await idsMoreAction.locator('ids-menu-item[value="2"]').dispatchEvent('click');
      expect(await eventsTest.isEventTriggered('#more-actions-menu', 'selected')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('#more-actions-menu', 'show')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('#more-actions-menu', 'hide')).toBeTruthy();
    });

    test('can call hasEnabledActions', async () => {
      expect(await idsMoreAction.evaluate((element: IdsToolbarMoreActions) => element.hasEnabledActions())).toBeTruthy();
    });
  });
});
