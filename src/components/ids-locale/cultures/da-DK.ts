// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'da',
  englishName: 'Danish (Denmark)',
  nativeName: 'dansk (Danmark)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: '.',
      short: 'dd-MM-yyyy', // use four digit year - this was suggested by Danish user so not using CLDR
      medium: 'd. MMM yyyy',
      long: 'd. MMMM yyyy',
      full: 'EEEE den d. MMMM yyyy',
      month: 'd. MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'HH.mm.ss',
      timestampMillis: 'HH.mm.ss.SSS',
      hour: 'HH.mm',
      datetime: 'dd-MM-yyyy HH.mm',
      datetimeMillis: 'dd-MM-yyyy HH.mm.ss.SSS',
      timezone: 'dd-MM-yyyy HH.mm zz',
      timezoneLong: 'dd-MM-yyyy HH.mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated
    // standalone abbreviated (3 digit mostly)
    days: {
      wide: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
      abbreviated: ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'],
      narrow: ['S', 'M', 'T', 'O', 'T', 'F', 'L']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
      abbreviated: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH.mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['', ''],
    firstDayofWeek: 1 // Starts on Mon
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'kr',
  currencyFormat: '### ¤',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '### %',
    percentSuffix: ' %',
    percentPrefix: '',
    minusSign: '-',
    decimal: ',',
    group: '.',
    groupSizes: [3, 3]
  }
};

export { locale };
