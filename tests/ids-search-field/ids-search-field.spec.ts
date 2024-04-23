import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSearchField from '../../src/components/ids-search-field/ids-search-field';

test.describe('IdsSearchField tests', () => {
  const url = '/ids-search-field/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Search Field Component');
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
        .disableRules(['nested-interactive'])
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-search-field')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('search-field-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-search-field')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('search-field-shadow');
    });

    test('should match categories snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('#categories')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('search-field-categories-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-search-field-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to set the label', async ({ page }) => {
      const newLabel = await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.label = 'Test Label';
        return searchField.label;
      });
      expect(newLabel).toEqual('Test Label');
    });

    test('should be able to set the value', async ({ page }) => {
      const newValue = await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.value = 'Test Value';
        return searchField.value;
      });
      expect(newValue).toEqual('Test Value');
    });

    test('should be able to set the placeholder', async ({ page }) => {
      const newPlaceholder = await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.placeholder = 'Test Placeholder';
        return searchField.placeholder;
      });
      expect(newPlaceholder).toEqual('Test Placeholder');
    });

    test('should be able to set to disabled', async ({ page }) => {
      expect(await page.locator('ids-search-field').first().getAttribute('disabled')).toBeFalsy();

      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.disabled = true;
      });
      expect(await page.locator('ids-search-field').first().getAttribute('disabled')).toBeTruthy();

      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.disabled = false;
      });
      expect(await page.locator('ids-search-field').first().getAttribute('disabled')).toBeFalsy();
    });

    test('should be able to set to readonly', async ({ page }) => {
      expect(await page.locator('ids-search-field').first().getAttribute('readonly')).toBeFalsy();

      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.readonly = true;
      });
      expect(await page.locator('ids-search-field').first().getAttribute('readonly')).toBeTruthy();

      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.readonly = false;
      });
      expect(await page.locator('ids-search-field').first().getAttribute('readonly')).toBeFalsy();
    });

    test('should be able to set collapsible', async ({ page }) => {
      // Set collapsible attribute to true
      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.collapsible = true;
      });

      // Verify that the collapsible attribute is set
      const isCollapsibleSet = await page.$eval('ids-search-field', (el) => el.hasAttribute('collapsible'));
      expect(isCollapsibleSet).toBeTruthy();

      // Set collapsible attribute to false
      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.collapsible = false;
      });

      // Verify that the collapsible attribute is removed
      const isCollapsibleRemoved = await page.$eval('ids-search-field', (el) => !el.hasAttribute('collapsible'));
      expect(isCollapsibleRemoved).toBeTruthy();
    });

    test('should be able to set collapsibleResponsive', async ({ page }) => {
      // Set collapsible-responsive attribute to 'xl'
      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.collapsibleResponsive = 'xl';
      });

      // Verify that the collapsible-responsive attribute is set to 'xl'
      const isCollapsibleResponsiveSet = await page.$eval('ids-search-field', (el) => el.getAttribute('collapsible-responsive') === 'xl');
      expect(isCollapsibleResponsiveSet).toBeTruthy();

      // Set invalid value for collapsible-responsive attribute
      await page.evaluate(() => {
        const searchField = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchField.collapsibleResponsive = 'invalidValue';
      });

      // Verify that the collapsible-responsive attribute is removed
      const isCollapsibleResponsiveRemoved = await page.$eval('ids-search-field', (el) => !el.hasAttribute('collapsible-responsive'));
      expect(isCollapsibleResponsiveRemoved).toBeTruthy();
    });

    test('can init readonly via a template', async ({ page }) => {
      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', `<ids-search-field id="test-append" readonly label="Test" value="Test"></ids-search-field>`);
      });

      expect(await page.locator('ids-search-field#test-append').getAttribute('readonly')).toBeTruthy();
    });

    test('can init disabled via a template', async ({ page }) => {
      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', `<ids-search-field id="test-append" disabled label="Test" value="Test"></ids-search-field>`);
      });

      expect(await page.locator('ids-search-field#test-append').getAttribute('disabled')).toBeTruthy();
    });

    test('should be able to clear readonly/disabled with clearable-forced', async ({ page }) => {
      let foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('ids-search-field[disabled]')!;
        searchField.clearable = true;
        return searchField.container.querySelector('.btn-clear');
      });
      expect(foundHtml).toEqual(null);

      foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('ids-search-field[disabled]')!;
        searchField.clearable = true;
        searchField.clearableForced = true;
        return searchField.container.querySelector('.btn-clear');
      });
      expect(foundHtml).not.toEqual(null);

      foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('ids-search-field[readonly]')!;
        searchField.clearable = true;
        return searchField.container.querySelector('.btn-clear');
      });
      expect(foundHtml).toEqual(null);

      foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('ids-search-field[readonly]')!;
        searchField.clearable = true;
        searchField.clearableForced = true;
        return searchField.container.querySelector('.btn-clear');
      });
      expect(foundHtml).not.toEqual(null);
    });

    test('should be able to show an action button', async ({ page }) => {
      const foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('#categories-button')!;
        return searchField.container.querySelector('#category-action-button');
      });
      expect(foundHtml).not.toEqual(null);
    });

    test('should render full category buttons', async ({ page }) => {
      const foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('#categories-multiple')!;
        return [
          searchField.container.querySelector('ids-popup-menu')?.textContent,
          searchField.container.querySelector('ids-menu-button').textContent
        ];
      });
      expect(foundHtml[0]).toContain('ImagesDocumentsAudioVideo');
      expect(foundHtml[1]).toContain('Files');
    });

    test('should render short category buttons', async ({ page }) => {
      const foundHtml = await page.evaluate(() => {
        const searchField = document.querySelector<any>('#categories-short')!;
        return [
          searchField.container.querySelector('ids-popup-menu')?.textContent,
          searchField.container.querySelector('ids-menu-button').textContent
        ];
      });
      expect(foundHtml[0]).toContain('ImagesDocumentsAudioVideo');
      expect(foundHtml[1]).toContain('Select Search Category');
    });
  });

  test.describe('event tests', () => {
    test('should trigger an input event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const searchfield = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchfield?.addEventListener('input', () => { calls++; });
        searchfield?.dispatchEvent(new Event('input'));
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should trigger a keydown event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const searchfield = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchfield?.addEventListener('keydown', () => { calls++; });
        searchfield?.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should trigger an onSearch callback', async ({ page }) => {
      const found = await page.evaluate(async () => {
        const data = ['one', 'two', 'three', 'four', 'five'];
        const searchfield = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchfield.onSearch = (val: any) => data.filter((item) => item.includes(val));
        const results = await searchfield.search('five');
        return results.length;
      });
      expect(found).toBe(1);

      const found2 = await page.evaluate(async () => {
        const data = ['one', 'two', 'three', 'four', 'five'];
        const searchfield = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchfield.onSearch = (val: any) => data.filter((item) => item.includes(val));
        const results = await searchfield.search('f');
        return results.length;
      });
      expect(found2).toBe(2);
    });

    test('should trigger a change event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const searchfield = document.querySelector<IdsSearchField>('ids-search-field')!;
        searchfield.addEventListener('change', () => { calls++; });
        searchfield.value = 'new value';
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should trigger a search event on button click', async ({ page }) => {
      const noOfCalls = await page.evaluate(async () => {
        let calls = 0;
        const searchfield = document.querySelector<any>('#categories-button')!;
        await searchfield.addEventListener('search', () => { calls++; });
        await searchfield!.container!.querySelector('#category-action-button')!.click();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should trigger a selected/deselected event on category select', async ({ page }) => {
      const noOfCalls = await page.evaluate(async () => {
        let calls1 = 0;
        let calls2 = 0;
        const searchfield = document.querySelector<IdsSearchField>('#categories-multiple')!;
        await searchfield.addEventListener('selected', () => { calls1++; });
        await searchfield.addEventListener('deselected', () => { calls2++; });
        await (searchfield!.container!.querySelector('ids-popup-menu') as any).items[1]!.click();
        await (searchfield!.container!.querySelector('ids-popup-menu') as any).items[1]!.click();
        return [calls1, calls2];
      });
      expect(await noOfCalls[0]).toBe(1);
      expect(await noOfCalls[1]).toBe(1);
    });

    test('should update menu-button text to say # selected', async ({ page }) => {
      const vals = await page.evaluate(async () => {
        const values = [];
        const searchfield = document.querySelector<IdsSearchField>('#categories-multiple')!;
        await (searchfield!.container!.querySelector('ids-popup-menu') as any).items[2]!.click();
        values[0] = searchfield!.container!.querySelector('ids-menu-button')!.textContent;
        await (searchfield!.container!.querySelector('ids-popup-menu') as any).items[3]!.click();
        values[1] = searchfield!.container!.querySelector('ids-menu-button')!.textContent;
        await (searchfield!.container!.querySelector('ids-popup-menu') as any).items[2]!.click();
        values[2] = searchfield!.container!.querySelector('ids-menu-button')!.textContent;
        return values;
      });
      expect(await vals[0]).toMatch('Audio');
      expect(await vals[1]).toMatch('2 Selected');
      expect(await vals[2]).toMatch('Video');
    });
  });
});
