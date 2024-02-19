/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/components/ids-tag/ids-tag';
import '../../src/core/ids-element';

describe('IdsElement Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('detaches an invalid event name without affecting existing events', () => {
    const elem: any = new IdsTag();
    const prevHandledEventsSize = elem.handledEvents.size;
    elem.detachEventsByName(123);
    expect(elem.handledEvents.size).toEqual(prevHandledEventsSize);
  });

  test('skips render if no template', () => {
    const elem: any = new IdsTag();
    elem.template = null;

    const mockCallback = jest.fn();
    elem.rendered = mockCallback;
    elem.render();
    expect(mockCallback.mock.calls.length).toBe(0);
  });

  test('if no styles sets the container', () => {
    const elem: any = new IdsTag();
    document.body.appendChild(elem);
    expect(elem.container.nodeName).toBe('SPAN');
    elem.shadowRoot.querySelector('style').remove();
    elem.name = null;
    elem.container = null;
    elem.render(true);
    expect(elem.container.nodeName).toEqual('SPAN');
  });

  test('can find the nonce', () => {
    const elem = new IdsTag();
    expect(elem.nonce).toEqual('0a59a005');
    (document as any).nonce = '0a59a001';
    expect(elem.nonce).toEqual('0a59a001');

    (document as any).nonce = undefined;
    const nonce = document.createElement('meta');
    nonce.setAttribute('http-equiv', 'Content-Security-Policy');
    nonce.setAttribute('content', `script-src 'self';
    style-src 'self' https://fonts.googleapis.com 'nonce-0a59a005';
    font-src 'self' data: https://fonts.gstatic.com;`);
    document.head.appendChild(nonce);

    expect(elem.nonce).toEqual('0a59a005');

    (document as any).nonce = undefined;
    nonce.setAttribute('content', `default-src 'self'; img-src https://*; child-src 'none';`);
    expect(elem.nonce).toEqual('0a59a005');
  });
});
