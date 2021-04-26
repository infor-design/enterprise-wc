/**
 * @jest-environment jsdom
 */
import IdsAccordion from '../../src/ids-accordion/ids-accordion';
import IdsAccordionHeader from '../../src/ids-accordion/ids-accordion-header';
import IdsAccordionPanel from '../../src/ids-accordion/ids-accordion-panel';

describe('IdsAccordion Component', () => {
  let accordion;
  let panel;
  let panel2;
  let panel3;
  let header;
  let header2;
  let header3;

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    const wrapper = new IdsAccordion();
    panel = new IdsAccordionPanel();
    panel2 = new IdsAccordionPanel();
    panel3 = new IdsAccordionPanel();
    header = new IdsAccordionHeader();
    header2 = new IdsAccordionHeader();
    header3 = new IdsAccordionHeader();

    document.body.appendChild(wrapper);
    accordion = document.querySelector('ids-accordion');

    accordion.appendChild(panel);
    accordion.appendChild(panel2);
    accordion.appendChild(panel3);

    panel.appendChild(header);
    panel2.appendChild(header2);
    panel3.appendChild(header3);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    accordion = null;
  });

  it('renders correctly', () => {
    expect(accordion.outerHTML).toMatchSnapshot();
    panel.expanded = true;
    expect(accordion.outerHTML).toMatchSnapshot();
    panel.expanded = false;
    expect(accordion.outerHTML).toMatchSnapshot();
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    accordion.remove();

    accordion = new IdsAccordion();
    document.body.appendChild(accordion);

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
    expect(panelEl.getAttribute('expanded')).toBe('true');
    expect(panel.getAttribute('expanded')).toBe('true');

    panelEl.setAttribute('expanded', false);
    panel.expanded = false;
    expect(panelEl.getAttribute('expanded')).toBe('false');
    expect(panel.expanded).toBe('false');
  });

  it('can change set its aria-expanded attribute', () => {
    panel.state.expanded = true;
    panel.expander.setAttribute('aria-expanded', panel.state.expanded);
    expect(panel.expander.getAttribute('aria-expanded')).toBe('true');
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
    expect(panel.expanded).toBe('true');
    expect(panel.state.expanded).toBe(true);

    // Collapse
    panel.expander.dispatchEvent(event);
    expect(panel.expanded).toBe('false');
    expect(panel.state.expanded).toBe(false);
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
    panel.expanded = true;
    panel.state.expanded = true;
    expect(panel.expanded).toBe('true');
    expect(panel.state.expanded).toBe(true);

    // Collapse
    panel.expander.dispatchEvent(event);
    panel.expanded = false;
    panel.state.expanded = false;
    expect(panel.expanded).toBe('false');
    expect(panel.state.expanded).toBe(false);
  });

  it('can be expanded/collapsed when pressing Enter key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    // Expand
    panel.dispatchEvent(event);
    expect(panel.state.expanded).toBe(true);
    expect(panel.expanded).toBe('true');

    // Collapse
    panel.dispatchEvent(event);
    expect(panel.state.expanded).toBe(false);
    expect(panel.expanded).toBe('false');
  });

  it('can be expanded/collapsed when pressing Space key', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });

    // Expand
    panel.dispatchEvent(event);
    expect(panel.state.expanded).toBe(true);
    expect(panel.expanded).toBe('true');

    // Collapse
    panel.dispatchEvent(event);
    expect(panel.state.expanded).toBe(false);
    expect(panel.expanded).toBe('false');
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

  it('wont error caling api with no panel', () => {
    panel.pane = null;
    panel.expanded = true;
    panel.expanded = false;
    panel.expanded = true;
    expect(panel.expanded).toEqual('true');
  });

  it('supports setting mode', () => {
    accordion.mode = 'dark';
    expect(accordion.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    accordion.version = 'classic';
    expect(accordion.container.getAttribute('version')).toEqual('classic');
  });
});
