import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { breakpoints } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import Base from './ids-action-sheet-base';
import '../ids-modal/ids-overlay';
import '../ids-popup-menu/ids-popup-menu';

import styles from './ids-action-sheet.scss';

/**
 * IDS Action Sheet Component
 * @type {IdsActionSheet}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-action-sheet')
@scss(styles)
export default class IdsActionSheet extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.overlay = this.shadowRoot.querySelector('ids-overlay');
    this.cancelBtn = this.shadowRoot.querySelector('[part="cancel-btn"]');
    if (!this.hasAttribute(attributes.CANCEL_BTN_TEXT)) {
      this.setAttribute(attributes.CANCEL_BTN_TEXT, 'Cancel');
    }
    this.#attachEventHandlers();
    this.#hideOnDesktop();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.CANCEL_BTN_TEXT,
      attributes.VISIBLE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-action-sheet">
        <ids-overlay opacity=".5"></ids-overlay>
        <div class="ids-action-sheet-inner">
          <slot></slot>
          <ids-button type="secondary" part="cancel-btn">
            <span slot="text">
              ${this.cancelBtnText}
            </span>
          </ids-button>
        </div>
      </div>
    `;
  }

  /**
   * Set the visible attribute
   * @param {boolean | string} val true if the action sheet should appear
   */
  set visible(val: boolean | string) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy && !this.hidden) {
      this.setAttribute(attributes.VISIBLE, true);
      this.overlay?.setAttribute(attributes.VISIBLE, true);
    } else {
      this.removeAttribute(attributes.VISIBLE);
      this.overlay?.removeAttribute(attributes.VISIBLE);
    }
  }

  /**
   * @returns {boolean} the current visible state
   */
  get visible(): boolean {
    return stringToBool(this.getAttribute(attributes.VISIBLE));
  }

  /**
   * Set the btn text attribute
   * @param {string} val the inner text of the cancel btn
   */
  set cancelBtnText(val: string) {
    const safeValue = stripHTML(val);
    const idsButton = this.shadowRoot?.querySelector('ids-button');
    if (safeValue) {
      this.setAttribute(attributes.CANCEL_BTN_TEXT, safeValue);
      idsButton.style.display = 'inline-flex';
      idsButton.innerText = safeValue;
    } else {
      this.removeAttribute(attributes.CANCEL_BTN_TEXT);
      idsButton.innerText = safeValue;
      idsButton.style.display = 'none';
    }
  }

  /**
   * @returns {string} the inner text of the cancel btn
   */
  get cancelBtnText(): string {
    return this.getAttribute(attributes.CANCEL_BTN_TEXT);
  }

  /**
   * Handle `onOutsideClick` on overlay
   */
  onOutsideClick() {
    this.onEvent('click', this.overlay, () => this.dismiss());
    this.onEvent('touchstart', this.overlay, () => this.dismiss(), { passive: true });
  }

  /**
   * Handle cancel btn click
   */
  onCancelClick() {
    this.onEvent('click', this.cancelBtn, () => this.dismiss());
    this.onEvent('touchstart', this.cancelBtn, () => this.dismiss(), { passive: true });
  }

  /**
   * Remove the action sheet from the page
   */
  dismiss() {
    this.removeAttribute(attributes.VISIBLE);
    this.overlay?.removeAttribute(attributes.VISIBLE);
  }

  /**
   * Hide the action sheet on desktop devices
   */
  #hideOnDesktop() {
    const mq = window.matchMedia(`(min-width: ${breakpoints.sm})`);
    mq.addEventListener('change', () => {
      this.#setVisibility(mq);
    });
    this.#setVisibility(mq);
  }

  /**
   * Set the action and overlay to hidden is media query is hit
   * @param {object} mq the media query to check
   */
  #setVisibility(mq: MediaQueryList) {
    if (mq.matches) {
      this.hidden = true;
      this.overlay.hidden = true;
      this.removeAttribute('visible');
      this.overlay?.removeAttribute(attributes.VISIBLE);
    } else {
      this.removeAttribute('hidden');
      this.overlay?.removeAttribute('hidden');
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
