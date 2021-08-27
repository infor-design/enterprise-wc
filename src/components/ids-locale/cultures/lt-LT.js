// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'lt',
  englishName: 'Lithuanian (Lithuania)',
  nativeName: 'lietuvių (Lietuva)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '-', // Infered
      timeSeparator: ':',
      short: 'yyyy-MM-dd', // use four digit year
      medium: 'yyyy-MM-dd',
      long: 'yyyy m. MMMM d',
      full: 'yyyy m. MMMM d, EEEE',
      month: 'MMMM d',
      year: 'yyyy m. MMMM',
      dayOfWeek: 'd EEE',
      timestamp: 'HH:mm:ss',
      timestampMillis: 'HH:mm:ss.SSS',
      hour: 'HH:mm',
      datetime: 'yyyy-MM-dd HH:mm',
      datetimeMillis: 'yyyy-MM-dd HH:mm:ss.SSS',
      timezone: 'yyyy-MM-dd HH:mm zz',
      timezoneLong: 'yyyy-MM-dd HH:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'],
      abbreviated: ['sk', 'pr', 'an', 'tr', 'kt', 'pn', 'št'],
      narrow: ['S', 'P', 'A', 'T', 'K', 'P', 'Š']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['sausis', 'vasaris', 'kovas', 'balandis', 'gegužė', 'birželis', 'liepa', 'rugpjūtis', 'rugsėjis', 'spalis', 'lapkritis', 'gruodis'],
      abbreviated: ['saus.', 'vas.', 'kov.', 'bal.', 'geg.', 'birž.', 'liep.', 'rugp.', 'rugs.', 'spal.', 'lapkr.', 'gruod.']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['pr.p.', 'pop.'],
    firstDayofWeek: 1 // Starts on Monday
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'Lt',
  currencyFormat: '### ¤',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '### %',
    percentSuffix: ' %',
    percentPrefix: '',
    minusSign: '-',
    decimal: ',',
    group: ' ',
    groupSizes: [3, 3]
  }
};

export { locale };
