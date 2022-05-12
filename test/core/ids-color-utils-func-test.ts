/**
 * @jest-environment jsdom
 */
import {
  convertColorToRgba,
  convertStatusToIDSColor
} from '../../src/utils/ids-color-utils/ids-color-utils';

describe('IdsColorUtils', () => {
  it('can convert hex colors to RGB format', () => {
    expect(convertColorToRgba('#0072ED')).toBe('rgb(0 114 237)');
  });

  it('can convert hex colors to RGBA format', () => {
    expect(convertColorToRgba('#0072ED', 0.5)).toBe('rgba(0 114 237 / 0.5)');
  });

  // @TODO learn why JSDOM doesn't convert the color the same way as the browser
  it.skip('can convert built-in colors to RGB format', () => {
    expect(convertColorToRgba('red')).toBe('rgb(255 0 0)');
  });

  // @TODO learn why JSDOM doesn't convert the color the same way as the browser
  it.skip('can convert built-in colors to RGBA format', () => {
    expect(convertColorToRgba('red', 0.5)).toBe('rgba(255 0 0 / 0.5)');
  });

  it('can convert IDS Status color codes into CSS variables containing IDS colors', () => {
    const statuses = [
      'base',
      'warning',
      'caution',
      'success'
    ];
    statuses.forEach((status) => {
      expect(convertStatusToIDSColor(status)).toBe(`var(--ids-color-status-${status})`);
    });
    expect(convertStatusToIDSColor('error')).toBe(`var(--ids-color-status-danger)`);

    // Pass over unexpected values
    expect(convertStatusToIDSColor('unexpected')).toBe('unexpected');
  });
});
