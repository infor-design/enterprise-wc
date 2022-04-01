// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'en',
  englishName: 'English (United States)',
  nativeName: 'English (United States)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'M/d/yyyy', // use four digit year
      medium: 'MMM d, yyyy',
      long: 'MMMM d, yyyy',
      full: 'EEEE, MMMM d, y',
      month: 'MMMM d',
      year: 'MMMM yyyy',
      dayOfWeek: 'd EEE',
      timestamp: 'h:mm:ss a',
      timestampMillis: 'h:mm:ss:SSS a',
      hour: 'h:mm a',
      datetime: 'M/d/yyyy h:mm a',
      datetimeMillis: 'M/d/yyyy h:mm:ss:SSS a',
      timezone: 'M/d/yyyy h:mm a zz',
      timezoneLong: 'M/d/yyyy h:mm a zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'h:mm a',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM'],
    firstDayofWeek: 0 // Starts on Sunday
  }],

  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '$', // (Replace Sign http://www.currencysymbols.in)
  currencyFormat: '¤###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '### %',
    percentSuffix: ' %',
    percentPrefix: '',
    minusSign: '-',
    decimal: '.',
    group: ',',
    groupSizes: [3, 3]
  }
};

export { locale };
