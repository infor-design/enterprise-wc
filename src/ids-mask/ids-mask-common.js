/**
 * Contains various Mask-related utilities, settings, masking functions, etc.
 */

/**
 * @property {string} EMPTY_STRING just an empty string
 */
export const EMPTY_STRING = '';

/**
 * @property {string} PLACEHOLDER_CHAR the default placeholder used in guides
 */
export const PLACEHOLDER_CHAR = '_';

/**
 * @property {string} CARET_TRAP the string of characters representing a caret trap in mask arrays
 */
export const CARET_TRAP = '[]';

/**
 * @property {RegExp} NON_DIGITS_REGEX regular expression matching non-digit characters
 */
export const NON_DIGITS_REGEX = /[^\u0660-\u06690-9\u0966-\u096F\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/g;

/**
 * @property {RegExp} DIGITS_REGEX regular expression matching digit characters
 */
export const DIGITS_REGEX = /[\u0660-\u06690-9\u0966-\u096F\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/;

/**
 * @property {RegExp} ALPHAS_REGEX regular expression matching alphabetic, non-special characters
 */
export const ALPHAS_REGEX = /[\u00C0-\u017Fa-zA-Z]/;

/**
 * @property {RegExp} ANY_REGEX regular expression matching any non-special characters
 */
export const ANY_REGEX = /[\u00C0-\u017Fa-zA-Z0-9]/;

/**
 * Legacy Mask pattern definitions.
 * The New Mask works based on an array of RegExps and Strings.
 * Will be translated to RegExp when a string-based pattern is convered to an array in the new Mask.
 * @property {object} LEGACY_DEFS mask definitions used by the old Soho Mask component.
 */
export const LEGACY_DEFS = {
  '#': DIGITS_REGEX,
  0: DIGITS_REGEX,
  x: ALPHAS_REGEX,
  '*': ANY_REGEX,
  '?': /./,
  '~': /[-0-9]/,
  a: /[APap]/,
  m: /[Mm]/
};

/**
 * Default options that get passed for the `maskAPI.conformToMask()` method.
 * @property {object} DEFAULT_CONFORM_OPTIONS default options
 */
export const DEFAULT_CONFORM_OPTIONS = {
  caretTrapIndexes: [],
  guide: true,
  previousMaskResult: EMPTY_STRING,
  placeholderChar: PLACEHOLDER_CHAR,
  placeholder: EMPTY_STRING,
  selection: {
    start: 0
  },
  keepCharacterPositions: true
};

/**
 * @param {string} pattern a string containing a pattern that needs parsing
 * @returns {Array<string|RegExp>|Function|undefined} a valid mask or nothing
 */
export function convertPatternFromString(pattern) {
  if (typeof pattern !== 'string' || !pattern.length) {
    return undefined;
  }

  const firstChar = pattern.charAt(0);
  const lastChar = pattern.charAt(pattern.length - 1);

  // Detect inlined arrays (JSON-like)
  if (firstChar === '[' && lastChar === ']') {
    const patternArray = pattern.substring(1, pattern.length - 1).split(/, ?/g);
    return patternArray.map((item) => {
      // Remove quotes
      if (item.charAt(0) === '\'') {
        return item.substring(1, item.length - 1);
      }
      // Convert string-based regex into RegExp objects
      if (item.charAt(0) === '/') {
        return new RegExp(item.substring(1, item.length - 1));
      }
      return item;
    });
  }

  // @TODO: Try to detect other types of string input
  // for now, return an empty mask
  return undefined;
}
