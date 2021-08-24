// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'zh',
  englishName: 'Chinese (Traditional, Taiwan)',
  nativeName: '中文(台灣)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'yyyy/M/d', // use four digit year
      medium: 'y年M月d日',
      long: 'yyyy年M月d日',
      full: 'yyyy年M月d日 EEEE',
      month: 'M月d日',
      year: 'yyyy年 M月',
      dayOfWeek: 'd日 EEE',
      timestamp: 'ah:mm:ss',
      timestampMillis: 'ah:mm:ss.SSS',
      hour: 'ah:mm',
      datetime: 'yyyy/M/d ah:mm',
      datetimeMillis: 'yyyy/M/d ah:mm:ss.SSS',
      timezone: 'yyyy/M/d ah:mm zz',
      timezoneLong: 'yyyy/M/d ah:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      abbreviated: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
      narrow: ['日', '一', '二', '三', '四', '五', '六']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      abbreviated: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'ah:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['上午', '下午'],
    firstDayofWeek: 1 // Starts on Mon
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'NT$',
  currencyFormat: '¤ ###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '###%',
    percentSuffix: '%',
    percentPrefix: '',
    minusSign: '-',
    decimal: '.',
    group: ',',
    groupSizes: [3, 3]
  }
};

export { locale };
