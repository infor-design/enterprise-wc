import MaskAPI from '../../src/ids-mask/ids-mask-api';

describe('IdsMaskAPI', () => {
  it('can be invoked', () => {
    const api = new MaskAPI();

    expect(api).toBeDefined();
  });

  it('should process patterns', () => {
    const api = new MaskAPI();
    const text = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';
    const opts = {
      pattern: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      selection: {
        start: 0
      }
    };

    // Checks a basic "credit card" pattern mask
    const result = api.process(text, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('0123-4567-8901-2345');
  });
});
