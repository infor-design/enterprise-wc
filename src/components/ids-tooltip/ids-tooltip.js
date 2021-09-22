import {
  IdsElement,
  customElement,
  appendIds,
  mix,
  scss,
  attributes
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem
} from '../../mixins';

import IdsPopup from '../ids-popup/ids-popup';
import styles from './ids-tooltip.scss';

/**
 * IDS Tooltip Component
 * @type {IdsTooltip}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsRenderLoopMixin
 * @mixes IdsThemeMixin
 * @part tooltip - the tooltip container
 */
@customElement('ids-tooltip')
@appendIds()
@scss(styles)
class IdsTooltip extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsRenderLoopMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();

    // Setup initial internal states
    this.state = {
      target: null,
      trigger: 'hover',
      visible: false,
    };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element,
   */
  connectedCallback() {
    this.#updateAria();
  }

  /**
   * Returns the properties/settings we handle as getters/setters
   * @returns {Array} The supported settings in an array
   */
  static get attributes() {
    return [
      attributes.DELAY,
      attributes.KEEP_OPEN,
      attributes.PLACEMENT,
      attributes.MODE,
      attributes.TARGET,
      attributes.TRIGGER,
      attributes.VERSION,
      attributes.VISIBLE
    ];
  }

  /**
   * Create the Template for the component contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="popup" id="${this.id || 'ids'}-tooltip">
        <div class="ids-tooltip" slot="content" part="tooltip">
          <slot></slot>
        </div>
        </ids-popup>
      `;
  }

  /**
   * Bind Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers() {
    this.detachAllEvents();
    if (!(typeof this.target === 'string')) {
      this.#bindEvents(this.target);
      return this;
    }

    const list = document.querySelectorAll(this.target);
    for (let i = 0, len = list.length; i < len; i++) {
      this.#bindEvents(list[i]);
    }
    return this;
  }

  /**
   * Bind the events to a tooltip target.
   * @param {HTMLElement} targetElem The element to attach events to
   * @private
   */
  #bindEvents(targetElem) {
    // Events to show on hover
    if (this.trigger === 'hover') {
      this.onEvent('hoverend.tooltip', targetElem, (e) => {
        this.popup.alignTarget = e.currentTarget;
        this.visible = true;
      }, { delay: this.delay });
      this.onEvent('mouseleave.tooltip', targetElem, () => {
        this.visible = false;
      });
      this.onEvent('click.tooltip', targetElem, () => {
        this.visible = false;
      });

      // Long Press
      this.onEvent('longpress.tooltip', targetElem, () => {
        this.visible = true;
      }, { delay: 1000 });

      // Keyboard Focus event
      this.onEvent('keyboardfocus.tooltip', targetElem, () => {
        this.visible = true;
      });

      /* istanbul ignore next */
      this.onEvent('focusout.tooltip', targetElem, () => {
        this.visible = false;
      });

      /* istanbul ignore next */
      this.onEvent('click.popup', this.popup, () => {
        this.visible = true;
      });
    }

    // Events to show on click
    if (this.trigger === 'click') {
      this.onEvent('click.tooltip', targetElem, (e) => {
        this.popup.alignTarget = e.currentTarget;
        if (this.visible) {
          this.visible = false;
          return;
        }
        this.visible = true;
      });

      this.onEvent('click.popup', this.popup, () => {
        this.visible = false;
      });
    }

    // Events to show on focus
    if (this.trigger === 'focus') {
      this.onEvent('focusin.tooltip', targetElem, (e) => {
        this.popup.alignTarget = e.currentTarget;
        this.visible = true;
      });

      this.onEvent('focusout.tooltip', targetElem, () => {
        this.visible = false;
      });
    }
  }

  /**
   * Setup the popup
   * @private
   */
  #configurePopup() {
    // Popup settings / config
    this.popup.type = 'tooltip';
    this.popup.align = `${this.placement}, center`;
    this.popup.arrow = this.placement;

    if (this.placement === 'top' || this.placement === 'bottom') {
      this.popup.setPosition(0, 10);
    }
    if (this.placement === 'left' || this.placement === 'right') {
      this.popup.setPosition(10, 0);
    }
  }

  /**
   * Update the aria attributes with the correct contents
   * @private
   */
  #updateAria() {
    // For ellipsis based tooltips we dont do this
    if (this.state?.noAria) {
      return;
    }
    this.popup.alignTarget = typeof this.target === 'object'
      ? this.target
      : document.querySelectorAll(this.target)[0];

    const id = `${this.id || 'ids'}-tooltip`;
    if (this.popup.alignTarget && this.popup.alignTarget.querySelector(`#${id}`)) {
      this.popup.alignTarget.querySelector(`#${id}`).textContent = this.textContent;
      return;
    }

    if (this.popup.alignTarget) {
      const ariaSpan = `<ids-text id="${id}" audible="true">${this.textContent}</ids-text>`;
      this.popup.alignTarget.insertAdjacentHTML('beforeend', ariaSpan);
      this.popup.alignTarget.setAttribute('aria-describedby', `#${id}`);
    }
  }

  /**
   * Show the tooltip (use visible for public API)
   * @private
   */
  async #show() {
    // Trigger a veto-able `beforeshow` event.
    let canShow = true;
    const beforeShowResponse = (veto) => {
      canShow = !!veto;
    };

    // Trigger an async callback for contents
    if (this.state.beforeShow) {
      const stuff = await this.state.beforeShow();
      this.textContent = stuff;
      this.#updateAria();
    }

    this.triggerEvent('beforeshow', this, {
      detail: {
        elem: this,
        response: beforeShowResponse
      }
    });

    if (!canShow) {
      this.visible = false;
      return;
    }

    // Show the popup
    if (!this.visible) {
      this.visible = true;
      return;
    }
    this.#configurePopup();
    this.popup.visible = true;
    this.popup.place();
    this.triggerEvent('show', this, { detail: { elem: this } });
  }

  /**
   * Show the tooltip  (use visible for public API)
   */
  #hide() {
    if (this.visible) {
      this.visible = false;
      return;
    }
    this.popup.visible = false;
    this.triggerEvent('hide', this, { detail: { elem: this } });
  }

  /**
   * @readonly
   * @returns {IdsPopup} reference to the internal IdsPopup component
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * An async function that fires as the tooltip is showing allowing you to set contents.
   * @param {Function} func The async function
   */
  set beforeShow(func) {
    this.state.beforeShow = func;
  }

  get beforeShow() { return this.state.beforeShow; }

  /**
   * Set how long after hover you should delay before showing
   * @param {string | number} value The amount in ms to delay
   */
  set delay(value) {
    if (value) {
      this.setAttribute('delay', value);
      return;
    }

    this.removeAttribute('delay');
  }

  get delay() { return Number(this.getAttribute('delay')) || 500; }

  /**
   * Sets the tooltip placement between left, right, top, bottom
   * @param {string} value The placement of the tooltip
   */
  set placement(value) {
    this.state.placement = value;

    if (value) {
      this.setAttribute('placement', value);
      return;
    }

    this.removeAttribute('placement');
  }

  get placement() { return this.getAttribute('placement') || 'top'; }

  /**
   * Set the target element for the tooltip
   * @param {string | HTMLElement} value The target element selector
   */
  set target(value) {
    this.state.target = value;

    if (value && typeof value !== 'string') {
      this.removeAttribute('target');
      this.#attachEventHandlers();
      return;
    }

    if (value && typeof value === 'string') {
      this.setAttribute('target', value);
      this.#attachEventHandlers();
      return;
    }

    this.removeAttribute('target');
    this.#attachEventHandlers();
  }

  get target() { return this.state.target; }

  /**
   * Set trigger agains the target between hover, click and focus
   * @param {string} value The trigger mode to use
   */
  set trigger(value) {
    this.state.trigger = value;

    if (this.state.trigger) {
      this.setAttribute('trigger', this.state.trigger);
      this.#attachEventHandlers();
      return;
    }

    this.removeAttribute('trigger');
    this.#attachEventHandlers();
  }

  get trigger() { return this.state.trigger || 'hover'; }

  /**
   * Set tooltip immediately to visible/invisible
   * @param {string|boolean} value The target element selector
   */
  set visible(value) {
    const trueVal = IdsStringUtils.stringToBool(value);
    if (this.state.visible !== trueVal) {
      this.state.visible = trueVal;

      if (!this.popup.alignTarget) {
        this.popup.alignTarget = typeof this.target === 'object'
          ? this.target
          : document.querySelectorAll(this.target)[0];
      }

      if (this.state.visible) {
        this.setAttribute('visible', 'true');
        this.#show();
        return;
      }

      this.popup.alignTarget = null;
      this.removeAttribute('visible');
      this.#hide();
    }
  }

  get visible() { return this.state.visible; }
}

export default IdsTooltip;
