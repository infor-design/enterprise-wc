import type { IdsPopupElementRef } from '../../components/ids-popup/ids-popup-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import debounce from '../../utils/ids-debounce-utils/ids-debounce-utils';
import { requestAnimationTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';

interface PopupOpener {
  onOutsideClick?(e: Event): void;
}

type Constraints = IdsConstructor<EventsMixinInterface & PopupOpener>;

/**
 * This mixin can be used with the IdsPopup component to provide event handling in some scenarios:
 * - When clicking outside the Popup occurs, an event handler at the document level hides the Popup.
 * @mixin IdsPopupOpenEventsMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPopupOpenEventsMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [...(superclass as any).attributes];
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.removeOpenEvents();
    this.popupOpenEventsTarget = null;
  }

  /**
   * @property {boolean} hasOpenEvents true if "open" events are currently applied to this component
   */
  hasOpenEvents = false;

  /**
   * @property {IdsPopupElementRef} popupOpenEventsTarget receives the top-level event listener
   *  that will cause the `onOutsideClick` callback to fire
   */
  popupOpenEventsTarget: IdsPopupElementRef = document.body;

  /**
   * @property {IdsPopupElementRef} currentPopupOpenEventsTarget stores a reference to the event
   *  target to be used for unbinding events (prevents memory leaks if the
   *  event target changes while the Popup is open)
   */
  #currentPopupOpenEventsTarget: IdsPopupElementRef = null;

  #scrollContainer: Element | null = null;

  /**
   * Attaches some events when the Popupmenu is opened.
   * Call this method from inside your extended component whenever "open" events should be applied.
   * @returns {void}
   */
  addOpenEvents() {
    requestAnimationTimeout(() => {
      // Attach a click handler to the window for detecting clicks outside the popup.
      // If these aren't captured by a popup, the menu will close.
      this.popupOpenEventsTarget ??= document.body;
      this.offEvent('click.toplevel', this.popupOpenEventsTarget);
      this.onEvent('click.toplevel', this.popupOpenEventsTarget, (e: Event) => {
        this.onOutsideClick?.(e);
      });

      this.#scrollContainer = getClosest(this, 'ids-scrollable-area, .scrollable');
      if (this.#scrollContainer) {
        this.offEvent('scroll.toplevel', this.#scrollContainer);
        this.onEvent('scroll.toplevel', this.#scrollContainer, debounce((e: Event) => {
          this.onOutsideClick?.(e);
        }, 50));
      }
      this.hasOpenEvents = true;
      this.#currentPopupOpenEventsTarget = this.popupOpenEventsTarget;
    }, 100);
  }

  /**
   * Detaches some events when the Popupmenu is closed.
   * Call this method from inside your extended component whenever "open" events should be removed.
   * @returns {void}
   */
  removeOpenEvents() {
    if (!this.hasOpenEvents) {
      return;
    }
    this.offEvent('click.toplevel', this.#currentPopupOpenEventsTarget);
    this.offEvent('scroll.toplevel', this.#scrollContainer);
    this.#scrollContainer = null;
    this.hasOpenEvents = false;
    this.#currentPopupOpenEventsTarget = null;
  }
};

export default IdsPopupOpenEventsMixin;
