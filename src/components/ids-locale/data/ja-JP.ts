// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'ja',
  englishName: 'Japanese (Japan)',
  nativeName: '日本語 (日本)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'yyyy/MM/dd', // use four digit year
      medium: 'yyyy/MM/dd',
      long: 'yyyy年 M月 d日',
      full: 'yyyy年 M月 d日 EEEE',
      month: 'M月 d日',
      year: 'yyyy年 M月',
      dayOfWeek: 'd日 EEE',
      timestamp: 'H:mm:ss',
      timestampMillis: 'H:mm:ss.SSS',
      hour: 'H:mm',
      datetime: 'yyyy/MM/dd H:mm',
      datetimeMillis: 'yyyy/MM/dd H:mm:ss.SSS',
      timezone: 'yyyy/MM/dd H:mm zz',
      timezoneLong: 'yyyy/MM/dd H:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      abbreviated: ['日', '月', '火', '水', '木', '金', '土'],
      narrow: ['日', '月', '火', '水', '木', '金', '土']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      abbreviated: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'H:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['午前', '午後'],
    firstDayofWeek: 0 // Starts on Sun
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '¥',
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
