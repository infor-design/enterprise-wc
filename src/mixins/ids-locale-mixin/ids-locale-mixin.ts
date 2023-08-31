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

    // Set initial lang and locale
    if (this.localeAPI.language.name !== 'en') this.setAttribute('language', this.localeAPI.language.name);
    if (this.localeAPI.name !== 'en-US') this.setAttribute('locale', this.localeAPI.name);
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
