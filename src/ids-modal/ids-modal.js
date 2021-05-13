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
      target: null
    };
  }

  static get properties() {
    return [...super.properties, ...MODAL_PROPS];
  }

  connectedCallback() {
    super.connectedCallback();

    this.popup.type = 'menu';
    this.popup.animated = true;
    this.popup.animationStyle = 'scale-in';

    // Listen for changes to the window size
    window.addEventListener('resize', debounce(() => {
      this.setModalPosition();
    }));

    this.#refreshOverlay(this.overlay);
    this.#refreshVisibility(this.visible);

    // Add events to the target element
    if (this.target) {
      this.#refreshTargetEvents();
    }

    // Run refresh once on connect
    this.setModalPosition();
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
      this.#refreshOverlay(val);
    }
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
    this.state.target = val;
    if (val) {
      this.#refreshTargetEvents();
    }
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
    if (trueVal) {
      this.setAttribute(props.VISIBLE, '');
    } else {
      this.removeAttribute(props.VISIBLE);
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
   * @param {boolean} val if true, uses an external overlay
   * @returns {void}
   */
  #refreshOverlay(val) {
    let overlay;

    if (!val) {
      overlay = new IdsOverlay();
      this.shadowRoot.prepend(overlay);
      this.rl.onNextTick(() => {
        this.overlay.container.style.zIndex = zCounter.increment();
        this.popup.container.style.zIndex = zCounter.increment();
      });
    } else if (this.state.overlay) {
      overlay = this.shadowRoot.querySelector('ids-overlay');
      overlay.remove();
      zCounter.decrement();
      zCounter.decrement();
    }
  }

  /**
   * @param {boolean} val if true, makes the Modal visible to the user
   * @returns {void}
   */
  #refreshVisibility(val) {
    this.overlay.visible = val;
    this.popup.visible = val;

    if (val) {
      this.rl.onNextTick(() => {
        this.setModalPosition();
      });
    }
  }

  /**
   * Centers the Popup's position within the viewport
   * @returns {void}
   */
  setModalPosition() {
    if (this.popup.alignTarget !== null) {
      this.popup.alignTarget = null;
    }
    if (this.popup.align !== 'center') {
      this.popup.align = 'center';
    }

    // If the modal isn't visible, subtract its width/height from the equation
    // @TODO: some of this logic belongs in IdsPopup, after we enable support for centering.
    const isOpen = this.popup.animatedOpen;
    const width = !isOpen ? this.popup.container.clientWidth : 0;
    const height = !isOpen ? this.popup.container.clientHeight : 0;

    this.popup.x = (window.innerWidth - width) / 2;
    this.popup.y = (window.innerHeight - height) / 2;
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
