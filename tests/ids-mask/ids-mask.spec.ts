import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import { IdsMaskOptions, convertPatternFromString } from '../../src/components/ids-mask/ids-mask-common';
import MaskAPI from '../../src/components/ids-mask/ids-mask-api';
import IdsLocale from '../../src/components/ids-locale/ids-locale';

import {
  dateMask,
  autoCorrectedDatePipe,
  numberMask
} from '../../src/components/ids-mask/ids-masks';
import IdsInput from '../../src/components/ids-input/ids-input';

test.describe('IdsInput tests', () => {
  const url = '/ids-mask/example.html';
  let api: any;
  let locale: any;
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    api = new MaskAPI();
    locale = new IdsLocale();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Mask Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('functionality tests', () => {
    test('doesn\'t render any changes if masking fails', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.mask = false;
        document.querySelector<IdsInput>(id)!.value = '12345';
      }, input);

      const inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('12345');
    });

    test('can mask an input field by changing its `value` property', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        const CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        document.querySelector<IdsInput>(id)!.mask = CREDIT_CARD_MASK;
        document.querySelector<IdsInput>(id)!.value = 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x';
      }, input);

      const inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('0123-4567-8901-2345');
    });

    test('can mask an input field by setting a `value` attribute', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        const CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        document.querySelector<IdsInput>(id)!.mask = CREDIT_CARD_MASK;
        document.querySelector<IdsInput>(id)!.setAttribute('value', 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x');
      }, input);

      const inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('0123-4567-8901-2345');
    });

    test('can mask an input field by triggering an `input` event', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        const inputEvent = new Event('input', {
          bubbles: true
        });
        const CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        document.querySelector<IdsInput>(id)!.mask = CREDIT_CARD_MASK;
        document.querySelector<IdsInput>(id)!.setAttribute('value', 'x0x1x2x3x4x5x6x7x8x9x0x1x2x3x4x5x6x');
        document.querySelector<IdsInput>(id)!.dispatchEvent(inputEvent);
      }, input);

      const inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('0123-4567-8901-2345');
    });

    test('can use the shorthand "number" to actviate the built-in number mask', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.mask = 'number';
      }, input);

      const inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.mask().mask.length, input);
      await expect(inputValue).toEqual(1);
    });

    test('can use the shorthand "rangeDate" to actviate the built-in range date mask', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.mask = 'rangeDate';
      }, input);

      const inputValue = await page.evaluate(async () => (document.querySelector('ids-input') as any)!.mask().mask.length, input);
      await expect(inputValue).toEqual(28);
    });

    test('can convert a string-based mask to an array internally', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.mask = '["(", /[1-9]/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]';
      }, input);

      const convertedMask = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.mask, input);
      await expect(Array.isArray(convertedMask)).toBeTruthy();
      await expect(convertedMask).toHaveLength(14);
    });

    test('cannot set `maskOptions` to an invalid type', async ({ page }) => {
      const input = 'ids-input';
      let maskOptions;
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.maskOptions = [1, 2, 3];
      }, input);

      maskOptions = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.maskOptions, input);
      await expect(typeof maskOptions).toBe('object');
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.maskOptions = 1;
      }, input);
      maskOptions = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.maskOptions, input);
      await expect(typeof maskOptions).toBe('object');
    });

    test('cannot set `maskPipe` to an invalid type', async ({ page }) => {
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.maskPipe = [1, 2, 3];
      }, input);

      const maskPipe = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.maskPipe, input);
      await expect(maskPipe).toBeUndefined();
    });

    test('can enable/disable guides', async ({ page }) => {
      let maskGuide;
      let inputValue;
      const input = 'ids-input';
      await page.evaluate((id) => {
        const PHONE_NUMBER_MASK = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        document.querySelector<IdsInput>(id)!.maskGuide = true;
        document.querySelector<IdsInput>(id)!.mask = PHONE_NUMBER_MASK;
        document.querySelector<IdsInput>(id)!.value = '123';
      }, input);

      maskGuide = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.maskGuide, input);
      await expect(maskGuide).toBeTruthy();

      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('(123) ___-____');

      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.maskGuide = false;
        document.querySelector<IdsInput>(id)!.value = '123';
      }, input);

      maskGuide = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.maskGuide, input);
      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(maskGuide).toBeFalsy();
      await expect(inputValue).toEqual('(123');
    });

    test('can retain character positions with guides enabled', async ({ page }) => {
      let inputValue;
      const input = 'ids-input';
      await page.evaluate((id) => {
        const PHONE_NUMBER_MASK = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        document.querySelector<IdsInput>(id)!.maskGuide = true;
        document.querySelector<IdsInput>(id)!.maskRetainPositions = true;
        document.querySelector<IdsInput>(id)!.mask = PHONE_NUMBER_MASK;
        document.querySelector<IdsInput>(id)!.value = '(123) 456-7890';
      }, input);

      const maskRetain = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.maskRetainPositions, input);
      await expect(maskRetain).toBeTruthy();

      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('(123) 456-7890');

      // Simulates an input event after selecting the "456" with the text caret
      await page.evaluate((id) => {
        const shadowroot = document.querySelector<IdsInput>(id)!.shadowRoot;
        document.querySelector<IdsInput>(id)!.safelySetSelection(shadowroot, 6, 9);
        const inputEvent = new InputEvent('input', { bubbles: true, data: '___' });
        document.querySelector<IdsInput>(id)!.value = '(123) ___-7890'; // Simulate input value changing
        document.querySelector<IdsInput>(id)!.dispatchEvent(inputEvent);
      }, input);

      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toEqual('(123) ___-7890');
    });

    test('adds a suffix to values that don\'t yet contain the suffix', async ({ page }) => {
      let inputValue;
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.maskOptions = { suffix: '%' };
        document.querySelector<IdsInput>(id)!.mask = [/\d/, /\d/, /\d/];
        document.querySelector<IdsInput>(id)!.value = '10';
      }, input);

      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toBe('10%');

      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.value = '100';
      }, input);

      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toBe('100%');
    });

    test('can process with a blank value', async ({ page }) => {
    // Custom Mask Function - you can only repeat "Ed" sequentially (EdEdEd) up to 100
      let inputValue;
      const input = 'ids-input';
      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.mask = [/[*]/];
        document.querySelector<IdsInput>(id)!.processMaskWithCurrentValue();
      }, input);

      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toBe('');

      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.processMaskFromProperty();
      }, input);
      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toBe('');

      await page.evaluate((id) => {
        document.querySelector<IdsInput>(id)!.processMask('undefined', {}, undefined);
      }, input);
      inputValue = await page.evaluate(async (id) => document.querySelector<IdsInput>(id)!.value, input);
      await expect(inputValue).toBe('');
    });

    test('can handle simple number masking', async () => {
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
      await expect(result.conformedValue).toEqual('1234');
      textValue = '1234.56';
      result = api.process(textValue, opts);
      await expect(result.conformedValue).toEqual('1234.56');
    });

    test('can process numbers with thousands separators', async () => {
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

      await expect(result).toBeDefined();
      await expect(result.conformedValue).toEqual('1,111,111,111');

      // Handle numbers with a decimal
      opts.patternOptions.allowDecimal = true;
      textValue = '2222222222.33';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('2,222,222,222.33');

      // Handle Negative numbers
      opts.patternOptions.allowNegative = true;
      textValue = '-4444444444.55';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('-4,444,444,444.55');

      // Handle Numbers with a prefix (currency)
      opts.patternOptions.allowNegative = false;
      opts.patternOptions.integerLimit = 4;
      opts.patternOptions.prefix = '$';
      textValue = '2345';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('$2,345');
    });

    test('can handle numbers with prefixes or suffixes', async () => {
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

      await expect(result.conformedValue).toEqual('$2345');
      // Handle Numbers with a suffix (percent)
      opts.patternOptions.integerLimit = 3;
      opts.patternOptions.prefix = '';
      opts.patternOptions.suffix = '%';
      textValue = '100';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('100%');
    });

    test('can process arabic numbers', async () => {
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

      await expect(result).toBeDefined();
      await expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠');

      // Handle numbers with a decimal
      opts.patternOptions.allowDecimal = true;
      textValue = '١٢٣٤٥٦٧٨٩٠.٣٣';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠.٣٣');

      // Handle Negative numbers
      opts.patternOptions.allowNegative = true;
      textValue = '-١٢٣٤٥٦٧٨٩٠.٥٥';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('-١٢٣٤٥٦٧٨٩٠.٥٥');

      // Handle Numbers with a suffix (percent)
      opts.patternOptions.integerLimit = 3;
      opts.patternOptions.prefix = '';
      opts.patternOptions.suffix = '%';
      textValue = '١٢٣٤';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('١٢٣%');
    });

    test('can process hindi (devanagari) numbers', async () => {
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

      await expect(result).toBeDefined();
      await expect(result.conformedValue).toEqual('१२३४५६७८९०');

      // Handle numbers with a decimal
      opts.patternOptions.allowDecimal = true;
      textValue = '१२३४५६७८९०.११';
      result = api.process(textValue, opts);

      expect(result.conformedValue).toEqual('१२३४५६७८९०.११');

      // Handle Negative numbers
      opts.patternOptions.allowNegative = true;
      textValue = '-१२३४५६७८९०.११';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('-१२३४५६७८९०.११');
    });

    test('can process hindi (devanagari) numbers with a percentage', async () => {
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

      await expect(result.conformedValue).toEqual('१२३%');

      // Block letters on numbers
      opts.patternOptions.integerLimit = 3;
      opts.patternOptions.prefix = '';
      opts.patternOptions.suffix = '%';
      textValue = 'ोवमा';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('%');
    });

    test('can process chinese (financial) numbers', async () => {
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

      await expect(result).toBeDefined();
      await expect(result.conformedValue).toEqual('壹贰叁肆伍陆柒');
    });

    test('can process chinese (normal) numbers', async () => {
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

      await expect(result).toBeDefined();
      await expect(result.conformedValue).toEqual('一二三四五六七七九');
    });

    test('can process number masks with leading zeros', async () => {
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

      await expect(result).toBeDefined();
      await expect(result.conformedValue).toEqual('00001');

      textValue = '-00000.123';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('-00000.123');

      textValue = '00000.123';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('00000.123');

      // Test that `Locale.formatNumber()` is implemented.
      textValue = '10000';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('10,000');

      textValue = '10000.123';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('10,000.123');

      textValue = '10000.100';
      result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('10,000.100');
    });

    test('can always provide masking space for at least one number', async () => {
      const result = numberMask('', {});

      // Resulting mask will be [/\d/]
      await expect(result.mask.length).toBe(1);
    });

    test('can handle prefixes', async () => {
      const result = numberMask('', {});

      // Resulting mask will be [/\d/]
      await expect(result.mask.length).toBe(1);
    });

    test('can handle suffixes', async () => {
      const opts: IdsMaskOptions = { suffix: '%' };
      let result = numberMask('100%', opts);

      // Resulting mask will be [/\d/, /\d/, /\d/, '%']
      await expect(result.mask.length).toBe(4);

      result = numberMask('0%', opts);

      // Resulting mask will be [/\d/, '%']
      await expect(result.mask.length).toBe(2);
    });

    test('can account for decimal placement', async () => {
      const result = numberMask('.', {
        allowDecimal: true,
        symbols: {
          decimal: '.'
        }
      });

      // Resulting mask will be [/\d/, '[]', '.', '[]', /\d/]
      await expect(result.mask.length).toBe(5);
    });

    test('can handle multiple decimals in the value', async () => {
      const opts: IdsMaskOptions = {
        allowDecimal: true,
        decimalLimit: 3,
        integerLimit: 5,
        requireDecimal: true
      };
      const result = numberMask('4444..333', opts);

      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, '[]', '.', '[]',  /\d/,  /\d/,  /\d/]
      await expect(result.mask.length).toBe(10);
    });

    test('can handle leading zeros', async () => {
      let opts: IdsMaskOptions = { allowLeadingZeros: true };
      let result = numberMask('00001', opts);

      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, /\d/]
      await expect(result.mask.length).toBe(5);

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
      await expect(result.mask.length).toBe(8);
    });

    test('can handle a negative symbol with no other value', async () => {
      const result = numberMask('-', { allowNegative: true });

      // Resulting mask will be ['-', /\d/]
      await expect(result.mask.length).toBe(2);
    });

    test('can handle a complex combination of settings', async () => {
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
      await expect(result.mask.length).toBe(11);
    });

    test('can should account for caret placement after the decimal, if the decimal exists in the value', async () => {
      const opts: IdsMaskOptions = {
        allowDecimal: true,
        requireDecimal: true,
        integerLimit: 4,
        decimalLimit: 2
      };
      const result = numberMask('1234.5', opts);

      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/]
      await expect(result.mask.length).toBe(8);
    });

    test('can convert a string-based pattern to a Javascript array', async () => {
      let arr: any = convertPatternFromString('["(", /[1-9]/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]');

      expect(Array.isArray(arr)).toBeTruthy();
      expect(arr.length).toBe(14);
      expect(arr[0]).toBe('(');

      arr = undefined;

      arr = convertPatternFromString('[\'(\', /[1-9]/, /\\d/, /\\d/, \')\', \' \', /\\d/, /\\d/, /\\d/, \'-\', /\\d/, /\\d/, /\\d/, /\\d/]');

      expect(Array.isArray(arr)).toBeTruthy();
      expect(arr.length).toBe(14);
      expect(arr[0]).toBe('(');
    });

    test('cannot convert invalid patterns', async () => {
      let arr: any = convertPatternFromString('');

      await expect(arr).toBeUndefined();

      // Add more types of input eventually, but make this pass all code paths
      arr = convertPatternFromString('A');

      await expect(arr).toBeUndefined();
    });

    test('can process short dates', async () => {
      const textValue = '1111111111';
      const opts: IdsMaskOptions = {
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

      await expect(result.maskResult).toBeTruthy();
      await expect(result.conformedValue).toEqual('11/11/1111');
    });

    test('can process short dates with default patternOptions', async () => {
      const textValue = '1111111111';
      const opts: IdsMaskOptions = {
        selection: {
          start: 0
        },
        pattern: dateMask,
        pipe: autoCorrectedDatePipe
      };
      const result = api.process(textValue, opts);
      await expect(result.maskResult).toBeTruthy();
      await expect(result.conformedValue).toEqual('11/11/1111');
    });

    test('can process short dates with no separators or other literals present', async () => {
      const textValue = '12122012';
      let opts: IdsMaskOptions = {
        selection: {
          start: 0
        },
        pattern: dateMask,
        patternOptions: {
          format: 'ddMMyyyy'
        }
      };
      let result = api.process(textValue, opts);

      await expect(result.conformedValue).toEqual('12122012');

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

      await expect(result.conformedValue).toEqual('12122012');
    });

    test('can process partial short dates', async () => {
      const textValue = '1111111111';
      const opts: IdsMaskOptions = {
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

      await expect(result.conformedValue).toEqual('11/11/1111');
    });

    test('can process short dates when the format allows for single digit months and days', async () => {
      const textValue = '1/1/2020';
      const opts: IdsMaskOptions = {
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

      await expect(result.maskResult).toBeTruthy();
      await expect(result.conformedValue).toEqual('1/1/2020');
    });

    test('can mask with defaults', async () => {
      const result = dateMask(undefined, undefined);

      // Resulting mask will match default 'en-us' date format:
      // [/\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, /\d/, /\d/]
      await expect(result.mask.length).toBe(14);
    });

    test('can always provide masking space for at least one number on date mask', async () => {
      const result = dateMask('', {}); // this one was null

      // Resulting mask will match default 'en-us' date format:
      // [/\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, /\d/, /\d/]
      await expect(result.mask.length).toBe(14);
    });

    test('can handle time periods', async () => {
      const result = dateMask('1212am', {
        locale,
        format: 'HH:mm a'
      });

      // Resulting mask will be:
      // [/\d/, /\d/, '[]', ':', '[]', /\d/, /\d/, '[]', ' ', '[]', /[aApP]/, /[mM]/]
      await expect(result.mask.length).toBe(12);
    });

    test('can handle `ah`', async () => {
      const result = dateMask('202006', {
        locale,
        format: 'ah:mm'
      });

      // Resulting mask will be:
      // [/[aApP]/, /[Mm]/, '[]', '[]', /\d/, /\d/, '[]', ':', '[]', /\d/, /\d/]
      await expect(result.mask.length).toBe(11);
    });
  });
});
