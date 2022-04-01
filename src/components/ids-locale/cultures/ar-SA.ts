// Info Comes from http://www.unicode.org/Public/cldr/25/
const locale = {
  // layout/language
  language: 'ar',
  englishName: 'Arabic (Saudi Arabia)',
  nativeName: 'العربية (المملكة العربية السعودية)',
  // layout/orientation/@characters
  direction: 'right-to-left',
  calendars: [
    {
      name: 'islamic-umalqura',
      // Note the format here is sort of dd/MM/yyyy
      // but this file is ltr and we display this in rtl so its inverted
      dateFormat: {
        separator: '/', // Infered
        timeSeparator: ':',
        short: 'yyyy/MM/dd', // use four digit year
        medium: 'y MMM، dd',
        long: 'yyyy MMMM، dd',
        full: 'EEEE، yyyy MMMM، dd',
        month: 'dd MMMM',
        year: 'MMMM yyyy',
        dayOfWeek: 'EEE d',
        timestamp: 'h:mm:ss a',
        timestampMillis: 'h:mm:ss.SSS a',
        hour: 'h:mm a',
        datetime: 'yyyy/MM/dd h:mm a',
        datetimeMillis: 'yyyy/MM/dd h:mm:ss.SSS a',
        timezone: 'yyyy/MM/dd h:mm a zz',
        timezoneLong: 'yyyy/MM/dd h:mm a zzzz'
      }, // Infered short + short gregorian/dateTimeFormats
      days: {
        wide: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        abbreviated: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        narrow: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']
      },
      months: {
        wide: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
        abbreviated: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']
      },
      timeFormat: 'h:mm a',
      dayPeriods: ['ص', 'م'],
      firstDayofWeek: 0
    },
    {
      name: 'gregorian',
      // Note the format here is sort of dd/MM/yyyy
      // but this file is ltr and we display this in rtl so its inverted
      // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {
        separator: '/', // Infered
        timeSeparator: ':',
        short: 'd/MM/yyyy', // use four digit year
        medium: 'dd/MM/yyyy',
        long: 'd MMMM، yyyy',
        full: 'EEEE، d MMMM، yyyy',
        month: 'dd MMMM',
        year: 'MMMM yyyy',
        dayOfWeek: 'EEE d',
        timestamp: 'h:mm:ss a',
        datetime: 'd/MM/yyyy h:mm a'
      }, // Infered short + short gregorian/dateTimeFormats
      // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
        wide: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        abbreviated: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        narrow: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']
      },
      // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        abbreviated: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      },
      // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ص', 'م'],
      firstDayofWeek: 0 // Starts on Sun
    }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '﷼',
  currencyFormat: '¤ ###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '٪',
    percentFormat: '### ٪',
    percentSuffix: ' ٪',
    percentPrefix: '',
    minusSign: '-',
    decimal: '٫',
    group: '٬',
    groupSizes: [3, 3]
  }
};

export { locale };
