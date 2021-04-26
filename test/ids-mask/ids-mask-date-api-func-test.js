import MaskAPI from '../../src/ids-mask/ids-mask-api';
import { dateMask, autoCorrectedDatePipe } from '../../src/ids-mask/ids-masks';

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
});
