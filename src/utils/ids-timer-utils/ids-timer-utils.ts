const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;

export type FrameRequestLoopHandler = {
  value?: number;
};

/**
 * Behaves similarly to `setTimeout`, using `requestAnimationFrame()` where possible for better performance
 * @param {FrameRequestCallback} fn The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {number} loop handle
 */
export function requestAnimationTimeout(fn: FrameRequestCallback, delay: number): FrameRequestLoopHandler {
  if (!RAF) return { value: setTimeout(fn, delay) };

  const start = new Date().getTime();
  const handle: FrameRequestLoopHandler = {};

  const loop = (): void => {
    const current = new Date().getTime();
    const delta = current - start;

    if (delta >= delay) fn.call();
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
