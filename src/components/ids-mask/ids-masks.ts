import {
  ALPHAS_REGEX, ANY_REGEX, CARET_TRAP, DIGITS_REGEX, EMPTY_STRING, NON_DIGITS_REGEX, IdsMaskOptions
} from './ids-mask-common';
import { removeDuplicates } from '../../utils/ids-string-utils/ids-string-utils';
import { deepClone } from '../../utils/ids-deep-clone-utils/ids-deep-clone-utils';

// Default Number Mask Options
export const DEFAULT_NUMBER_MASK_OPTIONS = {
  prefix: EMPTY_STRING,
  suffix: EMPTY_STRING,
  allowThousandsSeparator: true,
  symbols: {
    currency: '$',
    decimal: '.',
    negative: '-',
    thousands: ','
  },
  allowDecimal: false,
  decimalLimit: 0,
  locale: '',
  requireDecimal: false,
  allowNegative: false,
  allowLeadingZeros: false,
  integerLimit: null,
};

/**
 * Contents returned from Mask Generator functions
 */
type IdsMaskGeneratorResult = {
  mask: Array<string | RegExp>;
  literals?: Array<string>;
  literalRegex?: RegExp;
};

/**
 * Gets the number of leading zeros in a string representing a formatted number.
 * @param {string} formattedStr the string to be checked
 * @returns {number} containing the number of leading zeros.
 */
function getLeadingZeros(formattedStr = '') {
  const match = `${formattedStr}`.match(/^0*/);
  return match ? match[0].length : 0;
}

/**
 * Converts a string representing a formatted number into a Number Mask.
 * @param {string} strNumber incoming string
 * @returns {Array<string|RegExp>} with strings representing character literals and regex patterns
 */
function convertToMask(strNumber: string) {
  return strNumber
    .split(EMPTY_STRING)
    .map((char) => (DIGITS_REGEX.test(char) ? DIGITS_REGEX : char));
}

/**
 * Adds thousands separators to the correct spot in a formatted number string.
 * http://stackoverflow.com/a/10899795/604296
 * @param {string} n - the string
 * @param {object} [options] - number mask function options.
 * @param {object} [localeStringOpts] - settings for `toLocaleString`.
 * @returns {string} the incoming string formatted with a thousands separator.
 */
function addThousandsSeparator(n: string, options: any = {}, localeStringOpts: any = {}) {
  if (n === '' || Number.isNaN(n)) {
    return n;
  }

  // If a locale was passed, use the Locale to format
  let formatted = n;
  if (options.locale?.formatNumber) {
    formatted = options.locale.formatNumber(n, localeStringOpts);
  }

  // `Number.toLocaleString` does not account for leading zeroes, so we have to put them
  // back if we've configured this Mask to use them.
  if (options.allowLeadingZeros && n.indexOf('0') === 0) {
    let zeros = getLeadingZeros(n);
    if (formatted.indexOf('0') === 0) {
      formatted = formatted.substring(1);
    }
    while (zeros > 0) {
      zeros -= 1;
      formatted = `0${formatted}`;
    }
  }

  return formatted;
}

/**
 * Gets an array of Regex objects matching the number of digits present in a source string
 * @param {string} part string representing the mark part.
 * @param {string} type 'any', 'digits', or 'alphas'
 * @returns {Array<RegExp>} regex representing the part that was passed in.
 */
function getRegexForPart(part: string, type: string) {
  const types: any = {
    any: ANY_REGEX,
    digits: DIGITS_REGEX,
    alphas: ALPHAS_REGEX
  };

  if (!types[type]) {
    // eslint-disable-next-line
    type = 'any';
  }

  let size = part.toString().length;
  const arr = [];

  while (size > 0) {
    arr.push(types[type]);
    size -= 1;
  }
  return arr;
}

/**
 * Number Mask Function
 * @param {string} rawValue the un-formatted value that will eventually be masked.
 * @param {IdsMaskOptions} options masking options
 * @returns {IdsMaskGeneratorResult} containing a mask that will match a formatted number.
 */
export function numberMask(rawValue = '', options: IdsMaskOptions = {}): IdsMaskGeneratorResult {
  let thisOptions = deepClone(DEFAULT_NUMBER_MASK_OPTIONS);
  thisOptions = Object.assign(thisOptions, options);

  const PREFIX = thisOptions.prefix;
  const SUFFIX = thisOptions.suffix;
  const DECIMAL = thisOptions.symbols.decimal;
  const THOUSANDS = thisOptions.symbols.thousands;
  const prefixLength = PREFIX?.length || 0;
  const suffixLength = SUFFIX?.length || 0;
  const thousandsSeparatorSymbolLength = THOUSANDS?.length || 0;

  let thisRawValue = rawValue;
  let mask;

  if (typeof thisRawValue !== 'string') {
    thisRawValue = EMPTY_STRING;
  }

  const rawValueLength = thisRawValue.length;

  //
  if (thisRawValue === EMPTY_STRING || (thisRawValue[0] === PREFIX[0] && rawValueLength === 1)) {
    mask = PREFIX.split(EMPTY_STRING)
      .concat([DIGITS_REGEX])
      .concat(SUFFIX.split(EMPTY_STRING));
  }
  // If the only item in the rawValue is a decimal, build out a simple 0 mask
  if (thisRawValue === DECIMAL && thisOptions.allowDecimal) {
    mask = PREFIX.split(EMPTY_STRING)
      .concat(['0', CARET_TRAP, DECIMAL, CARET_TRAP, DIGITS_REGEX])
      .concat(SUFFIX.split(EMPTY_STRING));
  }

  // If the mask is populated at this point, return it
  if (Array.isArray(mask)) {
    return { mask };
  }

  const indexOfLastDecimal = thisRawValue.lastIndexOf(DECIMAL);
  const hasDecimal = indexOfLastDecimal !== -1;
  const isNegative = (thisRawValue[0] === thisOptions.symbols.negative)
    && thisOptions.allowNegative;
  let integer;
  let fraction;

  // remove the suffix
  if (thisRawValue.slice(suffixLength * -1) === SUFFIX) {
    thisRawValue = thisRawValue.slice(0, suffixLength * -1);
  }

  if (hasDecimal) {
    integer = thisRawValue.slice(thisRawValue.slice(0, prefixLength) === PREFIX
      ? prefixLength : 0, indexOfLastDecimal);

    fraction = thisRawValue.slice(indexOfLastDecimal + 1, rawValueLength);
    fraction = convertToMask(fraction.replace(NON_DIGITS_REGEX, EMPTY_STRING));
  } else if (thisRawValue.slice(0, prefixLength) === PREFIX) {
    integer = thisRawValue.slice(prefixLength);
  } else {
    integer = thisRawValue;
  }

  if (options.integerLimit && typeof options.integerLimit === 'number') {
    const thousandsSeparatorRegex = THOUSANDS === '.' ? '[.]' : `${THOUSANDS}`;
    const numberOfThousandSeparators = (integer.match(new RegExp(thousandsSeparatorRegex, 'g')) || []).length;

    integer = integer.slice(0, options.integerLimit + (isNegative ? 1 : 0)
      + (numberOfThousandSeparators * thousandsSeparatorSymbolLength));
  }

  integer = integer.replace(NON_DIGITS_REGEX, EMPTY_STRING);

  if (!options.allowLeadingZeros) {
    integer = integer.replace(/^0+(0$|[^0])/, '$1');
  }

  // Pass the integer part to localization for adding Groups (thousands separators)
  if (options.allowThousandsSeparator) {
    const localeOptions = {
      maximumSignificantDigits: options.integerLimit,
      style: 'decimal',
      useGrouping: options.allowThousandsSeparator
    };
    integer = addThousandsSeparator(integer, options, localeOptions);
  }

  mask = convertToMask(integer);

  if ((hasDecimal && options.allowDecimal) || options.requireDecimal === true) {
    if (thisRawValue[indexOfLastDecimal - 1] !== DECIMAL) {
      mask.push(CARET_TRAP);
    }

    mask.push(DECIMAL, CARET_TRAP);

    if (fraction) {
      if (typeof options.decimalLimit === 'number') {
        fraction = fraction.slice(0, options.decimalLimit);
      }

      mask = mask.concat(fraction);
    }

    if (options.requireDecimal === true && thisRawValue[indexOfLastDecimal - 1] === DECIMAL) {
      mask.push(DIGITS_REGEX);
    }
  }

  if (prefixLength > 0) {
    mask = PREFIX.split(EMPTY_STRING).concat(mask);
  }

  if (isNegative) {
    // If user is entering a negative number, add a mask placeholder spot to
    // attract the caret to it.
    // TODO: Allow the negative symbol as the suffix as well (SOHO-3259)
    if (mask.length === prefixLength) {
      mask.push(DIGITS_REGEX);
    }

    mask = [/-/].concat(mask);
  }

  if (SUFFIX.length > 0) {
    mask = mask.concat(SUFFIX.split(EMPTY_STRING));
  }

  return {
    mask
  };
}

// Default Date Mask Options
export const DEFAULT_DATETIME_MASK_OPTIONS = {
  format: 'M/d/yyyy',
  symbols: {
    timeSeparator: ':',
    dayPeriodSeparator: ' ',
    dateSeparator: '/'
  }
};

// Maximum Values for various section maps of date strings.
const DATE_MAX_VALUES = {
  dd: 31,
  d: 31,
  MMM: undefined,
  MM: 12,
  M: 12,
  yy: 99,
  yyyy: 9999,
  h: 12,
  hh: 12,
  H: 24,
  HH: 24,
  mm: 60,
  ss: 60,
  a: undefined
};

/**
 * Converts a string containing character literals acting as separators for date sections
 * into a regular expression that can be used to detect those characters.
 * (used later in the masking process)
 * @param {string} splitterStr string representing all character literals present in a mask
 * @returns {RegExp} that will match all literal characters
 */
function getSplitterRegex(splitterStr: string) {
  const arr = splitterStr.split('');
  const fixedArr = arr.map((c) => {
    if (c === ' ') { // convert space characters into white space matcher
      return '\\s';
    }
    if (c === '-') { // escape dashes that might be part of date formats
      return '\\-';
    }
    return c;
  });
  return new RegExp(`[(${fixedArr.join('|')})]+`);
}

/**
 * Soho Date Mask Function
 * @param {string} rawValue the un-formatted value that will eventually be masked.
 * @param {IdsMaskOptions} options masking options
 * @returns {IdsMaskGeneratorResult} containing a mask that will match a formatted date,
 * along with extra meta-data about the characters contained.
 */
export function dateMask(rawValue = '', options: IdsMaskOptions = {}): IdsMaskGeneratorResult {
  // TODO: this function fails to properly convert new Date()
  // TODO: Write a test for rawValue = Mon Sep 04 2023 18:24:50 GMT-0400 (Eastern Daylight Time)
  let thisOptions = deepClone(DEFAULT_DATETIME_MASK_OPTIONS);
  thisOptions = Object.assign(thisOptions, options);

  let mask: any = [];
  let thisRawValue = rawValue;
  if (typeof rawValue !== 'string') {
    thisRawValue = '';
  }

  const digitRegex = DIGITS_REGEX;
  const format = thisOptions.format;
  const splitterStr = removeDuplicates(format.replace(/[dMyHhmsa]+/g, ''));

  const splitterRegex = getSplitterRegex(splitterStr);
  const formatArray = format.match(/(d{1,2}|M{1,4}|y{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|a{1}|z{1, 4}|E{1, 4})/g);
  const rawValueArray = thisRawValue.split(splitterRegex);
  const maxValue: any = DATE_MAX_VALUES;

  formatArray.forEach((part: string, i: number) => {
    const value = maxValue[part];
    let size;

    if (part === 'a' || part === 'ah') {
      // Match the day period
      let am = 'AM';
      let pm = 'PM';

      if (options.locale.calendar()) {
        am = options.locale.calendar().dayPeriods[0];
        pm = options.locale.calendar().dayPeriods[1];
        const apRegex = [];

        for (let j = 0; j < am.length; j++) {
          if (am[j] && pm[j] && am[j].toLowerCase() === pm[j].toLowerCase()) {
            apRegex.push(am[j].toLowerCase());
          } else {
            apRegex.push(am[j].toLowerCase() + (pm[j] ? pm[j].toLowerCase() : ''));
          }
        }

        for (let k = 0; k < apRegex.length; k++) {
          mask.push(new RegExp(`[${apRegex[k]}]`, 'i'));
        }
      } else {
        mask.push(/[aApP]/, /[Mm]/);
      }

      if (part === 'ah') {
        const hourValue = rawValueArray[i].replace(am, '').replace(pm, '');
        mask = mask.concat(getRegexForPart(hourValue, 'digits'));
      }
    } else if (!value) {
      mask = mask.concat(getRegexForPart(part, 'alphas'));
    } else if (rawValueArray[i]) {
      // Detect based on the size of a pre-existing formatted value, if possible.
      const rawValueStr = rawValueArray[i].toString();
      const rawValueFirstDigit = parseInt(rawValueStr.substr(0, 1), 10);
      const maxFirstDigit = parseInt(maxValue[part].toString().substr(0, 1), 10);

      if (part.length === 1 && rawValueFirstDigit > maxFirstDigit) {
        mask.push(digitRegex);
      } else if (rawValueStr !== '0' && rawValueStr.length === 1 && rawValueFirstDigit <= maxFirstDigit && rawValueArray[i + 1] !== undefined && part.toUpperCase() !== 'HH') {
        mask.push(digitRegex);
      } else {
        mask = mask.concat(getRegexForPart(value, 'digits'));
      }
    } else {
      // If NOT possible, pass back the maximum digit length that can be entered here
      size = value.toString().length;
      while (size > 0) {
        mask.push(digitRegex);
        size -= 1;
      }
    }

    // If this is not the last part, add whatever literals come after this part,
    // but before the next part.
    const nextPart = formatArray[i + 1];
    if (nextPart !== undefined) {
      const thisPartSize = part.toString().length;
      const start = format.indexOf(part) + thisPartSize;
      const end = format.indexOf(nextPart);
      const literals = format.substring(start, end).split(EMPTY_STRING);

      // Insert caret traps (create logical sections)
      const literalsWithCarets = [CARET_TRAP].concat(literals.concat(CARET_TRAP));

      mask = mask.concat(literalsWithCarets);
    }
  });

  return {
    mask,
    literals: splitterStr.split(''),
    literalRegex: splitterRegex
  };
}

/**
 * Range Date Mask
 * @param {string} rawValue the un-formatted value that will eventually be masked.
 * @param {IdsMaskOptions} options masking options
 * @returns {IdsMaskGeneratorResult} containing a mask that will match a formatted date,
 */
export function rangeDateMask(rawValue = '', options: IdsMaskOptions = {}): IdsMaskGeneratorResult {
  const parts: Array<string> = rawValue.split(options.delimiter);
  const delimiterArr: Array<string> = options.delimiter?.split('') || [];
  const firstDate: IdsMaskGeneratorResult = dateMask(parts[0], options);
  const secondDate: IdsMaskGeneratorResult = dateMask(parts[1], options);

  return {
    mask: firstDate.mask.concat(delimiterArr.concat(secondDate.mask as any)),
    literals: delimiterArr,
    literalRegex: secondDate.literalRegex
  };
}

/**
 * Generates a pipe function that can be applied to a Mask API that will correct
 * shorthand numeric dates.
 * NOTE: DOES NOT WORK FOR DATES WITH ALPHABETIC CONTENT. Do not use this if your
 * dates contain "MMM" or the full month name.
 * @param {object} processResult the results object of a mask process
 * @param {object} processResult.conformedValue the value after being conformed to the mask
 * @param {object} processResult.placeholderChar the placeholder char to use
 * @param {object} processResult.placeholder the placeholder text to use
 * @param {object} options settings for the date pipe function
 * @param {object} options.dateFormat the dateFormat text to use
 * @returns {object} the result of the piping function's changes
 */
export function autoCorrectedDatePipe(
  processResult: {
    conformedValue: string;
    placeholderChar: any;
    placeholder: string;
  },
  options: {
    dateFormat: string;
  }
) {
  options.dateFormat = 'M/d/yyyy'; // Locale.calendar().dateFormat.short;
  const conformedValueArr: any = processResult.conformedValue.split('');
  const indexesOfPipedChars: number[] = [];
  const dateFormatArray = options.dateFormat.split(/[^dMy]+/);
  const maxValue: any = {
    d: 31,
    M: 12,
    yy: 99,
    yyyy: 9999
  };
  const minValue: any = {
    d: 1,
    M: 1,
    yy: 0,
    yyyy: 1
  };

  // Check first digit
  dateFormatArray.forEach((format: any) => {
    const position = options.dateFormat.indexOf(format);
    const maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

    if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
      conformedValueArr[position + 1] = conformedValueArr[position];
      conformedValueArr[position] = 0;
      indexesOfPipedChars.push(position);
    }
  });

  const placeholderRegex = new RegExp(`[^${processResult.placeholderChar}]`);
  const maskPieces = processResult.placeholder.split(placeholderRegex);
  const conformedPieces = processResult.conformedValue.split(/\D/g);

  // Check for invalid date
  const isInvalid = dateFormatArray.some((format, i) => {
    const length = maskPieces[i].length > format.length ? maskPieces[i].length : format.length;
    const textValue = conformedPieces[i] || '';
    const value = parseInt(textValue, 10);

    return value > maxValue[format] || (textValue.length === length && value < minValue[format]);
  });

  if (isInvalid) {
    return false;
  }

  return {
    value: conformedValueArr.join(''),
    characterIndexes: indexesOfPipedChars
  };
}
