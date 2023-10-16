import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTag from '../../src/components/ids-tag/ids-tag';

test.describe('IdsTag tests', () => {
  const url = '/ids-tag/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tag Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page }) => {
      const handle = await page.$('ids-tag');
      const html = await handle?.evaluate((node: IdsTag) => node?.outerHTML);
      await expect(html).toMatchSnapshot('tag-html');
    });

    test('should match shadowRoot snapshot', async ({ page }) => {
      const handle = await page.$('ids-tag');
      const html = await handle?.evaluate((node: IdsTag) => {
        node?.shadowRoot?.querySelector('style')?.remove();
        return node?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tag-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-tag-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able to set color', async ({ page }) => {
      const locator = await page.locator('ids-tag').first();
      const handle = await page.$('ids-tag');
      await handle?.evaluate((node: IdsTag) => {
        node.color = 'success';
      });
      await expect(await locator.getAttribute('color')).toEqual('success');
      await handle?.evaluate((node: IdsTag) => {
        node.color = '';
      });
      await expect(await locator.getAttribute('color')).toEqual(null);
    });

    test('should be able to set disabled', async ({ page }) => {
      const handle = await page.$('ids-tag');
      let result = await handle?.evaluate((node: IdsTag) => {
        node.setAttribute('disabled', 'true');
        return node.disabled;
      });
      await expect(result).toEqual(true);
      result = await handle?.evaluate((node2: IdsTag) => {
        node2.setAttribute('disabled', 'false');
        return node2.disabled;
      });
      await expect(await handle?.getAttribute('disabled')).toEqual(null);
    });
  });

  test.describe('method tests', () => {
    test('should be able to call dismiss', async ({ page }) => {
      let handle = await page.$('ids-tag[dismissible]:not([disabled])');
      let checkText = await handle?.innerText();
      expect(checkText?.trim()).toBe('Dismissible Tag 1');

      await handle?.evaluate((node: IdsTag) => node.dismiss());

      handle = await page.$('ids-tag[dismissible]:not([disabled])');
      checkText = await handle?.innerText();
      expect(checkText?.trim()).toBe('Dismissible Tag 2');
    });
  });
});
