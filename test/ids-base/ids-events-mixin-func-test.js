/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-tag/ids-tag';

let elem;

describe('IdsEventsMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsTag();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can dispatchEvents to addEventListener', () => {
    const mockHandler = jest.fn();
    elem.addEventListener('customtest', mockHandler);
    elem.triggerEvent('customtest', elem);
    expect(mockHandler.mock.calls.length).toBe(1);
  });

  it('can attach and remove events with a namespace', () => {
    const mockHandlerNormal = jest.fn();
    const mockHandlerNS = jest.fn();

    elem.onEvent('click', elem, mockHandlerNormal);
    elem.onEvent('click.doop', elem, mockHandlerNS);
    elem.triggerEvent('click', elem);

    expect(mockHandlerNormal.mock.calls.length).toBe(1);
    expect(mockHandlerNS.mock.calls.length).toBe(1);

    elem.offEvent('click.doop', elem);
    elem.triggerEvent('click', elem);

    expect(mockHandlerNormal.mock.calls.length).toBe(2);
    expect(mockHandlerNS.mock.calls.length).toBe(1);
  });
});
