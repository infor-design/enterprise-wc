import { attributes } from '../../core';
import { IdsEventsMixin } from '../ids-events-mixin';

const POPUP_TRIGGER_TYPES = [
  'contextmenu',
  'click',
  'immediate'
];

/**
 * This mixin can be used in components that wrap an inner IdsPopup component to provide:
 * - Event handling for.
 * @mixin IdsPopupInteractionsMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPopupInteractionsMixin = (superclass) => class extends superclass {
  constructor() {
    super();

    /* istanbul ignore next */
    if (!this.state) {
      this.state = {};
    }
    this.state.target = null;
    this.state.trigger = POPUP_TRIGGER_TYPES[0];
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.TARGET,
      attributes.TRIGGER
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    if (this.target) {
      this.refreshTriggerEvents();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.removeTriggerEvents();
  }

  /**
   * @property {boolean} hasTriggerEvents true if "trigger" events
   * are currently applied to this component
   */
  hasTriggerEvents = false;

  /**
   * @readonly
   * @returns {any} reference to the inner Popup component
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * @returns {any} [HTMLElement|undefined] reference to a target element, if applicable
   */
  get target() {
    return this.popup.alignTarget;
  }

  /**
   * @param {any} val [HTMLElement|string] reference to an element, or a string that will be used
   * as a CSS Selector referencing an element, that the Popupmenu will align against.
   */
  set target(val) {
    if (val !== this.popup.alignTarget) {
      this.removeTriggerEvents();
      this.popup.alignTarget = val;
      this.state.target = val;
      this.refreshTriggerEvents();
    }
  }

  /**
   * @returns {string} the type of action that will trigger this Popupmenu
   */
  get trigger() {
    return this.state.trigger;
  }

  /**
   * @param {string} val a valid trigger type
   */
  set trigger(val) {
    let trueTriggerType = val;
    if (!POPUP_TRIGGER_TYPES.includes(val)) {
      trueTriggerType = POPUP_TRIGGER_TYPES[0];
    }
    this.state.trigger = trueTriggerType;
    this.refreshTriggerEvents();
  }

  /**
   * Causes events related to the Popupmenu's "trigger" style to be unbound/rebound
   */
  /* istanbul ignore next */
  refreshTriggerEvents() {
    const targetElem = this.popup.alignTarget || window;

    // Based on the trigger type, bind new events
    switch (this.state.trigger) {
    case 'click':
      // Configure some settings for opening
      this.popup.align = 'bottom, left';
      this.popup.arrow = 'bottom';
      this.popup.y = 8;

      // Announce Popup control with `aria-controls` on the target
      /* istanbul ignore next */
      if (targetElem.id && targetElem !== 'window') {
        this.target.setAttribute('aria-controls', `${this.id}`);
      }

      // Open/Close the menu when the trigger element is clicked
      this.offEvent('click.trigger');
      this.onEvent('click.trigger', targetElem, (e) => {
        if (typeof this.onTriggerClick === 'function') {
          this.onTriggerClick(e);
        }
      });

      break;
    case 'contextmenu':
      // Standard `contextmenu` event behavior.
      // `contextmenu` events should only apply to top-level Popup Menu components.
      // (submenus open/close events are handled by their parent items)
      if (this.parentMenu) {
        break;
      }

      // Attach a contextmenu handler to the target element for opening the popup
      this.onEvent('contextmenu.trigger', targetElem, (e) => {
        if (typeof this.onContextMenu === 'function') {
          this.onContextMenu(e);
        }
      });
      break;
    case 'immediate':
      if (typeof this.onTriggerImmediate === 'function') {
        this.onTriggerImmediate();
      }
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
    this.alignTarget?.removeAttribute('aria-controls');

    const removeEventTargets = ['contextmenu.trigger', 'click.trigger'];
    removeEventTargets.forEach((eventName) => {
      const evt = this.handledEvents.get(eventName);
      if (evt) {
        this.detachEventsByName(eventName);
      }
    });
    this.hasTriggerEvents = false;
  }
};

export default IdsPopupInteractionsMixin;
