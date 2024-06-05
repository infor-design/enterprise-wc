import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import { IdsMaskOptions, convertPatternFromString } from '../../src/components/ids-mask/ids-mask-common';

import IdsInput from '../../src/components/ids-input/ids-input';

test.describe('IdsMask tests', () => {
  const url = '/ids-mask/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
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

    test('can handle simple number masking', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('123456', opts);

        const result2 = api.process('1234.56', opts);
        return [result.conformedValue, result2.conformedValue];
      });

      await expect(results[0]).toEqual('1234');
      await expect(results[1]).toEqual('1234.56');
    });

    test('can process numbers with thousands separators', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        const opts: IdsMaskOptions = {
          selection: {
            start: 0
          },
          locale: window.IdsGlobal.locale,
          pattern: numberMask,
          patternOptions: {
            locale: 'en-US',
            allowDecimal: false,
            allowThousandsSeparator: true,
            integerLimit: 10
          }
        };
        const result = api.process('1111111111', opts);

        opts.patternOptions.allowDecimal = true;
        const result2 = api.process('2222222222.33', opts);

        opts.patternOptions.allowNegative = true;
        const result3 = api.process('-4444444444.55', opts);

        opts.patternOptions.allowNegative = false;
        opts.patternOptions.integerLimit = 4;
        opts.patternOptions.prefix = '$';
        const result4 = api.process('2345', opts);

        return [result.conformedValue, result2.conformedValue, result3.conformedValue, result4.conformedValue];
      });

      // Big numbers with a decimal
      await expect(results[0]).toEqual('1,111,111,111');

      // Handle numbers with a decimal
      await expect(results[1]).toEqual('2,222,222,222.33');

      // Handle Negative numbers
      await expect(results[2]).toEqual('-4,444,444,444.55');

      // Handle Numbers with a prefix (currency)
      await expect(results[3]).toEqual('$2,345');
    });

    test('can handle numbers with prefixes or suffixes', async ({ page }) => {
      // Handle Numbers with a prefix (currency)
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('2345', opts);

        opts.patternOptions.integerLimit = 3;
        opts.patternOptions.prefix = '';
        opts.patternOptions.suffix = '%';
        const result2 = api.process('100', opts);
        return [result.conformedValue, result2.conformedValue];
      });

      await expect(results[0]).toEqual('$2345');

      // Handle Numbers with a suffix (percent)
      await expect(results[1]).toEqual('100%');
    });

    test('can process arabic numbers', async ({ page }) => {
      // Handle big numbers with thousands separators
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('١٢٣٤٥٦٧٨٩٠', opts);

        opts.patternOptions.allowDecimal = true;
        const result2 = api.process('١٢٣٤٥٦٧٨٩٠.٣٣', opts);

        opts.patternOptions.allowNegative = true;
        const result3 = api.process('-١٢٣٤٥٦٧٨٩٠.٥٥', opts);

        opts.patternOptions.integerLimit = 3;
        opts.patternOptions.prefix = '';
        opts.patternOptions.suffix = '%';
        const result4 = api.process('١٢٣٤', opts);
        return [result.conformedValue, result2.conformedValue, result3.conformedValue, result4.conformedValue];
      });

      await expect(results[0]).toEqual('١٢٣٤٥٦٧٨٩٠');

      // Handle numbers with a decimal
      await expect(results[1]).toEqual('١٢٣٤٥٦٧٨٩٠.٣٣');

      // Handle Negative numbers
      await expect(results[2]).toEqual('-١٢٣٤٥٦٧٨٩٠.٥٥');

      // Handle Numbers with a suffix (percent)
      await expect(results[3]).toEqual('١٢٣%');
    });

    test('can process hindi (devanagari) numbers', async ({ page }) => {
      // Handle big numbers with thousands separators
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('१२३४५६७८९०', opts);

        opts.patternOptions.allowDecimal = true;
        const result2 = api.process('१२३४५६७८९०.११', opts);

        opts.patternOptions.allowNegative = true;
        const result3 = api.process('-१२३४५६७८९०.११', opts);
        return [result.conformedValue, result2.conformedValue, result3.conformedValue];
      });
      await expect(results[0]).toEqual('१२३४५६७८९०');

      // Handle numbers with a decimal
      expect(results[1]).toEqual('१२३४५६७८९०.११');

      // Handle Negative numbers
      await expect(results[2]).toEqual('-१२३४५६७८९०.११');
    });

    test('can process hindi (devanagari) numbers with a percentage', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('१२३४५६७८९०', opts);

        opts.patternOptions.integerLimit = 3;
        opts.patternOptions.prefix = '';
        opts.patternOptions.suffix = '%';
        const result2 = api.process('१२३४', opts);

        opts.patternOptions.integerLimit = 3;
        opts.patternOptions.prefix = '';
        opts.patternOptions.suffix = '%';
        const result3 = api.process('ोवमा', opts);
        return [result.conformedValue, result2.conformedValue, result3.conformedValue];
      });

      // Handle Numbers with a suffix (percent)
      await expect(results[1]).toEqual('१२३%');

      // Block letters on numbers
      await expect(results[2]).toEqual('%');
    });

    test('can process chinese (financial) numbers', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('壹贰叁肆伍陆柒', opts);
        return [result.conformedValue];
      });

      await expect(results[0]).toEqual('壹贰叁肆伍陆柒');
    });

    test('can process chinese (normal) numbers', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
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
        const result = api.process('一二三四五六七七九', opts);
        return [result.conformedValue];
      });

      await expect(results[0]).toEqual('一二三四五六七七九');
    });

    test('can process number masks with leading zeros', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        const opts: IdsMaskOptions = {
          selection: {
            start: 0
          },
          locale: window.IdsGlobal.locale,
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
        const result = api.process('00001', opts);
        const result2 = api.process('-00000.123', opts);
        const result3 = api.process('00000.123', opts);
        const result4 = api.process('10000', opts);
        const result5 = api.process('10000.123', opts);
        const result6 = api.process('10000.100', opts);
        return [
          result.conformedValue,
          result2.conformedValue,
          result3.conformedValue,
          result4.conformedValue,
          result5.conformedValue,
          result6.conformedValue
        ];
      });
      await expect(results[0]).toEqual('00001');
      await expect(results[1]).toEqual('-00000.123');
      await expect(results[2]).toEqual('00000.123');

      // Test that `Locale.formatNumber()` is implemented.
      await expect(results[3]).toEqual('10,000');
      await expect(results[4]).toEqual('10,000.123');
      await expect(results[5]).toEqual('10,000.100');
    });

    test('can always provide masking space for at least one number', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        return numberMask('', {});
      });

      // Resulting mask will be [/\d/]
      await expect(results.mask.length).toBe(1);
    });

    test('can handle prefixes', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        return numberMask('', {});
      });

      // Resulting mask will be [/\d/]
      await expect(results.mask.length).toBe(1);
    });

    test('can handle suffixes', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        return [
          numberMask('100%', { suffix: '%' })
        ];
      });

      // Resulting mask will be [/\d/, /\d/, /\d/, '%']
      await expect(results[0].mask.length).toBe(4);
    });

    test('can account for decimal placement', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        return numberMask('.', {
          allowDecimal: true,
          symbols: {
            decimal: '.'
          }
        });
      });
      // Resulting mask will be [/\d/, '[]', '.', '[]', /\d/]
      await expect(results.mask.length).toBe(5);
    });

    test('can handle multiple decimals in the value', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        const opts: IdsMaskOptions = {
          allowDecimal: true,
          decimalLimit: 3,
          integerLimit: 5,
          requireDecimal: true
        };
        return numberMask('4444..333', opts);
      });

      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, '[]', '.', '[]',  /\d/,  /\d/,  /\d/]
      await expect(results.mask.length).toBe(10);
    });

    test('can handle leading zeros', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        let opts: IdsMaskOptions = { allowLeadingZeros: true };
        const result1 = numberMask('00001', opts);

        opts = {
          allowDecimal: true,
          allowLeadingZeros: true,
          requireDecimal: true,
          symbols: {
            decimal: '.'
          }
        };
        const result2 = numberMask('00001', opts);

        return [
          result1,
          result2
        ];
      });
      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, /\d/]
      await expect(results[0].mask.length).toBe(5);
      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, /\d/, '[]', '.', '[]']
      await expect(results[1].mask.length).toBe(8);
    });

    test('can handle a negative symbol with no other value', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        return numberMask('-', { allowNegative: true });
      });
      // Resulting mask will be ['-', /\d/]
      await expect(results.mask.length).toBe(2);
    });

    test('can handle a complex combination of settings', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        const opts: IdsMaskOptions = {
          allowDecimal: true,
          allowLeadingZeros: true,
          allowNegative: true,
          allowThousandsSeparator: true,
          decimalLimit: 2,
          integerLimit: 7,
          locale: window.IdsGlobal.locale,
          prefix: 'X',
          suffix: 'W',
        };
        return numberMask('-123.45', opts);
      });

      // Resulting mask will be ['-', 'X', /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/, /\d/, 'W']
      await expect(results.mask.length).toBe(11);
    });

    test('can should account for caret placement after the decimal, if the decimal exists in the value', async ({ page }) => {
      const results = await page.evaluate(() => {
        const numberMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.numberMask;
        const opts: IdsMaskOptions = {
          allowDecimal: true,
          requireDecimal: true,
          integerLimit: 4,
          decimalLimit: 2
        };
        return numberMask('1234.5', opts);
      });

      // Resulting mask will be [/\d/, /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/]
      await expect(results.mask.length).toBe(8);
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

    test('can process short dates', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const dateMaskApi = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;

        const opts: IdsMaskOptions = {
          selection: {
            start: 0
          },
          pattern: dateMaskApi,
          patternOptions: {
            format: 'M/d/yyyy',
            symbols: {
              separator: '/'
            }
          }
        };
        const result = api.process('1111111111', opts);
        return [result.conformedValue];
      });

      await expect(results[0]).toEqual('11/11/1111');
    });

    test('can process short dates with default patternOptions', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const dateMaskApi = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;
        const autoCorrectedDatePipe = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.autoCorrectedDatePipe;

        const opts: IdsMaskOptions = {
          selection: {
            start: 0
          },
          pattern: dateMaskApi,
          pipe: autoCorrectedDatePipe
        };
        const result = api.process('1111111111', opts);
        return result.conformedValue;
      });

      await expect(results).toEqual('11/11/1111');
    });

    test('can process short dates with no separators or other literals present', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const dateMaskApi = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;

        const opts: IdsMaskOptions = {
          selection: {
            start: 0
          },
          pattern: dateMaskApi,
          patternOptions: {
            format: 'ddMMyyyy'
          }
        };
        const result = api.process('12122012', opts);
        return result.conformedValue;
      });
      await expect(results).toEqual('12122012');
    });

    test('can process partial short dates', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const dateMaskApi = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;

        const opts: IdsMaskOptions = {
          selection: {
            start: 0
          },
          pattern: dateMaskApi,
          patternOptions: {
            format: 'M/d/yyyy',
            symbols: {
              separator: '/'
            }
          }
        };
        const result = api.process('1111111111', opts);
        return result.conformedValue;
      });

      await expect(results).toEqual('11/11/1111');
    });

    test('can process short dates when the format allows for single digit months and days', async ({ page }) => {
      const results = await page.evaluate(() => {
        const api = document.querySelector<IdsInput>('ids-input')!.maskAPI;
        const dateMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;
        const autoCorrectedDatePipe = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.autoCorrectedDatePipe;

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
        const result = api.process('1/1/2020', opts);
        return result.conformedValue;
      });

      await expect(results).toBeTruthy();
      await expect(results).toEqual('1/1/2020');
    });

    test('can mask with defaults', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dateMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;
        return dateMask(undefined, undefined);
      });

      // Resulting mask will match default 'en-us' date format:
      // [/\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, /\d/, /\d/]
      await expect(results.mask.length).toBe(14);
    });

    test('can always provide masking space for at least one number on date mask', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dateMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;
        return dateMask('', {}); // this one was null
      });
      // Resulting mask will match default 'en-us' date format:
      // [/\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, '[]', '/', '[]', /\d/, /\d/, /\d/, /\d/]
      await expect(results.mask.length).toBe(14);
    });

    test('can handle time periods', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dateMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;
        return dateMask('1212am', {
          locale: window.IdsGlobal.locale,
          format: 'HH:mm a'
        });
      });

      // Resulting mask will be:
      // [/\d/, /\d/, '[]', ':', '[]', /\d/, /\d/, '[]', ' ', '[]', /[aApP]/, /[mM]/]
      await expect(results.mask.length).toBe(12);
    });

    test('can handle `ah`', async ({ page }) => {
      const results = await page.evaluate(() => {
        const dateMask = document.querySelector<IdsInput>('ids-input')!.maskAPI.masks.dateMask;
        return dateMask('202006', {
          locale: window.IdsGlobal.locale,
          format: 'ah:mm'
        });
      });

      // Resulting mask will be:
      // [/[aApP]/, /[Mm]/, '[]', '[]', /\d/, /\d/, '[]', ':', '[]', /\d/, /\d/]
      await expect(results.mask.length).toBe(11);
    });
  });
});
