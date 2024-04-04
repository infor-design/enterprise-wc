import percySnapshot from '@percy/playwright';
import { Locator, devices } from '@playwright/test';
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

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-swipe-action-light');
    });

    test.describe('functional tests', async () => {
      let idsSwipe: Locator;
      const iPhone = devices['iPhone 12 Pro'];
      test.use({
        viewport: iPhone.viewport,
        userAgent: iPhone.userAgent,
        isMobile: true,
        hasTouch: true
      });

      test.beforeEach(async ({ page }) => {
        idsSwipe = await page.locator('ids-swipe-action').nth(1);
      });

      test('can set/get swipeType property', async () => {
        const testData = [
          { data: 'reveal', expected: 'reveal' },
          { data: 'continuous', expected: 'continuous' },
          { data: null, expected: 'reveal' },
        ];

        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => element.swipeType)).toEqual('continuous');
        await expect(idsSwipe).toHaveAttribute('swipe-type', 'continuous');

        for (const data of testData) {
          expect(await idsSwipe.evaluate((element: IdsSwipeAction, tData) => {
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

      test('can trigger the swipe event', async () => {
        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => {
          let isSwiped = false;
          element.addEventListener('swipe', () => { isSwiped = true; });
          element.dispatchEvent(new CustomEvent('swipe', { detail: { direction: 'left' } }));
          return isSwiped;
        })).toBeTruthy();
      });

      // no visual cue or document change seen when "swiping to the left/right"
      // checks the container.scrollLeft property instead
      test('can display left/right buttons on reveal type', async ({ page }) => {
        await idsSwipe.evaluate((element: IdsSwipeAction) => { element.swipeType = 'reveal'; });
        const box = await idsSwipe.boundingBox();

        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down({ button: 'middle' });
        for (let i = box!.x + box!.width / 2; i >= box!.x - 10; i--) {
          await page.mouse.move(i, 0);
        }
        await page.mouse.up({ button: 'middle' });
        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => element.container!.scrollLeft)).toBeLessThan(70);

        // resets the mouse
        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down({ button: 'middle' });
        await page.mouse.move(box!.x + box!.width + 20, 0);
        await page.mouse.up({ button: 'middle' });

        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down({ button: 'middle' });
        for (let i = box!.x + box!.width / 2; i <= box!.width + 10; i++) {
          await page.mouse.move(i, 0);
        }
        await page.mouse.up({ button: 'middle' });
        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => element.container!.scrollLeft)).toBeGreaterThan(70);
      });

      // no visual cue or document change seen when "swiping to the left/right"
      // checks the container.scrollLeft property instead
      test('can display left/right buttons on continuous type', async ({ page }) => {
        const box = await idsSwipe.boundingBox();

        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down({ button: 'middle' });
        for (let i = box!.x + box!.width / 2; i >= box!.x - 10; i--) {
          await page.mouse.move(i, 0);
        }
        // validate if the button is show while still pressing down
        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => element.container!.scrollLeft)).toBeLessThan(70);
        await page.mouse.up({ button: 'middle' });
        await page.waitForTimeout(500);
        // validate if the button is hidden when not pressed
        expect(await idsSwipe.evaluate(
          (element: IdsSwipeAction) => element.container!.scrollLeft
        )).toBeInAllowedBounds(70, 5);

        // resets the mouse
        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down({ button: 'middle' });
        await page.mouse.move(box!.x + box!.width + 20, 0);
        await page.mouse.up({ button: 'middle' });

        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down({ button: 'middle' });
        for (let i = box!.x + box!.width / 2; i <= box!.width + 10; i++) {
          await page.mouse.move(i, 0);
        }
        expect(await idsSwipe.evaluate((element: IdsSwipeAction) => element.container!.scrollLeft)).toBeGreaterThan(70);
        await page.mouse.up({ button: 'middle' });
        await page.waitForTimeout(500);
        // validate if the button is hidden when not pressed
        expect(await idsSwipe.evaluate(
          (element: IdsSwipeAction) => element.container!.scrollLeft
        )).toBeInAllowedBounds(70, 5);
      });
    });
  });
});
