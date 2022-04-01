// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'it',
  englishName: 'Italian (Italy)',
  nativeName: 'italiano (Italia)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'dd/MM/yyyy', // use four digit year
      medium: 'd MMM y',
      long: 'dd MMMM yyyy',
      full: 'EEEE d MMMM yyyy',
      month: 'dd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'HH:mm:ss',
      timestampMillis: 'HH:mm:ss.SSS',
      hour: 'HH:mm',
      datetime: 'dd/MM/yyyy HH:mm',
      datetimeMillis: 'dd/MM/yyyy HH:mm:ss.SSS',
      timezone: 'dd/MM/yyyy HH:mm zz',
      timezoneLong: 'dd/MM/yyyy HH:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
      abbreviated: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
      narrow: ['D', 'L', 'M', 'M', 'G', 'V', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
      abbreviated: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM'],
    firstDayofWeek: 1 // Starts on Mon
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '€',
  currencyFormat: '### ¤',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '###%',
    percentSuffix: '%',
    percentPrefix: '',
    minusSign: '-',
    decimal: ',',
    group: '.',
    groupSizes: [3, 3]
  }
};

export { locale };
