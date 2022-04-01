// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'af',
  englishName: 'Afrikaans (South Africa)',
  nativeName: 'Afrikaans (Suid Afrika)',
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
      medium: 'dd MMM yyyy',
      long: 'dd MMMM yyyy',
      full: 'EEEE dd MMMM yyyy',
      month: 'dd MMMM',
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
      wide: ['Sondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrydag', 'Saterdag'],
      abbreviated: ['So', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Sa'],
      narrow: ['S', 'M', 'D', 'W', 'D', 'V', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['Januarie', 'Februarie', 'Maart', 'April', 'Mei', 'Junie', 'Julie', 'Augustus', 'September', 'Oktober', 'November', 'Desember'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['vm.', 'nm.'],
    firstDayofWeek: 0 // Starts on Sunday
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'S',
  currencyFormat: '¤###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '###%',
    percentSuffix: '%',
    percentPrefix: '',
    minusSign: '-',
    decimal: '٫',
    group: ' ',
    groupSizes: [3, 3]
  }
};

export { locale };
