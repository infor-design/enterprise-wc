import { attributes } from '../../core/ids-attributes';
import { getIdsElements } from '../../utils/ids-dom-utils/ids-dom-utils';

const IdsLocaleMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  // Flag for one initial event call
  initialized = false;

  connectedCallback() {
    this.offEvent('languagechange.mixin');
    this.onEvent('languagechange.mixin', this.closest('ids-container'), () => {
      this.setDirection();
    });
    super.connectedCallback?.();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.LANGUAGE,
      attributes.LOCALE
    ];
  }

  /**
   * Provides access to a global `locale` instance
   * @returns {any} link to the global locale instance
   */
  get locale() {
    this.attachLocale();
    return this.state.locale;
  }

  get language() {
    this.attachLocale();
    return this.locale?.language;
  }

  /**
   * Set the direction attribute
   */
  setDirection() {
    if (this.locale?.isRTL()) {
      this.setAttribute('dir', 'rtl');
      this.triggerEvent('directionchange', this, { detail: { isRTL: true } });
    } else {
      this.removeAttribute('dir');
      this.triggerEvent('directionchange', this, { detail: { isRTL: false } });
    }
  }

  onDirectionChange(e, target) {
    if (e?.detail?.isRTL) {
      target.setAttribute('dir', 'rtl');
      target.triggerEvent('directionchange', this, { detail: { isRTL: true } });
    } else {
      target.removeAttribute('dir');
      target.triggerEvent('directionchange', this, { detail: { isRTL: false } });
    }
  }

  /**
   * Attach the container locale to this instance
   */
  attachLocale() {
    if (this.tagName !== 'IDS-CONTAINER' && !this.state?.locale) {
      this.state = this.state || {};
      this.state.locale = document.querySelector('ids-container')?.state?.locale;
    }
  }
};

export default IdsLocaleMixin;
