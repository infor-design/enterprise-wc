/**
 * @jest-environment jsdom
 */
import { IdsEventsMixin } from '../../src/ids-base/ids-events-mixin';
import IdsTag from '../../src/ids-tag/ids-tag';

let elem;

describe('IdsEventsMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsTag();
    document.body.appendChild(elem);
    elem.events = new IdsEventsMixin();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can dispatchEvents', () => {
    const mockHandler = jest.fn();
    elem.addEventListener('customtest', mockHandler);
    elem.events.dispatchEvent('customtest', elem);
    expect(mockHandler.mock.calls.length).toBe(1);
  });

  it('can attach and remove events with a namespace', () => {
    const mockHandlerNormal = jest.fn();
    const mockHandlerNS = jest.fn();

    elem.events.addEventListener('click', elem, mockHandlerNormal);
    elem.events.addEventListener('click.doop', elem, mockHandlerNS);
    elem.events.dispatchEvent('click', elem);

    expect(mockHandlerNormal.mock.calls.length).toBe(1);
    expect(mockHandlerNS.mock.calls.length).toBe(1);

    elem.events.removeEventListener('click.doop', elem);
    elem.events.dispatchEvent('click', elem);

    expect(mockHandlerNormal.mock.calls.length).toBe(2);
    expect(mockHandlerNS.mock.calls.length).toBe(1);
  });
});
