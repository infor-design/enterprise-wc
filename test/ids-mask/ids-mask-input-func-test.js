import IdsInput from '../../src/ids-input/ids-input';

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

  it('can mask an input field', () => {
    input.mask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    input.value = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';

    expect(input.value).toEqual('0123-4567-8901-2345');
  });
});
