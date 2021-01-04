/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-tag/ids-tag';
import { IdsElement } from '../../src/ids-base/ids-element';
import { IdsExampleMixin as exampleMixin } from '../../src/ids-base/ids-example-mixin';
import { customElement } from '../../src/ids-base/ids-decorators';

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
    elem.cssStyles = `:host {}`;
    elem.render();
    expect(elem.shadowRoot.querySelector('style').textContent).toEqual('.ids-tag { background-color: transparent; }');

    elem.cssStyles = `::host {}`;
    elem.render();
    expect(elem.shadowRoot.querySelector('style').textContent).toEqual('.ids-tag { background-color: transparent; }');
  });

  it('can call events in a mixin', () => {
    expect(exampleMixin.prop1).toEqual('test');
    expect(exampleMixin.methodOne()).toEqual('test');
  });
});
