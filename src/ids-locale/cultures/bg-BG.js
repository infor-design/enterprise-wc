// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // https://blazingbulgaria.wordpress.com/2012/06/15/time-in-bulgarian/
  // layout/language
  language: 'bg',
  englishName: 'Bulgarian (Bulgaria)',
  nativeName: 'български (България)',
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
      medium: 'd.MM.yyyy г.',
      long: 'd MMMM yyyy г.',
      full: 'EEEEE, d MMMM yyyy г.',
      month: 'd MMMM',
      year: 'MMMM yyyy г.',
      dayOfWeek: 'EEE d',
      timestamp: 'H:mm:ss',
      timestampMillis: 'H:mm:ss.SSS',
      hour: 'H:mm',
      datetime: 'd.MM.yyyy H:mm',
      datetimeMillis: 'd.MM.yyyy H:mm:ss.SSS',
      timezone: 'd.MM.yyyy H:mm zz',
      timezoneLong: 'd.MM.yyyy H:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'],
      abbreviated: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
      narrow: ['н', 'п', 'в', 'с', 'ч', 'п', 'с']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'],
      abbreviated: ['ян', 'февр', 'март', 'апр', 'май', 'юни', 'юли', 'авг', 'септ', 'окт', 'ноем', 'дек']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'H:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['пр.об', 'сл.об'],
    firstDayofWeek: 1 // Starts on Mon
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'лв',
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
