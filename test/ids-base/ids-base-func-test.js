/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-tag/ids-tag';
import { IdsElement } from '../../src/ids-base/ids-element';
import { IdsStringUtilsMixin as stringUtils } from '../../src/ids-base/ids-string-utils-mixin';

describe('IdsBase Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can fall back to appending styles (mocked)', () => {
    const elem = new IdsTag();

    window.CSSStyleSheet = function CSSStyleSheet() { //eslint-disable-line
      return { cssRules: [], replaceSync: () => '' };
    };

    elem.shadowRoot.adoptedStyleSheets = () => {};

    elem.render();
    expect(elem.shadowRoot.adoptedStyleSheets[0].cssRules).toBeTruthy();
  });

  it('can camel case properties', () => {
    expect(stringUtils.camelCase('test-me')).toEqual('testMe');
    expect(stringUtils.camelCase('testxyz')).toEqual('testxyz');
  });
});
