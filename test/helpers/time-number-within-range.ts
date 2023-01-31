/**
 * Checks that a number representing a time's "seconds|minutes" parameters is within a valid range
 * @param {number} val the value to check
 * @param {number} min the minimum range
 * @param {number} max the maximum range
 * @returns {boolean} true if the value is within range
 */
export const timeNumberWithinRange = async (val: number, min: number, max: number) => {
  if (max > 59) return val === 1 || val >= min;
  if (max < 0) return val === 59 || val <= max;
  return val >= min && val <= max;
};
