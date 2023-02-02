import IdsLocale from '../../components/ids-locale/ids-locale';
import { attributes } from '../../core/ids-attributes';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';

export interface LocaleMixinInterface {
  locale: string;
  language: string;
  setDirection(): void;
  localeAPI: IdsLocale;
}

export interface LocaleHandler {
  onLocaleChange?: (locale?: IdsLocale) => void;
  onLanguageChange?: (locale?: IdsLocale) => void;
}

type Constraints = IdsConstructor<EventsMixinInterface & LocaleHandler>;

const IdsLocaleMixin = <T extends Constraints>(superclass: T) => class extends superclass implements LocaleMixinInterface {
  localeAPI = new IdsLocale();

  constructor(...args: any[]) {
    super(...args);
  }

  connectedCallback() {
    super.connectedCallback?.();

    // Set initial lang and locale
    if (this.localeAPI.state.language !== 'en') this.setAttribute('language', this.localeAPI.state.language);
    if (this.localeAPI.state.localeName !== 'en-US') this.setAttribute('locale', this.localeAPI.state.localeName);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.LANGUAGE,
      attributes.LOCALE
    ];
  }

  /**
   * Set the language for a component and wait for it to finish (async)
   * @param {string} value The language string value
   */
  async setLanguage(value: string) {
    await this.localeAPI.setLanguage(value);

    if (this.nodeName === 'IDS-CONTAINER') this.localeAPI.setDocumentLangAttribute(this, value);
    this.setAttribute('language', value);

    if (typeof this.onLanguageChange === 'function' && this.previousLanguage !== value) {
      this.onLanguageChange(this.localeAPI);
    }
    if (this.previousLanguage !== value) {
      this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
    }

    if (this.children.length > 0) {
      const previous = this.previousLanguage;
      this.#notifyChildrenLanguage(this.querySelectorAll('*'), value, previous);
    }

    this.localeAPI.updateDirectionAttribute(this, value);
    this.setDirection();

    this.previousLanguage = value;
  }

  /** Holds the last set language */
  previousLanguage = 'en';

  /**
   * Set the language for a component
   * @param {string} value The language string value
   */
  set language(value: string) {
    if (value && value !== this.language.name) {
      this.setLanguage(value);
      if (this.locale) this.localeAPI.language = value;
    }
  }

  /**
   * Get the language data keys and message for the current language
   * @returns {object} The language data object
   */
  get language(): any {
    return this?.localeAPI?.language;
  }

  /**
   * Set the setter on all children
   * @param {NodeListOf<HTMLElement>} children the children to set
   * @param {string} language The language string value
   * @param {string} previousLanguage The previous language string value
   */
  #notifyChildrenLanguage(children: NodeListOf<HTMLElement>, language: string, previousLanguage: string) {
    children.forEach((element: any) => {
      if (element.language && element.language.name === previousLanguage) {
        element.language = language;
      }
    });
  }

  /** Holds the last set locale */
  previousLocale = 'en-US';

  /**
   * Set the locale for a component and wait for it to finish (async)
   * @param {string} value The locale string value
   */
  async setLocale(value: string) {
    if (value) {
      await this.localeAPI.setLocale(value);
      const lang = this.localeAPI.correctLanguage(value);
      this.setAttribute('locale', value);

      if (this.nodeName === 'IDS-CONTAINER') this.localeAPI.setDocumentLangAttribute(this, lang);
      await this.setLanguage(lang);

      if (typeof this.onLocaleChange === 'function' && this.previousLocale !== value) {
        this.onLocaleChange(this.localeAPI);
      }
      if (this.previousLocale !== value) {
        this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
      }

      if (this.children.length > 0) {
        const previous = this.previousLocale;
        requestAnimationFrame(() => {
          this.#notifyChildrenLocale(this.querySelectorAll('*'), value, previous);
        });
      }
    }
    this.previousLocale = value;
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value: string) {
    if (value && value !== this.locale && typeof value === 'string') {
      this.setLocale(value);
    }
  }

  get locale(): string {
    return this.localeAPI.state.localeName;
  }

  /**
   * Set the setter on all children
   * @param {NodeListOf<HTMLElement>} children the children to set
   * @param {string} locale The locale string value
   * @param {string} previousLocale The previous locale string value
   */
  #notifyChildrenLocale(children: NodeListOf<HTMLElement>, locale: string, previousLocale: string) {
    children.forEach((element: any) => {
      if (element.locale && element.locale === previousLocale) {
        element.locale = locale;
      }
    });
  }

  /**
   * Set the direction attribute
   */
  setDirection() {
    if (this.localeAPI?.isRTL()) {
      this.setAttribute('dir', 'rtl');
      this.container?.classList.add('rtl');
    } else {
      this.removeAttribute('dir');
      this.container?.classList.remove('rtl');
    }
  }
};

export default IdsLocaleMixin;
