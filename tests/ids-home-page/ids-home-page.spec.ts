import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHomePage from '../../src/components/ids-home-page/ids-home-page';

test.describe('IdsHomePage tests', () => {
  const url = '/ids-home-page/example.html';
  let homePage: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    homePage = await page.locator('ids-home-page').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Home Page Component');
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
      const handle = await page.$('ids-home-page');
      const html = await handle?.evaluate((el: IdsHomePage) => el?.outerHTML);
      await expect(html).toMatchSnapshot('home-page-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-home-page');
      const html = await handle?.evaluate((el: IdsHomePage) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('home-page-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-home-page-light');
    });
  });

  test.describe('functionality tests', () => {
    const DEFAULTS = {
      animated: true,
      widgetHeight: 368,
      widgetWidth: 360,
      cols: 3,
      gap: 20,
      gapX: 20,
      gapY: 20
    };
    test('can set animated to home page', async () => {
      await expect(homePage).not.toHaveAttribute('animated');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.animated)).toEqual(DEFAULTS.animated);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.animated = true; });
      await expect(homePage).toHaveAttribute('animated', 'true');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.animated)).toEqual(true);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.animated = false; });
      await expect(homePage).toHaveAttribute('animated', 'false');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.animated)).toEqual(false);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.animated = null; });
      await expect(homePage).not.toHaveAttribute('animated');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.animated)).toEqual(DEFAULTS.animated);
    });

    test('can set custom widget height', async () => {
      await expect(homePage).not.toHaveAttribute('widget-height');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.widgetHeight)).toEqual(DEFAULTS.widgetHeight);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.widgetHeight = '260'; });
      await expect(homePage).toHaveAttribute('widget-height', '260');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.widgetHeight)).toEqual(260);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.widgetHeight = null; });
      await expect(homePage).not.toHaveAttribute('widget-height');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.widgetHeight)).toEqual(DEFAULTS.widgetHeight);
    });

    test('can set custom widget width', async () => {
      await expect(homePage).not.toHaveAttribute('widget-width');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.widgetWidth)).toEqual(DEFAULTS.widgetWidth);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.widgetWidth = '260'; });
      await expect(homePage).toHaveAttribute('widget-width', '260');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.widgetWidth)).toEqual(260);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.widgetWidth = null; });
      await expect(homePage).not.toHaveAttribute('widget-width');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.widgetWidth)).toEqual(DEFAULTS.widgetWidth);
    });

    test('can set max columns', async () => {
      await expect(homePage).not.toHaveAttribute('cols');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.cols)).toEqual(DEFAULTS.cols);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.cols = '4'; });
      await expect(homePage).toHaveAttribute('cols', '4');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.cols)).toEqual(4);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.cols = null; });
      await expect(homePage).not.toHaveAttribute('cols');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.cols)).toEqual(DEFAULTS.cols);
    });

    test('can set widget gap for single span', async () => {
      await expect(homePage).not.toHaveAttribute('gap');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual(null);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gap = '50'; });
      await expect(homePage).toHaveAttribute('gap', '50');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual('50');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gap = null; });
      await expect(homePage).not.toHaveAttribute('gap');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual(null);
    });

    test('can set widget gap-x for single span', async () => {
      await expect(homePage).not.toHaveAttribute('gap-x');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual(null);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapX = '50'; });
      await expect(homePage).toHaveAttribute('gap-x', '50');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual('50');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapX = null; });
      await expect(homePage).not.toHaveAttribute('gap-x');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual(null);
    });

    test('can set widget gap-y for single span', async () => {
      await expect(homePage).not.toHaveAttribute('gap-y');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual(null);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapY = '50'; });
      await expect(homePage).toHaveAttribute('gap-y', '50');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual('50');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapY = null; });
      await expect(homePage).not.toHaveAttribute('gap-y');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual(null);
    });

    test('can set other gap states', async () => {
      await expect(homePage).not.toHaveAttribute('gap');
      await expect(homePage).not.toHaveAttribute('gap-x');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual(null);
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual(null);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gap = '30'; });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapX = '50'; });
      await expect(homePage).toHaveAttribute('gap', '30');
      await expect(homePage).toHaveAttribute('gap-x', '50');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual('30');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual('50');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gap = null; });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapX = null; });
      await expect(homePage).not.toHaveAttribute('gap');
      await expect(homePage).not.toHaveAttribute('gap-x');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual(null);
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual(null);

      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual(null);
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual(null);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gap = '30'; });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapY = '50'; });
      await expect(homePage).toHaveAttribute('gap', '30');
      await expect(homePage).toHaveAttribute('gap-y', '50');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual('30');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual('50');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gap = null; });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapY = null; });
      await expect(homePage).not.toHaveAttribute('gap');
      await expect(homePage).not.toHaveAttribute('gap-y');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gap)).toEqual(null);
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual(null);

      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual(null);
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual(null);
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapX = '30'; });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapY = '50'; });
      await expect(homePage).toHaveAttribute('gap-x', '30');
      await expect(homePage).toHaveAttribute('gap-y', '50');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual('30');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual('50');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapX = null; });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.gapY = null; });
      await expect(homePage).not.toHaveAttribute('gap-x');
      await expect(homePage).not.toHaveAttribute('gap-y');
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapX)).toEqual(null);
      expect(await homePage.evaluate((homepage: IdsHomePage) => homepage.gapY)).toEqual(null);
    });

    test('can trigger resized event', async ({ eventsTest }) => {
      await eventsTest.onEvent('ids-home-page', 'resized');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.container?.style.setProperty('width', '1000px'); });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.container?.style.setProperty('width', '800px'); });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.refresh(); });
      expect(await eventsTest.isEventTriggered('ids-home-page', 'resized')).toBeTruthy();
    });

    test('can trigger resized event in RTL', async ({ page, eventsTest }) => {
      await page.evaluate(async () => {
        const container = document.querySelector('ids-container') as any;
        container.localeAPI.setLanguage('ar');
      });
      await expect(homePage).toHaveAttribute('dir', 'rtl');
      await eventsTest.onEvent('ids-home-page', 'resized');
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.container?.style.setProperty('width', '1000px'); });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.container?.style.setProperty('width', '800px'); });
      await homePage.evaluate((homepage: IdsHomePage) => { homepage.refresh(); });
      expect(await eventsTest.isEventTriggered('ids-home-page', 'resized')).toBeTruthy();
    });

    test('can append widget', async ({ page }) => {
      await page.evaluate(async () => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400, writable: true });
        Object.defineProperty(ohomePage?.container, 'offsetWidth', { configurable: true, value: 1250, writable: true });
      });
      let id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(0);
      await page.evaluate(() => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        let template = document.createElement('template');
        template.innerHTML = `
          <ids-widget slot="widget" id = "test-widget" colspan="4" rowspan="2"></ids-widget>`;
        let widget = template.content.cloneNode(true);
        ohomePage!.cols = '4';
        ohomePage?.appendChild(widget);
        template = document.createElement('template');
        template.innerHTML = `
          <ids-widget slot="widget"></ids-widget>`;
        widget = template.content.cloneNode(true);
        ohomePage?.appendChild(widget);
      });
      id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(1);
    });

    test('can append widget in RTL', async ({ page }) => {
      await page.evaluate(async () => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400, writable: true });
        Object.defineProperty(ohomePage?.container, 'offsetWidth', { configurable: true, value: 1250, writable: true });
        const container = document.querySelector('ids-container') as any;
        container.localeAPI.setLanguage('ar');
      });
      let id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(0);
      await page.evaluate(() => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        let template = document.createElement('template');
        template.innerHTML = `
          <ids-widget slot="widget" id = "test-widget" colspan="4" rowspan="2"></ids-widget>`;
        let widget = template.content.cloneNode(true);
        ohomePage!.cols = '4';
        ohomePage?.appendChild(widget);
        template = document.createElement('template');
        template.innerHTML = `
          <ids-widget slot="widget"></ids-widget>`;
        widget = template.content.cloneNode(true);
        ohomePage?.appendChild(widget);
      });
      id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(1);
    });

    test('can adjust column width', async ({ page }) => {
      await page.evaluate(async () => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800, writable: true });
        Object.defineProperty(ohomePage?.container, 'offsetWidth', { configurable: true, value: 750, writable: true });
      });
      let id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(0);
      await page.evaluate(() => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        const template = document.createElement('template');
        template.innerHTML = `
        <ids-widget slot="widget" id="test-widget"></ids-widget>
        <ids-widget slot="widget" colspan="4"></ids-widget>
        <ids-widget slot="widget" rowspan="2"></ids-widget>
        <ids-widget slot="widget"></ids-widget>`;
        const widget = template.content.cloneNode(true);
        ohomePage!.cols = '4';
        ohomePage?.appendChild(widget);
      });
      id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(1);
    });

    test('can adjust extra column', async ({ page }) => {
      await page.evaluate(async () => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 2200, writable: true });
        Object.defineProperty(ohomePage?.container, 'offsetWidth', { configurable: true, value: 2150, writable: true });
      });
      let id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(0);
      await page.evaluate(() => {
        const ohomePage = document.querySelector<IdsHomePage>('ids-home-page');
        const template = document.createElement('template');
        template.innerHTML = `
        <ids-widget slot="widget" id="test-widget"></ids-widget>
        <ids-widget slot="widget" colspan="6"></ids-widget>
        <ids-widget slot="widget" rowspan="2"></ids-widget>
        <ids-widget slot="widget"></ids-widget>
        <ids-widget slot="widget"></ids-widget>
        <ids-widget slot="widget" colspan="5"></ids-widget>
        <ids-widget slot="widget" colspan="3" rowspan="2"></ids-widget>
        <ids-widget slot="widget" colspan="3"></ids-widget>`;
        const widget = template.content.cloneNode(true);
        ohomePage!.animated = 'false';
        ohomePage!.cols = '6';
        ohomePage?.appendChild(widget);
      });
      id = await homePage.locator('#test-widget').all();
      await expect(id).toHaveLength(1);
    });
  });
});
