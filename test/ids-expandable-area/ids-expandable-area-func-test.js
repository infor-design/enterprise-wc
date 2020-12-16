/**
 * @jest-environment jsdom
 */
import IdsExpandableArea from '../../src/ids-expandable-area/ids-expandable-area';

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
    el.type = 'toggle-btn';

    expect(el.getAttribute('type')).toBe('toggle-btn');
    expect(el.type).toBe('toggle-btn');

    // Setting a bad type will make the type become null
    el.type = 'bad-name';

    expect(el.getAttribute('type')).toBe(null);
    expect(el.type).toBe(null);
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
