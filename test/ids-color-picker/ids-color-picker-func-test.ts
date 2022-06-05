/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitFor from '../helpers/wait-for';
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

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    colorpicker.remove();
    const elem: any = new IdsColorPicker();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-color-picker').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('renders with readonly', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.readonly).toBeTruthy();
  });

  it('renders with disabled', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" disabled="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.disabled).toBeTruthy();
  });

  it('renders with advanced', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" advanced="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.advanced).toBeTruthy();
    expect(colorpicker.colorInput.hasAttribute('disabled')).toBe(false);
    expect(colorpicker.colorInput.getAttribute('disabled')).toBeFalsy();
    colorpicker.advanced = false;
    expect(colorpicker.getAttribute('advanced')).toBeFalsy();
    expect(colorpicker.colorInput.hasAttribute('disabled')).toBe(true);
    expect(colorpicker.colorInput.getAttribute('disabled')).toBeTruthy();
  });

  it('has a default value of blank', () => {
    expect(colorpicker.value).toEqual('');
    expect(colorpicker.getAttribute('value')).toBeFalsy();
  });

  it('has a value attribute', () => {
    colorpicker.value = '#000000';
    expect(colorpicker.value).toEqual('#000000');
    expect(colorpicker.getAttribute('value')).toEqual('#000000');
    colorpicker.value = '';
    expect(colorpicker.value).toEqual('');
    expect(colorpicker.getAttribute('value')).toEqual('');
  });

  it('has a disabled attribute', () => {
    colorpicker.disabled = false;
    expect(colorpicker.disabled).toEqual(false);
    expect(colorpicker.hasAttribute('disabled')).toEqual(false);
    expect(colorpicker.getAttribute('disabled')).toBeFalsy();

    colorpicker.disabled = true;
    expect(colorpicker.disabled).toEqual(true);
    expect(colorpicker.getAttribute('disabled')).toEqual('true');
  });

  it('has a readonly attribute', () => {
    colorpicker.readonly = false;
    expect(colorpicker.readonly).toEqual(false);
    expect(colorpicker.hasAttribute('readonly')).toEqual(false);
    expect(colorpicker.getAttribute('readonly')).toBeFalsy();

    colorpicker.readonly = true;
    expect(colorpicker.readonly).toEqual(true);
    expect(colorpicker.getAttribute('readonly')).toEqual('true');
  });

  it('has a label attribute', () => {
    colorpicker.label = 'Ids Color Picker';
    expect(colorpicker.getAttribute('label')).toEqual('Ids Color Picker');
  });

  it('has a labels attribute', () => {
    colorpicker.suppressLabels = false;
    expect(colorpicker.suppressLabels).toEqual(false);
    expect(colorpicker.hasAttribute('suppress-labels')).toEqual(false);
    expect(colorpicker.getAttribute('suppress-labels')).toBeFalsy();

    colorpicker.suppressLabels = true;
    expect(colorpicker.suppressLabels).toEqual(true);
    expect(colorpicker.getAttribute('suppress-labels')).toEqual('true');
  });

  it('has a suppressTooltips attribute', () => {
    colorpicker.suppressTooltips = false;
    expect(colorpicker.suppressTooltips).toEqual(false);
    expect(colorpicker.hasAttribute('suppress-tooltips')).toEqual(false);
    expect(colorpicker.getAttribute('suppress-tooltips')).toBeFalsy();

    colorpicker.suppressTooltips = true;
    expect(colorpicker.suppressTooltips).toEqual(true);
    expect(colorpicker.getAttribute('suppress-tooltips')).toEqual('true');
  });

  it('suppresses lables and tooltips when IdsColorPicker.advanced is true', () => {
    expect(colorpicker.advanced).toEqual(false);
    expect(colorpicker.suppressLabels).toEqual(false);
    expect(colorpicker.suppressTooltips).toEqual(false);

    colorpicker.advanced = true;
    expect(colorpicker.advanced).toEqual(true);
    expect(colorpicker.suppressLabels).toEqual(true);
    expect(colorpicker.suppressTooltips).toEqual(true);
  });

  it('should close on outside click', () => {
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    waitFor(() => expect(colorpicker.popup.visible).toBeTruthy());
    colorpicker.onOutsideClick();
    waitFor(() => expect(colorpicker.popup.visible).toBeFalsy());
  });

  it('should not close on click outside if no onOutsideClick', () => {
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    waitFor(() => expect(colorpicker.popup.visible).toBeTruthy());
    colorpicker.addOpenEvents();
    colorpicker.onOutsideClick = null;
    colorpicker.triggerEvent('click', document.body);
    waitFor(() => expect(colorpicker.popup.visible).toBeTruthy());
  });

  it('should not open if readonly', () => {
    colorpicker.readonly = true;
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    expect(colorpicker.popup.visible).toEqual(false);
  });

  it('should be able to open with IdsColorPicker.open()', () => {
    colorpicker.open();
    expect(colorpicker.popup.visible).toEqual(true);
    expect(colorpicker.swatches).toBeTruthy();
  });

  it('should select on enter', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"><ids-color hex="#383838"></ids-color></ids-color-picker>`);
    colorpicker.popup.visible = true;
    (document.querySelector('#color-picker-1 > ids-color[hex="#383838"]') as any).focus();
    const hex: any = document.querySelector('#color-picker-1 > ids-color[hex="#383838"]');

    const enterKeyEvent = new KeyboardEvent('keydown', ({ key: 'Enter', target: hex, bubbles: true } as any));
    hex.dispatchEvent(enterKeyEvent);
    expect(colorpicker.value).toEqual('#383838');
  });

  it('should select on enter when checked', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"><ids-color hex="#999999" checked="true"></ids-color></ids-color-picker>`);
    colorpicker.popup.visible = true;
    (document.querySelector('#color-picker-1 > ids-color[hex="#999999"]') as any).focus();
    const hex: any = document.querySelector('#color-picker-1 > ids-color[hex="#999999"]');

    const enterKeyEvent = new KeyboardEvent('keydown', ({ key: 'Enter', target: hex, bubbles: true } as any));
    hex.dispatchEvent(enterKeyEvent);
    expect(colorpicker.value).toEqual('#999999');
  });

  describe('When Popup is Closed', () => {
    it('toggles popup open/close when trigger button clicked', () => {
      expect(colorpicker.popup.visible).toBe(false);
      colorpicker.triggerBtn.click();
      expect(colorpicker.popup.visible).toBe(true);
      colorpicker.triggerBtn.click();
      expect(colorpicker.popup.visible).toBe(false);
    });

    it('opens popup on Enter', () => {
      expect(colorpicker.popup.visible).toBe(false);
      const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
      colorpicker.dispatchEvent(keydownEnter);
      expect(colorpicker.popup.visible).toBe(true);
    });

    it('opens popup on ArrowDown', () => {
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

    it('closes popup on Escape', () => {
      expect(colorpicker.popup.visible).toBe(true);
      const keydownEscape = new KeyboardEvent('keydown', { key: 'Escape' });
      colorpicker.dispatchEvent(keydownEscape);
      expect(colorpicker.popup.visible).toBe(false);
    });

    it('focuses first color-swatch on open', () => {
      expect(colorpicker.popup.visible).toBe(true);
      const [swatch] = colorpicker.swatches;
      expect(document.activeElement).toBe(swatch);
    });

    it('selects focused color-swatch on Enter', () => {
      expect(colorpicker.popup.visible).toBe(true);

      colorpicker.value = '';
      expect(colorpicker.textInput.value).toBe('');

      const [swatch] = colorpicker.swatches;
      swatch.focus();
      expect(document.activeElement).toBe(swatch);

      const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
      colorpicker.dispatchEvent(keydownEnter);
      expect(colorpicker.value).toBe(swatch.hex);
      expect(colorpicker.textInput.value).toBe(swatch.hex);
    });

    it('selects focused color-swatch on Spacebar', () => {
      expect(colorpicker.popup.visible).toBe(true);

      colorpicker.value = '';
      expect(colorpicker.textInput.value).toBe('');

      const [swatch] = colorpicker.swatches;
      swatch.focus();
      expect(document.activeElement).toBe(swatch);

      const keydownSpacebar = new KeyboardEvent('keydown', { key: 'Space' });
      colorpicker.dispatchEvent(keydownSpacebar);
      expect(colorpicker.value).toBe(swatch.hex);
      expect(colorpicker.textInput.value).toBe(swatch.hex);
    });

    it('triggers change event on color-swatch IdsColorPicker.value is updated', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const changeHandler = jest.fn((evt) => {
        expect(evt.detail.elem).toBe(colorpicker);
        expect(evt.detail.value).toBe(colorpicker.value);
      });

      colorpicker.addEventListener('change', changeHandler);

      colorpicker.value = 'c';
      expect(colorpicker.value).toBe('c');
      expect(colorpicker.textInput.value).toBe('c');
      expect(changeHandler).toHaveBeenCalled();
      // expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('shows checkmark on selected color-swatch', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.value).toBe('');

      const noColorSwatch = colorpicker.querySelector('ids-color[hex=""]');
      expect(colorpicker.querySelectorAll('ids-color[checked]').length).toBe(1);
      expect(colorpicker.querySelector('ids-color[checked]')).toBe(noColorSwatch);

      const secondSwatch = colorpicker.swatches[1];
      colorpicker.value = secondSwatch.hex;
      expect(colorpicker.value).toBe(secondSwatch.hex);

      const selectedColors = colorpicker.querySelectorAll('ids-color[checked]');
      expect(selectedColors).toBeDefined();
      expect(selectedColors.length).toBe(1);
      expect(selectedColors[0].hasAttribute('checked')).toBe(true);
      expect(selectedColors[0].hex).toBe(secondSwatch.hex);
    });

    it('clears color when no-color swatch selected', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.value).toBe('');

      const noColorSwatch = colorpicker.querySelector('ids-color[hex=""]');
      expect(colorpicker.querySelectorAll('ids-color[checked]').length).toBe(1);
      expect(colorpicker.querySelector('ids-color[checked]')).toBe(noColorSwatch);

      const secondSwatch = colorpicker.swatches[1];
      colorpicker.value = secondSwatch.hex;
      expect(colorpicker.value).toBe(secondSwatch.hex);

      const selectedColors = colorpicker.querySelectorAll('ids-color[checked]');
      expect(selectedColors).toBeDefined();
      expect(selectedColors.length).toBe(1);
      expect(selectedColors[0].hasAttribute('checked')).toBe(true);
      expect(selectedColors[0].hex).toBe(secondSwatch.hex);

      noColorSwatch.dispatchEvent(new MouseEvent('click'));
      expect(colorpicker.querySelectorAll('ids-color[checked]').length).toBe(1);
      expect(colorpicker.querySelector('ids-color[checked]')).toBe(noColorSwatch);
    });

    it.todo('shows outline on when color-swatch is hovered');

    it('shows color-swatch labels when IdsColorPicker.labels is true', () => {
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

    it('shows color-swatch hex when IdsColorPicker.labels is false', () => {
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

    it('hides color-swatch tooltips when IdsColorPicker.suppressTooltips is true', () => {
      expect(colorpicker.popup.visible).toBe(true);
      expect(colorpicker.suppressTooltips).toBe(false);
      expect(colorpicker.hasAttribute('suppress-tooltips')).toBe(false);

      // hover mouse over color swatch and check that swatch.tooltip is visible
      // check that swatch.disabled is false and tooltip is visible and popuplated
      const [swatch] = colorpicker.swatches;
      expect(swatch.disabled).toBe(false);
      expect(swatch.tooltip).toBe('ruby-10');

      colorpicker.suppressTooltips = true;
      expect(colorpicker.suppressTooltips).toBe(true);
      expect(colorpicker.hasAttribute('suppress-tooltips')).toBe(true);
      expect(colorpicker.getAttribute('suppress-tooltips')).toBe('true');

      swatch.dispatchEvent(new MouseEvent('mouseover'));
      expect(swatch.popup.visible).toBe(false);
      expect(swatch.popup.innerText).toBe('');
    });

    it('shows color-swatch tooltips when IdsColorPicker.suppressTooltips is false', () => {
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

    it('focuses next color-swatch on ArrowRight', () => {
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

    it('focuses previous color-swatch on ArrowLeft', () => {
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
    it('focuses downward color-swatch on ArrowDown', () => {
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

    it('focuses upward color-swatch on ArrowUp', () => {
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

    it('focuses last color-swatch on ArrowLeft when first color-swatch active', () => {
      expect(colorpicker.popup.visible).toBe(true);

      const firstColor = colorpicker.swatches[0];
      const lastColor = colorpicker.swatches[colorpicker.swatches.length - 1];
      firstColor.swatch.focus();
      expect(document.activeElement).toBe(firstColor);

      const keydownArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      colorpicker.popup.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toBe(lastColor);
    });

    it('focuses first color-swatch on ArrowRight when last color-swatch active', () => {
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
