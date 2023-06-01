import { isValidDate, gregorianToUmalqura } from '../../utils/ids-date-utils/ids-date-utils';
import { locale as localeEn } from './data/en-US';
import { messages as messagesEn } from './data/en-messages';
import IdsLocaleData from './ids-locale-data';

/**
 * A mixin that adds locale functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
class IdsLocale {
  // State object
  state?: any;

  // Holds a single instance of Intl
  dateFormatter?: Intl.DateTimeFormat;

  constructor() {
    IdsLocaleData.loadedLocales.set('en-US', localeEn);
    IdsLocaleData.loadedLanguages.set('en', messagesEn);

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
    this.state.defaultLocale.localeOptions = IdsLocaleData.loadedLocales.get(defaultLocale);
  }

  /**
   * Load a locale or message file
   * @private
   * @param {string} value The script file name
   * @returns {Promise} A promise that will resolve when complete
   */
  loadLanguageScript(value: string) {
    const promise = import(/* webpackIgnore: true */`../locale-data/${value}-messages.js`);
    promise.then((module) => {
      // do something with the translations
      IdsLocaleData.loadedLanguages.set(value, module.messages);
    });
    return promise;
  }

  /**
   * Sets the dir (direction) tag on an element
   * @param {HTMLElement} elem The element to set it on.
   * @param {string} value The value to check
   */
  updateDirectionAttribute(elem: HTMLElement, value: string) {
    if (this.isRTL(value)) {
      elem.setAttribute('dir', 'rtl');
      return;
    }
    elem.removeAttribute('dir');
  }

  /**
   * Sets the lang (langauge) tag on an element
   * @param {HTMLElement} elem The element to set it on.
   * @param {string} value The value to check
   */
  setDocumentLangAttribute(elem: HTMLElement, value: string) {
    if (value) {
      document?.querySelector('html')?.setAttribute('lang', value);
      return;
    }
    document?.querySelector('html')?.removeAttribute('lang');
  }

  /** Reset the language attribute to clean up */
  removeLangAttribute() {
    document?.querySelector('html')?.removeAttribute('lang');
  }

  /**
   * Set the language for a component
   * @param {string} value The language string value
   */
  set language(value: string | any) {
    const lang = this.correctLanguage(value);
    if (value && lang !== this.state.language) {
      this.setLanguage(lang);
    }
  }

  /**
   * Get the language data
   * @returns {object} The language data
   */
  get language(): any {
    return {
      name: this.state.language,
      messages: IdsLocaleData.loadedLanguages.get(this.state.language) || {}
    };
  }

  /**
   * Set the language for a component and wait for it to finish (async)
   * @param {string} value The language string value
   */
  async setLanguage(value: string) {
    const lang = this.correctLanguage(value);
    if (this.state.language !== lang) {
      this.state.language = lang;
    }

    if (this.state.language === lang && IdsLocaleData.loadedLanguages.get(this.state.language)) {
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
  correctLanguage(value: string) {
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
  translate(key: string, options: any = { showAsUndefined: false, showBrackets: true }) {
    if (key === '&nsbp;') {
      return '';
    }

    if (!options?.showAsUndefined && options?.showBrackets === undefined) {
      options.showBrackets = true;
    }

    let messages = this.language.messages;
    if (options?.language) {
      messages = IdsLocaleData.loadedLanguages.get(options?.language) || messages;
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
   * @param {object} messages Strings in the form of
   */
  extendTranslations(lang: string, messages: any) {
    if (!IdsLocaleData.loadedLanguages.has(lang)) {
      return;
    }

    const base = IdsLocaleData.loadedLanguages.get(lang);
    Object.keys(messages).forEach((key) => {
      base[key] = messages[key];
    });
    IdsLocaleData.loadedLanguages.set(lang, base);
  }

  /**
   * Load a locale file
   * @private
   * @param {string} value The script file name
   * @returns {Promise} A promise that will resolve when complete
   */
  loadLocaleScript(value: string) {
    const promise = import(/* webpackIgnore: true */`../locale-data/${value}.js`);
    promise.then((module) => {
      // do something with the locale data
      IdsLocaleData.loadedLocales.set(value, module.locale);
    });
    return promise;
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value: string) {
    const locale = this.#correctLocale(value);
    if (value && locale !== this.state.localeName) {
      this.setLocale(locale);
    }
  }

  /**
   * Get the locale data
   * @returns {object} The language data
   */
  get locale(): any {
    return {
      name: this.state.localeName,
      options: IdsLocaleData.loadedLocales.get(this.state.localeName) || {}
    };
  }

  /**
   * Set the locale for a component and wait for it to finish (async)
   * @param {string} value The locale string value
   */
  async setLocale(value: string | null | undefined) {
    if (!value) {
      return;
    }

    const locale = this.#correctLocale(value);
    if (this.state.localeName !== locale) {
      this.state.localeName = locale;
      this.setLanguage(locale);
    }

    if (this.state.localeName === locale && IdsLocaleData.loadedLocales.get(this.state.localeName)) {
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
  #correctLocale(value: string) {
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
  formatNumber(value: any, options?: any): string {
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
  parseNumber(input: string, options?: any): number | string {
    const localeData = IdsLocaleData.loadedLocales.get(options?.locale || this.locale.name);
    const numSettings = localeData.numbers;
    let numString: string | number = input;

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
   * @param {string} string The string number in arabic/chinese or hindi
   * @returns {number} The english number.
   */
  convertNumberToEnglish(string: string): number {
    const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const devanagari = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']; // Hindi
    const chineseFinancialTraditional = ['零', '壹', '貳', '叄', '肆', '伍', '陸', '柒', '捌', '玖'];
    const chineseFinancialSimplified = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const chinese = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    for (let i: any = 0; i <= 9; i++) {
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
  formatDate(value: any, options?: any): string {
    const usedOptions = options;
    const usedLocale = usedOptions?.locale || this.locale.name;

    // Formatting by pattern
    if (options?.pattern && value instanceof Date) {
      const calendar = this.calendar(usedLocale);

      let year: number = value.getFullYear();
      let month: number = value.getMonth();
      let day: number = value.getDate();

      if (calendar.name === 'islamic-umalqura') {
        const umalquraParts = gregorianToUmalqura(value);

        year = umalquraParts?.year;
        month = umalquraParts?.month;
        day = umalquraParts?.day;
      }

      const dayOfWeek: number = value.getDay();
      const hours: number = value.getHours();
      const mins: number = value.getMinutes();
      const seconds: number = value.getSeconds();
      const millis: number = value.getMilliseconds();
      const pattern = options.pattern;
      let result = '';

      result = pattern
        .replace('de', 'nnnnn')
        .replace('ngày', 'nnnn')
        .replace('tháng', 't1áng')
        .replace('den', 'nnn')
        // Days
        .replace('dd', `${day}`.padStart(2, '0'))
        .replace('d', day)
        // Years
        .replace('yyyy', year)
        .replace('yy', year.toString().substring(4, 2))
        .replace('y', year);

      // Time
      const showDayPeriods = pattern.indexOf(' a') > -1 || pattern.indexOf('a') === 0;

      if (showDayPeriods && hours === 0) {
        result = result.replace('hh', '12');
        result = result.replace('h', '12');
      }

      result = result.replace('hh', (hours > 12
        ? `${hours - 12}`.padStart(2, '0')
        : `${hours}`.padStart(2, '0')))
        .replace('h', hours > 12 ? `${hours - 12}` : `${hours}`)
        .replace('HH', `${hours}`.padStart(2, '0'))
        .replace('H', `${hours}`)
        .replace('mm', `${mins}`.padStart(2, '0'))
        .replace('ss', `${seconds}`.padStart(2, '0'))
        .replace('SSS', `${millis}`.padStart(3, '0'));

      // Months
      if (pattern.includes('MMM')) {
        result = result.replace('MMMM', calendar?.months.wide[month] || `${month + 1}`.padStart(2, '0'))
          .replace('MMM', calendar?.months.abbreviated[month] || `${month + 1}`.padStart(2, '0'));
      } else {
        result = result.replace('MM', `${month + 1}`.padStart(2, '0'))
          .replace('M', `${month + 1}`);
      }

      // AM/PM
      if (showDayPeriods && calendar) {
        result = result.replace(' a', ` ${hours >= 12 ? calendar.dayPeriods[1] : calendar.dayPeriods[0]}`);
        if (pattern.indexOf('a') === 0) {
          result = result.replace('a', ` ${hours >= 12 ? calendar.dayPeriods[1] : calendar.dayPeriods[0]}`);
        }
      }

      // Day of Week
      if (calendar) {
        result = result.replace('EEEE', calendar.days.wide[dayOfWeek])
          .replace('EEE', calendar.days.abbreviated[dayOfWeek])
          .replace('EE', calendar.days.narrow[dayOfWeek]);
      }

      result = result.replace('nnnnn', 'de')
        .replace('nnnn', 'ngày')
        .replace('t1áng', 'tháng')
        .replace('nnn', 'den');

      return result.replace(/&lrm;|\u200E/gi, ' ').trim();
    }

    // Formatting by locale
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
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let formattedDate = this.dateFormatter.formatToParts(sourceDate).map(({ type, value }) => {
      switch (type) {
        case 'year': return usedOptions?.year === '2-digit' ? value : `${this.twoToFourDigitYear(value)}`;
        default: return value;
      }
    }).join('');

    if (!options || options?.dateStyle === 'short' || options?.year === 'numeric') {
      formattedDate = formattedDate.replace(', ', ' ');
    }

    // eslint-disable-next-line no-irregular-whitespace
    formattedDate = formattedDate.replace(/ /g, ' '); // remove irregular space
    return formattedDate;
  }

  /**
   * Convert the two digit year year to the correct four digit year.
   * @param {number} twoDigitYear The two digit year.
   * @returns {number} Converted 3 digit year.
   */
  twoToFourDigitYear(twoDigitYear: any) {
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
  formatHour(hour: any, options?: any) {
    let timeSeparator = this.calendar(options?.locale || this.locale.name).dateFormat.timeSeparator;
    if (typeof hour === 'string' && hour.indexOf(timeSeparator) === -1) {
      timeSeparator = ':';
    }

    const date = new Date();
    if (typeof hour === 'number') {
      const split = hour.toString().split('.');
      date.setHours(parseInt(split[0]));
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
  formatHourRange(startHour: number, endHour: number, options: any): string {
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
    range = range.replace(' ', ' ');
    range = range.replace(' ', ' ');
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
  isIslamic(locale?: string): boolean {
    const testLocale = locale || this.locale.name;
    return testLocale === 'ar-SA';
  }

  /**
   * Describes whether or not this locale is one that is read in "right-to-left" fashion
   * @param {string} language The language to check if not the current
   * @returns {boolean} Whether or not this locale is "right-to-left"
   */
  isRTL(language?: string) {
    const lang = this.correctLanguage(language || this.language.name);
    return lang === 'ar' || lang === 'he';
  }

  /**
   * Get the timezone part of a date
   * @param {Date} date The date object to use.
   * @param {string} timeZoneName Can be short or long.
   * @returns {string} The time zone as a string.
   */
  #getTimeZone(date: Date, timeZoneName: string): string {
    const currentLocale = this.locale.name || 'en-US';

    const short = date.toLocaleDateString(currentLocale);
    const full = date.toLocaleDateString(currentLocale, { timeZoneName: timeZoneName === 'long' ? 'long' : 'short' });

    // Trying to remove date from the string in a locale-agnostic way
    const shortIndex = full.indexOf(short);
    if (shortIndex >= 0) {
      const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);

      // by this time `trimmed` should be the timezone's name with some punctuation -
      // trim it from both sides
      return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
    }

    return full;
  }

  /**
   * Takes a formatted date string and parses back it into a date object
   * @param {string} dateString The string to parse in the current format
   * @param {string|object} options Additional options like locale and dateFormat
   * @param {boolean} isStrict If true missing date parts will be considered invalid. If false the current month/day.
   * @returns {Date | Array | undefined} The date object it could calculate from the string
   */
  parseDate(dateString: string, options?: any, isStrict?: boolean) {
    type DateObj = {
      day?: number | string,
      month?: number | string,
      year?: any,
      h?: number | string,
      ss?: number | string,
      ms?: number | string,
      mm?: number | string,
      a?: string,
      isUndefindedDay?: boolean,
      isUndefinedYear?: boolean,
      isUndefinedMonth?: boolean,
      leapYear?: boolean,
      return?: Date | undefined,
    };

    if (!dateString) {
      return undefined;
    }

    // ISO Date String
    if (dateString.indexOf('T') > -1 && dateString.substr(dateString.length - 1) === 'Z') {
      return new Date(dateString);
    }

    let dateFormat = options;
    let locale = this.locale.name;
    let thisLocaleCalendar = this.calendar(locale);
    const dirtyDateString = dateString;

    if (typeof options === 'object') {
      locale = options.locale || locale;
      dateFormat = options.dateFormat || this.calendar(locale).dateFormat[dateFormat.date];
    }

    if (typeof options === 'object' && options.pattern) {
      dateFormat = options.dateFormat || options.pattern;
    }

    if (typeof options === 'object' && options.calendarName && options.locale) {
      thisLocaleCalendar = this.calendar(options.locale);
    }

    if (!dateFormat) {
      dateFormat = this.calendar(locale).dateFormat.short;
    }

    const orgDatestring = dateString;
    if (dateString === '0000' || dateString === '000000' || dateString === '00000000') {
      // Means no date in some applications
      return undefined;
    }

    if (dateFormat.pattern) {
      dateFormat = dateFormat.pattern;
    }

    let formatParts;
    let dateStringParts;
    const dateObj: DateObj = {};
    const isDateTime = (dateFormat.toLowerCase().indexOf('h') > -1);
    const isUTC = (dateString.toLowerCase().indexOf('z') > -1);
    let i;
    let l;
    const ampmHasDot = !!thisLocaleCalendar.dayPeriods.filter((x: string) => x.indexOf('.') > -1).length
      && dateFormat.indexOf('a') > -1
      && dateFormat.indexOf('ah') < 0
      && dateFormat.indexOf('H') < 0;
    const hasDot = (dateFormat.match(/M/g) || []).length === 3
      && thisLocaleCalendar
      && thisLocaleCalendar.months
      && thisLocaleCalendar.months.abbreviated
      && thisLocaleCalendar.months.abbreviated.filter((v: string) => /\./.test(v)).length;

    if (isDateTime) {
      // Remove Timezone
      const shortTimeZone = this.#getTimeZone(new Date(), 'short');
      const longTimeZone = this.#getTimeZone(new Date(), 'long');
      dateString = dateString.replace(` ${shortTimeZone}`, '');
      dateString = dateString.replace(` ${longTimeZone}`, '');
      dateFormat = dateFormat.replace(' zzzz', '').replace(' zz', '');

      // Replace [space & colon & dot] with "/"
      const regex = hasDot ? /[T\s:-]/g : /[T\s:.-]/g;
      dateFormat = dateFormat.replace(regex, '/').replace(/z/i, '');
      dateFormat = ampmHasDot ? dateFormat.replace('//', '/') : dateFormat;
      dateString = dateString.replace(ampmHasDot ? /[T\s:-]/g : regex, '/').replace(/z/i, '');
    }

    // Remove spanish de
    dateFormat = dateFormat.replace(' de ', ' ');
    dateString = dateString.replace(' de ', ' ');

    // Fix ah
    dateFormat = dateFormat.replace('ah', 'a/h');
    dateString = dateString.replace('午', '午/');

    // Remove commas
    dateFormat = dateFormat.replace(',', '');
    dateString = dateString.replace(',', '');

    const getStartIndex = (hasMdyyyy: number, hasdMyyyy: number): number => {
      if (hasMdyyyy > -1) {
        return hasMdyyyy;
      }

      if (hasdMyyyy > -1) {
        return hasdMyyyy;
      }

      return 0;
    };

    // Adjust short dates where no separators or special characters are present.
    const hasMdyyyy = dateFormat.indexOf('Mdyyyy');
    const hasdMyyyy = dateFormat.indexOf('dMyyyy');
    let startIndex = -1;
    let endIndex = -1;
    if (hasMdyyyy > -1 || hasdMyyyy > -1) {
      startIndex = getStartIndex(hasMdyyyy, hasdMyyyy);
      endIndex = startIndex + dateString.indexOf('/') > -1 ? dateString.indexOf('/') : dateString.length;
      dateString = `${dateString.substr(startIndex, endIndex - 4)}/${dateString.substr(endIndex - 4, dateString.length)}`;
      dateString = `${dateString.substr(startIndex, dateString.indexOf('/') / 2)}/${dateString.substr(dateString.indexOf('/') / 2, dateString.length)}`;
    }
    if (hasMdyyyy > -1) {
      dateFormat = dateFormat.replace('Mdyyyy', 'M/d/yyyy');
    }
    if (hasdMyyyy > -1) {
      dateFormat = dateFormat.replace('dMyyyy', 'd/M/yyyy');
    }

    if (dateFormat.indexOf(' ') !== -1) {
      const regex = hasDot ? /[\s:]/g : /[\s:.]/g;
      dateFormat = dateFormat.replace(regex, '/');
      dateString = dateString.replace(regex, '/');
    }

    // Extra Check in case month has spaces
    if (dateFormat.indexOf('MMMM') > -1 && this.isRTL() && dateFormat
      && dateFormat !== 'MMMM/dd' && dateFormat !== 'dd/MMMM') {
      const lastIdx = dateString.lastIndexOf('/');
      dateString = dateString.substr(0, lastIdx - 1).replace('/', ' ') + dateString.substr(lastIdx);
    }

    if (dateFormat.indexOf(' ') === -1 && dateFormat.indexOf('.') === -1 && dateFormat.indexOf('/') === -1 && dateFormat.indexOf('-') === -1) {
      // Remove delimiter for the data string.
      if (dateString.indexOf(' ') !== -1) {
        dateString = dateString.split(' ').join('');
      } else if (dateString.indexOf('.') !== -1) {
        dateString = dateString.split('.').join('');
      } else if (dateString.indexOf('/') !== -1) {
        dateString = dateString.split('/').join('');
      } else if (dateString.indexOf('-') !== -1) {
        dateString = dateString.split('-').join('');
      }

      let lastChar = dateFormat[0];
      let newFormat = '';
      let newDateString = '';

      for (i = 0, l = dateFormat.length; i < l; i++) {
        newDateString += (dateFormat[i] !== lastChar ? `/${dateString[i]}` : dateString[i]);
        newFormat += (dateFormat[i] !== lastChar ? `/${dateFormat[i]}` : dateFormat[i]);

        if (i > 1) {
          lastChar = dateFormat[i];
        }
      }

      dateString = newDateString;
      dateFormat = newFormat;
    }

    formatParts = dateFormat.split('/');
    dateStringParts = dateString.split('/');

    if (formatParts.length === 1) {
      formatParts = dateFormat.split('.');
    }

    if (dateStringParts.length === 1) {
      dateStringParts = dateString.split('.');
    }

    if (formatParts.length === 1) {
      formatParts = dateFormat.split('-');
    }

    if (dateStringParts.length === 1) {
      dateStringParts = dateString.split('-');
    }

    if (formatParts.length === 1) {
      formatParts = dateFormat.split(' ');
    }

    if (dateStringParts.length === 1) {
      dateStringParts = dateString.split(' ');
    }

    // Check the incoming date string's parts to make sure the values are
    // valid against the localized Date pattern.
    const month = this.#determineDatePart(formatParts, dateStringParts, 'M', 'MM', 'MMM', 'MMMM');
    const year = this.#determineDatePart(formatParts, dateStringParts, 'y', 'yy', 'yyyy');
    let hasDays = false;
    let hasDayPeriodsFirst = false;

    for (i = 0, l = dateStringParts.length; i < l; i++) {
      const pattern = `${formatParts[i]}`;
      const value = dateStringParts[i];
      const numberValue: number = parseInt(value, 10);

      if (!hasDays) {
        hasDays = pattern.toLowerCase().indexOf('d') > -1;
      }

      let lastDay;
      let abrMonth;
      let textMonths;

      switch (pattern) {
        case 'd':
          lastDay = new Date((year as any), (month as any), 0).getDate();

          if (numberValue < 1 || numberValue > 31 || numberValue > lastDay) {
            return undefined;
          }
          dateObj.day = value;
          break;
        case 'dd':
          if ((numberValue < 1 || numberValue > 31) || (numberValue < 10 && value.substr(0, 1) !== '0')) {
            return undefined;
          }
          dateObj.day = value;
          break;
        case 'M': {
          if (numberValue < 1 || numberValue > 12) {
            return undefined;
          }
          (dateObj.month as number) = numberValue - 1;
          break;
        }
        case 'MM':
          if ((numberValue < 1 || numberValue > 12) || (numberValue < 10 && value.substr(0, 1) !== '0')) {
            return undefined;
          }
          dateObj.month = numberValue - 1;
          break;
        case 'MMM':
          abrMonth = this.calendar(locale).months.abbreviated;

          for (let len = 0; len < abrMonth.length; len++) {
            if (orgDatestring.indexOf(abrMonth[len]) > -1) {
              dateObj.month = len;
            }
          }

          break;
        case 'MMMM':
          textMonths = this.calendar(locale).months.wide;

          for (let k = 0; k < textMonths.length; k++) {
            if (orgDatestring.indexOf(textMonths[k]) > -1) {
              dateObj.month = k;
            }
          }

          break;
        case 'yy':
          dateObj.year = this.twoToFourDigitYear(value);
          break;
        case 'y':
        case 'yyyy':
          dateObj.year = (value.length === 2)
            ? this.twoToFourDigitYear(value) : value;
          break;
        case 'h':
          if (numberValue < 0 || numberValue > 12) {
            return undefined;
          }
          dateObj.h = hasDayPeriodsFirst ? dateObj.h : value;
          break;
        case 'hh':
          if (numberValue < 0 || numberValue > 12) {
            return undefined;
          }

          // eslint-disable-next-line
          dateObj.h = hasDayPeriodsFirst ? dateObj.h : value.length === 1 ? `0${value}` : value;
          break;
        case 'H':
          if (numberValue < 0 || numberValue > 24) {
            return undefined;
          }
          dateObj.h = hasDayPeriodsFirst ? dateObj.h : value;
          break;
        case 'HH':
          if (numberValue < 0 || numberValue > 24) {
            return undefined;
          }

          // eslint-disable-next-line
          dateObj.h = hasDayPeriodsFirst ? dateObj.h : value.length === 1 ? `0${value}` : value;
          break;
        case 'ss':
          if (numberValue < 0 || numberValue >= 60) {
            if (!options?.strictTime) {
              dateObj.ss = 0;
              break;
            } else {
              return undefined;
            }
          }
          dateObj.ss = value;
          break;
        case 'SSS':
          dateObj.ms = value;
          break;
        case 'mm':
          if (Number.isNaN(numberValue) || numberValue < 0 || numberValue >= 60) {
            if (!options?.strictTime) {
              dateObj.mm = 0;
              break;
            } else {
              return undefined;
            }
          }
          dateObj.mm = value;
          break;
        case 'a': {
          if (!dateObj.h && formatParts[i + 1] && formatParts[i + 1].toLowerCase().substr(0, 1) === 'h') {
            // in a few cases am/pm is before hours
            dateObj.h = dateStringParts[i + 1];
            hasDayPeriodsFirst = true;
          }
          const isAM = dirtyDateString?.toLowerCase()?.includes(thisLocaleCalendar.dayPeriods[0]?.toLowerCase());
          const isPM = dirtyDateString?.toLowerCase()?.includes(thisLocaleCalendar.dayPeriods[1]?.toLowerCase());

          if (!(isAM || isPM) && options?.strictTime) {
            return undefined;
          }

          if (dirtyDateString?.toLowerCase()?.includes(thisLocaleCalendar.dayPeriods[0]?.toLowerCase())) {
            dateObj.a = 'AM';

            if (dateObj.h) {
              if (dateObj.h === 12 || dateObj.h === '12') {
                dateObj.h = 0;
              }
            }
          }

          if (dirtyDateString?.toLowerCase()?.includes(thisLocaleCalendar.dayPeriods[1]?.toLowerCase())) {
            dateObj.a = 'PM';

            if (dateObj.h) {
              if (Number(dateObj.h) < 12) {
                dateObj.h = parseInt(dateObj.h as string, 10) + 12;
              }
            }
          }
          break;
        }
        default:
          break;
      }
    }

    const isLeap = (y: number) => ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
    const closestLeap = (y?: number) => {
      let closestLeapYear = typeof y === 'number' && !Number.isNaN(y) ? y : (new Date()).getFullYear();
      for (let i2 = 0; i2 < 4; i2++) {
        if (isLeap(closestLeapYear)) {
          break;
        }
        closestLeapYear--;
      }
      return closestLeapYear;
    };

    dateObj.return = undefined;
    dateObj.leapYear = isLeap(dateObj.year as number);

    if ((isDateTime && !dateObj.h && !dateObj.mm)) {
      return undefined;
    }

    if (!dateObj.year && dateObj.year !== 0 && !isStrict) {
      dateObj.isUndefinedYear = true;
      for (i = 0, l = formatParts.length; i < l; i++) {
        if (formatParts[i].indexOf('y') > -1 && dateStringParts[i] !== undefined) {
          dateObj.isUndefinedYear = false;
          break;
        }
      }
      if (dateObj.isUndefinedYear) {
        const isFeb29 = parseInt(dateObj.day as string, 10) === 29 && parseInt(dateObj.month as string, 10) === 1;
        dateObj.year = isFeb29 ? closestLeap() : (new Date()).getFullYear();

        if (thisLocaleCalendar.name === 'islamic-umalqura') {
          const umDate = gregorianToUmalqura(new Date(dateObj.year, 0, 1));
          dateObj.year = umDate[0];
        }
      } else {
        delete dateObj.year;
      }
    }

    // Fix incomelete 2 and 3 digit years
    if (dateObj.year && (dateObj.year as string).length === 2) {
      dateObj.year = `20${dateObj.year}`;
    }

    if (dateObj.year === '' || (dateObj.year && !((`${dateObj.year}`).length === 2 || (`${dateObj.year}`).length === 4))) {
      delete dateObj.year;
    }

    if (!dateObj.month && dateObj.month !== 0 && !isStrict) {
      dateObj.isUndefinedMonth = true;
      for (i = 0, l = formatParts.length; i < l; i++) {
        if (formatParts[i].indexOf('M') > -1 && dateStringParts[i] !== undefined) {
          dateObj.isUndefinedMonth = false;
          break;
        }
      }
      if (dateObj.isUndefinedMonth) {
        dateObj.month = (new Date()).getMonth();
      }
    }

    if (!dateObj.day && dateObj.day !== 0 && (!isStrict || !hasDays)) {
      dateObj.isUndefindedDay = true;
      for (i = 0, l = formatParts.length; i < l; i++) {
        if (formatParts[i].indexOf('d') > -1 && dateStringParts[i] !== undefined) {
          dateObj.isUndefindedDay = false;
          break;
        }
      }
      if (dateObj.isUndefindedDay) {
        dateObj.day = 1;
      } else {
        delete dateObj.day;
      }
    }

    if (isDateTime) {
      if (isUTC) {
        if (dateObj.h !== undefined) {
          dateObj.return = new Date(
            Date.UTC(
              dateObj.year as number,
              dateObj.month as number,
              dateObj.day as number,
              dateObj.h as number,
              dateObj.mm as number
            )
          );
        }
        if (dateObj.ss !== undefined) {
          dateObj.return = new Date(
            Date.UTC(
              dateObj.year as number,
              dateObj.month as number,
              dateObj.day as number,
              dateObj.h as number,
              dateObj.mm as number,
              dateObj.ss as number
            )
          );
        }
        if (dateObj.ms !== undefined) {
          dateObj.return = new Date(
            Date.UTC(
              dateObj.year as number,
              dateObj.month as number,
              dateObj.day as number,
              dateObj.h as number,
              dateObj.mm as number,
              dateObj.ss as number,
              dateObj.ms as number
            )
          );
        }
      } else {
        if (dateObj.h !== undefined) {
          dateObj.return = new Date(
            dateObj.year as number,
            dateObj.month as number,
            dateObj.day as number,
            dateObj.h as number,
            dateObj.mm as number
          );
        }
        if (dateObj.ss !== undefined) {
          dateObj.return = new Date(
            dateObj.year as number,
            dateObj.month as number,
            dateObj.day as number,
            dateObj.h as number,
            dateObj.mm as number,
            dateObj.ss as number
          );
        }
        if (dateObj.ms !== undefined) {
          dateObj.return = new Date(
            dateObj.year as number,
            dateObj.month as number,
            dateObj.day as number,
            dateObj.h as number,
            dateObj.mm as number,
            dateObj.ss as number,
            dateObj.ms as number
          );
        }
      }
    } else {
      dateObj.return = new Date(dateObj.year as number, dateObj.month as number, dateObj.day as number);
    }

    if (thisLocaleCalendar.name === 'islamic-umalqura') {
      return [
        parseInt(dateObj.year as string, 10),
        parseInt(dateObj.month as string, 10),
        parseInt(dateObj.day as string, 10),
        parseInt((dateObj.h as string) || '0', 10),
        parseInt(dateObj.mm as string || '0', 10),
        parseInt(dateObj.ss as string || '0', 10),
        parseInt(dateObj.ms as string || '0', 10)
      ];
    }

    return isValidDate(dateObj.return) ? dateObj.return : undefined;
  }

  /**
   * Format out the date into parts.
   * @private
   * @param {Array} formatParts An array of the format bits.
   * @param {Array} dateStringParts An array of the date parts.
   * @param {string} filter1 The first option to filter.
   * @param {string} filter2 The second option to filter.
   * @param {string} filter3 The third option to filter.
   * @param {string} filter4 The fourth option to filter.
   * @param {string} filter5 The fifth option to filter.
   * @returns {string} The filtered out date part.
   */
  #determineDatePart(
    formatParts: Array<any>,
    dateStringParts: Array<any>,
    filter1?: string,
    filter2?: string,
    filter3?: string,
    filter4?: string,
    filter5?: string
  ): string {
    let ret = '';
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
  calendar(locale?: string, name?: string): any {
    const localeData = IdsLocaleData.loadedLocales.get(locale || this.locale.name);
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

  /**
   * Shortcut function to get the current locales numbers
   * @param {string} locale The locale to use
   * @returns {object} containing calendar data for numbers
   */
  numbers(locale?: string): any {
    const localeData = IdsLocaleData.loadedLocales.get(locale || this.locale.name);
    return localeData.numbers;
  }
}

export default IdsLocale;
