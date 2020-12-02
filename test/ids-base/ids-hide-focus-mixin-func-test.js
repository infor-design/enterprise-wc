/**
 * @jest-environment jsdom
 */
import { IdsHideFocusMixin } from '../../src/ids-base/ids-hide-focus-mixin';
import IdsCheckbox from '../../src/ids-checkbox/ids-checkbox';

let cb;

describe('IdsHideFocusMixin Tests', () => {
  beforeEach(async () => {
    const elem = new IdsCheckbox();
    document.body.appendChild(elem);
    cb = document.querySelector('ids-checkbox');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('should focusin and focusout', () => {
    cb.destroyHideFocus();
    document.body.innerHTML = '';
    const elem = new IdsCheckbox();
    document.body.appendChild(elem);
    cb = document.querySelector('ids-checkbox');

    expect(cb.input.classList).toContain('hide-focus');
    let evt = 'focusin';
    let event = new Event(evt);
    cb.input.dispatchEvent(event);
    expect(cb.input.classList).not.toContain('hide-focus');
    evt = 'focusout';
    event = new Event(evt);
    cb.input.dispatchEvent(event);
    expect(cb.input.classList).toContain('hide-focus');
  });

  it('should handle click', () => {
    expect(cb.input.classList).toContain('hide-focus');
    cb.input.classList.remove('hide-focus');
    expect(cb.input.classList).not.toContain('hide-focus');
    const event = new MouseEvent('mousedown', { bubbles: true });
    cb.input.dispatchEvent(event);
    expect(cb.input.classList).toContain('hide-focus');
  });
});
