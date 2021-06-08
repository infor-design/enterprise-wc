/**
 * waits for a cycle of requestAnimationFrame running in browser
 * before continuing in an async function
 *
 * @returns {Promise} promise resolving when anim frame is completed
 */
const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resolve);
  });
});

export default processAnimFrame;
