import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsButton from '../../src/components/ids-button/ids-button';

test.describe('IdsButton tests', () => {
  const url = '/ids-button/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Button Component');
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
        .exclude('#test-button-primary')
        .exclude('#test-button-icon-primary')
        .exclude('#test-button-primary-destructive')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-button');
      const html = await handle?.evaluate((el: IdsButton) => el?.outerHTML);
      await expect(html).toMatchSnapshot('button-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-button');
      const html = await handle?.evaluate((el: IdsButton) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('button-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-button-light');
    });
  });

  test.describe('button methods', () => {
    test('should toggle animation', async ({ page }) => {
      const btnSelector = 'ids-button[appearance="primary-generative-ai"]';

      // enable animation via button click
      await page.locator(btnSelector).first().click();
      expect(await page.locator(`${btnSelector} .loading-dots`).first()).toBeVisible();

      // hide animation via api
      await page.evaluate((selector: string) => {
        const aiBtn = document.querySelector<IdsButton>(selector);
        aiBtn?.toggleAnimation(false);
      }, btnSelector);
      expect(await page.locator(`${btnSelector} .loading-dots`).first()).not.toBeVisible();
    });
  });
});
