import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMultiselect from '../../src/components/ids-multiselect/ids-multiselect';
import states from '../../src/assets/data/states.json';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';

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

  test.describe('event tests', () => {
    test.skip('should fire a change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-multiselect') as IdsMultiselect;
        dropdown?.addEventListener('change', () => { changeCount++; });
        dropdown.value = ['opt2'];
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire an input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const dropdown = document.querySelector('ids-multiselect') as IdsMultiselect;
        dropdown?.addEventListener('input', () => { changeCount++; });
        dropdown.value = ['opt3'];
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });

  test.describe('functionality tests', () => {
    test('renders empty multiselect with no errors', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('#multiselect-1')!;
        multiselect.remove();
        return [
          document.querySelectorAll('#multiselect-1').length,
        ];
      });
      expect(values[0]).toEqual(0);
    });

    test('renders with disabled', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.disabled = true;
        const results: any = [
          multiselect.disabled,
          multiselect.getAttribute('disabled')
        ];

        multiselect.disabled = false;
        results.push(multiselect.disabled);
        results.push(multiselect.getAttribute('disabled'));

        multiselect.setAttribute('disabled', 'true');
        results.push(multiselect.disabled);
        results.push(multiselect.getAttribute('disabled'));

        multiselect.removeAttribute('disabled');
        results.push(multiselect.disabled);
        results.push(multiselect.getAttribute('disabled'));

        return results;
      });
      expect(values[0]).toEqual(true);
      expect(values[1]).toBeTruthy();

      expect(values[2]).toEqual(false);
      expect(values[3]).toBeFalsy();

      expect(values[4]).toEqual(true);
      expect(values[5]).toBeTruthy();

      expect(values[6]).toEqual(false);
      expect(values[7]).toBeFalsy();
    });

    test('renders with readonly', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.readonly = true;
        const results: any = [
          multiselect.readonly,
          multiselect.getAttribute('readonly')
        ];

        multiselect.readonly = false;
        results.push(multiselect.readonly);
        results.push(multiselect.getAttribute('readonly'));

        multiselect.setAttribute('readonly', 'true');
        results.push(multiselect.readonly);
        results.push(multiselect.getAttribute('readonly'));

        multiselect.removeAttribute('readonly');
        results.push(multiselect.readonly);
        results.push(multiselect.getAttribute('readonly'));

        return results;
      });
      expect(values[0]).toEqual(true);
      expect(values[1]).toBeTruthy();

      expect(values[2]).toEqual(false);
      expect(values[3]).toBeFalsy();

      expect(values[4]).toEqual(true);
      expect(values[5]).toBeTruthy();

      expect(values[6]).toEqual(false);
      expect(values[7]).toBeFalsy();
    });

    test('renders with validation', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.readonly = true;
        const results: any = [
          multiselect.validate,
          multiselect.validationEvents
        ];

        // Generate from the parent defaults
        multiselect.validationEvents = 'blur change';
        results.push(multiselect.validate);
        results.push(multiselect.validationEvents);

        // Default Case
        multiselect.validationEvents = 'change';
        results.push(multiselect.validate);
        results.push(multiselect.validationEvents);

        return results;
      });
      expect(values[0]).toEqual('required');
      expect(values[1]).toEqual('change');
      expect(values[2]).toEqual('required');
      expect(values[3]).toEqual('blur change');
      expect(values[4]).toEqual('required');
      expect(values[5]).toEqual('change');
    });

    test('supports validation', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        // await waitForTimeout(() => expect(multiselect.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());
        const results: any = [
          multiselect.shadowRoot?.querySelector('ids-trigger-field'),
        ];

        multiselect.validate = 'required';
        multiselect.validationEvents = 'blur change';
        multiselect.triggerEvent('change', multiselect);
        results.push(multiselect.getAttribute('validate'));

        return results;
      });
      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual('required');
    });

    test('can reset validation and validation-events', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<any>('ids-multiselect')!;
        multiselect.validate = 'required';
        multiselect.validationEvents = 'blur change';
        multiselect.validate = null;
        multiselect.validationEvents = null;

        return [
          multiselect.getAttribute('validate'),
          multiselect.getAttribute('validation-events')
        ];
      });
      expect(values[0]).toBeFalsy();
      expect(values[1]).toBeFalsy();
    });

    test('handles setting disabled', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.disabled = true;

        return [
          multiselect.getAttribute('disabled'),
          multiselect.getAttribute('readonly'),
          multiselect.disabled,
          multiselect.input?.disabled
        ];
      });
      expect(values[0]).toEqual('true');
      expect(values[1]).toBeFalsy();
      expect(values[2]).toEqual(true);
      expect(values[3]).toEqual(true);
    });

    test('handles setting readonly', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.readonly = true;

        return [
          multiselect.getAttribute('readonly'),
          multiselect.readonly,
          multiselect.input?.disabled
        ];
      });
      expect(values[0]).toEqual('true');
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
    });

    test('can change the label', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.label = 'Changed Label';

        return [
          multiselect.label,
        ];
      });
      expect(values[0]).toEqual('Changed Label');
    });

    test('should be able to reset dirty indicator', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.dirtyTracker = true;

        const results: any = [
          multiselect.getAttribute('dirty-tracker'),
        ];

        multiselect.dirtyTracker = false;
        results.push(multiselect.getAttribute('dirty-tracker'));

        return results;
      });
      expect(values[0]).toEqual('true');
      expect(values[1]).toBeFalsy();
    });

    test('should be able to set value', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.value = ['opt3'];

        return [
          multiselect.value,
        ];
      });
      expect(values[0]).toContain('opt3');
    });

    test('should ignore null / bad value', async ({ page }) => {
      const values = await page.evaluate(() => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.value = ['opt3'];

        const results: any = [
          multiselect.value,
        ];

        multiselect.value = null;
        results.push(multiselect.value);

        multiselect.value = ['optx'];
        results.push(multiselect.value);

        return results;
      });

      expect(values[0]).toContain('opt3');
      expect(values[1]).toContain('opt3');
      expect(values[2]).toContain('opt3');
    });

    test('supports opening the list with open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;

        const results: any = [
          multiselect.popup?.visible,
        ];

        await multiselect.open();
        results.push(multiselect.popup?.visible);

        multiselect.close();
        results.push(multiselect.popup?.visible);

        multiselect.readonly = true;
        await multiselect.open();
        results.push(multiselect.popup?.visible);

        multiselect.disabled = true;
        await multiselect.open();
        results.push(multiselect.popup?.visible);

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
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;

        const results: any = [
          multiselect.popup?.visible,
        ];

        multiselect.toggle();
        results.push(multiselect.popup?.visible);

        multiselect.toggle();
        results.push(multiselect.popup?.visible);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
    });

    test('supports closing the list with closing', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;

        const results: any = [
          multiselect.popup?.visible,
        ];

        await multiselect.open();
        results.push(multiselect.popup?.visible);

        multiselect.close();
        results.push(multiselect.popup?.visible);

        await multiselect.open();
        results.push(multiselect.popup?.visible);

        multiselect.close();
        results.push(multiselect.popup?.visible);

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(true);
      expect(values[2]).toEqual(false);
      expect(values[3]).toEqual(true);
      expect(values[4]).toEqual(false);
    });

    test('can click outside an open list to close it', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        const clickEvent = new MouseEvent('click', { bubbles: true });

        // multiselect.dropdownList?.onOutsideClick = jest.fn();
        await multiselect.open();
        const results: any = [];

        setTimeout(() => {
          // Click outside the Modal into the overlay area
          document.body.dispatchEvent(clickEvent);

          setTimeout(() => {
            results.push(multiselect.dropdownList?.onOutsideClick);
          });
        }, 70);

        return results;
      });

      // expect(values[0]).toHaveBeenCalled();
    });

    test('supports async beforeShow', async ({ page }) => {
      const values = await page.evaluate(async ({ _states }) => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        const getContents = () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(_states);
          }, 1);
        });

        const results: any = [
          multiselect.querySelectorAll('ids-list-box-option').length,
          multiselect.beforeShow
        ];

        multiselect.beforeShow = async function beforeShow() {
          return getContents();
        };
        results.push(multiselect.beforeShow);

        await multiselect.open();
        results.push(multiselect.querySelectorAll('ids-list-box-option').length);

        return results;
      }, { _states: states });

      expect(values[0]).toEqual(5);
      expect(values[1]).toBeFalsy();
      // expect(values[2]).toBeTruthy();
      expect(values[3]).toEqual(59);
    });

    test('ignores type ahead to open when no matches', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'xxxxx' } });

        // await waitForTimeout(() => expect(multiselect.popup.visible).toEqual(false));
        return [
          multiselect.popup?.visible,
        ];
      });

      expect(values[0]).toEqual(false);
    });

    test('ignores type ahead when readonly', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.readonly = true;
        multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });

        multiselect.disabled = true;
        multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });
        // await waitForTimeout(() => expect(multiselect.popup.visible).toEqual(false));
        return [
          multiselect.popup?.visible,
        ];
      });

      expect(values[0]).toEqual(false);
    });

    test('supports clicking trigger to open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        // await waitForTimeout(() => expect(multiselect.trigger).toBeTruthy());
        const results: any = [
          multiselect.trigger,
        ];

        multiselect.trigger?.click();
        results.push(multiselect.popup?.visible);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual(true);
    });

    test('supports clicking input to open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<any>('ids-multiselect')!;
        // await waitForTimeout(() => expect(multiselect.container).toBeTruthy());
        const results: any = [
          multiselect.container,
        ];

        multiselect.input?.shadowRoot?.querySelector('.field-container')?.click();
        // await waitForTimeout(() => expect(multiselect.popup.visible).toBeTruthy());
        results.push(multiselect.popup?.visible);

        return results;
      });

      expect(values[0]).toBeTruthy();
      expect(values[1]).toBeTruthy();
      expect(values[1]).toEqual(true);
    });

    test('supports clicking to select', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<any>('ids-multiselect')!;
        const results: any = [
          multiselect.value,
        ];

        multiselect.trigger.click();
        // await wait(80);
        multiselect.querySelectorAll('ids-list-box-option')[4].click();
        results.push(multiselect.value);
        // await wait(80);
        results.push(multiselect.value);

        return results;
      });

      expect(values[0]).toContain('opt2');
      expect(values[1]).toContain('opt6');
      // expect(values[1]).toContain('opt2');
    });

    test('can changing language from the container', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const dropdown = document.querySelector<IdsMultiselect>('ids-multiselect')!;
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
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        multiselect.dispatchEvent(event);
        return [
          multiselect.popup?.visible,
        ];
      });
      expect(values[0]).toEqual(true);
    });

    test('ignores arrow down on open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        await multiselect.open();
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        multiselect.dispatchEvent(event);
        return [
          multiselect.popup?.visible,
        ];
      });
      expect(values[0]).toEqual(true);
    });

    test('opens on arrow up', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        multiselect.dispatchEvent(event);
        return [
          multiselect.popup?.visible,
        ];
      });
      expect(values[0]).toEqual(true);
    });

    test('opens on enter', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        multiselect.dispatchEvent(event);
        return [
          multiselect.popup?.visible,
        ];
      });
      expect(values[0]).toEqual(true);
    });

    test.skip('selects on space/enter when open', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.value = [];
        await multiselect.open();

        multiselect.dropdownList?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        multiselect.dropdownList?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        multiselect.dropdownList?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        multiselect.dropdownList?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

        multiselect.close();
        return [
          multiselect.value
        ];
      });
      expect(values[0]).toEqual(['opt5']);
    });

    test('should set/unset tags attribute', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.tags = true;
        const results: any = [
          multiselect.tags
        ];

        multiselect.tags = false;
        results.push(multiselect.tags);

        return results;
      });
      expect(values[0]).toBeTruthy();
      expect(values[1]).toBeFalsy();
    });

    test('should set/unset max attribute', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('ids-multiselect')!;
        multiselect.max = 5;
        const results: any = [
          multiselect.max
        ];

        multiselect.max = null;
        results.push(multiselect.max);

        return results;
      });
      expect(values[0]).toEqual(5);
      expect(values[1]).toBeNaN();
    });

    test('tags work correctly', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<any>('#multiselect-tags')!;
        multiselect.value = ['opt1'];
        const results: any = [
          multiselect.input?.querySelectorAll('ids-tag').length
        ];

        multiselect.input?.querySelector('ids-icon')?.dispatchEvent(new MouseEvent('click'));
        results.push(multiselect.value);

        multiselect.value = ['opt1'];
        multiselect.disabled = true;
        multiselect.value = ['opt1', 'opt2'];
        // eslint-disable-next-line no-unsafe-optional-chaining
        results.push([...multiselect.input?.querySelectorAll('ids-tag')].map((item: any) => item.hasAttribute('disabled')));

        multiselect.disabled = false;
        multiselect.value = [];
        await multiselect.open();
        multiselect.querySelector('ids-list-box-option')?.click();
        results.push(multiselect.value);

        return results;
      });
      expect(values[0]).toEqual(1);
      expect(values[1]).toEqual([]);
      expect(values[2]).toBeTruthy();
      expect(values[3]).toEqual(['opt1']);
    });

    test('should handle overflowed text', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const multiselect = document.querySelector<IdsMultiselect>('#multiselect-overflow')!;
        const getText = () => multiselect.input?.querySelector('ids-text');

        const results: any = [
          multiselect.value,
          getText()?.textContent,
        ];

        multiselect.value = ['opt1'];
        results.push(getText()?.textContent);

        multiselect.value = [];
        results.push(getText()?.textContent);

        return results;
      });
      expect(values[0]).toEqual(['opt1', 'opt2', 'opt3']);
      expect(values[1]).toEqual('Option One, Option Two, Option Three');
      expect(values[2]).toEqual('Option One');
      expect(values[3]).toBe('');
    });
  });
});
