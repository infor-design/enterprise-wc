/**
 * @jest-environment jsdom
 */
import { isObject, isObjectAndNotEmpty } from '../../src/utils/ids-object-utils/ids-object-utils';

describe('IdsObjectUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('should check whether the given object is an object or not', () => {
    const obj = { field: 'test-value' };

    expect(isObject(obj)).toEqual(true);
    expect(isObject(123)).toEqual(false);
    expect(isObject('test')).toEqual(false);
    expect(isObject(['a', 'b', 'c'])).toEqual(false);
  });

  it('should check the given object is an object and NOT empty', () => {
    const obj = { field: 'test-value' };
    const objEmpty = {};

    expect(isObjectAndNotEmpty(obj)).toEqual(true);
    expect(isObjectAndNotEmpty(objEmpty)).toEqual(false);
    expect(isObjectAndNotEmpty(123)).toEqual(false);
    expect(isObjectAndNotEmpty('test')).toEqual(false);
    expect(isObjectAndNotEmpty(['a', 'b', 'c'])).toEqual(false);
  });
});
