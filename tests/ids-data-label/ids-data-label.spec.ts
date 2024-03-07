import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect, Locator } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataLabel from '../../src/components/ids-data-label/ids-data-label';
import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsDataLabel tests', () => {
  const url = '/ids-data-label/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Data Label Component');
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
      const handle = await page.$('ids-data-label');
      const html = await handle?.evaluate((el: IdsDataLabel) => el?.outerHTML);
      await expect(html).toMatchSnapshot('data-label-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-data-label');
      const html = await handle?.evaluate((el: IdsDataLabel) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('data-label-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-data-label-light');
    });
  });

  test.describe('functionality test', () => {
    test('can change label position', async ({ page }) => {
      const idsDataLabel: Locator = page.locator('ids-data-label').first();
      const childContainer: Locator = idsDataLabel.locator('div').first();

      // initial position at left
      const defaultPosition: string = 'left';
      await expect(idsDataLabel).toHaveAttribute('label-position', defaultPosition);
      await expect(childContainer).toHaveClass(new RegExp(`${defaultPosition}-positioned`, 'g'));

      const testData: (string | null)[] = ['top', 'left', '', null];
      for (const data of testData) {
        await idsDataLabel.evaluate((element: IdsDataLabel, tData: string | null) => {
          element.labelPosition = tData;
        }, data);
        await expect(idsDataLabel).toHaveAttribute('label-position', (data && data.length > 0) ? data : defaultPosition);
        await expect(childContainer).toHaveClass(new RegExp(`${(data && data.length > 0) ? data : defaultPosition}-positioned`, 'g'));
      }
    });

    test('can set label', async ({ page }) => {
      const idsDataLabel: Locator = page.locator('ids-data-label').first();
      const childIdsText: Locator = idsDataLabel.locator('ids-text[class="label"]');
      const colonTemplate: string = '<span class="colon">:</span>';

      let changeLabel: string = 'Label Test';
      await idsDataLabel.evaluate((element: IdsDataLabel, label: string) => { element.label = label; }, changeLabel);
      await expect(idsDataLabel).toHaveAttribute('label', changeLabel);
      expect(await childIdsText.innerHTML()).toEqual(changeLabel + colonTemplate);

      changeLabel = '';
      await idsDataLabel.evaluate((element: IdsDataLabel, label: string) => { element.label = label; }, changeLabel);
      await expect(idsDataLabel).not.toHaveAttribute('label');
      expect(await childIdsText.innerHTML()).toEqual(changeLabel + colonTemplate);
    });

    test('can inherit language from parent element', async ({ page }) => {
      await page.locator('ids-container').evaluate((element: IdsContainer) => element.localeAPI.setLanguage('fr'));
      await expect(page.locator('ids-data-label').first()).toHaveAttribute('language', 'fr');
    });
  });
});
