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

    // for event-subscription related logic, bind "this" of the
    // functions to the class instance to avoid this calls from
    // delegated functions or other external scoping issues
    this.detachAllEvents = this.detachAllEvents.bind(this);
    this.detachEventsByName = this.detachEventsByName.bind(this);
    this.offEvent = this.offEvent.bind(this);
    this.onEvent = this.onEvent.bind(this);
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
   * Remove event listener
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  offEvent(eventName, target, options) {
    const handler = this.handledEvents.get(eventName);
    this.handledEvents.delete(eventName);
    if (handler?.callback) {
      target.removeEventListener(eventName.split('.')[0], handler.callback, options || handler.options);
    }
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
   * Detach a specific handlers associated with a name
   * @param {string} [eventName] an optional event name to filter with
   */
  detachEventsByName = (eventName) => {
    const isValidName = (typeof eventName === 'string') && eventName.length;

    if (isValidName && this.handledEvents.has(eventName)) {
      const event = this.handledEvents.get(eventName);

      // @ts-ignore
      this.offEvent(eventName, event.target, event.options);
    }
  };
};

export { IdsEventsMixin };
