/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/components/ids-button/ids-button';

describe('IdsHideFocusMixin Tests', () => {
  let button: any;

  beforeEach(() => {
    button = new IdsButton();
    button.innerHTML = '<span>Default Button</span>';
    document.body.appendChild(button);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should add/remove CSS class on property/attribute change', () => {
    expect(button.hideFocus).toBeTruthy();
    expect(button.container.classList.contains('hide-focus')).toBeTruthy();

    button.hideFocus = false;

    expect(button.hideFocus).toBeFalsy();
    expect(button.getAttribute('hide-focus')).toEqual('false');
    expect(button.container.classList.contains('hide-focus')).toBeFalsy();
  });

  test('should add/remove CSS class on click/focus', async () => {
    button.focus();
    expect(button.container.classList.contains('hide-focus')).toBeFalsy();
    button.dispatchEvent(new MouseEvent('mousedown'));
    expect(button.container.classList.contains('hide-focus')).toBeTruthy();
  });
});
