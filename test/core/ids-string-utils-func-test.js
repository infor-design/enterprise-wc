/**
 * @jest-environment jsdom
 */
import { IdsStringUtils } from '../../src/utils';

describe('IdsStringUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can camel case properties', () => {
    expect(IdsStringUtils.camelCase('test-me')).toEqual('testMe');
    expect(IdsStringUtils.camelCase('testxyz')).toEqual('testxyz');
  });

  it('can convert a string to boolean', () => {
    expect(IdsStringUtils.stringToBool('setting-value')).toEqual(true);
    expect(IdsStringUtils.stringToBool('false')).toEqual(false);
    expect(IdsStringUtils.stringToBool('FALSE')).toEqual(false);
    expect(IdsStringUtils.stringToBool('False')).toEqual(false);
    expect(IdsStringUtils.stringToBool('true')).toEqual(true);
    expect(IdsStringUtils.stringToBool('TRUE')).toEqual(true);
    expect(IdsStringUtils.stringToBool('True')).toEqual(true);
  });

  it('can convert a string to number or NaN', () => {
    expect(IdsStringUtils.stringToNumber('100')).toEqual(100);
    expect(IdsStringUtils.stringToNumber('test-100')).toEqual(NaN);
    expect(IdsStringUtils.stringToNumber('test')).toEqual(NaN);
    expect(IdsStringUtils.stringToNumber()).toEqual(NaN);
    expect(IdsStringUtils.stringToNumber('')).toEqual(NaN);
    expect(IdsStringUtils.stringToNumber(null)).toEqual(NaN);
  });

  it('can inject a template variable', () => {
    const obj = { field: 'test-value' };
    const template = 'Test String <b>${field}</b>'; //eslint-disable-line

    expect(IdsStringUtils.injectTemplate(template, obj)).toEqual('Test String <b>test-value</b>');
  });

  it('can test if a character is printable', () => {
    expect(IdsStringUtils.isPrintable({ key: 'Enter' })).toEqual(false);
    expect(IdsStringUtils.isPrintable({ key: 'Tab' })).toEqual(false);
    expect(IdsStringUtils.isPrintable({ key: 'Up', keyCode: 38, altKey: true })).toEqual(false);
    expect(IdsStringUtils.isPrintable({ keyCode: 65, key: 'a' })).toEqual(true);
    expect(IdsStringUtils.isPrintable({ keyCode: 90, key: 'z' })).toEqual(true);
    expect(IdsStringUtils.isPrintable({ key: 'F1', keyCode: 112 })).toEqual(false);
    expect(IdsStringUtils.isPrintable({ key: 'F12', keyCode: 123 })).toEqual(false);
  });
});
