/**
 * @jest-environment jsdom
 */

import IdsColorPicker from '../../src/ids-color-picker/ids-color-picker';

describe('Ids Color Picker Component', () => {
  let colorpicker;
  beforeEach(async () => {
    colorpicker = new IdsColorPicker();
    document.body.appendChild(colorpicker);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    colorpicker = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    colorpicker.remove();
    const elem = new IdsColorPicker();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-color-picker').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('has a value attribute', () => {
    colorpicker.value = '#000000';
    expect(colorpicker.getAttribute('value')).toEqual('#000000');
  });

  it('has a disabled attribute', () => {
    colorpicker.disabled = false;
    expect(colorpicker.getAttribute('disabled')).toEqual(null);

    colorpicker.disabled = true;
    expect(colorpicker.getAttribute('disabled')).toEqual('true');
  });

  it('has a readonly attribute', () => {
    colorpicker.readonly = false;
    expect(colorpicker.getAttribute('readonly')).toEqual('false');

    colorpicker.readonly = true;
    expect(colorpicker.getAttribute('readonly')).toEqual('true');
  });

  it('has a swatch attribute', () => {
    colorpicker.swatch = 'true';
    expect(colorpicker.getAttribute('swatch')).toEqual('true');
  });

  it('has a label attribute', () => {
    colorpicker.label = 'Ids Color Picker';
    expect(colorpicker.getAttribute('label')).toEqual('Ids Color Picker');
  });
});
