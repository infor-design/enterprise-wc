/**
 * @jest-environment jsdom
 */
import { IdsObjectUtils as objectUtils } from '../../src/utils';

describe('IdsObjectUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('should check whether the given object is an object or not', () => {
    const obj = { field: 'test-value' };

    expect(objectUtils.isObject(obj)).toEqual(true);
    expect(objectUtils.isObject(123)).toEqual(false);
    expect(objectUtils.isObject('test')).toEqual(false);
    expect(objectUtils.isObject(['a', 'b', 'c'])).toEqual(false);
  });

  it('should check the given object is an object and NOT empty', () => {
    const obj = { field: 'test-value' };
    const objEmpty = {};

    expect(objectUtils.isObjectAndNotEmpty(obj)).toEqual(true);
    expect(objectUtils.isObjectAndNotEmpty(objEmpty)).toEqual(false);
    expect(objectUtils.isObjectAndNotEmpty(123)).toEqual(false);
    expect(objectUtils.isObjectAndNotEmpty('test')).toEqual(false);
    expect(objectUtils.isObjectAndNotEmpty(['a', 'b', 'c'])).toEqual(false);
  });
});
