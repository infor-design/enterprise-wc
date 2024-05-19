import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsExpandableArea from '../../src/components/ids-expandable-area/ids-expandable-area';

test.describe('IdsExpandableArea tests', () => {
  const url = '/ids-expandable-area/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Expandable Area Component');
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
        .disableRules('aria-allowed-attr')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-expandable-area');
      const html = await handle?.evaluate((el: IdsExpandableArea) => el?.outerHTML);
      await expect(html).toMatchSnapshot('expandable-area-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-expandable-area');
      const html = await handle?.evaluate((el: IdsExpandableArea) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('expandable-area-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-expandable-area-light');
    });

    test('can change its type property', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.type = '';
        return element.type;
      })).toEqual('');
      await expect(ea).toHaveAttribute('type', '');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = 'partial'; });
      await expect(ea).toHaveAttribute('type', 'partial');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = null; });
      await expect(ea).toHaveAttribute('type', '');
    });

    test('can change its expanded property', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.expanded = '';
        return element.expanded;
      })).toEqual('');
      await expect(ea).toHaveAttribute('expanded', '');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = 'partial'; });
      await expect(ea).toHaveAttribute('expanded', 'partial');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = null; });
      await expect(ea).toHaveAttribute('expanded', '');
    });
  });
});
