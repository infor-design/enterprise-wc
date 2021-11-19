/**
 * @jest-environment jsdom
 */
import IdsAccordion, {
  IdsAccordionHeader,
  IdsAccordionPanel
} from '../../src/components/ids-accordion/ids-accordion';
import IdsContainer from '../../src/components/ids-container/ids-container';

import elemBuilderFactory from '../helpers/elem-builder-factory';
import waitFor from '../helpers/wait-for';

const elemBuilder = elemBuilderFactory();

const createAccordion = async (variant) => {
  const variantProp = variant ? ` colorVariant="${variant}"` : '';
  return elemBuilder.createElemFromTemplate(`<ids-accordion${variantProp}>
    <ids-accordion-panel id="p1">
      <ids-accordion-header id="h1" slot="header">
        <ids-text>Header 1</ids-text>
      </ids-accordion-header>
    </ids-accordion-panel>
    <ids-accordion-panel id="p2">
      <ids-accordion-header id="h2" slot="header">
        <ids-text>Header 2</ids-text>
      </ids-accordion-header>
    </ids-accordion-panel>
    <ids-accordion-panel id="p3">
      <ids-accordion-header id="h3" slot="header">
        <ids-text>Header 3</ids-text>
      </ids-accordion-header>
    </ids-accordion-panel>
  </ids-accordion>`);
};

describe('IdsAccordion Component', () => {
  let accordion;
  let panel;
  let panel2;
  let panel3;
  let header;
  let header2;

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());

    accordion = await createAccordion();

    panel = document.querySelector('#p1');
    panel2 = document.querySelector('#p2');
    panel3 = document.querySelector('#p3');
    header = document.querySelector('#h1');
    header2 = document.querySelector('#h2');
  });

  afterEach(async () => {
    elemBuilder.clearElement();
    accordion = null;
    panel = null;
    panel2 = null;
    panel3 = null;
    header = null;
    header2 = null;
  });

  it('renders correctly', async () => {
    expect(accordion.outerHTML).toMatchSnapshot();
    panel.expanded = true;
    expect(accordion.outerHTML).toMatchSnapshot();
    panel.expanded = false;
    expect(accordion.outerHTML).toMatchSnapshot();
  });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    accordion.remove();
    accordion = await createAccordion();

    expect(document.querySelectorAll('ids-accordion').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set the pane title attribute', () => {
    const panelTitle = 'Expander text';
    panel.pane.setAttribute('title', panelTitle);
    expect(panel.pane.getAttribute('title')).toBe(panelTitle);
  });

  it('can change its expanded property', () => {
    const panelEl = accordion.querySelector('ids-accordion-panel');

    panelEl.setAttribute('expanded', true);
    panel.expanded = true;
    expect(panelEl.getAttribute('expanded')).toBeTruthy();
    expect(panel.getAttribute('expanded')).toBeTruthy();

    panelEl.setAttribute('expanded', false);
    panel.expanded = false;
    expect(panelEl.getAttribute('expanded')).toBeFalsy();
    expect(panel.expanded).toBeFalsy();
  });

  it('can change set its aria-expanded attribute', () => {
    panel.expanded = true;
    expect(header.getAttribute('aria-expanded')).toBeTruthy();
  });

  it('can be expanded/collapsed when clicked (mouse)', () => {
    const event = new MouseEvent('click', {
      target: panel.expander,
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Expand
    panel.expander.dispatchEvent(event);
    expect(panel.expanded).toBeTruthy();

    // Collapse
    panel.expander.dispatchEvent(event);
    expect(panel.expanded).toBeFalsy();
  });

  it('can be expanded/collapsed when touched', () => {
    const event = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: panel.expander
      }],
      bubbles: true,
      cancpanelable: true,
      view: window
    });

    // Expand
    panel.expander.dispatchEvent(event);

    expect(panel.expanded).toBeTruthy();

    // Collapse
    panel.expander.dispatchEvent(event);

    expect(panel.expanded).toBeFalsy();
  });

  it('can be expanded/collapsed when pressing Enter key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    // Expand
    panel.dispatchEvent(event);
    expect(panel.expanded).toBeTruthy();

    // Collapse
    panel.dispatchEvent(event);
    expect(panel.expanded).toBeFalsy();
  });

  it('can be expanded/collapsed when pressing Space key', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });

    // Expand
    panel.dispatchEvent(event);
    expect(panel.expanded).toBeTruthy();

    // Collapse
    panel.dispatchEvent(event);
    expect(panel.expanded).toBeFalsy();
  });

  it('can select the next panel when pressing the ArrowDown key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    let nextPanel = panel.nextElementSibling;

    panel.dispatchEvent(event);
    nextPanel.setAttribute('tabindex', '0');
    expect(nextPanel.getAttribute('tabindex')).toBe('0');

    nextPanel = panel3.nextElementSibling;
    panel3.dispatchEvent(event);
    expect(nextPanel).toBe(null);
  });

  it('can select the prev panel when pressing the ArrowUp key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    let prevPanel = panel2.previousElementSibling;

    panel2.dispatchEvent(event);
    prevPanel.setAttribute('tabindex', '0');
    expect(prevPanel.getAttribute('tabindex')).toBe('0');

    prevPanel = panel.previousElementSibling;
    panel.dispatchEvent(event);
    expect(prevPanel).toBe(null);
  });

  it('can change the height of the pane', () => {
    panel.pane.style.height = `100px`;

    requestAnimationFrame(() => {
      panel.pane.style.height = `100px`;
      requestAnimationFrame(() => {
        panel.pane.style.height = `0px`;
      });
    });
    expect(panel.pane.style.height).toEqual('0px');
  });

  it('supports setting mode', () => {
    accordion.mode = 'dark';
    expect(accordion.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    accordion.version = 'classic';
    expect(accordion.container.getAttribute('version')).toEqual('classic');
  });

  it('supports color variants', async () => {
    elemBuilder.clearElement();
    accordion = await createAccordion('app-menu');
    waitFor(() => expect(accordion.colorVariant).toBe('app-menu'));
  });

  it('has a reference to its panels', () => {
    expect(accordion.panels.length).toBe(3);
    expect(accordion.panels.includes(panel3));
  });

  it('has a reference to its focused panel', () => {
    panel2.focus();

    expect(document.activeElement.isEqualNode(header2)).toBeTruthy();
    expect(accordion.focused.isEqualNode(panel2)).toBeTruthy();

    // Create another element outside the app menu and focus it
    const extraneousElem = document.createElement('input');
    document.body.appendChild(extraneousElem);
    extraneousElem.focus();

    // If no element inside the menu is focused, the property should be undefined
    expect(accordion.focused).toBeFalsy();
  });

  it('can navigate among its panels programatically', () => {
    panel.focus();
    const next = accordion.navigate(1);
    expect(next.isEqualNode(panel2)).toBeTruthy();

    const prev = accordion.navigate(-1);
    expect(prev.isEqualNode(panel)).toBeTruthy();

    // If "0" is passed, stay put
    const none = accordion.navigate(0);
    expect(none.isEqualNode(panel)).toBeTruthy();

    // Don't accept junk values
    const junk = accordion.navigate('junk');
    expect(junk.isEqualNode(panel)).toBeTruthy();

    const noArgs = accordion.navigate();
    expect(noArgs.isEqualNode(panel)).toBeTruthy();
  });

  it('can navigate among its panels using the keyboard', () => {
    const navigateUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const navigateDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

    // Focus the first one
    panel.focus();
    expect(accordion.focused).toEqual(panel);

    accordion.dispatchEvent(navigateDownEvent);
    expect(accordion.focused).toEqual(panel2);

    accordion.dispatchEvent(navigateUpEvent);
    expect(accordion.focused).toEqual(panel);
  });

  it('has headers that are aware of their expanded status', async () => {
    panel.expanded = true;
    waitFor(() => expect(header.expanded).toBeTruthy());
  });

  it('can select headers', () => {
    header.selected = true;

    expect(header.container.classList.contains('selected')).toBeTruthy();

    header2.selected = true;

    expect(header.selected).toBeFalsy();
    expect(header2.container.classList.contains('selected')).toBeTruthy();
  });

  it('can change its headers expander type', () => {
    expect(header.expanderType).toBe('caret');

    header.expanderType = 'plus-minus';
    expect(header.expanderType).toBe('plus-minus');
  });

  it('can add/remove icons from accordion headers', () => {
    const icon = header.container.querySelector('.ids-accordion-display-icon');
    header.icon = 'user';

    expect(header.getAttribute('icon')).toBe('user');
    expect(icon.icon).toBe('user');

    header.icon = null;

    expect(header.getAttribute('icon')).toBe(null);
    expect(icon.icon).toBe(null);
  });

  it('should update with container language change', () => {
    const container = new IdsContainer();
    document.body.appendChild(container);
    container.appendChild(accordion);

    const language = { before: 'en', after: 'ar' };
    const mockCallback = jest.fn((e) => {
      expect(e.detail.language.name).toEqual(language.after);
    });

    expect(accordion.language.name).toEqual(language.before);
    container.addEventListener('languagechange', mockCallback);
    const event = new CustomEvent('languagechange', {
      detail: { language: { name: language.after } }
    });
    container.dispatchEvent(event);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(accordion.language.name).toEqual(language.after);
  });
});
