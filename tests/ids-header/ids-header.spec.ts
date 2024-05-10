import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHeader from '../../src/components/ids-header/ids-header';

test.describe('IdsHeader tests', () => {
  const url = '/ids-header/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Header Component');
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
        .disableRules('nested-interactive')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-header');
      const html = await handle?.evaluate((el: IdsHeader) => el?.outerHTML);
      await expect(html).toMatchSnapshot('header-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-header');
      const html = await handle?.evaluate((el: IdsHeader) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('header-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-header-light');
    });

    test('should match the visual snapshot in percy (for colors)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-header/multiple-color.html');
      await percySnapshot(page, 'ids-header-colors-light');
    });
  });

  test.describe('functionality tests', () => {
    test('has a color attribute', async ({ page }) => {
      const locator = await page.locator('ids-header').first();
      expect(await locator.getAttribute('color')).toEqual(null);

      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-header');
        elem.setAttribute('color', '#fff');
      });
      expect(await locator.getAttribute('color')).toEqual('#fff');

      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-header');
        elem.setAttribute('color', '#bb5500');
      });
      expect(await locator.getAttribute('color')).toEqual('#bb5500');

      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-header');
        elem.removeAttribute('color');
      });
      expect(await locator.getAttribute('color')).toEqual(null);
    });
  });
});
