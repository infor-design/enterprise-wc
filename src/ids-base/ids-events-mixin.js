import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';

/**
 * A mixin that adds event handler functionality that is also safely torn down when a component is
 * removed from the DOM.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsEventsMixin = (superclass) => class extends IdsRenderLoopMixin(superclass) {
  constructor() {
    super();
    this.handledEvents = new Map();

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
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  onEvent(eventName, target, callback, options) {
    if (!target) {
      return;
    }

    if (eventName.indexOf('longpress') === 0) {
      this.addLongPressListener(eventName, target, options);
    }
    if (eventName.indexOf('keyboardfocus') === 0) {
      this.addKeyboardFocusListener(eventName, target, options);
    }
    if (eventName.indexOf('hoverend') === 0) {
      this.addHoverEndListener(eventName, target, options);
    }
    target.addEventListener(eventName.split('.')[0], callback, options);
    this.handledEvents.set(eventName, { target, callback, options });
  }

  /**
   * Remove event listener
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to deregister (or previous registered target)
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  offEvent(eventName, target, options) {
    const handler = this.handledEvents.get(eventName);
    this.handledEvents.delete(eventName);

    // Handle Special events
    if (eventName.indexOf('longpress') === 0 && handler?.callback) {
      this.removeLongPressListener();
      return;
    }

    if (eventName.indexOf('keyboardfocus') === 0 && handler?.callback) {
      this.removeKeyboardFocusListener();
      return;
    }

    if (eventName.indexOf('hoverend') === 0 && handler?.callback) {
      this.removeHoverEndListener();
      return;
    }

    const targetApplied = target || handler?.target;
    if (handler?.callback && targetApplied?.removeEventListener) {
      targetApplied.removeEventListener(eventName.split('.')[0], handler.callback, options || handler.options);
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
    this.removeLongPressListener();
    this.removeKeyboardFocusListener();
    this.removeHoverEndListener();
  }

  /**
   * Detach a specific handlers associated with a name
   * @param {string} [eventName] an optional event name to filter with
   */
  detachEventsByName = (eventName) => {
    const isValidName = (typeof eventName === 'string') && eventName.length;

    if (isValidName && this.handledEvents.has(eventName)) {
      const event = this.handledEvents.get(eventName);
      this.offEvent(eventName, event.target, event.options);
    }
  };

  /**
   * Setup a custom long press event (just one)
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  addLongPressListener(eventName, target, options) {
    if (this.longPressOn) {
      return;
    }

    // Setup events
    this.onEvent('touchstart.longpress', target, (e) => {
      e.preventDefault();
      /* istanbul ignore next */
      if (!this.timer) {
        this.timer = this.rl?.register(new IdsRenderLoopItem({
          duration: options?.delay || 500,
          timeoutCallback: () => {
            const event = new CustomEvent('longpress', e);
            target.dispatchEvent(event);
            this.clearTimer();
          }
        }));
      }
    }, { passive: true });

    /* istanbul ignore next */
    this.onEvent('touchend.longpress', target, (e) => {
      e.preventDefault();
      this.clearTimer();
    }, { passive: true });

    this.longPressOn = true;
  }

  /**
   * Detach all long press events
   * @private
   */
  removeLongPressListener() {
    if (!this.longPressOn) {
      return;
    }
    this.longPressOn = false;
    this.timer = null;
    this.detachEventsByName('touchstart.longpress');
    this.detachEventsByName('touchend.longpress');
  }

  /**
   * Setup a custom keypress focus event
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   */
  addKeyboardFocusListener(eventName, target) {
    if (this.keyboardFocusOn) {
      return;
    }

    // Get namespace
    this.isClick = false;

    // Setup events
    this.onEvent('click.keyboardfocus', target, () => {
      this.isClick = true;
    });

    /* istanbul ignore next */
    this.onEvent('keypress.keyboardfocus', target, () => {
      this.isClick = false;
    });

    /* istanbul ignore next */
    this.onEvent('focus.keyboardfocus', target, (e) => {
      const event = new CustomEvent('keyboardfocus', e);
      target.dispatchEvent(event);
    }, false);

    this.keyboardFocusOn = true;
  }

  /**
   * Detach all keyboard focus events
   * @private
   */
  removeKeyboardFocusListener() {
    if (!this.keyboardFocusOn) {
      return;
    }
    this.keyboardFocusOn = false;
    this.detachEventsByName(`click.keyboardfocus`);
    this.detachEventsByName(`keypress.keyboardfocus`);
  }

  /**
   * Setup a custom hoverend event that fires after a delay of the hover persists
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  addHoverEndListener(eventName, target, options) {
    // Setup events
    this.onEvent('mouseenter.eventsmixin', target, (e) => {
      /* istanbul ignore next */
      if (!this.timer) {
        this.timer = this.rl?.register(new IdsRenderLoopItem({
          duration: options?.delay || 500,
          timeoutCallback: () => {
            const event = new CustomEvent('hoverend', e);
            target.dispatchEvent(event);
            this.clearTimer();
          }
        }));
      }
    });

    this.onEvent('mouseleave.eventsmixin', target, () => {
      this.clearTimer();
    });

    this.onEvent('click.eventsmixin', target, () => {
      this.clearTimer();
    });
    this.hoverEndOn = true;
  }

  /**
   * Clear the timer
   * @private
   */
  clearTimer() {
    this.timer?.destroy(true);
    this.timer = null;
  }

  /**
   * Detach all hoverend events
   * @private
   */
  removeHoverEndListener() {
    if (!this.hoverEndOn) {
      return;
    }
    this.hoverEndOn = false;
    this.timer = null;
    this.detachEventsByName('click.eventsmixin');
    this.detachEventsByName('mouseleave.eventsmixin');
    this.detachEventsByName('mouseenter.eventsmixin');
  }
};

export { IdsEventsMixin };
export default IdsEventsMixin;
