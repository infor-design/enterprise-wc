/**
 * @jest-environment jsdom
 */
import MaskAPI from '../../src/components/ids-mask/ids-mask-api';
import { dateMask, autoCorrectedDatePipe } from '../../src/components/ids-mask/ids-masks';

let api;

describe('IdsMaskAPI (Date)', () => {
  beforeEach(() => {
    api = new MaskAPI();
  });

  afterEach(() => {
    api = null;
  });

  it('should process short dates', () => {
    const textValue = '1111111111';
    const opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      patternOptions: {
        format: 'M/d/yyyy',
        symbols: {
          separator: '/'
        }
      }
    };
    const result = api.process(textValue, opts);

    expect(result.maskResult).toBeTruthy();
    expect(result.conformedValue).toEqual('11/11/1111');
  });

  it('should process short dates with default patternOptions', () => {
    const textValue = '1111111111';
    const opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      pipe: autoCorrectedDatePipe
    };
    const result = api.process(textValue, opts);

    expect(result.maskResult).toBeTruthy();
    expect(result.conformedValue).toEqual('11/11/1111');
  });

  it('should process short dates with no separators or other literals present', () => {
    const textValue = '12122012';
    let opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      patternOptions: {
        format: 'ddMMyyyy'
      }
    };
    let result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('12122012');

    opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      patternOptions: {
        format: 'Mdyyyy'
      }
    };
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('12122012');
  });

  it('should process partial short dates', () => {
    const textValue = '1111111111';
    const opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      patternOptions: {
        format: 'M/d/yyyy',
        symbols: {
          separator: '/'
        }
      }
    };
    const result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('11/11/1111');
  });

  it('should process short dates when the format allows for single digit months and days', () => {
    const textValue = '1/1/2020';
    const opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      patternOptions: {
        format: 'M/d/yyyy',
        symbols: {
          separator: '/'
        }
      },
      pipe: autoCorrectedDatePipe
    };
    const result = api.process(textValue, opts);

    expect(result.maskResult).toBeTruthy();
    expect(result.conformedValue).toEqual('1/1/2020');
  });

  // @TODO: fix partial autocorrect
  it.skip('can partially autocorrect incorrect dates', () => {
    const textValue = '15/32/2020';
    const opts = {
      selection: {
        start: 0
      },
      pattern: dateMask,
      patternOptions: {
        format: 'M/d/yyyy',
        symbols: {
          separator: '/'
        }
      },
      pipe: autoCorrectedDatePipe
    };
    const result = api.process(textValue, opts);

    expect(result.maskResult).toBeTruthy();
    expect(result.conformedValue).toEqual('12/31/2020');
  });
});

describe('Date Mask function', () => {
  it('can mask with defaults', () => {
    const result = dateMask(undefined, undefined);

    // Resulting mask will match default 'en-us' date format:
    // [/\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, /\d/, /\d/]
    expect(result.mask.length).toBe(14);
  });

  it('should always provide masking space for at least one number', () => {
    const result = dateMask(null, {});

    // Resulting mask will match default 'en-us' date format:
    // [/\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, /\d/, /\d/]
    expect(result.mask.length).toBe(14);
  });

  it('can handle time periods', () => {
    const result = dateMask('1212am', {
      format: 'HH:mm a'
    });

    // Resulting mask will be:
    // [/\d/, /\d/, '[]', ':', '[]', /\d/, /\d/, '[]', ' ', '[]', /[aApP]/, /[mM]/]
    expect(result.mask.length).toBe(12);
  });

  // @TODO: Re-enable after Locale exists
  it.skip('can handle `ah`', () => {
    const result = dateMask('202006', {
      format: 'ah:mm'
    });

    // Resulting mask will be:
    // [/[aApP]/, /[Mm]/, '[]', '[]', /\d/, /\d/, '[]', ':', '[]', /\d/, /\d/]
    expect(result.mask.length).toBe(11);
  });
});
