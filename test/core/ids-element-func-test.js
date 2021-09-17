/**
 * @jest-environment jsdom
 */
import { EventEmitter } from 'puppeteer';
import IdsTag from '../../src/components/ids-tag/ids-tag';
import { IdsElement } from '../../src/core/ids-element';
import styleMock from '../helpers/style-mock';

describe('IdsElement Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can fall back to appending styles (mocked)', () => {
    const elem = new IdsTag();

    window.CSSStyleSheet = function CSSStyleSheet() { //eslint-disable-line
      return { cssRules: [], replaceSync: () => '' };
    };

    elem.shadowRoot.adoptedStyleSheets = () => {};

    elem.hasStyles = false;
    elem.render();
    expect(elem.shadowRoot.adoptedStyleSheets[0].cssRules).toBeTruthy();
  });

  it('replace host with name of the component when adoptedStyleSheets are not supported (mocked)', () => {
    const elem = new IdsTag();
    const expectedStyleContent = styleMock.replace(':host', `.${elem.tagName.toLowerCase()}`);
    elem.cssStyles = styleMock;
    elem.hasStyles = false;
    elem.render();
    expect(elem.shadowRoot.querySelector('style').textContent).toEqual(expectedStyleContent);

    // also test with '::host' for good measure
    elem.cssStyles = styleMock.replace(`:host`, '::host');
    elem.hasStyles = false;
    elem.render();

    expect(elem.shadowRoot.querySelector('style').textContent).toEqual(expectedStyleContent);

    // add coverage where there is pre-formatted styles
    elem.cssStyles = expectedStyleContent;
    elem.hasStyles = false;
    elem.render();
    expect(elem.shadowRoot.querySelector('style').textContent).toEqual(expectedStyleContent);
  });

  it('detaches an invalid event name without affecting existing events', () => {
    const elem = new IdsTag();
    const prevHandledEventsSize = elem.handledEvents.size;
    elem.detachEventsByName(123);
    expect(elem.handledEvents.size).toEqual(prevHandledEventsSize);
  });

  it('skips render if no template', () => {
    const elem = new IdsTag();
    elem.template = null;

    const mockCallback = jest.fn();
    elem.rendered = mockCallback;
    elem.render();
    expect(mockCallback.mock.calls.length).toBe(0);
  });
});
