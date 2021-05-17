import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base/ids-element';

import debounce from '../ids-base/ids-debouncer';
import { props } from '../ids-base/ids-constants';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import { IdsResizeMixin } from '../ids-base/ids-resize-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

import zCounter from './ids-modal-z-counter';
import IdsPopup from '../ids-popup/ids-popup';
import IdsOverlay from './ids-overlay';

// @ts-ignore
import styles from './ids-modal.scss';
import { IdsStringUtils } from '../ids-base/ids-string-utils';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

const MODAL_PROPS = [
  props.TARGET,
  props.VISIBLE
];

const appliedMixins = [
  IdsEventsMixin,
  IdsRenderLoopMixin,
  IdsResizeMixin,
  IdsThemeMixin,
];

/**
 * IDS Modal Component
 * @type {IdsModal}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part popup - the popup outer element
 */
@customElement('ids-modal')
@scss(styles)
class IdsModal extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();

    this.state = {
      overlay: null,
      target: null
    };
  }

  static get properties() {
    return [...super.properties, ...MODAL_PROPS];
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shouldUpdate) {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.popup.type = 'menu';
    this.popup.animated = true;
    this.popup.animationStyle = 'scale-in';
    this.setAttribute('role', 'dialog');

    // Listen for changes to the window size
    /* istanbul ignore next */
    window.addEventListener('resize', debounce(() => {
      this.setModalPosition();
    }));

    this.#refreshOverlay(this.overlay);
    this.#refreshVisibility(this.visible);

    // Add events to the target element
    /* istanbul ignore next */
    if (this.target) {
      this.#refreshTargetEvents();
    }
    this.shouldUpdate = true;

    // Run refresh once on connect
    this.rl.onNextTick(() => {
      this.setModalPosition();
    });
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="modal" class="ids-modal" type="menu">
      <slot slot="content"></slot>
    </ids-popup>`;
  }

  /**
   * @returns {IdsOverlay|undefined} either an external overlay element, or none
   */
  get overlay() {
    return this.state.overlay || this.shadowRoot.querySelector('ids-overlay');
  }

  /**
   * @param {IdsOverlay|undefined} val an overlay element
   */
  set overlay(val) {
    if (val instanceof IdsOverlay) {
      this.state.overlay = val;
    } else {
      this.state.overlay = null;
    }
    this.#refreshOverlay(this.state.overlay);
  }

  /**
   * @readonly
   * @returns {IdsPopup} the inner Popup
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * @returns {HTMLElement} the defined target element
   */
  get target() {
    return this.state.target;
  }

  /**
   * @param {HTMLElement} val a specified target element
   */
  set target(val) {
    if (val && val instanceof HTMLElement) {
      this.state.target = val;
    } else {
      this.state.target = null;
    }
    this.#refreshTargetEvents();
  }

  /**
   * @returns {boolean} true if the Modal is visible.
   */
  get visible() {
    return this.popup.visible;
  }

  /**
   * @param {boolean} val true if the Modal is visible.
   */
  set visible(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    /* istanbul ignore else */
    if (trueVal && !this.getAttribute(props.VISIBLE)) {
      this.shouldUpdate = false;
      this.setAttribute(props.VISIBLE, '');
      this.shouldUpdate = true;
    } else if (!trueVal && this.getAttribute(props.VISIBLE)) {
      this.shouldUpdate = false;
      this.removeAttribute(props.VISIBLE);
      this.shouldUpdate = true;
    }

    this.#refreshVisibility(trueVal);
  }

  /**
   * Shows the modal
   * @returns {void}
   */
  show() {
    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    this.visible = true;
  }

  /**
   * Hides the modal
   * @returns {void}
   */
  hide() {
    // Trigger a veto-able `beforehide` event.
    if (!this.triggerVetoableEvent('beforehide')) {
      return;
    }

    this.visible = false;
  }

  /**
   * Refreshes the state of the overlay used behind the modal.  If a shared overlay isn't applied,
   * an internal one is generated and applied to the ShadowRoot.
   * @param {boolean} val if true, uses an external overlay
   * @returns {void}
   */
  #refreshOverlay(val) {
    let overlay;

    if (!val) {
      overlay = new IdsOverlay();
      this.shadowRoot.prepend(overlay);
    } else {
      overlay = this.shadowRoot.querySelector('ids-overlay');
      overlay.remove();
    }
  }

  /**
   * @param {boolean} val if true, makes the Modal visible to the user
   * @returns {void}
   */
  async #refreshVisibility(val) {
    // Insulate from the popup potentially not being rendered on the very first run:
    const popupCl = this.popup.container?.classList;

    /* istanbul ignore else */
    if (val && !popupCl?.contains('visible')) {
      this.overlay.visible = true;
      this.popup.visible = true;

      // Animation-in needs the Modal to appear in front (z-index), so this occurs on the next tick
      this.rl.onNextTick(() => {
        this.overlay.container.style.zIndex = zCounter.increment();
        this.popup.container.style.zIndex = zCounter.increment();
        this.setModalPosition();
        this.#setModalFocus();
      });
    } else if (!val && popupCl?.contains('visible')) {
      this.overlay.visible = false;
      this.popup.visible = false;

      // Animation-out can wait for the opacity transition to end before changing z-index.
      await IdsDOMUtils.waitForTransitionEnd(this.overlay.container, 'opacity');
      this.overlay.container.style.zIndex = '';
      this.popup.container.style.zIndex = '';
      zCounter.decrement();
      zCounter.decrement();

      if (this.target) {
        this.target.focus();
      }
    }
  }

  /**
   * Centers the Popup's position within the viewport
   * @returns {void}
   */
  setModalPosition() {
    /* istanbul ignore next */
    if (this.popup.alignTarget !== null) {
      this.popup.alignTarget = null;
    }

    /* istanbul ignore next */
    if (this.popup.align !== 'center') {
      this.popup.align = 'center';
    }

    // If the modal isn't visible, subtract its width/height from the equation
    const width = this.popup.container?.clientWidth || 0;
    const height = this.popup.container?.clientHeight || 0;

    this.popup.x = (window.innerWidth - width) / 2;
    this.popup.y = (window.innerHeight - height) / 2;
  }

  /**
   * Focuses the first-possible element within the Modal
   * @returns {void}
   */
  #setModalFocus() {
    const focusable = [...this.querySelectorAll('button, ids-button, [href], input, ids-input, select, textarea, ids-textarea, [tabindex]:not([tabindex="-1"])')];
    if (focusable.length) {
      focusable[0].focus();
    }
  }

  /**
   * Connects a click event to the defined target element, which will allow the modal to open
   * by click, or by a keyboard press with the Enter/Return key.
   * @returns {void}
   */
  #refreshTargetEvents() {
    this.detachEventsByName('click.target');

    if (!this.target) {
      return;
    }

    this.target.setAttribute('aria-controls', `${this.id}`);
    this.onEvent('click.target', this.target, () => {
      if (!this.visible) {
        this.show();
      }
    });
  }

  /**
   * Triggers an event that occurs before the show/hide operations of the Modal that can "cancel"
   * @param {string} eventType the name of the event to trigger
   * @returns {boolean} true if the event works
   */
  triggerVetoableEvent(eventType) {
    const eventTypes = ['beforeshow', 'beforehide'];
    if (!eventTypes.includes(eventType)) {
      return false;
    }

    let canShow = true;
    const eventResponse = (veto) => {
      canShow = !!veto;
    };
    this.triggerEvent(eventType, this, {
      detail: {
        elem: this,
        response: eventResponse
      }
    });
    return canShow;
  }
}

export default IdsModal;
