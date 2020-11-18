/**
 * @jest-environment jsdom
 */
import IdsTriggerField from '../../src/ids-trigger-field/ids-trigger-field';
import IdsInput from '../../src/ids-input/ids-input';
import IdsTriggerButton from '../../src/ids-trigger-button/ids-trigger-button';
import { props } from '../../src/ids-base/ids-constants';

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
    expect(triggerField.getAttribute(props.TABBABLE)).toEqual('true');
    expect(triggerField.tabbable).toEqual('true');
  });

  it('removes tabbable setting if reset', () => {
    triggerField.tabbable = true;
    triggerField.tabbable = false;
    expect(triggerField.getAttribute(props.TABBABLE)).toEqual('false');
    expect(triggerField.tabbable).toEqual('false');
  });

  it('renders appearance setting', () => {
    triggerField.appearance = 'compact';
    expect(triggerField.getAttribute(props.APPEARANCE)).toEqual('compact');
    expect(triggerField.appearance).toEqual('compact');
  });

  it('removes appearance setting if reset', () => {
    triggerField.appearance = 'compact';
    triggerField.appearance = null;
    expect(triggerField.getAttribute(props.APPEARANCE)).toEqual('normal');
    expect(triggerField.appearance).toEqual('normal');
  });

  it('renders disableNativeEvents setting', () => {
    triggerField.disableNativeEvents = true;
    expect(triggerField.getAttribute(props.DISABLE_EVENTS)).toEqual('true');
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
    expect(triggerField.getAttribute(props.DISABLE_EVENTS)).toEqual(null);
    expect(triggerField.disableNativeEvents).toEqual(null);
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
    triggerField.refresh();
    const triggerButton = triggerField.querySelector('ids-trigger-button');
    expect(triggerButton.classList).toContain('has-icon-clock');
  });

  it('renders label class', () => {
    const input = triggerField.querySelector('ids-input');
    triggerField.shouldUpdate = false;
    input.size = 'lg';
    triggerField.refresh();
    expect(input.getAttribute('size')).toEqual('lg');
    expect(input.input.classList).toContain('lg');
    triggerField.shouldUpdate = true;
    input.size = 'sm';
    triggerField.refresh();
    expect(input.getAttribute('size')).toEqual('sm');
    expect(input.input.classList).toContain('sm');
  });
});
