/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-tag/ids-tag';
import { IdsElement } from '../../src/ids-base/ids-element';
import styleMock from '../helpers/style-mock';

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

  it('replace host with name of the component when adoptedStyleSheets are not supported (mocked)', () => {
    const elem = new IdsTag();
    const expectedStyleContent = styleMock.replace(':host', `.${elem.tagName.toLowerCase()}`);
    elem.cssStyles = styleMock;
    elem.render();
    expect(elem.shadowRoot.querySelector('style').textContent).toEqual(expectedStyleContent);

    // also test with '::host' for good measure
    elem.cssStyles = styleMock.replace(`:host`, '::host');
    elem.render();

    expect(elem.shadowRoot.querySelector('style').textContent).toEqual(expectedStyleContent);
  });
});
