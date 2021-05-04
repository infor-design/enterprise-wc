export const EMPTY_STRING: string;
export const PLACEHOLDER_CHAR: string;
export const CARET_TRAP: string;
export const NON_DIGITS_REGEX: RegExp;
export const DIGITS_REGEX: RegExp;
export const ALPHAS_REGEX: RegExp;
export const ANY_REGEX: RegExp;

export const DEFAULT_CONFORM_OPTIONS: {
  caretTrapIndexes: Array<number>,
  guide?: boolean,
  previousMaskResult?: string,
  placeholderChar?: string,
  placeholder?: string,
  selection?: {
    start?: number
    end?: number
  }
  keepCharacterPositions?: boolean
};

export function convertPatternFromString(pattern?: string): Array<string|RegExp> | undefined;
