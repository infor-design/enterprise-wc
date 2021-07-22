// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'ko',
  englishName: 'Korean (Korea)',
  nativeName: '한국어 (대한민국)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '. ', // Infered
      timeSeparator: ':',
      short: 'yyyy-MM-dd', // Uses custom format
      medium: 'yyyy-MM-dd',
      long: 'yyyy년 M월 d일',
      full: 'yyyy년 M월 d일 EEEE',
      month: 'M월 d일',
      year: 'yyyy년 M월',
      dayOfWeek: 'd일 EEE',
      timestamp: 'a h:mm:ss',
      timestampMills: 'a h:mm:ss.SSS',
      hour: 'a h:mm',
      datetime: 'yyyy-MM-dd a h:mm',
      datetimeMills: 'yyyy-MM-dd a h:mm.SSS',
      timezone: 'yyyy-MM-dd a h:mm zz',
      timezoneLong: 'yyyy-MM-dd a h:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      abbreviated: ['일', '월', '화', '수', '목', '금', '토'],
      narrow: ['일', '월', '화', '수', '목', '금', '토']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      abbreviated: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'a h:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['오전', '오후'],
    firstDayofWeek: 0 // Starts on Sun
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '₩',
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
