import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

const countries = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'Andorra', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Anguilla', value: 'AI' },
  { label: 'Antarctica', value: 'AQ' },
  { label: 'Antigua and Barbuda', value: 'AG' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Aruba', value: 'AW' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahamas', value: 'BS' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Barbados', value: 'BB' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Belize', value: 'BZ' },
  { label: 'Benin', value: 'BJ' },
  { label: 'Bermuda', value: 'BM' },
  { label: 'Bhutan', value: 'BT' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Botswana', value: 'BW' },
  { label: 'Bouvet Island', value: 'BV' },
  { label: 'Brazil', value: 'BR' },
  { label: 'British Indian Ocean Territory', value: 'IO' },
  { label: 'Brunei', value: 'BN' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Burkina Faso', value: 'BF' },
  { label: 'Burundi', value: 'BI' }];

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
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-dropdown')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('dropdown-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-dropdown')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('dropdown-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-dropdown-light');
    });

    test('should match the visual snapshot in percy (in a modal)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-dropdown/in-modal.html');
      await page.locator('#modal-trigger-btn').click();
      await page.locator('ids-dropdown').nth(2).click();
      await percySnapshot(page, 'ids-dropdown-modal-light');
    });

    test('should match the visual snapshot in percy (in a popup)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-dropdown/in-popup.html');
      await page.locator('#popup-trigger-btn').click();
      await page.locator('ids-dropdown').nth(1).click();
      await page.waitForSelector('ids-popup[visible]');
      await percySnapshot(page, 'ids-dropdown-popup-light');
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
    const isDropdownShown = async (dropdown: Locator) => {
      const result = await dropdown.evaluate((node: IdsDropdown) => node.popup!.visible);
      return result;
    };

    test('renders with empty container', async ({ page }) => {
      const exists = await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', `<ids-dropdown id="dropdown-test-1" label="Normal Dropdown"></ids-dropdown>`);
        const dropdown = document.querySelector<IdsDropdown>('#dropdown-test-1')!;
        return dropdown?.container !== undefined;
      });
      await expect(exists).toBe(true);
    });

    test('can set the placeholder attribute', async ({ page }) => {
      const value = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.placeholder = 'select an item';
        return dropdown.input!.placeholder;
      });
      expect(value).toBe('select an item');

      const value2 = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.placeholder = '';
        return dropdown.input!.placeholder;
      });
      expect(value2).toBe(null);
    });

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

    test('can have blank value=""', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown#dropdown-9')!;
        return [dropdown?.allowBlank, dropdown.value];
      });

      const [allowBlank, value] = values;
      expect(allowBlank).toBeFalsy();
      expect(value).toEqual(null);

      const newValue = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown#dropdown-9')!;
        dropdown.options[2].click();
        return dropdown.value;
      });

      expect(newValue).toBe('opt2');

      const blankValue = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown#dropdown-9')!;
        dropdown.options[0].click();
        return dropdown.value;
      });

      expect(blankValue).toEqual('');
    });

    test('can view tooltips on dropdown and options', async ({ page }) => {
      const dropdownLocator: Locator = await page.locator('#dropdown-6');

      // Check tooltip for dropdown
      await dropdownLocator.hover();
      await expect(await page.locator('ids-tooltip')).toBeAttached();
      await dropdownLocator.blur();

      // Check tooltip for dropdown option
      await dropdownLocator.locator('ids-trigger-button').click();
      const dropdownFirstOptionLocator: Locator = await page.locator('#dropdown-6 ids-list-box ids-list-box-option').first();
      await dropdownFirstOptionLocator.hover();
      await expect(await page.locator('ids-tooltip')).toBeAttached();
      await dropdownFirstOptionLocator.blur();

      // Check tooltip for lazy loaded dropdown option
      await page.evaluate(() => {
        const asyncTooltipDropdown = document.createElement('ids-dropdown');
        asyncTooltipDropdown.id = 'dropdown-async-tooltips';
        asyncTooltipDropdown.innerHTML = '<ids-list-box></ids-list-box>';
        (asyncTooltipDropdown as IdsDropdown).beforeShow = async function beforeShow() {
          return new Promise((resolve) => {
            resolve([
              {
                value: 'opt1',
                label: 'Option One',
                tooltip: 'Additional Info on Option One'
              }
            ]);
          });
        };

        const lastDropdown = document.querySelector('ids-dropdown:last-of-type');
        lastDropdown?.after(asyncTooltipDropdown);
      });

      const asyncDropdownLocator: Locator = await page.locator('#dropdown-async-tooltips');
      await asyncDropdownLocator.locator('ids-trigger-button').click();
      const asyncDropdownFirstOptionLocator: Locator = await page.locator('#dropdown-async-tooltips ids-list-box ids-list-box-option').first();
      await asyncDropdownFirstOptionLocator.hover();
      await expect(await page.locator('ids-tooltip')).toBeAttached();
    });

    test('can set/get validation', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.validate)).toBeNull();
      await expect(dropdown).not.toHaveAttribute('validate', 'required');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.validate = 'required';
        return element.validate;
      })).toEqual('required');
      await expect(dropdown).toHaveAttribute('validate', 'required');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.validate = null;
        return element.validate;
      })).toBeNull();
      await expect(dropdown).not.toHaveAttribute('validate', 'required');
    });

    test('can set/get validationEvents', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-4');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.validationEvents)).toEqual('change');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.validationEvents = 'blur change';
        return element.validationEvents;
      })).toEqual('blur change');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.validationEvents = (null) as any;
        return element.validationEvents;
      })).toEqual('change');
    });

    test('can render with icons', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const html = '<ids-list-box-option value="opt7" id="new-opt" role="option" tabindex="-1" row-index="6">'
          + '<ids-icon icon="circle-filled"></ids-icon>'
          + '<span>Option Seven</span>'
          + '</ids-list-box-option>';
        document.querySelector('#ids-list-box-dropdown-5')!.insertAdjacentHTML('beforeend', html);
      });
      await expect(page.locator('#new-opt')).toBeAttached();
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can support dirty indicator', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.dirtyTracker)).toBeTruthy();
      await expect(dropdown).toHaveAttribute('dirty-tracker');
      await expect(dropdown.locator('.icon-dirty')).not.toBeAttached();

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.value = 'hi';
        return element.isDirty;
      })).toBeTruthy();
      await expect(dropdown.locator('.icon-dirty')).toBeAttached();

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.resetDirtyTracker();
        return element.isDirty;
      })).toBeFalsy();
      await expect(dropdown.locator('.icon-dirty')).not.toBeAttached();

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.dirtyTracker = false;
        return element.dirtyTracker;
      })).toBeFalsy();
      await expect(dropdown).not.toHaveAttribute('dirty-tracker');
    });

    test('can set/get value', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.value)).toEqual('ca');
      await expect(dropdown).toHaveAttribute('value', 'ca');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.value = 'il';
        return element.value;
      })).toEqual('il');
      await expect(dropdown).toHaveAttribute('value', 'il');

      // invalid value
      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.value = 'invalid';
        return element.value;
      })).toEqual('invalid');
    });

    test('can set/get value with selectedIndex', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await dropdown.evaluate((element: IdsDropdown) => {
        const result = { value: element.value, selectedIndex: element.selectedIndex };
        return result;
      })).toEqual({ value: 'ca', selectedIndex: 0 });
      await expect(dropdown).toHaveAttribute('value', 'ca');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.selectedIndex = 3;
        const result = { value: element.value, selectedIndex: element.selectedIndex };
        return result;
      })).toEqual({ value: 'il', selectedIndex: 3 });
      await expect(dropdown).toHaveAttribute('value', 'il');
    });

    test('can open list with open function', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const dropdownList = await dropdown.locator('#dropdownList-dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');

      await dropdown.evaluate(async (element: IdsDropdown) => { await element.open(); });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
      await expect(dropdownList).toHaveAttribute('aria-expanded');
    });

    test('can prevent opening using open function if ready-only or disabled', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      await expect(dropdown).not.toHaveAttribute('readonly');
      await expect(dropdown).not.toHaveAttribute('disabled');
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      await dropdown.evaluate(async (element: IdsDropdown) => {
        element.readonly = true;
        await element.open();
      });
      await expect(dropdown).toHaveAttribute('readonly');
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      await dropdown.evaluate(async (element: IdsDropdown) => {
        element.disabled = true;
        await element.open();
      });
      await expect(dropdown).toHaveAttribute('disabled');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can open list with toggle function', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const dropdownList = await dropdown.locator('#dropdownList-dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');

      await dropdown.evaluate((element: IdsDropdown) => { element.toggle(); });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
      await expect(dropdownList).toHaveAttribute('aria-expanded');
    });

    test('can prevent opening using toggle function if ready-only or disabled', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      await expect(dropdown).not.toHaveAttribute('readonly');
      await expect(dropdown).not.toHaveAttribute('disabled');
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      await dropdown.evaluate((element: IdsDropdown) => {
        element.readonly = true;
        element.toggle();
      });
      await expect(dropdown).toHaveAttribute('readonly');
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      await dropdown.evaluate((element: IdsDropdown) => {
        element.disabled = true;
        element.toggle();
      });
      await expect(dropdown).toHaveAttribute('disabled');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can close list with close function', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const dropdownList = await dropdown.locator('#dropdownList-dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');

      await dropdown.evaluate(async (element: IdsDropdown) => { await element.open(); });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
      await expect(dropdownList).toHaveAttribute('aria-expanded');

      await dropdown.evaluate((element: IdsDropdown) => { element.close(); });
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');
    });

    test('can close list with toggle function', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const dropdownList = await dropdown.locator('#dropdownList-dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');

      await dropdown.evaluate((element: IdsDropdown) => { element.toggle(); });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
      await expect(dropdownList).toHaveAttribute('aria-expanded');

      await dropdown.evaluate((element: IdsDropdown) => { element.toggle(); });
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');
    });

    test('can close list when clicked outside', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const dropdownList = await dropdown.locator('#dropdownList-dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');

      await dropdown.evaluate(async (element: IdsDropdown) => { await element.open(); });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
      await expect(dropdownList).toHaveAttribute('aria-expanded');

      await page.mouse.click(200, 200, { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(dropdownList).not.toHaveAttribute('aria-expanded');
    });

    test('can support beforeShow', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await dropdown.evaluate((element: IdsDropdown) => element.beforeShow)).toBeFalsy();
      const results = (await dropdown.evaluate(async (element: IdsDropdown, args) => {
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(args);
          }, 1);
        });
        element.beforeShow = async function beforeShow() {
          return getContents();
        };
        await element.open();
        element.close();
        element.selectedIndex = 0;
        return element.optionValues;
      }, countries)).map((item) => ({ value: item }));
      results.forEach((item) => {
        expect(countries.find((val) => item.value === val.value)).toBeTruthy();
      });
    });

    test('can set/get blank option', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const blank = await dropdown.locator('ids-list-box-option[value="blank"]');

      await expect(dropdown).not.toHaveAttribute('allow-blank');
      await expect(blank).not.toBeAttached();

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.allowBlank = true;
        return element.allowBlank;
      })).toBeTruthy();
      await expect(dropdown).toHaveAttribute('allow-blank');
      await expect(blank).toBeAttached();

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.allowBlank = false;
        return element.allowBlank;
      })).toBeFalsy();
      await expect(dropdown).not.toHaveAttribute('allow-blank');
      await expect(blank).not.toBeAttached();
    });

    test('can set/get clearableText', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const blank = await dropdown.locator('ids-list-box-option[value="blank"]');

      await expect(dropdown).not.toHaveAttribute('clearable-text');
      await expect(blank).not.toBeAttached();

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.allowBlank = true;
        element.clearableText = '(Custom Clear Text)';
        return element.clearableText;
      })).toEqual('(Custom Clear Text)');

      await expect(dropdown).toHaveAttribute('clearable-text');
      await expect(blank).toBeAttached();
    });

    test('can open menu by clicking the trigger', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const trigger = await dropdown.locator('ids-trigger-button');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await trigger.click();
      expect(await isDropdownShown(dropdown)).toBeTruthy();
    });

    test('can open menu by clicking the input', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const input = await dropdown.locator('input');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await input.click();
      expect(await isDropdownShown(dropdown)).toBeTruthy();
    });

    test('can not be open by clicking the label', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const label = await dropdown.locator('ids-trigger-field label').first();
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await label.click();
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can not be open by clicking outside of the dropdown box', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const container = await dropdown.locator('div[class="field-container"][part="field-container"]');
      const box = await container.boundingBox();
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await expect(container).toBeAttached();

      // click at the outside top
      //             ⌄
      // |‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|
      await page.mouse.click(box!.x + (box!.width / 2), box!.y - 50, { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      // click at the outside left
      //   |‾‾‾‾‾‾‾‾‾
      // > |
      //   |_________
      await page.mouse.click(box!.x - 50, box!.y + (box!.height / 2), { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      // click at the outside right
      // ‾‾‾‾‾‾‾‾‾|
      //          | <
      // _________|
      await page.mouse.click(box!.x + box!.width + 50, box!.y + (box!.height / 2), { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeFalsy();

      // click at the outside bottom
      // |______________________|
      //              ^
      await page.mouse.click(box!.x + (box!.width / 2), box!.y + box!.height + 25, { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can select option via clicking', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const trigger = await dropdown.locator('ids-trigger-button');
      const ilOpt = await dropdown.locator('#il');

      expect(await dropdown.evaluate((element: IdsDropdown) => element.value)).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await trigger.click({ delay: 50 });
      await ilOpt.click({ delay: 50 });
      expect(await dropdown.evaluate((element: IdsDropdown) => element.value)).toEqual('il');
    });

    test('can select option via clicking the icon', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-5');
      const trigger = await dropdown.locator('ids-trigger-button');
      const optIcon = await dropdown.locator('#opt3-d5 ids-icon'); // get the icon element

      expect(await dropdown.evaluate((element: IdsDropdown) => element.value)).toEqual('opt2');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await trigger.click({ delay: 50 });
      await optIcon.click({ delay: 50 });
      expect(await dropdown.evaluate((element: IdsDropdown) => element.value)).toEqual('opt3');
    });

    test('can change language from the container', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      await expect(dropdown).not.toHaveAttribute('language');
      await page.evaluate(async (arg) => {
        const locale = ((window as any).IdsGlobal as any).locale;
        locale.loadedLanguages.set('de', arg.deMessages);
        await locale.setLanguage('de');
      }, { deMessages });
      await expect(dropdown).toHaveAttribute('language', 'de');
    });

    test('can open on arrow down', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await dropdown.evaluate((node) => node.focus());
      await dropdown.press('ArrowDown', { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
    });

    test('can open on arrow up', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
      await dropdown.evaluate((node) => node.focus());
      await dropdown.press('ArrowUp', { delay: 50 });
      expect(await isDropdownShown(dropdown)).toBeTruthy();
    });

    test('can select options with arrow keys', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      expect(await dropdown.evaluate(async (element: IdsDropdown) => {
        await element.open();
        return element.value;
      })).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeTruthy();

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#ca')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#hi')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#hi')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#id')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');
    });

    test('can close with escape key without value change', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      expect(await dropdown.evaluate(async (element: IdsDropdown) => {
        await element.open();
        return element.value;
      })).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeTruthy();

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#ca')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#hi')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#hi')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#id')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // press escape
      await dropdown.press('Escape', { delay: 50 });
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can not arrow up to the bottom list', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      expect(await dropdown.evaluate(async (element: IdsDropdown) => {
        await element.open();
        return element.value;
      })).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeTruthy();

      // change selection, but value retains
      await dropdown.press('ArrowUp', { delay: 50 });
      await expect(dropdown.locator('#ca')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // change selection, but value retains
      await dropdown.press('ArrowUp', { delay: 50 });
      await expect(dropdown.locator('#ca')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // change selection, but value retains
      await dropdown.press('ArrowUp', { delay: 50 });
      await expect(dropdown.locator('#ca')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');
    });

    test('can not arrow down to the top list', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      expect(await dropdown.evaluate(async (element: IdsDropdown) => {
        element.value = 'wy';
        await element.open();
        return element.value;
      })).toEqual('wy');
      expect(await isDropdownShown(dropdown)).toBeTruthy();

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#wy')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('wy');

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#wy')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('wy');

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#wy')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('wy');
    });

    test('can change option with enter key', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      expect(await dropdown.evaluate(async (element: IdsDropdown) => {
        await element.open();
        return element.value;
      })).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeTruthy();

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#ca')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#hi')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // press Enter
      await dropdown.press('Enter', { delay: 50 });
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('hi');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can change option with tab key', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      expect(await isDropdownShown(dropdown)).toBeFalsy();
      expect(await dropdown.evaluate(async (element: IdsDropdown) => {
        await element.open();
        return element.value;
      })).toEqual('ca');
      expect(await isDropdownShown(dropdown)).toBeTruthy();

      // change selection, but value retains
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('#ca')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#hi')).toHaveClass(/is-selected/);
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('ca');

      // press Enter
      await dropdown.press('Tab', { delay: 50 });
      expect(await dropdown.evaluate(async (element: IdsDropdown) => element.value)).toEqual('hi');
      expect(await isDropdownShown(dropdown)).toBeFalsy();
    });

    test('can tab to dropdown', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');

      await expect(dropdown).not.toBeFocused();

      // very dependent on tab sequence
      await page.keyboard.press('Tab', { delay: 50 });
      await page.keyboard.press('Tab', { delay: 50 });
      await page.keyboard.press('Tab', { delay: 50 });

      await expect(dropdown).toBeFocused();
    });

    test('can set/get field height', async ({ page }) => {
      const testData = [
        { data: 'xs', expected: 'xs' },
        { data: 'sm', expected: 'sm' },
        { data: 'md', expected: 'md' },
        { data: 'lg', expected: 'lg' }
      ];
      const dropdown = await page.locator('#dropdown-1');
      const container = await dropdown.locator('div[part="container"]').first();
      for (const data of testData) {
        expect(await dropdown.evaluate((element: IdsDropdown, tData: any) => {
          element.fieldHeight = tData;
          return element.fieldHeight;
        }, data.data)).toEqual(data.expected);
        await expect(dropdown).toHaveAttribute('field-height', data.expected);
        await expect(container).toHaveClass(new RegExp(`field-height-${data.expected}`, 'i'));
      }
    });

    test('can set/get compact', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.compact)).toBeFalsy();
      await expect(dropdown).not.toHaveAttribute('compact');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.compact = true;
        return element.compact;
      })).toBeTruthy();
      await expect(dropdown).toHaveAttribute('compact');
    });

    test('can set/get size', async ({ page }) => {
      const testData = [
        { data: 'xs', expected: 'xs' },
        { data: 'sm', expected: 'sm' },
        { data: 'mm', expected: 'mm' },
        { data: 'md', expected: 'md' },
        { data: 'lg', expected: 'lg' },
        { data: 'full', expected: 'full' }
      ];
      const dropdown = await page.locator('#dropdown-1');
      const input = await dropdown.locator('input');
      const listBox = await dropdown.locator('ids-list-box');
      for (const data of testData) {
        expect(await dropdown.evaluate((element: IdsDropdown, tData: any) => {
          element.size = tData;
          return element.size;
        }, data.data)).toEqual(data.expected);
        await expect(dropdown).toHaveAttribute('size', data.expected);
        await expect(input).toHaveAttribute('size', data.expected);
        await expect(listBox).toHaveAttribute('size', data.expected);
      }
    });

    test('can set no margins', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const input = await dropdown.locator('input');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.noMargins)).toBeFalsy();
      await expect(dropdown).not.toHaveAttribute('no-margins');
      await expect(input).not.toHaveAttribute('no-margins');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.noMargins = true;
        return element.noMargins;
      })).toBeTruthy();
      await expect(dropdown).toHaveAttribute('no-margins');
      await expect(input).toHaveAttribute('no-margins');

      expect(await dropdown.evaluate((element: IdsDropdown) => {
        element.noMargins = false;
        return element.noMargins;
      })).toBeFalsy();
      await expect(dropdown).not.toHaveAttribute('no-margins');
      await expect(input).not.toHaveAttribute('no-margins');
    });

    test('can group options', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const grouped = deepClone(countries);
      const group1Index = 0;
      grouped.splice(group1Index, 0, { label: 'A', id: 'grpA', groupLabel: true });
      const group2Index = grouped.findIndex((value: any) => value.label.startsWith('B'));
      grouped.splice(group2Index, 0, { label: 'B', id: 'grpB', groupLabel: true });
      await dropdown.evaluate(async (element: IdsDropdown, args) => {
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(args);
          }, 1);
        });
        element.beforeShow = async function beforeShow() {
          return getContents();
        };
        await element.open();
        element.close();
        element.selectedIndex = 1;
      }, grouped);

      await expect(dropdown.locator('#grpA')).toHaveText('A');
      await expect(dropdown.locator('#grpB')).toHaveText('B');
    });

    test('can prevent selecting group label by clicking', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const grouped = deepClone(countries);
      const group1Index = 0;
      grouped.splice(group1Index, 0, { label: 'A', id: 'grpA', groupLabel: true });
      const group2Index = grouped.findIndex((value: any) => value.label.startsWith('B'));
      grouped.splice(group2Index, 0, { label: 'B', id: 'grpB', groupLabel: true });
      await dropdown.evaluate(async (element: IdsDropdown, args) => {
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(args);
          }, 1);
        });
        element.beforeShow = async function beforeShow() {
          return getContents();
        };
        await element.open();
        element.value = 'AZ';
        await element.open();
      }, grouped);
      await expect(dropdown.locator('ids-list-box-option[value="AZ"]')).toHaveClass(/is-selected/);
      await expect(dropdown.locator('#grpB')).not.toHaveClass(/is-selected/);

      // arrow down, skips the group label
      await dropdown.locator('#grpB').click({ delay: 50 });
      await dropdown.locator('#grpB').click({ delay: 50 });
      await dropdown.locator('#grpB').click({ delay: 50 });
      await expect(dropdown.locator('ids-list-box-option[value="AZ"]')).toHaveClass(/is-selected/);
      await expect(dropdown.locator('#grpB')).not.toHaveClass(/is-selected/);
    });

    test('can prevent selecting group label by keyboard', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      const grouped = deepClone(countries);
      const group1Index = 0;
      grouped.splice(group1Index, 0, { label: 'A', id: 'grpA', groupLabel: true });
      const group2Index = grouped.findIndex((value: any) => value.label.startsWith('B'));
      grouped.splice(group2Index, 0, { label: 'B', id: 'grpB', groupLabel: true });
      await dropdown.evaluate(async (element: IdsDropdown, args) => {
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(args);
          }, 1);
        });
        element.beforeShow = async function beforeShow() {
          return getContents();
        };
        await element.open();
        element.value = 'AZ';
        await element.open();
      }, grouped);
      await expect(dropdown.locator('ids-list-box-option[value="AZ"]')).toHaveClass(/is-selected/);
      await expect(dropdown.locator('#grpB')).not.toHaveClass(/is-selected/);

      // arrow down, skips the group label
      await dropdown.press('ArrowDown', { delay: 50 });
      await expect(dropdown.locator('ids-list-box-option[value="AZ"]')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#grpB')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('ids-list-box-option[value="BS"]')).toHaveClass(/is-selected/);

      // arrow up, skips the group label
      await dropdown.press('ArrowUp', { delay: 50 });
      await expect(dropdown.locator('ids-list-box-option[value="BS"]')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('#grpB')).not.toHaveClass(/is-selected/);
      await expect(dropdown.locator('ids-list-box-option[value="AZ"]')).toHaveClass(/is-selected/);
    });

    test('should set typeahead by default', async ({ page }) => {
      const dropdown = await page.locator('#dropdown-1');
      expect(await dropdown.evaluate((element: IdsDropdown) => element.typeahead)).toBeTruthy();
      expect(await dropdown.evaluate((element: IdsDropdown) => element.container?.classList.contains('typeahead'))).toBeTruthy();
      await dropdown.locator('ids-trigger-button').click();
      await expect(dropdown.locator('ids-trigger-field')).not.toHaveAttribute('readonly');
    });

    test('should unset typeahead', async ({ page }) => {
      await page.goto('/ids-dropdown/typeahead.html');
      const dropdown = await page.locator('ids-dropdown').first();
      await dropdown.evaluate((element: IdsDropdown) => { element.typeahead = false; });
      expect(await dropdown.evaluate((element: IdsDropdown) => element.typeahead)).toBeFalsy();
      expect(await dropdown.evaluate((element: IdsDropdown) => element.container?.classList.contains('typeahead'))).toBeFalsy();
      await expect(dropdown.locator('ids-trigger-field')).toHaveAttribute('readonly');
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
