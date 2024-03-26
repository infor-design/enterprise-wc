import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCounts from '../../src/components/ids-counts/ids-counts';

test.describe('IdsCounts tests', () => {
  const url = '/ids-counts/example.html';
  let counts: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    counts = await page.locator('ids-counts').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Counts Component');
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
      const handle = await page.$('ids-counts');
      const html = await handle?.evaluate((eL: IdsCounts) => eL?.outerHTML);
      await expect(html).toMatchSnapshot('counts-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-counts');
      const html = await handle?.evaluate((eL: IdsCounts) => {
        eL?.shadowRoot?.querySelector('style')?.remove();
        return eL?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('counts-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-counts-light');
    });

    test.describe('e2e tests', () => {
      test('can render a specific hex color', async () => {
        await counts.evaluate((element: IdsCounts, eColor: string | null) => {
          element.color = eColor;
        }, '#800000');
        await expect(counts).toHaveAttribute('color', '#800000');
      });

      test('can render a status color', async () => {
        await counts.evaluate((element: IdsCounts, eColor: string | null) => {
          element.color = eColor;
        }, 'base');
        await expect(counts).toHaveAttribute('color', 'base');
      });

      test('can change sizes via compact attribute', async () => {
        await counts.evaluate((element: IdsCounts, val: string | boolean) => {
          element.compact = val;
        }, 'true');
        await expect(counts).toHaveAttribute('compact', 'true');
      });

      test('can change link via href attribute', async () => {
        await counts.evaluate((element: IdsCounts, val: string | null) => {
          element.href = val;
        }, 'http://www.google.com');
        await expect(counts).toHaveAttribute('href', 'http://www.google.com');
      });

      test('can create an ids-hyperlink container', async ({ page }) => {
        const hyperlinks = await page.locator('ids-hyperlink').all();
        await page.evaluate(() => {
          const template = `
          <ids-counts href="#">
            <ids-text count-value>71</ids-text>
            <ids-text count-text>Active <br /> Opportunities</ids-text>
          </ids-counts>`;
          document.querySelector('ids-counts')!.remove();
          document.body.insertAdjacentHTML('beforeend', template);
        });
        await expect(hyperlinks).toHaveLength(5);
      });

      test('can create a compact counts component', async ({ page }) => {
        const countVal = await counts.locator('ids-text[count-value]');
        await page.evaluate(() => {
          const compact = `
          <ids-counts compact="true" href="#">
            <ids-text count-value>7</ids-text>
            <ids-text count-text>Active <br /> Opportunities</ids-text>
          </ids-counts>`;
          document.querySelector('ids-counts')!.remove();
          document.body.insertAdjacentHTML('beforeend', compact);
        });
        await expect(countVal).toHaveCSS('font-size', '16px');
      });
    });
  });
});
