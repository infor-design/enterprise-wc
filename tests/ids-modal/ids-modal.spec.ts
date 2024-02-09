import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsModal from '../../src/components/ids-modal/ids-modal';

test.describe('IdsModal tests', () => {
  const url = '/ids-modal/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Modal Component');
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
      const handle = await page.$('ids-modal');
      const html = await handle?.evaluate((el: IdsModal) => el?.outerHTML);
      await expect(html).toMatchSnapshot('modal-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-modal');
      const html = await handle?.evaluate((el: IdsModal) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('modal-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.locator('#modal-trigger-btn').click();
      await percySnapshot(page, 'ids-modal-light');
    });
  });

  test.describe('modal button tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-modal/focus.html');
    });

    test('should have two buttons', async ({ page }) => {
      await page.locator('#modal-trigger-btn').click();
      expect(await page.locator('ids-modal-button').count()).toBe(2);
    });

    test('should have two visible buttons', async ({ page }) => {
      await page.locator('#modal-trigger-btn').click();
      expect(await page.locator('ids-modal-button').count()).toBe(2);
    });

    test('shows with buttons present', async ({ page }) => {
      const isVisible = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal');
        modal?.show();
        return modal?.visible;
      });
      expect(isVisible).toBeTruthy();
    });

    test('can set/change the cancel attribute', async ({ page }) => {
      let attr = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal')!;
        modal.buttons[0].cancel = true;
        return modal.buttons[0].getAttribute('cancel');
      });
      expect(await attr).toBeTruthy();
      attr = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal')!;
        modal.buttons[0].cancel = false;
        return modal.buttons[0].getAttribute('cancel');
      });
      expect(await attr).toBeFalsy();
    });

    test('responds to button clicks', async ({ page }) => {
      const isVisible = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal') as any;
        // Setup a button click handler
        modal.popup.animated = false;
        modal.onButtonClick = () => { modal.hide(); };
        const clickEvent = new MouseEvent('click', { bubbles: true });

        // Show the Modal
        modal.show();

        // Click the first Modal button. The above handler should fire.
        modal.buttons[1].dispatchEvent(clickEvent);
      });

      expect(isVisible).toBeFalsy();
    });

    test('responds to its cancel button clicks', async ({ page }) => {
      const isVisible = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal') as any;
        // Setup a button click handler
        modal.popup.animated = false;
        const clickEvent = new MouseEvent('click', { bubbles: true });

        // Show the Modal
        modal.show();

        // Click the first Modal button. The above handler should fire.
        modal.buttons[0].dispatchEvent(clickEvent);
      });

      expect(isVisible).toBeFalsy();
    });
  });
});
