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
});
