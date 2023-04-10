import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { breakpoints } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-modal/ids-overlay';
import '../ids-popup-menu/ids-popup-menu';

import styles from './ids-action-sheet.scss';
import type IdsOverlay from '../ids-modal/ids-overlay';
import type IdsButton from '../ids-button/ids-button';

const Base = IdsThemeMixin(
  IdsEventsMixin(
    IdsElement
  )
);

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
  overlay?: IdsOverlay | null;

  cancelBtn?: IdsButton | null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.overlay = this.shadowRoot?.querySelector('ids-overlay');
    this.cancelBtn = this.shadowRoot?.querySelector('[part="cancel-btn"]');
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
          <ids-button appearance="secondary" part="cancel-btn">
            <span>${this.cancelBtnText}</span>
          </ids-button>
        </div>
      </div>
    `;
  }

  /**
   * Set the visible attribute
   * @param {boolean | string} val true if the action sheet should appear
   */
  set visible(val: boolean | string | null) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy && !this.hidden) {
      this.setAttribute(attributes.VISIBLE, 'true');
      this.overlay?.setAttribute(attributes.VISIBLE, 'true');
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
  set cancelBtnText(val: string | null) {
    if (val) {
      this.setAttribute(attributes.CANCEL_BTN_TEXT, val);
    } else {
      this.removeAttribute(attributes.CANCEL_BTN_TEXT);
    }

    const idsButton = this.shadowRoot?.querySelector<IdsButton>('ids-button');
    if (idsButton) {
      idsButton.style.display = val ? 'inline-flex' : 'none';
      idsButton.innerText = val || '';
    }
  }

  /**
   * @returns {string} the inner text of the cancel btn
   */
  get cancelBtnText(): string | null {
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
      // TODO - do we need this?
      // this.overlay?.hidden = true;
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
