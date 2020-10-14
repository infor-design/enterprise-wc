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

    // Disabling the "on" icon sets it to the default "star-filled"
    btn.iconOn = '';

    expect(btn.hasAttribute('icon-on')).toBeFalsy();
    expect(btn.iconOn).toBe('star-filled');
    expect(btn.icons.on).toBe('star-filled');
  });

  it('can set the "off" icon', () => {
    btn.iconOff = 'settings';

    expect(btn.getAttribute('icon-off')).toBe('settings');
    expect(btn.iconOff).toBe('settings');
    expect(btn.icons.off).toBe('settings');

    btn.setAttribute('icon-off', 'mail');

    expect(btn.getAttribute('icon-off')).toBe('mail');
    expect(btn.iconOff).toBe('mail');
    expect(btn.icons.off).toBe('mail');

    // Disabling the "off" icon sets it to the default "star-outlined"
    btn.iconOff = '';

    expect(btn.hasAttribute('icon-off')).toBeFalsy();
    expect(btn.iconOff).toBe('star-outlined');
    expect(btn.icons.off).toBe('star-outlined');
  });

  it('can set the "on" text', () => {
    btn.textOn = 'Button is on';

    expect(btn.getAttribute('text-on')).toBe('Button is on');
    expect(btn.textOn).toBe('Button is on');
    expect(btn.texts.on).toBe('Button is on');

    btn.setAttribute('text-on', 'Definitely on');

    expect(btn.getAttribute('text-on')).toBe('Definitely on');
    expect(btn.textOn).toBe('Definitely on');
    expect(btn.texts.on).toBe('Definitely on');

    btn.textOn = '';

    expect(btn.hasAttribute('text-on')).toBeFalsy();
    expect(btn.textOn).toBe('');
    expect(btn.texts.on).toBe('');
  });

  it('can set the "off" text', () => {
    btn.textOff = 'Button is off';

    expect(btn.getAttribute('text-off')).toBe('Button is off');
    expect(btn.textOff).toBe('Button is off');
    expect(btn.texts.off).toBe('Button is off');

    btn.setAttribute('text-off', 'Definitely off');

    expect(btn.getAttribute('text-off')).toBe('Definitely off');
    expect(btn.textOff).toBe('Definitely off');
    expect(btn.texts.off).toBe('Definitely off');

    btn.textOff = '';

    expect(btn.hasAttribute('text-off')).toBeFalsy();
    expect(btn.textOff).toBe('');
    expect(btn.texts.off).toBe('');
  });
});
