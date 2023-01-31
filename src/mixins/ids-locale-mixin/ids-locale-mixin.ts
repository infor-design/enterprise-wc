import IdsLocale from '../../components/ids-locale/ids-locale';
import { attributes } from '../../core/ids-attributes';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';

export interface LocaleMixinInterface {
  locale: IdsLocale;
  language: string;
  setDirection(): void;
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
    this.setAttribute('language', this.localeAPI.state.language);
    this.setAttribute('locale', this.localeAPI.state.localeName);
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
    this.setAttribute('language', value);

    if (typeof this.onLanguageChange === 'function' && this.previousLanguage !== value) {
      this.onLanguageChange(this.locale);
    }
    if (this.previousLanguage !== value) {
      this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
    }

    requestAnimationFrame(() => {
      this.#notifyChildrenLanguage(this.querySelectorAll(`[language="${this.previousLanguage}"]`), value);
    });

    this.localeAPI.updateLangTag(this, value);
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
      if (this.locale) this.locale.language = value;
    }
  }

  /**
   * Get the language data keys and message for the current language
   * @returns {object} The language data object
   */
  get language(): any {
    return this?.locale?.language;
  }

  /**
   * Set the setter on all children
   * @param {NodeListOf<HTMLElement>} children the children to set
   * @param {string} language The language string value
   */
  #notifyChildrenLanguage(children: NodeListOf<HTMLElement>, language: string) {
    children.forEach((element: HTMLElement) => {
      (element as any).language = language;
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
      await this.setLanguage(lang);

      if (typeof this.onLocaleChange === 'function' && this.previousLocale !== value) {
        this.onLocaleChange(this.locale);
      }
      if (this.previousLocale !== value) {
        this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
      }
      this.#notifyChildrenLocale(this.querySelectorAll(`[locale="${this.previousLocale}"]`), value);
    }
    this.previousLocale = value;
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value: string) {
    if (value && value !== this.localName) {
      this.setLocale(value);
    }
  }

  get locale(): any {
    return this.localeAPI;
  }

  /**
   * Set the setter on all children
   * @param {NodeListOf<HTMLElement>} children the children to set
   * @param {string} locale The locale string value
   */
  #notifyChildrenLocale(children: NodeListOf<HTMLElement>, locale: string) {
    children.forEach((element: HTMLElement) => {
      (element as any).locale = locale;
    });
  }

  get localeName(): string {
    return this.localeAPI.state.localeName;
  }

  /**
   * Set the direction attribute
   */
  setDirection() {
    if (this.locale?.isRTL()) {
      this.setAttribute('dir', 'rtl');
      this.container?.classList.add('rtl');
    } else {
      this.removeAttribute('dir');
      this.container?.classList.remove('rtl');
    }
  }
};

export default IdsLocaleMixin;
