/**
 * @jest-environment jsdom
 */
import { IdsButton } from '../../src/ids-button/ids-button';

describe('IdsButton Component', () => {
  let btn;

  beforeEach(async () => {
    const elem = new IdsButton();
    elem.id = 'test-button';
    elem.text = 'Test Button';
    document.body.appendChild(elem);
    btn = document.querySelector('ids-button');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    btn = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    btn.remove();
    btn = new IdsButton();
    document.body.appendChild(btn);

    expect(document.querySelectorAll('ids-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(btn.shouldUpdate).toBeTruthy();
  });

  it('renders correctly', () => {
    const elem = new IdsButton();
    elem.cssClass = 'test-class';
    elem.disabled = true;
    elem.icon = 'add';
    elem.text = 'test';
    elem.state.type = 'icon';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders icons on the opposite side correctly', () => {
    const elem = new IdsButton();
    elem.id = 'test-button';
    elem.icon = 'settings';
    elem.iconAlign = 'end';
    elem.text = 'Settings';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('exposes its inner button component', () => {
    expect(btn.button).toBeDefined();
    expect(btn.button instanceof HTMLElement).toBeTruthy();
  });

  it('focuses the inner button component when told to focus', () => {
    btn.focus();

    expect(btn.shadowRoot.activeElement.isEqualNode(btn.button));
  });

  it('can be disabled/enabled', () => {
    btn.disabled = true;

    expect(btn.hasAttribute('disabled')).toBeFalsy();
    expect(btn.disabled).toBeTruthy();
    expect(btn.button.hasAttribute('disabled')).toBeTruthy();
    expect(btn.state.disabled).toBeTruthy();

    btn.disabled = false;

    expect(btn.hasAttribute('disabled')).toBeFalsy();
    expect(btn.disabled).toBeFalsy();
    expect(btn.button.hasAttribute('disabled')).toBeFalsy();
    expect(btn.state.disabled).toBeFalsy();
  });

  it('can be focusable or not', () => {
    btn.tabIndex = -1;

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(-1);
    expect(btn.button.getAttribute('tabindex')).toEqual('-1');
    expect(btn.state.tabIndex).toEqual(-1);

    btn.tabIndex = 0;

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);

    btn.setAttribute('tabindex', '-1');

    expect(btn.hasAttribute('focusable')).toBeFalsy();
    expect(btn.tabIndex).toEqual(-1);
    expect(btn.button.getAttribute('tabindex')).toEqual('-1');
    expect(btn.state.tabIndex).toEqual(-1);

    btn.setAttribute('tabindex', '0');

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);

    // Handles incorrect values
    btn.tabIndex = 'fish';

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);

    btn.tabIndex = -2;

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);
  });

  it('can add extra CSS classes to the button', () => {
    btn.cssClass = 'one two three';

    expect(btn.getAttribute('css-class')).toBe('one two three');
    expect(btn.cssClass.includes('two')).toBeTruthy();
    expect(btn.button.classList.contains('one')).toBeTruthy();

    btn.cssClass = ['four', 'five', 'six'];

    expect(btn.getAttribute('css-class')).toBe('four five six');
    expect(btn.cssClass.includes('four')).toBeTruthy();
    expect(btn.button.classList.contains('four')).toBeTruthy();

    // Setting to empty removes the attribute and the Button element classes
    btn.cssClass = '';

    expect(btn.hasAttribute('css-class')).toBeFalsy();
    expect(btn.cssClass.includes('four')).toBeFalsy();
    expect(btn.button.classList.contains('four')).toBeFalsy();
  });

  it('can change its type', () => {
    btn.type = 'primary';

    expect(btn.getAttribute('type')).toBe('primary');
    expect(btn.type).toBe('primary');
    expect(btn.button.classList.contains('btn-primary')).toBeTruthy();
    expect(btn.state.type).toBe('primary');

    btn.type = 'secondary';

    expect(btn.getAttribute('type')).toBe('secondary');
    expect(btn.type).toBe('secondary');
    expect(btn.button.classList.contains('btn-secondary')).toBeTruthy();
    expect(btn.state.type).toBe('secondary');

    btn.type = 'tertiary';

    expect(btn.getAttribute('type')).toBe('tertiary');
    expect(btn.type).toBe('tertiary');
    expect(btn.button.classList.contains('btn-tertiary')).toBeTruthy();
    expect(btn.state.type).toBe('tertiary');

    // Default buttons don't have additional styles
    btn.type = 'default';

    expect(btn.getAttribute('type')).toBe(null);
    expect(btn.type).toBe('default');
    expect(btn.button.classList.contains('default')).toBeFalsy();
    expect(btn.state.type).toBe('default');

    // Setting a bad type will make the type become the "default"
    btn.type = 'not-real';

    expect(btn.getAttribute('type')).toBe(null);
    expect(btn.type).toBe('default');
    expect(btn.button.classList.contains('default')).toBeFalsy();
    expect(btn.state.type).toBe('default');
  });

  it('can change its text via attribute', () => {
    expect(btn.text).toEqual('Test Button');
    expect(btn.state.text).toEqual('Test Button');

    btn.text = 'Awesome';

    expect(btn.text).toEqual('Awesome');
    expect(btn.state.text).toEqual('Awesome');

    btn.text = '';

    expect(btn.text).toEqual('');
    expect(btn.state.text).toEqual('');
  });

  it('can add/remove its icon', () => {
    btn.icon = 'settings';

    expect(btn.getAttribute('icon')).toBe('settings');
    expect(btn.icon).toBe('settings');
    expect(btn.querySelector('ids-icon').icon).toBe('settings');

    btn.icon = '';

    expect(btn.hasAttribute('icon')).toBeFalsy();
    expect(btn.icon).not.toBeDefined();
    expect(btn.querySelector('ids-icon')).toBe(null);
  });

  it('can align its icon differently', () => {
    btn.icon = 'settings';
    btn.iconAlign = 'end';

    expect(btn.button.classList.contains('align-icon-end')).toBeTruthy();

    btn.iconAlign = 'start';

    expect(btn.button.classList.contains('align-icon-start')).toBeTruthy();

    // Can't set a bad one
    btn.iconAlign = 'fish';

    expect(btn.button.classList.contains('align-icon-start')).toBeTruthy();
    expect(btn.button.classList.contains('align-icon-fish')).toBeFalsy();
  });

  it('can be an "icon-only" button', () => {
    btn.icon = 'settings';
    btn.text = '';

    expect(btn.getAttribute('icon')).toBe('settings');
    expect(btn.icon).toBe('settings');
    expect(btn.querySelector('ids-icon').icon).toBe('settings');
    expect(btn.button.classList.contains('ids-icon-button')).toBeTruthy();
    expect(btn.button.classList.contains('ids-button')).toBeFalsy();
  });

  it('can rerender', () => {
    btn.text = 'New';
    btn.icon = 'check';
    btn.disabled = true;
    btn.tabIndex = -1;
    btn.type = 'secondary';
    btn.cssClass = ['awesome'];
    btn.iconAlign = 'end';

    expect(btn.text).toEqual('New');
  });
});

// ============================================================
// Ripple Effect tests
describe('IdsButton ripple effect tests', () => {
  let btn;

  beforeEach(async () => {
    const elem = new IdsButton();
    elem.id = 'test-button';
    elem.text = 'Test Button';
    document.body.appendChild(elem);
    btn = document.querySelector('ids-button');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    btn = null;
  });

  it('creates a ripple when clicked (keyboard)', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    btn.button.dispatchEvent(event);

    expect(btn.button.querySelector('.ripple-effect')).toBeDefined();
  });

  it('creates a ripple when clicked (mouse)', () => {
    const event = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: btn.button,
      bubbles: true,
      cancelable: true,
      view: window
    });
    btn.button.dispatchEvent(event);

    expect(btn.button.querySelector('.ripple-effect')).toBeDefined();
  });

  it('creates a ripple when touched', () => {
    const event = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: btn
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    btn.button.dispatchEvent(event);

    expect(btn.button.querySelector('.ripple-effect')).toBeDefined();
  });

  it('cannot create ripples when disabled', () => {
    btn.disabled = true;
    btn.createRipple(0, 0);

    expect(btn.button.querySelector('.ripple-effect')).toBe(null);
  });

  it('only creates one ripple at a time', () => {
    btn.createRipple(0, 0);
    btn.createRipple(0, 0);

    expect(btn.button.querySelectorAll('.ripple-effect').length).toEqual(1);
  });

  it('only creates one ripple if a touch event is followed by a click event', () => {
    // Touch event will always occur first
    const touchEvent = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: btn
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    btn.button.dispatchEvent(touchEvent);

    // Click Event occurs second
    const clickEvent = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: btn.button,
      bubbles: true,
      cancelable: true,
      view: window
    });
    btn.button.dispatchEvent(clickEvent);

    expect(btn.button.querySelectorAll('.ripple-effect').length).toEqual(1);
  });

  it('can get ripple offsets from its physical dimensions', () => {
    const c = btn.button;

    // 150x40 are roughly the dimensions of a standard IDS Button with some text and an icon
    c.getBoundingClientRect = jest.fn(() => ({
      x: 0,
      y: 0,
      left: 0,
      right: 150,
      top: 0,
      bottom: 40,
      width: 150,
      height: 140
    }));

    // Passing { x: 0, y: 0 } causes the ripple effect to center itself inside the button
    let rippleOffsets = btn.getRippleOffsets(0, 0);

    expect(rippleOffsets.x).toEqual(-125);
    expect(rippleOffsets.y).toEqual(-125);

    // Center of the ripple will be at { x: 1 y: 1 } inside the button
    rippleOffsets = btn.getRippleOffsets(1, 1);

    expect(rippleOffsets.x).toEqual(-124);
    expect(rippleOffsets.y).toEqual(-124);
  });

  it('removes the ripple effect HTML when it completes', (done) => {
    const event = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: btn.button,
      bubbles: true,
      cancelable: true,
      view: window
    });
    btn.button.dispatchEvent(event);

    expect(btn.button.querySelector('.ripple-effect')).toBeDefined();

    setTimeout(() => {
      expect(btn.button.querySelector('.ripple-effect')).toBe(null);
      done();
    }, 2000);
  });
});
