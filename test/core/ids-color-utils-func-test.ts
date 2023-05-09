/**
 * @jest-environment jsdom
 */
import {
  colorNameToRgba
} from '../../src/utils/ids-color-utils/ids-color-utils';

describe('IdsColorUtils', () => {
  it('can convert hex colors to RGB format', () => {
    expect(colorNameToRgba('#0072ED')).toBe('rgb(0 114 237)');
  });

  it('can convert hex colors to RGBA format', () => {
    expect(colorNameToRgba('#0072ED', 0.5)).toBe('rgba(0 114 237 / 0.5)');
  });

  // @TODO learn why JSDOM doesn't convert the color the same way as the browser
  it.skip('can convert built-in colors to RGB format', () => {
    expect(colorNameToRgba('red')).toBe('rgb(255 0 0)');
  });
});
