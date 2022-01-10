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
   * Sets the dir (direction) tag on an element
   * @param {HTMLElement} elem The element to set it on.
   * @param {string} value The value to check
   */
  updateLangTag(elem, value) {
    if (this.isRTL(value)) {
      elem.setAttribute('dir', 'rtl');
      return;
    }
    elem.removeAttribute('dir');
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
   * Takes a translation key and returns the translation in the current locale
   * @param {string} key  The key to search for on the string
   * @param {object} [options] Supports showBrackets and maybe more in the future
   * @returns {string|undefined} a translated string, or nothing, depending on configuration
   */
  translate(key, options = { showAsUndefined: false, showBrackets: true }) {
    if (key === '&nsbp;') {
      return '';
    }

    if (!options?.showAsUndefined && options?.showBrackets === undefined) {
      options.showBrackets = true;
    }

    let messages = this.language.messages;
    if (options?.language) {
      messages = this.loadedLanguages.get(options?.language) || messages;
    }

    // Substitue The English Expression if missing
    if (!messages[key]) {
      if (options.showAsUndefined) {
        return undefined;
      }

      messages = this.state.defaultLocale?.messages;
      if (!messages || !messages[key]) {
        return `${options.showBrackets ? '[' : ''}${key}${options.showBrackets ? ']' : ''}`;
      }
      return this.state.defaultLocale.messages[key].value;
    }

    return messages[key].value;
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
   * Get the locale data
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
    if (!value) {
      return;
    }

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
    if (locale?.substr(0, 2) === 'iw') {
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
    const usedLocale = opts?.locale || this.state.localeName;
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
      opts.style = undefined;
      opts.maximumFractionDigits = 0;
      opts.minimumFractionDigits = 0;
    }

    if (typeof value === 'string') {
      val = this.parseNumber(value, opts);
    }

    // Handle Big Int (integers)
    if (typeof value === 'string'
      && value.length >= 18
      && value.indexOf('.') === -1
      && value.indexOf(',') === -1) {
      return BigInt(value).toLocaleString(usedLocale, opts);
    }

    // Handle Big Int (decimals)
    if (typeof value === 'string'
    && value.length >= 18
    && (value.indexOf('.') > -1)) {
      const index = value.indexOf('.');
      let decimalPart = value.substr(index);
      const intPart = value.substr(0, index);
      const bigInt = BigInt(intPart).toLocaleString(usedLocale);
      decimalPart = Number(decimalPart).toLocaleString(usedLocale, opts);
      return bigInt + decimalPart.substr(1);
    }
    return Number(val).toLocaleString(usedLocale, opts);
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

    // eslint-disable-next-line prefer-regex-literals
    const exp = (group === ' ') ? new RegExp(/\s/g) : new RegExp(`\\${group}`, 'g');
    numString = numString.replace(exp, '');
    numString = numString.replace(decimal, '.');
    numString = numString.replace(percentSign, '');
    numString = numString.replace(currencySign, '');
    numString = numString.replace('$', '');
    numString = numString.replace(' ', '');

    if (numString.indexOf('.') === -1 && numString.length >= 18) {
      return numString;
    }
    return numString.length >= 19 ? numString : parseFloat(numString);
  }

  /**
   * Convert a number in arabic/chinese or hindi numerals to an "english" number.
   * @param  {string} string The string number in arabic/chinese or hindi
   * @returns {number} The english number.
   */
  convertNumberToEnglish(string) {
    const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const devanagari = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']; // Hindi
    const chineseFinancialTraditional = ['零', '壹', '貳', '叄', '肆', '伍', '陸', '柒', '捌', '玖'];
    const chineseFinancialSimplified = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const chinese = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    for (let i = 0; i <= 9; i++) {
      string = string.replace(arabic[i], i);
      string = string.replace('٬', '');
      string = string.replace(',', '');
      string = string.replace(devanagari[i], i);
      string = string.replace(chineseFinancialTraditional[i], i);
      string = string.replace(chineseFinancialSimplified[i], i);
      string = string.replace(chinese[i], i);

      if (i === 0) { // Second option for zero in chinese
        string = string.replace('零', i);
      }
    }
    return parseFloat(string);
  }

  /**
   * Formats a date object using the current locale or specified settings
   * to a string for Internationalization
   * @param {Date} value The date to show in the current locale.
   * @param {object} options Additional date formatting settings.
   * @returns {string} the formatted date.
   */
  formatDate(value, options) {
    const usedOptions = options;
    const usedLocale = usedOptions?.locale || this.locale.name;
    let sourceDate = value;

    this.dateFormatter = new Intl.DateTimeFormat(
      usedLocale,
      usedOptions
    );

    // Validation
    if (/^0*$/.test(value)) {
      return '';
    }
    if (typeof value === 'string') {
      sourceDate = this.parseDate(sourceDate, options);
    }

    // Use 4 digit year
    // eslint-disable-next-line no-shadow
    let formattedDate = this.dateFormatter.formatToParts(sourceDate).map(({ type, value }) => {
      switch (type) {
      case 'year': return `${this.twoToFourDigitYear(value)}`;
      default: return value;
      }
    }).join('');

    if (!options || options?.dateStyle === 'short' || options?.year === 'numeric') {
      formattedDate = formattedDate.replace(', ', ' ');
    }
    return formattedDate;
  }

  /**
   * Convert the two digit year year to the correct four digit year.
   * @param  {number} twoDigitYear The two digit year.
   * @returns {number} Converted 3 digit year.
   */
  twoToFourDigitYear(twoDigitYear) {
    if (twoDigitYear.length === 2) {
      return parseInt((twoDigitYear > 39 ? '19' : '20') + twoDigitYear, 10);
    }
    if (twoDigitYear.length === 3) {
      return parseInt((twoDigitYear.substr(1, 3) > 39 ? '19' : '20') + twoDigitYear.substr(1, 3), 10);
    }
    return twoDigitYear;
  }

  /**
   * Formats a number into the locale hour format
   * @param {number} hour The hours to show in the current locale
   * @param {object} options Additional date formatting settings
   * @returns {string} the hours in either 24 h or 12 h format
   */
  formatHour(hour, options) {
    let timeSeparator = this.calendar(options?.locale || this.locale.name).dateFormat.timeSeparator;
    if (typeof hour === 'string' && hour.indexOf(timeSeparator) === -1) {
      timeSeparator = ':';
    }

    const date = new Date();
    if (typeof hour === 'number') {
      const split = hour.toString().split('.');
      date.setHours(split[0]);
      date.setMinutes(split[1] ? (parseFloat(`0.${split[1]}`) * 60) : 0);
    } else {
      const parts = hour.split(timeSeparator);
      date.setHours(parts[0]);
      date.setMinutes(parts[1] || 0);
    }
    return this.formatDate(date, { hour: 'numeric', minute: 'numeric' });
  }

  /**
   * Formats a number into the locales hour format.
   * @param {number} startHour The hours to show in the current locale.
   * @param {number} endHour The hours to show in the current locale.
   * @param {object} options Additional date formatting settings.
   * @returns {string} the hours in either 24 h or 12 h format
   */
  formatHourRange(startHour, endHour, options) {
    const dayPeriods = this.calendar(options?.locale || this.locale.name).dayPeriods;
    let removePeriod = false;
    let range = `${this.formatHour(startHour, options)} - ${this.formatHour(endHour, options)}`;

    if (range.indexOf(':00 AM -') > -1 || range.indexOf(':00 PM -') > -1) {
      removePeriod = true;
    }

    if (range.split(dayPeriods[0]).length - 1 > 1) {
      range = range.replace(dayPeriods[0], '');
    }

    if (range.split(dayPeriods[1]).length - 1 > 1) {
      range = range.replace(` ${dayPeriods[1]}`, '');
    }

    range = range.replace('  ', ' ');
    if (removePeriod) {
      range = range.replace(':00 -', ' -');
    }
    return range;
  }

  /**
   * Returns whether or not the default calendar is islamic
   * @param {string} locale The locale to check if not the current
   * @returns {boolean} True if this locale uses islamic as the primary calendar
   */
  isIslamic(locale) {
    const testLocale = locale || this.locale.name;
    return testLocale === 'ar-SA';
  }

  /**
   * Describes whether or not this locale is one that is read in "right-to-left" fashion
   * @param {string} language The language to check if not the current
   * @returns {boolean} Whether or not this locale is "right-to-left"
   */
  isRTL(language) {
    const lang = this.#correctLanguage(language || this.language.name);
    return lang === 'ar' || lang === 'hi';
  }

  /**
   * Takes a formatted date string and parses back it into a date object
   * @param {string} dateString  The string to parse in the current format
   * @param {string|object} options  Additional options like locale and dateFormat
   * @returns {Date | Array | undefined} The date object it could calculate from the string
   */
  parseDate(dateString, options) {
    const localeData = this.loadedLocales.get(options?.locale || this.locale.name);
    let sourceFormat = options?.dateFormat || localeData.calendars[0]?.dateFormat.datetime;
    sourceFormat = sourceFormat.replace('. ', '.').replace('. ', '.');
    dateString = dateString.replace('. ', '.').replace('. ', '.');

    // ISO Date String
    if (dateString.indexOf('T') > -1 && dateString.substr(dateString.length - 1) === 'Z') {
      return new Date(dateString);
    }

    // Validation
    if (/^0*$/.test(dateString)) {
      return undefined;
    }

    // Remove AM/PM
    const separator = this.#determineSeparator(sourceFormat);
    const dayPeriods = localeData.calendars[0].dayPeriods;
    const is12Hr = dateString.indexOf(dayPeriods[0]) > -1 || dateString.indexOf(dayPeriods[1]) > -1;
    const isAM = dateString.indexOf(dayPeriods[0]) > -1;
    if (is12Hr) {
      dateString = dateString.replace(`${dayPeriods[0]} `, '');
      dateString = dateString.replace(`${dayPeriods[1]} `, '');
      dateString = dateString.replace(`${dayPeriods[0]}`, '');
      dateString = dateString.replace(`${dayPeriods[1]}`, '');
    }

    // Parse the date
    const dateComponents = dateString.split(' ');
    const datePieces = dateComponents[0].split(separator);

    // Parse the time part
    let timePieces = dateComponents[1] ? dateComponents[1].split(':') : [0, 0, 0, 0];
    if (dateComponents[1] && dateComponents[1].indexOf('.') > -1) {
      timePieces = dateComponents[1].split('.');
    }
    const formatComponents = sourceFormat.split(' ');
    const formatPieces = formatComponents[0].split(separator);

    const month = this.#determineDatePart(formatPieces, datePieces, 'M', 'MM', 'MMM', 'MMMM');
    const year = this.#determineDatePart(formatPieces, datePieces, 'y', 'yy', 'yyyy');
    const day = this.#determineDatePart(formatPieces, datePieces, 'd', 'dd', 'dddd');

    // Adjust for AM / PM
    if (is12Hr && !isAM && Number(timePieces[0]) !== 12) {
      timePieces[0] = Number(timePieces[0]) + 12;
    }
    if (is12Hr && isAM && Number(timePieces[0]) === 12) {
      timePieces[0] = 0;
    }
    if (is12Hr && !isAM && Number(timePieces[0]) === 12) {
      timePieces[0] = 12;
    }

    // Return arrays for arabic dates
    if (this.isIslamic()) {
      return [
        Number(this.twoToFourDigitYear(year)),
        (month - 1),
        Number(day),
        Number(timePieces && timePieces[0] ? timePieces[0] : 0),
        Number(timePieces && timePieces[1] ? timePieces[1] : 0),
        Number(timePieces && timePieces[2] ? timePieces[2] : 0)
      ];
    }

    return (new Date(
      this.twoToFourDigitYear(year),
      (month - 1),
      day,
      (timePieces && timePieces[0] ? timePieces[0] : 0),
      (timePieces && timePieces[1] ? timePieces[1] : 0),
      (timePieces && timePieces[2] ? timePieces[2] : 0),
    ));
  }

  /**
   * Figure out what seperator is used.
   * @param {string} dateFormat The source format to check
   * @returns {string} The format used.
   */
  #determineSeparator(dateFormat) {
    if (dateFormat.indexOf('/') > -1) {
      return '/';
    }
    if (dateFormat.indexOf('-') > -1) {
      return '-';
    }
    if (dateFormat.indexOf('. ') > -1) {
      return '.';
    }
    if (dateFormat.indexOf('.') > -1) {
      return '.';
    }
    return '';
  }

  /**
   * Format out the date into parts.
   * @private
   * @param  {Array} formatParts An array of the format bits.
   * @param  {Array} dateStringParts An array of the date parts.
   * @param  {string} filter1 The first option to filter.
   * @param  {string} filter2 The second option to filter.
   * @param  {string} filter3 The third option to filter.
   * @param  {string} filter4 The fourth option to filter.
   * @param  {string} filter5 The fifth option to filter.
   * @returns {string} The filtered out date part.
   */
  #determineDatePart(formatParts, dateStringParts, filter1, filter2, filter3, filter4, filter5) {
    let ret = 0;
    for (let i = 0; i < dateStringParts.length; i++) {
      if (filter1 === formatParts[i]
          || filter2 === formatParts[i]
          || filter3 === formatParts[i]
          || filter4 === formatParts[i]
          || filter5 === formatParts[i]) {
        ret = dateStringParts[i];
      }
    }
    return ret;
  }

  /**
   * Shortcut function to get the default or any calendar
   * @param {string} locale The locale to use
   * @param {string} name the name of the calendar (fx: "gregorian", "islamic-umalqura")
   * @returns {object} containing calendar data
   */
  calendar(locale, name) {
    const localeData = this.loadedLocales.get(locale || this.locale.name);
    const calendars = localeData?.calendars;
    if (name && calendars) {
      for (let i = 0; i < calendars.length; i++) {
        const cal = calendars[i];
        if (cal.name === name) {
          return cal;
        }
      }
    }
    return calendars[0];
  }
}

export default IdsLocale;
