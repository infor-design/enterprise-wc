/**
 * @jest-environment jsdom
 */
import { attributes } from '../../src/core/ids-attributes';
import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsTriggerButton from '../../src/components/ids-trigger-field/ids-trigger-button';
import processAnimFrame from '../helpers/process-anim-frame';

const DEFAULT_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Date Field"
    >
      <ids-input></ids-input>
      <ids-trigger-button>
        <ids-text audible="true">Date Field trigger</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
  `
);

const REQUIRED_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Date Field"
      validate="required"
    >
      <ids-input></ids-input>
      <ids-trigger-button>
        <ids-text audible="true">Date Field trigger</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
  `
);

const DISABLED_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Date Field"
      disabled="true"
    >
      <ids-input></ids-input>
      <ids-trigger-button>
        <ids-text audible="true">Date Field trigger</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
  `
);

const READONLY_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Date Field"
      content-borders
      readonly="true"
    >
      <ids-input></ids-input>
      <ids-trigger-button>
        <ids-text audible="true">Date Field trigger</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
  `
);

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

  const createElemViaTemplate = async (innerHTML) => {
    triggerField?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    triggerField = template.content.childNodes[0];
    document.body.appendChild(triggerField);

    await processAnimFrame();

    return triggerField;
  };

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

  it('clicks the label and input receives focus', async () => {
    triggerField = await createElemViaTemplate(DEFAULT_TRIGGERFIELD_HTML);
    const labelEl = triggerField.shadowRoot.querySelector('.ids-trigger-field').children[0];
    const inputs = triggerField.shadowRoot.querySelectorAll('ids-input');
    labelEl.click();
    if (inputs) {
      [...inputs].forEach((input) => {
        expect(triggerField.shadowRoot.activeElement).toEqual(input);
      });
    }
  });

  it('renders validation setting', async () => {
    triggerField = await createElemViaTemplate(REQUIRED_TRIGGERFIELD_HTML);
    expect(triggerField.validate).toBe('required');
  });

  it('should add/remove validation errors', async () => {
    triggerField = await createElemViaTemplate(DEFAULT_TRIGGERFIELD_HTML);
    triggerField.validate = 'required';
    triggerField.template();
    document.body.appendChild(triggerField);

    expect(triggerField.getAttribute('validate')).toEqual('required');
    expect(triggerField.validate).toEqual('required');
    expect(triggerField.shadowRoot.querySelector('.validation-message')).toBeFalsy();

    triggerField.querySelector('ids-input').focus();
    triggerField.querySelector('ids-input').blur();
    triggerField.checkValidation();
    const msgEl = triggerField.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');

    triggerField.querySelector('ids-input').value = 'test';
    triggerField.querySelector('ids-input').blur();
    triggerField.checkValidation();
    expect(triggerField.shadowRoot.querySelector('.validation-message')).toBe(null);
  });

  it('renders disabled setting', async () => {
    triggerField = await createElemViaTemplate(READONLY_TRIGGERFIELD_HTML);
    expect(triggerField.readonly).toBe(true);
  });

  it('renders disabled setting', async () => {
    triggerField = await createElemViaTemplate(DISABLED_TRIGGERFIELD_HTML);
    expect(triggerField.disabled).toBe(true);
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

  it('has a readonly attribute', () => {
    triggerField.readonly = false;
    expect(triggerField.readonly).toEqual(false);
    expect(triggerField.getAttribute('readonly')).toEqual(null);

    triggerField.readonly = true;
    expect(triggerField.readonly).toEqual(true);
    expect(triggerField.getAttribute('readonly')).toEqual('true');
  });

  it('has a disabled attribute', () => {
    triggerField.disabled = false;
    expect(triggerField.disabled).toEqual(false);
    expect(triggerField.getAttribute('disabled')).toEqual(null);

    triggerField.disabled = true;
    expect(triggerField.disabled).toEqual(true);
    expect(triggerField.getAttribute('disabled')).toEqual('true');
  });

  it('has a readonly attribute', () => {
    triggerField.readonly = true;
    expect(triggerField.readonly).toEqual(true);
    expect(triggerField.getAttribute('readonly')).toEqual('true');

    triggerField.readonly = false;
    expect(triggerField.readonly).toEqual(false);
    expect(triggerField.getAttribute('readonly')).toEqual(null);
  });

  it('should not set wrong size', () => {
    triggerField.size = 'test';
    expect(triggerField.getAttribute('size')).toEqual('md');
    expect(triggerField.container.classList).not.toContain('test');
    const size = 'sm';
    triggerField.size = size;
    expect(triggerField.getAttribute('size')).toEqual(size);
    expect(triggerField.container.classList).toContain(size);
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

  it('has a label attribute', () => {
    triggerField.label = 'Ids Trigger Field';
    expect(triggerField.getAttribute('label')).toEqual('Ids Trigger Field');
  });
});
