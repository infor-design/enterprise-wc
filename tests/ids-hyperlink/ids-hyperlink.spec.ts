import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

test.describe('IdsHyperlink tests', () => {
  const url = '/ids-hyperlink/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Hyperlink Component');
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

    test('disable should not fire events', async ({ page }) => {
      const enabledClick = await page?.evaluate(() => {
        let enabledClickCount = 0;
        const hyperlink = document.querySelector('ids-hyperlink');
        hyperlink?.addEventListener('click', () => {
          enabledClickCount++;
        });

        hyperlink?.dispatchEvent(new MouseEvent('click'));

        return enabledClickCount;
      });

      expect(enabledClick).toBe(1);

      const disabledClick = await page?.evaluate(() => {
        let disabledClickCount = 0;
        const hyperlink = document.querySelector('ids-hyperlink[disabled]');
        hyperlink?.addEventListener('click', () => {
          disabledClickCount++;
        });

        hyperlink?.dispatchEvent(new MouseEvent('click'));

        return disabledClickCount;
      });

      expect(disabledClick).toBe(0);
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
      const handle = await page.$('ids-hyperlink');
      const html = await handle?.evaluate((el: IdsHyperlink) => el?.outerHTML);
      await expect(html).toMatchSnapshot('hyperlink-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-hyperlink');
      const html = await handle?.evaluate((el: IdsHyperlink) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('hyperlink-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-hyperlink-light');
    });
  });
});
