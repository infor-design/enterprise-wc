import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPager from '../../src/components/ids-pager/ids-pager';
import IdsPagerButton from '../../src/components/ids-pager/ids-pager-button';

test.describe('IdsPager tests', () => {
  const url = '/ids-pager/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Pager Component');
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
      const handle = await page.$('ids-pager');
      const html = await handle?.evaluate((el: IdsPager) => el?.outerHTML);
      await expect(html).toMatchSnapshot('pager-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-pager');
      const html = await handle?.evaluate((el: IdsPager) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('pager-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-pager-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should not have an error when creating pager dropdown element', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      await page.evaluate(() => {
        document.createElement('ids-pager-dropdown');
      });
      expect(hasConsoleError).toBeFalsy();
    });
  });

  test.describe('pager button tests', () => {
    test('pager buttons have a type', async ({ page }) => {
      const types = await page.evaluate(() => {
        const elem = document.querySelectorAll<IdsPagerButton>('ids-pager-button');
        return [elem[0].type, elem[1].type, elem[2].type, elem[2].type];
      });
      expect(types[0]).not.toBeFalsy();
      expect(types[1]).not.toBeFalsy();
      expect(types[2]).not.toBeFalsy();
      expect(types[3]).not.toBeFalsy();
    });

    test('pager buttons have an icon type', async ({ page }) => {
      expect(await page.locator('ids-pager-button ids-icon').nth(0).getAttribute('icon')).toBe('first-page');
      expect(await page.locator('ids-pager-button ids-icon').nth(1).getAttribute('icon')).toBe('previous-page');
      expect(await page.locator('ids-pager-button ids-icon').nth(2).getAttribute('icon')).toBe('next-page');
      expect(await page.locator('ids-pager-button ids-icon').nth(3).getAttribute('icon')).toBe('last-page');
    });
  });
});
