import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPager from '../../src/components/ids-pager/ids-pager';
import IdsPagerButton from '../../src/components/ids-pager/ids-pager-button';

test.describe('IdsPager tests', () => {
  const url = '/ids-pager/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Pager Component');
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
      const handle = await page.$('ids-pager');
      const html = await handle?.evaluate((el: IdsPager) => el?.outerHTML);
      await expect(html).toMatchSnapshot('pager-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-pager');
      const html = await handle?.evaluate((el: IdsPager) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('pager-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-pager-light');
    });
  });

  test.describe('pager button tests', () => {
    test('pager buttons have a type', async ({ page }) => {
      const types = await page.evaluate(() => {
        const elem = document.querySelectorAll<IdsPagerButton>('ids-pager-button');
        return [elem[0].type, elem[1].type, elem[2].type, elem[2].type];
      });
      expect(types[0]).not.toBeFalsy();
      expect(types[1]).not.toBeFalsy();
      expect(types[2]).not.toBeFalsy();
      expect(types[3]).not.toBeFalsy();
    });

    test('pager buttons have an icon type', async ({ page }) => {
      expect(await page.locator('ids-pager-button ids-icon').nth(0).getAttribute('icon')).toBe('first-page');
      expect(await page.locator('ids-pager-button ids-icon').nth(1).getAttribute('icon')).toBe('previous-page');
      expect(await page.locator('ids-pager-button ids-icon').nth(2).getAttribute('icon')).toBe('next-page');
      expect(await page.locator('ids-pager-button ids-icon').nth(3).getAttribute('icon')).toBe('last-page');
    });
  });

  test.describe('IdsPager functionality tests', () => {
    let idsPager: Locator;
    let idsFirst: Locator;
    let idsPrevious: Locator;
    let idsInput: Locator;
    let idsNext: Locator;
    let idsLast: Locator;
    let children: Locator[];

    test.beforeEach(async ({ page }) => {
      idsPager = await page.locator('ids-pager');
      idsFirst = await idsPager.locator('ids-pager-button[first]');
      idsPrevious = await idsPager.locator('ids-pager-button[previous]');
      idsInput = await idsPager.locator('ids-pager-input');
      idsNext = await idsPager.locator('ids-pager-button[next]');
      idsLast = await idsPager.locator('ids-pager-button[last]');
      await idsPager.evaluate((element: IdsPager) => {
        const dropdown = document.createElement('ids-pager-dropdown');
        dropdown.setAttribute('page-size', '20');
        dropdown.setAttribute('slot', 'end');
        element.appendChild(dropdown);
      });
      children = [idsFirst, idsPrevious, idsInput, idsNext, idsLast];
    });

    test('can set/get disabled status', async () => {
      expect(await idsPager.evaluate((element: IdsPager) => element.disabled)).toBeFalsy();
      children.forEach(async (child) => {
        await expect(child).not.toHaveAttribute('disabled');
        await expect(child).not.toHaveAttribute('parent-disabled');
      });

      expect(await idsPager.evaluate((element: IdsPager) => {
        element.disabled = true;
        return element.disabled;
      })).toBeTruthy();
      children.forEach(async (child) => {
        await expect(child).toHaveAttribute('disabled');
        await expect(child).toHaveAttribute('parent-disabled');
      });
    });

    test('can set/get pageSize attribute', async () => {
      const testData = [
        { data: 5, expected: 5 },
        { data: '7', expected: 7 },
        { data: null, expected: 10 } // default page size is 10
      ];

      expect(await idsPager.evaluate((element: IdsPager) => element.pageSize)).toEqual(20);
      await expect(idsPager).toHaveAttribute('page-size', '20');
      children.forEach(async (child) => {
        await expect(child).not.toHaveAttribute('page-size', '20');
      });

      for (const data of testData) {
        expect(await idsPager.evaluate((element: IdsPager, tData) => {
          element.pageSize = tData.data as any;
          return element.pageSize;
        }, data)).toEqual(data.expected);
        children.forEach(async (child) => {
          await expect(child).toHaveAttribute('page-size', data.expected.toString());
        });
      }
    });

    test('can set/get pageSizes attribute', async () => {

    });
  });
});
