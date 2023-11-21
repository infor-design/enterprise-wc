import { expect } from '@playwright/test';
import { test, runFunction } from '../base-fixture';

test.describe('IdsStringUtils tests', () => {
  const url = '/ids-demo-app/utils.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('can camel case properties', async ({ page }) => {
    expect(await runFunction(page, 'camelCase', 'i-am-camel')).toEqual('iAmCamel');
    expect(await runFunction(page, 'camelCase', 'test-me')).toEqual('testMe');
    expect(await runFunction(page, 'camelCase', 'testxyz')).toEqual('testxyz');
  });

  test('can kebab case properties', async ({ page }) => {
    expect(await runFunction(page, 'kebabCase', 'isCamel')).toEqual('is-camel');
    expect(await runFunction(page, 'kebabCase', 'testMe')).toEqual('test-me');
    expect(await runFunction(page, 'kebabCase', 'testxyz')).toEqual('testxyz');
  });

  test('can convert a string to number or NaN', async ({ page }) => {
    expect(await runFunction(page, 'stringToNumber', 100)).toEqual(100);
    expect(await runFunction(page, 'stringToNumber', 'test-100')).toEqual(NaN);
    expect(await runFunction(page, 'stringToNumber', 'test')).toEqual(NaN);
    expect(await runFunction(page, 'stringToNumber', null)).toEqual(NaN);
    expect(await runFunction(page, 'stringToNumber', '')).toEqual(NaN);
    expect(await runFunction(page, 'stringToNumber', undefined)).toEqual(NaN);
  });

  test('can convert a string to boolean', async ({ page }) => {
    expect(await runFunction(page, 'stringToBool', 'setting-value')).toEqual(true);
    expect(await runFunction(page, 'stringToBool', 'false')).toEqual(false);
    expect(await runFunction(page, 'stringToBool', 'FALSE')).toEqual(false);
    expect(await runFunction(page, 'stringToBool', 'False')).toEqual(false);
    expect(await runFunction(page, 'stringToBool', 'true')).toEqual(true);
    expect(await runFunction(page, 'stringToBool', 'TRUE')).toEqual(true);
  });

  test('can inject a template variable', async ({ page }) => {
    const obj: any = { field: 'test-value' };
    const template = 'Test String <b>${field}</b>'; //eslint-disable-line

    expect(await runFunction(page, 'injectTemplate', template, obj)).toEqual('Test String <b>test-value</b>');

    const obj2: any = { field: { depth1: 'test-value-depth-1' } };
    const template2 = 'Test String <b>${field.depth1}</b>'; //eslint-disable-line

    expect(await runFunction(page, 'injectTemplate', template2, obj2)).toEqual('Test String <b>test-value-depth-1</b>');

    const obj3: any = { field: { depth1: { depth2: 'test-value-depth-2' } } };
    const template3 = 'Test String <b>${field.depth1.depth2}</b>'; //eslint-disable-line

    expect(await runFunction(page, 'injectTemplate', template3, obj3)).toEqual('Test String <b>test-value-depth-2</b>');
  });

  test('can test if a character is printable', async ({ page }) => {
    expect(await runFunction(page, 'isPrintable', { key: 'Enter' })).toEqual(false);
    expect(await runFunction(page, 'isPrintable', { key: 'Tab' })).toEqual(false);
    expect(await runFunction(page, 'isPrintable', { key: 'Up', keyCode: 38, altKey: true })).toEqual(false);
    expect(await runFunction(page, 'isPrintable', { keyCode: 65, key: 'a' })).toEqual(true);
    expect(await runFunction(page, 'isPrintable', { keyCode: 90, key: 'z' })).toEqual(true);
    expect(await runFunction(page, 'isPrintable', { key: 'F1', keyCode: 112 })).toEqual(false);
    expect(await runFunction(page, 'isPrintable', { key: 'F12', keyCode: 123 })).toEqual(false);
  });

  test('should escape RegExp special characters', async ({ page }) => {
    expect(await runFunction(page, 'escapeRegExp', '+')).toEqual('\\+');
    expect(await runFunction(page, 'escapeRegExp', '*')).toEqual('\\*');
    expect(await runFunction(page, 'escapeRegExp', '|')).toEqual('\\|');
    expect(await runFunction(page, 'escapeRegExp', '^')).toEqual('\\^');
    expect(await runFunction(page, 'escapeRegExp', '?')).toEqual('\\?');
  });
});
