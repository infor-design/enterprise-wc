import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsFieldset from '../../src/components/ids-fieldset/ids-fieldset';
import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';

test.describe('IdsFieldset tests', () => {
  const url = '/ids-fieldset/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Fieldset Component');
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
      const handle = await page.$('ids-fieldset');
      const html = await handle?.evaluate((el: IdsFieldset) => el?.outerHTML);
      await expect(html).toMatchSnapshot('fieldset-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-fieldset');
      const html = await handle?.evaluate((el: IdsFieldset) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('fieldset-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-fieldset-light');
    });

    test('should match the visual snapshot in percy (dropdowns)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      await page.evaluate(async () => {
        const elem = document.querySelector<IdsDropdown>('ids-dropdown')!;
        await elem.open();
      });
      await percySnapshot(page, 'ids-fieldset-dropdown-light');
    });
  });
});
