import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsColorPicker from '../../src/components/ids-color-picker/ids-color-picker';
import IdsColor from '../../src/components/ids-color/ids-color';

test.describe('IdsColorPicker tests', () => {
  const url = '/ids-color-picker/example.html';
  let colorPicker: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    colorPicker = await page.locator('ids-color-picker').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Color Picker Component');
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

  test.describe('snapshot tests', () => {
    test.skip('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-color-picker-light');
    });
  });

  test.describe('functionality tests', () => {
    test('renders with readonly', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.readonly)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.readonly = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.readonly)).toBeTruthy();
    });

    test('renders with disabled', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.disabled)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.disabled = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.disabled)).toBeTruthy();
    });

    test('renders with advanced', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.advanced)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.advanced = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.advanced)).toBeTruthy();
      await expect(colorPicker).toHaveAttribute('advanced', 'true');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.container?.querySelectorAll('.advanced-color-picker').length)).toEqual(1);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => (colorpicker?.container?.querySelector('.advanced-color-picker') as any).value)).toEqual('#ffffff');

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.advanced = false; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.advanced)).toBeFalsy();
      await expect(colorPicker).not.toHaveAttribute('advanced');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.container?.querySelectorAll('.advanced-color-picker').length)).toBe(0);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.colorInput)).toBeNull();
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.mask)).not.toBeDefined();

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = '#000000'; });
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.advanced = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.container?.querySelectorAll('.advanced-color-picker').length)).toEqual(1);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => (colorpicker?.container?.querySelector('.advanced-color-picker') as any).value)).toEqual('#000000');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.mask)).toBeDefined();
    });

    test('has a default value of blank', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.value)).toEqual('');
      await expect(colorPicker).not.toHaveAttribute('value');
    });

    test('has a default value attribute', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = '#000000'; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.value)).toEqual('#000000');
      await expect(colorPicker).toHaveAttribute('value', '#000000');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = ''; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.value)).toEqual('');
      await expect(colorPicker).not.toHaveAttribute('value');
    });

    test('has a disabled attribute', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.disabled)).toBeDefined();
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.disabled)).toEqual(false);
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.disabled = 'false'; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.disabled)).toEqual(false);
      await expect(colorPicker).not.toHaveAttribute('disabled');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.disabled = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.disabled)).toEqual(true);
      await expect(colorPicker).toHaveAttribute('disabled', '');
    });

    test('has a clearable attribute', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.clearable)).toBeDefined();
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.clearable)).toBeFalsy();
      await expect(colorPicker).not.toHaveAttribute('clearable');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches.find((e: any) => !e.hex)))
        .toBeUndefined();

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.clearable = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.clearable)).toBeTruthy();
      await expect(colorPicker).toHaveAttribute('clearable', 'true');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches.find((e: any) => !e.hex)))
        .toBeDefined();
    });

    test('has a readonly attribute', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.readonly = false; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.readonly)).toEqual(false);
      await expect(colorPicker).not.toHaveAttribute('readonly');

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.readonly = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.readonly)).toBeTruthy();
      await expect(colorPicker).toHaveAttribute('readonly');
    });

    test('has a label attribute', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.suppressLabels = false; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressLabels)).toEqual(false);
      await expect(colorPicker).not.toHaveAttribute('suppress-labels');

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.suppressLabels = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressLabels)).toBeTruthy();
      await expect(colorPicker).toHaveAttribute('suppress-labels');
    });

    test('has a suppressTooltips attribute', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.suppressTooltips = false; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toEqual(false);
      await expect(colorPicker).not.toHaveAttribute('suppress-tooltips');

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.suppressTooltips = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toBeTruthy();
      await expect(colorPicker).toHaveAttribute('suppress-tooltips');
    });

    test('has suppresses labels and tooltips when IdsColorPicker.advanced is true', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.advanced)).toEqual(false);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressLabels)).toEqual(false);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toEqual(false);

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.advanced = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.advanced)).toEqual(true);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressLabels)).toEqual(true);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toEqual(true);
    });

    test('should close on outside click', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toEqual(false);
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.open());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.onOutsideClick());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
    });

    test.skip('should not close on click outside if no onOutsideClick', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toEqual(false);
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.triggerEvent('click', colorpicker.container));
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => (colorpicker as any).addOpenEvents());
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { (colorpicker as any).onOutsideClick = null; });
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.triggerEvent('click', document.body));
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
    });

    test('should not open if readonly', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.readonly = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.triggerEvent('click', colorpicker.container));
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
    });

    test('should be able to open with IdsColorPicker.open()', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.open());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches)).toBeTruthy();
    });

    test('should select on enter', async ({ page }) => {
      await page.click('#color-picker-test-trigger-field-internal');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.value)).toEqual('#fbe7e8');
    });

    test('should allow custom colors to be slotted', async ({ page }) => {
      const customColor = await page.evaluate(() => {
        const customColorPicker = document.querySelector('[label="Custom Colors"]');
        const customColorElem = customColorPicker?.querySelector('ids-color[hex="#D8E2DC"]');
        return customColorElem;
      });
      expect(customColor).toBeDefined();
    });
  });

  test.describe('When Popup is Closed', () => {
    test('toggles popup open/close when trigger button clicked', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.triggerBtn?.click());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.triggerBtn?.click());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
    });

    test('opens popup on Enter', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
        colorpicker.dispatchEvent(keydownEnter);
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
    });

    test('opens popup on ArrowDown', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const keydownArrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        colorpicker.dispatchEvent(keydownArrowDown);
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
    });
  });

  test.describe('When Popup is Open', () => {
    test.beforeEach(async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.open());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
    });
    test.afterEach(async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.close());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
    });

    test('closes popup on Escape', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const keydownEscape = new KeyboardEvent('keydown', { key: 'Escape' });
        colorpicker.dispatchEvent(keydownEscape);
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();
    });

    test('focuses first color-swatch on open', async ({ page }) => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      expect(await page.evaluate(() => (document as any).activeElement?.name)).toBe('ids-color');
    });

    test('selects focused color-swatch on Enter', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = ''; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.value)).toBe('');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
        colorpicker.dispatchEvent(keydownEnter);
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.value)).toContain('#fbe7e8');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.textInput?.value)).toContain('red-10');
    });

    test('selects focused color-swatch on Spacebar', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = ''; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.value)).toBe('');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const keydownSpacebar = new KeyboardEvent('keydown', { key: 'Space' });
        colorpicker.dispatchEvent(keydownSpacebar);
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.value)).toContain('#fbe7e8');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.textInput?.value)).toContain('red-10');
    });

    test('shows checkmark on selected color-swatch', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = ''; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.value)).toBe('');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]').length)).toBe(0);
      const secondSwatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches[1].label);
      await colorPicker.evaluate(
        (colorpicker: IdsColorPicker, swatch: any) => { colorpicker.value = swatch; },
        secondSwatch
      );
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.value)).toContain('#f5c3c4');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.textInput?.value))
        .toContain(secondSwatch);
      const selectedColors = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]'));
      const length = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]').length);
      expect(selectedColors).toBeDefined();
      expect(length).toBe(1);
      const colorSelected = await colorPicker.locator('ids-color[label="red-20"]');
      await expect(colorSelected).toHaveAttribute('checked');
      await expect(await colorPicker.evaluate(async (colorpicker: IdsColorPicker) => {
        const selectedColor = colorpicker.querySelectorAll('ids-color[checked]') as any;
        return selectedColor[0].label;
      })).toBe(secondSwatch);
    });

    test('clears color when no-color swatch selected', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = ''; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.value)).toBe('');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]').length)).toBe(0);

      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.clearable = true; });

      const secondSwatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches[1].label);
      await colorPicker.evaluate(
        (colorpicker: IdsColorPicker, swatch: any) => { colorpicker.value = swatch; },
        secondSwatch
      );
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.value)).toContain('#f5c3c4');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker?.textInput?.value))
        .toContain(secondSwatch);
      const selectedColors = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]'));
      const length = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]').length);
      expect(selectedColors).toBeDefined();
      expect(length).toBe(1);
      const colorSelected = await colorPicker.locator('ids-color[label="red-20"]');
      await expect(colorSelected).toHaveAttribute('checked');
      await expect(await colorPicker.evaluate(async (colorpicker: IdsColorPicker) => {
        const selectedColor = colorpicker.querySelectorAll('ids-color[checked]') as any;
        return selectedColor[0].label;
      })).toBe(secondSwatch);

      const noColorSwatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const noColor = colorpicker.swatches.find((e: any) => !e.hex);
        noColor?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        return noColor?.label;
      });
      expect(noColorSwatch).toBe('');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.value = ''; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.textInput?.value)).toBe('');
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.querySelectorAll('ids-color[checked]').length)).toBe(1);
      await expect(await colorPicker.evaluate(async (colorpicker: IdsColorPicker) => {
        const selectedColor = colorpicker.querySelectorAll('ids-color[checked]') as any;
        return selectedColor[0].label;
      })).toBe(noColorSwatch);
    });

    test('color swatches have "outlined" class for hover', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const swatches = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first, second, third] = colorpicker.swatches;
        return {
          first: first.classList,
          second: second.classList,
          third: third.classList
        };
      });
      await expect(swatches.first[1]).toContain('outlined');
      await expect(swatches.second[1]).toContain('outlined');
      await expect(swatches.third[1]).toContain('outlined');
    });

    test('does not have "tabindex" when IdsColorPicker.popup is visible', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const swatches = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first, second, third] = colorpicker.swatches;
        return {
          first: first.hasAttribute('tabindex'),
          second: second.hasAttribute('tabindex'),
          third: third.hasAttribute('tabindex')
        };
      });
      await expect(swatches.first).toBe(false);
      await expect(swatches.second).toBe(false);
      await expect(swatches.third).toBe(false);
    });

    test('has "tabindex" -1 when IdsColorPicker.popup is hidden to prevent tab interference', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.close());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeFalsy();

      const swatches = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first, second, third] = colorpicker.swatches;
        return {
          first: first.getAttribute('tabindex'),
          second: second.getAttribute('tabindex'),
          third: third.getAttribute('tabindex')
        };
      });
      await expect(swatches.first).toBe('-1');
      await expect(swatches.second).toBe('-1');
      await expect(swatches.third).toBe('-1');
    });

    test('shows color-swatch labels when IdsColorPicker.labels is true', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.innerHTML = ''; });

      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const swatch = document.createElement('ids-color') as IdsColor;
        swatch.hex = '#000000';
        swatch.label = 'Black';
        colorpicker.appendChild(swatch);
        (colorpicker as any).labels = true;
      }));
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.close());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.label)).toBeTruthy();

      const swatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first] = colorpicker.swatches;
        return {
          hex: first.hex,
          label: first.label,
          tooltip: first.tooltip
        };
      });
      await expect(swatch.hex).toBe('#000000');
      await expect(swatch.label).toBe('Black');
      await expect(swatch.tooltip).toBe('Black');
    });

    test('shows color-swatch labels when IdsColorPicker.labels is false', async () => {
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.innerHTML = ''; });

      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const swatch = document.createElement('ids-color') as IdsColor;
        swatch.hex = '#000000';
        swatch.label = 'Black';
        colorpicker.appendChild(swatch);
        (colorpicker as any).labels = false;
      }));
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.close());
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.label)).toBeTruthy();

      const swatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first] = colorpicker.swatches;
        return {
          hex: first.hex,
          label: first.label,
          tooltip: first.tooltip
        };
      });
      await expect(swatch.hex).toBe('#000000');
      await expect(swatch.label).toBe('Black');
      await expect(swatch.tooltip).toBe('Black');
    });

    test('hides color-swatch tooltips when IdsColorPicker.suppressTooltips is true', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toBe(false);
      await expect(colorPicker).not.toHaveAttribute('suppress-tooltips');

      // hover mouse over color swatch and check that swatch.tooltip is visible
      // check that swatch.disabled is false and tooltip is visible and popuplated
      const swatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first] = colorpicker.swatches;
        return {
          disabled: first.disabled,
          tooltip: first.tooltip
        };
      });
      await expect(swatch.disabled).toBe(false);
      await expect(swatch.tooltip).toBe('red-10');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.suppressTooltips = true; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toBe(true);
      await expect(colorPicker).toHaveAttribute('suppress-tooltips', 'true');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [oswatch] = colorpicker.swatches;
        oswatch.dispatchEvent(new MouseEvent('mouseover'));
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [oswatch] = colorpicker.swatches;
        return oswatch?.popup?.visible;
      })).toBe(false);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [oswatch] = colorpicker.swatches;
        return oswatch?.popup?.innerText;
      })).toBe(' ');
    });

    test('shows color-swatch tooltips when IdsColorPicker.suppressTooltips is false', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toBe(false);
      await expect(colorPicker).not.toHaveAttribute('suppress-tooltips');

      // hover mouse over color swatch and check that swatch.tooltip is visible
      // check that swatch.disabled is false and tooltip is visible and popuplated
      const swatch = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first] = colorpicker.swatches;
        return {
          disabled: first.disabled,
          tooltip: first.tooltip
        };
      });
      await expect(swatch.disabled).toBe(false);
      await expect(swatch.tooltip).toBe('red-10');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => { colorpicker.suppressTooltips = false; });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.suppressTooltips)).toBe(false);
      await expect(colorPicker).not.toHaveAttribute('suppress-tooltips');
      await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [oswatch] = colorpicker.swatches;
        oswatch.dispatchEvent(new MouseEvent('mouseover'));
      });
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [oswatch] = colorpicker.swatches;
        return oswatch?.popup?.visible;
      })).toBe(true);
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [oswatch] = colorpicker.swatches;
        return oswatch?.popup?.innerText;
      })).toBe('red-10');
    });

    test('focuses next color-swatch on ArrowRight', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const firstColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const [first] = colorpicker.swatches;
        first?.swatch?.focus();
        return {
          focused: document.activeElement?.isEqualNode(first)
        };
      });
      await expect(firstColor.focused).toBe(true);
      const secondColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const color = colorpicker.swatches[1];
        const keydownArrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        colorpicker?.popup?.dispatchEvent(keydownArrowRight);
        return {
          focused: document.activeElement?.isEqualNode(color)
        };
      });
      await expect(secondColor.focused).toBe(true);
      const thirdColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const color = colorpicker.swatches[2];
        const keydownArrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        colorpicker?.popup?.dispatchEvent(keydownArrowRight);
        return {
          focused: document.activeElement?.isEqualNode(color)
        };
      });
      await expect(thirdColor.focused).toBe(true);
    });

    test('focuses next color-swatch on ArrowLeft', async () => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const thirdColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const third = colorpicker.swatches[2];
        third?.swatch?.focus();
        return {
          focused: document.activeElement?.isEqualNode(third)
        };
      });
      await expect(thirdColor.focused).toBe(true);
      const secondColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const second = colorpicker.swatches[1];
        const keydownArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        colorpicker?.popup?.dispatchEvent(keydownArrowLeft);
        return {
          focused: document.activeElement?.isEqualNode(second)
        };
      });
      await expect(secondColor.focused).toBe(true);
      const firstColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const first = colorpicker.swatches[0];
        const keydownArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        colorpicker?.popup?.dispatchEvent(keydownArrowLeft);
        return {
          focused: document.activeElement?.isEqualNode(first)
        };
      });
      await expect(firstColor.focused).toBe(true);
    });

    const NUM_COLUMNS = 10;
    test('focuses next color-swatch on ArrowDown', async ({ page }) => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const firstColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const first = colorpicker.swatches[0];
        first?.swatch?.focus();
        return {
          focused: document.activeElement?.isEqualNode(first)
        };
      });
      const focused = async () => colorPicker.evaluate(() => document.activeElement?.getAttribute('label'));
      await expect(firstColor.focused).toBe(true);
      await page.keyboard.press('ArrowDown');
      let focusedEl = await colorPicker.evaluate((colorpicker: IdsColorPicker, columns: any) => colorpicker.swatches[columns].getAttribute('label'), NUM_COLUMNS);
      expect(await focused()).toEqual(focusedEl);
      await page.keyboard.press('ArrowDown');
      focusedEl = await colorPicker.evaluate((colorpicker: IdsColorPicker, columns: any) => colorpicker.swatches[columns].getAttribute('label'), NUM_COLUMNS * 2);
      expect(await focused()).toEqual(focusedEl);
      const lastColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const last = colorpicker.swatches[colorpicker.swatches.length - 1];
        last?.swatch?.focus();
        return {
          focused: document.activeElement?.isEqualNode(last)
        };
      });
      await expect(lastColor.focused).toBe(true);
    });

    test('focuses next color-swatch on ArrowUp', async ({ page }) => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const activeColor = await colorPicker.evaluate((colorpicker: IdsColorPicker, columns: any) => {
        const active = colorpicker.swatches[columns * 2];
        active?.swatch?.focus();
        return {
          focused: document.activeElement?.isEqualNode(active)
        };
      }, NUM_COLUMNS);
      await expect(activeColor.focused).toBe(true);
      const focused = async () => colorPicker.evaluate(() => document.activeElement?.getAttribute('label'));
      await page.keyboard.press('ArrowUp');
      let focusedEl = await colorPicker.evaluate((colorpicker: IdsColorPicker, columns: any) => colorpicker.swatches[columns].getAttribute('label'), NUM_COLUMNS);
      expect(await focused()).toEqual(focusedEl);
      await page.keyboard.press('ArrowUp');
      focusedEl = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches[0].getAttribute('label'));
      expect(await focused()).toEqual(focusedEl);
      await page.keyboard.press('ArrowUp');
      focusedEl = await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.swatches[0].getAttribute('label'));
      expect(await focused()).toEqual(focusedEl);
    });

    test('focuses first color-swatch on ArrowRight when last color-swatch active', async ({ page }) => {
      expect(await colorPicker.evaluate((colorpicker: IdsColorPicker) => colorpicker.popup?.visible)).toBeTruthy();

      const lastColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const last = colorpicker.swatches[colorpicker.swatches.length - 1];
        last?.swatch?.focus();
        return {
          focused: document.activeElement?.isEqualNode(last)
        };
      });
      await expect(lastColor.focused).toBe(true);
      await page.keyboard.press('ArrowRight');
      const firstColor = await colorPicker.evaluate((colorpicker: IdsColorPicker) => {
        const first = colorpicker.swatches[0];
        return {
          focused: document.activeElement?.isEqualNode(first)
        };
      });
      await expect(firstColor.focused).toBe(true);
      const focused = await colorPicker.evaluate(() => document.activeElement?.getAttribute('label'));
      await expect(firstColor.focused).toBe(true);
      const focusedEl = await colorPicker.evaluate((colorpicker: IdsColorPicker) => (colorpicker.swatches[0]).getAttribute('label'));
      expect(focused).toEqual(focusedEl);
    });
  });
});
