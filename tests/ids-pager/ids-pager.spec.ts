import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPager from '../../src/components/ids-pager/ids-pager';
import IdsPagerButton from '../../src/components/ids-pager/ids-pager-button';
import IdsPagerNumberList from '../../src/components/ids-pager/ids-pager-number-list';
import IdsPagerInput from '../../src/components/ids-pager/ids-pager-input';

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

  test.describe('functionality tests', () => {
    test('should not have an error when creating pager dropdown element', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      await page.evaluate(() => {
        document.createElement('ids-pager-dropdown');
      });
      expect(hasConsoleError).toBeFalsy();
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
    let idsDrop: Locator;
    let children: Locator[];

    test.beforeEach(async ({ page }) => {
      idsPager = await page.locator('ids-pager');
      idsFirst = await idsPager.locator('ids-pager-button[first]');
      idsPrevious = await idsPager.locator('ids-pager-button[previous]');
      idsInput = await idsPager.locator('ids-pager-input');
      idsNext = await idsPager.locator('ids-pager-button[next]');
      idsLast = await idsPager.locator('ids-pager-button[last]');
      await page.evaluate(() => {
        const pager = document.querySelector('ids-pager')!;
        pager.insertAdjacentHTML('beforeend', '<ids-pager-dropdown id="rDrop" slot="end"></ids-pager-dropdown>');
      });
      idsDrop = await idsPager.locator('#rDrop');
      children = [idsFirst, idsPrevious, idsInput, idsNext, idsLast, idsDrop];
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
        await expect(child).toHaveAttribute('parent-disabled');
      });
      await idsPager.evaluate((element: IdsPager) => {
        element.disabled = false;
      });
      children.slice(0, -1).forEach(async (child) => {
        await expect(child).not.toHaveAttribute('parent-disabled');
        await expect(child).not.toHaveAttribute('disabled');
      });
    });

    test('nav buttons should stay disabled', async () => {
      // Nav buttons with the "nav-disabled" attribute should stay disabled
      // when the parent toggles its disabled state
      await idsLast.click();
      await expect(idsFirst).not.toHaveAttribute('nav-disabled');
      await expect(idsFirst.locator('ids-button')).not.toHaveAttribute('disabled');
      await expect(idsPrevious).not.toHaveAttribute('nav-disabled');
      await expect(idsPrevious.locator('ids-button')).not.toHaveAttribute('disabled');
      await idsPager.evaluate((element: IdsPager) => { element.disabled = true; });
      await expect(idsFirst).toHaveAttribute('parent-disabled');
      await expect(idsFirst.locator('ids-button')).toHaveAttribute('disabled');
      await expect(idsPrevious).toHaveAttribute('parent-disabled');
      await expect(idsPrevious.locator('ids-button')).toHaveAttribute('disabled');
      await expect(idsLast).toHaveAttribute('nav-disabled');
      await expect(idsNext).toHaveAttribute('nav-disabled');
      await expect(idsLast.locator('ids-button')).toHaveAttribute('disabled');
      await expect(idsNext.locator('ids-button')).toHaveAttribute('disabled');
      await idsPager.evaluate((element: IdsPager) => { element.disabled = false; });
      await expect(idsLast).toHaveAttribute('nav-disabled');
      await expect(idsNext).toHaveAttribute('nav-disabled');
      await expect(idsLast.locator('ids-button')).toHaveAttribute('disabled');
      await expect(idsNext.locator('ids-button')).toHaveAttribute('disabled');
      await expect(idsFirst.locator('ids-button')).not.toHaveAttribute('disabled');
      await expect(idsPrevious.locator('ids-button')).not.toHaveAttribute('disabled');
    });

    test.skip('can set/get pageSize attribute', async () => {
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
      const defSizes = [5, 10, 25, 50, 100];
      const testData = [
        { data: [3, 6, 9, 12, 15], expected: [3, 6, 9, 12, 15] },
        { data: defSizes, expected: defSizes },
        { data: ['A', 'C', 'E'], expected: defSizes },
        { data: [3, 'A', 9, 'C', 15, 'E'], expected: [3, 9, 15] }
      ];

      expect(await idsPager.evaluate((element: IdsPager) => element.pageSizes)).toEqual(defSizes);

      for (const data of testData) {
        expect(await idsPager.evaluate((element: IdsPager, tData) => {
          element.pageSizes = tData as any;
          return element.pageSizes;
        }, data.data)).toEqual(data.expected);
      }
    });

    test('can set/get pageNumber attribute', async () => {
      const defInitPageNumber = 1;
      const defMaxPageCount = await idsPager.evaluate((element: IdsPager) => element.pageCount) ?? 10;
      const testData = [
        { data: 2, expected: 2 },
        { data: '3', expected: 3 },
        { data: 'A', expected: defInitPageNumber },
        { data: 0.5, expected: defInitPageNumber },
        { data: 20, expected: defMaxPageCount },
      ];
      expect(await idsPager.evaluate((element: IdsPager) => element.pageNumber)).toEqual(defInitPageNumber);
      await expect(idsPager).toHaveAttribute('page-number', defInitPageNumber.toString());

      for (const data of testData) {
        expect(await idsPager.evaluate((element: IdsPager, tData) => {
          element.pageNumber = tData as any;
          return element.pageNumber;
        }, data.data)).toEqual(data.expected);
        await expect(idsPager).toHaveAttribute('page-number', data.expected.toString());
        children.forEach(async (child) => {
          await expect(child).toHaveAttribute('page-number', data.expected.toString());
        });
      }
    });

    test('can set/get step attribute', async () => {
      const defStep = 3;
      const testData = [
        { data: 1, expected: 1 },
        { data: '2', expected: 2 },
        { data: 'A', expected: defStep }
      ];

      expect(await idsPager.evaluate((element: IdsPager) => element.step)).toEqual(defStep);
      await expect(idsPager).not.toHaveAttribute('step');

      for (const data of testData) {
        expect(await idsPager.evaluate((element: IdsPager, tData) => {
          element.step = tData;
          return element.step;
        }, data.data)).toEqual(data.expected);
        if (Number.isNaN(parseFloat(data.data.toString()))) {
          await expect(idsPager).not.toHaveAttribute('step');
        } else {
          await expect(idsPager).toHaveAttribute('step', data.expected.toString());
        }
      }
    });

    test('can set/get total attribute', async () => {
      const testData = [
        { data: 100, expected: 100 },
        { data: '50', expected: 50 },
        { data: 'ACE', expected: 0 }
      ];

      expect(await idsPager.evaluate((element: IdsPager) => element.total)).toEqual(200);
      await expect(idsPager).toHaveAttribute('total', '200');

      for (const data of testData) {
        expect(await idsPager.evaluate((element: IdsPager, tData) => {
          element.total = tData as any;
          return element.total;
        }, data.data)).toEqual(data.expected);
        await expect(idsPager).toHaveAttribute('total', data.expected.toString());
        children.forEach(async (child) => {
          await expect(child).toHaveAttribute('total', data.expected.toString());
        });
      }
    });

    test('can set/get type attribute', async () => {
      const testData = [
        { data: 30, expected: '30' },
        { data: 'buttons', expected: 'buttons' },
        { data: 'list', expected: 'list' }
      ];

      expect(await idsPager.evaluate((element: IdsPager) => element.type)).toBeNull();
      await expect(idsPager).not.toHaveAttribute('type');

      for (const data of testData) {
        expect(await idsPager.evaluate((element: IdsPager, tData) => {
          element.type = tData as any;
          return element.type;
        }, data.data)).toEqual(data.expected);
        await expect(idsPager).toHaveAttribute('type', data.expected);
        children.forEach(async (child) => {
          await expect(child).toHaveAttribute('type', data.expected);
        });
      }
    });
  });

  test.describe('IdsPagerButton functionality tests', () => {
    let idsPager: Locator;
    let idsFirst: Locator;
    let idsPrevious: Locator;
    let idsNext: Locator;
    let idsLast: Locator;

    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector('ids-pager-button[first]')!.setAttribute('id', 'firstBtn');
        document.querySelector('ids-pager-button[previous]')!.setAttribute('id', 'previousBtn');
        document.querySelector('ids-pager-button[next]')!.setAttribute('id', 'nextBtn');
        document.querySelector('ids-pager-button[last]')!.setAttribute('id', 'lastBtn');
      });
      idsPager = await page.locator('ids-pager');
      idsFirst = await idsPager.locator('#firstBtn');
      idsPrevious = await idsPager.locator('#previousBtn');
      idsNext = await idsPager.locator('#nextBtn');
      idsLast = await idsPager.locator('#lastBtn');
    });

    test('can get pager parent', async () => {
      expect(await idsFirst.evaluate((element: IdsPagerButton) => element.pager)).toBeTruthy();
      expect(await idsPrevious.evaluate((element: IdsPagerButton) => element.pager)).toBeTruthy();
      expect(await idsNext.evaluate((element: IdsPagerButton) => element.pager)).toBeTruthy();
      expect(await idsLast.evaluate((element: IdsPagerButton) => element.pager)).toBeTruthy();
    });

    test('can get pageCount', async () => {
      const defPageCount = 10;
      expect(await idsFirst.evaluate((element: IdsPagerButton) => element.pageCount)).toEqual(defPageCount);
      expect(await idsPrevious.evaluate((element: IdsPagerButton) => element.pageCount)).toEqual(defPageCount);
      expect(await idsNext.evaluate((element: IdsPagerButton) => element.pageCount)).toEqual(defPageCount);
      expect(await idsLast.evaluate((element: IdsPagerButton) => element.pageCount)).toEqual(defPageCount);
    });

    /**
     * Validates the `ids-button` and `ids-icon` inside the `ids-pager-button` component.
     * @param {Locator} parent The top level element or the `ids-pager-button` reference
     * @param {'first' | 'previous' | 'next' | 'last'} placement 'first' | 'previous' | 'next' | 'last'
     */
    async function validateChildren(parent: Locator, placement: 'first' | 'previous' | 'next' | 'last') {
      const idsButton = await parent.locator('ids-button');
      const idsIcon = await idsButton.locator('ids-icon');

      await expect(idsButton).toBeAttached();
      await expect(idsIcon).toBeAttached();

      await expect(idsButton).toHaveAttribute(placement);
      await expect(idsButton).toHaveAttribute('aria-label', placement);
      await expect(idsIcon).toHaveAttribute('icon', `${placement}-page`);
    }

    test('can set first button', async () => {
      const placement = 'first';
      await expect(idsLast).not.toHaveAttribute(placement);
      await idsLast.evaluate((element: IdsPagerButton) => { element.first = true; });
      await validateChildren(idsLast, placement);
      await expect(idsLast).toHaveAttribute(placement);
    });

    test('can set last button', async () => {
      const placement = 'last';
      await expect(idsFirst).not.toHaveAttribute(placement);
      await idsFirst.evaluate((element: IdsPagerButton) => { element.last = true; });
      await validateChildren(idsFirst, placement);
      await expect(idsFirst).toHaveAttribute(placement);
    });

    test('can set next button', async () => {
      const placement = 'next';
      await expect(idsPrevious).not.toHaveAttribute(placement);
      await idsPrevious.evaluate((element: IdsPagerButton) => { element.next = true; });
      await validateChildren(idsPrevious, placement);
      await expect(idsPrevious).toHaveAttribute(placement);
    });

    test('can set previous button', async () => {
      const placement = 'previous';
      await expect(idsNext).not.toHaveAttribute(placement);
      await idsNext.evaluate((element: IdsPagerButton) => { element.previous = true; });
      await validateChildren(idsNext, placement);
      await expect(idsNext).toHaveAttribute(placement);
    });

    // https://github.com/infor-design/enterprise-wc/issues/2213
    test.skip('can set/get disabled attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false }
      ];

      expect(await idsNext.evaluate((element: IdsPagerButton) => element.disabled)).toBeFalsy();

      for (const data of testData) {
        expect(await idsNext.evaluate((element: IdsPagerButton, tData) => {
          element.disabled = tData as any;
          return element.disabled;
        }, data.data)).toEqual(data.expected);
      }
    });

    test('can get type attribute', async () => {
      await idsPager.evaluate((element: IdsPager) => {
        const btn = document.createElement('ids-pager-button');
        btn.setAttribute('id', 'otherBtn');
        element.appendChild(btn);
      });
      expect(await idsFirst.evaluate((element: IdsPagerButton) => element.type)).toEqual('first');
      expect(await idsPrevious.evaluate((element: IdsPagerButton) => element.type)).toEqual('previous');
      expect(await idsNext.evaluate((element: IdsPagerButton) => element.type)).toEqual('next');
      expect(await idsLast.evaluate((element: IdsPagerButton) => element.type)).toEqual('last');
      expect(await idsPager.locator('#otherBtn').evaluate((element: IdsPagerButton) => element.type)).toEqual(undefined);
    });

    test('can set/get navDisabled', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsNext.evaluate((element: IdsPagerButton) => element.navDisabled)).toBeFalsy();
      await expect(idsNext).not.toHaveAttribute('nav-disabled');

      for (const data of testData) {
        expect(await idsNext.evaluate((element: IdsPagerButton, tData) => {
          element.navDisabled = tData as any;
          return element.navDisabled;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsNext).toHaveAttribute('nav-disabled');
        } else {
          await expect(idsNext).not.toHaveAttribute('nav-disabled');
        }
      }
    });

    test('can set/get parentDisabled', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsNext.evaluate((element: IdsPagerButton) => element.parentDisabled)).toBeFalsy();
      await expect(idsNext).not.toHaveAttribute('parent-disabled');

      for (const data of testData) {
        expect(await idsNext.evaluate((element: IdsPagerButton, tData) => {
          element.parentDisabled = tData as any;
          return element.parentDisabled;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsNext).toHaveAttribute('parent-disabled');
        } else {
          await expect(idsNext).not.toHaveAttribute('parent-disabled');
        }
      }
    });

    test('can set/get label attribute', async () => {
      const testData = [
        { data: 'next', expected: 'next' },
        { data: 1, expected: '1' },
        { data: null, expected: null }
      ];

      expect(await idsNext.evaluate((element: IdsPagerButton) => element.label)).toBeNull();
      await expect(idsNext).not.toHaveAttribute('label');

      for (const data of testData) {
        expect(await idsNext.evaluate((element: IdsPagerButton, tData) => {
          element.label = tData as any;
          return element.label;
        }, data.data)).toEqual(data.expected);
        if (data.expected !== null) {
          await expect(idsNext).toHaveAttribute('label', data.expected);
        } else {
          await expect(idsNext).not.toHaveAttribute('label');
        }
      }
    });
  });

  test.describe('IdsPagerNumberList functionality tests', () => {
    let idsPager: Locator;
    let idsNumberList: Locator;

    test.beforeEach(async ({ page }) => {
      idsPager = await page.locator('#ids-pager-example');
      await idsPager.evaluate((element: IdsPager) => {
        element.innerHTML = '';
        const pgNum = document.createElement('ids-pager-number-list');
        pgNum.setAttribute('id', 'pager-number');
        element.appendChild(pgNum);
      });
      idsNumberList = await idsPager.locator('#pager-number');
    });

    test('can get pager parent', async () => {
      await expect(idsNumberList).toBeAttached();
      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.pager)).toBeTruthy();
    });

    test.skip('can set/get pageSize attribute', async () => {
      const defPageSize = 20;
      const testData = [
        { data: 5, expected: defPageSize },
        { data: '7', expected: defPageSize },
        { data: null, expected: defPageSize }
      ];

      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.pageSize)).toEqual(defPageSize);
      await expect(idsNumberList).toHaveAttribute('page-size', defPageSize.toString());

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.pageSize = tData.data as any;
          return element.pageSize;
        }, data)).toEqual(data.expected);
      }
    });

    test('can set/get pageNumber attribute', async () => {
      const defPageNumber = 1;
      const testData = [
        { data: 2, expected: defPageNumber },
        { data: '3', expected: defPageNumber },
        { data: 'A', expected: defPageNumber },
        { data: 0.5, expected: defPageNumber },
        { data: 20, expected: defPageNumber },
      ];
      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.pageNumber)).toEqual(defPageNumber);
      await expect(idsNumberList).toHaveAttribute('page-number', defPageNumber.toString());

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.pageNumber = tData as any;
          return element.pageNumber;
        }, data.data)).toEqual(data.expected);
        await expect(idsNumberList).toHaveAttribute('page-number', data.expected.toString());
      }
    });

    test('can set/get total attribute', async () => {
      const defTotal = 200;
      const testData = [
        { data: 100, expected: defTotal },
        { data: '50', expected: defTotal },
        { data: 'ACE', expected: defTotal }
      ];

      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.total)).toEqual(200);
      await expect(idsNumberList).toHaveAttribute('total', defTotal.toString());

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.total = tData as any;
          return element.total;
        }, data.data)).toEqual(data.expected);
        await expect(idsNumberList).toHaveAttribute('total', data.expected.toString());
      }
    });

    test('can set/get disabled status', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false }
      ];

      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.disabled)).toBeFalsy();

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.disabled = tData as any;
          return { disabled: element.disabled, disabledOverall: element.disabledOverall };
        }, data.data)).toEqual({ disabled: data.expected, disabledOverall: data.expected });
      }
    });

    test('can set/get parentDisabled status', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false }
      ];

      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.parentDisabled)).toBeFalsy();
      await expect(idsNumberList).not.toHaveAttribute('parent-disabled');

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.parentDisabled = tData as any;
          return { parentDisabled: element.parentDisabled, disabledOverall: element.disabledOverall };
        }, data.data)).toEqual({ parentDisabled: data.expected, disabledOverall: data.expected });
        if (data.expected) {
          await expect(idsNumberList).toHaveAttribute('parent-disabled');
        } else {
          await expect(idsNumberList).not.toHaveAttribute('parent-disabled');
        }
      }
    });

    test('can set/get label attribute', async () => {
      const defLabel = 'Go to page {num} of {total}';
      const testData = [
        { data: 'next', expected: 'next' },
        { data: 1, expected: '1' },
        { data: null, expected: defLabel }
      ];

      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.label)).not.toBeNull();
      await expect(idsNumberList).not.toHaveAttribute('label');

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.label = tData as any;
          return element.label;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null) {
          await expect(idsNumberList).toHaveAttribute('label', data.expected);
        } else {
          await expect(idsNumberList).not.toHaveAttribute('label');
        }
      }
    });

    test('can set/get step attribute', async () => {
      const defStep = 3;
      const testData = [
        { data: 1, expected: defStep },
        { data: '2', expected: defStep },
        { data: 'A', expected: defStep }
      ];

      expect(await idsNumberList.evaluate((element: IdsPagerNumberList) => element.step)).toEqual(defStep);
      await expect(idsNumberList).toHaveAttribute('step', defStep.toString());

      for (const data of testData) {
        expect(await idsNumberList.evaluate((element: IdsPagerNumberList, tData) => {
          element.step = tData;
          return element.step;
        }, data.data)).toEqual(data.expected);
        await expect(idsNumberList).toHaveAttribute('step', data.expected.toString());
      }
    });
  });

  test.describe('IdsPagerInput functionality tests', () => {
    let idsPager: Locator;
    let idsPagerInput: Locator;

    test.beforeEach(async ({ page }) => {
      idsPager = await page.locator('ids-pager');
      idsPagerInput = await idsPager.locator('ids-pager-input');
    });

    test('can get pager parent', async () => {
      await expect(idsPagerInput).toBeAttached();
      expect(await idsPagerInput.evaluate((element: IdsPagerInput) => element.pager)).toBeTruthy();
    });

    test('can set/get pageNumber attribute', async () => {
      const defInitPageNumber = 1;
      const defMaxPageCount = await idsPagerInput.evaluate((element: IdsPagerInput) => element.pageCount) ?? 10;
      const testData = [
        { data: 2, expected: 2 },
        { data: '3', expected: 3 },
        { data: 'A', expected: defInitPageNumber },
        { data: 0.5, expected: defInitPageNumber },
        { data: 20, expected: defMaxPageCount },
      ];
      expect(await idsPagerInput.evaluate((element: IdsPagerInput) => element.pageNumber)).toEqual(defInitPageNumber);
      await expect(idsPagerInput).toHaveAttribute('page-number', defInitPageNumber.toString());

      for (const data of testData) {
        expect(await idsPagerInput.evaluate((element: IdsPagerInput, tData) => {
          element.pageNumber = tData as any;
          return element.pageNumber;
        }, data.data)).toEqual(data.expected);
        await expect(idsPagerInput).toHaveAttribute('page-number', data.expected.toString());
      }
    });

    // https://github.com/infor-design/enterprise-wc/issues/2213
    test.skip('can set/get disabled status', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false }
      ];

      expect(await idsPagerInput.evaluate((element: IdsPagerInput) => element.disabled)).toBeFalsy();

      for (const data of testData) {
        expect(await idsPagerInput.evaluate((element: IdsPagerInput, tData) => {
          element.disabled = tData as any;
          return { disabled: element.disabled, disabledOverall: element.disabledOverall };
        }, data.data)).toEqual({ disabled: data.expected, disabledOverall: data.expected });
      }
    });
  });
});
