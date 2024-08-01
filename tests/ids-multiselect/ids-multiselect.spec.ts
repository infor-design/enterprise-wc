import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect, Locator } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMultiselect from '../../src/components/ids-multiselect/ids-multiselect';

test.describe('IdsMultiselect tests', () => {
  const url = '/ids-multiselect/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Multiselect Component');
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
        .disableRules(['nested-interactive', 'color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-multiselect');
      const html = await handle?.evaluate((el: IdsMultiselect) => el?.outerHTML);
      await expect(html).toMatchSnapshot('multiselect-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-multiselect');
      const html = await handle?.evaluate((el: IdsMultiselect) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('multiselect-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-multiselect-light');
    });
  });

  test.describe('event tests', () => {
    test.skip('should fire a change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-multiselect') as IdsMultiselect;
        dropdown?.addEventListener('change', () => { changeCount++; });
        dropdown.value = ['ca'];
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire an input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-multiselect') as IdsMultiselect;
        dropdown?.addEventListener('input', () => { changeCount++; });
        dropdown.value = ['ca'];
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });

  test.describe('typeahead tests', async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-multiselect/typeahead.html');
    });

    const getOptions = async (multiselect: Locator) => {
      const options = await multiselect.evaluate(
        (elem: IdsMultiselect) => [...elem.options].map((option) => option.value)
      );
      return options;
    };

    test('should filter options when typing', async ({ page }) => {
      const multiselect = await page.locator('#multiselect-typeahead-checkboxes-no-value');

      expect(await getOptions(multiselect)).toHaveLength(7);
      await multiselect.evaluate((elem: IdsMultiselect) => {
        elem.trigger?.click();
      });
      await page.keyboard.type('ar');
      expect(await getOptions(multiselect)).toHaveLength(2);
      expect(await getOptions(multiselect)).toEqual(['az', 'ar']);
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      expect(await getOptions(multiselect)).toHaveLength(7);
      await page.keyboard.type('are');
      expect(await getOptions(multiselect)).toHaveLength(1);
      expect(await multiselect.evaluate((elem: IdsMultiselect) => elem.options.map((item) => item.textContent))).toEqual(['No results']);
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      await page.keyboard.type('ar');
      expect(await getOptions(multiselect)).toHaveLength(2);
      await multiselect.evaluate((elem: IdsMultiselect) => {
        elem.options.forEach((item) => {
          item.click();
        });
      });
      await page.locator('ids-layout-grid').first().click();
      expect(await multiselect.evaluate((elem: IdsMultiselect) => elem.value)).toEqual(['az', 'ar']);
    });

    test('should attach search field to the tags typeahead', async ({ page }) => {
      const multiselect = await page.locator('#multiselect-typeahead-tags');
      expect(await multiselect.evaluate((elem: IdsMultiselect) => elem.searchField)).not.toBeNull();
      await multiselect.evaluate((elem: IdsMultiselect) => {
        elem.trigger?.click();
      });
      await page.keyboard.type('ar');
      expect(await getOptions(multiselect)).toHaveLength(3);
      expect(await getOptions(multiselect)).toEqual(['long-text', 'az', 'ar']);
    });
  });
});
