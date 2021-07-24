/**
 * Gets computed translate values from style prop; adapted from:
 * https://zellwk.com/blog/css-translate-values-in-javascript/
 *
 * @param {HTMLElement} element element to grab translation point from it's styles with
 * @returns {{ x?: number, y?: number, z?:number }} translation point if available
 */
export default function getElTranslatePoint(element) /* istanbul ignore next */ {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;

  // No transform property. Simply return 0 values.

  if (matrix === 'none' || !matrix) {
    return { x: 0, y: 0, z: 0 };
  }

  // Can either be 2d or 3d transform

  const matrixType = matrix.includes('3d') ? '3d' : '2d';

  // the following checks are need for non standard envs e.g. Jest or SSR
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)?.[1]?.split(', ');

  if (matrixValues.length === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.

  if (matrixType === '2d') {
    return {
      x: Number.parseFloat(matrixValues[4]),
      y: Number.parseFloat(matrixValues[5]),
      z: 0
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z

  if (matrixType === '3d') {
    return {
      x: parseFloat(matrixValues[12]),
      y: parseFloat(matrixValues[13]),
      z: parseFloat(matrixValues[14])
    };
  }

  // default case; return zeroes in case
  // we are using in a computation to translate
  // another component

  return {
    x: 0,
    y: 0,
    z: 0
  };
}
