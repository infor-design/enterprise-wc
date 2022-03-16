import { timestamp } from './ids-render-loop-common';

interface RenderLoopItemSettings {
  id?: string;
  duration?: number;
  updateDuration?: number;
  updateCallback?: (args: CallableFunction) => void;
  timeoutCallback?: (args: CallableFunction) => void;
}

/**
 * An IDS RenderLoop Queue Item
 * @type {IdsRenderLoopItem}
 * @param {object} settings incoming item options
 */
export default class IdsRenderLoopItem extends Object {

  id?: string;
  duration?: number;
  updateDuration?: number;
  updateCallback?: CallableFunction;
  timeoutCallback?: CallableFunction;
  paused: boolean;
  startTime: number;
  totalStoppedTime: number;
  nextUpdateTime?: number;
  lastPauseTime?: number;
  resumeTime?: number;
  noTimeout?: boolean ;
  doRemoveOnNextTick?: boolean;

  /**
   * @param {object} settings incoming item options
   */
  constructor(settings: RenderLoopItemSettings = { }) {
    super();

    // This can be referenced by the RenderLoopAPI to change this item's settings
    this.id = settings.id;

    // Setting a duration greater than '-1' causes the RenderLoopItem to automatically
    // remove itself from the queue after that duration.
    this.duration = -1;
    this.duration = settings.duration;
    if (typeof settings.duration === 'number') {
      this.duration = settings.duration;
    }

    // Number of frames this loop item will step before running its
    // `updateCallback()`, if defined
    this.updateDuration = 1;
    if (typeof settings.updateDuration === 'number') {
      this.updateDuration = settings.updateDuration;
    }
    this.setNextUpdateTime();

    // handles the setting of user-defined callback functions
    if (typeof settings.updateCallback === 'function') {
      this.updateCallback = settings.updateCallback.bind(this);
    }

    if (typeof settings.timeoutCallback === 'function') {
      this.timeoutCallback = settings.timeoutCallback.bind(this);
    }

    // Internal state
    this.paused = false;
    this.startTime = timestamp();
    this.totalStoppedTime = 0;
  }

  /**
   * Appends the update duration to a current timestamp and stores it, to define
   * when this item will next run its update callback.
   * @returns {void}
   */
  setNextUpdateTime() {
    this.nextUpdateTime = timestamp() + (this.updateDuration || 0);
  }

  /**
   * Causes the update cycle of this loop item not to occur
   * @returns {void}
   */
  pause() {
    this.paused = true;
    this.lastPauseTime = timestamp();
  }

  /**
   * Causes the update cycle of this loop item to start occurring
   * @returns {void}
   */
  resume() {
    this.resumeTime = timestamp();
    this.totalStoppedTime += this.resumeTime - (this.lastPauseTime || 0)
    delete this.lastPauseTime;
    this.paused = false;
  }

  /**
   * @readonly
   * @returns {number} the elapsed time this RenderLoop item has existed for
   */
  get elapsedTime() {
    return timestamp() - (this.startTime + ( this.totalStoppedTime || 0));
  }

  /**
   * @readonly
   * @returns {boolean} true if the item's `updateCallback` will be fired on this renderLoop tick
   */
  get canUpdate() {
    return typeof this.nextUpdateTime === 'number' && timestamp() > this.nextUpdateTime;
  }

  /**
   * Fires a defined `updateCallback()` under the right conditions
   * @param {object} timeInfo containing raw time information from the loop (last, delta, now)
   * @param {...Array<any>} [callbackArgs] user-defined parameters that get passed
   *  to an `updateCallback()` method.
   * @returns {void}
   */
  update(timeInfo: { last: number, delta: number, now: number}, ...callbackArgs: Array<unknown>) {
    if (typeof this.updateCallback !== 'function' || !this.canUpdate) {
      return;
    }

    // NOTE: This runs in this `IdsRenderLoopItem`s context
    this.updateCallback(timeInfo, ...callbackArgs);
    this.setNextUpdateTime();
  }

  /**
   * Fires a defined `timeoutCallback()` under the right conditions.
   * @returns {void}
   */
  timeout() {
    if (typeof this.timeoutCallback !== 'function' || this.noTimeout) {
      return;
    }

    // NOTE: This runs in this `IdsRenderLoopItem`s context
    this.timeoutCallback();
  }

  /**
   * @param {boolean} noTimeout causes the item to be destroyed without
   * triggering the `timeoutCallback` function
   * @returns {void}
   */
  destroy(noTimeout?: boolean) {
    if (noTimeout) {
      this.noTimeout = true;
    }
    this.doRemoveOnNextTick = true;
  }
}
