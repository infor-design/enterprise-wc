import IdsLocale from '../../components/ids-locale/ids-locale';
import { attributes } from '../../core/ids-attributes';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';
import IdsGlobal from '../../components/ids-global/ids-global';

export interface LocaleMixinInterface {
  localeAPI: IdsLocale;
}

export interface LocaleHandler {
  onLocaleChange?: (locale?: IdsLocale) => void;
  onLanguageChange?: (locale?: IdsLocale) => void;
}

type Constraints = IdsConstructor<EventsMixinInterface & LocaleHandler>;

const IdsLocaleMixin = <T extends Constraints>(superclass: T) => class extends superclass implements LocaleMixinInterface {
  constructor(...args: any[]) {
    super(...args);
  }

  get localeAPI() {
    return IdsGlobal.getLocale();
  }

  connectedCallback() {
    super.connectedCallback?.();

    const language = this.localeAPI.language.name;
    const locale = this.localeAPI.name;

    // Set initial lang and locale
    if (language !== 'en') this.setAttribute('language', language);
    if (locale !== 'en-US') this.setAttribute('locale', locale);

    // set initial direction
    if (language === 'ar' || language === 'he') {
      this.setAttribute('dir', 'rtl');
    }
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.LANGUAGE,
      attributes.LOCALE
    ];
  }

  /**
   * Set the locale name for a component
   * @param {string} value The locale string value
   */
  set locale(value: string) {
    if (value && value !== this.localeAPI.name && typeof value === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.localeAPI.setLocale(value, false);
    }
  }

  get locale(): string {
    return this.localeAPI.state.localeName;
  }

  /**
   * Set the language for a component
   * @param {string} value The language string value
   */
  set language(value: string) {
    if (value && value !== this.language.name) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.localeAPI.setLanguage(value);
    }
  }

  /**
   * Get the language data keys and message for the current language
   * @returns {object} The language data object
   */
  get language(): any {
    return {
      name: this.getAttribute('language') || 'en',
      messages: this?.localeAPI?.language.messages
    };
  }
};

export default IdsLocaleMixin;
