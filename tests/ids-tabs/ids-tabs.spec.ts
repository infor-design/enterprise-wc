import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTabs from '../../src/components/ids-tabs/ids-tabs';

test.describe('IdsTabs tests', () => {
  const url = '/ids-tabs/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tabs Component');
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
      const handle = await page.$('ids-tabs');
      const html = await handle?.evaluate((el: IdsTabs) => el?.outerHTML);
      await expect(html).toMatchSnapshot('tabs-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-tabs');
      const html = await handle?.evaluate((el: IdsTabs) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tabs-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-tabs-light');
    });

    test('should match the visual snapshot in percy for header tabs', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('http://localhost:4444/ids-tabs/header-tabs.html');
      await percySnapshot(page, 'ids-tabs-header-light');
    });

    test('should match the visual snapshot in percy for vertical tabs', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('http://localhost:4444/ids-tabs/vertical.html');
      await percySnapshot(page, 'ids-tabs-vertical-light');
    });

    test('should match the visual snapshot in percy for selected tabs', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('http://localhost:4444/ids-tabs/selected.html');
      await percySnapshot(page, 'ids-tabs-selected-light');
    });

    test('should match the visual snapshot in percy for module tabs', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('http://localhost:4444/ids-tabs/module.html');
      await percySnapshot(page, 'ids-tabs-module-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should update via resize observer', async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector('ids-tabs')!.innerHTML = '<ids-tab value="tab1">Tab 1</ids-tab><ids-tab value="tab2">Tab 2</ids-tab>';
      });
      const innerHTML = await page.evaluate(() => document.querySelector('ids-tabs')!.innerHTML);
      expect(innerHTML).toEqual('<ids-tab value="tab1" role="tab" aria-selected="false" tabindex="-1" aria-label="Tab 1">Tab 1</ids-tab><ids-tab value="tab2" role="tab" aria-selected="true" tabindex="0" aria-label="Tab 2" selected="">Tab 2</ids-tab>');
    });

    test('can use arrow left/right keys to focus', async ({ page }) => {
      await page.focus('ids-tab');
      let innerHTML = await page.evaluate(() => document.activeElement?.innerHTML);
      await expect(await innerHTML).toEqual('Contracts');

      await page.keyboard.down('ArrowRight');
      await page.keyboard.down('ArrowRight');
      await page.keyboard.down('ArrowLeft');
      await page.keyboard.down('Enter');
      innerHTML = await page.evaluate(() => document.activeElement?.innerHTML);
      await expect(await innerHTML).toEqual('Opportunities');
    });

    test('can use home/end keys to focus', async ({ page }) => {
      await page.focus('ids-tab');

      await page.keyboard.down('End');
      await page.keyboard.down('Enter');
      let innerHTML = await page.evaluate('document.activeElement.innerHTML');
      await expect(await innerHTML).toEqual('Notes');

      await page.keyboard.down('Home');
      await page.keyboard.down('Enter');
      innerHTML = await page.evaluate('document.activeElement.innerHTML');
      await expect(await innerHTML).toEqual('Contracts');
    });

    test('should have an aria-label', async ({ page }) => {
      const locator = await page.locator('ids-tab').first();
      expect(await locator.getAttribute('aria-label')).toEqual('Contracts');
    });
  });
});
