// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'nl',
  englishName: 'Dutch (Netherlands)',
  nativeName: 'Nederlands (Nederland)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '-', // Infered
      timeSeparator: ':',
      short: 'dd-MM-yyyy', // use four digit year
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'EEEE d MMMM yyyy',
      month: 'dd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'HH:mm:ss',
      timestampMillis: 'HH:mm:ss.SSS',
      hour: 'HH:mm',
      datetime: 'dd-MM-yyyy HH:mm',
      datetimeMillis: 'dd-MM-yyyy HH:mm:ss.SSS',
      timezone: 'dd-MM-yyyy HH:mm zz',
      timezoneLong: 'dd-MM-yyyy HH:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
      abbreviated: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
      narrow: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
      abbreviated: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM'],
    firstDayofWeek: 1 // Starts on Monday
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '€',
  currencyFormat: '¤ ###',
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
