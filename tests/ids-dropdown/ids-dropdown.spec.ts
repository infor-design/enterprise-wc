import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';
import IdsIcon from '../../src/components/ids-icon/ids-icon';
import states from '../../src/assets/data/states.json';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';

const wait = (ms: number = 1000) => new Promise((r) => {
  setTimeout(r, ms);
});

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
        dropdown.value = 'opt1';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire an input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-dropdown') as IdsDropdown;
        dropdown?.addEventListener('input', () => { changeCount++; });
        dropdown.value = 'opt1';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });

  test.describe('functionality tests', () => {
    test('renders with validation', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results = [
          dropdown.validate,
          dropdown.validationEvents,
        ];

        dropdown.validate = 'required';
        dropdown.validationEvents = 'blur change';
        results.push(dropdown.validate);
        results.push(dropdown.validationEvents);

        return results;
      });
      expect(values[0]).toEqual(null);
      expect(values[1]).toEqual('change');
      expect(values[2]).toEqual('required');
      expect(values[3]).toEqual('blur change');
    });

    test('supports validation', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        dropdown.validate = 'required';
        dropdown.validationEvents = 'blur change';
        dropdown.triggerEvent('change', dropdown);

        return [
          dropdown?.shadowRoot?.querySelector('ids-trigger-field'),
          dropdown.getAttribute('validate')
        ];
      });
      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual('required');
    });

    test('can reset validation and validation-events', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;

        dropdown.validate = 'required';
        dropdown.validationEvents = 'blur change';
        dropdown.validate = null;
        dropdown.validationEvents = null;

        return [
          dropdown.getAttribute('validate'),
          dropdown.getAttribute('validation-events')
        ];
      });
      expect(values[0]).toBeFalsy();
      expect(values[1]).toBeFalsy();
    });

    test('renders with icons', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('#dropdown-5')!;
        const icons = dropdown.querySelectorAll<IdsIcon>('ids-list-box-option ids-icon');
        return Array.from(icons).map((icon) => icon?.icon);
      });
      expect(values[0]).toEqual('user-profile');
      expect(values[5]).toEqual('roles');
    });

    test('renders with tooltips', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('#dropdown-6')!;
        return [
          dropdown.getAttribute('tooltip'),
          dropdown.tooltip,
        ];
      });
      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual('Additional Info on Option Two');
    });

    test('handles setting disabled', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.disabled = true;
        return [
          dropdown.getAttribute('disabled'),
          dropdown.getAttribute('readonly'),
          dropdown.disabled,
          dropdown?.input?.disabled
        ];
      });
      expect(values[0]).toEqual('true');
      expect(values[1]).toBeFalsy();
      expect(values[2]).toEqual(true);
      expect(values[3]).toEqual(true);
    });

    test('handles setting readonly', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.readonly = true;
        return [
          dropdown.getAttribute('readonly'),
          dropdown.readonly,
          dropdown?.input?.disabled
        ];
      });
      expect(values[0]).toEqual('true');
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
    });

    test('can change the label', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.label = 'Changed Label';
        return [
          dropdown.label
        ];
      });
      expect(values[0]).toEqual('Changed Label');
    });

    test('should show dirty indicator on change', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results = [
          dropdown.dirty
        ];

        dropdown.dirtyTracker = true;
        dropdown.value = 'opt3';
        results.push(dropdown.dirty);
        results.push(dropdown?.input?.shadowRoot?.querySelector('.icon-dirty'));

        return results;
      });
      expect(values[0]).toEqual({ original: 'Option Two' });
      expect(values[1]).toBeTruthy();
    });

    test('should be able to reset dirty indicator', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.dirtyTracker = true;
        const results = [
          dropdown.getAttribute('dirty-tracker')
        ];

        dropdown.dirtyTracker = false;
        results.push(dropdown.getAttribute('dirty-tracker'));

        return results;
      });
      expect(values[0]).toEqual('true');
      expect(values[1]).toBeFalsy();
    });

    test('should be able to set value', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.value = 'opt3';
        return [
          dropdown.value,
          dropdown.input?.value
        ];
      });
      expect(values[0]).toEqual('opt3');
      expect(values[1]).toEqual('Option Three');
    });

    test('should be able to set value with selectedIndex', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        const results: any = [
          dropdown.selectedIndex,
        ];

        dropdown.selectedIndex = 2;
        results.push(dropdown.selectedIndex);
        results.push(dropdown.value);
        results.push(dropdown.input?.value);

        dropdown.selectedIndex = 'x'; // ignored
        results.push(dropdown.selectedIndex);
        results.push(dropdown.value);
        results.push(dropdown.input?.value);

        return results;
      });

      expect(values[0]).toEqual(1);
      expect(values[1]).toEqual(2);
      expect(values[2]).toEqual('opt3');
      expect(values[3]).toEqual('Option Three');
      expect(values[4]).toEqual(2);
      expect(values[5]).toEqual('opt3');
      expect(values[6]).toEqual('Option Three');
    });

    test('should ignore null / bad selectedIndex', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        const results: any = [
          dropdown.selectedIndex,
        ];

        dropdown.selectedIndex = 'x'; // ignored
        results.push(dropdown.selectedIndex);
        results.push(dropdown.value);
        results.push(dropdown.input?.value);

        return results;
      });

      expect(values[0]).toEqual(1);
      expect(values[1]).toEqual(1);
      expect(values[2]).toEqual('opt2');
      expect(values[3]).toEqual('Option Two');
    });

    test('should ignore null / bad value', async ({ page }) => {
      const values = await page.evaluate(() => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        dropdown.value = 'opt3';
        const results: any = [
          dropdown.value,
          dropdown.input?.value
        ];

        dropdown.value = null;
        results.push(dropdown.input?.value);

        dropdown.value = 'optx';
        results.push(dropdown.input?.value);

        return results;
      });

      expect(values[0]).toEqual('opt3');
      expect(values[1]).toEqual('Option Three');
      expect(values[2]).toEqual('Option Three');
      expect(values[3]).toEqual('Option Three');
    });

    test('supports opening the list with open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results: any = [
          dropdown.popup?.visible,
        ];

        await dropdown.open();
        results.push(dropdown?.popup?.visible);

        dropdown.close();
        results.push(dropdown?.popup?.visible);

        dropdown.readonly = true;
        await dropdown.open();
        results.push(dropdown?.popup?.visible);

        dropdown.disabled = true;
        await dropdown.open();
        results.push(dropdown?.popup?.visible);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
      expect(values[3]).toEqual(false);
      expect(values[4]).toEqual(false);
    });

    test('supports opening the list with toggle', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results: any = [
          dropdown.popup?.visible,
        ];

        dropdown.toggle();
        results.push(dropdown?.popup?.visible);

        dropdown.toggle();
        results.push(dropdown?.popup?.visible);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
    });

    test('supports closing the list with closing', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results: any = [
          dropdown.popup?.visible,
        ];

        await dropdown?.open();
        results.push(dropdown?.popup?.visible);

        dropdown.close();
        results.push(dropdown?.popup?.visible);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
    });

    test('can click outside an open list to close it', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const clickEvent = new MouseEvent('click', { bubbles: true });

        // @see https://github.com/microsoft/playwright/issues/19536
        // dropdown?.dropdownList?.onOutsideClick = jest.fn();
        await dropdown.open();
        document.body.dispatchEvent(clickEvent);
        const results : any = [
          dropdown?.dropdownList?.onOutsideClick,
        ];

        dropdown?.dropdownList?.onOutsideClick(clickEvent);
        results.push(dropdown.popup?.visible);

        return results;
      });
      // @see https://github.com/microsoft/playwright/issues/19536
      // expect(values[0]).toHaveBeenCalled();
      expect(values[1]).toBeFalsy();
    });

    test('supports async beforeShow', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(states);
          }, 1);
        });

        const results : any = [
          dropdown.querySelectorAll('ids-list-box-option').length,
          dropdown.beforeShow,
        ];

        dropdown.beforeShow = async function beforeShow() {
          return getContents();
        };
        results.push(dropdown.beforeShow);

        await dropdown.open();
        results.push(dropdown.querySelectorAll('ids-list-box-option').length);

        return results;
      });

      expect(values[0]).toEqual(6);
      expect(values[1]).toBeFalsy();
      expect(values[2]).toBeTruthy();
      expect(values[3]).toEqual(59);
    });

    test.skip('supports type ahead to filter and select an option', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;

        const results : any = [
          dropdown.typeahead,
        ];

        dropdown.typeahead = true;
        results.push(dropdown.typeahead);

        await dropdown.open();
        results.push(dropdown.value);

        dropdown.input.value = 'v';
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }));

        // await wait(600);
        results.push(dropdown.querySelectorAll('ids-list-box-option').length);
        results.push(dropdown.querySelector('ids-list-box-option')?.getAttribute('value'));

        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        results.push(dropdown.value);
        results.push(dropdown.querySelectorAll('ids-list-box-option').length);

        dropdown.typeahead = false;
        results.push(dropdown.typeahead);

        return results;
      });

      expect(values[0]).toBeFalsy();
      expect(values[1]).toBeTruthy();
      expect(values[2]).toBeTruthy();
      expect(values[3]).toEqual('opt2');
      expect(values[4]).toEqual(1);
      expect(values[5]).toEqual('opt5');
      expect(values[6]).toEqual(6);
      expect(values[7]).toBeFalsy();
    });

    test('supports type ahead to show No Results option when nothing found', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        dropdown.typeahead = true;

        const results : any = [
          dropdown.typeahead,
        ];

        await dropdown.open();
        dropdown.input.value = 'y';
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'y' }));

        // await wait(600);
        results.push(dropdown.querySelectorAll('ids-list-box-option').length);
        results.push(dropdown.querySelector('ids-list-box-option')?.textContent);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual(1);
      expect(values[2]).toEqual('No results');
    });

    test('ignores type ahead when readonly', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        dropdown.readonly = true;
        // Turn on typeahead
        dropdown.typeahead = true;

        const results : any = [
          dropdown.typeahead,
        ];

        await dropdown.open();
        dropdown.input.value = 'y';
        dropdown.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'y' }));

        // await wait(600);
        results.push(dropdown.querySelectorAll('ids-list-box-option').length);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual(6);
    });

    test('supports type ahead when the dropdown is closed', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        dropdown.typeahead = true;
        // Typing v letter when closed (only Option Five to match)
        dropdown.input.value = 'v';
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }));

        // Keydownend delay
        // await wait(600);
        const results : any = [
          dropdown.querySelectorAll('ids-list-box-option').length,
          dropdown.querySelector('ids-list-box-option')?.getAttribute('value'),
          dropdown.popup.visible
        ];

        document.body.dispatchEvent(new MouseEvent('click'));
        results.push(dropdown.popup.visible);

        return results;
      }, { page });

      expect(values[0]).toEqual(1);
      expect(values[1]).toEqual('opt5');
      expect(values[2]).toBeTruthy();
      expect(values[3]).toBeFalsy();
    });

    test('should accept Space key and stay opened when typing with typeahead', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.typeahead = true;
        await dropdown.open();
        // Typing v letter when closed (only Option Five to match)
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        // Keydownend delay
        // await wait(600);
        return [
          dropdown.popup?.visible
        ];
      });

      expect(values[0]).toBeTruthy();
    });

    test.skip('should clear value if clearable is set', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.clearable = true;

        const results: any = [
          dropdown.clearable
        ];

        // Backspace on the focused closed dropdown
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        results.push(dropdown.input?.value);
        results.push(dropdown.value);

        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        results.push(dropdown.value);

        // With blank option
        dropdown.allowBlank = true;
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        results.push(dropdown.input?.value);
        results.push(dropdown.value);


        dropdown.clearable = false;
        results.push(dropdown.clearable);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual('');
      expect(values[2]).toEqual('');
      expect(values[3]).toEqual('opt1');
      expect(values[4]).toEqual('');
      expect(values[5]).toEqual('blank');
      expect(values[6]).toBeFalsy();
    });

    test('should handle custom text for blank option', async ({ page }) => {
      const clearText = '(Custom Clear Text)';
      const values = await page.evaluate(async ({ clearableText }) => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        dropdown.allowBlank = true;
        dropdown.clearableText = clearableText;

        const results: any = [
          dropdown.getAttribute('clearable-text'),
          dropdown.querySelector(`ids-list-box-option[value="blank"]`)?.textContent
        ];

        dropdown.clearableText = null;
        results.push(dropdown.getAttribute('clearable-text'));

        return results;
      }, { clearableText: clearText });

      expect(values[0]).toEqual(clearText);
      expect(values[1]).toEqual(clearText);
      expect(values[2]).toBeNull();
    });

    test('supports clicking trigger to open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        const results: any = [
          dropdown.trigger,
        ];

        dropdown.trigger?.click();
        results.push(dropdown.popup?.visible);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual(true);
    });

    test('supports clicking input to open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        // await waitForTimeout(() => expect(dropdown.container).toBeTruthy());
        const results: any = [
          dropdown.container,
        ];

        dropdown.input?.input?.click();
        // await waitForTimeout(() => expect(dropdown.popup.visible).toBeTruthy());
        results.push(dropdown.popup?.visible);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toBeTruthy();
    });

    test('should not open by clicking on label', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        // await waitForTimeout(() => expect(dropdown.labelEl).toBeTruthy());
        const results: any = [
          dropdown.labelEl,
        ];

        dropdown.labelEl?.click();
        // await waitForTimeout(() => expect(dropdown.popup.visible).toBeFalsy());
        results.push(dropdown.popup?.visible);

        dropdown.input?.input?.click();
        // await waitForTimeout(() => expect(dropdown.popup.visible).toBeTruthy());
        results.push(dropdown.popup?.visible);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toBeFalsy();
      expect(values[2]).toBeTruthy();
    });

    test('should not set icon if setting has-icon as false', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results: any = [
          dropdown.value,
        ];

        dropdown.trigger?.click();
        // await wait(80);
        dropdown.hasIcons = false;
        dropdown.container?.insertAdjacentHTML('beforeend', '<ids-icon icon="user-profile" slot="trigger-start"></ids-icon>');
        dropdown.querySelectorAll('ids-list-box-option')[4]?.click();

        // await wait(80);
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual('opt2');
      expect(values[1]).toEqual('opt5');
    });

    test('supports clicking to select', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results: any = [
          dropdown.value,
        ];

        dropdown.trigger?.click();
        // await wait(80);
        dropdown.querySelectorAll('ids-list-box-option')[4]?.click();

        // await wait(80);
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual('opt2');
      expect(values[1]).toEqual('opt5');
    });

    test('supports clicking to select on the icon', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('#dropdown-5')!;
        const results: any = [
          dropdown.value,
        ];

        const icons = dropdown.querySelectorAll<any>('ids-list-box-option ids-icon');
        icons[5]?.click();
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual('opt2');
      expect(values[1]).toEqual('opt6');
    });

    test('can changing language from the container', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const locale = window.IdsGlobal.locale!;
        // locale.loadedLanguages.set('de', _deMessages);
        await locale.setLocale('de-DE');

        return [
          dropdown.getAttribute('aria-description')
        ];
      });

      expect(values[0]).toEqual('Drücken Sie zum Auswählen die Nach-unten-Taste');
    });

    test('opens on arrow down', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        dropdown.dispatchEvent(event);

        return [
          dropdown.popup?.visible
        ];
      });

      expect(values[0]).toEqual(true);
    });

    test('ignores arrow down on open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        await dropdown?.open();

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        dropdown.dispatchEvent(event);

        return [
          dropdown.popup?.visible
        ];
      });

      expect(values[0]).toEqual(true);
    });

    test('opens on arrow up', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        dropdown.dispatchEvent(event);

        return [
          dropdown.popup?.visible
        ];
      });

      expect(values[0]).toEqual(true);
    });

    test('selects on arrow up and alt key', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        await dropdown.open();
        const results: any = [
          dropdown.value
        ];

        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        dropdown.dispatchEvent(event);

        event = new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true });
        dropdown.dispatchEvent(event);

        results.push(dropdown.popup?.visible);
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual('opt2');
      expect(values[1]).toEqual(false);
      expect(values[2]).toEqual('opt3');
    });

    test('closes on escape without changing', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        await dropdown.open();
        const results: any = [
          dropdown.value
        ];


        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        dropdown.dispatchEvent(event);

        event = new KeyboardEvent('keydown', { key: 'Escape' });
        dropdown.dispatchEvent(event);

        results.push(dropdown.popup?.visible);
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual('opt2');
      expect(values[1]).toEqual(false);
      expect(values[2]).toEqual('opt2');
    });

    test.skip('can not arrow up past top', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        await dropdown.open();
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);

        return [
          dropdown.querySelector('ids-list-box-option.is-selected')?.textContent
        ];
      });

      expect(values[0]).toEqual('Option Six');
    });

    test.skip('can not arrow up to the bottom', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        await dropdown.open();
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);
        dropdown.dispatchEvent(event);

        return [
          dropdown.querySelector('ids-list-box-option.is-selected')?.textContent
        ];
      });

      expect(values[0]).toEqual('Option One');
    });

    test.skip('can open on enter or space', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;

        const results: any = [
          dropdown.popup?.visible
        ];

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        dropdown.dispatchEvent(event);
        results.push(dropdown.popup?.visible);

        dropdown.dispatchEvent(event);
        results.push(dropdown.popup?.visible);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
    });

    test.skip('selects on enter when open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        await dropdown.open();
        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        event = new KeyboardEvent('keydown', { key: 'Enter' });
        dropdown.dispatchEvent(event);
        return [
          dropdown.popup?.visible,
          dropdown.value
        ];
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual('opt3');
    });

    test.skip('selects on space when open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        await dropdown.open();
        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        event = new KeyboardEvent('keydown', { key: ' ' });
        dropdown.dispatchEvent(event);
        return [
          dropdown.popup?.visible,
          dropdown.value
        ];
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual('opt3');
    });

    test.skip('selects on tab when open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        await dropdown.open();
        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        event = new KeyboardEvent('keydown', { key: 'Tab' });
        dropdown.dispatchEvent(event);
        const results : any = [
          dropdown.popup?.visible,
          dropdown.value
        ];

        await dropdown.open();
        event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        dropdown.dispatchEvent(event);
        event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        dropdown.dispatchEvent(event);

        results.push(dropdown.popup?.visible);
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual('opt3');

      expect(values[2]).toEqual(false);
      expect(values[3]).toEqual('opt4');
    });

    test('tab works correcty', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.input?.focus();
        const results : any = [
          (document.activeElement as any).id,
        ];

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        dropdown.dispatchEvent(event);
        results.push((document.activeElement as any).id);

        return results;
      });

      expect(values[0]).toEqual('dropdown-0');
      expect(values[1]).toEqual('dropdown-0');
    });

    test('should render field height', async ({ page }) => {
      const heights = ['xs', 'sm', 'md', 'lg'];
      const defaultHeight = 'md';
      const className = (h: any) => `field-height-${h}`;

      const values = await page.evaluate(async ({ heightsArray }) => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        const results: any = [];
        const checkHeight = (height: any) => {
          dropdown.fieldHeight = height;

          results.push(dropdown.input?.getAttribute('field-height'));
          results.push(Array.from(dropdown.container.classList));
        };
        results.push(dropdown.getAttribute('field-height'));
        results.push(Array.from(dropdown.container?.classList));

        heightsArray.forEach((h) => checkHeight(h));

        dropdown.removeAttribute('field-height');
        dropdown.removeAttribute('compact');
        results.push(dropdown.getAttribute('field-height'));

        dropdown.onFieldHeightChange();
        results.push(Array.from(dropdown.container.classList));

        return results;
      }, { heightsArray: heights });

      expect(values[0]).toEqual(null);
      heights.filter((h) => h !== defaultHeight).forEach((h) => {
        expect(values[1]).not.toContain(className(h));
      });
      expect(values[1]).toContain(className(defaultHeight));

      heights.forEach((height, index) => {
        const indexValue = (index * 2) + 2;
        expect(values[indexValue]).toEqual(height);
        expect(values[indexValue + 1]).toContain(className(height));

        heights.filter((h) => h !== height).forEach((h) => {
          expect(values[indexValue + 1]).not.toContain(className(h));
        });
      });

      expect(values[10]).toEqual(null);
      heights.filter((h) => h !== defaultHeight).forEach((h) => {
        expect(values[11]).not.toContain(className(h));
      });
      expect(values[11]).toContain(className(defaultHeight));
    });

    test('should set compact height', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.compact = true;
        const results : any = [
          dropdown.hasAttribute('compact'),
          dropdown.container?.classList.contains('compact')
        ];

        dropdown.compact = false;
        results.push(dropdown.container?.classList.contains('compact'));

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toBeTruthy();
      expect(values[2]).toBeFalsy();
    });

    test('should set size', async ({ page }) => {
      const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
      const defaultSize = 'md';
      const values = await page.evaluate(async ({ sizesArray }) => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;

        const results: any = [];

        const checkSize = (size: any) => {
          dropdown.size = size;

          results.push(dropdown.getAttribute('size'));
          results.push(dropdown.input?.getAttribute('size'));
          results.push(dropdown.dropdownList?.listBox?.getAttribute('size'));
        };

        results.push(dropdown.getAttribute('size'));
        results.push(dropdown.input?.getAttribute('size'));
        sizesArray.forEach((s) => checkSize(s));
        dropdown.size = null;

        results.push(dropdown.getAttribute('size'));
        results.push(dropdown.input?.getAttribute('size'));
        results.push(dropdown.dropdownList?.listBox?.getAttribute('size'));

        return results;
      }, { sizesArray: sizes });

      expect(values[0]).toEqual(null);
      expect(values[1]).toEqual(defaultSize);

      sizes.forEach((s, index) => {
        const indexValue = (index * 3) + 2;
        expect(values[indexValue]).toEqual(s);
        expect(values[indexValue + 1]).toEqual(s);
        expect(values[indexValue + 2]).toEqual(s);
      });

      expect(values[20]).toEqual(null);
      expect(values[21]).toEqual(defaultSize);
      expect(values[22]).toEqual(null);
    });

    test('should set no margins', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        dropdown.compact = true;
        const results : any = [
          dropdown.getAttribute('no-margins'),
          dropdown.noMargins,
          dropdown.input?.getAttribute('no-margins')
        ];

        dropdown.noMargins = true;
        results.push(dropdown.getAttribute('no-margins'));
        results.push(dropdown.noMargins);
        results.push(dropdown.input?.getAttribute('no-margins'));

        dropdown.noMargins = false;
        results.push(dropdown.getAttribute('no-margins'));
        results.push(dropdown.noMargins);
        results.push(dropdown.input?.getAttribute('no-margins'));

        return results;
      });

      expect(values[0]).toEqual(null);
      expect(values[1]).toEqual(false);
      expect(values[2]).toEqual(null);

      expect(values[3]).toEqual('');
      expect(values[4]).toEqual(true);
      expect(values[5]).toEqual('');

      expect(values[6]).toEqual(null);
      expect(values[7]).toEqual(false);
      expect(values[8]).toEqual(null);
    });

    test('should set values thru template', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        const results : any = [
          dropdown.colorVariant,
          dropdown.labelState,
          dropdown.compact,
          dropdown.noMargins,
        ];

        dropdown.colorVariant = 'alternate-formatter';
        dropdown.labelState = 'collapsed';
        dropdown.compact = true;
        dropdown.noMargins = true;
        dropdown.template();
        results.push(dropdown.colorVariant);
        results.push(dropdown.labelState);
        results.push(dropdown.compact);
        results.push(dropdown.getAttribute('field-height'));
        results.push(dropdown.hasAttribute('compact'));
        results.push(dropdown.noMargins);

        dropdown.compact = false;
        dropdown.fieldHeight = 'lg';
        dropdown.template();
        results.push(dropdown.fieldHeight);
        results.push(dropdown.hasAttribute('compact'));
        results.push(dropdown.getAttribute('field-height'));

        return results;
      });

      expect(values[0]).toEqual(null);
      expect(values[1]).toEqual(null);
      expect(values[2]).toEqual(false);
      expect(values[3]).toEqual(false);

      expect(values[4]).toEqual('alternate-formatter');
      expect(values[5]).toEqual('collapsed');
      expect(values[6]).toEqual(true);
      expect(values[7]).toBeNull();
      expect(values[8]).toBeTruthy();
      expect(values[9]).toEqual(true);

      expect(values[10]).toEqual('lg');
      expect(values[11]).toBeFalsy();
      expect(values[12]).toEqual('lg');
    });

    test('fixes itself with an empty container', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsDropdown>('ids-dropdown')!;
        return [
          dropdown.container
        ];
      });

      expect(values[0]).toBeTruthy();
    });

    test.skip('should handle groups', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        dropdown.clearable = true;
        dropdown.value = '';
        dropdown.input.value = '';
        dropdown.beforeShow = async function beforeShow() {
          return [{
            label: 'Group 1',
            groupLabel: true
          }, {
            label: 'Option 1 u',
            value: 'gr1opt1'
          }, {
            label: 'Option 2',
            value: 'gr1opt2'
          }, {
            label: 'Group 2',
            groupLabel: true
          }, {
            label: 'Option 1 w',
            value: 'gr2opt1'
          }, {
            label: 'Option 2',
            value: 'gr2opt2'
          }];
        };
        await dropdown.open();
        // Renders groups
        const results: any = [
          dropdown.querySelectorAll(`ids-list-box-option`)?.length,
          dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length
        ];

        // Typeahead filtering
        dropdown.typeahead = true;
        dropdown.input.value = '2';
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
        // Keydownend delay
        // await wait(700);

        results.push(dropdown.querySelectorAll(`ids-list-box-option`)?.length);
        results.push(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length);

        dropdown.value = '';
        dropdown.input.value = '';
        dropdown.input.value = 'w';
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
        // Keydownend delay
        // await wait(700);

        results.push(dropdown.querySelectorAll(`ids-list-box-option`)?.length);
        results.push(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length);
        results.push(dropdown.querySelector('ids-list-box-option[group-label]')?.textContent);

        dropdown.value = '';
        dropdown.input.value = 'u';
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'u' }));
        // Keydownend delay
        // await wait(700);

        results.push(dropdown.querySelectorAll(`ids-list-box-option`)?.length);
        results.push(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length);
        results.push(dropdown.querySelector('ids-list-box-option[group-label]')?.textContent);

        // Arrow Down should skip first group label
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        results.push(dropdown.value);

        // Arrow Up should not select group label
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        results.push(dropdown.value);

        // Arrow Up should skip group label
        dropdown.close();
        dropdown.value = 'gr2opt1';
        await dropdown.open();
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        results.push(dropdown.value);

        // Arrow Down should skip group label
        dropdown.close();
        await dropdown.open();
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        results.push(dropdown.value);
        return results;
      });

      expect(values[0]).toEqual(6);
      expect(values[1]).toEqual(2);
      expect(values[2]).toEqual(4);
      expect(values[3]).toEqual(2);

      expect(values[4]).toEqual(2);
      expect(values[5]).toEqual(1);
      expect(values[6]).toEqual('Group 2');

      expect(values[7]).toEqual(2);
      expect(values[8]).toEqual(1);
      expect(values[9]).toEqual('Group 1');
      expect(values[10]).toEqual('gr1opt1');
      expect(values[11]).toEqual('gr1opt1');
      expect(values[12]).toEqual('gr1opt2');
      expect(values[13]).toEqual('gr2opt1');
    });

    test('should handle placeholder attribute', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('ids-dropdown')!;
        dropdown.placeholder = 'select an item';
        const results: any = [
          dropdown.input?.placeholder
        ];

        dropdown.placeholder = null;
        results.push(dropdown.placeholder);
        results.push(dropdown.input?.placeholder);

        return results;
      });

      expect(values[0]).toEqual('select an item');
      expect(values[1]).toEqual('');
      expect(values[2]).toBeNull();
    });

    test('should select an option and update the value by keyboard input', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<any>('#dropdown-keyboard')!;
        dropdown?.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
        // Keydownend delay
        // await wait(700);
        const results: any = [
          dropdown.value
        ];

        dropdown?.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
        // Keydownend delay
        // await wait(700);
        results.push(dropdown.value);

        return results;
      });

      expect(values[0]).toEqual('opt3');
      expect(values[1]).toEqual('opt4');
    });
  });
});
