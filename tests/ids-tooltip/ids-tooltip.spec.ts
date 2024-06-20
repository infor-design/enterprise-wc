import AxeBuilder from '@axe-core/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTooltip from '../../src/components/ids-tooltip/ids-tooltip';

test.describe('IdsTooltip tests', () => {
  const url = '/ids-tooltip/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tooltip Component');
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
      const handle = await page.$('ids-tooltip');
      const html = await handle?.evaluate((el: IdsTooltip) => el?.outerHTML);
      await expect(html).toMatchSnapshot('tooltip-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-tooltip');
      const html = await handle?.evaluate((el: IdsTooltip) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tooltip-shadow');
    });
  });

  test.describe('functionality test', async () => {
    let idsToolTip: Locator;
    let idsButton: Locator;

    test.beforeEach(async ({ page }) => {
      idsToolTip = await page.locator('ids-tooltip');
      idsButton = await page.locator('#button-1');
    });

    test('can append early to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-tooltip') as IdsTooltip;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.id = 'new-tooltip-test';
        elem.target = '#button-1';
        elem.innerHTML = 'Another tooltip';
      });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can append late to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-tooltip') as IdsTooltip;
        elem.id = 'new-tooltip-test';
        elem.target = '#button-1';
        elem.innerHTML = 'Another tooltip';
        document.querySelector('ids-container')!.appendChild(elem);
      });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can get popup', async () => {
      const idsPopup = await idsToolTip.locator('ids-popup').elementHandle();
      expect(await idsToolTip.evaluate((
        element: IdsTooltip,
        handle
      ) => element.popup!.isSameNode(handle), idsPopup)).toBeTruthy();
    });

    test('can trigger events when hover', async ({ eventsTest, page }) => {
      const buttonHandle = (await idsButton.elementHandle())!;
      const box = await idsButton.boundingBox();
      await eventsTest.onEvent('ids-tooltip', 'hoverend', buttonHandle);
      await eventsTest.onEvent('ids-tooltip', 'mouseleave', buttonHandle);

      // hover in the target
      await page.mouse.move(box!.x + (box!.width / 2), box!.y + (box!.height / 2), { steps: 15 });

      // unhover from the target
      await page.mouse.move(box!.x + box!.width + 50, box!.y + box!.height + 50, { steps: 15 });

      expect(await eventsTest.isEventTriggered('ids-tooltip', 'hoverend')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('ids-tooltip', 'mouseleave')).toBeTruthy();
    });
  });
});
