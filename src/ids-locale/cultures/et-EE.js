// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'et',
  englishName: 'Estonian (Estonia)',
  nativeName: 'eesti (Eesti)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '.', // Infered
      timeSeparator: ':',
      short: 'dd.MM.yyyy', // use four digit year
      medium: 'd. MMM y',
      long: 'd. MMMM yyyy',
      full: 'EEEE, d. MMMM y',
      month: 'd. MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'HH:mm:ss',
      timestampMillis: 'HH:mm:ss.SSS',
      hour: 'HH:mm',
      datetime: 'dd.MM.yyyy HH:mm',
      datetimeMillis: 'dd.MM.yyyy HH:mm:ss.SSS',
      timezone: 'dd.MM.yyyy HH:mm zz',
      timezoneLong: 'dd.MM.yyyy HH:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'],
      abbreviated: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
      narrow: ['P', 'E', 'T', 'K', 'N', 'R', 'L']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
      abbreviated: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'au', 'sept', 'okt', 'nov', 'dets']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['e.k.', 'p.k.'],
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
    group: ' ',
    groupSizes: [3, 3]
  }
};

export { locale };
