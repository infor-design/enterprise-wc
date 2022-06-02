import { Breakpoints, breakpoints } from '../../core/ids-attributes';

/**
 * Check for max width media query.
 * @param {string} size size of the breakpoint
 * @returns {MediaQueryList} media query
 * @memberof IdsHidden
 */
export function isWidthBelow(size: keyof Breakpoints): MediaQueryList {
  const width = breakpoints[size];
  return window.matchMedia(`(max-width: ${width})`);
}

/**
 * Check for min width media query.
 * @param {string} size size of the breakpoint
 * @returns {MediaQueryList} media query
 * @memberof IdsHidden
 */
export function isWidthAbove(size: keyof Breakpoints): MediaQueryList {
  const width = breakpoints[size];
  return window.matchMedia(`(min-width: ${width})`);
}
