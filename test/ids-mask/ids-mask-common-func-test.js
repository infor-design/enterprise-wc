import { convertPatternFromString } from '../../src/components/ids-mask/ids-mask-common';

describe('Ids Mask (common API)', () => {
  it('can convert a string-based pattern to a Javascript array', () => {
    let arr = convertPatternFromString('["(", /[1-9]/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]');

    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr.length).toBe(14);
    expect(arr[0]).toBe('(');

    arr = undefined;

    // NOTE: Need to detect both types of quotes
    // eslint-disable-next-line
    arr = convertPatternFromString("['(', /[1-9]/, /\\d/, /\\d/, ')', ' ', /\\d/, /\\d/, /\\d/, '-', /\\d/, /\\d/, /\\d/, /\\d/]");

    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr.length).toBe(14);
    expect(arr[0]).toBe('(');
  });

  it('cannot convert invalid patterns', () => {
    let arr = convertPatternFromString(5);

    expect(arr).toBeUndefined();

    arr = convertPatternFromString('');

    expect(arr).toBeUndefined();

    // Add more types of input eventually, but make this pass all code paths
    arr = convertPatternFromString('A');

    expect(arr).toBeUndefined();
  });
});
