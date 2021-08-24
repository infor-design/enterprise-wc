// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'hu',
  englishName: 'Hungarian (Hungary)',
  nativeName: 'magyar (Magyarország)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '. ', // Infered
      timeSeparator: ':',
      short: 'yyyy. MM. dd.', // use four digit year
      medium: 'yyyy. MMM d.',
      long: 'yyyy. MMMM d.',
      full: 'yyyy. MMMM d., EEEE',
      month: 'MMMM d.',
      year: 'yyyy. MMMM',
      dayOfWeek: 'd EEE',
      timestamp: 'H:mm:ss',
      timestampMillis: 'H:mm:ss.SSS',
      hour: 'H:mm',
      datetime: 'yyyy. MM. dd. H:mm',
      datetimeMillis: 'yyyy. MM. dd. H:mm:ss.SSS',
      timezone: 'yyyy. MM. dd. H:mm zz',
      timezoneLong: 'yyyy. MM. dd. H:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'],
      abbreviated: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
      narrow: ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Sz']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'],
      abbreviated: ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'H:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['de.', 'du.'],
    firstDayofWeek: 1 // Starts on Mon
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'Ft',
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
