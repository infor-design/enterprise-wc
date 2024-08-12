import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsListBuilder from '../../src/components/ids-list-builder/ids-list-builder';

test.describe('IdsListBuilder tests', () => {
  const url = '/ids-list-builder/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS List Builder Component');
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
        .disableRules(['aria-required-children', 'aria-required-parent'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-list-builder');
      const html = await handle?.evaluate((el: IdsListBuilder) => el?.outerHTML);
      await expect(html).toMatchSnapshot('list-builder-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto(url);
      await page.waitForLoadState();
      await page.waitForSelector('#id_item_20');
      await percySnapshot(page, 'ids-list-builder-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can render empty list builder with no errors', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const list = document.createElement('ids-list-builder') as IdsListBuilder;
        list.id = 'list-test';
        list.virtualScroll = true;
        document.querySelector('ids-container')!.appendChild(list);
      });

      await expect(page.locator('#list-test')).toBeAttached();
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can inject template and sets data correctly', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const html = `<ids-list-builder selectable="single" id="list-test"></ids-list-builder>`;
        const template = document.createElement('template');
        template.innerHTML = html;
        document.querySelector('ids-container')!.appendChild(template.content.childNodes[0]);
      });

      await expect(page.locator('#list-test')).toBeAttached();
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can render the header', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      await page.waitForSelector('ids-toolbar');
      await expect(listBuilder.locator('ids-toolbar')).toBeAttached();
    });

    test('can add new item to a populated list', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const addItem = await listBuilder.locator('ids-button[list-builder-action="add"]').first();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const before = await getListCount();
      await listBuilder.waitFor();
      await addItem.click({ delay: 50 });
      expect(await getListCount()).toEqual(before + 1);
    });

    test('can add new item to a empty list created via template', async ({ page }) => {
      await page.evaluate(() => {
        const html = `<ids-list-builder selectable="single" id="list-test"></ids-list-builder>`;
        const template = document.createElement('template');
        template.innerHTML = html;
        document.querySelector('ids-container')!.appendChild(template.content.childNodes[0]);
      });
      const listBuilder = page.locator('#list-test');
      await listBuilder.waitFor();
      const addItem = await listBuilder.locator('ids-button[list-builder-action="add"]');
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      await listBuilder.waitFor();
      const before = await getListCount();
      await addItem.click({ delay: 50 });
      expect(await getListCount()).toEqual(before + 1);
    });

    test('can edit item in the list', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const editItem = await listBuilder.locator('ids-button[list-builder-action="edit"]');
      const firstItem = await listBuilder.locator('ids-swappable-item').first();
      const defText = (await firstItem.textContent())!.trim();
      const input = await firstItem.locator('ids-input input[part="input"]').first();

      await listBuilder.waitFor();
      await firstItem.click({ delay: 50 });
      await editItem.click({ delay: 50 });
      await input.waitFor();
      // pressSequentially isntead of fill
      await input.pressSequentially('New Item Edit');
      await page.keyboard.press('Enter', { delay: 50 });
      await expect(firstItem).not.toHaveText(defText);
      await expect(firstItem).toHaveText('New Item Edit');
    });

    test('can delete item in the list', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const deleteItem = await listBuilder.locator('ids-button[list-builder-action="delete"]');
      const firstItem = await listBuilder.locator('#id_item_1');
      await listBuilder.waitFor();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const defCount = await getListCount();

      await expect(firstItem).toBeAttached();
      await firstItem.click({ delay: 50 });
      await deleteItem.click({ delay: 50 });
      await expect(firstItem).not.toBeAttached();
      expect(await getListCount()).toEqual(defCount - 1);
    });

    test('can move items up the list', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const moveUp = await listBuilder.locator('ids-button[list-builder-action="move-up"]');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');
      const defCount = await getListCount();

      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle())
        }
      )).toBeTruthy();
      await secondItem.click({ delay: 50 });
      await moveUp.click({ delay: 50 });
      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[1].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[0].elementHandle())
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can move items down the list', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const moveDown = await listBuilder.locator('ids-button[list-builder-action="move-down"]');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');
      const defCount = await getListCount();

      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle())
        }
      )).toBeTruthy();
      await firstItem.click({ delay: 50 });
      await moveDown.click({ delay: 50 });
      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[1].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[0].elementHandle())
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can cancel editing using escape key', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const editItem = await listBuilder.locator('ids-button[list-builder-action="edit"]');
      const firstItem = await listBuilder.locator('ids-swappable-item').first();
      const defText = (await firstItem.textContent())!.trim();
      const input = await firstItem.locator('ids-input input[part="input"]').first();

      await firstItem.click({ delay: 50 });
      await editItem.click({ delay: 50 });
      await input.waitFor();
      // pressSequentially isntead of fill
      await input.pressSequentially('New Item Edit');
      await page.keyboard.press('Escape', { delay: 50 });
      await expect(firstItem).toHaveText(defText);
      await expect(firstItem).not.toHaveText('New Item Edit');
    });

    test('can edit using using enter key', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const firstItem = await listBuilder.locator('#id_item_1');
      const input = await firstItem.locator('ids-input input[part="input"]').first();
      const defText = (await firstItem.textContent())!.trim();

      await firstItem.press('Enter', { delay: 50 });
      await input.waitFor();
      // pressSequentially isntead of fill
      await input.pressSequentially('New Item Edit');
      await page.keyboard.press('Enter', { delay: 50 });
      await expect(firstItem).not.toHaveText(defText);
      await expect(firstItem).toHaveText('New Item Edit');
    });

    test('can delete item using delete key', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const firstItem = await listBuilder.locator('#id_item_1');
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const defCount = await getListCount();

      await expect(firstItem).toBeAttached();
      await firstItem.click({ delay: 50 });
      await page.keyboard.press('Delete', { delay: 50 });
      await expect(firstItem).not.toBeAttached();
      expect(await getListCount()).toEqual(defCount - 1);
    });

    test('can set/get selectable', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');

      expect(await listBuilder.evaluate((element: IdsListBuilder) => element.selectable)).toEqual('single');
      await expect(listBuilder).toHaveAttribute('selectable', 'single');

      expect(await listBuilder.evaluate((element: IdsListBuilder) => {
        element.selectable = 'multiple';
        return element.selectable;
      })).toEqual('multiple');
      await expect(listBuilder).toHaveAttribute('selectable', 'multiple');

      expect(await listBuilder.evaluate((element: IdsListBuilder) => {
        element.selectable = 'mixed';
        return element.selectable;
      })).toEqual('mixed');
      await expect(listBuilder).toHaveAttribute('selectable', 'mixed');
    });

    test('can select single item only', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');

      await firstItem.click({ delay: 50 });
      await secondItem.click({ delay: 50 });

      await expect(firstItem).not.toHaveAttribute('selected');
      await expect(secondItem).toHaveAttribute('selected');
    });

    test('can select multiple items', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');

      await listBuilder.evaluate((element: IdsListBuilder) => { element.selectable = 'multiple'; });

      await firstItem.click({ delay: 50 });
      await secondItem.click({ delay: 50 });

      await expect(firstItem).toHaveAttribute('selected');
      await expect(secondItem).toHaveAttribute('selected');
    });

    test('can show/hide checkboxes', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const validateCheckboxes = async (isHidden = true) => {
        const items = await listBuilder.locator('ids-swappable-item').all();
        for (let i = 0; i < items.length; i++) {
          if (isHidden) {
            await expect(items[i].locator('ids-checkbox').first()).toHaveAttribute('hide');
          } else {
            await expect(items[i].locator('ids-checkbox').first()).not.toHaveAttribute('hide');
          }
        }
      };
      await validateCheckboxes();
      await listBuilder.evaluate((element: IdsListBuilder) => { element.hideCheckboxes = false; });
      await validateCheckboxes(false);
    });

    test('can delete multiple items', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const deleteItem = await listBuilder.locator('ids-button[list-builder-action="delete"]');
      const firstItem = await listBuilder.locator('#id_item_1 ids-list-view-item');
      const secondItem = await listBuilder.locator('#id_item_2 ids-list-view-item');
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const defCount = await getListCount();

      await listBuilder.evaluate((element: IdsListBuilder) => { element.selectable = 'multiple'; });

      await expect(firstItem).toBeAttached();
      await expect(secondItem).toBeAttached();
      await firstItem.click({ delay: 50 });
      await secondItem.click({ delay: 50 });
      await deleteItem.click({ delay: 50 });
      await expect(firstItem).not.toBeAttached();
      await expect(secondItem).not.toBeAttached();
      expect(await getListCount()).toEqual(defCount - 2);
    });

    test('can move up multiple items', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const moveUp = await listBuilder.locator('ids-button[list-builder-action="move-up"]');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');
      const thirdItem = await listBuilder.locator('#id_item_3');
      const fourthItem = await listBuilder.locator('#id_item_4');
      const defCount = await getListCount();

      await listBuilder.evaluate((element: IdsListBuilder) => {
        element.hideCheckboxes = true;
        element.selectable = 'multiple';
      });

      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight)
        && handles.thirdLeft?.isSameNode(handles.thirdRight)
        && handles.fourthLeft?.isSameNode(handles.fourthRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle()),
          thirdLeft: (await thirdItem.elementHandle()),
          thirdRight: (await allItems[2].elementHandle()),
          fourthLeft: (await fourthItem.elementHandle()),
          fourthRight: (await allItems[3].elementHandle())
        }
      )).toBeTruthy();
      await thirdItem.locator('ids-list-view-item').click({ delay: 50 });
      await fourthItem.locator('ids-list-view-item').click({ delay: 50 });
      await moveUp.click({ delay: 50 });
      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight)
        && handles.thirdLeft?.isSameNode(handles.thirdRight)
        && handles.fourthLeft?.isSameNode(handles.fourthRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[3].elementHandle()),
          thirdLeft: (await thirdItem.elementHandle()),
          thirdRight: (await allItems[1].elementHandle()),
          fourthLeft: (await fourthItem.elementHandle()),
          fourthRight: (await allItems[2].elementHandle())
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can move down multiple items', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const moveDown = await listBuilder.locator('ids-button[list-builder-action="move-down"]');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');
      const thirdItem = await listBuilder.locator('#id_item_3');
      const fourthItem = await listBuilder.locator('#id_item_4');
      const defCount = await getListCount();

      await listBuilder.evaluate((element: IdsListBuilder) => {
        element.hideCheckboxes = true;
        element.selectable = 'multiple';
      });

      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight)
        && handles.thirdLeft?.isSameNode(handles.thirdRight)
        && handles.fourthLeft?.isSameNode(handles.fourthRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle()),
          thirdLeft: (await thirdItem.elementHandle()),
          thirdRight: (await allItems[2].elementHandle()),
          fourthLeft: (await fourthItem.elementHandle()),
          fourthRight: (await allItems[3].elementHandle())
        }
      )).toBeTruthy();
      await firstItem.locator('ids-list-view-item').click({ delay: 50 });
      await secondItem.locator('ids-list-view-item').click({ delay: 50 });
      await moveDown.click({ delay: 50 });
      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight)
        && handles.thirdLeft?.isSameNode(handles.thirdRight)
        && handles.fourthLeft?.isSameNode(handles.fourthRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[1].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[2].elementHandle()),
          thirdLeft: (await thirdItem.elementHandle()),
          thirdRight: (await allItems[0].elementHandle()),
          fourthLeft: (await fourthItem.elementHandle()),
          fourthRight: (await allItems[3].elementHandle())
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can move items up the start of the list in multiple selection', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const moveUp = await listBuilder.locator('ids-button[list-builder-action="move-up"]');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const lastItem = await listBuilder.locator('#id_item_20');
      const secondItem = await listBuilder.locator('#id_item_2');
      const defCount = await getListCount();

      await listBuilder.evaluate((element: IdsListBuilder) => {
        element.hideCheckboxes = true;
        element.selectable = 'multiple';
      });

      expect(await page.evaluate(
        (handles) => handles.lastLeft?.isSameNode(handles.lastRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle()),
          lastLeft: (await lastItem.elementHandle()),
          lastRight: (await allItems[19].elementHandle()),
        }
      )).toBeTruthy();
      await secondItem.locator('ids-list-view-item').click({ delay: 50 });
      await lastItem.locator('ids-list-view-item').click({ delay: 50 });
      await moveUp.click({ delay: 50 });
      expect(await page.evaluate(
        (handles) => handles.lastLeft?.isSameNode(handles.lastRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[0].elementHandle()),
          lastLeft: (await lastItem.elementHandle()),
          lastRight: (await allItems[1].elementHandle()),
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can move items down the end of the list in multiple selection', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const moveDown = await listBuilder.locator('ids-button[list-builder-action="move-down"]');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const lastItem = await listBuilder.locator('#id_item_19');
      const secondItem = await listBuilder.locator('#id_item_2');
      const defCount = await getListCount();

      await listBuilder.evaluate((element: IdsListBuilder) => {
        element.hideCheckboxes = true;
        element.selectable = 'multiple';
      });

      expect(await page.evaluate(
        (handles) => handles.lastLeft?.isSameNode(handles.lastRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle()),
          lastLeft: (await lastItem.elementHandle()),
          lastRight: (await allItems[18].elementHandle()),
        }
      )).toBeTruthy();
      await secondItem.locator('ids-list-view-item').click({ delay: 50 });
      await lastItem.locator('ids-list-view-item').click({ delay: 50 });
      await moveDown.click({ delay: 50 });
      expect(await page.evaluate(
        (handles) => handles.lastLeft?.isSameNode(handles.lastRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[18].elementHandle()),
          lastLeft: (await lastItem.elementHandle()),
          lastRight: (await allItems[19].elementHandle()),
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can add item programmatically', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const defCount = await getListCount();

      await listBuilder.evaluate((element: IdsListBuilder) => element.add());
      expect(await getListCount()).toEqual(defCount + 1);
    });

    test('can delete item programmatically', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const firstItem = await listBuilder.locator('#id_item_1');
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const defCount = await getListCount();

      await expect(firstItem).toBeAttached();
      await firstItem.click({ delay: 50 });
      await listBuilder.evaluate((element: IdsListBuilder) => element.delete());
      await expect(firstItem).not.toBeAttached();
      expect(await getListCount()).toEqual(defCount - 1);
    });

    test('can move items up the list programmatically', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');
      const defCount = await getListCount();

      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle())
        }
      )).toBeTruthy();
      await secondItem.click({ delay: 50 });
      await listBuilder.evaluate((element: IdsListBuilder) => element.moveUp());
      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[1].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[0].elementHandle())
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can move items down the list programmatically', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const allItems = await listBuilder.locator('ids-swappable-item').all();
      const getListCount = async () => (await listBuilder.locator('ids-swappable-item').all()).length;
      const firstItem = await listBuilder.locator('#id_item_1');
      const secondItem = await listBuilder.locator('#id_item_2');
      const defCount = await getListCount();

      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[0].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[1].elementHandle())
        }
      )).toBeTruthy();
      await firstItem.click({ delay: 50 });
      await listBuilder.evaluate((element: IdsListBuilder) => element.moveDown());
      expect(await page.evaluate(
        (handles) => handles.firstLeft?.isSameNode(handles.firstRight)
        && handles.secondLeft?.isSameNode(handles.secondRight),
        {
          firstLeft: (await firstItem.elementHandle()),
          firstRight: (await allItems[1].elementHandle()),
          secondLeft: (await secondItem.elementHandle()),
          secondRight: (await allItems[0].elementHandle())
        }
      )).toBeTruthy();
      expect(defCount).toEqual(await getListCount());
    });

    test('can get parent element', async ({ page }) => {
      expect(await page.locator('#list-builder-1').evaluate((element: IdsListBuilder) => element.parentEl)).toBeTruthy();
    });

    test('can get toolbar', async ({ page }) => {
      expect(await page.locator('#list-builder-1').evaluate((element: IdsListBuilder) => element.toolbar)).toBeTruthy();
    });

    test('can set/get data and dataKeys', async ({ page }) => {
      const listBuilder = await page.locator('#list-builder-1');
      const data = [
        { id: '1', manufacturerName: 'Leeroy' },
        { id: '2', manufacturerName: 'Jenkins' },
        { id: '3', manufacturerName: 'Test' },
        { id: '4', manufacturerName: 'Another' },
        { id: '5', manufacturerName: 'World' },
        { id: '6', manufacturerName: 'New' }
      ];

      expect(await listBuilder.evaluate((element: IdsListBuilder, tData) => {
        element.data = tData;
        element.dataKeys = [...element.dataKeys, 'id'];
        return element.data;
      }, data)).toEqual(data);
    });
  });
});
