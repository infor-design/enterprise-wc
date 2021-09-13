import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../../core';

import IdsModal from '../ids-modal';
import IdsHyperlink from '../ids-hyperlink';

import { attributes } from '../../core/ids-attributes';
import {
  IdsStringUtils,
  IdsDOMUtils,
  IdsDeviceEnvUtils
} from '../../utils';

import { IdsLocaleMixin, IdsEventsMixin } from '../../mixins';

import styles from './ids-about.scss';

/**
 * IDS About Component
 * @type {IdsAbout}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 */
@customElement('ids-about')
@scss(styles)
class IdsAbout extends mix(IdsModal).with(IdsEventsMixin, IdsLocaleMixin) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.PRODUCT_NAME,
      attributes.PRODUCT_VERSION,
      attributes.COPYRIGHT_YEAR,
      attributes.DEVICE_SPECS,
      attributes.USE_DEFAULT_COPYRIGHT,
    ];
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="modal" class="ids-modal ids-about" type="custom">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header">
          <slot name="icon"></slot>
          <slot name="appName"></slot>
        </div>
        <slot name="buttons"></slot>
        <div class="ids-modal-content-wrapper">
          <div class="ids-modal-content" tabindex="0">
            <slot name="product"></slot>
            <slot name="content"></slot>
            <slot name="copyright"></slot>
            <slot name="device"></slot>
          </div>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    this.#refreshProduct();

    // Respond to parent changing language
    this.offEvent('languagechange.about-container');
    this.onEvent('languagechange.about-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });

    // Respond to the element changing language
    this.offEvent('languagechange.about');
    this.onEvent('languagechange.about', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
      this.#refreshDeviceSpecs();
      this.#refreshCopyright();
    });

    this.#attachCloseButton();

    return this;
  }

  /**
   * Cancel overlay close modal event, reattach the event to the close icon button
   * @returns {void}
   */
  onOutsideClick() {}

  /**
   * Add button with icon to the modal
   * Reusing ids-modal-button component with cancel attribute and extra css class to change appearance
   * @returns {void}
   */
  #attachCloseButton() {
    const element = `<ids-modal-button cancel slot="buttons" type="tertiary" css-class="ids-icon-button ids-modal-icon-button"><span class="audible">Close modal</span><ids-icon slot="icon" icon="close"></ids-icon></ids-modal-button>`;

    this.insertAdjacentHTML('beforeend', element);
  }

  /**
   * Used for ARIA Labels and other content
   * @readonly
   * @returns {string} concatenating the application name, product name and product version.
   */
  get ariaLabelContent() {
    const appName = this.querySelector('[slot="appName"')?.innerText;

    return `${appName || ''} ${this.productName || ''} ${this.productVersion || ''}`;
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
    this.setAttribute(attributes.PRODUCT_NAME, val);

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
    this.setAttribute(attributes.PRODUCT_VERSION, val);

    this.#refreshProduct();
  }

  /**
   * Refreshes the product info with product name / version attributes value
   * @returns {void}
   */
  #refreshProduct() {
    const slot = this.querySelectorAll('[slot="product"]');
    const element = `<ids-text slot="product" type="p">${this.productName ? `${this.productName} ` : ''}${this.productVersion || ''}</ids-text>`;

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.productName || this.productVersion) {
      this.insertAdjacentHTML('beforeend', element);
    }
  }

  /**
   * @returns {boolean} deviceSpecs attribute value
   */
  get deviceSpecs() {
    const attrVal = this.getAttribute(attributes.DEVICE_SPECS);

    if (attrVal) {
      return IdsStringUtils.stringToBool(attrVal);
    }

    return true;
  }

  /**
   * Sets whether or not to display device information.
   * @param {string|boolean} val deviceSpecs attribute value
   */
  set deviceSpecs(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    this.setAttribute(attributes.DEVICE_SPECS, boolVal);

    this.#refreshDeviceSpecs();
  }

  /**
   * Refreshes the device specs content
   * @private
   * @returns {void}
   */
  #refreshDeviceSpecs() {
    const slot = this.querySelectorAll('[slot="device"]');

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.deviceSpecs) {
      const specs = IdsDeviceEnvUtils.getSpecs();
      const element = `<ids-text slot="device" type="p"><span>${this.locale.translate('OperatingSystem')} : ${specs.os.replace(specs.currentOSVersion, '')} ${specs.currentOSVersion}</span><br/>
        <span>${this.locale.translate('Platform')} : ${specs.platform}</span><br/>
        <span>${this.locale.translate('Mobile')} : ${specs.isMobile}</span><br/>
        <span>${this.locale.translate('Locale')} : ${this.locale.locale.name}</span><br/>
        <span>${this.locale.translate('Language')} : ${this.locale.language.name}</span><br/>
        <span>${this.locale.translate('Browser')} : ${specs.currentBrowser} (${specs.browserVersion})</span><br/>
        <span>${this.locale.translate('BrowserLanguage')} : ${specs.browserLanguage}</span><br/>
        <span>${this.locale.translate('CookiesEnabled')} : ${specs.cookiesEnabled}</span><br/>
        <span>${this.locale.translate('Version')} : ${specs.idsVersion}</span>
      </ids-text>`;

      this.insertAdjacentHTML('beforeend', element);
    }
  }

  /**
   * @returns {string} copyrightYear attribute value
   */
  get copyrightYear() {
    return this.getAttribute(attributes.COPYRIGHT_YEAR) || new Date().getFullYear();
  }

  /**
   * Set the copyright year property
   * @param {string} val copyrightYear attribute value
   */
  set copyrightYear(val) {
    this.setAttribute(attributes.COPYRIGHT_YEAR, val);

    this.#refreshCopyright();
  }

  /**
   * @returns {boolean} useDefaultCopyright attribute value
   */
  get useDefaultCopyright() {
    const attrVal = this.getAttribute(attributes.USE_DEFAULT_COPYRIGHT);

    if (attrVal) {
      return IdsStringUtils.stringToBool(attrVal);
    }

    return true;
  }

  /**
   * Sets whether or not to display Legal Approved Infor Copyright Text
   * @param {string|boolean} val useDefaultCopyright attribute value
   */
  set useDefaultCopyright(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    this.setAttribute(attributes.USE_DEFAULT_COPYRIGHT, boolVal);

    this.#refreshCopyright();
  }

  /**
   * Refreshes the copyright content
   * @private
   * @returns {void}
   */
  #refreshCopyright() {
    const slot = this.querySelectorAll('[slot="copyright"]');
    const copyrightText = this.locale.translate('AboutText').replace('{0}', this.copyrightYear);
    const element = `<ids-text slot="copyright" type="p">${copyrightText} <ids-hyperlink target="_blank" text-decoration="underline" href="https://www.infor.com">www.infor.com</ids-hyperlink>.</ids-text>`;

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.useDefaultCopyright) {
      this.insertAdjacentHTML('beforeend', element);
    }
  }
}

export default IdsAbout;
