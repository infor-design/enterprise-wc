import IdsRenderLoop from './ids-render-loop';
import IdsRenderLoopItem from './ids-render-loop-item';

// Stores the global RenderLoop instance.
let rl = null;
const IdsRenderLoopMixin = {
  /**
   * Provides access to a global `requestAnimationFrame` loop, configured to run a queue of
   * callback methods on each tick.
   * @returns {IdsRenderLoop} link to the global RenderLoop instance
   */
  get rl() {
    if (!rl) {
      rl = new IdsRenderLoop();
    }
    return rl;
  }
};

export { IdsRenderLoopMixin, IdsRenderLoopItem };
