// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'tl',
  englishName: 'Tagalog (Philippines)',
  nativeName: 'Tagalog (Philippines)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'dd/MM/yyyy', // use four digit year
      medium: 'dd MMM yyyy',
      long: 'dd MMMM yyyy',
      full: 'dd MMMM yyyy EEEE',
      month: 'dd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'dd EEE',
      timestamp: 'h:mm:ss a',
      timestampMillis: 'h:mm:ss:SSS a',
      hour: 'h:mm a',
      datetime: 'dd/MM/yyyy h:mm a',
      datetimeMillis: 'dd/MM/yyyy h:mm:ss:SSS a',
      timezone: 'dd/MM/yyyy h:mm a zz',
      timezoneLong: 'dd/MM/yyyy h:mm a zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'],
      abbreviated: ['Lin', 'Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab'],
      narrow: ['L', 'L', 'M', 'M', 'H', 'B', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'],
      abbreviated: ['Ene', 'Peb', 'Mar', 'Abr', 'May', 'Hun', 'Hul', 'Ago', 'Set', 'Okt', 'Nob', 'Dis']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'h:mm a',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM'],
    firstDayofWeek: 0 // Starts on Sunday
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '₱',
  currencyFormat: '### ¤',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '%###',
    percentSuffix: '',
    percentPrefix: '%',
    minusSign: '-',
    decimal: '.',
    group: ',',
    groupSizes: [3, 3]
  }
};

export { locale };
