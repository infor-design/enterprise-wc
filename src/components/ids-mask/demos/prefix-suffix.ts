// Supporting components
import { DIGITS_REGEX, EMPTY_STRING } from '../ids-mask-common';

document.addEventListener('DOMContentLoaded', () => {
  // Masked field with a prefix
  const prefix:any = document.querySelector('#mask-prefix');
  prefix.maskOptions = {
    prefix: '$'
  };
  prefix.mask = (rawValue: string, opts: any) => {
    const totalDigits = rawValue.split(EMPTY_STRING).map(() => DIGITS_REGEX);
    return [opts.prefix, ...totalDigits];
  };

  // Masked field with a suffix
  const suffix: any = document.querySelector('#mask-suffix');
  suffix.maskOptions = {
    suffix: '%'
  };
  suffix.mask = (rawValue: string, opts: any) => {
    const totalDigits = rawValue.split(EMPTY_STRING).map(() => DIGITS_REGEX);
    return [...totalDigits, opts.suffix];
  };
});
