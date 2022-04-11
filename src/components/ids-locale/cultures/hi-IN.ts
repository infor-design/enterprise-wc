// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'hi',
  englishName: 'Hindi (India)',
  nativeName: 'हिंदी (भारत)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '-', // Infered
      timeSeparator: ':',
      short: 'dd-MM-yyyy', // Uses corrected (non CLDR) format
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'EEEE, d MMMM yyyy',
      month: 'd MMMM',
      year: 'MMMM, yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'h:mm:ss a',
      timestampMillis: 'h:mm:ss.SSS a',
      hour: 'h:mm a',
      datetime: 'dd-MM-yyyy h:mm a',
      datetimeMillis: 'dd-MM-yyyy h:mm:ss.SSS a',
      timezone: 'dd-MM-yyyy h:mm a zz',
      timezoneLong: 'dd-MM-yyyy h:mm a zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
      abbreviated: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
      narrow: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
      abbreviated: ['ज', 'फ़', 'मा', 'अ', 'म', 'जू', 'जु', 'अ', 'सि', 'अ', 'न', 'दि']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'h:mm a',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['पूर्व', 'अपर'],
    firstDayofWeek: 0 // Starts on Sun
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '₹',
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
    groupSizes: [3, 2]
  }
};

export { locale };
