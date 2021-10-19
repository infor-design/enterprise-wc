import {
  IdsElement,
  customElement,
  scss,
  attributes,
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
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.VISIBLE];
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
          <ids-button part="cancel-btn">
            <span slot="text">Cancel</span>
          </ids-button>
        </div>
      </div>
    `;
  }

  set visible(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.VISIBLE, true);
      this.overlay.setAttribute(attributes.VISIBLE, true);
    } else {
      this.removeAttribute(attributes.VISIBLE);
      this.overlay.removeAttribute(attributes.VISIBLE);
    }
  }

  get visible() {
    return this.getAttribute(attributes.VISIBLE);
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
