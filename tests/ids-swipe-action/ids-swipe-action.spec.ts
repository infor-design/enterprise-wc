import percySnapshot from '@percy/playwright';
import { Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';

import IdsSwipeAction from '../../src/components/ids-swipe-action/ids-swipe-action';

test.describe('IdsSwipeAction tests', () => {
  const url = '/ids-swipe-action/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Swipe Action Component');
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
      const handle = await page.$('ids-swipe-action');
      const html = await handle?.evaluate((el: IdsSwipeAction) => el?.outerHTML);
      await expect(html).toMatchSnapshot('swipe-action-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-swipe-action');
      const html = await handle?.evaluate((el: IdsSwipeAction) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('swipe-action-shadow');
    });

    test.skip('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-swipe-action-light');
    });

    test.describe('functional tests', async () => {
      test('can set/get swipeType property', async ({ page }) => {
        const idsSwipe = await page.locator('ids-swipe-action').nth(1);
        const testData = [
          { data: 'reveal', expected: 'reveal' },
          { data: 'continuous', expected: 'continuous' },
          { data: null, expected: 'reveal' },
        ];

        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => element.swipeType)).toEqual('continuous');
        await expect(idsSwipe).toHaveAttribute('swipe-type', 'continuous');

        for (const data of testData) {
          expect(await idsSwipe.evaluate((element: IdsSwipeAction, tData: any) => {
            element.swipeType = tData.data;
            return element.swipeType;
          }, data)).toEqual(data.expected);
          if (data.expected === 'continuous') {
            await expect(idsSwipe).toHaveAttribute('swipe-type', 'continuous');
          } else {
            await expect(idsSwipe).not.toHaveAttribute('swipe-type');
          }
        }
      });

      test('can trigger the swipe event', async ({ page }) => {
        const idsSwipe = await page.locator('ids-swipe-action').nth(1);
        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => {
          let isSwiped = false;
          element.addEventListener('swipe', () => { isSwiped = true; });
          element.dispatchEvent(new CustomEvent('swipe', { detail: { direction: 'left' } }));
          return isSwiped;
        })).toBeTruthy();
      });

      /**
       * Waits for the scrollLeft value of left or right
       * @param {Locator} target `ids-swipe-action` target
       * @param {string} direction `left` or `right` direction
       * @returns {number} IdsSwipeAction.container.scrollLeft value
       */
      async function waitForButton(target: Locator, direction: 'left' | 'right'): Promise<number> {
        let scrollValue = 70;
        const allowableLeft = 5; // ideal is 0, added allowable range to consider flakiness
        const allowableRight = 130; // ideal is 140, added allowable range to consider flakiness
        for (let i = 0; i < 100; i++) {
          scrollValue = await target.evaluate((element: IdsSwipeAction) => element.container!.scrollLeft);
          if (direction === 'left' && scrollValue <= allowableLeft) break;
          if (direction === 'right' && scrollValue >= allowableRight) break;
        }
        return scrollValue;
      }

      // no visual cue or document change seen when "swiping to the left/right"
      // checks the container.scrollLeft property instead
      test('can display left/right buttons on reveal type', async ({ page }) => {
        const idsSwipe = await page.locator('ids-swipe-action').nth(1);
        await idsSwipe.evaluate((element: IdsSwipeAction) => { element.swipeType = 'reveal'; });
        await idsSwipe.click({ force: true });

        await page.keyboard.press('ArrowLeft');
        expect(await waitForButton(idsSwipe, 'left')).toBeLessThan(70);

        await page.keyboard.press('ArrowRight');
        expect(await waitForButton(idsSwipe, 'right')).toBeInAllowedBounds(70, 3);

        await page.keyboard.press('ArrowRight');
        expect(await waitForButton(idsSwipe, 'right')).toBeGreaterThan(70);

        await page.keyboard.press('ArrowLeft');
        expect(await waitForButton(idsSwipe, 'left')).toBeInAllowedBounds(70, 3);
      });

      // no visual cue or document change seen when "swiping to the left/right"
      // checks the container.scrollLeft property instead
      test('can display left/right buttons on continuous type', async ({ page }) => {
        const idsSwipe = await page.locator('ids-swipe-action').nth(1);
        await idsSwipe.click({ force: true });

        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('ArrowLeft');
        }
        expect(await waitForButton(idsSwipe, 'left')).toBeLessThan(70);

        await page.keyboard.press('ArrowRight');
        expect(await waitForButton(idsSwipe, 'right')).toBeInAllowedBounds(70, 3);

        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('ArrowRight');
        }
        expect(await waitForButton(idsSwipe, 'right')).toBeGreaterThan(70);

        await page.keyboard.press('ArrowLeft');
        expect(await waitForButton(idsSwipe, 'left')).toBeInAllowedBounds(70, 3);
      });
    });
  });
});
