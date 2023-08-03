/**
 * @jest-environment jsdom
 */
import '../../src/components/ids-accordion/ids-accordion';
import IdsAccordionHeader from '../../src/components/ids-accordion/ids-accordion-header';
import IdsContainer from '../../src/components/ids-container/ids-container';
import waitForTimeout from '../helpers/wait-for-timeout';

import createFromTemplate from '../helpers/create-from-template';
import type IdsAccordion from '../../src/components/ids-accordion/ids-accordion';
import type IdsAccordionPanel from '../../src/components/ids-accordion/ids-accordion-panel';
import type IdsIcon from '../../src/components/ids-icon/ids-icon';

const createAccordion = async (accordion: any, variant?: string | null) => {
  const variantProp = variant ? ` color-variant="${variant}"` : '';
  accordion = await createFromTemplate(accordion, `<ids-accordion${variantProp}>
  <ids-accordion-panel id="p1">
    <ids-accordion-header id="h1" slot="header">
      <ids-text>Header 1</ids-text>
    </ids-accordion-header>
    <ids-text slot="content">content</ids-text>
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
  return accordion;
};

describe('IdsAccordion Component', () => {
  let accordion: IdsAccordion;
  let panel: IdsAccordionPanel;
  let panel2: IdsAccordionPanel;
  let panel3: IdsAccordionPanel;
  let header: IdsAccordionHeader;
  let header2: IdsAccordionHeader;

  beforeEach(async () => {
    accordion = await createAccordion(accordion);

    panel = document.querySelector('#p1') as IdsAccordionPanel;
    panel2 = document.querySelector('#p2') as IdsAccordionPanel;
    panel3 = document.querySelector('#p3') as IdsAccordionPanel;
    header = (document.querySelector('#h1') as IdsAccordionHeader);
    header2 = (document.querySelector('#h2') as IdsAccordionHeader);
  });

  afterEach(async () => {
    accordion.remove();
    (accordion as any) = null;
    (panel as any) = null;
    (panel2 as any) = null;
    (panel3 as any) = null;
    (header as any) = null;
    (header2 as any) = null;
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
    accordion = await createAccordion(accordion);

    expect(document.querySelectorAll('ids-accordion').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set the pane title attribute', () => {
    const panelTitle = 'Expander text';
    panel.pane?.setAttribute('title', panelTitle);
    expect(panel.pane?.getAttribute('title')).toBe(panelTitle);
  });

  it('can change its expanded property', () => {
    const panelEl = accordion.querySelector('ids-accordion-panel');

    panelEl?.setAttribute('expanded', 'true');
    panel.expanded = true;
    expect(panelEl?.getAttribute('expanded')).toBeTruthy();
    expect(panel.getAttribute('expanded')).toBeTruthy();

    panelEl?.setAttribute('expanded', 'false');
    panel.expanded = false;
    expect(panelEl?.getAttribute('expanded')).toBeFalsy();
    expect(panel.expanded).toBeFalsy();
  });

  it('can change set its aria-expanded attribute', () => {
    panel.expanded = true;
    expect(header.getAttribute('aria-expanded')).toBeTruthy();
  });

  it('can be expanded/collapsed when clicked (mouse)', () => {
    const args: any = {
      target: panel.expander,
      bubbles: true,
      cancelable: true,
      view: window
    };
    const event = new MouseEvent('click', args);

    // Expand
    panel.expander?.dispatchEvent(event);
    expect(panel.expanded).toBeTruthy();

    // Collapse
    panel.expander?.dispatchEvent(event);
    expect(panel.expanded).toBeFalsy();
  });

  it('can be expanded/collapsed when touched', () => {
    const args: any = {
      touches: [{
        pageX: 0,
        pageY: 0,
        target: panel.expander
      }],
      bubbles: true,
      cancpanelable: true,
      view: window
    };
    const event: any = new TouchEvent('touchend', args);

    // Expand
    panel.expander?.dispatchEvent(event);

    expect(panel.expanded).toBeTruthy();

    // Collapse
    panel.expander?.dispatchEvent(event);

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

  it('can be expanded/collapsed programmatically', async () => {
    // Expand
    header.expanded = true;
    await waitForTimeout(() => expect(panel.expanded).toEqual(true));
    await waitForTimeout(() => expect(header.expanded).toEqual(panel.expanded));

    // Collapse
    header.expanded = false;
    await waitForTimeout(() => expect(panel.expanded).toEqual(false));
    await waitForTimeout(() => expect(header.expanded).toEqual(panel.expanded));
  });

  it('can select the next panel when pressing the ArrowDown key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    let nextPanel = panel.nextElementSibling;

    panel.dispatchEvent(event);
    nextPanel?.setAttribute('tabindex', '0');
    expect(nextPanel?.getAttribute('tabindex')).toBe('0');

    nextPanel = panel3.nextElementSibling;
    panel3.dispatchEvent(event);
    expect(nextPanel).toBe(null);
  });

  it('can select the prev panel when pressing the ArrowUp key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    let prevPanel = panel2.previousElementSibling;

    panel2.dispatchEvent(event);
    prevPanel?.setAttribute('tabindex', '0');
    expect(prevPanel?.getAttribute('tabindex')).toBe('0');

    prevPanel = panel.previousElementSibling;
    panel.dispatchEvent(event);
    expect(prevPanel).toBe(null);
  });

  it('supports setting allow one pane', () => {
    accordion.allowOnePane = true;
    expect(accordion.allowOnePane).toBeTruthy();

    accordion.allowOnePane = false;
    expect(accordion.allowOnePane).toBeFalsy();
  });

  it('has a reference to its panels', () => {
    expect(accordion.panels.length).toBe(3);
    expect(accordion.panels.includes(panel3));
  });

  it('should have reference to accordion in accordion-panels', () => {
    expect(panel.accordion).toEqual(accordion);
  });

  it('will not error if no pane', () => {
    panel.container?.querySelector('.ids-accordion-pane')?.remove();
    panel.collapsePane();
    expect(panel.pane).toBe(null);
  });

  it('has a reference to its focused panel', () => {
    panel2.focus();

    expect((document.activeElement as any).isEqualNode(header2)).toBeTruthy();
    expect(accordion.focused?.isEqualNode(panel2)).toBeTruthy();

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
    expect(next?.isEqualNode(panel2)).toBeTruthy();

    const prev = accordion.navigate(-1);
    expect(prev?.isEqualNode(panel)).toBeTruthy();

    // If "0" is passed, stay put
    const none = accordion.navigate(0);
    expect(none?.isEqualNode(panel)).toBeTruthy();

    // Don't accept junk values
    const junk = accordion.navigate('junk' as any);
    expect(junk?.isEqualNode(panel)).toBeTruthy();

    const noArgs = accordion.navigate();
    expect(noArgs?.isEqualNode(panel)).toBeTruthy();
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
    await waitForTimeout(() => expect(header.expanded).toBeTruthy());
  });

  it('can select headers', () => {
    header.selected = true;

    expect(header.container?.classList.contains('selected')).toBeTruthy();

    header2.selected = true;

    expect(header.selected).toBeFalsy();
    expect(header2.container?.classList.contains('selected')).toBeTruthy();
  });

  it('can change its headers expander type', async () => {
    await waitForTimeout(() => expect(header.expanderType).toBe('caret'));

    header.expanderType = 'plus-minus';
    await waitForTimeout(() => expect(header.expanderType).toBe('plus-minus'));
  });

  it('can add/remove icons from accordion headers', () => {
    const icon = header.container?.querySelector('.ids-accordion-display-icon') as IdsIcon;
    header.icon = 'user';

    expect(header.getAttribute('icon')).toBe('user');
    expect(icon.icon).toBe('user');

    header.icon = null;

    expect(header.getAttribute('icon')).toBe(null);
    expect(icon.icon).toBe('');
  });

  it('toggle expander icon for header', async () => {
    const icon = header.container?.querySelector('.ids-accordion-expander-icon') as IdsIcon;
    expect(icon.getAttribute('icon')).toBe('caret-down');
    header.toggleExpanderIcon(true);
    await waitForTimeout(() => expect(icon.getAttribute('icon')).toBe('caret-down'));
  });

  it('should update with container language change', () => {
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.appendChild(accordion);

    const language = { before: 'en', after: 'ar' };
    const mockCallback = jest.fn((e) => {
      expect(e.detail.language.name).toEqual(language.after);
    });

    expect((accordion.language as any).name).toEqual(language.before);
    container.addEventListener('languagechange', mockCallback);
    const event = new CustomEvent('languagechange', {
      detail: { language: { name: language.after } }
    });
    container.dispatchEvent(event);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should have only one pane expanded with allowOnePane setting', () => {
    accordion.allowOnePane = true;
    panel.expanded = true;
    panel2.expanded = true;

    expect(panel.expanded).toBeFalsy();
    expect(panel2.expanded).toBeTruthy();
    expect(panel3.expanded).toBeFalsy();
  });

  it('should add/remove alignment classes with panel\'s contentAlignment', () => {
    panel.contentAlignment = '';
    expect(header.container?.classList.contains('has-icon')).toBeFalsy();

    panel.contentAlignment = 'has-icon';
    expect(header.container?.classList.contains('has-icon')).toBeTruthy();

    panel.contentAlignment = 'has-menu';
    expect(header.container?.classList.contains('has-icon')).toBeFalsy();
  });

  it('should not expand when panel is disabled', () => {
    panel.disabled = true;
    const event = new KeyboardEvent('keydown', { key: ' ' });

    panel.dispatchEvent(event);
    expect(panel.expanded).toBeFalsy();

    panel.disabled = false;
    // Expand
    panel.dispatchEvent(event);
    expect(panel.expanded).toBeTruthy();
  });

  it('should not expand all panels when accordion disabled', () => {
    accordion.disabled = true;
    const event = new KeyboardEvent('keydown', { key: ' ' });

    panel.dispatchEvent(event);
    expect(panel.expanded).toBeFalsy();

    panel2.dispatchEvent(event);
    expect(panel2.expanded).toBeFalsy();

    panel2.dispatchEvent(event);
    expect(panel2.expanded).toBeFalsy();
  });
});
