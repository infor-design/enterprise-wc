export type Breakpoints = { [index: string]: string };

export const breakpoints: Breakpoints = {
  xxl: '1440px',
  xl: '1280px',
  lg: '1024px',
  md: '840px',
  sm: '600px',
  xs: '360px'
};

/**
 * Check for max width media query.
 * @param {string} size size of the breakpoint
 * @returns {MediaQueryList} media query
 */
export function isWidthBelow(size: keyof Breakpoints): MediaQueryList {
  const width = breakpoints[size];
  return window.matchMedia(`(max-width: ${width})`);
}

/**
 * Check for min width media query.
 * @param {string} size size of the breakpoint
 * @returns {MediaQueryList} media query
 */
export function isWidthAbove(size: keyof Breakpoints): MediaQueryList {
  const width = breakpoints[size];
  return window.matchMedia(`(min-width: ${width})`);
}
