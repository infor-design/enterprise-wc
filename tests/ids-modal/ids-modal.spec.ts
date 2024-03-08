import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsModal from '../../src/components/ids-modal/ids-modal';
import IdsOverlay from '../../src/components/ids-modal/ids-overlay';

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
      const isVisible = await page.evaluate(async () => {
        const modal = document.querySelector<IdsModal>('ids-modal');
        await modal?.show();
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
      await page.locator('#modal-trigger-btn').click(); // open modal
      await page.waitForSelector('ids-modal[visible]'); // wait modal to finish show animation
      await page.locator('#modal-cancel-btn').click(); // click cancel
      await page.waitForSelector('ids-modal:not([visible])'); // wait for modal to finish hide animation
    });

    test('responds to the example save button', async ({ page }) => {
      await page.locator('#modal-trigger-btn').click(); // open modal
      await page.waitForSelector('ids-modal[visible]'); // wait modal to finish show animation
      await page.locator('#modal-save-btn').click(); // click save
      await page.waitForSelector('ids-modal:not([visible])'); // wait for modal to finish hide animation
    });

    test('showing/hiding modal close button', async ({ page }) => {
      const buttonHandle = page.locator('#modal-trigger-btn');
      const modalHandle = page.locator('#my-modal');
      await modalHandle.evaluate((modal: IdsModal) => { modal.popup!.animated = false; });

      await modalHandle.evaluate((modal: IdsModal) => { modal.showCloseButton = true; });
      await buttonHandle.click();
      await expect(await page.locator('ids-modal-button.modal-control-close')).toBeVisible();
      expect(await modalHandle?.evaluate((modal: IdsModal) => modal.showCloseButton)).toBeTruthy();

      await modalHandle.evaluate((modal: IdsModal) => { modal.showCloseButton = false; });
      await expect(await page.locator('ids-modal-button.modal-control-close')).not.toBeVisible();
      expect(await modalHandle?.evaluate((modal: IdsModal) => modal.showCloseButton)).toBeFalsy();
    });
  });

  test.describe(('modal functionality'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test('hiding modal via Escape', async ({ page }) => {
      const buttonHandle = page.locator('#modal-trigger-btn');
      const modalHandle = page.locator('#my-modal');
      await modalHandle.evaluate((modal: IdsModal) => { modal.popup!.animated = false; });
      await buttonHandle.click();
      await expect(modalHandle).toBeVisible();

      // Close via escape
      await page.keyboard.press('Escape');
      await page.waitForSelector('ids-modal:not([visible])');
    });

    test('setting custom overlay', async ({ page }) => {
      // Insert custom overlay
      await page.evaluate(() => {
        const overlay = document.createElement('ids-overlay') as IdsOverlay;
        const modal = document.querySelector<IdsModal>('ids-modal');
        overlay.id = 'custom-overlay';
        modal!.overlay = overlay;
      });

      const overlayCount = await page.locator('ids-modal ids-overlay').count();
      expect(overlayCount).toEqual(1);
      expect(await page.locator('ids-modal #custom-overlay')).toBeDefined();
    });

    test('modal fullsize setting', async ({ page }) => {
      const modalHandle = await page.locator('ids-modal');
      const popupHandle = await page.locator('ids-modal ids-popup');

      // set fullsize to 'always'
      await modalHandle.evaluate((modal: IdsModal) => { modal.fullsize = 'always'; });
      await expect(popupHandle).toHaveClass(/fullsize/);

      // set fullsize to null
      await modalHandle.evaluate((modal: IdsModal) => { modal.fullsize = null; });
      await expect(popupHandle).not.toHaveClass(/fullsize/);
    });

    test('updating modal title', async ({ page }) => {
      await page.locator('ids-modal').evaluate((modal: IdsModal) => { modal.messageTitle = 'My Test Message'; });
      await expect(await page.locator('ids-modal [slot="title"]')).toHaveText(/My Test Message/);
    });
  });

  test.describe('IdsOverlay functionality test', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test('setting overlay opacity', async ({ page }) => {
      const overlayHandle = page.locator('ids-overlay');

      // default opacity is 0.5
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.opacity)).toEqual(0.5);

      // setting opacity to n < 0, should auto correct to 0
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.opacity = -1; });
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.opacity)).toEqual(0);

      // setting opacity to n > 1, should auto correct to 1
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.opacity = 2; });
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.opacity)).toEqual(1);
    });

    test('setting overlay visiblity', async ({ page }) => {
      const overlayHandle = await page.locator('ids-modal ids-overlay');

      // Set overlay visible to false
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.visible = false; });
      await page.locator('#modal-trigger-btn').click(); // open modal
      await page.waitForSelector('ids-modal[visible]'); // wait for modal to be open
      await expect(await page.locator('ids-modal ids-overlay')).not.toBeVisible();
    });

    test('setting background color', async ({ page }) => {
      const overlayHandle = await page.locator('ids-modal ids-overlay');

      // change background color to 'page'
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.backgroundColor = 'page'; });
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.backgroundColor)).toEqual('page');

      // change background color to '' (default value)
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.backgroundColor = ''; });
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.backgroundColor)).toEqual('');
    });

    test('setting overlay z-index', async ({ page }) => {
      const overlayHandle = await page.locator('ids-modal ids-overlay');

      // set z-index to 1
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.zIndex = 1; });
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.zIndex)).toEqual(1);

      // set z-index should be 0 (default value)
      await overlayHandle.evaluate((overlay: IdsOverlay) => { overlay.zIndex = 0; });
      expect(await overlayHandle.evaluate((overlay: IdsOverlay) => overlay.zIndex)).toEqual(0);
    });
  });
});
