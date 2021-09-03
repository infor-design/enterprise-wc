/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/components/ids-tag/ids-tag';

let elem;

describe('IdsKeyboardMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsTag();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can watch for single hot keys', () => {
    const mockHandler = jest.fn();
    elem.listen('Enter', elem, mockHandler);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    elem.dispatchEvent(event);

    expect(mockHandler.mock.calls.length).toBe(1);
  });

  it('can will not fire if not watching', () => {
    const mockHandler = jest.fn();
    elem.listen('Enter', elem, mockHandler);

    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event);

    expect(mockHandler.mock.calls.length).toBe(0);
  });

  it('can watch for multiple hot keys in the same event', () => {
    const mockHandler = jest.fn();
    elem.listen(['Delete', 'Backpace'], elem, mockHandler);

    const event1 = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event1);

    const event2 = new KeyboardEvent('keydown', { key: 'Backpace' });
    elem.dispatchEvent(event2);

    expect(mockHandler.mock.calls.length).toBe(2);
  });

  it('can watch for pressed keys', () => {
    const mockHandler = jest.fn(() => elem.pressedKeys);
    elem.listen('Delete', elem, mockHandler);

    const event1 = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event1);

    expect(mockHandler.mock.results[0].value.size).toEqual(1);
    expect(mockHandler.mock.results[0].value.get('Delete')).toEqual(true);
  });

  it('can release unpressed keys', () => {
    const mockHandler = jest.fn();
    elem.listen('', elem, mockHandler);

    const event1 = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event1);
    expect(elem.pressedKeys.size).toEqual(1);
    expect(elem.pressedKeys.get('Delete')).toEqual(true);

    const event2 = new KeyboardEvent('keyup', { key: 'Delete' });
    elem.dispatchEvent(event2);

    expect(elem.pressedKeys.size).toEqual(0);
    expect(elem.pressedKeys.get('Delete')).toEqual(undefined);
  });

  it('can destroy', () => {
    const mockHandler = jest.fn();
    elem.listen(['Delete', 'Backpace'], elem, mockHandler);
    expect(elem.keyDownHandler).toBeTruthy();
    expect(elem.keyUpHandler).toBeTruthy();

    elem.detachAllListeners();

    expect(elem.keyDownHandler).toBeFalsy();
    expect(elem.keyUpHandler).toBeFalsy();
  });
});
