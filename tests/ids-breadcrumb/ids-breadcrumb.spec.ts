import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsBreadcrumb from '../../src/components/ids-breadcrumb/ids-breadcrumb';

test.describe('IdsBreadcrumb tests', () => {
  const url = '/ids-breadcrumb/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Breadcrumb Component');
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
        .exclude('[disabled]')
        .disableRules(['aria-required-children', 'aria-required-parent'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-breadcrumb');
      const html = await handle?.evaluate((el: IdsBreadcrumb) => el?.outerHTML);
      await expect(html).toMatchSnapshot('breadcrumb-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-breadcrumb');
      const html = await handle?.evaluate((el: IdsBreadcrumb) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('breadcrumb-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-breadcrumb-light');
    });
  });

  test.describe('add/remove breadcrumb tests', () => {
    test('can add new crumbs and the attributes are set', async ({ page }) => {
      await page.evaluate(() => {
        const first = document.querySelector('ids-breadcrumb ids-hyperlink') as HTMLElement;
        first.insertAdjacentHTML('afterend', '<ids-hyperlink href="#">New Crumb</ids-hyperlink>');
      });
      const locator = await page.locator('ids-breadcrumb ids-hyperlink:nth-child(2)');
      expect(await locator?.innerHTML()).toBe('New Crumb');
      expect(await locator?.getAttribute('text-decoration')).toBe('hover');
      expect(await locator?.getAttribute('font-size')).toBe('14');
      expect(await locator?.getAttribute('color-variant')).toBe('breadcrumb');
    });

    test('can add new crumbs and force overflow', async ({ page }) => {
      let locator = await page.locator('ids-breadcrumb ids-menu-button');
      expect(await locator?.isVisible()).toBe(false);
      await page.evaluate(() => {
        document.querySelector('ids-breadcrumb')?.setAttribute('truncate', 'true');
        const first = document.querySelector('ids-breadcrumb ids-hyperlink') as HTMLElement;
        for (let i = 0; i < 40; i++) {
          first.insertAdjacentHTML('afterend', '<ids-hyperlink href="#">New Crumb</ids-hyperlink>');
        }
      });
      locator = await page.locator('ids-breadcrumb ids-menu-button');
      expect(await locator?.isVisible()).toBe(true);
    });

    test('can not click current item', async ({ page }) => {
      const events = await page.evaluate(() => {
        const current = document.querySelector<IdsBreadcrumb>('ids-breadcrumb')?.current;
        return current?.shadowRoot?.querySelector('a')?.style.pointerEvents;
      });
      expect(events).toBe('none');
    });
  });
});
