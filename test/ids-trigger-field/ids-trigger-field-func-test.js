/**
 * @jest-environment jsdom
 */
import { attributes } from '../../src/core/ids-attributes';
import createFromTemplate from '../helpers/create-from-template';
import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';
import IdsTriggerButton from '../../src/components/ids-trigger-field/ids-trigger-button';
import processAnimFrame from '../helpers/process-anim-frame';

const DEFAULT_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Date Field"
    >
      <ids-trigger-button slot="trigger-end">
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
      <ids-trigger-button slot="trigger-end">
        <ids-text audible="true">Date Field trigger</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
  `
);

const TWO_BUTTON_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Two-Button Field"
    >
      <ids-trigger-button slot="trigger-start">
        <ids-text audible="true">Starting Trigger Button</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
      <ids-trigger-button slot="trigger-end">
        <ids-text audible="true">Ending Trigger Button</ids-text>
        <ids-icon slot="icon" icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>`
);

describe('IdsTriggerField Component', () => {
  let triggerField;

  beforeEach(async () => {
    triggerField = await createFromTemplate(triggerField, DEFAULT_TRIGGERFIELD_HTML);
    await processAnimFrame();
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

  it('renders validation setting', async () => {
    triggerField = await createFromTemplate(triggerField, REQUIRED_TRIGGERFIELD_HTML);
    expect(triggerField.validate).toBe('required');
  });

  it('should add/remove validation errors', async () => {
    triggerField = await createFromTemplate(triggerField, DEFAULT_TRIGGERFIELD_HTML);
    triggerField.validate = 'required';
    triggerField.template();
    document.body.appendChild(triggerField);

    expect(triggerField.getAttribute('validate')).toEqual('required');
    expect(triggerField.validate).toEqual('required');
    expect(triggerField.shadowRoot.querySelector('.validation-message')).toBeFalsy();

    triggerField.focus();
    triggerField.blur();
    triggerField.checkValidation();
    const msgEl = triggerField.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');

    triggerField.value = 'test';
    triggerField.blur();
    triggerField.checkValidation();
    expect(triggerField.shadowRoot.querySelector('.validation-message')).toBe(null);
  });

  it('renders tabbable setting', () => {
    triggerField.tabbable = true;
    expect(triggerField.hasAttribute(attributes.TABBABLE)).toBeTruthy();
    expect(triggerField.tabbable).toEqual(true);
    expect(triggerField.buttons[0].tabbable).toBeTruthy();

    triggerField.tabbable = false;
    expect(triggerField.hasAttribute(attributes.TABBABLE)).toBeFalsy();
    expect(triggerField.tabbable).toEqual(false);
    expect(triggerField.buttons[0].tabbable).toBeFalsy();
  });

  it('has a readonly attribute', () => {
    triggerField.readonly = false;
    expect(triggerField.buttons[0].readonly).toBeFalsy();

    triggerField.readonly = true;
    expect(triggerField.buttons[0].readonly).toBeTruthy();
  });

  it('has a disabled attribute', () => {
    triggerField.disabled = false;
    expect(triggerField.buttons[0].disabled).toBeFalsy();

    triggerField.disabled = true;
    expect(triggerField.buttons[0].disabled).toBeTruthy();
  });

  it('has a readonly attribute', () => {
    triggerField.readonly = true;
    expect(triggerField.readonly).toEqual(true);
    expect(triggerField.hasAttribute('readonly')).toBeTruthy();

    triggerField.readonly = false;
    expect(triggerField.readonly).toEqual(false);
    expect(triggerField.getAttribute('readonly')).toBeFalsy();
  });

  it('fires triggerclicked event', () => {
    const handler = jest.fn();
    triggerField.addEventListener('triggerclicked', handler);

    triggerField.buttons[0].click();
    expect(handler.mock.calls.length).toBe(1);
  });

  it('can veto beforetriggerclicked event', () => {
    const beforeHandler = jest.fn((e) => {
      e.detail.response(false);
    });
    const handler = jest.fn();
    triggerField.addEventListener('beforetriggerclicked', beforeHandler);
    triggerField.addEventListener('triggerclicked', handler);

    triggerField.buttons[0].click();
    expect(beforeHandler.mock.calls.length).toBe(1);
    expect(handler.mock.calls.length).toBe(0);
  });

  it('renders icon clock', async () => {
    const triggerButton = triggerField.querySelector('ids-trigger-button');
    triggerButton.icon = 'clock';
    await processAnimFrame();

    expect(triggerButton.querySelector('ids-icon').getAttribute('icon')).toEqual('clock');
  });

  it('can set the noMargins attribute', () => {
    triggerField.noMargins = true;
    expect(triggerField.hasAttribute('no-margins')).toBeTruthy();
    expect(triggerField.noMargins).toEqual(true);

    triggerField.noMargins = false;
    expect(triggerField.hasAttribute('no-margins')).toBeFalsy();
    expect(triggerField.noMargins).toEqual(false);
  });

  it('can have a trigger button on each side', async () => {
    triggerField = await createFromTemplate(triggerField, TWO_BUTTON_TRIGGERFIELD_HTML);
    await processAnimFrame();

    expect(triggerField.buttons[0]).toBeDefined();
    expect(triggerField.buttons[1]).toBeDefined();
  });
});
