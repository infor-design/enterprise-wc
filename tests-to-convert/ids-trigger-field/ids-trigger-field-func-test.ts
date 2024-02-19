/**
 * @jest-environment jsdom
 */
import { attributes } from '../../src/core/ids-attributes';
import createFromTemplate from '../helpers/create-from-template';
import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';
import '../../src/components/ids-trigger-field/ids-trigger-button';
import IdsContainer from '../../src/components/ids-container/ids-container';
import type IdsTriggerButton from '../../src/components/ids-trigger-field/ids-trigger-button';

const DEFAULT_TRIGGERFIELD_HTML = (
  `<ids-trigger-field
      id="trigger-field-1"
      size="sm"
      tabbable="false"
      label="Date Field"
    >
      <ids-trigger-button slot="trigger-end">
        <ids-text audible="true">Date Field trigger</ids-text>
        <ids-icon icon="schedule"></ids-icon>
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
        <ids-icon icon="schedule"></ids-icon>
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
        <ids-icon icon="schedule"></ids-icon>
      </ids-trigger-button>
      <ids-trigger-button slot="trigger-end">
        <ids-text audible="true">Ending Trigger Button</ids-text>
        <ids-icon icon="schedule"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>`
);

describe('IdsTriggerField Component initialization', () => {
  let container: IdsContainer;

  const setupComponent = (component: any) => {
    component.size = 'sm';
    component.tabbable = false;
    component.label = 'Date Field';
  };

  const checkProperties = (component: any) => {
    expect(component.size).toEqual('sm');
    expect(component.tabbable).toBeFalsy();
    expect(component.label).toEqual('Date Field');
  };

  beforeEach(() => {
    container = new IdsContainer();
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('can render via document.createElement (append early)', () => {
    const component = document.createElement('ids-trigger-field');
    container.appendChild(component);
    setupComponent(component);
    checkProperties(component);
  });

  test('can render via document.createElement (append late)', () => {
    const component = document.createElement('ids-trigger-field');
    setupComponent(component);
    container.appendChild(component);
    checkProperties(component);
  });
});

describe('IdsTriggerField Component', () => {
  let triggerField: IdsTriggerField;

  beforeEach(async () => {
    triggerField = await createFromTemplate(triggerField, DEFAULT_TRIGGERFIELD_HTML);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('fires triggerevent on trigger', () => {
    triggerField.addEventListener('triggerfield', (e: any) => {
      e.detail.response(false);
    });
    triggerField.trigger();

    expect(document.body.contains(triggerField)).toEqual(true);
  });

  test('renders validation setting', async () => {
    triggerField = await createFromTemplate(triggerField, REQUIRED_TRIGGERFIELD_HTML);
    expect(triggerField.validate).toBe('required');
  });

  test('should add/remove validation errors', async () => {
    triggerField = await createFromTemplate(triggerField, DEFAULT_TRIGGERFIELD_HTML);
    triggerField.validate = 'required';
    triggerField.template();
    document.body.appendChild(triggerField);

    expect(triggerField.getAttribute('validate')).toEqual('required');
    expect(triggerField.validate).toEqual('required');
    expect(triggerField.shadowRoot?.querySelector('.validation-message')).toBeFalsy();

    triggerField.focus();
    triggerField.blur();
    triggerField.checkValidation();
    const msgEl = triggerField.shadowRoot?.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl?.getAttribute('validation-id')).toEqual('required');

    triggerField.value = 'test';
    triggerField.blur();
    triggerField.checkValidation();
    expect(triggerField.shadowRoot?.querySelector('.validation-message')).toBe(null);
  });

  test('renders tabbable setting', () => {
    triggerField.tabbable = true;
    expect(triggerField.hasAttribute(attributes.TABBABLE)).toBeTruthy();
    expect(triggerField.tabbable).toEqual(true);
    expect(triggerField.buttons[0].tabbable).toBeTruthy();

    triggerField.tabbable = false;
    expect(triggerField.hasAttribute(attributes.TABBABLE)).toBeFalsy();
    expect(triggerField.tabbable).toEqual(false);
    expect(triggerField.buttons[0].tabbable).toBeFalsy();
  });

  test('has a readonly attribute', () => {
    triggerField.readonly = false;
    expect(triggerField.buttons[0].readonly).toBeFalsy();

    triggerField.readonly = true;
    expect(triggerField.buttons[0].readonly).toBeTruthy();
  });

  test('has a disabled attribute', () => {
    triggerField.disabled = false;
    expect(triggerField.buttons[0].disabled).toBeFalsy();

    triggerField.disabled = true;
    expect(triggerField.buttons[0].disabled).toBeTruthy();
  });

  test('has a readonly attribute', () => {
    triggerField.readonly = true;
    expect(triggerField.readonly).toEqual(true);
    expect(triggerField.hasAttribute('readonly')).toBeTruthy();

    triggerField.readonly = false;
    expect(triggerField.readonly).toEqual(false);
    expect(triggerField.getAttribute('readonly')).toBeFalsy();
  });

  test('fires triggerclicked event', () => {
    const handler = jest.fn();
    triggerField.addEventListener('triggerclicked', handler);

    triggerField.buttons[0].click();
    expect(handler.mock.calls.length).toBe(1);
  });

  test('can veto beforetriggerclicked event', () => {
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

  test('renders icon clock', async () => {
    const triggerButton = triggerField.querySelector('ids-trigger-button') as IdsTriggerButton;
    triggerButton.icon = 'clock';

    expect(triggerButton.querySelector('ids-icon')?.getAttribute('icon')).toEqual('clock');
  });

  test('can set the noMargins attribute', () => {
    triggerField.noMargins = true;
    expect(triggerField.hasAttribute('no-margins')).toBeTruthy();
    expect(triggerField.noMargins).toEqual(true);

    triggerField.noMargins = false;
    expect(triggerField.hasAttribute('no-margins')).toBeFalsy();
    expect(triggerField.noMargins).toEqual(false);
  });

  test('can have a trigger button on each side', async () => {
    triggerField = await createFromTemplate(triggerField, TWO_BUTTON_TRIGGERFIELD_HTML);

    expect(triggerField.buttons[0]).toBeDefined();
    expect(triggerField.buttons[1]).toBeDefined();
  });
});
