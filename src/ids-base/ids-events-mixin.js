/**
 * A mixin that adds event handler functionality that is also safely torn down when a component is
 * removed from the DOM.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsEventsMixin = (superclass) => class extends superclass {
  handledEvents = new Map();

  constructor() {
    super();
  }

  /**
   * Add and keep track of an event listener.
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {Function|any} callback The callback code to execute
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  onEvent(eventName, target, callback, options) {
    target.addEventListener(eventName.split('.')[0], callback, options);
    this.handledEvents.set(eventName, { target, callback, options });
  }

  /**
   * Add and keep track of an event listener.
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  offEvent(eventName, target, options) {
    const handler = this.handledEvents.get(eventName);
    if (handler?.callback) {
      target.removeEventListener(eventName.split('.')[0], handler.callback, options || handler.options);
    }
    this.handledEvents.delete(eventName);
  }

  /**
   * Create and trigger a custom event
   * @param {string} eventName The event id with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} [options = {}] The custom data to send
   */
  triggerEvent(eventName, target, options = {}) {
    const event = new CustomEvent(eventName.split('.')[0], options);
    target.dispatchEvent(event);
  }

  /**
   * Detach all event handlers
   */
  detachAllEvents() {
    this.handledEvents.forEach((value, key) => {
      this.offEvent(key, value.target, value.options);
    });
  }

  /**
   * Detach a specific handler by name
   * @param {string} [eventName] an optional event name to filter with
   */
  detachEventName(eventName) {
    const doCheck = typeof eventName === 'string' && eventName.length;
    this.handledEvents.forEach((value, key) => {
      if (doCheck && key !== eventName) {
        return;
      }
      this.offEvent(key, value.target, value.options);
    });
  }
};

export { IdsEventsMixin };
