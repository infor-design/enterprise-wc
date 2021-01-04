/**
 * @jest-environment jsdom
 */
import { IdsStringUtilsMixin as stringUtils } from '../../src/ids-base/ids-string-utils-mixin';

describe('IdsStringUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can camel case properties', () => {
    expect(stringUtils.camelCase('test-me')).toEqual('testMe');
    expect(stringUtils.camelCase('testxyz')).toEqual('testxyz');
  });

  it('can convert a string to boolean', () => {
    expect(stringUtils.stringToBool('false')).toEqual(false);
    expect(stringUtils.stringToBool('FALSE')).toEqual(false);
    expect(stringUtils.stringToBool('False')).toEqual(false);
    expect(stringUtils.stringToBool('true')).toEqual(true);
    expect(stringUtils.stringToBool('TRUE')).toEqual(true);
    expect(stringUtils.stringToBool('True')).toEqual(true);
  });

  it('can inject a template variable', () => {
    const obj = { field: 'test-value' };
    const template = 'Test String <b>${field}</b>'; //eslint-disable-line

    expect(stringUtils.injectTemplate(template, obj)).toEqual('Test String <b>test-value</b>');
  });
});
