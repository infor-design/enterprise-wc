/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/ids-input/ids-input';

const CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

describe('IdsInput (Masked)', () => {
  let input;

  beforeEach(async () => {
    const elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsInput();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-input').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can mask an input field by changing its `value` property', () => {
    input.mask = CREDIT_CARD_MASK;
    input.value = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';

    expect(input.value).toEqual('0123-4567-8901-2345');
  });

  it('can mask an input field by setting a `value` attribute', () => {
    input.mask = CREDIT_CARD_MASK;
    input.setAttribute('value', 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x');

    expect(input.value).toEqual('0123-4567-8901-2345');
  });

  it('can mask an input field by triggering an `input` event', () => {
    const inputEvent = new Event('input', {
      bubbles: true
    });

    input.mask = CREDIT_CARD_MASK;
    input.input.value = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x'; // Simulate input value changing
    input.dispatchEvent(inputEvent);

    expect(input.value).toEqual('0123-4567-8901-2345');
  });
});
