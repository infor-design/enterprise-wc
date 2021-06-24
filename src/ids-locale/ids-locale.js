/**
 * A mixin that adds locale functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
class IdsLocale {
  constructor() {
    this.loadedLocales = new Map();
    this.loadedLanguages = new Map();

    this.state = {
      defaultLocale: {
        language: 'en',
        localeName: 'en-US',
      },
      language: 'en',
      localeName: 'en-US',
      localeOptions: {}
    };
    this.setDefaults();
  }

  /**
   * Set the Defaut language and locale
   */
  async setDefaults() {
    const defaultLang = 'en';
    const defaultLocale = 'en-US';
    await this.setLanguage(defaultLang);
    await this.setLocale('en-US');
    this.state.defaultLocale.messages = this.language.messages;
    this.state.defaultLocale.language = defaultLang;
    this.state.defaultLocale.localeName = defaultLocale;
    this.state.defaultLocale.localeOptions = this.loadedLocales.get(defaultLocale);
  }

  /**
   * Takes a translation key and returns the translation in the current locale
   * @param {string} key  The key to search for on the string
   * @param {object} [options] Supports showBrackets and maybe more in the future
   * @returns {string|undefined} a translated string, or nothing, depending on configuration
   */
  translate(key, options = { showAsUndefined: false, showBrackets: true }) {
    if (key === '&nsbp;') {
      return '';
    }

    // Substitue The English Expression if missing
    if (!this.language.messages[key]) {
      if (!this.state.defaultLocale.messages[key]) {
        return `${options.showBrackets ? '[' : ''}${key}${options.showBrackets ? ']' : ''}`;
      }
      return this.state.defaultLocale.messages[key].value;
    }

    return this.language.messages[key].value;
  }

  /**
   * Load a locale or message file
   * @private
   * @param {string} value The script file name
   * @returns {Promise} A promise that will resolve when complete
   */
  loadLanguageScript(value) {
    const promise = import(`./cultures/${value}-messages.js`);
    promise.then((module) => {
      // do something with the translations
      this.loadedLanguages.set(value, module.messages);
    });
    return promise;
  }

  /**
   * Set the language for a component
   * @param {string} value The language string value
   */
  set language(value) {
    const lang = this.#correctLanguage(value);
    if (value && lang !== this.state.language) {
      this.setLanguage(lang);
    }
  }

  /**
   * Get the language data
   * @returns {object} The language data
   */
  get language() {
    return {
      name: this.state.language,
      messages: this.loadedLanguages.get(this.state.language) || {}
    };
  }

  /**
   * Set the language for a component and wait for it to finish (async)
   * @param {string} value The language string value
   */
  async setLanguage(value) {
    const lang = this.#correctLanguage(value);
    if (this.state.language !== lang) {
      this.state.language = lang;
      this.html = document.querySelector('html');
      this.html.setAttribute('lang', lang);
    }

    if (this.state.language === lang && this.loadedLanguages.get(this.state.language)) {
      return;
    }
    await this.loadLanguageScript(lang);
  }

  /**
   * Maps a language value to a more correct one
   * @private
   * @param {string} value the starting language string
   * @returns {string} the updated language string
   */
  #correctLanguage(value) {
    let lang = value?.replace('-messages', '');
    // Locales that dont have a default if a two digit locale
    const translated = new Set(['fr-CA', 'fr-FR', 'pt-BR', 'pt-PT', 'zh-CN', 'zh-Hans', 'zh-Hant', 'zh-TW']);
    if (translated.has(lang)) {
      return lang;
    }

    // Use two digit for others
    lang = lang.substring(0, 2);

    // Map incorrect java locale to correct locale
    if (lang === 'in') {
      lang = 'id';
    }
    if (lang === 'iw') {
      lang = 'he';
    }
    return lang;
  }

  /**
   * Add an object full of translations to the given locale.
   * @param {string} lang The language to add them to.
   * @param  {object} messages Strings in the form of
   */
  extendTranslations(lang, messages) {
    if (!this.loadedLanguages.has(lang)) {
      return;
    }

    const base = this.loadedLanguages.get(lang);
    Object.keys(messages).forEach((key) => {
      base[key] = messages[key];
    });
    this.loadedLanguages.set(lang, base);
  }

  /**
   * Load a locale file
   * @private
   * @param {string} value The script file name
   * @returns {Promise} A promise that will resolve when complete
   */
  loadLocaleScript(value) {
    const promise = import(`./cultures/${value}.js`);
    promise.then((module) => {
      // do something with the locale data
      this.loadedLocales.set(value, module.locale);
    });
    return promise;
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value) {
    const locale = this.#correctLocale(value);
    if (value && locale !== this.state.localeName) {
      this.setLocale(locale);
    }
  }

  /**
   * Get the language data
   * @returns {object} The language data
   */
  get locale() {
    return {
      name: this.state.localeName,
      options: this.loadedLocales.get(this.state.localeName) || {}
    };
  }

  /**
   * Set the locale for a component and wait for it to finish (async)
   * @param {string} value The locale string value
   */
  async setLocale(value) {
    const locale = this.#correctLocale(value);
    if (this.state.localeName !== locale) {
      this.state.localeName = locale;
      this.setLanguage(locale);
    }

    if (this.state.localeName === locale && this.loadedLocales.get(this.state.localeName)) {
      return;
    }
    await this.loadLocaleScript(locale);
  }

  /**
   * Maps a locale value to a more correct one
   * @private
   * @param {string} value the starting locale string
   * @returns {string} the updated locale string
   */
  #correctLocale(value) {
    let locale = value;
    // Map incorrect java locale to correct locale
    if (locale === 'in-ID') {
      locale = 'id-ID';
    }
    if (locale.substr(0, 2) === 'iw') {
      locale = 'he-IL';
    }
    return locale;
  }

  /**
   * Format a number using the locale information
   * @param {string} value the starting locale string
   * @param {object} [options] the objects to use for formatting
   * @returns {string} the formatted number
   */
  formatNumber(value, options) {
    // Set some options to map it closer to our old defaults
    let opts = options;
    let val = value;
    if (!opts) {
      opts = {};
    }

    if (opts?.minimumFractionDigits === undefined && !opts?.maximumFractionDigits) {
      opts.minimumFractionDigits = 2;
    }

    if (opts?.group || opts.group === '') {
      opts.useGrouping = opts.group !== '';
    }

    if (opts?.style === 'integer') {
      opts.style = null;
      opts.maximumFractionDigits = 0;
      opts.minimumFractionDigits = 0;
    }

    if (typeof value === 'string') {
      val = this.parseNumber(value);
    }
    return Number(val).toLocaleString(opts?.locale || this.state.localeName, opts);
  }

  /**
   * Takes a locale formatted number string and converts it back to a real number object.
   * @param {string} input  The source number normally as a string.
   * @param {object} options Any special options to pass in such as the original locale
   * @returns {number} The number as an actual Number type unless the number
   * is a big int (19 significant digits), in this case a string will be returned
   */
  parseNumber(input, options) {
    const localeData = this.loadedLocales.get(options?.locale || this.locale.name);
    const numSettings = localeData.numbers;
    let numString = input;

    if (!numString) {
      return NaN;
    }

    if (typeof input === 'number') {
      numString = numString.toString();
    }

    const group = options?.group ? options.group : numSettings.group;
    const decimal = options?.decimal ? options.decimal : numSettings.decimal;
    const percentSign = options?.percentSign ? options.percentSign : numSettings.percentSign;
    const currencySign = options?.currencySign ? options.currencySign : localeData.currencySign;

    const exp = (group === ' ') ? new RegExp(/\s/g) : new RegExp(`\\${group}`, 'g');
    numString = numString.replace(exp, '');
    numString = numString.replace(decimal, '.');
    numString = numString.replace(percentSign, '');
    numString = numString.replace(currencySign, '');
    numString = numString.replace('$', '');
    numString = numString.replace(' ', '');

    return numString.length >= 19 ? numString : parseFloat(numString);
  }
}

export default IdsLocale;
