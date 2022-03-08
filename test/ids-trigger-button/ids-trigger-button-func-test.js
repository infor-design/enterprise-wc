/**
 * @jest-environment jsdom
 */
import IdsTriggerButton from '../../src/components/ids-trigger-field/ids-trigger-button';
import createFromTemplate from '../helpers/create-from-template';

describe('IdsTriggerButton Component', () => {
  let triggerButton;

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

  it('supports readonly', () => {
    triggerButton.readonly = true;
    expect(triggerButton.readonly).toEqual(true);
    expect(triggerButton.hasAttribute('readonly')).toBeTruthy();

    triggerButton.readonly = false;
    expect(triggerButton.readonly).toEqual(false);
    expect(triggerButton.hasAttribute('readonly')).toBeFalsy();
  });

  it('supports readonly initially', () => {
    triggerButton = createFromTemplate(triggerButton, `<ids-trigger-button readonly="true">
      <ids-text audible="true">Search trigger</ids-text>
      <ids-icon slot="icon" icon="search"></ids-icon>
    </ids-trigger-button>`);

    expect(triggerButton.readonly).toEqual(true);
    expect(triggerButton.hasAttribute('readonly')).toBeTruthy();
  });

  it('supports readonly with tabbable', () => {
    triggerButton.tabbable = true;
    triggerButton.readonly = true;
    expect(triggerButton.readonly).toEqual(true);
    expect(triggerButton.hasAttribute('readonly')).toBeTruthy();
    expect(triggerButton.tabbable).toBeTruthy();

    triggerButton.tabbable = false;
    triggerButton.readonly = false;
    expect(triggerButton.readonly).toEqual(false);
    expect(triggerButton.hasAttribute('readonly')).toBeFalsy();
    expect(triggerButton.tabbable).toBeFalsy();
  });

  it('supports tabbable', () => {
    triggerButton.tabbable = true;

    expect(triggerButton.shadowRoot.querySelector('button').getAttribute('tabindex')).toEqual('0');
    expect(triggerButton.tabbable).toBeTruthy();

    triggerButton.tabbable = false;

    expect(triggerButton.shadowRoot.querySelector('button').getAttribute('tabindex')).toEqual('-1');
    expect(triggerButton.tabbable).toBeFalsy();
  });

  it('can be displayed as "inline" with a border', () => {
    // Looks like an "End" trigger button by default
    triggerButton = createFromTemplate(triggerButton, `<ids-trigger-button inline>
      <ids-text audible="true">+</ids-text>
      <ids-icon slot="icon" icon="search"></ids-icon>
    </ids-trigger-button>`);

    expect(triggerButton.hasAttribute('inline')).toBeTruthy();
    expect(triggerButton.container.classList.contains('style-inline')).toBeTruthy();
    expect(triggerButton.container.classList.contains('inline-end')).toBeTruthy();

    // add "slot='trigger-start'" to look like a "Start" trigger button
    triggerButton = createFromTemplate(triggerButton, `<ids-trigger-button slot="trigger-start" inline>
      <ids-text audible="true">+</ids-text>
      <ids-icon slot="icon" icon="search"></ids-icon>
    </ids-trigger-button>`);

    expect(triggerButton.container.classList.contains('inline-end')).toBeFalsy();
    expect(triggerButton.container.classList.contains('inline-start')).toBeTruthy();

    // No inline setting
    triggerButton = createFromTemplate(triggerButton, `<ids-trigger-button slot="trigger-start">
      <ids-text audible="true">+</ids-text>
      <ids-icon slot="icon" icon="search"></ids-icon>
    </ids-trigger-button>`);

    expect(triggerButton.hasAttribute('inline')).toBeFalsy();
    expect(triggerButton.container.classList.contains('style-inline')).toBeFalsy();
    expect(triggerButton.container.classList.contains('inline-start')).toBeFalsy();
  });
});
