// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'sv',
  englishName: 'Swedish (Sweden)',
  nativeName: 'svenska (Sverige)',
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
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'EEEE d MMMM yyyy',
      month: 'd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
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
      wide: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
      abbreviated: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'],
      narrow: ['S', 'M', 'T', 'O', 'T', 'F', 'L']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['fm', 'em'],
    firstDayofWeek: 1 // Starts on Monday
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
