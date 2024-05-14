import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsFilterField from '../../src/components/ids-filter-field/ids-filter-field';

test.describe('IdsFilterField tests', () => {
  const url = '/ids-filter-field/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Filter Field Component');
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
      const handle = await page.$('ids-filter-field');
      const html = await handle?.evaluate((el: IdsFilterField) => el?.outerHTML);
      await expect(html).toMatchSnapshot('filter-field-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-filter-field');
      const html = await handle?.evaluate((el: IdsFilterField) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('filter-field-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-filter-field-light');
    });
  });

  test.describe('IdsFilterField functionality tests', () => {
    test('setting filter field value progamatically', async ({ page }) => {
      const handle = await page.locator('ids-filter-field').first();
      const value = await handle.evaluate((filterField: IdsFilterField) => {
        filterField.value = 'Test Value';
        return filterField.value;
      });

      expect(value).toEqual('Test Value');
    });

    test('setting filter field operator programitcally', async ({ page }) => {
      const handle = await page.locator('ids-filter-field').first();
      const operator = await handle.evaluate((filterField: IdsFilterField) => {
        filterField.operator = 'does-not-equal';
        return filterField.operator;
      });

      expect(operator).toEqual('does-not-equal');
    });

    test('setting custom filter field configuration', async ({ page }) => {
      const handle = await page.locator('ids-filter-field').first();
      const operatorsCount = await handle.evaluate((filterField: IdsFilterField) => {
        filterField.operators = [
          {
            text: 'Equals',
            value: 'equals',
            icon: 'filter-equals',
            selected: true
          },
          {
            text: 'Does not equal',
            value: 'does-not-equal',
            icon: 'filter-does-not-equal',
            selected: false
          }
        ];
        return filterField.menuButton?.menuEl.querySelectorAll('ids-menu-item').length;
      });

      expect(operatorsCount).toEqual(2);
    });

    test('filter field change event', async ({ page }) => {
      const handle = await page.locator('ids-filter-field').first();

      // set input value
      await handle.evaluate((filterField: IdsFilterField) => {
        filterField.value = 'Test Value';
        return filterField.value;
      });

      // set operator value
      await page.locator('ids-filter-field ids-menu-button').first().click();
      await page.locator('ids-filter-field ids-menu-item[value="does-not-equal"]').first().click();

      // attach change event
      const changeEvent: any = await handle.evaluate((filterField: IdsFilterField) => {
        const p = new Promise((resolve) => {
          filterField.addEventListener('change', ((evt: CustomEvent) => {
            resolve(evt.detail);
          }) as EventListener, { once: true });
          filterField.triggerChangeEvent();
        });

        return p;
      });

      expect(changeEvent.value).toEqual('Test Value');
      expect(changeEvent.operator).toEqual('does-not-equal');
    });
  });
});
