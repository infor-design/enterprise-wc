/**
 * @jest-environment jsdom
 */
import MaskAPI from '../../src/components/ids-mask/ids-mask-api';
import { IdsMaskOptions } from '../../src/components/ids-mask/ids-mask-common';
import { numberMask } from '../../src/components/ids-mask/ids-masks';
import IdsLocale from '../../src/components/ids-locale/ids-locale';

const locale = new IdsLocale();
let api: any;

describe('IdsMaskAPI (Number)', () => {
  beforeEach(() => {
    api = new MaskAPI();
  });

  afterEach(() => {
    api = null;
  });

  test('can handle simple number masking', () => {
    let textValue = '123456';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'en-US',
        allowDecimal: true,
        integerLimit: 4,
        decimalLimit: 2
      }
    };
    let result = api.process(textValue, opts);

    // If decimal isn't added manually, the decimal and values after it are thrown out
    expect(result.conformedValue).toEqual('1234');

    textValue = '1234.56';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('1234.56');
  });

  // Test that `Locale.formatNumber()` is implemented.
  test('should process numbers with thousands separators', () => {
    // Handle big numbers with thousands separators
    let textValue = '1111111111';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      locale,
      pattern: numberMask,
      patternOptions: {
        locale: 'en-US',
        allowDecimal: false,
        allowThousandsSeparator: true,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('1,111,111,111');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '2222222222.33';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('2,222,222,222.33');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-4444444444.55';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-4,444,444,444.55');

    // Handle Numbers with a prefix (currency)
    opts.patternOptions.allowNegative = false;
    opts.patternOptions.integerLimit = 4;
    opts.patternOptions.prefix = '$';
    textValue = '2345';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('$2,345');
  });

  test('can handle numbers with prefixes or suffixes', () => {
    // Handle Numbers with a prefix (currency)
    let textValue = '2345';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'en-US',
        allowNegative: false,
        integerLimit: 4,
        prefix: '$'
      }
    };
    let result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('$2345');

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '100';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('100%');
  });

  test('should process arabic numbers', () => {
    // Handle big numbers with thousands separators
    let textValue = '١٢٣٤٥٦٧٨٩٠';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowThousandsSeparator: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '١٢٣٤٥٦٧٨٩٠.٣٣';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠.٣٣');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-١٢٣٤٥٦٧٨٩٠.٥٥';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-١٢٣٤٥٦٧٨٩٠.٥٥');

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '١٢٣٤';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('١٢٣%');
  });

  test('should process hindi (devanagari) numbers', () => {
    // Handle big numbers with thousands separators
    let textValue = '१२३४५६७८९०';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'hi-ID',
        allowThousandsSeparator: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('१२३४५६७८९०');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '१२३४५६७८९०.११';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('१२३४५६७८९०.११');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-१२३४५६७८९०.११';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-१२३४५६७८९०.११');
  });

  test('should process hindi (devanagari) numbers with a percentage', () => {
    // Handle big numbers with thousands separators
    let textValue = '१२३४५६७८९०';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'hi-ID',
        allowThousandsSeparator: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '१२३४';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('१२३%');

    // Block letters on numbers
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = 'ोवमा';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('%');
  });

  test('should process chinese (financial) numbers', () => {
    const textValue = '壹贰叁肆伍陆柒';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowThousandsSeparator: false,
        integerLimit: 10
      }
    };
    const result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('壹贰叁肆伍陆柒');
  });

  test('should process chinese (normal) numbers', () => {
    const textValue = '一二三四五六七七九';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowThousandsSeparator: false,
        integerLimit: 10
      }
    };
    const result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('一二三四五六七七九');
  });

  test('should process number masks with leading zeros', () => {
    // Handle big numbers with thousands separators
    let textValue = '00001';
    const opts: IdsMaskOptions = {
      selection: {
        start: 0
      },
      locale,
      pattern: numberMask,
      patternOptions: {
        allowLeadingZeros: true,
        allowThousandsSeparator: true,
        allowDecimal: true,
        allowNegative: true,
        integerLimit: 10,
        decimalLimit: 3,
        locale: 'en-US'
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('00001');

    textValue = '-00000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-00000.123');

    textValue = '00000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('00000.123');

    // Test that `Locale.formatNumber()` is implemented.
    textValue = '10000';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000');

    textValue = '10000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000.123');

    textValue = '10000.100';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000.100');
  });
});

describe('Number Mask function', () => {
  test('should always provide masking space for at least one number', () => {
    const result = numberMask('', {});

    // Resulting mask will be [/\d/]
    expect(result.mask.length).toBe(1);
  });

  test('should handle prefixes', () => {
    const result = numberMask('$', {
      prefix: '$'
    });

    // Resulting mask will be ['$', /\d/]
    expect(result.mask.length).toBe(2);
  });

  test('should handle suffixes', () => {
    const opts: IdsMaskOptions = { suffix: '%' };
    let result = numberMask('100%', opts);

    // Resulting mask will be [/\d/, /\d/, /\d/, '%']
    expect(result.mask.length).toBe(4);

    result = numberMask('0%', opts);

    // Resulting mask will be [/\d/, '%']
    expect(result.mask.length).toBe(2);
  });

  test('should account for decimal placement', () => {
    const result = numberMask('.', {
      allowDecimal: true,
      symbols: {
        decimal: '.'
      }
    });

    // Resulting mask will be [/\d/, '[]', '.', '[]', /\d/]
    expect(result.mask.length).toBe(5);
  });

  test('should handle multiple decimals in the value', () => {
    const opts: IdsMaskOptions = {
      allowDecimal: true,
      decimalLimit: 3,
      integerLimit: 5,
      requireDecimal: true
    };
    const result = numberMask('4444..333', opts);

    // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, '[]', '.', '[]',  /\d/,  /\d/,  /\d/]
    expect(result.mask.length).toBe(10);
  });

  test('should handle leading zeros', () => {
    let opts: IdsMaskOptions = { allowLeadingZeros: true };
    let result = numberMask('00001', opts);

    // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, /\d/]
    expect(result.mask.length).toBe(5);

    opts = {
      allowDecimal: true,
      allowLeadingZeros: true,
      requireDecimal: true,
      symbols: {
        decimal: '.'
      }
    };
    result = numberMask('00001', opts);

    // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, /\d/, '[]', '.', '[]']
    expect(result.mask.length).toBe(8);
  });

  test('should handle a negative symbol with no other value', () => {
    const result = numberMask('-', { allowNegative: true });

    // Resulting mask will be ['-', /\d/]
    expect(result.mask.length).toBe(2);
  });

  test('should handle a complex combination of settings', () => {
    const opts: IdsMaskOptions = {
      allowDecimal: true,
      allowLeadingZeros: true,
      allowNegative: true,
      allowThousandsSeparator: true,
      decimalLimit: 2,
      integerLimit: 7,
      locale,
      prefix: 'X',
      suffix: 'W',
    };
    const result = numberMask('-123.45', opts);

    // Resulting mask will be ['-', 'X', /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/, /\d/, 'W']
    expect(result.mask.length).toBe(11);

    // @TODO: add more tests here when we can use thousands separator
  });

  test('should account for caret placement after the decimal, if the decimal exists in the value', () => {
    const opts: IdsMaskOptions = {
      allowDecimal: true,
      requireDecimal: true,
      integerLimit: 4,
      decimalLimit: 2
    };
    const result = numberMask('1234.5', opts);

    // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/]
    expect(result.mask.length).toBe(8);
  });
});
