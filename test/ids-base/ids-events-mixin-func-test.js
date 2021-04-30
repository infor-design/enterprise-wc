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

  it('should not error on null target', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.onEvent('click', null, null);
    elem.onEvent('click.foo', undefined, undefined);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can attach longpress events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('longpress', elem, mockHandler);
    elem.triggerEvent('touchstart', elem);
    expect(mockHandler.mock.calls.length).toBe(0);
    expect(elem.longPressOn).toBe(true);
  });

  it('can Detach longpress events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('longpress', elem, mockHandler);
    expect(elem.longPressOn).toBe(true);
    elem.offEvent('longpress', elem);
    elem.triggerEvent('touchstart', elem);
    expect(mockHandler.mock.calls.length).toBe(0);
    expect(elem.longPressOn).toBe(false);
  });

  it('can attach keyboardfocus events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('keyboardfocus', elem, mockHandler);
    elem.triggerEvent('click', elem);
    elem.triggerEvent('keypress', elem);
    expect(elem.keyboardFocusOn).toBe(true);
  });

  it('can Detach keyboardfocus events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('keyboardfocus', elem, mockHandler);
    expect(elem.keyboardFocusOn).toBe(true);
    elem.offEvent('keyboardfocus', elem);
    elem.triggerEvent('keypress', elem);
    elem.triggerEvent('click', elem);
    expect(mockHandler.mock.calls.length).toBe(0);
    expect(elem.keyboardFocusOn).toBe(false);
  });

  it('can attach hoverend events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('hoverend', elem, mockHandler);
    elem.triggerEvent('mouseenter', elem);
    expect(elem.hoverEndOn).toBe(true);
  });

  it('can cancel on hoverend events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('hoverend', elem, mockHandler);
    elem.triggerEvent('mouseenter', elem);
    elem.triggerEvent('mouseleave', elem);
    elem.triggerEvent('click', elem);
    expect(elem.hoverEndOn).toBe(true);
    expect(mockHandler.mock.calls.length).toBe(0);
  });

  it('can Detach hoverend events', () => {
    const mockHandler = jest.fn();
    elem.onEvent('hoverend', elem, mockHandler);
    expect(elem.hoverEndOn).toBe(true);
    elem.offEvent('hoverend', elem);
    elem.triggerEvent('mouseenter', elem);
    expect(mockHandler.mock.calls.length).toBe(0);
    expect(elem.hoverEndOn).toBe(false);
  });
});
