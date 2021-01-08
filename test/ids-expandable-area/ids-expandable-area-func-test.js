/**
 * @jest-environment jsdom
 */
import IdsExpandableArea from '../../src/ids-expandable-area/ids-expandable-area';
import IdsToggleButton from '../../src/ids-toggle-button/ids-toggle-button';

describe('IdsExpandableArea Component', () => {
  let el;
  const EXPANDABLE_AREA_TYPES = [
    'toggle-btn'
  ];

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    const elem = new IdsExpandableArea();
    document.body.appendChild(elem);
    el = document.querySelector('ids-expandable-area');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
    window.requestAnimationFrame.mockRestore();
  });

  it('renders correctly', () => {
    expect(el.outerHTML).toMatchSnapshot();
    el.type = 'toggle-btn';
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    el.remove();
    el = new IdsExpandableArea();
    document.body.appendChild(el);

    expect(document.querySelectorAll('ids-expandable-area').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can change its type property', () => {
    const rootEl = el.shadowRoot.querySelector('.ids-expandable-area');

    expect(rootEl.getAttribute('type')).toBe(null);
    expect(el.getAttribute('type')).toBe(null);

    el.type = 'toggle-btn';
    rootEl.setAttribute('type', 'toggle-btn');

    expect(rootEl.getAttribute('type')).toBe('toggle-btn');
    expect(el.getAttribute('type')).toBe('toggle-btn');

    el.type = 'bad-name';
    rootEl.setAttribute('type', 'bad-name');

    expect(rootEl.getAttribute('type')).toBe('bad-name');
    expect(el.getAttribute('type')).toBe('null');
  });

  it('can change its expanded property', () => {
    const rootEl = el.shadowRoot.querySelector('.ids-expandable-area');

    rootEl.setAttribute('expanded', true);
    el.expanded = true;

    expect(rootEl.getAttribute('expanded')).toBe('true');
    expect(el.getAttribute('expanded')).toBe('true');

    rootEl.setAttribute('expanded', false);
    el.expanded = false;

    expect(rootEl.getAttribute('expanded')).toBe('false');
    expect(el.getAttribute('expanded')).toBe('false');
  });

  it('renders with IdsToggleButton as expander', () => {
    let expander;
    el.type = 'toggle-btn'
    expander = new IdsToggleButton();
    expect(expander.classList).not.toContain('ids-expandable-area-expander');

    el.type = null;
    expander = el.expander;
    expect(expander.classList).toContain('ids-expandable-area-expander');
  });

  it('can change set its aria-expanded attribute', () => {
    el.state.expanded = true;
    el.expander.setAttribute('aria-expanded', el.state.expanded);

    expect(el.expander.getAttribute('aria-expanded')).toBe('true');
  });

  it('can be expanded/collapsed when clicked (mouse)', () => {
    el.type = null;

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

    // Change type to 'toggle-btn'
    el.type = 'toggle-btn';
    el.state.expanded = false;
    el.expanded = false;

    const event2 = new MouseEvent('click', {
      target: el.expander,
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Expand
    el.expander.dispatchEvent(event2);
    expect(el.state.expanded).toBe(true);
    expect(el.expanded).toBe('true');

    // Collapse
    el.expander.dispatchEvent(event2);
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

  it('can change the height of the pane', () => {
    el.pane.style.height = `100px`;

    requestAnimationFrame(() => {
      el.pane.style.height = `100px`;
      requestAnimationFrame(() => {
        el.pane.style.height = `0px`;
      });
    });
    expect(el.pane.style.height).toEqual('0px');
  });

  it('can render different templates', () => {
    const rootEl = el.shadowRoot.querySelector('.ids-expandable-area');
    const header = rootEl.querySelector('.ids-expandable-area-header')

    el.type = null;
    header.removeAttribute('data-expander');
    el.template();
    expect(header.getAttribute('data-expander')).toBe(null);

    el.type = 'toggle-btn';
    header.setAttribute('data-expander', 'header');
    el.template();
    expect(header.getAttribute('data-expander')).toBe('header');
  });
});
