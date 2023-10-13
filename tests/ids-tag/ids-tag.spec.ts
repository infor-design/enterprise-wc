import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../helpers/base-fixture';
import IdsTag from '../../src/components/ids-tag/ids-tag';

test.describe('IdsTag tests', () => {
  const url = '/ids-tag/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('has a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tag Component');
    });

    test('matches snapshot of innerHTML', async ({ page }) => {
      const tagHandle = await page.$('ids-tag');
      const html = await tagHandle?.evaluate((node: IdsTag) => node?.outerHTML);
      await expect(html).toMatchSnapshot('tag-html');
    });

    test('matches snapshot of shadowRoot', async ({ page }) => {
      const tagHandle = await page.$('ids-tag');
      const html = await tagHandle?.evaluate((node: IdsTag) => {
        node?.shadowRoot?.querySelector('style')?.remove();
        return node?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tag-shadow');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') test.skip();
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

  test.describe('setting/attribute tests', () => {
    test('be able to set and reset color', async ({ page }) => {
      const tagLocator = await page.locator('ids-tag').first();
      const tagHandle = await page.$('ids-tag');
      await tagHandle?.evaluate((node: IdsTag) => {
        node.color = 'success';
      });
      expect(await tagLocator.getAttribute('color')).toEqual('success');
      await tagHandle?.evaluate((node: IdsTag) => {
        node.color = '';
      });
      expect(await tagLocator.getAttribute('color')).toEqual(null);
    });

    test('be able to set to disabled', async ({ page }) => {
      const tagHandle = await page.$('ids-tag');
      let result = await tagHandle?.evaluate((node: IdsTag) => {
        node.setAttribute('disabled', 'true');
        return node.disabled;
      });
      expect(result).toEqual(true);
      result = await tagHandle?.evaluate((node2: IdsTag) => {
        node2.setAttribute('disabled', 'false');
        return node2.disabled;
      });
      expect(await tagHandle?.getAttribute('disabled')).toEqual(null);
    });
  });

  test.describe('method tests', () => {
    test.only('call dismiss', async ({ page }) => {
      let tagHandle = await page.$('ids-tag[dismissible]:not([disabled])');
      let checkText = await tagHandle?.innerText();
      expect(checkText?.trim()).toBe('Dismissible Tag 1');

      await tagHandle?.evaluate((node: IdsTag) => node.dismiss());

      tagHandle = await page.$('ids-tag[dismissible]:not([disabled])');
      checkText = await tagHandle?.innerText();
      expect(checkText?.trim()).toBe('Dismissible Tag 2');
    });
  });
});
