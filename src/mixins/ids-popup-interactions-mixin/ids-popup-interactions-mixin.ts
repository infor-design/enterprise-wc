import { attributes } from '../../core/ids-attributes';
import type { IdsPopupElementRef } from '../../components/ids-popup/ids-popup-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { getClosestContainerNode } from '../../utils/ids-dom-utils/ids-dom-utils';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import IdsPopup from '../../components/ids-popup/ids-popup';

const POPUP_TRIGGER_TYPES = [
  'contextmenu',
  'click',
  'custom',
  'hover',
  'immediate'
];

const POPUP_INTERACTION_EVENT_NAMES = [
  'click.trigger',
  'contextmenu.trigger',
  'hoverend.trigger',
  'mouseenter.trigger',
  'mouseleave.trigger',
  'sloped-mouseleave.trigger'
];

export interface PopupInteractionsCallbacks {
  onTargetChange?(oldTarget: IdsPopupElementRef, newTarget: IdsPopupElementRef): void;
  onTriggerClick?(e: Event): void;
  onContextMenu?(e: Event): void;
  onTriggerHover?(e: Event): void;
  onCancelTriggerHover?(e: Event): void;
  onTriggerHoverClick?(e: Event): void;
  onTriggerImmediate?(): void;
}
/*
export interface PopupInteractionsProps {
  popup?: IdsPopup | undefined | null;
  target?: IdsPopupElementRef;
}
*/

type Constraints = IdsConstructor<EventsMixinInterface & PopupInteractionsCallbacks>;

/**
 * This mixin can be used in components that wrap an inner IdsPopup component to provide:
 * - Event handling for.
 * @mixin IdsPopupInteractionsMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPopupInteractionsMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);

    if (!this.state) {
      this.state = {};
    }
    this.state.triggerType = POPUP_TRIGGER_TYPES[0];
    this.state.triggerElem = null;
    this.state.currentTriggerElem = null;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.TARGET,
      attributes.TRIGGER_TYPE,
      attributes.TRIGGER_ELEM
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#setInitialState();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.removeTriggerEvents();
  }

  #setInitialState() {
    const targetSelector = this.getAttribute(attributes.TARGET);
    const initTarget = targetSelector ? this.parentNode?.querySelector<HTMLElement>(targetSelector) : null;

    if (this.popup && initTarget && !this.target) {
      this.popup.alignTarget = initTarget;
    }

    if (this.triggerElem || initTarget) {
      this.removeTriggerEvents();
      this.refreshTriggerEvents();
    }
  }

  /**
   * @property {boolean} hasTriggerEvents true if "trigger" events
   * are currently applied to this component
   */
  hasTriggerEvents = false;

  /**
   * @property {number} popupDelay duration in miliseconds to delay a `mouseenter` event.
   *  Used in Popups configured to use the `hover` interaction.
   */
  popupDelay = 500;

  /**
   * @readonly
   * @returns {any} reference to the inner Popup component
   */
  get popup(): IdsPopup | undefined | null {
    return this.shadowRoot?.querySelector<IdsPopup>('ids-popup');
  }

  /**
   * @returns {IdsPopupElementRef} reference to a target element, if applicable
   */
  get target(): IdsPopupElementRef {
    return this.popup?.alignTarget ?? null;
  }

  /**
   * @param {IdsPopupElementRef} val reference to an element, or a string that will be used
   * as a CSS Selector referencing an element, that the Popupmenu will align against.
   */
  set target(val: IdsPopupElementRef | string) {
    if (this.popup && val !== this.popup.alignTarget) {
      const previousTarget = this.popup.alignTarget;
      this.removeTriggerEvents();
      if (typeof val === 'string') {
        val = getClosestContainerNode(this).querySelector<HTMLElement>(val) || this.parentNode as HTMLElement;
      }
      this.popup.alignTarget = val;
      this.refreshTriggerEvents();

      if (typeof this.onTargetChange === 'function') this.onTargetChange(previousTarget, val);
    }
  }

  /**
   * @returns {string} the type of action that will trigger this Popupmenu
   */
  get triggerType(): string {
    return this.state.triggerType;
  }

  /**
   * @param {string} val a valid trigger type
   */
  set triggerType(val: string) {
    const current = this.state.triggerType;
    let trueTriggerType = val;
    if (!POPUP_TRIGGER_TYPES.includes(val as string)) {
      trueTriggerType = POPUP_TRIGGER_TYPES[0];
    }
    if (current !== trueTriggerType) {
      this.removeTriggerEvents();
      this.state.triggerType = trueTriggerType;
      this.refreshTriggerEvents();
    }
  }

  /**
   * Gets the alternatively-defined triggering element, if applicable
   * @returns {IdsPopupElementRef} reference to an optional trigger element, if one is set
   */
  get triggerElem(): IdsPopupElementRef {
    return this.state.triggerElem;
  }

  /**
   * @param {string} val a valid trigger type
   */
  set triggerElem(val: IdsPopupElementRef | string) {
    if (typeof val === 'string') {
      const trueTriggerElem = getClosestContainerNode(this)?.querySelector(val);
      if (trueTriggerElem) {
        this.removeTriggerEvents();
        this.state.triggerElem = trueTriggerElem;
        this.refreshTriggerEvents();
      }
    }
  }

  /**
   * Causes events related to the Popupmenu's "trigger" style to be unbound/rebound
   */
  refreshTriggerEvents(): void {
    if (this.hasTriggerEvents || !this.popup) {
      return;
    }

    // Order of importance for target elements:
    // - `triggerElem`: user defined as the element that should trigger the popup.
    //   This is only defined when the triggering element is different from the alignment target.
    // - `target`: used for Popup positioning when aligned against a "parent" element, can also be the triggering element.
    // - `window`: default, generally used for coordinate-based placement or `contextmenu` events.
    const targetElem: HTMLElement | Window = (this.triggerElem as HTMLElement) || this.target || window;
    this.state.currentTriggerElem = targetElem;

    // Based on the trigger type, bind new events
    switch (this.state.triggerType) {
      case 'click':
        // Announce Popup control with `aria-controls` on the target
        if (targetElem.id && !(targetElem instanceof Window)) {
          targetElem.setAttribute('aria-controls', `${this.id}`);
        }

        // Open/Close the menu when the trigger element is clicked
        this.offEvent('click.trigger');
        this.onEvent('click.trigger', targetElem, (e: Event) => {
          if (typeof this.onTriggerClick === 'function') {
            return this.onTriggerClick(e);
          }
          return true;
        });

        break;
      case 'contextmenu':
        // Standard `contextmenu` event behavior.
        // `contextmenu` events should only apply to top-level Popup Menu components.
        // (submenus open/close events are handled by their parent items)
        if ((this as any).parentMenu) {
          break;
        }

        // Attach a contextmenu handler to the target element for opening the popup
        this.onEvent('contextmenu.trigger', targetElem, (e: Event) => {
          if (typeof this.onContextMenu === 'function') {
            this.onContextMenu(e);
          }
        });
        break;
      case 'hover':
        this.onEvent('hoverend.trigger', targetElem, (e: Event) => {
          if (typeof this.onTriggerHover === 'function') {
            this.onTriggerHover(e);
          }
        }, { delay: this.popupDelay });
        this.onEvent('sloped-mouseleave.trigger', targetElem, (e: Event) => {
          if (typeof this.onCancelTriggerHover === 'function') {
            this.onCancelTriggerHover(e);
          }
        }, { delay: this.popupDelay });
        this.onEvent('click.trigger', targetElem, (e: Event) => {
          if (typeof this.onTriggerHoverClick === 'function') {
            this.onTriggerHoverClick(e);
          }
        });
        break;
      case 'immediate':
        if (typeof this.onTriggerImmediate === 'function') {
          this.onTriggerImmediate();
        }
        break;
      case 'custom':
        break;
      default:
        break;
    }

    this.hasTriggerEvents = true;
  }

  /**
   * Removes any pre-existing trigger events
   * @returns {void}
   */
  removeTriggerEvents() {
    (this as any).currentTargetElem?.removeAttribute('aria-controls');
    POPUP_INTERACTION_EVENT_NAMES.forEach((eventName) => {
      this.detachEventsByName(eventName);
    });
    this.hasTriggerEvents = false;
  }
};

export default IdsPopupInteractionsMixin;
