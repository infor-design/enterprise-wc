/**
 * @jest-environment jsdom
 */
import IdsToggleButton from '../../src/components/ids-toggle-button/ids-toggle-button';

describe('IdsToggleButton Component', () => {
  let btn: any;

  beforeEach(async () => {
    const elem: any = new IdsToggleButton();
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

  test('can render via document.createElement (append early)', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = document.createElement('ids-toggle-button');

    document.body.appendChild(elem);
    elem.id = 'test-button';
    elem.textOn = 'Test Button (On)';
    elem.iconOff = 'star-filled';
    elem.textOff = 'Test Button (Off)';
    elem.iconOff = 'star-outlined';

    expect(errors).not.toHaveBeenCalled();
  });

  test('can be pressed/unpressed', () => {
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

  test('can be toggled', () => {
    btn.toggle();

    expect(btn.icon).toBe('star-filled');
    expect(btn.text).toBe('Test Button (On)');

    btn.toggle();

    expect(btn.icon).toBe('star-outlined');
    expect(btn.text).toBe('Test Button (Off)');
  });

  test('cannot be any other appearance but "default"', () => {
    btn.appearance = 'primary';

    expect(btn.getAttribute('appearance')).toBe(null);
    expect(btn.appearance).toBe('default');
    expect(btn.state.appearance).toBe('default');
    expect(btn.button.classList.contains('primary')).toBeFalsy();

    btn.setAttribute('appearance', 'secondary');

    expect(btn.getAttribute('appearance')).toBe(null);
    expect(btn.appearance).toBe('default');
    expect(btn.state.appearance).toBe('default');
    expect(btn.button.classList.contains('secondary')).toBeFalsy();
  });

  test('can set the "on" icon', () => {
    btn.iconOn = 'settings';

    expect(btn.getAttribute('icon-on')).toBe('settings');
    expect(btn.iconOn).toBe('settings');

    btn.setAttribute('icon-on', 'mail');

    expect(btn.getAttribute('icon-on')).toBe('mail');
    expect(btn.iconOn).toBe('mail');

    // Disabling the "on" icon sets it to the default "star-filled"
    btn.iconOn = '';

    expect(btn.hasAttribute('icon-on')).toBeFalsy();
    expect(btn.iconOn).toBe('star-filled');
  });

  test('can set the "off" icon', () => {
    btn.iconOff = 'settings';

    expect(btn.getAttribute('icon-off')).toBe('settings');
    expect(btn.iconOff).toBe('settings');

    btn.setAttribute('icon-off', 'mail');

    expect(btn.getAttribute('icon-off')).toBe('mail');
    expect(btn.iconOff).toBe('mail');

    // Disabling the "off" icon sets it to the default "star-outlined"
    btn.iconOff = '';

    expect(btn.hasAttribute('icon-off')).toBeFalsy();
    expect(btn.iconOff).toBe('star-outlined');
  });

  test('can set the "on" text', () => {
    btn.textOn = 'Button is on';

    expect(btn.getAttribute('text-on')).toBe('Button is on');
    expect(btn.textOn).toBe('Button is on');

    btn.setAttribute('text-on', 'Definitely on');

    expect(btn.getAttribute('text-on')).toBe('Definitely on');
    expect(btn.textOn).toBe('Definitely on');

    btn.textOn = '';

    expect(btn.hasAttribute('text-on')).toBeFalsy();
    expect(btn.textOn).toBe('');
  });

  test('can set the "off" text', () => {
    btn.textOff = 'Button is off';

    expect(btn.getAttribute('text-off')).toBe('Button is off');
    expect(btn.textOff).toBe('Button is off');

    btn.setAttribute('text-off', 'Definitely off');

    expect(btn.getAttribute('text-off')).toBe('Definitely off');
    expect(btn.textOff).toBe('Definitely off');

    btn.textOff = '';

    expect(btn.hasAttribute('text-off')).toBeFalsy();
    expect(btn.textOff).toBe('');
  });
});
