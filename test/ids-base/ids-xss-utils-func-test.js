/**
 * @jest-environment jsdom
 */
import { IdsXssUtils } from '../../src/utils/ids-xss-utils';

describe('IdsXssUtils tests', () => {
  it('Should white list specific html tags', () => {
    let result = IdsXssUtils.stripTags('<p>Test</p> <br /><b>Test</b> <i>Test</i>', '<i><b>');

    expect(result).toEqual('Test <b>Test</b> <i>Test</i>');

    result = IdsXssUtils.stripTags('<p>Test <img src="test.png" onmouseover="someFunction()">Test <i>Test</i></p>', '<p>');

    expect(result).toEqual('<p>Test Test Test</p>');

    result = IdsXssUtils.stripTags('<a href=\'http://test.test.net\'>Test Test Test</a>', '<a>');

    expect(result).toEqual('<a href=\'http://test.test.net\'>Test Test Test</a>');

    result = IdsXssUtils.stripTags('1 < 5 5 > 1');

    expect(result).toEqual('1 < 5 5 > 1');

    result = IdsXssUtils.stripTags('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = IdsXssUtils.stripTags('1 <br/> 1', '<br>');

    expect(result).toEqual('1 <br/> 1');

    result = IdsXssUtils.stripTags('1 <br/> 1', '<br><br/>');

    expect(result).toEqual('1 <br/> 1');

    result = IdsXssUtils.stripTags('Test <svg/onload=alert(1)> Test', '<br><br/>');

    expect(result).toEqual('Test  Test');

    result = IdsXssUtils.stripTags('Test <script>alert()</script> Test', '<br><br/>');

    expect(result).toEqual('Test alert() Test');

    result = IdsXssUtils.stripTags('Test <script>alert()</script> Test', '<br><br/>');

    expect(result).toEqual('Test alert() Test');

    result = IdsXssUtils.stripTags('Test <s c r i p t>alert()</s c r i p t> Test', '<br><br/>');

    expect(result).toEqual('Test alert() Test');

    result = IdsXssUtils.stripTags('"><script>give_me_your_credit_card()</script>', '<br><br/>');

    expect(result).toEqual('">give_me_your_credit_card()');

    // Number test
    expect(IdsXssUtils.stripTags(6)).toEqual(6);
  });

  it('Should strip nested tags', () => {
    let result = IdsXssUtils.stripTags('<script>alert("testing");</script>');

    expect(result).toEqual('alert("testing");');
    result = IdsXssUtils.stripTags('<<a/>script<a>>alert("testing");</<a/>script<a>>');

    expect(result).toEqual('alert("testing");');

    result = IdsXssUtils.stripTags('<<bold/>script<bold>>alert("testing");</<bold/>script<bold>>');

    expect(result).toEqual('alert("testing");');
  });

  it('Should remove all html tags', () => {
    let result = IdsXssUtils.stripHTML('<p>Test</p> <br /><b>Test</b> <i>Test</i>');

    expect(result).toEqual('Test Test Test');

    result = IdsXssUtils.stripHTML('<p>Test <img src="test.png" onmouseover="someFunction()">Test <i>Test</i></p>');

    expect(result).toEqual('Test Test Test');

    result = IdsXssUtils.stripHTML('<a href=\'http://test.test.net\'>Test Test Test</a>');

    expect(result).toEqual('Test Test Test');

    result = IdsXssUtils.stripHTML('1 < 5 5 > 1');

    expect(result).toEqual('1  1');

    result = IdsXssUtils.stripHTML('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = IdsXssUtils.stripHTML('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = IdsXssUtils.stripHTML('1 <br/> 1');

    expect(result).toEqual('1  1');

    result = IdsXssUtils.stripHTML('Test <svg/onload=alert(1)> Test');

    expect(result).toEqual('Test  Test');

    result = IdsXssUtils.stripHTML('Test <script>alert()</script> Test');

    expect(result).toEqual('Test alert() Test');

    result = IdsXssUtils.stripHTML('Test <s c r i p t>alert()</s c r i p t> Test');

    expect(result).toEqual('Test alert() Test');

    result = IdsXssUtils.stripHTML('');

    expect(result).toEqual('');
  });

  it('Should santize html tags', () => {
    let result = IdsXssUtils.sanitizeHTML('<strong>hello world</strong>');

    expect(result).toEqual('<strong>hello world</strong>');

    result = IdsXssUtils.sanitizeHTML('<img src=x onerror=alert(\'img\') />');

    expect(result).toEqual('<img src=x>');

    result = IdsXssUtils.sanitizeHTML('<script>alert(\'hello world\')</script>');

    expect(result).toEqual('');

    result = IdsXssUtils.sanitizeHTML('<script><script>alert(\'hello world\')</script></script>');

    expect(result).toEqual('');
  });

  it('Should santize console methods', () => {
    expect(IdsXssUtils.sanitizeHTML('console.log')).toEqual('');
    expect(IdsXssUtils.sanitizeHTML('console.log(\'hello world\')')).toEqual('');
    expect(IdsXssUtils.sanitizeHTML('console.log(\'hello world\');')).toEqual('');
    expect(IdsXssUtils.sanitizeHTML('console.log("hello world");')).toEqual('');
    expect(IdsXssUtils.sanitizeHTML('console.log   (object);')).toEqual('');
    expect(IdsXssUtils.sanitizeHTML('console.log(this);')).toEqual('');
    expect(IdsXssUtils.sanitizeHTML('console.log(this);another text')).toEqual('another text');

    const methods = ['assert', 'clear', 'count', 'debug', 'dirxml', 'dir', 'error', 'exception', 'groupCollapsed', 'groupEnd', 'group', 'info', 'log', 'markTimeline', 'profileEnd', 'profile', 'table', 'timeEnd', 'timeStamp', 'time', 'trace', 'warn'];

    methods.forEach((method) => {
      expect(IdsXssUtils.sanitizeHTML(`console.${method}("hello world");`)).toEqual('');
    });
  });
});
