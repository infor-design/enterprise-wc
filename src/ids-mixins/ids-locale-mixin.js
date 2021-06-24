import { props } from '../ids-base/ids-attributes';
import locale from '../ids-locale/ids-locale-global';
import { IdsEventsMixin } from './ids-events-mixin';

const IdsLocaleMixin = (superclass) => class extends IdsRenderLoopMixin(superclass) {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.getAttribute('language')) {
      this.setAttribute('language', this.language.name);
    }
    super.connectedCallback();
  }

  static get properties() {
    return [
      ...super.properties,
      props.LANGUAGE,
      props.LOCALE
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
      this.setAttribute('language', value);
      this.triggerEvent('languagechanged', this, { detail: { elem: this, language: this.language, locale: this.locale } });
    }
  }

  /**
   * Get the language data keys and message for the current language
   * @returns {object} The language data object
   */
  get language() {
    return this.locale.language;
  }

  /**
   * Set the locale for a component and wait for it to finish (async)
   * @param {string} value The locale string value
   */
  async setLocale(value) {
    await this.locale.setLocale(value);
    this.locale = value;
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value) {
    if (value) {
      this.locale.setLocale(value);
      this.setAttribute('locale', value);
      this.triggerEvent('localechanged', this, { detail: { elem: this, language: this.language, locale: this.locale } });
    }
  }

  /**
   * Provides access to a global `locale` instance
   * @returns {any} link to the global locale instance
   */
  get locale() {
    return locale;
  }
};

export default IdsLocaleMixin;
