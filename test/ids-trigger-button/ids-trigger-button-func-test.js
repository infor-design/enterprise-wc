/**
 * @jest-environment jsdom
 */
import IdsTriggerButton from '../../src/components/ids-trigger-field/ids-trigger-button';

describe('IdsTriggerButton Component', () => {
  let triggerButton;

  const createFromTemplate = (innerHTML) => {
    triggerButton?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    triggerButton = template.content.childNodes[0];
    document.body.appendChild(triggerButton);
    return triggerButton;
  };

  beforeEach(async () => {
    const elem = new IdsTriggerButton();
    document.body.appendChild(elem);
    triggerButton = document.querySelector('ids-trigger-button');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTriggerButton();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-trigger-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(triggerButton.outerHTML).toMatchSnapshot();
  });

  it('defaults tabbable to true', () => {
    expect(triggerButton.tabbable).toEqual(true);
    triggerButton.removeAttribute('tabbable');
    expect(triggerButton.tabbable).toEqual(true);
  });

  it('supports readonly', () => {
    triggerButton.readonly = true;
    expect(triggerButton.readonly).toEqual(true);
    expect(triggerButton.getAttribute('readonly')).toEqual('true');

    triggerButton.readonly = false;
    expect(triggerButton.readonly).toEqual(false);
    expect(triggerButton.getAttribute('readonly')).toBeFalsy();
  });

  it('supports readonly initially', () => {
    triggerButton = createFromTemplate(
      `<ids-trigger-button readonly="true">
      <ids-text audible="true">Search trigger</ids-text>
      <ids-icon slot="icon" icon="search"></ids-icon>
    </ids-trigger-button>`
    );
    expect(triggerButton.readonly).toEqual(true);
    expect(triggerButton.getAttribute('readonly')).toEqual('true');
  });

  it('supports readonly with tabbable', () => {
    triggerButton.tabbable = true;
    triggerButton.readonly = true;
    expect(triggerButton.readonly).toEqual(true);
    expect(triggerButton.getAttribute('readonly')).toEqual('true');
    expect(triggerButton.tabbable).toEqual('true');

    triggerButton.tabbable = false;
    triggerButton.readonly = false;
    expect(triggerButton.readonly).toEqual(false);
    expect(triggerButton.getAttribute('readonly')).toBeFalsy();
    expect(triggerButton.tabbable).toEqual('false');
  });

  it('supports tabbable', () => {
    triggerButton.tabbable = true;

    expect(triggerButton.shadowRoot.querySelector('button').getAttribute('tabindex')).toEqual('0');
    expect(triggerButton.tabbable).toEqual('true');

    triggerButton.tabbable = false;

    expect(triggerButton.shadowRoot.querySelector('button').getAttribute('tabindex')).toEqual('-1');
    expect(triggerButton.tabbable).toEqual('false');
  });
});
