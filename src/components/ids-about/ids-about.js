import {
  IdsElement,
  customElement,
  scss
} from '../../core/ids-element';

import IdsModal from '../ids-modal';

import { attributes } from '../../core/ids-attributes';
import { IdsStringUtils, IdsDOMUtils } from '../../utils';

import styles from './ids-about.scss';

/**
 * IDS About Component
 * @type {IdsAbout}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-about')
@scss(styles)
class IdsAbout extends IdsModal {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.PRODUCT_NAME,
      attributes.PRODUCT_VERSION,
      attributes.COPYRIGHT_YEAR,
      attributes.DEVICE_SPECS
    ];
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();

    this.#refreshProduct();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="modal" class="ids-modal ids-about" type="custom">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header">
          <slot name="appName"></slot>
        </div>
        <div class="ids-modal-content-wrapper">
          <div class="ids-modal-content">
            <div class="ids-about-product"></div>
            <slot name="content"></slot>
            <div class="ids-about-copyright"></div>
            <div class="ids-about-device"></div>
          </div>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * @returns {string} productName attribute value
   */
  get productName() {
    return this.getAttribute(attributes.PRODUCT_NAME);
  }

  /**
   * Set the product name property
   * @param {string} val productName attribute value
   */
  set productName(val) {
    const sanitizedVal = this.xssSanitize(val);
    this.setAttribute(attributes.PRODUCT_NAME, sanitizedVal);

    this.#refreshProduct();
  }

  /**
   * @returns {string} productVersion attribute value
   */
  get productVersion() {
    return this.getAttribute(attributes.PRODUCT_VERSION);
  }

  /**
   * Set the product version property
   * @param {string} val productVersion attribute value
   */
  set productVersion(val) {
    const sanitizedVal = this.xssSanitize(val);
    this.setAttribute(attributes.PRODUCT_VERSION, sanitizedVal);

    this.#refreshProduct();
  }

  /**
   * Refreshes the product info with product name / version attributes value
   * @returns {void}
   */
  #refreshProduct() {
    const contentEl = this.container.querySelector('.ids-about-product');
    const content = `<p>${this.productName ? `${this.productName} ` : ''}${this.productVersion || ''}</p>`;

    contentEl.innerHTML = content;
  }
}

export default IdsAbout;
