import MaskAPI from '../../src/ids-mask/ids-mask-api';
import { CARET_TRAP, PLACEHOLDER_CHAR } from '../../src/ids-mask/ids-mask-common';

let api;

describe('IdsMaskAPI', () => {
  beforeEach(() => {
    api = new MaskAPI();
  });

  afterEach(() => {
    api = null;
  });

  it('can be invoked', () => {
    expect(api).toBeDefined();
  });

  it('should process patterns', () => {
    // Checks a basic "credit card" pattern mask
    const text = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';
    const opts = {
      pattern: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    };
    const result = api.process(text, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('0123-4567-8901-2345');
  });

  it('can identify caret traps', () => {
    const testMask = [/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, CARET_TRAP, '.', CARET_TRAP, /\d/, /\d/];
    const result = api.processCaretTraps(testMask);

    expect(result).toBeDefined();
    expect(result.maskWithoutCaretTraps).toBeDefined();
    expect(result.maskWithoutCaretTraps).toEqual(expect.arrayContaining([/\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, '.', /\d/, /\d/]));
    expect(result.indexes).toBeDefined();
    expect(result.indexes).toEqual(expect.arrayContaining([13, 14]));
  });

  it('should retain text caret location in simple mask results', () => {
    const opts = {
      pattern: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      selection: {
        start: 1
      }
    };

    // Run the masking process
    const result = api.process('1', opts);

    // Run the caret adjustment
    const adjustCaretOpts = {
      previousMaskResult: '',
      previousPlaceholder: '',
      conformedValue: result.conformedValue,
      placeholder: result.placeholder,
      rawValue: '1',
      caretPos: result.caretPos,
      placeholderChar: PLACEHOLDER_CHAR,
      caretTrapIndexes: []
    };

    const caretPos = api.adjustCaretPosition(adjustCaretOpts);

    // Under normal conditions where there are no caret traps and automatic adjustments due
    // to character literals, this will remain the same as the input value.
    expect(caretPos).toEqual(1);
  });

  it('should adjust text caret placement when adding character literals', () => {
    const text = '1234';
    const opts = {
      pattern: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      selection: {
        start: 4
      }
    };

    // Run the masking process
    const result = api.process(text, opts);

    // Run the caret adjustment
    const adjustCaretOpts = {
      previousMaskResult: '',
      previousPlaceholder: '',
      conformedValue: result.conformedValue,
      placeholder: result.placeholder,
      rawValue: text,
      caretPos: result.caretPos,
      placeholderChar: PLACEHOLDER_CHAR,
      caretTrapIndexes: []
    };

    const caretPos = api.adjustCaretPosition(adjustCaretOpts);

    // Caret should have moved one index forward to account for the dash added
    expect(caretPos).toEqual(5);
  });

  it('can safely select an input\'s value', () => {
    expect(api.getSafeRawValue(300)).toEqual('300');
    expect(api.getSafeRawValue('straight up text')).toEqual('straight up text');
    expect(api.getSafeRawValue(`${300}4545`)).toEqual('3004545');
    expect(api.getSafeRawValue(null)).toEqual('');
    expect(api.getSafeRawValue(undefined)).toEqual('');
  });

  // ===============
  // Pass Coverage
  // ===============

  it('cannot process non-strings', () => {
    const opts = {
      pattern: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    };

    try {
      api.process(1234, opts);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('wraps a mask array returned by a mask function in an object with meta-data', () => {
    // This is a mask function that simply returns the raw value split up
    const testMask = (rawValue) => rawValue.split('');
    const opts = {
      pattern: testMask
    };
    const result = api.process('12345', opts);

    expect(result.maskResult).toBeTruthy();
  });

  it('doesn\'t process against mask functions that return `false`', () => {
    const testMask = () => false;
    const opts = {
      pattern: testMask
    };
    const result = api.process('12345', opts);

    expect(result.maskResult).toBeFalsy();
  });

  it('ignores modified values from a failed pipe function', () => {
    const testMask = (rawValue) => rawValue.split('');
    const testPipe = () => { throw new Error(); };
    const opts = {
      pattern: testMask,
      pipe: testPipe
    };
    const result = api.process('12345', opts);

    expect(result.pipeResult).toBeFalsy();
  });

  it('handles string results from pipe functions', () => {
    const testMask = (rawValue) => rawValue.split('');
    const testPipe = (maskResult) => maskResult.conformedValue;
    const opts = {
      pattern: testMask,
      pipe: testPipe
    };
    const result = api.process('12345', opts);

    expect(result.pipeResult).toBeTruthy();
    expect(result.pipedValue).toBe('12345');
    expect(Array.isArray(result.pipedCharIndexes)).toBeTruthy();
  });
});
