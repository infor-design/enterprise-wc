import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsLoadingIndicator from '../../src/components/ids-loading-indicator/ids-loading-indicator';

test.describe('IdsLoadingIndicator tests', () => {
  const url = '/ids-loading-indicator/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Loading Indicator Component');
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
      const handle = await page.$('ids-loading-indicator');
      const html = await handle?.evaluate((el: IdsLoadingIndicator) => el?.outerHTML);
      await expect(html).toMatchSnapshot('loading-indicator-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-loading-indicator');
      const html = await handle?.evaluate((el: IdsLoadingIndicator) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('loading-indicator-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-loading-indicator-light');
    });

    test('should match the visual snapshot in percy on full page', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-loading-indicator/full-page.html');
      await percySnapshot(page, 'ids-loading-indicator-full-page-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should set progress', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await expect(await locator.getAttribute('progress')).toEqual(null);
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.progress = 90;
      });
      await expect(await locator.getAttribute('progress')).toEqual('90');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.progress = null;
      });
      await expect(await locator.getAttribute('progress')).toEqual(null);
    });

    test('should set overlay', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await expect(await locator.getAttribute('overlay')).toEqual(null);
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.overlay = true;
      });
      await expect(await locator.getAttribute('overlay')).toEqual('');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.overlay = false;
      });
      await expect(await locator.getAttribute('overlay')).toEqual(null);
    });

    test('should set sticky by attribute', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.setAttribute('sticky', 'true');
      });
      await expect(await locator.getAttribute('sticky')).toEqual('true');
    });

    test('should set linear by attribute', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.setAttribute('linear', 'true');
      });
      await expect(await locator.getAttribute('linear')).toEqual('true');
    });

    test('should set contained by attribute', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.setAttribute('contained', 'true');
      });
      await expect(await locator.getAttribute('contained')).toEqual('true');
    });

    test('calls type getter reliably based on flags set', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.setAttribute('linear', 'true');
      });

      let type = await handle?.evaluate((el: IdsLoadingIndicator) => el.type);
      expect(type).toEqual('linear');
      await expect(await locator.getAttribute('sticky')).toEqual(null);

      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.setAttribute('sticky', 'true');
      });

      type = await handle?.evaluate((el: IdsLoadingIndicator) => el.type);
      expect(type).toEqual('sticky');
      await expect(await locator.getAttribute('sticky')).toEqual('true');

      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.removeAttribute('sticky');
      });
      type = await handle?.evaluate((el: IdsLoadingIndicator) => el.type);
      expect(type).toEqual('circular');
    });

    test('should set inline', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await expect(await locator.getAttribute('inline')).toEqual(null);
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.inline = true;
      });
      await expect(await locator.getAttribute('inline')).toEqual('');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.inline = false;
      });
      await expect(await locator.getAttribute('inline')).toEqual(null);
    });

    test('should set align', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await expect(await locator.getAttribute('aline')).toEqual(null);
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.align = 'center';
      });
      await expect(await locator.getAttribute('align')).toEqual('center');
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.align = '';
      });
      await expect(await locator.getAttribute('align')).toEqual(null);
    });

    test('should set percentage-visible', async ({ page }) => {
      const locator = await page.locator('ids-loading-indicator').first();
      const handle = await page.$('ids-loading-indicator');
      await expect(await locator.getAttribute('inline')).toEqual(null);
      await handle?.evaluate((el: IdsLoadingIndicator) => {
        el.setAttribute('percentage-visible', 'true');
      });
      await expect(await locator.getAttribute('percentage-visible')).toEqual('true');
    });
  });
});
