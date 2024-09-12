import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMasthead from '../../src/components/ids-masthead/ids-masthead';
import type IdsButton from '../../src/components/ids-button/ids-button';
import type IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';

test.describe('IdsMasthead tests', () => {
  const url = '/ids-masthead/example.html';
  let masthead: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    masthead = await page.locator('ids-masthead').first();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Masthead Component');
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
        .disableRules('color-contrast')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-masthead');
      const html = await handle?.evaluate((el: IdsMasthead) => el?.outerHTML);
      await expect(html).toMatchSnapshot('masthead-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-masthead');
      const html = await handle?.evaluate((el: IdsMasthead) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('masthead-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-masthead-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can restyles buttons to be square and transparent', async ({ page }) => {
      await masthead.evaluate((mastheadEl: IdsMasthead) => { mastheadEl.title = 'Infor Application'; });
      const button = await page.locator('ids-button').first();
      const menubutton = await page.locator('ids-menu-button').first();
      await expect(await button.evaluate((btn: IdsButton) => btn.colorVariant)).toBe('alternate');
      await expect(await menubutton.evaluate((menu: IdsMenuButton) => menu.appearance)).toBe('default');
    });
  });
});
