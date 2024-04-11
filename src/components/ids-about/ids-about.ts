import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getSpecs } from '../../utils/ids-device-env-specs-utils/ids-device-env-specs-utils';
import { copyHtmlToClipboard } from '../../utils/ids-copy-utils/ids-copy-utils';

import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsModal from '../ids-modal/ids-modal';
import '../ids-hyperlink/ids-hyperlink';
import styles from './ids-about.scss';

const Base = IdsLocaleMixin(
  IdsModal
);

/**
 * IDS About Component
 * @type {IdsAbout}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 * @mixes IdsLocaleMixin
 */
@customElement('ids-about')
@scss(styles)
export default class IdsAbout extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COPYRIGHT_YEAR,
      attributes.DEVICE_SPECS,
      attributes.PRODUCT_NAME,
      attributes.PRODUCT_VERSION,
      attributes.USE_DEFAULT_COPYRIGHT,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.showCloseButton = true;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-popup part="modal" class="ids-modal ids-about" type="modal" position-style="viewport">
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
          <ids-button id="copy-to-clipboard">
            <ids-icon icon="copy"></ids-icon>
            <span class="audible">${this.localeAPI?.translate('CopyToClipboard')}</span>
          </ids-button>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  attachEventHandlers(): object {
    super.attachEventHandlers();
    this.#refreshProduct();
    this.#refreshDeviceSpecs();
    this.#refreshCopyright();

    // Respond to parent changing language
    this.onLanguageChange = () => {
      this.#refreshDeviceSpecs();
      this.#refreshCopyright();
    };

    this.onLocaleChange = () => {
      this.#refreshDeviceSpecs();
      this.#refreshCopyright();
    };

    this.onEvent('click', this.container?.querySelector('#copy-to-clipboard'), async () => {
      let specs = `${this.querySelector<HTMLSlotElement>('[slot="product"]')?.innerText}\r\n`;
      specs += `${this.querySelector<HTMLSlotElement>('[slot="device"]')?.innerText}\r\n`;
      await copyHtmlToClipboard(specs);
    });
    return this;
  }

  /**
   * Used for ARIA Labels and other content
   * @readonly
   * @returns {string} concatenating the application name, product name and product version.
   */
  get ariaLabelContent(): string {
    const appName = this.querySelector<HTMLSlotElement>('[slot="appName"')?.innerText;

    return `${appName || ''} ${this.productName || ''} ${this.productVersion || ''}`;
  }

  /**
   * @returns {string} productName attribute value
   */
  get productName(): string | null {
    return this.getAttribute(attributes.PRODUCT_NAME);
  }

  /**
   * Set the product name property
   * @param {string} val productName attribute value
   */
  set productName(val: string | null) {
    this.setAttribute(attributes.PRODUCT_NAME, String(val));
    this.#refreshProduct();
  }

  /**
   * @returns {string} productVersion attribute value
   */
  get productVersion(): string | null {
    return this.getAttribute(attributes.PRODUCT_VERSION);
  }

  /**
   * Set the product version property
   * @param {string} val productVersion attribute value
   */
  set productVersion(val: string | null) {
    this.setAttribute(attributes.PRODUCT_VERSION, String(val));

    this.#refreshProduct();
  }

  /**
   * Refreshes the product info with product name / version attributes value
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
  get deviceSpecs(): boolean {
    const attrVal = this.getAttribute(attributes.DEVICE_SPECS);
    return attrVal ? stringToBool(attrVal) : true;
  }

  /**
   * Sets whether or not to display device information.
   * @param {string|boolean} val deviceSpecs attribute value
   */
  set deviceSpecs(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.DEVICE_SPECS, String(boolVal));
    this.#refreshDeviceSpecs();
  }

  /**
   * Refreshes the device specs content
   * @private
   */
  #refreshDeviceSpecs() {
    const slot = this.querySelectorAll('[slot="device"]');

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.deviceSpecs) {
      const specs = getSpecs();
      const element = `<ids-text slot="device" type="p">
        <span>${this.localeAPI?.translate('Platform')} : ${specs.platform}</span><br/>
        <span>${this.localeAPI?.translate('Mobile')} : ${specs.isMobile}</span><br/>
        <span>${this.localeAPI?.translate('Browser')} : ${specs.browser} (${specs.browserVersion})</span><br/>
        <span>${this.localeAPI?.translate('Locale')} : ${this.localeAPI?.locale.name || 'en-US'}</span><br/>
        <span>${this.localeAPI?.translate('Language')} : ${this.localeAPI?.language.name || 'en'}</span><br/>
        <span>${this.localeAPI?.translate('BrowserLanguage')} : ${specs.browserLanguage}</span><br/>
        <span>${this.localeAPI?.translate('Version')} : ${specs.idsVersion}</span>
      </ids-text>`;

      this.insertAdjacentHTML('beforeend', element);
    }
  }

  /**
   * @returns {string} copyrightYear attribute value
   */
  get copyrightYear(): string {
    return this.getAttribute(attributes.COPYRIGHT_YEAR) || new Date().getFullYear().toString();
  }

  /**
   * Set the copyright year property
   * @param {string} val copyrightYear attribute value
   */
  set copyrightYear(val: string | number) {
    this.setAttribute(attributes.COPYRIGHT_YEAR, String(val));

    this.#refreshCopyright();
  }

  /**
   * @returns {boolean} useDefaultCopyright attribute value
   */
  get useDefaultCopyright(): boolean {
    const attrVal = this.getAttribute(attributes.USE_DEFAULT_COPYRIGHT);
    return attrVal ? stringToBool(attrVal) : true;
  }

  /**
   * Sets whether or not to display Legal Approved Infor Copyright Text
   * @param {string|boolean} val useDefaultCopyright attribute value
   */
  set useDefaultCopyright(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.USE_DEFAULT_COPYRIGHT, String(boolVal));
    this.#refreshCopyright();
  }

  /**
   * Refreshes the copyright content
   * @private
   */
  #refreshCopyright() {
    const slot = this.querySelectorAll('[slot="copyright"]');
    const copyrightText = this.localeAPI?.translate('AboutText').replace('{0}', this.copyrightYear);
    const element = `<ids-text slot="copyright" type="p">${copyrightText} <ids-hyperlink target="_blank" text-decoration="underline" href="https://www.infor.com">www.infor.com</ids-hyperlink>.</ids-text>`;

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.useDefaultCopyright) {
      this.insertAdjacentHTML('beforeend', element);
    }
  }
}
