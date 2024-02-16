/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitForTimeout from '../helpers/wait-for-timeout';
import IdsColor from '../../src/components/ids-color/ids-color';
import IdsColorPicker from '../../src/components/ids-color-picker/ids-color-picker';

describe('Ids Color Picker Component', () => {
  let colorpicker: any;

  const createFromTemplate = (innerHTML: any) => {
    colorpicker?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    colorpicker = template.content.childNodes[0];
    document.body.appendChild(colorpicker);
    return colorpicker;
  };

  beforeEach(async () => {
    colorpicker = new IdsColorPicker();
    document.body.appendChild(colorpicker);
  });

  afterEach(async () => {
    colorpicker.remove();
    document.body.innerHTML = '';
    colorpicker = null;
  });

  test('renders with readonly', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.readonly).toBeTruthy();
  });

  test('renders with disabled', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" disabled="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.disabled).toBeTruthy();
  });

  test('renders with advanced', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" advanced="true" value="#941e1e" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.advanced).toBe(true);
    expect(colorpicker.hasAttribute('advanced')).toBe(true);
    expect(colorpicker.getAttribute('advanced')).toBe('true');
    expect(colorpicker.textInput.mask).toBeDefined();
    expect(colorpicker.container.querySelectorAll('.advanced-color-picker').length).toEqual(1);
    expect(colorpicker.container.querySelector('.advanced-color-picker')?.value).toEqual('#941e1e');

    colorpicker.advanced = false;
    expect(colorpicker.hasAttribute('advanced')).toBe(false);
    expect(colorpicker.getAttribute('advanced')).toBeFalsy();
    expect(colorpicker.container.querySelector('.advanced-color-picker')).toBeNull();
    expect(colorpicker.colorInput).toBeNull();
    expect(colorpicker.textInput.mask).not.toBeDefined();

    colorpicker.value = '#000000';
    colorpicker.advanced = true;
    expect(colorpicker.container.querySelectorAll('.advanced-color-picker').length).toEqual(1);
    expect(colorpicker.container.querySelector('.advanced-color-picker')?.value).toEqual('#000000');
    expect(colorpicker.textInput.mask).toBeDefined();
  });

  test('has a default value of blank', () => {
    expect(colorpicker.value).toEqual('');
    expect(colorpicker.getAttribute('value')).toBeFalsy();
  });

  test('has a value attribute', () => {
    colorpicker.value = '#000000';
    expect(colorpicker.value).toEqual('#000000');
    expect(colorpicker.getAttribute('value')).toEqual('#000000');
    colorpicker.value = '';
    expect(colorpicker.value).toEqual('');
    expect(colorpicker.getAttribute('value')).toBeNull();
  });

  test('has a disabled attribute', () => {
    expect(colorpicker.disabled).toBeDefined();
    expect(colorpicker.disabled).toEqual(false);

    colorpicker.disabled = false;
    expect(colorpicker.disabled).toEqual(false);
    expect(colorpicker.hasAttribute('disabled')).toEqual(false);
    expect(colorpicker.getAttribute('disabled')).toBeFalsy();

    colorpicker.disabled = true;
    expect(colorpicker.disabled).toEqual(true);
    expect(colorpicker.getAttribute('disabled')).toEqual('');
  });

  test('has a clearable attribute', () => {
    expect(colorpicker.clearable).toBeDefined();

    expect(colorpicker.clearable).toBeFalsy();
    expect(colorpicker.hasAttribute('clearable')).toEqual(false);
    expect(colorpicker.getAttribute('clearable')).toBeFalsy();
    expect(colorpicker.swatches.find((e: any) => !e.hex)).toBeUndefined();

    colorpicker.clearable = true;
    expect(colorpicker.clearable).toBeTruthy();
    expect(colorpicker.getAttribute('clearable')).toEqual('true');
    expect(colorpicker.swatches.find((e: any) => !e.hex)).toBeDefined();
  });

  test('has a readonly attribute', () => {
    colorpicker.readonly = false;
    expect(colorpicker.readonly).toEqual(false);
    expect(colorpicker.hasAttribute('readonly')).toEqual(false);
    expect(colorpicker.getAttribute('readonly')).toBeFalsy();

    colorpicker.readonly = true;
    expect(colorpicker.readonly).toEqual(true);
    expect(colorpicker.getAttribute('readonly')).toEqual('');
  });

  test('has a label attribute', () => {
    colorpicker.label = 'Ids Color Picker';
    expect(colorpicker.getAttribute('label')).toEqual('Ids Color Picker');
  });

  test('has a labels attribute', () => {
    colorpicker.suppressLabels = false;
    expect(colorpicker.suppressLabels).toEqual(false);
    expect(colorpicker.hasAttribute('suppress-labels')).toEqual(false);
    expect(colorpicker.getAttribute('suppress-labels')).toBeFalsy();

    colorpicker.suppressLabels = true;
    expect(colorpicker.suppressLabels).toEqual(true);
    expect(colorpicker.getAttribute('suppress-labels')).toEqual('true');
  });

  test('has a suppressTooltips attribute', () => {
    colorpicker.suppressTooltips = false;
    expect(colorpicker.suppressTooltips).toEqual(false);
    expect(colorpicker.hasAttribute('suppress-tooltips')).toEqual(false);
    expect(colorpicker.getAttribute('suppress-tooltips')).toBeFalsy();

    colorpicker.suppressTooltips = true;
    expect(colorpicker.suppressTooltips).toEqual(true);
    expect(colorpicker.getAttribute('suppress-tooltips')).toEqual('true');
  });

  test('suppresses labels and tooltips when IdsColorPicker.advanced is true', () => {
    expect(colorpicker.advanced).toEqual(false);
    expect(colorpicker.suppressLabels).toEqual(false);
    expect(colorpicker.suppressTooltips).toEqual(false);

    colorpicker.advanced = true;
    expect(colorpicker.advanced).toEqual(true);
    expect(colorpicker.suppressLabels).toEqual(true);
    expect(colorpicker.suppressTooltips).toEqual(true);
  });

  test('should close on outside click', () => {
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    waitForTimeout(() => expect(colorpicker.popup.visible).toBeTruthy());
    colorpicker.onOutsideClick();
    waitForTimeout(() => expect(colorpicker.popup.visible).toBeFalsy());
  });

  test('should not close on click outside if no onOutsideClick', () => {
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    waitForTimeout(() => expect(colorpicker.popup.visible).toBeTruthy());
    colorpicker.addOpenEvents();
    colorpicker.onOutsideClick = null;
    colorpicker.triggerEvent('click', document.body);
    waitForTimeout(() => expect(colorpicker.popup.visible).toBeTruthy());
  });

  test('should not open if readonly', () => {
    colorpicker.readonly = true;
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    expect(colorpicker.popup.visible).toEqual(false);
  });

  test('should be able to open with IdsColorPicker.open()', () => {
    colorpicker.open();
    expect(colorpicker.popup.visible).toEqual(true);
    expect(colorpicker.swatches).toBeTruthy();
  });

  test('should select on enter', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"><ids-color hex="#383838"></ids-color></ids-color-picker>`);
    colorpicker.popup.visible = true;
    (document.querySelector('#color-picker-1 > ids-color[hex="#383838"]') as any).focus();
    const hex: any = document.querySelector('#color-picker-1 > ids-color[hex="#383838"]');

    const enterKeyEvent = new KeyboardEvent('keydown', ({ key: 'Enter', target: hex, bubbles: true } as any));
    hex.dispatchEvent(enterKeyEvent);
    expect(colorpicker.value).toEqual('#383838');
  });

  test('should select on enter when checked', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"><ids-color hex="#999999" checked="true"></ids-color></ids-color-picker>`);
    colorpicker.popup.visible = true;
    (document.querySelector('#color-picker-1 > ids-color[hex="#999999"]') as any).focus();
    const hex: any = document.querySelector('#color-picker-1 > ids-color[hex="#999999"]');

    const enterKeyEvent = new KeyboardEvent('keydown', ({ key: 'Enter', target: hex, bubbles: true } as any));
    hex.dispatchEvent(enterKeyEvent);
    expect(colorpicker.value).toEqual('#999999');
  });

  describe('When Popup is Closed', () => {
    test('toggles popup open/close when trigger button clicked', () => {
      expect(colorpicker.popup.visible).toBe(false);
      colorpicker.triggerBtn.click();
      expect(colorpicker.popup.visible).toBe(true);
      colorpicker.triggerBtn.click();
      expect(colorpicker.popup.visible).toBe(false);
    });

    test('opens popup on Enter', () => {
      expect(colorpicker.popup.visible).toBe(false);
      const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
      colorpicker.dispatchEvent(keydownEnter);
      expect(colorpicker.popup.visible).toBe(true);
    });

    test('opens popup on ArrowDown', () => {
      expect(colorpicker.popup.visible).toBe(false);
      const keydownArrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      colorpicker.dispatchEvent(keydownArrowDown);
      expect(colorpicker.popup.visible).toBe(true);
    });
  });

  describe('When Popup is Open', () => {
    beforeEach(() => {
      colorpicker.open();
      expect(colorpicker.popup.visible).toBe(true);
    });

    afterEach(() => {
      colorpicker.close();
      expect(colorpicker.popup.visible).toBe(false);
    });

    test('closes popup on Escape', () => {
      expect(colorpicker.popup.visible).toBe(true);
      const keydownEscape = new KeyboardEvent('keydown', { key: 'Escape' });
      colorpicker.dispatchEvent(keydownEscape);
      expect(colorpicker.popup.visible).toBe(false);
    });

    test('focuses first color-swatch on open', () => {
      expect(colorpicker.popup.visible).toBe(true);
      const [swatch] = colorpicker.swatches;
      expect(document.activeElement).toBe(swatch);
    });

    test('selects focused color-swatch on Enter', () => {
      expect(colorpicker.popup.visible).toBe(true);

      colorpicker.value = '';
      expect(colorpicker.textInput.value).toBe('');

      const [swatch] = colorpicker.swatches;
      swatch.focus();
      expect(document.activeElement).toBe(swatch);

      const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
      colorpicker.dispatchEvent(keydownEnter);
      expect(colorpicker.value).toContain(swatch.label);
      expect(colorpicker.textInput.value).toBe(swatch.label);
    });

    test('selects focused color-swatch on Spacebar', () => {
      expect(colorpicker.popup.visible).toBe(true);

      colorpicker.value = '';
      expect(colorpicker.textInput.value).toBe('');

      const [swatch] = colorpicker.swatches;
      swatch.focus();
      expect(document.activeElement).toBe(swatch);

      const keydownSpacebar = new KeyboardEvent('keydown', { key: 'Space' });
      colorpicker.dispatchEvent(keydownSpacebar);
      expect(colorpicker.value).toContain(swatch.label);
      expect(colorpicker.textInput.value).toBe(swatch.label);
    });

    test('shows checkmark on selected color-swatch', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.value).toBe('');

      expect(colorpicker.querySelectorAll('ids-color[checked]').length).toBe(0);

      const secondSwatch = colorpicker.swatches[1];
      colorpicker.value = secondSwatch.label;
      expect(colorpicker.value).toContain(secondSwatch.label);

      const selectedColors = colorpicker.querySelectorAll('ids-color[checked]');
      expect(selectedColors).toBeDefined();
      expect(selectedColors.length).toBe(1);
      expect(selectedColors[0].hasAttribute('checked')).toBe(true);
      expect(selectedColors[0].label).toBe(secondSwatch.label);
    });

    test('clears color when no-color swatch selected', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.value).toBe('');
      expect(colorpicker.querySelectorAll('ids-color[checked]').length).toBe(0);

      colorpicker.clearable = true;

      const secondSwatch = colorpicker.swatches[1];
      colorpicker.value = secondSwatch.label;
      expect(colorpicker.value).toContain(secondSwatch.label);

      const selectedColors = colorpicker.querySelectorAll('ids-color[checked]');
      expect(selectedColors).toBeDefined();
      expect(selectedColors.length).toBe(1);
      expect(selectedColors[0].hasAttribute('checked')).toBe(true);
      expect(selectedColors[0].label).toBe(secondSwatch.label);

      const noColorSwatch = colorpicker.swatches.find((e: any) => !e.hex);
      expect(noColorSwatch.label).toBe('');
      noColorSwatch.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(colorpicker.value).toBe('');
      expect(colorpicker.querySelectorAll('ids-color[checked]').length).toBe(1);
      expect(colorpicker.querySelector('ids-color[checked]')).toBe(noColorSwatch);
    });

    test('color swatches have "outlined" class for hover', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const [first, second, third] = colorpicker.swatches;
      expect(first.classList.contains('outlined')).toBe(true);
      expect(second.classList.contains('outlined')).toBe(true);
      expect(third.classList.contains('outlined')).toBe(true);
    });

    test('does not have "tabindex" when IdsColorPicker.popup is visible', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const [first, second, third] = colorpicker.swatches;
      expect(first.hasAttribute('tabindex')).toBe(false);
      expect(second.hasAttribute('tabindex')).toBe(false);
      expect(third.hasAttribute('tabindex')).toBe(false);
    });

    test('has "tabindex" -1 when IdsColorPicker.popup is hidden to prevent tab interference', () => {
      expect(colorpicker.popup.visible).toBe(true);
      colorpicker.close();
      expect(colorpicker.popup.visible).toBe(false);

      const [first, second, third] = colorpicker.swatches;
      expect(first.getAttribute('tabindex')).toBe('-1');
      expect(second.getAttribute('tabindex')).toBe('-1');
      expect(third.getAttribute('tabindex')).toBe('-1');
    });

    test('shows color-swatch labels when IdsColorPicker.labels is true', () => {
      colorpicker.innerHTML = '';
      let swatch = new IdsColor();
      swatch.hex = '#000000';
      swatch.label = 'Black';
      colorpicker.appendChild(swatch);

      colorpicker.labels = true;
      expect(colorpicker.labels).toBe(true);

      swatch = colorpicker.swatches[0];
      expect(swatch.hex).toBe('#000000');
      expect(swatch.label).toBe('Black');
      expect(swatch.tooltip).toBe('');
    });

    test('shows color-swatch hex when IdsColorPicker.labels is false', () => {
      colorpicker.innerHTML = '';
      let swatch = new IdsColor();
      swatch.hex = '#000000';
      swatch.label = 'Black';
      colorpicker.appendChild(swatch);

      colorpicker.labels = false;
      expect(colorpicker.labels).toBe(false);

      swatch = colorpicker.swatches[0];
      expect(swatch.hex).toBe('#000000');
      expect(swatch.label).toBe('Black');
      expect(swatch.tooltip).toBe('');
    });

    it.skip('hides color-swatch tooltips when IdsColorPicker.suppressTooltips is true', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.suppressTooltips).toBe(false);
      expect(colorpicker.hasAttribute('suppress-tooltips')).toBe(false);

      // hover mouse over color swatch and check that swatch.tooltip is visible
      // check that swatch.disabled is false and tooltip is visible and popuplated
      const [swatch] = colorpicker.swatches;
      expect(swatch.disabled).toBe(false);
      expect(swatch.tooltip).toBe('red-10');

      colorpicker.suppressTooltips = true;
      expect(colorpicker.suppressTooltips).toBe(true);
      expect(colorpicker.hasAttribute('suppress-tooltips')).toBe(true);
      expect(colorpicker.getAttribute('suppress-tooltips')).toBe('true');

      swatch.dispatchEvent(new MouseEvent('mouseover'));
      expect(swatch.popup.visible).toBe(false);
      expect(swatch.popup.innerText).toBe('');
    });

    it.skip('shows color-swatch tooltips when IdsColorPicker.suppressTooltips is false', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.suppressTooltips).toBe(false);
      expect(colorpicker.hasAttribute('suppress-tooltips')).toBe(false);

      let [swatch] = colorpicker.swatches;
      expect(swatch.disabled).toBe(false);
      expect(swatch.tooltip).toBe(swatch.label);

      colorpicker.suppressTooltips = true;
      expect(colorpicker.suppressTooltips).toBe(true);
      expect(colorpicker.hasAttribute('suppress-tooltips')).toBe(true);
      expect(colorpicker.getAttribute('suppress-tooltips')).toBe('true');

      swatch.dispatchEvent(new MouseEvent('mouseover'));
      expect(swatch.popup.visible).toBe(false);
      expect(swatch.popup.innerText).toBe('');

      [swatch] = colorpicker.swatches;
      expect(swatch.disabled).toBe(true);
      expect(swatch.tooltip).toBe('');
    });

    test('focuses next color-swatch on ArrowRight', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const [firstColor, secondColor, thirdColor] = colorpicker.swatches;
      firstColor.swatch.focus();
      expect(document.activeElement).toBe(firstColor);

      const keydownArrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      colorpicker.popup.dispatchEvent(keydownArrowRight);
      expect(document.activeElement).toBe(secondColor);

      colorpicker.popup.dispatchEvent(keydownArrowRight);
      expect(document.activeElement).toBe(thirdColor);
    });

    test('focuses previous color-swatch on ArrowLeft', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const [firstColor, secondColor, thirdColor] = colorpicker.swatches;
      thirdColor.swatch.focus();
      expect(document.activeElement).toBe(thirdColor);

      const keydownArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      colorpicker.popup.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toBe(secondColor);

      colorpicker.popup.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toBe(firstColor);
    });

    // TODO: add NUM_COLUMNS as configurable attribute to colorpicker
    const NUM_COLUMNS = 10;
    test('focuses downward color-swatch on ArrowDown', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const firstColor = colorpicker.swatches[0];
      const lastColor = colorpicker.swatches[colorpicker.swatches.length - 1];
      firstColor.swatch.focus();
      expect(document.activeElement).toBe(firstColor);

      const keydownArrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      colorpicker.popup.dispatchEvent(keydownArrowDown);
      expect(document.activeElement).toBe(colorpicker.swatches[NUM_COLUMNS]);

      colorpicker.popup.dispatchEvent(keydownArrowDown);
      expect(document.activeElement).toBe(colorpicker.swatches[NUM_COLUMNS * 2]);

      lastColor.swatch.focus();
      colorpicker.popup.dispatchEvent(keydownArrowDown);
      expect(document.activeElement).toBe(lastColor);
    });

    test('focuses upward color-swatch on ArrowUp', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const activeColor = colorpicker.swatches[NUM_COLUMNS * 2];
      activeColor.swatch.focus();
      expect(document.activeElement).toBe(activeColor);

      const keydownArrowUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      colorpicker.popup.dispatchEvent(keydownArrowUp);
      expect(document.activeElement).toBe(colorpicker.swatches[NUM_COLUMNS]);

      colorpicker.popup.dispatchEvent(keydownArrowUp);
      expect(document.activeElement).toBe(colorpicker.swatches[0]);

      colorpicker.popup.dispatchEvent(keydownArrowUp);
      expect(document.activeElement).toBe(colorpicker.swatches[0]);
    });

    test('focuses last color-swatch on ArrowLeft when first color-swatch active', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const firstColor = colorpicker.swatches[0];
      const lastColor = colorpicker.swatches[colorpicker.swatches.length - 1];
      firstColor.swatch.focus();
      expect(document.activeElement).toBe(firstColor);

      const keydownArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      colorpicker.popup.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toBe(lastColor);
    });

    test('focuses first color-swatch on ArrowRight when last color-swatch active', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const firstColor = colorpicker.swatches[0];
      const lastColor = colorpicker.swatches[colorpicker.swatches.length - 1];
      lastColor.swatch.focus();
      expect(document.activeElement).toBe(lastColor);

      const keydownArrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      colorpicker.popup.dispatchEvent(keydownArrowRight);
      expect(document.activeElement).toBe(firstColor);
    });
  });
});
