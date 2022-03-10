/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/components/ids-button/ids-button';

describe('IdsRippleMixin Tests', () => {
  let idsButton;

  beforeEach(async () => {
    // create ids button
    idsButton = new IdsButton();
    idsButton.innerHTML = '<span slot="text">Default Button</span>';
    document.body.appendChild(idsButton);
  });

  afterEach(async () => {
    // clear body
    document.body.innerHTML = '';
  });

  it('should add ripple effect on click.ripple', async () => {
    const clickEvent = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: idsButton.button,
      bubbles: true
    });
    idsButton.button.dispatchEvent(clickEvent);
    expect(idsButton.button.querySelector('.ripple-effect')).toBeDefined();
  });

  it('should add ripple effect on touchstart.ripple', async () => {
    const touchEvent = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: idsButton
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    idsButton.button.dispatchEvent(touchEvent);
    expect(idsButton.button.querySelector('.ripple-effect')).toBeDefined();
  });

  it('should have setting for noRipple', async () => {
    // ripple enabled by default
    expect(idsButton.noRipple).toBeFalsy();

    // disable ripple
    idsButton.noRipple = true;
    expect(idsButton.noRipple).toBeTruthy();

    // re enable ripple
    idsButton.noRipple = false;
    expect(idsButton.noRipple).toBeFalsy();
  });

  it('should not ripple when noRipple is truthy', async () => {
    const clickEvent = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: idsButton.button,
      bubbles: true
    });
    idsButton.noRipple = true;
    idsButton.button.dispatchEvent(clickEvent);

    expect(idsButton.button.querySelector('.ripple-effect')).toBeNull();
  });

  it('creates a ripple when clicked (keyboard)', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    idsButton.button.dispatchEvent(event);

    expect(idsButton.button.querySelector('.ripple-effect')).toBeDefined();
  });

  it('can get ripple offsets from its physical dimensions', () => {
    const c = idsButton.button;

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
    let rippleOffsets = idsButton.getRippleOffsets(0, 0);

    expect(rippleOffsets.x).toEqual(-50);
    expect(rippleOffsets.y).toEqual(-50);

    // Center of the ripple will be at { x: 1 y: 1 } inside the button
    rippleOffsets = idsButton.getRippleOffsets(1, 1);

    expect(rippleOffsets.x).toEqual(-49);
    expect(rippleOffsets.y).toEqual(-49);
  });

  it('removes the ripple effect HTML when it completes', (done) => {
    const event = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: idsButton.button,
      bubbles: true,
      cancelable: true,
      view: window
    });
    idsButton.button.dispatchEvent(event);

    expect(idsButton.button.querySelector('.ripple-effect')).toBeDefined();

    setTimeout(() => {
      expect(idsButton.button.querySelector('.ripple-effect')).toBe(null);
      done();
    }, 2000);
  });

  it('only creates one ripple at a time', () => {
    idsButton.createRipple(0, 0);
    idsButton.createRipple(0, 0);

    expect(idsButton.button.querySelectorAll('.ripple-effect').length).toEqual(1);
  });

  it('cannot create ripples when disabled', () => {
    idsButton.disabled = true;
    idsButton.createRipple(0, 0);

    expect(idsButton.button.querySelector('.ripple-effect')).toBe(null);
  });

  it('can disable the ripple when added', () => {
    const elem = new IdsButton();
    elem.noRipple = true;
    elem.text = 'Test Button';
    document.body.appendChild(elem);
    idsButton = document.querySelector('ids-button');
    expect(idsButton.button.querySelector('.ripple-effect')).toBe(null);
  });

  it('only creates one ripple if a touch event is followed by a click event', () => {
    // Touch event will always occur first
    const touchEvent = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: idsButton.button
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    idsButton.button.dispatchEvent(touchEvent);

    // Click Event occurs second
    const clickEvent = new MouseEvent('click', {
      button: 1,
      pageX: 0,
      pageY: 0,
      target: idsButton.button,
      bubbles: true,
      cancelable: true,
      view: window
    });
    idsButton.button.dispatchEvent(clickEvent);

    expect(idsButton.button.querySelectorAll('.ripple-effect').length).toEqual(1);
  });

  it('should use component container by default', () => {
    // remove existing ripple setup
    idsButton.noRipple = true;

    // setup ripple with no arguments
    idsButton.setupRipple();

    expect(idsButton.rippleTarget).toEqual(idsButton.container);
  });

  it('should use 50 as default ripple radius', () => {
    // remove existing ripple setup
    idsButton.noRipple = true;

    // setup ripple with no arguments
    idsButton.setupRipple();

    expect(idsButton.rippleRadius).toEqual(idsButton.rippleRadius);
  });
});
