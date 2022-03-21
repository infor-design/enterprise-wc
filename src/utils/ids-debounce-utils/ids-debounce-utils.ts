/**
 * Debounce method called only once in a given time period, delay after its last invocation.
 * @param {Function} func the callback function to be run on a stagger.
 * @param {number} threshold the amount of time in CPU ticks to delay.
 * @param {boolean} execAsap if true, executes the callback immediately
 *  instead of waiting for the threshold to complete.
 * @returns {void}
 */
export function debounce(func: { apply: (arg0: any, arg1: any[]) => void; }, threshold: any, execAsap: any) {
  let timeout: any;

  return function debounced(this: any, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
