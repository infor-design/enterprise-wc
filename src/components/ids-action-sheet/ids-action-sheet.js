import {
  IdsElement,
  customElement,
  scss,
  attributes,
  breakpoints,
  mix
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
} from '../../mixins';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsOverlay from '../ids-modal/ids-overlay';
import styles from './ids-action-sheet.scss';

/**
 * IDS Action Sheet Component
 * @type {IdsActionSheet}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-action-sheet')
@scss(styles)
class IdsActionSheet extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin,
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.overlay = this.shadowRoot.querySelector('ids-overlay');
    this.cancelBtn = this.shadowRoot.querySelector('[part="cancel-btn"]');
    this.#attachEventHandlers();
    this.#hideOnDesktop();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.BTN_TEXT,
      attributes.VISIBLE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-action-sheet">
        <ids-overlay opacity=".7"></ids-overlay>
        <div class="ids-action-sheet-inner">
          <slot></slot>
          <ids-button type="secondary" part="cancel-btn">
            <span slot="text">
              ${this.btnText === null ? 'Cancel' : this.btnText}
            </span>
          </ids-button>
        </div>
      </div>
    `;
  }

  /**
   * Set the visible attribute
   * @param {boolean} val true if the action sheet should appear
   */
  set visible(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy && !this.hidden) {
      this.setAttribute(attributes.VISIBLE, true);
      this.overlay.setAttribute(attributes.VISIBLE, true);
    } else {
      this.removeAttribute(attributes.VISIBLE);
      this.overlay.removeAttribute(attributes.VISIBLE);
    }
  }

  /**
   * @returns {boolean} the current visible state
   */
  get visible() {
    return this.getAttribute(attributes.VISIBLE);
  }

  /**
   * Set the btn text attribute
   * @param {string} val the inner text of the cancel btn
   */
  set btnText(val) {
    if (val) {
      this.setAttribute(attributes.BTN_TEXT, val);
    } else {
      this.removeAttribute(attributes.BTN_TEXT);
    }
  }

  /**
   * @returns {string} the inner text of the cancel btn
   */
  get btnText() {
    return this.getAttribute(attributes.BTN_TEXT);
  }

  /**
   * Handle `onOutsideClick` on overlay
   * @returns {void}
   */
  onOutsideClick() {
    this.onEvent('click', this.overlay, () => {
      this.removeAttribute(attributes.VISIBLE);
      this.overlay.removeAttribute(attributes.VISIBLE);
    });
  }

  /**
   * Handle cancel btn click
   * @returns {void}
   */
  onCancelClick() {
    this.onEvent('click', this.cancelBtn, () => {
      this.removeAttribute(attributes.VISIBLE);
      this.overlay.removeAttribute(attributes.VISIBLE);
    });
  }

  /**
   * Hide the action sheet on desktop devices
   * @returns {void}
   */
  #hideOnDesktop() {
    const mq = window.matchMedia(`(min-width: ${breakpoints.sm})`);
    mq.addEventListener('change', () => {
      this.#setHidden(mq);
    });
    this.#setHidden(mq);
  }

  /**
   * Set the action and overlay to hidden is media query is hit
   * @param {object} mq the media query to check
   * @returns {void}
   */
  #setHidden(mq) {
    if (mq.matches) {
      this.hidden = true;
      this.overlay.hidden = true;
      this.removeAttribute('visible');
      this.overlay.removeAttribute(attributes.VISIBLE);
    } else {
      this.removeAttribute('hidden');
      this.overlay.removeAttribute('hidden');
    }
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.onOutsideClick();
    this.onCancelClick();
  }
}

export default IdsActionSheet;
