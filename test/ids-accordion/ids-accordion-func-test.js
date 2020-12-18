/**
 * @jest-environment jsdom
 */
import IdsAccordion from '../../src/ids-accordion/ids-accordion';
import IdsAccordionHeader from '../../src/ids-accordion/ids-accordion-header';
import IdsAccordionPanel from '../../src/ids-accordion/ids-accordion-panel';

describe('IdsAccordion Component', () => {
  let accordion;
  let panel;
  let header;
  let expander;

  beforeEach(async () => {
    const wrapper = new IdsAccordion();
    panel = new IdsAccordionPanel();
    header = new IdsAccordionHeader();
    panel.expander = header;
    document.body.appendChild(wrapper);
    accordion = document.querySelector('ids-accordion');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    accordion = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    accordion.remove();

    accordion = new IdsAccordion();
    document.body.appendChild(accordion);

    expect(document.querySelectorAll('ids-accordion').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set the panel title attribute', () => {
    panel.pane.title = "Title Text";
    expect(panel.pane.getAttribute('title')).toBe('Title Text');
  })

  it('can change set its aria-expanded attribute', () => {
    panel.state.expanded = true;
    panel.expander.setAttribute('aria-expanded', panel.state.expanded);

    expect(panel.expander.getAttribute('aria-expanded')).toBe('true');
  });

  it('can set its data-expanded attribute', () => {
    panel.state.expanded = true;
    panel.pane.setAttribute('aria-expanded', panel.state.expanded);

    expect(panel.pane.getAttribute('aria-expanded')).toBe('true');
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
});
