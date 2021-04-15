import {
  IdsElement,
  customElement,
  scss,
  mix,
  props,
  stringUtils
} from '../ids-base/ids-element';

import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// @ts-ignore
import IdsPopup from '../ids-popup/ids-popup';
// @ts-ignore
import styles from './ids-tooltip.scss';

/**
 * IDS Tooltip Component
 * @type {IdsTooltip}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsRenderLoopMixin
 * @part tooltip - the tooltip container
 */
@customElement('ids-tooltip')
@scss(styles)
class IdsTooltip extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsRenderLoopMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.popup = this.shadowRoot.firstElementChild;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TARGET];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup class="ids-popup-menu">
        <div class="ids-tooltip" slot="content">
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
    this.targetElem = (typeof this.target === 'string') ? document.querySelector(this.target) : this.target;

    this.onEvent('mouseenter.tooltip', this.targetElem, () => {
      this.showOnTimer();
    });
    this.onEvent('mouseleave.tooltip', this.targetElem, () => {
      this.hide();
    });
    this.onEvent('click.tooltip', this.targetElem, () => {
      this.hide();
    });
    return this;
  }

  /**
   * Show the tooltip on a timeout
   * @private
   */
  showOnTimer() {
    this.clearTimer();
    // @ts-ignore
    this.timer = this.rl.register(new IdsRenderLoopItem({
      duration: 500,
      timeoutCallback: () => {
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
   */
  show() {
    this.clearTimer();

    // Trigger a veto-able `beforeshow` event.
    let canShow = true;
    const beforeShowResponse = (/** @type {any} */ veto) => {
      canShow = !!veto;
    };

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
  }

  /**
   * Show the tooltip
   * @private
   */
  configurePopup() {
    this.popup.type = 'tooltip';
    this.popup.align = 'top, center';
    this.popup.arrow = 'top';
    this.popup.y = 12;
    this.popup.alignTarget = this.targetElem;
  }

  /**
   * Show the tooltip
   */
  hide() {
    this.clearTimer();
    this.popup.visible = false;
  }

  /**
   * Set tooltip to visible/invisible
   * @param {string|boolean} value The target element selector
   */
  set visible(value) {
    const isVisible = stringUtils.stringToBool(value);

    if (isVisible) {
      this.setAttribute('visible', 'true');
      this.handleEvents();
      return;
    }

    this.removeAttribute('visible', 'false');
  }

  get visible() { return this.getAttribute('visible'); }

  /**
   * Set the target element for the tooltip
   * @param {string} value The target element selector
   */
  set target(value) {
    if (value) {
      this.setAttribute('target', value);
      this.handleEvents();
      return;
    }

    this.removeAttribute('target');
  }

  get target() { return this.getAttribute('target'); }
}

export default IdsTooltip;
