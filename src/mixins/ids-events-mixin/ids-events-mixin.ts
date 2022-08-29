import renderLoop from '../../components/ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../../components/ids-render-loop/ids-render-loop-item';
import { stringToBool, isPrintable } from '../../utils/ids-string-utils/ids-string-utils';
import { getEventBaseName } from './ids-events-common';

/**
 * A mixin that adds event handler functionality that is also safely torn down when a component is
 * removed from the DOM.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsEventsMixin = (superclass: any) => class extends superclass {
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

  static get attributes() {
    return [
      ...super.attributes
    ];
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.detachAllEvents();
  }

  /**
   * Add and keep track of an event listener.
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {Function|any} callback The callback code to execute
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  onEvent(eventName: string, target: any, callback?: unknown, options?: Record<string, unknown>) {
    if (!target) {
      return;
    }

    if (eventName.indexOf('longpress') === 0) {
      this.#addLongPressListener(eventName, target, options);
    }
    if (eventName.indexOf('keyboardfocus') === 0) {
      this.#addKeyboardFocusListener(eventName, target);
    }
    if (eventName.indexOf('hoverend') === 0) {
      this.#addHoverEndListener(eventName, target, options);
    }
    if (eventName.indexOf('sloped-mouseleave') === 0) {
      this.#addSlopedMouseLeaveListener(eventName, target, options);
    }
    if (eventName.indexOf('keydownend') === 0) {
      this.#addKeyDownEndListener(eventName, target, options);
    }
    if (eventName.indexOf('swipe') === 0) {
      this.#addSwipeListener(eventName, target, options);
    }
    target.addEventListener(getEventBaseName(eventName), callback, options);
    this.handledEvents.set(eventName, { target, callback, options });
  }

  /**
   * Remove event listener
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to deregister (or previous registered target)
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  offEvent(eventName: string, target?: HTMLElement | unknown, options?: Record<string, unknown> | boolean) {
    const handler = this.handledEvents.get(eventName);
    this.handledEvents.delete(eventName);

    // Handle Special events
    if (eventName.indexOf('longpress') === 0 && handler?.callback) {
      this.#removeLongPressListener();
      return;
    }

    if (eventName.indexOf('keyboardfocus') === 0 && handler?.callback) {
      this.#removeKeyboardFocusListener();
      return;
    }

    if (eventName.indexOf('hoverend') === 0 && handler?.callback) {
      this.#removeHoverEndListener();
      return;
    }

    if (eventName.indexOf('sloped-mouseleave') === 0 && handler?.callback) {
      this.#removeSlopedMouseLeaveListener();
      return;
    }

    if (eventName.indexOf('keydownend') === 0 && handler?.callback) {
      this.#removeKeyDownEndListener();
      return;
    }

    if (eventName.indexOf('swipe') === 0 && handler?.callback) {
      this.#removeSwipeListener();
      return;
    }

    const targetApplied = target || handler?.target;
    if (handler?.callback && targetApplied?.removeEventListener) {
      targetApplied.removeEventListener(getEventBaseName(eventName), handler.callback, options || handler.options);
    }
  }

  /**
   * Create and trigger a custom event
   * @param {string} eventName The event id with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} [options = {}] The custom data to send
   */
  triggerEvent(eventName: string, target: any, options = {}) {
    const event = new CustomEvent(getEventBaseName(eventName), options);
    target.dispatchEvent(event);
  }

  /**
   * @returns {Array<string>} names of vetoable events.  Override this in your component
   * to listen for and handle vetoable events.
   */
  vetoableEventTypes = [];

  /**
   * Triggers an event that occurs before the show/hide operations that can "cancel"
   * @param {string} eventType the name of the event to trigger
   * @param {any} data extra data to send with vetoable event
   * @returns {boolean} true if the event works
   */
  triggerVetoableEvent(eventType: string, data: Record<string, unknown>) {
    if (!this.vetoableEventTypes?.includes((eventType as never))) {
      return false;
    }

    let canShow = true;
    const eventResponse = (veto: string) => {
      canShow = stringToBool(veto);
    };
    this.triggerEvent(eventType, this, {
      bubbles: true,
      detail: {
        data,
        elem: this,
        response: eventResponse
      }
    });
    return canShow;
  }

  /**
   * Detach all event handlers
   */
  detachAllEvents() {
    this.handledEvents.forEach((value: any, key: string) => {
      this.offEvent(key, value.target, value.options);
      value.target = null;
    });
    this.#removeLongPressListener();
    this.#removeKeyboardFocusListener();
    this.#removeHoverEndListener();
    this.#removeSlopedMouseLeaveListener();
    this.#removeKeyDownEndListener();
    this.#removeSwipeListener();
  }

  /**
   * Detach a specific handlers associated with a name
   * @param {string} [eventName] an optional event name to filter with
   */
  detachEventsByName = (eventName: string) => {
    const isValidName = (typeof eventName === 'string') && !!eventName.length;
    const hasEvent = this.handledEvents.has(eventName);

    if (isValidName && hasEvent) {
      const event = this.handledEvents.get(eventName);
      this.offEvent(eventName, event.target, event.options);
      event.target = null;
    }
  };

  /**
   * Setup a custom long press event (just one)
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  #addLongPressListener(eventName: string, target: HTMLElement, options?: Record<string, number | unknown>) {
    if (this.longPressOn) {
      return;
    }

    // Setup events
    this.onEvent('touchstart.longpress', target, (e: Event) => {
      e.preventDefault();
      if (!this.timer) {
        this.timer = renderLoop.register(new IdsRenderLoopItem({
          duration: options?.delay || 500,
          timeoutCallback: () => {
            const event = new CustomEvent('longpress', e);
            target.dispatchEvent(event);
            this.clearTimer();
          }
        }));
      }
    }, { passive: true });

    this.onEvent('touchend.longpress', target, (e: TouchEvent) => {
      e.preventDefault();
      this.clearTimer();
    }, { passive: true });

    this.longPressOn = true;
  }

  /**
   * Detach all long press events
   * @private
   */
  #removeLongPressListener() {
    if (!this.longPressOn) {
      return;
    }
    this.longPressOn = false;
    this.timer = null;
    this.detachEventsByName('touchstart.longpress');
    this.detachEventsByName('touchend.longpress');
  }

  /**
   * Setup a custom swipe event (just one)
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  #addSwipeListener(eventName: string, target: HTMLElement, options?: Record<string, any>) {
    if (this.swipeOn) {
      return;
    }

    let touchstartX = 0;
    let touchendX = 0;

    if (options) {
      options.passive = true;
    }

    // Setup events
    this.onEvent('touchstart.swipe', target, (e: TouchEvent) => {
      touchstartX = e.changedTouches[0].screenX;
    }, options);

    this.onEvent('touchend.swipe', target, (e: TouchEvent) => {
      touchendX = e.changedTouches[0].screenX;
      let direction = '';

      if (touchendX < touchstartX) {
        direction = 'left';
      }
      if (touchendX > touchstartX) {
        direction = 'right';
      }
      if (!direction) {
        return;
      }

      const event = new CustomEvent('swipe', {
        detail: {
          direction,
          trigger: 'touch'
        }
      });
      target.dispatchEvent(event);
    }, options);

    if (options?.scrollContainer) {
      let lastPercentage = 0;
      this.onEvent('scroll', options.scrollContainer, (e: any) => {
        const eventTarget = e.target;
        const scrollPercentage = 100
         * (eventTarget.scrollLeft / (eventTarget.scrollWidth - eventTarget.clientWidth));

        if (Math.abs(lastPercentage - scrollPercentage) < 1) {
          return;
        }
        lastPercentage = scrollPercentage;

        let direction = '';
        if (scrollPercentage === 0) {
          direction = 'right';
        }

        if (scrollPercentage > 98) {
          direction = 'left';
        }
        if (!direction) {
          return;
        }

        const event = new CustomEvent('swipe', {
          detail: {
            direction,
            trigger: 'scroll'
          }
        });
        target.dispatchEvent(event);
      }, { passive: true });
    }

    this.swipeOn = true;
  }

  /**
   * Detach all swipe events
   * @private
   */
  #removeSwipeListener() {
    if (!this.swipeOn) {
      return;
    }
    this.swipeOn = false;
    this.detachEventsByName('touchstart.swipe');
    this.detachEventsByName('touchend.swipe');
  }

  /**
   * Setup a custom keypress focus event
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   */
  #addKeyboardFocusListener(eventName: string, target: HTMLElement) {
    if (this.keyboardFocusOn) {
      return;
    }

    // Get namespace
    this.isClick = false;

    // Setup events
    this.onEvent('click.keyboardfocus', target, () => {
      this.isClick = true;
    });

    this.onEvent('keypress.keyboardfocus', target, () => {
      this.isClick = false;
    });

    this.onEvent('focus.keyboardfocus', target, (e: Event) => {
      const event = new CustomEvent('keyboardfocus', e);
      target.dispatchEvent(event);
    });

    this.keyboardFocusOn = true;
  }

  /**
   * Detach all keyboard focus events
   * @private
   */
  #removeKeyboardFocusListener() {
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
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  #addHoverEndListener(eventName: string, target: HTMLElement, options?:Record<string, unknown>) {
    // Setup events
    this.onEvent('mouseenter.eventsmixin', target, (e: MouseEvent) => {
      if (!this.timer) {
        this.timer = renderLoop.register(new IdsRenderLoopItem({
          duration: options?.delay || 400,
          timeoutCallback: () => {
            const event = new MouseEvent(getEventBaseName(eventName), e);
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
   * Setup a custom 'sloped-mouseleave' event that fires after a delay,
   * and if mouse coordinates land within a "safe" area.
   * @private
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  #addSlopedMouseLeaveListener(eventName: string, target: HTMLElement, options?: Record<string, unknown>) {
    const dispatchCustomEvent = (mouseLeaveNode: any, originalEvent: MouseEvent) => {
      const event = new CustomEvent(getEventBaseName(eventName), {
        detail: {
          originalEvent,
          mouseLeaveNode
        }
      });
      target.dispatchEvent(event);
      this.#clearSlopedMouseLeaveTimer();
    };

    // `mouseleave` listener persists until removed manually
    this.onEvent('mouseleave.eventsmixin', target, (e: MouseEvent) => {
      if (!this.slopedMouseLeaveTimer) {
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.slopedMouseLeaveTimer = renderLoop.register(new IdsRenderLoopItem({
          duration: options?.delay || 400,
          timeoutCallback: () => {
            const outOfBoundsX = (this.trackedX - this.startX) > 3.5;
            const outOfBoundsY = (this.trackedY - this.startY) > 3.5;
            if (outOfBoundsX || outOfBoundsY) {
              dispatchCustomEvent(document.elementFromPoint(this.trackedX, this.trackedY), e);
            }
          }
        }));

        this.onEvent('mousemove.eventsmixin', document, (ev: MouseEvent) => {
          this.trackedX = ev.pageX;
          this.trackedY = ev.pageY;
        });

        this.onEvent('mouseenter.eventsmixin', target, () => {
          this.#clearSlopedMouseLeaveTimer();
        });
      }
    });
  }

  /**
   * Clears a previously-set timer for checking sloped `mouseleave` events
   * @private
   */
  #clearSlopedMouseLeaveTimer(): void {
    this.slopedMouseLeaveTimer?.destroy(true);
    this.slopedMouseLeaveTimer = null;
    this.detachEventsByName('mousemove.eventsmixin');
    this.detachEventsByName('mouseenter.eventsmixin');
    this.startX = null;
    this.startY = null;
    this.trackedX = null;
    this.trackedY = null;
  }

  /**
   * Removes previously-set sloped `mouseleave` event listener
   * @private
   */
  #removeSlopedMouseLeaveListener() {
    if (!this.slopedMouseLeaveTimer) return;

    this.detachEventsByName('mouseleave.eventsmixin');
    this.#clearSlopedMouseLeaveTimer();
  }

  /**
   * Setup a custom keydown event that fires after typing a birst of keys
   * @private
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, bubbles ect)
   */
  #addKeyDownEndListener(eventName: string, target: HTMLElement, options?: Record<string, unknown>) {
    let keys = '';

    this.onEvent('keydown.eventsmixin', target, (e: any) => {
      if (typeof e.key === 'undefined' && e.detail?.nativeEvent) e = e.detail.nativeEvent;
      if (!isPrintable(e)) {
        return;
      }
      keys += e.key;

      if (!this.timer) {
        this.timer = renderLoop.register(new IdsRenderLoopItem({
          duration: options?.delay || 500,
          timeoutCallback: () => {
            const event = new CustomEvent('keydownend', {
              detail: {
                keys
              }
            });
            keys = '';
            target.dispatchEvent(event);
            this.clearTimer();
          }
        }));
      }
    });

    this.keyDownEndOn = true;
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
  #removeHoverEndListener() {
    if (!this.hoverEndOn) {
      return;
    }
    this.hoverEndOn = false;
    this.detachEventsByName('click.eventsmixin');
    this.detachEventsByName('mousemove.eventsmixin');
    this.detachEventsByName('mouseleave.eventsmixin');
    this.detachEventsByName('mouseenter.eventsmixin');
    this.clearTimer();
  }

  /**
   * Detach all keydownend events
   * @private
   */
  #removeKeyDownEndListener() {
    if (!this.keyDownEndOn) {
      return;
    }
    this.keyDownEndOn = false;
    this.timer = null;
    this.detachEventsByName('keydown.eventsmixin');
  }
};

export default IdsEventsMixin;
