import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsListView from '../../src/components/ids-list-view/ids-list-view';

test.describe('IdsListView tests', () => {
  const url = '/ids-list-view/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
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
  });

  test.describe('event tests', () => {
    test('should fire click event on single selection', async ({ page }) => {
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
  });
});
