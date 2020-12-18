/**
 * @jest-environment jsdom
 */
import IdsExpandableArea from '../../src/ids-expandable-area/ids-expandable-area';
import IdsToggleButton from '../../src/ids-toggle-button/ids-toggle-button';

describe('IdsExpandableArea Component', () => {
  let el;

  beforeEach(async () => {
    const elem = new IdsExpandableArea();
    elem.expanded = false;
    elem.state.expanded = false;
    elem.type = null;

    document.body.appendChild(elem);
    el = document.querySelector('ids-expandable-area');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    el.remove();
    el = new IdsExpandableArea();
    document.body.appendChild(el);

    expect(document.querySelectorAll('ids-expandable-area').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can change its type', () => {
    el.type = 'fake-name';

    expect(el.getAttribute('type')).toBe(null);
    expect(el.type).toBe(null);
    expect(el.expander.classList.contains('ids-expandable-area-expander'))

    el.type = 'toggle-btn';
    el.expander = new IdsToggleButton();

    expect(el.getAttribute('type')).toBe('toggle-btn');
    expect(el.type).toBe('toggle-btn');
    expect(el.expander.classList.contains('ids-expandable-area-expander')).toBeFalsy();
  });

  it('can change set its aria-expanded attribute', () => {
    el.state.expanded = true;
    el.expander.setAttribute('aria-expanded', el.state.expanded);

    expect(el.expander.getAttribute('aria-expanded')).toBe('true');
  });

  it('can set its data-expanded attribute', () => {
    el.state.expanded = true;
    el.pane.setAttribute('aria-expanded', el.state.expanded);

    expect(el.pane.getAttribute('aria-expanded')).toBe('true');
  });

  it('can set its expanded attribute', () => {
    el.expanded = true;
    el.state.expanded = true;

    expect(el.getAttribute('expanded')).toBe('true');
    expect(el.expanded).toBe('true');

    el.expanded = false;
    el.state.expanded = false;

    expect(el.getAttribute('expanded')).toBe('false');
    expect(el.expanded).toBe('false');
  });

  it('can be expanded/collapsed when clicked (mouse)', () => {
    const event = new MouseEvent('click', {
      target: el.expander,
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Expand
    el.expander.dispatchEvent(event);
    expect(el.state.expanded).toBe(true);
    expect(el.expanded).toBe('true');

    // Collapse
    el.expander.dispatchEvent(event);
    expect(el.state.expanded).toBe(false);
    expect(el.expanded).toBe('false');
  });

  it('can be expanded/collapsed when touched', () => {
    const event = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: el.expander
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Expand
    el.expander.dispatchEvent(event);
    expect(el.state.expanded).toBe(true);
    expect(el.expanded).toBe('true');

    // Collapse
    el.expander.dispatchEvent(event);
    expect(el.state.expanded).toBe(false);
    expect(el.expanded).toBe('false');
  });
});
