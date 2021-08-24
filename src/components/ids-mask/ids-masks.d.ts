export const DEFAULT_NUMBER_MASK_OPTIONS: {
  prefix?: string,
  suffix?: string,
  allowThousandsSeparator?: boolean,
  symbols?: {
    currency?: string,
    decimal?: string,
    negative?: string,
    thousands?: string
  },
  allowDecimal?: boolean,
  decimalLimit?: number,
  locale?: string,
  requireDecimal?: boolean,
  allowNegative?: boolean,
  allowLeadingZeros: boolean,
  integerLimit?: number | null,
};

declare type MaskArray = Array<RegExp|string>;

declare type MaskReturnObject = {
  mask: MaskArray
};

export function numberMask(rawValue?: string, options?: Record<string, unknown>): MaskReturnObject;

export const DEFAULT_DATETIME_MASK_OPTIONS: {
  format: string,
  symbols?: {
    timeSeparator?: string,
    dayPeriodSeparator?: string,
    dateSeparator?: string
  }
};

declare type DateMaskReturnObject = {
  mask: MaskArray,
  literals: Array<string>,
  literalRegex: RegExp
};

export function dateMask(
  rawValue?: string, options?: Record<string, unknown>
): DateMaskReturnObject;

declare type DatePipeReturnObject = {
  characterIndexes: number[],
  value: string
};

export function autocorrectedDatePipe(
  processResult: Record<string, unknown>,
  options: Record<string, unknown>
): DatePipeReturnObject;
