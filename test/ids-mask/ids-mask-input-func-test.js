/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/ids-input/ids-input';
import { autoCorrectedDatePipe, dateMask, numberMask } from '../../src/ids-mask/ids-masks';

const CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const PHONE_NUMBER_MASK = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

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

  it('has a connection to the global Mask API', () => {
    const api = input.maskAPI;

    expect(typeof api.process).toBe('function');
  });

  it('doesn\'t render any changes if masking fails', () => {
    input.mask = () => false;
    input.value = '12345';

    expect(input.value).toEqual('12345');
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

  it('can format numbers', () => {
    input.mask = numberMask;
    input.maskOptions = {
      locale: 'en-US',
      allowDecimal: true,
      allowNegative: true,
      decimalLimit: 2,
      integerLimit: 4,
    };
    input.value = '123456';

    // If decimal isn't added manually, the decimal and values after it are thrown out
    expect(input.value).toEqual('1234');

    input.value = '1234.56';

    expect(input.value).toEqual('1234.56');
  });

  it('can use the shorthand "number" to actviate the built-in number mask', () => {
    input.mask = 'number';

    expect(input.mask.toString()).toEqual(numberMask.toString());
  });

  it('can format dates', () => {
    input.mask = dateMask;
    input.maskPipe = autoCorrectedDatePipe;
    input.maskOptions = {
      format: 'M/d/yyyy',
      symbols: {
        separator: '/'
      }
    };
    input.value = '1111111111';

    expect(input.value).toEqual('11/11/1111');

    input.value = '';
    input.value = '1/1/2020';

    expect(input.value).toEqual('1/1/2020');

    // Change the date format
    input.maskOptions.format = 'MM/dd/yyyy';
    input.value = '';
    input.value = '01012020';

    expect(input.value).toEqual('01/01/2020');
  });

  it('can use the shorthand "date" to actviate the built-in date mask', () => {
    input.mask = 'date';

    expect(input.mask.toString()).toEqual(dateMask.toString());
  });

  it('can convert a string-based mask to an array internally', () => {
    input.mask = '["(", /[1-9]/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]';
    const convertedMask = input.mask;

    expect(Array.isArray(convertedMask)).toBeTruthy();
    expect(convertedMask.length).toBe(14);
  });

  it('cannot set `maskOptions` to an invalid type', () => {
    input.maskOptions = [1, 2, 3];

    expect(typeof input.maskOptions).toBe('object');

    input.maskOptions = 1;

    expect(typeof input.maskOptions).toBe('object');
  });

  it('cannot set `maskPipe` to an invalid type', () => {
    input.maskPipe = [1, 2, 3];

    expect(input.maskPipe).toBeUndefined();
  });

  it('can enable/disable guides', () => {
    input.maskGuide = true;
    input.mask = PHONE_NUMBER_MASK;
    input.value = '123';

    expect(input.maskGuide).toBeTruthy();
    expect(input.value).toEqual('(123) ___-____');

    input.maskGuide = false;
    input.value = '123';

    expect(input.maskGuide).toBeFalsy();
    expect(input.value).toEqual('(123');
  });

  it('can retain character positions with guides enabled', () => {
    input.maskGuide = true;
    input.maskRetainPositions = true;
    input.mask = PHONE_NUMBER_MASK;
    input.value = '(123) 456-7890';

    expect(input.maskRetainPositions).toBeTruthy();
    expect(input.value).toEqual('(123) 456-7890');

    // Simulates an input event after selecting the "456" with the text caret
    input.safelySetSelection(input.shadowRoot, 6, 9);
    const inputEvent = new Event('input', { bubbles: true, data: '___' });
    input.input.value = '(123) ___-7890'; // Simulate input value changing
    input.dispatchEvent(inputEvent);

    expect(input.value).toEqual('(123) ___-7890');
  });

  it('adds a suffix to values that don\'t yet contain the suffix', () => {
    input.maskOptions = { suffix: '%' };
    input.mask = [/\d/, /\d/, /\d/];
    input.value = '10';

    expect(input.value).toBe('10%');

    input.value = '100';

    expect(input.value).toBe('100%');
  });

  // @TODO revisit, maybe better ways to get coverage here
  it('can process with a blank value', () => {
    input.mask = [/[*]/];
    input.processMaskWithCurrentValue();

    expect(input.value).toBe('');

    input.processMaskFromProperty();

    expect(input.value).toBe('');

    input.processMask(undefined, {}, undefined);

    expect(input.value).toBe('');
  });
});
