import { attributes } from '../../core/ids-attributes';

const IdsLocaleMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  // Flag for one initial event call
  initialized = false;

  connectedCallback() {
    this.offEvent('languagechange.mixin');
    this.onEvent('languagechange.mixin', this.closest('ids-container'), async () => {
      this.setDirection();

      const elements = [];
      let elementIdx = 0;

      for (let i = 0; i < this.children.length ?? 0; i++) {
        elements.push(this.children[i]);
      }
      for (let i = 0; i < this?.shadowRoot?.children.length ?? 0; i++) {
        elements.push(this.shadowRoot?.children[i]);
      }

      while (elementIdx < elements.length) {
        if (elements[elementIdx].localName.includes('ids-')) {
          if (this.locale?.isRTL()) {
            elements[elementIdx].setAttribute('dir', 'rtl');
          } else {
            elements[elementIdx].removeAttribute('dir');
          }
        }

        for (let i = 0; i < elements[elementIdx].children.length ?? 0; i++) {
          elements.push(elements[elementIdx].children[i]);
        }
        for (let i = 0; i < elements[elementIdx]?.shadowRoot?.children.length ?? 0; i++) {
          elements.push(elements[elementIdx].shadowRoot.children[i]);
        }

        elementIdx++;
      }
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
    } else {
      this.removeAttribute('dir');
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
