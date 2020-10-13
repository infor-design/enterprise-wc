/**
 * @jest-environment jsdom
 */
import IdsToggleButton from '../../src/ids-button/ids-toggle-button';

describe('IdsToggleButton Component', () => {
  let btn;

  beforeEach(async () => {
    const elem = new IdsToggleButton();
    elem.id = 'test-button';
    elem.textOn = 'Test Button (On)';
    elem.iconOff = 'star-filled';
    elem.textOff = 'Test Button (Off)';
    elem.iconOff = 'star-outlined';
    elem.pressed = false;

    document.body.appendChild(elem);
    btn = document.querySelector('ids-toggle-button');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    btn = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    btn.remove();
    btn = new IdsToggleButton();
    document.body.appendChild(btn);

    expect(document.querySelectorAll('ids-toggle-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(btn.shouldUpdate).toBeTruthy();
  });

  it('can be pressed/unpressed', () => {
    btn.pressed = true;

    expect(btn.icon).toBe('star-filled');
    expect(btn.text).toBe('Test Button (On)');

    btn.pressed = false;

    expect(btn.icon).toBe('star-outlined');
    expect(btn.text).toBe('Test Button (Off)');

    btn.setAttribute('pressed', true);

    expect(btn.icon).toBe('star-filled');
    expect(btn.text).toBe('Test Button (On)');

    btn.setAttribute('pressed', false);

    expect(btn.icon).toBe('star-outlined');
    expect(btn.text).toBe('Test Button (Off)');
  });

  it('cannot be any other type but "default"', () => {
    btn.type = 'primary';

    expect(btn.getAttribute('type')).toBe(null);
    expect(btn.type).not.toBeDefined();
    expect(btn.state.type).toBe('default');
    expect(btn.button.classList.contains('primary')).toBeFalsy();

    btn.setAttribute('type', 'secondary');

    expect(btn.getAttribute('type')).toBe(null);
    expect(btn.type).not.toBeDefined();
    expect(btn.state.type).toBe('default');
    expect(btn.button.classList.contains('secondary')).toBeFalsy();
  });

  it('can set the "on" icon', () => {
    btn.iconOn = 'settings';

    expect(btn.getAttribute('icon-on')).toBe('settings');
    expect(btn.iconOn).toBe('settings');
    expect(btn.icons.on).toBe('settings');

    btn.setAttribute('icon-on', 'mail');

    expect(btn.getAttribute('icon-on')).toBe('mail');
    expect(btn.iconOn).toBe('mail');
    expect(btn.icons.on).toBe('mail');
  });

  it('can set the "off" icon', () => {

  });

  it('can set the "on" text', () => {

  });

  it('can set the "off" text', () => {

  });
});
