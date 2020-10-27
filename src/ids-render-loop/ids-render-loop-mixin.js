import IdsRenderLoop from './ids-render-loop';
import IdsRenderLoopItem from './ids-render-loop-item';

/**
 * Builds the global IDS object
 * @private
 * @returns {void}
 */
function checkForIDS() {
  if (!window.Ids) {
    window.Ids = {};
  }
}

/**
 * This mixin provides access to a global `requestAnimationFrame` loop, configured to run a queue of
 * callback methods on each tick.
 */
const IdsRenderLoopMixin = {
  /**
   * @param {object} [settings] incoming IdsRenderLoop settings
   * @returns {void}
   */
  setupRenderLoop(settings) {
    checkForIDS();

    if (!window.Ids.renderLoop) {
      window.Ids.renderLoop = new IdsRenderLoop(settings);
    }

    if (!this.rl) {
      this.rl = window.Ids.renderLoop;
    }
  },

  /**
   * Removes the connection to the RenderLoop
   * @returns {void}
   */
  disconnectRenderLoop() {
    if (this.rl) {
      delete this.rl;
    }
  }
};

export { IdsRenderLoopMixin, IdsRenderLoopItem };
