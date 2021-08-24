import IdsInput from '../../src/components/ids-input';
import { DIGITS_REGEX, EMPTY_STRING } from '../../src/components/ids-mask/ids-mask-common';

document.addEventListener('DOMContentLoaded', () => {
  // Masked field with a prefix
  const prefix = document.querySelector('#mask-prefix');
  prefix.maskOptions = {
    prefix: '$'
  };
  prefix.mask = (rawValue, opts) => {
    const totalDigits = rawValue.split(EMPTY_STRING).map(() => DIGITS_REGEX);
    return [opts.prefix, ...totalDigits];
  };

  // Masked field with a suffix
  const suffix = document.querySelector('#mask-suffix');
  suffix.maskOptions = {
    suffix: '%'
  };
  suffix.mask = (rawValue, opts) => {
    const totalDigits = rawValue.split(EMPTY_STRING).map(() => DIGITS_REGEX);
    return [...totalDigits, opts.suffix];
  };
});
