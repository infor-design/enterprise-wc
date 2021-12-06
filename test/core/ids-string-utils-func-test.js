/**
 * @jest-environment jsdom
 */
import {
  camelCase,
  stringToBool,
  stringToNumber,
  injectTemplate,
  isPrintable
} from '../../src/utils/ids-string-utils/ids-string-utils';

describe('IdsStringUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can camel case properties', () => {
    expect(camelCase('test-me')).toEqual('testMe');
    expect(camelCase('testxyz')).toEqual('testxyz');
  });

  it('can convert a string to boolean', () => {
    expect(stringToBool('setting-value')).toEqual(true);
    expect(stringToBool('false')).toEqual(false);
    expect(stringToBool('FALSE')).toEqual(false);
    expect(stringToBool('False')).toEqual(false);
    expect(stringToBool('true')).toEqual(true);
    expect(stringToBool('TRUE')).toEqual(true);
    expect(stringToBool('True')).toEqual(true);
  });

  it('can convert a string to number or NaN', () => {
    expect(stringToNumber('100')).toEqual(100);
    expect(stringToNumber('test-100')).toEqual(NaN);
    expect(stringToNumber('test')).toEqual(NaN);
    expect(stringToNumber()).toEqual(NaN);
    expect(stringToNumber('')).toEqual(NaN);
    expect(stringToNumber(null)).toEqual(NaN);
  });

  it('can inject a template variable', () => {
    const obj = { field: 'test-value' };
    const template = 'Test String <b>${field}</b>'; //eslint-disable-line

    expect(injectTemplate(template, obj)).toEqual('Test String <b>test-value</b>');
  });

  it('can test if a character is printable', () => {
    expect(isPrintable({ key: 'Enter' })).toEqual(false);
    expect(isPrintable({ key: 'Tab' })).toEqual(false);
    expect(isPrintable({ key: 'Up', keyCode: 38, altKey: true })).toEqual(false);
    expect(isPrintable({ keyCode: 65, key: 'a' })).toEqual(true);
    expect(isPrintable({ keyCode: 90, key: 'z' })).toEqual(true);
    expect(isPrintable({ key: 'F1', keyCode: 112 })).toEqual(false);
    expect(isPrintable({ key: 'F12', keyCode: 123 })).toEqual(false);
  });
});
