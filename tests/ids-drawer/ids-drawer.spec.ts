import AxeBuilder from '@axe-core/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDrawer from '../../src/components/ids-drawer/ids-drawer';
import IdsContainer from '../../src/components/ids-container/ids-container';
// import createFromTemplate from '../helpers/create-from-template';

test.describe('IdsDrawer tests', () => {
  const url = '/ids-drawer/example.html';
  let drawer: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    drawer = await page.locator('ids-drawer').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Drawer Component');
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
      const handle = await page.$('ids-drawer');
      const html = await handle?.evaluate((el: IdsDrawer) => el?.outerHTML);
      await expect(html).toMatchSnapshot('drawer-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-drawer');
      const html = await handle?.evaluate((el: IdsDrawer) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('drawer-shadow');
    });
  });

  test.describe('functionality tests', () => {
    test('must have an edge', async () => {
      let container = await drawer.evaluate((idsDrawer: IdsDrawer) => {
        // idsDrawer = createFromTemplate(
        //   idsDrawer,
        //   `<ids-drawer>
        //     <div>Content</div>
        //   </ids-drawer>`
        // );
        idsDrawer.edge = 'start';
        return idsDrawer.container?.classList;
      });
      await expect(container).toEqual(expect.objectContaining({ 2: 'edge-start' }));
      container = await drawer.evaluate((idsDrawer: IdsDrawer) => { idsDrawer.edge = 'bottom'; return idsDrawer.container?.classList; });
      await expect(container).toEqual(expect.objectContaining({ 2: 'edge-bottom' }));
      await expect(container).not.toEqual(expect.objectContaining({ 2: 'edge-start' }));

      // Can't set junk values
      container = await drawer.evaluate((idsDrawer: IdsDrawer) => { idsDrawer.edge = 'junk'; return idsDrawer.container?.classList; });
      await expect(container).not.toEqual(expect.objectContaining({ 2: 'edge-junk' }));
    });

    test('can have a type', async () => {
      await expect(drawer).toHaveAttribute('type', 'app-menu');
      await expect(drawer).toContainText('This is my drawer');
    });

    test('can have a target', async ({ page }) => {
      const btn = await page.locator('#app-menu-trigger');
      const btnID = await page.locator('#app-menu-trigger').getAttribute('id');
      let target = await drawer.evaluate((idsDrawer: IdsDrawer) => idsDrawer.state.target.id);
      await expect(target).toEqual(btnID);
      await btn.click();
      await expect(drawer).toBeVisible();
      await drawer.evaluate((idsDrawer: IdsDrawer) => { idsDrawer.hide(); });
      await drawer.evaluate((idsDrawer: IdsDrawer) => { idsDrawer.target = null as any; });
      target = await drawer.evaluate((idsDrawer: IdsDrawer) => idsDrawer.state.target);
      await expect(target).toEqual(null);

      await btn.click();
      const isVisible = await drawer.evaluate((idsDrawer: IdsDrawer) => idsDrawer.visible);
      await expect(isVisible).toBeFalsy();
      await drawer.evaluate((idsDrawer: IdsDrawer) => { idsDrawer.target = null as any; });
    });

    test('can be prevented from being shown', async () => {
      await drawer.evaluate((idsDrawer: IdsDrawer) => {
        idsDrawer.addEventListener('beforeshow', (e: any) => {
          e.detail.response(false);
        });
        idsDrawer.show();
      });
      const isVisible = await drawer.evaluate((idsDrawer: IdsDrawer) => idsDrawer.visible);
      await expect(isVisible).toBeFalsy();
    });

    test('can be prevented from being hidden', async () => {
      await drawer.evaluate((idsDrawer: IdsDrawer) => {
        idsDrawer.addEventListener('beforehide', (e: any) => {
          e.detail.response(false);
        });
        idsDrawer.show();
      });
      await expect(drawer).toBeVisible();
      await drawer.evaluate((idsDrawer: IdsDrawer) => { idsDrawer.hide(); });
      await expect(drawer).toBeVisible();
    });

    test('can update with container language change', async ({ page }) => {
      await page.evaluate(async () => {
        const elem2: any = document.createElement('ids-drawer') as IdsDrawer;
        const container: any = document.createElement('ids-container') as IdsContainer;
        document.body.appendChild(container);
        container.appendChild(elem2);
        container.localeAPI.setLanguage('ar');
      });
      await expect(drawer).toHaveAttribute('dir', 'rtl');
    });

    test('can call hide on outside click', async ({ page, eventsTest }) => {
      const btn = await page.locator('#app-menu-trigger');
      await eventsTest.onEvent('ids-drawer', 'show');
      await btn.click();
      await expect(await eventsTest.isEventTriggered('ids-drawer', 'show')).toBeTruthy();
      await eventsTest.onEvent('ids-drawer', 'hide');
      await btn.click();
      await drawer.evaluate(() => {
        const elem: any = document.querySelector('ids-drawer');
        elem.onOutsideClick({ target: document.body });
      });
      await expect(await eventsTest.isEventTriggered('ids-drawer', 'hide')).toBeTruthy();
    });
  });
});
