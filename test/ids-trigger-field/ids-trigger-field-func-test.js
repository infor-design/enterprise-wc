/**
 * @jest-environment jsdom
 */
import IdsTriggerField from '../../src/ids-trigger-field/ids-trigger-field';
import IdsInput from '../../src/ids-input/ids-input';
import IdsTriggerButton from '../../src/ids-trigger-field/ids-trigger-button';
import { attributes } from '../../src/ids-base';

const resizeObserverMock = jest.fn(function ResizeObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  this.unobserve = jest.fn();
  this.trigger = (entryList) => {
    callback(entryList, this);
  };
});
global.ResizeObserver = resizeObserverMock;

describe('IdsTriggerField Component', () => {
  let triggerField;

  beforeEach(async () => {
    const trigger = new IdsTriggerField();
    const input = new IdsInput();
    trigger.appendChild(input);
    const button = new IdsTriggerButton();
    trigger.appendChild(button);
    document.body.appendChild(trigger);
    triggerField = document.querySelector('ids-trigger-field');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTriggerField();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-trigger-field').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(triggerField.outerHTML).toMatchSnapshot();

    triggerField.icon = 'close';
    expect(triggerField.outerHTML).toMatchSnapshot();
  });

  it('fires triggerevent on trigger', () => {
    triggerField.addEventListener('triggerfield', (e) => {
      e.detail.response(false);
    });
    triggerField.trigger();

    expect(document.body.contains(triggerField)).toEqual(true);
  });

  it('renders tabbable setting', () => {
    triggerField.tabbable = true;
    expect(triggerField.getAttribute(attributes.TABBABLE)).toEqual('true');
    expect(triggerField.tabbable).toEqual('true');
  });

  it('removes tabbable setting if reset', () => {
    triggerField.tabbable = true;
    triggerField.tabbable = false;
    expect(triggerField.getAttribute(attributes.TABBABLE)).toEqual('false');
    expect(triggerField.tabbable).toEqual('false');
  });

  it('renders appearance setting', () => {
    triggerField.appearance = 'compact';
    expect(triggerField.getAttribute(attributes.APPEARANCE)).toEqual('compact');
    expect(triggerField.appearance).toEqual('compact');
  });

  it('removes appearance setting if reset', () => {
    triggerField.appearance = 'compact';
    triggerField.appearance = null;
    expect(triggerField.getAttribute(attributes.APPEARANCE)).toEqual('normal');
    expect(triggerField.appearance).toEqual('normal');
  });

  it('renders disableNativeEvents setting', () => {
    triggerField.disableNativeEvents = true;
    expect(triggerField.getAttribute(attributes.DISABLE_EVENTS)).toEqual('true');
    expect(triggerField.disableNativeEvents).toEqual('true');
  });

  it('fires triggerclicked event', () => {
    const handler = jest.fn();
    triggerField.addEventListener('triggerclicked', handler);

    triggerField.parentElement.querySelector('ids-trigger-button').click();
    expect(handler.mock.calls.length).toBe(1);
  });

  it('can veto beforetriggerclicked event', () => {
    const beforeHandler = jest.fn((e) => {
      e.detail.response(false);
    });
    const handler = jest.fn();
    triggerField.addEventListener('beforetriggerclicked', beforeHandler);
    triggerField.addEventListener('triggerclicked', handler);

    triggerField.parentElement.querySelector('ids-trigger-button').click();
    expect(beforeHandler.mock.calls.length).toBe(1);
    expect(handler.mock.calls.length).toBe(0);
  });

  it('removes disableNativeEvents setting if reset', () => {
    triggerField.disableNativeEvents = true;
    triggerField.disableNativeEvents = false;
    expect(triggerField.getAttribute(attributes.DISABLE_EVENTS)).toEqual(null);
    expect(triggerField.disableNativeEvents).toEqual(null);
  });

  it('Should not set field-height null', () => {
    triggerField.containerSetHeightClass({ name: 'compact', val: 'true' });
    expect(triggerField.container.classList).toContain('compact');
    triggerField.containerSetHeightClass({ name: 'compact', val: 'false' });
    expect(triggerField.container.classList).not.toContain('compact');
    triggerField.containerSetHeightClass({ name: 'field-height', val: 'sm' });
    expect(triggerField.container.classList).toContain('field-height-sm');
    triggerField.containerSetHeightClass({ name: 'field-height', val: null });
    expect(triggerField.container.getAttribute('class')).not.toContain('field-height-');
  });

  it('Should set validation message class', () => {
    const className = 'has-validation-message';
    expect(triggerField.container.classList).not.toContain(className);
    let input = triggerField.querySelector('ids-input');
    let event = new CustomEvent('validate', { detail: { isValid: false } });
    input.dispatchEvent(event);
    expect(triggerField.container.classList).toContain(className);
    input = triggerField.querySelector('ids-input');
    event = new CustomEvent('validate', { detail: { isValid: true } });
    input.dispatchEvent(event);
    expect(triggerField.container.classList).not.toContain(className);
  });

  it('renders icon clock', () => {
    document.body.innerHTML = '';
    const trigger = new IdsTriggerField();
    const input = new IdsInput();
    trigger.appendChild(input);
    const button = new IdsTriggerButton();
    button.icon = 'clock';
    trigger.appendChild(button);
    document.body.appendChild(trigger);
    triggerField = document.querySelector('ids-trigger-field');
    const triggerButton = triggerField.querySelector('ids-trigger-button');
    expect(triggerButton.querySelector('ids-icon').getAttribute('icon')).toEqual('clock');
  });

  it('renders label class', () => {
    const input = triggerField.querySelector('ids-input');
    triggerField.shouldUpdate = false;
    input.size = 'lg';
    expect(input.getAttribute('size')).toEqual('lg');
    expect(input.container.classList).toContain('lg');
    triggerField.shouldUpdate = true;
    input.size = 'sm';
    expect(input.getAttribute('size')).toEqual('sm');
    expect(input.container.classList).toContain('sm');
  });
});
