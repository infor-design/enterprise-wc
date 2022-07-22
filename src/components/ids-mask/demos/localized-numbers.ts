// Supporting components
import '../../ids-input/ids-input';
import '../../ids-dropdown/ids-dropdown';
import { deepClone } from '../../../utils/ids-deep-clone-utils/ids-deep-clone-utils';

document.addEventListener('DOMContentLoaded', () => {
  const pageContainer: any = document.querySelector('ids-container');

  // Uses the defined integer/decimal limits to create an IdsInput
  // `placeholder` definition based on the actual length of the mask.
  const createPlaceholder = (input: any) => {
    const ints = input.maskOptions.integerLimit;
    const decs = input.maskOptions.decimalLimit || 0;
    let placeholder = '';

    for (let i = 0; i < ints; i++) {
      placeholder += '1';
    }

    if (input.maskOptions.allowDecimal) {
      placeholder += input.maskOptions.symbols.decimal;
      for (let i = 0; i < decs; i++) {
        placeholder += '1';
      }
    }

    // calling `input.mask()` directly doesn't include the locale,
    // since it's normally added by the IdsInput
    const opts = deepClone(input.maskOptions);
    opts.locale = input.locale;
    const maskArray = input.mask(placeholder, opts).mask;

    // Write a placeholder string based on a slightly-modified mask array
    // (removes "[]"" caret traps and replaces regex matchers with "#")
    input.placeholder = `${maskArray.map((el: any) => {
      if (typeof el !== 'string') {
        return '#';
      }
      if (el === '[]') {
        return '';
      }
      return el;
    }).join('')}`;
  };

  // ===================================================
  // Set basic rules on all input fields
  const allInputs: Array<any> = [...document.querySelectorAll('ids-input')];
  allInputs.forEach((input) => {
    input.textAlign = 'right';
    input.mask = 'number';
  });

  const allNegativeInputs: Array<any> = [...document.querySelectorAll('[id*="negative"]')];
  allNegativeInputs.forEach((input) => {
    input.maskOptions.allowNegative = true;
  });

  const allDecimalInputs: Array<any> = [...document.querySelectorAll('[id*="decimal"]')];
  allDecimalInputs.forEach((input) => {
    input.maskOptions.allowDecimal = true;
    input.maskOptions.decimalLimit = 2;
  });

  const allGroupInputs: Array<any> = [...document.querySelectorAll('[id*="group"]')];
  allGroupInputs.forEach((input) => {
    input.maskOptions.allowThousandsSeparator = true;
  });

  // ===================================================
  // Set limits on "thousands-length" inputs
  const allThousandsInputs: Array<any> = [...document.querySelectorAll('[id*="thousands"]')];
  allThousandsInputs.forEach((input) => {
    input.maskOptions.integerLimit = 4;
    createPlaceholder(input);
  });

  // Set limits on "millions-length" inputs
  const allMillionsInputs: Array<any> = [...document.querySelectorAll('[id*="millions"]')];
  allMillionsInputs.forEach((input) => {
    input.maskOptions.integerLimit = 7;
    createPlaceholder(input);
  });

  // Set limits on "billions-length" inputs
  const allBillionsInputs: Array<any> = [...document.querySelectorAll('[id*="billions"]')];
  allBillionsInputs.forEach((input) => {
    input.maskOptions.integerLimit = 10;
    createPlaceholder(input);
  });

  // Set limits on "quintillions-length" inputs
  const allQuintillionsInputs: Array<any> = [...document.querySelectorAll('[id*="quintillions"]')];
  allQuintillionsInputs.forEach((input) => {
    input.maskOptions.integerLimit = 18;
    if (input.id.includes('decimal')) {
      input.maskOptions.decimalLimit = 6;
    }
    createPlaceholder(input);
  });

  // Change localized strings on all number inputs when the Page container's locale changes
  pageContainer.addEventListener('localechange', () => {
    allInputs.forEach((input) => {
      input.value = '';
      createPlaceholder(input);
    });
  });
});
