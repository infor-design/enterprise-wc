/**
 * Light-weight wrapper around events.
 */
export default function IdsEventHandler() {
  this.handledEvents = new Map();

  /**
   * Add and keep track of an event listener.
   * @param {string} event The event id/namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {Function} callback The callback code to execute
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  this.addEventListener = (event, target, callback, options) => {
    target.addEventListener(event, callback, options);
    this.handledEvents.set(event, { target, callback, options });
  };

  /**
   * Add and keep track of an event listener.
   * @param {string} event The event id/namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  this.removeEventListener = (event, target, options) => {
    const handler = this.handledEvents.get(event);
    target.removeEventListener(event, handler.callback, options || handler.options);
    this.handledEvents.delete(event);
  };

  /**
   * Detach all event handlers
   */
  this.removeAll = () => {
    this.handledEvents.forEach((value, key) => {
      this.removeEventListener(key, value.target, value.options);
    });
  };
}

export { IdsEventHandler };
