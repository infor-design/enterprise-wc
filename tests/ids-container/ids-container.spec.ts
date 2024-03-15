import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsContainer tests', () => {
  const url = '/ids-container/example.html';
  let el: any;
  let cont: any;
  let div: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    cont = await page.locator('ids-container').first();
    div = await cont.locator('.ids-container').first();

    el = 'ids-container';
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Container Component');
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

  test.describe('e2e tests', () => {
    test('can set language via async func', async ({ page }) => {
      await page.evaluate(async (id) => {
        await document.querySelector<IdsContainer>(id)!.localeAPI.setLanguage('ar');
      }, el);
      expect(await cont.getAttribute('dir')).toEqual('rtl');
    });

    test('can set locale via attribute', async ({ page }) => {
      await page.evaluate(async (id) => {
        document.querySelector<IdsContainer>(id)!.locale = 'de-DE';
      }, el);
      // expect(await cont.getAttribute('locale')).toEqual('de-DE');
      const locale = await page.evaluate((id) => document.querySelector<IdsContainer>(id)!.locale, el);
      expect(await locale).toEqual('de-DE');
    });

    test('can set locale via async func', async ({ page }) => {
      await page.evaluate(async (id) => {
        await document.querySelector<IdsContainer>(id)!.localeAPI.setLocale('ar-SA');
      }, el);
      expect(await cont.getAttribute('dir')).toEqual('rtl');
      const locale = await page.evaluate((id) => document.querySelector<IdsContainer>(id)!.locale, el);
      expect(await locale).toEqual('ar-SA');
    });

    test('renders correctly for unscrollable', async ({ page }) => {
      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.scrollable = true;
      }, el);
      const template = await page.evaluate((id) => document.querySelector<IdsContainer>(id)!.template(), el);
      expect(template).toEqual('<div class="ids-container" part="container" tabindex="0"><slot></slot></div>');
    });

    test('can set and reset scrollable', async ({ page }) => {
      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.scrollable = true;
      }, el);
      expect(await cont.getAttribute('scrollable')).toEqual('true');
      expect(await div.getAttribute('scrollable')).toEqual('true');

      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.scrollable = false;
      }, el);
      expect(await cont.getAttribute('scrollable')).toEqual('false');
      expect(await div.getAttribute('scrollable')).toEqual('false');
    });

    test('supports setting language', async ({ page }) => {
      await page.evaluate(async (id) => {
        await document.querySelector<IdsContainer>(id)!.localeAPI.setLanguage('ar');
      }, el);
      expect(await cont.getAttribute('language')).toEqual('ar');
      expect(await cont.getAttribute('dir')).toEqual('rtl');

      await page.evaluate(async (id) => {
        await document.querySelector<IdsContainer>(id)!.localeAPI.setLanguage('de');
      }, el);
      expect(await cont.getAttribute('language')).toEqual('de');
      expect(await cont.getAttribute('dir')).toEqual(null);
    });

    test('has a padding attribute', async ({ page }) => {
      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.padding = '18';
      }, el);
      expect(await cont.getAttribute('padding')).toEqual('18');
      expect(await div.getAttribute('style')).toEqual('padding: 18px;');
    });

    test('has a reset attribute', async ({ page }) => {
      const body = await page.locator('body');
      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.reset = true;
      }, el);
      await expect(body).toHaveCSS('margin', '0px');
      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.reset = false;
      }, el);
      await expect(body).toHaveCSS('margin', '8px');
    });

    test('should remove hidden on window elem', async ({ page }) => {
      await page.evaluate((id) => {
        document.querySelector<IdsContainer>(id)!.hidden = true;
        const event = new KeyboardEvent('load', {});
        window.dispatchEvent(event);
      }, el);
      const ishidden = await page.evaluate((id) => document.querySelector<IdsContainer>(id)!.hidden, el);
      expect(await ishidden).toEqual(true);
    });
  });
});
