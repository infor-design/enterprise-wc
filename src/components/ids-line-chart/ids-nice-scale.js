/**
 * Calculates a nice scale range for a pair of values.
 */
export default class NiceScale {
  /** The calculated min value */
  #minPoint;

  /** The calculated max value */
  #maxPoint;

  /** The calculated max ticks */
  #maxTicks = 10;

  /** The calculated tick spacing */
  #range;

  /** The calculated tick spacing */
  tickSpacing;

  /** The calculated nice min value */
  niceMin;

  /** The calculated nice max value */
  niceMax;

  /**
   * Instantiates a new instance of the NiceScale class.
   * @param {number} min the minimum data point on the axis
   * @param {number} max the maximum data point on the axis
   * @param {object} options Additional less used options (maxTicks, minPoint, maxPoint)
   */
  constructor(min, max, options = {}) {
    this.#maxTicks = options?.maxTicks || 10;
    this.#minPoint = options?.minPoint || min;
    this.#maxPoint = options?.maxPoint || max;
    this.#calculate();
  }

  /**
   * Calculate and update values for tick spacing and nice
   * minimum and maximum data points on the axis.
   */
  #calculate() {
    this.#range = this.#niceNum(this.#maxPoint - this.#minPoint, false);
    this.tickSpacing = this.#niceNum(this.#range / (this.#maxTicks - 1), true);
    this.niceMin = Math.floor(this.#minPoint / this.tickSpacing) * this.tickSpacing;
    this.niceMax = Math.ceil(this.#maxPoint / this.tickSpacing) * this.tickSpacing;
  }

  /**
   * Returns a "nice" number approximately equal to range Rounds
   * the number if round = true Takes the ceiling if round = false.
   * @param {number} range the data range
   * @param {boolean} round whether to round the result
   * @returns {boolean} a "nice" number to be used for the data range
   */
  #niceNum(range, round) {
    let niceFraction; /** nice, rounded fraction */

    const exponent = Math.floor(Math.log10(range));
    const fraction = range / 10 ** exponent;

    if (round) {
      if (fraction < 1.5) {
        niceFraction = 1;
      } else if (fraction < 3) {
        niceFraction = 2;
      } else if (fraction < 7) {
        niceFraction = 5;
      } else {
        niceFraction = 10;
      }
    } else if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;

    return niceFraction * 10 ** exponent;
  }
}
