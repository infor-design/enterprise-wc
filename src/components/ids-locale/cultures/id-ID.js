// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'id',
  englishName: 'Indonesian (Indonesia)',
  nativeName: 'Bahasa Indonesia (Indonesia)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: '.',
      short: 'dd/MM/yyyy', // use four digit year
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'EEEE, dd MMMM yyyy',
      month: 'd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'HH:mm:ss',
      timestampMillis: 'HH:mm:ss.SSS',
      hour: 'HH:mm',
      datetime: 'dd/MM/yyyy HH.mm',
      datetimeMillis: 'dd/MM/yyyy HH:mm:ss.SSS',
      timezone: 'dd/MM/yyyy HH.mm zz',
      timezoneLong: 'dd/MM/yyyy HH.mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      abbreviated: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      narrow: ['M', 'S', 'S', 'R', 'K', 'J', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH.mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM'],
    firstDayofWeek: 0 // Starts on Sun
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'Rp',
  currencyFormat: '¤###',
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
