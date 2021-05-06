import renderLoop from '../ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../ids-render-loop/ids-render-loop-item';

/**
 * Debounces a function, preventing running the function too frequently while looping.
 * This is ideal for functions that run on intervals.
 * @param {Function} func the callback function to be run on a stagger.
 * @param {number} [duration] the amount of time in CPU ticks to delay.
 * @param {boolean} [execAsap] if true, executes the callback immediately
 *  instead of waiting for the threshold to complete.
 * @returns {void}
 */
export default function debounce(func, duration = 60, execAsap) {
  let timeout;

  // Clears the render loop item
  const destroyTimeout = () => {
    timeout.destroy(true);
    timeout = null;
  };

  return function debounced(...args) {
    const obj = this;
    const timeoutCallback = () => {
      if (!execAsap) {
        func.apply(obj, args);
      }
      destroyTimeout();
    };

    if (timeout) {
      destroyTimeout();
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = new IdsRenderLoopItem({
      duration,
      timeoutCallback
    });
    renderLoop.register(timeout);
  };
}
