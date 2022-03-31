/**
 * Debounce method called only once in a given time period, delay after its last invocation.
 * @param {object} func the callback function to be run on a stagger.
 * @param {object} func.apply the apply method for given callback.
 * @param {number} threshold the amount of time in CPU ticks to delay.
 * @param {boolean} execAsap if true, executes the callback immediately
 *  instead of waiting for the threshold to complete.
 * @returns {object} the return debounced callback to run
 */
export default function debounce(
  func: { apply: (arg0: any, arg1: any[]) => void; },
  threshold: number,
  execAsap?: boolean
): object {
  let timeout: any;

  return function debounced(this: any, ...args: any[]) {
    const obj = this;
    const delayed = () => {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    };

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 250);
  };
}
