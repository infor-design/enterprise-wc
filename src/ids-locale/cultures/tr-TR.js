// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'tr',
  englishName: 'Turkish (Turkey)',
  nativeName: 'Türkçe (Türkiye)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '.', // Infered
      timeSeparator: ':',
      short: 'd.MM.yyyy', // use four digit year
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'd MMMM yyyy EEEE',
      month: 'd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'd EEE',
      timestamp: 'HH:mm:ss',
      timestampMillis: 'HH:mm:ss.SSS',
      hour: 'HH:mm',
      datetime: 'd.MM.yyyy HH:mm',
      datetimeMillis: 'd.MM.yyyy HH:mm:ss.SSS',
      timezone: 'd.MM.yyyy HH:mm zz',
      timezoneLong: 'd.MM.yyyy HH:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      abbreviated: ['Par', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
      narrow: ['P', 'P', 'S', 'Ç', 'P', 'C', 'C']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      abbreviated: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['ÖÖ', 'ÖS'],
    firstDayofWeek: 1 // Starts on Mon
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '₤',
  currencyFormat: '### ¤',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '%###',
    percentSuffix: '',
    percentPrefix: '%',
    minusSign: '-',
    decimal: ',',
    group: '.',
    groupSizes: [3, 3]
  },
  /**
   * Turkish-specific rules for changing a string to uppercase
   * @param {string} str starting text string
   * @returns {string} the fixed string
   */
  toUpperCase: function(str) { // eslint-disable-line
    return str.replace(/ğ/g, 'Ğ')
      .replace(/ü/g, 'Ü')
      .replace(/ş/g, 'Ş')
      .replace(/ı/g, 'I')
      .replace(/i/g, 'İ')
      .replace(/ö/g, 'Ö')
      .replace(/ç/g, 'Ç')
      .toUpperCase();
  },

  /**
   * Turkish-specific rules for changing a string to lowercase
   * @param {string} str starting text string
   * @returns {string} the fixed string
   */
  toLowerCase: function(str) { // eslint-disable-line
    return str.replace(/Ğ/g, 'ğ')
      .replace(/Ü/g, 'ü')
      .replace(/Ş/g, 'ş')
      .replace(/I/g, 'ı')
      .replace(/İ/g, 'i')
      .replace(/Ö/g, 'ö')
      .replace(/Ç/g, 'ç')
      .toLowerCase();
  }
};

export { locale };
