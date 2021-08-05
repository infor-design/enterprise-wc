/**
 * @jest-environment jsdom
 */
import { stringUtils } from '../../src/ids-base/ids-string-utils';

describe('IdsStringUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can camel case properties', () => {
    expect(stringUtils.camelCase('test-me')).toEqual('testMe');
    expect(stringUtils.camelCase('testxyz')).toEqual('testxyz');
  });

  it('can convert a string to boolean', () => {
    expect(stringUtils.stringToBool('setting-value')).toEqual(true);
    expect(stringUtils.stringToBool('false')).toEqual(false);
    expect(stringUtils.stringToBool('FALSE')).toEqual(false);
    expect(stringUtils.stringToBool('False')).toEqual(false);
    expect(stringUtils.stringToBool('true')).toEqual(true);
    expect(stringUtils.stringToBool('TRUE')).toEqual(true);
    expect(stringUtils.stringToBool('True')).toEqual(true);
  });

  it('can convert a string to number', () => {
    expect(stringUtils.stringToNumber('100')).toEqual(100);
    expect(stringUtils.stringToNumber('test-100')).toEqual(0);
    expect(stringUtils.stringToNumber('test')).toEqual(0);
    expect(stringUtils.stringToNumber()).toEqual(0);
    expect(stringUtils.stringToNumber('')).toEqual(0);
    expect(stringUtils.stringToNumber(null)).toEqual(0);
  });

  it('can inject a template variable', () => {
    const obj = { field: 'test-value' };
    const template = 'Test String <b>${field}</b>'; //eslint-disable-line

    expect(stringUtils.injectTemplate(template, obj)).toEqual('Test String <b>test-value</b>');
  });

  it('should check whether the given object is an object or not', () => {
    const obj = { field: 'test-value' };

    expect(stringUtils.isObject(obj)).toEqual(true);
    expect(stringUtils.isObject(123)).toEqual(false);
    expect(stringUtils.isObject('test')).toEqual(false);
    expect(stringUtils.isObject(['a', 'b', 'c'])).toEqual(false);
  });

  it('should check the given object is an object and NOT empty', () => {
    const obj = { field: 'test-value' };
    const objEmpty = {};

    expect(stringUtils.isObjectAndNotEmpty(obj)).toEqual(true);
    expect(stringUtils.isObjectAndNotEmpty(objEmpty)).toEqual(false);
    expect(stringUtils.isObjectAndNotEmpty(123)).toEqual(false);
    expect(stringUtils.isObjectAndNotEmpty('test')).toEqual(false);
    expect(stringUtils.isObjectAndNotEmpty(['a', 'b', 'c'])).toEqual(false);
  });
});
