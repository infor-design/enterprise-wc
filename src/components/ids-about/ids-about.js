import {
  IdsElement,
  customElement,
  scss
} from '../../core/ids-element';

import {
  mix
} from '../../core';

import IdsModal from '../ids-modal';

import { attributes } from '../../core/ids-attributes';
import { IdsStringUtils, IdsDOMUtils, IdsEnvironmentUtil } from '../../utils';

// Import Mixins
import {
  IdsLocaleMixin
} from '../../mixins';

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
class IdsAbout extends mix(IdsModal).with(IdsLocaleMixin) {
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
    this.#handleEvents();
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
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #handleEvents() {
    this.#refreshProduct();

    this.offEvent('languagechange.container');
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      this.#refreshDeviceSpecs();
      this.#refreshCopyright(this.copyrightYear);
    });

    this.offEvent('languagechange.this');
    this.onEvent('languagechange.this', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
      this.#refreshDeviceSpecs();
      this.#refreshCopyright(this.copyrightYear);
    });

    IdsEnvironmentUtil.set();

    return this;
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

  /**
   * Returns the browser specs. Currently returns browse, os, cookiesEnabled and locale
   * @returns {object} The specs of the browser.
   */
  #getDeviceSpecs() {
    const locale = navigator.appName === 'Microsoft Internet Explorer' ? navigator.userLanguage : navigator.language;
    const browser = () => {
      const ua = navigator.userAgent;
      let result = [];
      let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(M[1])) {
        result = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return `IE '${result[1]}`;
      }

      if (M[1] === 'Chrome') {
        result = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (result != null) {
          return result.slice(1).join(' ').replace('OPR', 'Opera');
        }
      }

      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      result = ua.match(/version\/(\d+)/i);
      if (result !== null) {
        M.splice(1, 1, result[1]);
      }

      return M.join(' ');
    };

    return {
      browser: browser(),
      os: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      locale,
    };
  }

  /**
   * Refreshes the device specs content
   * @returns {void}
   */
  #refreshDeviceSpecs() {
    const specs = this.#getDeviceSpecs();
    const contentEl = this.container.querySelector('.ids-about-device');
    const content = `<p><span>${this.locale.translate('OperatingSystem')} : ${IdsEnvironmentUtil.devicespecs.os.replace(IdsEnvironmentUtil.devicespecs.currentOSVersion, '')} ${IdsEnvironmentUtil.devicespecs.currentOSVersion}</span><br>
      <span>${this.locale.translate('Platform')} : ${specs.os}</span><br>
      <span>${this.locale.translate('Mobile')} : ${IdsEnvironmentUtil.devicespecs.isMobile}</span><br>
      <span>${this.locale.translate('Locale')} : ${this.locale.locale.name}</span><br>
      <span>${this.locale.translate('Language')} : ${this.locale.language.name}</span><br>
      <span>${this.locale.translate('Browser')} : ${` ${IdsEnvironmentUtil.devicespecs.browserVersionName}`} ${IdsEnvironmentUtil.devicespecs.currentBrowser} (${IdsEnvironmentUtil.devicespecs.browserVersion})</span><br>
      <span>${this.locale.translate('BrowserLanguage')} : ${specs.locale}</span><br>
      <span>${this.locale.translate('CookiesEnabled')} : ${specs.cookiesEnabled}</span>
    </p>`;

    contentEl.innerHTML = content;
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
    const sanitizedVal = this.xssSanitize(val);
    this.setAttribute(attributes.COPYRIGHT_YEAR, sanitizedVal);

    this.#refreshCopyright(sanitizedVal);
  }

  /**
   * Refreshes the copyright content
   * @param {string} copyrightYear year attribute
   * @returns {void}
   */
  #refreshCopyright(copyrightYear) {
    const contentEl = this.container.querySelector('.ids-about-copyright');
    const copyright = `<p>${this.locale.translate('AboutText')} <a class="hyperlink" href="http://www.infor.com" target="_blank">www.infor.com</a>.</p>`;
    const content = copyright.replace('{0}', copyrightYear);

    contentEl.innerHTML = content;
  }
}

export default IdsAbout;
