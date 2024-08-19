import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect, Locator } from '@playwright/test';
import { test } from '../base-fixture';
import states from '../../src/assets/data/states.json';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';

import IdsMultiselect from '../../src/components/ids-multiselect/ids-multiselect';

test.describe('IdsMultiselect tests', () => {
  const url = '/ids-multiselect/example.html';
  let multiselectElem: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    multiselectElem = await page.locator('ids-multiselect').first();
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

  test.describe('functionality tests', () => {
    test('renders empty multiselect with no errors', async ({ page }) => {
      await expect((await page.locator('ids-multiselect').all()).length).toEqual(5);
      await page.evaluate(() => {
        const elem = document.querySelectorAll('ids-multiselect');
        elem.forEach((multiseelct) => {
          multiseelct.remove();
        });
      });
      await expect((await page.locator('ids-multiselect').all()).length).toEqual(0);
    });

    test('renders with disabled', async ({ page }) => {
      const disbaledMultiselect = await page.locator('#multiselect-4');
      expect(await disbaledMultiselect.evaluate((elem: IdsMultiselect) => elem.disabled)).toBeTruthy();
    });

    test('renders with readonly', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.readonly = true; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.readonly)).toBeTruthy();
    });

    test('can set readonly', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.readonly = true; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.readonly)).toBeTruthy();
      await expect(multiselectElem).toHaveAttribute('readonly', 'true');

      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.readonly = false; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.readonly)).toBeFalsy();
      await expect(multiselectElem).not.toHaveAttribute('readonly');
    });

    test('can set disabled', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = true; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.disabled)).toBeTruthy();
      await expect(multiselectElem).toHaveAttribute('disabled', 'true');

      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = false; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.disabled)).toBeFalsy();
      await expect(multiselectElem).not.toHaveAttribute('disabled');
    });

    test('renders with validation', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validate = 'required'; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.validate)).toEqual('required');
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.validationEvents)).toEqual('change');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validate = 'required'; elem.validationEvents = 'blur change'; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.validate)).toEqual('required');
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.validationEvents)).toEqual('blur change');
    });

    test('supports validation', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validate = 'required'; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validationEvents = 'blur change'; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.triggerEvent('change', elem); });
      await expect(multiselectElem).toHaveAttribute('validate', 'required');
    });

    test('can reset validation and validation-events', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validate = 'required'; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validationEvents = 'blur change'; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.validate = null; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { (elem.validationEvents as any) = null; });
      await expect(multiselectElem).not.toHaveAttribute('validate');
      await expect(multiselectElem).not.toHaveAttribute('validation-events');
    });

    test('handles setting disabled', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = true; });
      await expect(multiselectElem).toHaveAttribute('disabled', 'true');
      await expect(multiselectElem).not.toHaveAttribute('readonly');
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.disabled)).toEqual(true);
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.input?.disabled)).toEqual(true);
    });

    test('handles setting readonly', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = true; });
      await expect(multiselectElem).toHaveAttribute('disabled', 'true');
      await expect(multiselectElem).not.toHaveAttribute('readonly');
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.disabled)).toEqual(true);
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.input?.disabled)).toEqual(true);
    });

    test('can change the label', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.label = 'Changed Label'; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.label)).toEqual('Changed Label');
    });

    test('can reset dirty indicator', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.dirtyTracker = true; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.dirtyTracker)).toEqual(true);
      await expect(multiselectElem).toHaveAttribute('dirty-tracker', 'true');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.dirtyTracker = false; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.dirtyTracker)).toEqual(false);
      await expect(multiselectElem).not.toHaveAttribute('dirty-tracker');
    });

    test('can set value', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['nj']; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('nj');
    });

    test('can ignore null / bad value', async () => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['nj']; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('nj');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = null; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('nj');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['optx']; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('nj');
    });

    test('supports opening the list with open', async () => {
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.close(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.readonly = true; });
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.readonly = true; });
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = true; });
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('supports opening the list with toggle', async () => {
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.toggle(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.toggle(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('supports closing the list with closing', async () => {
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.close(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.close(true); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('can click outside an open list to close it', async () => {
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await multiselectElem.evaluate(() => {
        const elem: any = document.querySelector('ids-multiselect');
        elem.dropdownList.onOutsideClick({ target: document.body });
      });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('supports async beforeShow', async ({ page }) => {
      await expect((await page.locator('ids-list-box-option').all()).length).toEqual(34);
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.beforeShow)).toBeFalsy();
      await multiselectElem.evaluate((elem: IdsMultiselect, state: any) => {
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(state);
          }, 1);
        });
        elem.beforeShow = async function beforeShow() {
          return getContents();
        };
      }, states);
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await expect((await page.locator('ids-list-box-option').all()).length).toEqual(86);
    });

    test('ignores type ahead to open when no matches', async ({ page }) => {
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { elem.triggerEvent('keydownend', elem, { detail: { keys: 'xxxxx' } }); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('ignores type ahead when readonly', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.readonly = true; });
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { elem.triggerEvent('keydownend', elem, { detail: { keys: 'option thr' } }); });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = true; });
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { elem.triggerEvent('keydownend', elem, { detail: { keys: 'option thr' } }); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('supports clicking trigger to open', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.trigger?.click(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
    });

    test('supports clicking input to open', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { (elem?.input?.shadowRoot?.querySelector('.field-container') as any).click(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toBeTruthy();
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
    });

    test('supports clicking to select', async ({ page }) => {
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('nj');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.trigger?.click(); });
      await multiselectElem.locator('ids-list-box-option').nth(4).click();
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('nj');
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toContain('az');
    });

    test('can changing language from the container', async ({ page }) => {
      // TODO
      // empty aria-description
      await page.evaluate(async (msgs: any) => { window?.IdsGlobal?.locale?.loadedLanguages.set('de', msgs); }, deMessages);

      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLanguage('de');
      });
      await expect(multiselectElem).toHaveAttribute('aria-description', 'Drücken Sie zum Auswählen die Nach-unten-Taste');
    });

    test('opens on arrow dow', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => {
        const keydownArrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        elem.dispatchEvent(keydownArrowDown);
      });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
    });

    test('ignores arrow down on open', async ({ page }) => {
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await multiselectElem.evaluate((elem: IdsMultiselect) => {
        const keydownArrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        elem.dispatchEvent(keydownArrowDown);
      });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
    });

    test('opens on arrow up', async ({ page }) => {
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await multiselectElem.evaluate((elem: IdsMultiselect) => {
        const keydownArrowUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        elem.dispatchEvent(keydownArrowUp);
      });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
    });

    test('opens on enter', async ({ page }) => {
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await multiselectElem.evaluate((elem: IdsMultiselect) => {
        const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
        elem.dispatchEvent(keydownEnter);
      });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(true);
    });

    test('selects on space/enter when open', async ({ page }) => {
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = []; });

      await multiselectElem.evaluate((elem: IdsMultiselect) => {
        const keydownArrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        elem.dispatchEvent(keydownArrowDown);
        elem.dispatchEvent(keydownArrowDown);
        elem.dispatchEvent(keydownArrowDown);
        elem.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.close(); });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toEqual(['az']);
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.popup!.visible)).toEqual(false);
    });

    test('can set/unset tags attribute', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.tags = true; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.tags)).toBeTruthy();
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.tags = false; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.tags)).toBeFalsy();
    });

    test('can set/unset max attribute', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.max = 5; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.max)).toEqual(5);
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.max = null; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.max)).toBeNaN();
    });

    test('tags work correctly', async ({ page }) => {
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.tags = true; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['az']; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem?.input?.querySelectorAll('ids-tag').length)).toEqual(1);
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem?.input?.querySelector('ids-icon')?.dispatchEvent(new MouseEvent('click')); });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = []; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['ca']; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = true; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['ca', 'nj']; });
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => [...elem!.input!.querySelectorAll('ids-tag')].every((item) => item.hasAttribute('disabled')))).toBeTruthy();
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.disabled = false; });
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = []; });
      await multiselectElem.evaluate(async (elem: IdsMultiselect) => { await elem.open(); });
      await multiselectElem.locator('ids-list-box-option').first().click();
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toEqual(['al']);
    });

    test('can handle overflowed text', async ({ page }) => {
      expect(await multiselectElem.evaluate((elem: IdsMultiselect) => elem.value)).toEqual(['ca', 'nj']);
      const text = await multiselectElem.locator('ids-text').first();
      await expect(text).toContainText('California, New Jersey');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['co']; });
      await expect(text).toContainText('Colorado');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = ['']; });
      await expect(text).toContainText('Colorado');
      await multiselectElem.evaluate((elem: IdsMultiselect) => { elem.value = []; });
      await expect(text).toContainText('');
    });
  });
});
