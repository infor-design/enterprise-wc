import { attributes } from '../../core/ids-attributes';

const IdsLocaleMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    if (!this.getAttribute('language') && this.language?.name) {
      this.setAttribute('language', this.language.name);
    }
    if (!this.getAttribute('locale') && this.locale?.locale) {
      this.setAttribute('locale', this.locale.locale.name);
    }
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.LANGUAGE,
      attributes.LOCALE
    ];
  }

  /**
   * Set the language for a component and wait for it to finish (async)
   * @param {string} value The language string value
   */
  async setLanguage(value) {
    await this.locale.setLanguage(value);
    this.language = value;
  }

  /**
   * Set the language for a component
   * @param {string} value The language string value
   */
  set language(value) {
    if (value) {
      this.locale.setLanguage(value);
      this.locale.updateLangTag(this, value);
      this.locale.updateLangTag(this.container, value);
      this.setAttribute('language', value);

      requestAnimationFrame(() => {
        this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.locale } });
      });
    }
  }

  /**
   * Get the language data keys and message for the current language
   * @returns {object} The language data object
   */
  get language() {
    this.attachLocale();
    return this.locale?.language;
  }

  /**
   * Set the locale for a component and wait for it to finish (async)
   * @param {string} value The locale string value
   */
  async setLocale(value) {
    if (value) {
      await this.locale.setLocale(value);
      this.locale = value;
      this.locale.updateLangTag(this, value.substr(0, 2));
      this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.locale } });
    }
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value) {
    if (value) {
      this.locale.setLocale(value);
      this.setAttribute('locale', value);

      requestAnimationFrame(() => {
        this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.locale.locale } });
      });
    }
  }

  /**
   * Provides access to a global `locale` instance
   * @returns {any} link to the global locale instance
   */
  get locale() {
    this.attachLocale();
    return this.state.locale;
  }

  /**
   * Attach the container locale to this instance
   */
  attachLocale() {
    if (this.tagName !== 'IDS-CONTAINER' && !this.state?.locale) {
      this.state = this.state || {};
      this.state.locale = document.querySelector('ids-container')?.locale;
    }
  }
};

export default IdsLocaleMixin;
