import MaskAPI from '../../src/ids-mask/ids-mask-api';
import { dateMask } from '../../src/ids-mask/ids-masks';

let api;

describe('IdsMaskAPI (Date)', () => {
  beforeEach(() => {
    api = new MaskAPI();
  });

  afterEach(() => {
    api = null;
  });

  it('Should process short dates', () => {
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

  it('Should process short dates with no separators or other literals present', () => {
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
});
