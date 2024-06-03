import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSwappable from '../../src/components/ids-swappable/ids-swappable';

test.describe('IdsSwappable tests', () => {
  const url = '/ids-swappable/example.html';
  let idsSwappable: any;
  let idsSwappableMultiple: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    idsSwappable = await page.locator('ids-swappable').first();
    idsSwappableMultiple = await page.locator('ids-swappable').nth(1);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Swappable Component');
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
      const handle = await page.$('ids-swappable');
      const html = await handle?.evaluate((el: IdsSwappable) => el?.outerHTML);
      await expect(html).toMatchSnapshot('swappable-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-swappable');
      const html = await handle?.evaluate((el: IdsSwappable) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('swappable-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-swappable-light');
    });
  });

  test.describe('functionality tests', () => {
    const HTMLSnippets = {
      SWAPPABLE_COMPONENT: (
        `<ids-swappable id="swappable-1" selection="multiple">
          <ids-swappable-item></ids-swappable-item>
          <ids-swappable-item></ids-swappable-item>
          <ids-swappable-item></ids-swappable-item>
          <ids-swappable-item></ids-swappable-item>
        </ids-swappable>`
      ),
      SWAPPABLE_COMPONENT_2: (
        `<ids-swappable id="swappable-2">
          <ids-swappable-item></ids-swappable-item>
          <ids-swappable-item></ids-swappable-item>
          <ids-swappable-item></ids-swappable-item>
          <ids-swappable-item></ids-swappable-item>
        </ids-swappable>`
      ),
    };
    test('can select ids-swappable-item', async () => {
      let startingItem = await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        const selected = firstItem.selected;
        const originalText = firstItem.originalText;
        return {
          selected,
          originalText
        };
      });
      await expect(startingItem.selected).toBe(false);
      await expect(startingItem.originalText).toBeNull();
      await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        firstItem.selected = true;
        firstItem.originalText = 'Test Text';
      });
      startingItem = await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        const selected = firstItem.selected;
        const originalText = firstItem.originalText;
        return {
          selected,
          originalText
        };
      });
      await expect(startingItem.selected).toBe(true);
      await expect(startingItem.originalText).toBe('Test Text');
      expect(await idsSwappable.locator('[selected]').all()).toHaveLength(1);
      await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        firstItem.selected = '';
        firstItem.removeAttribute('selected');
      });
      startingItem = await idsSwappable.evaluate((el: IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        const selected = firstItem.selected;
        const originalText = firstItem.originalText;
        return {
          selected,
          originalText
        };
      });
      await expect(startingItem.selected).toBe(false);
      await idsSwappable.evaluate((el: IdsSwappable, innerHTML: any) => {
        el?.remove?.();
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        idsSwappable = template.content.childNodes[0];

        document.body.appendChild(idsSwappable);
      }, HTMLSnippets.SWAPPABLE_COMPONENT_2);
      startingItem = await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        const selected = firstItem.selected;
        const originalText = firstItem.originalText;
        return {
          selected,
          originalText
        };
      });
      await expect(startingItem.selected).toBe(false);
      await expect(startingItem.originalText).toBeNull();
      expect(await idsSwappable.locator('[selected]').all()).toHaveLength(0);
      await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        firstItem.selected = true;
        firstItem.originalText = 'Test Text';
      });
      startingItem = await idsSwappable.evaluate((el: IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        const selected = firstItem.selected;
        const originalText = firstItem.originalText;
        return {
          selected,
          originalText
        };
      });
      await expect(startingItem.selected).toBe(true);
      await expect(startingItem.originalText).toBe('Test Text');
      await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        firstItem.selected = '';
        firstItem.removeAttribute('selected');
      });
      startingItem = await idsSwappable.evaluate((el: IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        const selected = firstItem.selected;
        const originalText = firstItem.originalText;
        return {
          selected,
          originalText
        };
      });
      await expect(startingItem.selected).toBe(false);
    });

    test('can toggle select on ids-swappable-items', async () => {
      const item = await idsSwappable.locator('ids-swappable-item').first();
      await item.dispatchEvent('click');
      await item.click();
      await idsSwappable.evaluate((el: IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item');
        const startingItem = items[0] as any;
        startingItem.selected = true;
      });
      let selected = await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        return firstItem.selected;
      });
      await expect(selected).toBe(true);
      await expect(item).toHaveAttribute('selected', '');
      await item.dispatchEvent('click');
      await item.click();
      await idsSwappable.evaluate((el: IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item');
        const startingItem = items[0] as any;
        startingItem.selected = false;
      });
      selected = await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        return firstItem.selected;
      });
      await expect(selected).toBe(false);
      await expect(item).not.toHaveAttribute('selected');
      await item.dispatchEvent('click');
      await item.click();
      await idsSwappable.evaluate((el: IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item');
        const startingItem = items[0] as any;
        startingItem.removeAttribute('selected');
      });
      selected = await idsSwappable.evaluate((el:IdsSwappable) => {
        const items = el.querySelectorAll('ids-swappable-item') as any;
        const firstItem = items[0];
        return firstItem.selected;
      });
      await expect(selected).toBe(false);
      await expect(item).not.toHaveAttribute('selected');
    });

    test('can get drag and drop item', async () => {
      const data = [{ text: 'Swappable Item 2' },
        { text: 'Swappable Item 3' },
        { text: 'Swappable Item 1' },
      ];

      await idsSwappable.evaluate((el: IdsSwappable) => {
        const createBubbledEvent = (type: any, props = {}) => {
          const event = new Event(type, { bubbles: true });
          Object.assign(event, props);
          return event;
        };
        const items = el.querySelectorAll('ids-swappable-item');
        const startingItem = items[0] as any;
        const endingItem = items[2] as any;

        el.dispatchEvent(
          createBubbledEvent('dragstart', {})
        );
        startingItem.dispatchEvent(
          createBubbledEvent('dragstart', { selected: true })
        );

        endingItem.dispatchEvent(
          createBubbledEvent('dragend', {})
        );

        startingItem.dispatchEvent(
          createBubbledEvent('drag', { selected: true })
        );
        el.dispatchEvent(
          createBubbledEvent('dragover', {})
        );

        endingItem.dispatchEvent(
          createBubbledEvent('dragover', {})
        );

        el.dispatchEvent(
          createBubbledEvent('drop', {})
        );

        endingItem.dispatchEvent(
          createBubbledEvent('drop', {})
        );

        el.dispatchEvent(
          createBubbledEvent('dragleave', {})
        );

        startingItem.dispatchEvent(
          createBubbledEvent('dragleave', {})
        );

        endingItem.dispatchEvent(
          createBubbledEvent('dragend', {})
        );
      });
      const items = await idsSwappable.locator('ids-swappable-item').all();
      let i = 0;
      for (const item of items) {
        const text = await item.innerHTML();
        await expect(text).toContain(data[i].text);
        i++;
      }
    });

    test('can get drag and drop item swappable multiple', async () => {
      const data = [{ text: 'Swappable Item 2' },
        { text: 'Swappable Item 3' },
        { text: 'Swappable Item 4' },
        { text: 'Swappable Item 5' },
        { text: 'Swappable Item 6' },
        { text: 'Swappable Item 1' },
      ];

      await idsSwappableMultiple.evaluate((el: IdsSwappable) => {
        const createBubbledEvent = (type: any, props = {}) => {
          const event = new Event(type, { bubbles: true });
          Object.assign(event, props);
          return event;
        };
        const items = el.querySelectorAll('ids-swappable-item');
        const startingItem = items[0] as any;
        const endingItem = items[2] as any;

        el.dispatchEvent(
          createBubbledEvent('dragstart', {})
        );
        startingItem.dispatchEvent(
          createBubbledEvent('dragstart', { selected: true })
        );

        endingItem.dispatchEvent(
          createBubbledEvent('dragend', {})
        );

        startingItem.dispatchEvent(
          createBubbledEvent('drag', { selected: true })
        );
        el.dispatchEvent(
          createBubbledEvent('dragover', {})
        );

        endingItem.dispatchEvent(
          createBubbledEvent('dragover', {})
        );

        el.dispatchEvent(
          createBubbledEvent('drop', {})
        );

        endingItem.dispatchEvent(
          createBubbledEvent('drop', {})
        );

        el.dispatchEvent(
          createBubbledEvent('dragleave', {})
        );

        startingItem.dispatchEvent(
          createBubbledEvent('dragleave', {})
        );

        endingItem.dispatchEvent(
          createBubbledEvent('dragend', {})
        );
      });
      const items = await idsSwappableMultiple.locator('ids-swappable-item').all();
      let i = 0;
      for (const item of items) {
        const text = await item.innerHTML();
        await expect(text).toContain(data[i].text);
        i++;
      }
    });

    test('can use keyboard events to navigate items', async () => {
      const firstItem = await idsSwappable.locator('ids-swappable-item').first();
      await firstItem.click();
      await idsSwappable.press('ArrowDown');
      await idsSwappable.press('Enter');
      const secondItem = await idsSwappable.locator('ids-swappable-item').nth(1);
      await expect(secondItem).toHaveAttribute('selected', '');
      await idsSwappable.press('ArrowDown');
      await idsSwappable.press('Enter');
      const thirdItem = await idsSwappable.locator('ids-swappable-item').nth(2);
      await expect(thirdItem).toHaveAttribute('selected', '');
      const selectedItems = await idsSwappable.evaluate((el: IdsSwappable) => el.selectedItems.length);
      await expect(selectedItems).toBe(1);
    });

    test('can use keyboard events to navigate items in swappable multiple', async () => {
      const firstItemMultiple = await idsSwappableMultiple.locator('ids-swappable-item').first();
      await firstItemMultiple.click();
      await idsSwappableMultiple.press('ArrowDown');
      await idsSwappableMultiple.press('Enter');
      const secondItemMultiple = await idsSwappableMultiple.locator('ids-swappable-item').nth(1);
      await expect(secondItemMultiple).toHaveAttribute('selected', '');
      await idsSwappableMultiple.press('ArrowDown');
      await idsSwappableMultiple.press('Enter');
      const thirdItemMultiple = await idsSwappableMultiple.locator('ids-swappable-item').nth(2);
      await expect(thirdItemMultiple).toHaveAttribute('selected', '');
      const selectedItems = await idsSwappableMultiple.evaluate((el: IdsSwappable) => el.selectedItems.length);
      await expect(selectedItems).toBe(3);
    });
  });
});
