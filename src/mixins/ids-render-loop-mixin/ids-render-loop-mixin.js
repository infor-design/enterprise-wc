import { IdsRenderLoopItem } from '../../components/ids-render-loop/ids-render-loop';
import renderLoop from '../../components/ids-render-loop/ids-render-loop-global';

const IdsRenderLoopMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  /**
   * Provides access to a global `requestAnimationFrame` loop, configured to run a queue of
   * callback methods on each tick.
   * @returns {any} link to the global RenderLoop instance
   */
  get rl() {
    return renderLoop;
  }
};

export { IdsRenderLoopMixin, IdsRenderLoopItem, renderLoop as IdsRenderLoopGlobal };
