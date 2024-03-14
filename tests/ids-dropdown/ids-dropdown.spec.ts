import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';

test.describe('IdsDropdown tests', () => {
  const url = '/ids-dropdown/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Dropdown Component');
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
      const handle = await page.$('ids-dropdown');
      const html = await handle?.evaluate((el: IdsDropdown) => el?.outerHTML);
      await expect(html).toMatchSnapshot('dropdown-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-dropdown');
      const html = await handle?.evaluate((el: IdsDropdown) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('dropdown-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-dropdown-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire a change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-dropdown') as IdsDropdown;
        dropdown?.addEventListener('change', () => { changeCount++; });
        dropdown.value = 'hi';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire an input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-dropdown') as IdsDropdown;
        dropdown?.addEventListener('input', () => { changeCount++; });
        dropdown.value = 'hi';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });

  test.describe('functionality tests', () => {
    test('can set the readonly attribute', async ({ page }) => {
      const isReadonly = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.readonly = true;
        return dropdown?.readonly;
      });
      expect(isReadonly).toBeTruthy();
      expect(await page.locator('ids-dropdown').first().getAttribute('readonly')).toBeTruthy();

      const isReadonly2 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.readonly = false;
        return dropdown?.readonly;
      });
      expect(isReadonly2).toBeFalsy();
      expect(await page.locator('ids-dropdown').first().getAttribute('readonly')).toBeFalsy();

      const isReadonly3 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.setAttribute('readonly', 'true');
        return dropdown?.readonly;
      });
      expect(isReadonly3).toBeTruthy();
      expect(await page.locator('ids-dropdown').first().getAttribute('readonly')).toBeTruthy();

      const isReadonly4 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.setAttribute('readonly', 'false');
        return dropdown?.readonly;
      });
      expect(isReadonly4).toBeFalsy();
      expect(await page.locator('ids-dropdown').first().getAttribute('readonly')).toBeFalsy();
    });

    test('can set the disabled attribute', async ({ page }) => {
      const isDisabled = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.disabled = true;
        return dropdown?.disabled;
      });
      expect(isDisabled).toBeTruthy();
      expect(await page.locator('ids-dropdown').first().getAttribute('disabled')).toBeTruthy();

      const isDisabled2 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.disabled = false;
        return dropdown?.disabled;
      });
      expect(isDisabled2).toBeFalsy();
      expect(await page.locator('ids-dropdown').first().getAttribute('disabled')).toBeFalsy();

      const isDisabled3 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.setAttribute('disabled', 'true');
        return dropdown?.disabled;
      });
      expect(isDisabled3).toBeTruthy();
      expect(await page.locator('ids-dropdown').first().getAttribute('disabled')).toBeTruthy();

      const isDisabled4 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.setAttribute('disabled', 'false');
        return dropdown?.disabled;
      });
      expect(isDisabled4).toBeFalsy();
      expect(await page.locator('ids-dropdown').first().getAttribute('disabled')).toBeFalsy();
    });

    test('can set allow blank', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.allowBlank = true;
        dropdown.value = 'blank';
        return [dropdown?.allowBlank, dropdown.value];
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual('blank');

      const values2 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.allowBlank = false;
        return [dropdown?.allowBlank, dropdown.value];
      });
      expect(values2[0]).toBeFalsy();
      expect(values2[1]).toBeNull();
    });
  });

  test.describe('reattachment tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-dropdown/reattach.html');
    });

    test('popup functionality after reattachment', async ({ page }) => {
      // reattach
      await page.locator('ids-button#reattach').click();

      // open dropdown
      await page.locator('ids-dropdown').click();

      // select another option
      await page.locator('ids-list-box-option[value="opt4"]').click();

      // expect new value to be selected and dropdown list to be hidden
      const selected = await page.locator('ids-dropdown').evaluate((dropdown: IdsDropdown) => dropdown.value);
      await expect(await page.locator('ids-dropdown ids-dropdown-list')).not.toBeVisible();
      expect(selected).toEqual('opt4');
    });
  });
});
