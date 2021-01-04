/**
 * @jest-environment jsdom
 */
import IdsExpandableArea from '../../src/ids-expandable-area/ids-expandable-area';
import IdsToggleButton from '../../src/ids-toggle-button/ids-toggle-button';

describe('IdsExpandableArea Component', () => {
  let el;

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
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

  it('renders with type of toggle-btn', () => {
    let expander;
    el.type = 'toggle-btn';
    el.appendChild(new IdsToggleButton());
    expander = el.querySelector('ids-toggle-button');
    expect(expander).toBeTruthy();
  });

  it('renders with type of null', () => {
    let expander;
    el.type = null;
    expander = el.expander.classList.contains('ids-expandable-area-expander');
    expect(expander).toBeTruthy();
  });

  it('renders with IdsToggleButton as expander', () => {
    el.setAttribute('type', 'toggle-btn');
    el.appendChild(new IdsToggleButton());
    el.expander = document.querySelector('ids-toggle-button');
    expect(el.expander).toBeTruthy();
  });

  it('renders with <a> tag as expander', () => {
    el.type = null;
    expect(el.expander.classList.contains('ids-expandable-area-expander')).toBeTruthy();
  });

  it('can change set its aria-expanded attribute', () => {
    el.state.expanded = true;
    el.expander.setAttribute('aria-expanded', el.state.expanded);

    expect(el.expander.getAttribute('aria-expanded')).toBe('true');
  });

  it('can set its data-expanded attribute', () => {
    el.state.expanded = true;
    el.pane.setAttribute('data-expanded', el.state.expanded);

    expect(el.pane.getAttribute('data-expanded')).toBe('true');
  });

  it('can change its expanded property', () => {
    expect(el.getAttribute('expanded')).toBe('false');
    expect(el.expanded).toBe('false');

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

  it('can change the height of the pane', () => {
    el.pane.style.height = `100px`;

    requestAnimationFrame(() => {
      el.pane.style.height = `100px`;
      requestAnimationFrame(() => {
        el.pane.style.height = `0px`;
      });
    })
    expect(el.pane.style.height).toEqual('0px');
  });

  it('can render different templates', () => {
    const template1 = `<div class="ids-expandable-area-1"></div>`;
    const template2 = `<div class="ids-expandable-area-2"></div>`;
    const instance = new IdsExpandableArea();
    const spy = jest.spyOn(instance, 'template');

    spy.mockReturnValue(template1);
    expect(instance.template(template1)).toBeTruthy();

    el.type = 'toggle-btn';
    spy.mockReturnValue(template2);
    expect(instance.template(template2)).toBeTruthy();

    spy.mockRestore();
  });
});
