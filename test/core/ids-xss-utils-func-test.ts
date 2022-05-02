/**
 * @jest-environment jsdom
 */
import {
  stripTags,
  stripHTML,
  sanitizeHTML,
  sanitizeConsoleMethods,
  unescapeHTML,
  htmlEntities
} from '../../src/utils/ids-xss-utils/ids-xss-utils';

describe('IdsXssUtils tests', () => {
  it('Should white list specific html tags', () => {
    let result = stripTags('<p>Test</p> <br /><b>Test</b> <i>Test</i>', '<i><b>');

    expect(result).toEqual('Test <b>Test</b> <i>Test</i>');

    result = stripTags('<p>Test <img src="test.png" onmouseover="someFunction()">Test <i>Test</i></p>', '<p>');

    expect(result).toEqual('<p>Test Test Test</p>');

    result = stripTags('<a href=\'http://test.test.net\'>Test Test Test</a>', '<a>');

    expect(result).toEqual('<a href=\'http://test.test.net\'>Test Test Test</a>');

    result = stripTags('1 < 5 5 > 1');

    expect(result).toEqual('1 < 5 5 > 1');

    result = stripTags('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = stripTags('1 <br/> 1', '<br>');

    expect(result).toEqual('1 <br/> 1');

    result = stripTags('1 <br/> 1', '<br><br/>');

    expect(result).toEqual('1 <br/> 1');

    result = stripTags('Test <svg/onload=alert(1)> Test', '<br><br/>');

    expect(result).toEqual('Test  Test');

    result = stripTags('Test <script>alert()</script> Test', '<br><br/>');

    expect(result).toEqual('Test alert() Test');

    result = stripTags('Test <script>alert()</script> Test', '<br><br/>');

    expect(result).toEqual('Test alert() Test');

    result = stripTags('Test <s c r i p t>alert()</s c r i p t> Test', '<br><br/>');

    expect(result).toEqual('Test alert() Test');

    result = stripTags('"><script>give_me_your_credit_card()</script>', '<br><br/>');

    expect(result).toEqual('">give_me_your_credit_card()');

    // Number test
    expect(stripTags(6)).toEqual(6);
  });

  it('Should strip nested tags', () => {
    let result = stripTags('<script>alert("testing");</script>');

    expect(result).toEqual('alert("testing");');
    result = stripTags('<<a/>script<a>>alert("testing");</<a/>script<a>>');

    expect(result).toEqual('alert("testing");');

    result = stripTags('<<bold/>script<bold>>alert("testing");</<bold/>script<bold>>');

    expect(result).toEqual('alert("testing");');
  });

  it('Should remove all html tags', () => {
    let result = stripHTML('<p>Test</p> <br /><b>Test</b> <i>Test</i>');

    expect(result).toEqual('Test Test Test');

    result = stripHTML('<p>Test <img src="test.png" onmouseover="someFunction()">Test <i>Test</i></p>');

    expect(result).toEqual('Test Test Test');

    result = stripHTML('<a href=\'http://test.test.net\'>Test Test Test</a>');

    expect(result).toEqual('Test Test Test');

    result = stripHTML('1 < 5 5 > 1');

    expect(result).toEqual('1  1');

    result = stripHTML('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = stripHTML('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = stripHTML('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = stripHTML('Test <svg/onload=alert(1)> Test');

    expect(result).toEqual('Test  Test');

    result = stripHTML('Test <script>alert()</script> Test');

    expect(result).toEqual('Test alert() Test');

    result = stripHTML('Test <s c r i p t>alert()</s c r i p t> Test');

    expect(result).toEqual('Test alert() Test');

    result = stripHTML('');

    expect(result).toEqual('');
  });

  it('Should santize html tags', () => {
    let result = sanitizeHTML('<strong>hello world</strong>');
    expect(result).toEqual('<strong>hello world</strong>');

    result = sanitizeHTML('<img src=x onerror=alert(\'img\') />');
    expect(result).toEqual('<img src=x>');

    result = sanitizeHTML('<script>alert(\'hello world\')</script>');
    expect(result).toEqual('');

    result = sanitizeHTML('<script><script>alert(\'hello world\')</script></script>');
    expect(result).toEqual('');

    result = sanitizeHTML('<div title="alert(\'hello world\')"></div>');
    expect(result).toEqual('<div title="alert(\'hello world\')"></div>');

    result = sanitizeHTML('<div /onchange="alert()"></div>');
    expect(result).toEqual('<div ></div>');

    result = sanitizeHTML('<div title="/onerror=alert(\'img\')"></div>');
    expect(result).toEqual('<div title="/error=alert(\'img\')"></div>');

    result = sanitizeHTML('<div title="onerror=alert(\'img\')"></div>');
    expect(result).toEqual('<div title="onerror=alert(\'img\')"></div>');
  });

  it('Should santize console methods', () => {
    expect(sanitizeHTML('console.log')).toEqual('');
    expect(sanitizeHTML('console.log(\'hello world\')')).toEqual('');
    expect(sanitizeHTML('console.log(\'hello world\');')).toEqual('');
    expect(sanitizeHTML('console.log("hello world");')).toEqual('');
    expect(sanitizeHTML('console.log   (object);')).toEqual('');
    expect(sanitizeHTML('console.log(this);')).toEqual('');
    expect(sanitizeHTML('console.log(this);another text')).toEqual('another text');

    const methods = ['assert', 'clear', 'count', 'debug', 'dirxml', 'dir', 'error', 'exception', 'groupCollapsed', 'groupEnd', 'group', 'info', 'log', 'markTimeline', 'profileEnd', 'profile', 'table', 'timeEnd', 'timeStamp', 'time', 'trace', 'warn'];

    methods.forEach((method) => {
      expect(sanitizeHTML(`console.${method}("hello world");`)).toEqual('');
    });

    expect(sanitizeConsoleMethods([])).toEqual([]);
  });

  it('Should unescape html special characters', () => {
    expect(unescapeHTML('&#36;')).toEqual('$');
    expect(unescapeHTML('&#37;')).toEqual('%');
    expect(unescapeHTML('&#38;')).toEqual('&');
    expect(unescapeHTML('&#162;')).toEqual('¢');
    expect(unescapeHTML('&#163;')).toEqual('£');
    expect(unescapeHTML('&#169;')).toEqual('©');
    expect(unescapeHTML('&#174;')).toEqual('®');
    expect(unescapeHTML('&#8224;')).toEqual('†');
    expect(unescapeHTML('&#8226;')).toEqual('•');
    expect(unescapeHTML('&#8364;')).toEqual('€');
    expect(unescapeHTML('test')).toEqual('test');
    expect(unescapeHTML('')).toEqual('');
    expect(unescapeHTML(100)).toEqual(100);
    expect(unescapeHTML('a&#36;')).toEqual('a$');
  });

  it('Should escaped html special characters', () => {
    expect(htmlEntities('&')).toEqual('&amp;');
    expect(htmlEntities('<')).toEqual('&lt;');
    expect(htmlEntities('>')).toEqual('&gt;');
    expect(htmlEntities('"')).toEqual('&quot;');
  });
});
