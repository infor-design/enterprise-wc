import { timestamp } from './ids-render-loop-common';

/**
 * An IDS RenderLoop Queue Item
 */
class IdsRenderLoopItem extends Object {
  /**
   * @param {object} opts incoming item options
   * @returns {IdsRenderLoopItem} component instance
   */
  constructor(opts = {}) {
    super();

    // This can be referenced by the RenderLoopAPI to change this item's settings
    this.id = opts.id;

    // Setting a duration greater than '-1' causes the RenderLoopItem to automatically
    // remove itself from the queue after that duration.
    this.duration = opts.duration || -1;

    // Either ID or a duration is required.
    if (this.duration < 1 && (typeof this.id !== 'string' || !this.id.length)) {
      throw new Error('cannot build a RenderLoopItem with no duration and no namespace');
    }

    // Number of frames this loop item will step before running its
    // `updateCallback()`, if defined
    this.updateDuration = opts.updateDuration || 1;
    if (this.updateDuration > 0) {
      this.timeUntilNextUpdate = this.updateDuration;
    }

    // handles the setting of user-defined callback functions
    this.setFuncs(opts);

    // Internal state
    this.paused = false;
    this.elapsedTime = 0;
    this.startTime = timestamp();

    return this;
  }

  /**
   * Handles the setting of user-defined callback functions
   * @private
   * @param {object} opts incoming settings
   */
  setFuncs(opts = {}) {
    if (typeof opts.updateCallback !== 'function' && typeof opts.timeoutCallback !== 'function') {
      throw new Error('cannot register callback to RenderLoop because callback is not a function');
    }

    if (typeof opts.updateCallback === 'function') {
      this.updateCallback = opts.updateCallback;
    }

    if (typeof opts.timeoutCallback === 'function') {
      this.timeoutCallback = opts.timeoutCallback;
    }
  }

  /**
   * Defines the time this item begins its lifecycle
   * @returns {void}
   */
  init() {
    if (!this.startTime) {
      this.startTime = timestamp();
    }
  }

  /**
   * Causes the update cycle of this loop item not to occur
   * @returns {void}
   */
  pause() {
    this.paused = true;
  }

  /**
   * Causes the update cycle of this loop item to start occurring
   * @returns {void}
   */
  resume() {
    this.paused = false;
  }

  /**
   * Increases this item's tracking of elapsed time in the loop, as well as
   * how many more frames exist until an update callback occurs.
   * @returns {void}
   */
  count() {
    // Always add to elapsed time
    this.elapsedTime++;

    // If this item updates on a step value, subtract from the internal count
    // until it hits zero. When changing count on 0, the update time resets.
    if (typeof this.timeUntilNextUpdate === 'number') {
      if (this.timeUntilNextUpdate === 0) {
        this.timeUntilNextUpdate = this.updateDuration;
      }
      if (this.timeUntilNextUpdate > 0) {
        --this.timeUntilNextUpdate;
      }
    }
  }

  /**
   * @readonly
   * @returns {boolean} true if the item's `updateCallback` will be fired on this renderLoop tick
   */
  get canUpdate() {
    return typeof this.timeUntilNextUpdate === 'number' && this.timeUntilNextUpdate === 0;
  }

  /**
   * Fires a defined `updateCallback()` under the right conditions
   * @param {...Array<any>} [callbackArgs] gets passed to an `updateCallback`
   * @returns {void}
   */
  update(...callbackArgs) {
    if (typeof this.updateCallback !== 'function' || !this.canUpdate) {
      return;
    }

    this.updateCallback(callbackArgs);
  }

  /**
   * Fires a defined `timeoutCallback()` under the right conditions.
   * @returns {void}
   */
  timeout() {
    if (typeof this.timeoutCallback !== 'function' || this.noTimeout) {
      return;
    }

    this.timeoutCallback();
  }

  /**
   * @param {boolean} noTimeout causes the item to be destroyed without
   * triggering the `timeoutCallback` function
   * @returns {void}
   */
  destroy(noTimeout) {
    if (noTimeout) {
      this.noTimeout = true;
    }
    this.doRemoveOnNextTick = true;
  }
}

export default IdsRenderLoopItem;
