import {
  IdsElement,
  customElement,
  mix,
  props,
  stringUtils
} from '../ids-base/ids-element';

import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

// @ts-ignore
import IdsPopup from '../ids-popup/ids-popup';

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

  connectedCallback() {
    // Setup reasir reference to the popup element in the shadow root
    this.popup = this.shadowRoot.firstElementChild;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.DELAY,
      props.KEEP_OPEN,
      props.PLACEMENT,
      props.MODE,
      props.TARGET,
      props.TRIGGER,
      props.VERSION,
      props.VISIBLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup class="ids-popup-menu" part="popup">
        <div class="ids-tooltip" slot="content" part="tooltip">
          <slot></slot>
        </div>
        </ids-popup>
      `;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    this.detachAllEvents();
    if (!(typeof this.target === 'string')) {
      this.attachEvents(this.target);
      return this;
    }

    /** @type {any} */
    const list = document.querySelectorAll(this.target);
    for (let i = 0, len = list.length; i < len; i++) {
      this.attachEvents(list[i]);
    }
    return this;
  }

  /**
   * Attach the events to a node.
   * @param {HTMLElement} targetElem The element to attach events to
   * @private
   */
  attachEvents(targetElem) {
    // Events to show on hover
    if (this.trigger === 'hover') {
      this.onEvent('mouseenter.tooltip', targetElem, (e) => {
        this.popup.alignTarget = e.currentTarget;
        this.showOnTimer();
      });
      this.onEvent('mouseleave.tooltip', targetElem, () => {
        this.visible = false;
      });
      this.onEvent('click.tooltip', targetElem, () => {
        this.visible = false;
      });
      // Long Press
      this.onEvent('contextmenu.tooltip', targetElem, (e) => {
        alert();
        this.visible = false;
        e.preventDefault();
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
        if (!this.visible) {
          this.visible = true;
        }
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
   * Show the tooltip on a timeout
   * @private
   */
  showOnTimer() {
    this.clearTimer();
    // @ts-ignore
    this.timer = this.rl.register(new IdsRenderLoopItem({
      duration: this.delay,
      timeoutCallback: () => {
        this.state.visible = true;
        this.show();
      }
    }));
  }

  /**
   * Clear the timeout
   * @private
   */
  clearTimer() {
    if (this.timer && this.timer.destroy) {
      this.timer.destroy(true);
    }
  }

  /**
   * Show the tooltip
   * @private
   */
  configurePopup() {
    this.popup.type = 'tooltip';
    this.popup.align = `${this.placement}, center`;
    this.popup.arrow = this.placement;

    if (this.placement === 'top' || this.placement === 'bottom') {
      this.popup.x = 0;
      this.popup.y = 12;
    }
    if (this.placement === 'left' || this.placement === 'right') {
      this.popup.x = 12;
      this.popup.y = 0;
    }
  }

  /**
   * Show the tooltip (use visible for public API)
   * @private
   */
  async show() {
    this.clearTimer();

    // Trigger a veto-able `beforeshow` event.
    let canShow = true;
    const beforeShowResponse = (/** @type {any} */ veto) => {
      canShow = !!veto;
    };

    // Trigger an async callback for contents
    if (this.state.beforeShow) {
      const stuff = await this.state.beforeShow();
      this.textContent = stuff;
    }

    this.triggerEvent('beforeshow', this, {
      detail: {
        elem: this,
        response: beforeShowResponse
      }
    });

    if (!canShow) {
      return;
    }

    // Show the popup
    this.configurePopup();
    this.popup.visible = true;
    this.state.visible = true;
  }

  /**
   * Show the tooltip  (use visible for public API)
   */
  hide() {
    this.clearTimer();
    this.popup.visible = false;
    this.state.visible = false;
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
   * @param {number} value The amount in ms to delay
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
   * Set trigger agains the target between hover, click and focus
   * @param {string} value The trigger mode to use
   */
  set trigger(value) {
    this.state.trigger = value;

    if (this.state.trigger) {
      this.setAttribute('trigger', this.state.trigger);
      this.handleEvents();
      return;
    }

    this.removeAttribute('trigger');
    this.handleEvents();
  }

  get trigger() { return this.state.trigger || 'hover'; }

  /**
   * Set the target element for the tooltip
   * @param {string | HTMLElement} value The target element selector
   */
  set target(value) {
    this.state.target = value;

    if (value && typeof value !== 'string') {
      this.removeAttribute('target');
      this.handleEvents();
      return;
    }

    if (value && typeof value === 'string') {
      this.setAttribute('target', value);
      this.handleEvents();
      return;
    }

    this.removeAttribute('target');
    this.handleEvents();
  }

  get target() { return this.state.target; }

  /**
   * Set tooltip immediately to visible/invisible
   * @param {string|boolean} value The target element selector
   */
  set visible(value) {
    this.state.visible = stringUtils.stringToBool(value);

    if (!this.popup.alignTarget) {
      // @ts-ignore
      this.popup.alignTarget = document.querySelectorAll(this.target)[0];
    }

    if (this.state.visible) {
      this.setAttribute('visible', 'true');
      this.show();
      return;
    }

    this.popup.alignTarget = null;
    this.removeAttribute('visible');
    this.hide();
  }

  get visible() { return this.state.visible; }
}

export default IdsTooltip;
