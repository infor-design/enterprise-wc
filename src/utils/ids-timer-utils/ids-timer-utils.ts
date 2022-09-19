const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;

export type FrameRequestLoopHandler = {
  value?: number;
};

/**
 * Behaves similarly to `setInterval`, using `requestAnimationFrame()` where possible for better performance
 * @param {FrameRequestCallback} fn The callback function
 * @param {number} interval The delay in milliseconds
 * @returns {number} loop handle
 */
export function requestAnimationInterval(fn: FrameRequestCallback, interval = 0): FrameRequestLoopHandler {
  if (!RAF) return { value: setInterval(fn, interval) };

  let start = new Date().getTime();
  const handle: FrameRequestLoopHandler = {};

  const loop = (): void => {
    const current = new Date().getTime();
    const delta = current - start;

    if (delta >= interval) {
      fn(current);
      start = new Date().getTime();
    }

    handle.value = RAF(loop);
  };

  handle.value = RAF(loop);
  return handle;
}

/**
 * Behaves similarly to `clearInterval`, using `cancelAnimationFrame()` where possible for better performance
 * @param {FrameRequestLoopHandler} handle The callback function
 */
export function clearAnimationInterval(handle: FrameRequestLoopHandler) {
  if (handle?.value) {
    if (!CAF) clearInterval(handle.value);
    else CAF(handle.value);
  }
}

/**
 * Behaves similarly to `setTimeout`, using `requestAnimationFrame()` where possible for better performance
 * @param {FrameRequestCallback} fn The callback function
 * @param {number} timeout The timeout delay in milliseconds
 * @returns {number} loop handle
 */
export function requestAnimationTimeout(fn: FrameRequestCallback, timeout = 0): FrameRequestLoopHandler {
  if (!RAF) return { value: setTimeout(fn, timeout) };

  const start = new Date().getTime();
  const handle: FrameRequestLoopHandler = {};

  const loop = (): void => {
    const current = new Date().getTime();
    const delta = current - start;

    if (delta >= timeout) fn(current);
    else handle.value = RAF(loop);
  };

  handle.value = RAF(loop);
  return handle;
}

/**
 * Behaves similarly to `clearTimeout`, using `cancelAnimationFrame()` where possible for better performance
 * @param {FrameRequestLoopHandler} handle The callback function
 */
export function clearAnimationTimeout(handle: FrameRequestLoopHandler) {
  if (handle?.value) {
    if (!CAF) clearTimeout(handle.value);
    else CAF(handle.value);
  }
}

/**
 * Fakes a "timeout" using a CSS transition on an invisible element
 * @param {number} timeout the transition duration in ms
 * @returns {Promise<void>} resolved when the CSS transition completes
 */
export const cssTransitionTimeout = async (timeout: number): Promise<void> => new Promise((resolve) => {
  const el = document.createElement('div');
  el.classList.add('ids-transition-timeout');
  el.style.setProperty('display', 'block');
  el.style.setProperty('position', 'absolute');
  el.style.setProperty('visibility', 'hidden');
  el.style.setProperty('pointer-events', 'none');
  el.style.setProperty('width', '0');
  el.style.setProperty('transition-property', 'width');
  el.style.setProperty('transition-timing-function', 'linear');
  el.style.setProperty('transition-duration', `${timeout}ms`);
  document.body.append(el);

  const onTransitionEnd = () => {
    el.removeEventListener('transitionend', onTransitionEnd);
    el.remove();
    resolve();
  };

  el.addEventListener('transitionend', onTransitionEnd);

  el.offsetHeight; // eslint-disable-line
  el.style.setProperty('width', '100%');
});
