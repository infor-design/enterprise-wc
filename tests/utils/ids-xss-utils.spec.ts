import { expect } from '@playwright/test';
import { test, runFunction } from '../base-fixture';

test.describe('IdsXssUtils tests', () => {
  const url = '/ids-demo-app/utils.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('should white list specific html tags', async ({ page }) => {
    expect(await runFunction(page, 'stripTags', '<p>Test</p> <br /><b>Test</b> <i>Test</i>', '<i><b>')).toEqual('Test <b>Test</b> <i>Test</i>');
    expect(await runFunction(page, 'stripTags', '<p>Test <img src="test.png" onmouseover="someFunction()">Test <i>Test</i></p>', '<p>')).toEqual('<p>Test Test Test</p>');
    expect(await runFunction(page, 'stripTags', '<a href=\'http://test.test.net\'>Test Test Test</a>', '<a>')).toEqual('<a href=\'http://test.test.net\'>Test Test Test</a>');
    expect(await runFunction(page, 'stripTags', '1 < 5 5 > 1')).toEqual('1 < 5 5 > 1');
    expect(await runFunction(page, 'stripTags', '1 <br/> 1')).toEqual('1  1');
    expect(await runFunction(page, 'stripTags', '1 <br/> 1', '<br>')).toEqual('1 <br/> 1');
    expect(await runFunction(page, 'stripTags', '1 <br/> 1', '<br><br/>')).toEqual('1 <br/> 1');
    expect(await runFunction(page, 'stripTags', 'Test <svg/onload=alert(1)> Test', '<br><br/>')).toEqual('Test  Test');
    expect(await runFunction(page, 'stripTags', 'Test <script>alert()</script> Test', '<br><br/>')).toEqual('Test alert() Test');
    expect(await runFunction(page, 'stripTags', 'Test <script>alert()</script> Test', '<br><br/>')).toEqual('Test alert() Test');
    expect(await runFunction(page, 'stripTags', 'Test <s c r i p t>alert()</s c r i p t> Test', '<br><br/>')).toEqual('Test alert() Test');
    expect(await runFunction(page, 'stripTags', '"><script>give_me_your_credit_card()</script>', '<br><br/>')).toEqual('">give_me_your_credit_card()');

    // Number test
    expect(await runFunction(page, 'stripTags', 6)).toEqual(6);
  });

  test('should strip nested tags', async ({ page }) => {
    expect(await runFunction(page, 'stripTags', '<script>alert("testing");</script>')).toEqual('alert("testing");');
    expect(await runFunction(page, 'stripTags', '<<a/>script<a>>alert("testing");</<a/>script<a>>')).toEqual('alert("testing");');
    expect(await runFunction(page, 'stripTags', '<<bold/>script<bold>>alert("testing");</<bold/>script<bold>>')).toEqual('alert("testing");');
  });

  test('should remove all html tags', async ({ page }) => {
    expect(await runFunction(page, 'stripHTML', '<p>Test</p> <br /><b>Test</b> <i>Test</i>')).toEqual('Test Test Test');
    expect(await runFunction(page, 'stripHTML', '<p>Test <img src="test.png" onmouseover="someFunction()">Test <i>Test</i></p>')).toEqual('Test Test Test');
    expect(await runFunction(page, 'stripHTML', '<a href=\'http://test.test.net\'>Test Test Test</a>')).toEqual('Test Test Test');
    expect(await runFunction(page, 'stripHTML', '1 < 5 5 > 1')).toEqual('1  1');
    expect(await runFunction(page, 'stripHTML', '1 <br/> 1')).toEqual('1  1');
    expect(await runFunction(page, 'stripHTML', 'Test <svg/onload=alert(1)> Test')).toEqual('Test  Test');
    expect(await runFunction(page, 'stripHTML', 'Test <script>alert()</script> Test')).toEqual('Test alert() Test');
    expect(await runFunction(page, 'stripHTML', 'Test <s c r i p t>alert()</s c r i p t> Test')).toEqual('Test alert() Test');
    expect(await runFunction(page, 'stripHTML', '')).toEqual('');
  });

  test('should santize html tags', async ({ page }) => {
    expect(await runFunction(page, 'sanitizeHTML', '<strong>hello world</strong>')).toEqual('<strong>hello world</strong>');
    expect(await runFunction(page, 'sanitizeHTML', '<img src=x onerror=alert(\'img\') />')).toEqual('<img src=x>');
    expect(await runFunction(page, 'sanitizeHTML', '<script>alert(\'hello world\')</script>')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', '<script><script>alert(\'hello world\')</script></script>')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', '<div title="alert(\'hello world\')"></div>')).toEqual('<div title="alert(\'hello world\')"></div>');
    expect(await runFunction(page, 'sanitizeHTML', '<div /onchange="alert()"></div>')).toEqual('<div ></div>');
    expect(await runFunction(page, 'sanitizeHTML', '<div title="/onerror=alert(\'img\')"></div>')).toEqual('<div title="/error=alert(\'img\')"></div>');
    expect(await runFunction(page, 'sanitizeHTML', '<div title="onerror=alert(\'img\')"></div>')).toEqual('<div title="onerror=alert(\'img\')"></div>');
    expect(await runFunction(page, 'sanitizeHTML', '<div title="test"></div>')).toEqual('<div title="test"></div>');
    expect(await runFunction(page, 'sanitizeHTML', '<div></div>')).toEqual('<div></div>');
  });

  test('should santize console methods', async ({ page }) => {
    expect(await runFunction(page, 'sanitizeHTML', 'console.log')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', 'console.log(\'hello world\')')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', 'console.log(\'hello world\');')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', 'console.log("hello world");')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', 'console.log   (object);')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', 'console.log(this);')).toEqual('');
    expect(await runFunction(page, 'sanitizeHTML', 'console.log(this);another text')).toEqual('another text');

    const methods = ['assert', 'clear', 'count', 'debug', 'dirxml', 'dir', 'error', 'exception', 'groupCollapsed', 'groupEnd', 'group', 'info', 'log', 'markTimeline', 'profileEnd', 'profile', 'table', 'timeEnd', 'timeStamp', 'time', 'trace', 'warn'];

    methods.forEach(async (method) => {
      expect(await runFunction(page, 'sanitizeHTML', `console.${method}("hello world");`)).toEqual('');
    });

    expect(([])).toEqual([]);
    expect(await runFunction(page, 'sanitizeConsoleMethods', [])).toEqual([]);
  });

  test('should unescape html special characters', async ({ page }) => {
    expect(await runFunction(page, 'unescapeHTML', '&#36;')).toEqual('$');
    expect(await runFunction(page, 'unescapeHTML', '&#37;')).toEqual('%');
    expect(await runFunction(page, 'unescapeHTML', '&#38;')).toEqual('&');
    expect(await runFunction(page, 'unescapeHTML', '&#162;')).toEqual('¢');
    expect(await runFunction(page, 'unescapeHTML', '&#163;')).toEqual('£');
    expect(await runFunction(page, 'unescapeHTML', '&#169;')).toEqual('©');
    expect(await runFunction(page, 'unescapeHTML', '&#174;')).toEqual('®');
    expect(await runFunction(page, 'unescapeHTML', '&#8224;')).toEqual('†');
    expect(await runFunction(page, 'unescapeHTML', '&#8226;')).toEqual('•');
    expect(await runFunction(page, 'unescapeHTML', '&#8364;')).toEqual('€');
    expect(await runFunction(page, 'unescapeHTML', 'test')).toEqual('test');
    expect(await runFunction(page, 'unescapeHTML', '')).toEqual('');
    expect(await runFunction(page, 'unescapeHTML', 100)).toEqual(100);
    expect(await runFunction(page, 'unescapeHTML', 'a&#36;')).toEqual('a$');
  });

  test('should escape html special characters', async ({ page }) => {
    expect(await runFunction(page, 'escapeHTML', '&')).toEqual('&amp;');
    expect(await runFunction(page, 'escapeHTML', '<')).toEqual('&lt;');
    expect(await runFunction(page, 'escapeHTML', '>')).toEqual('&gt;');
    expect(await runFunction(page, 'escapeHTML', '"')).toEqual('&quot;');
    expect(await runFunction(page, 'escapeHTML', '\'')).toEqual('&#039;');
    expect(await runFunction(page, 'escapeHTML', '\\')).toEqual('&bsol;');
    expect(await runFunction(page, 'escapeHTML', '')).toEqual('');
    expect(await runFunction(page, 'escapeHTML', undefined)).toEqual('');
  });
});
