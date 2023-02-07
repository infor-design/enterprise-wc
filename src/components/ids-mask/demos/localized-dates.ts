// Supporting components
import '../../ids-input/ids-input';
import '../../ids-dropdown/ids-dropdown';

document.addEventListener('DOMContentLoaded', () => {
  const pageContainer: any = document.querySelector('ids-container');
  let calendar = pageContainer.localeAPI.calendar();

  // Configure Short Date input
  const dateInputShort: any = document.querySelector('#mask-date-short');
  dateInputShort.mask = 'date';
  dateInputShort.placeholder = dateInputShort.maskOptions.format;

  // The default date format absorbed by the Mask Mixin from IdsLocale is "short".
  // For the timestamp field, we have to manually override the format set by the mixin.
  const dateInputTime: any = document.querySelector('#mask-date-time');
  dateInputTime.mask = 'date';
  dateInputTime.maskOptions = {
    format: calendar.dateFormat.timestamp
  };
  dateInputTime.placeholder = dateInputTime.maskOptions.format;

  const dateHourTime: any = document.querySelector('#mask-hour-time');
  dateHourTime.mask = 'date';
  dateHourTime.maskOptions = {
    format: calendar.dateFormat.hour
  };
  dateHourTime.placeholder = dateHourTime.maskOptions.format;

  // Change locale on the date input when the Page container's locale changes
  pageContainer.addEventListener('localechange', () => {
    calendar = pageContainer.localeAPI.calendar();
    const shortFormat = calendar.dateFormat.short;
    const timeFormat = calendar.dateFormat.timestamp;

    dateInputShort.value = '';
    dateInputShort.maskOptions.format = shortFormat;
    dateInputShort.placeholder = dateInputShort.maskOptions.format;

    dateInputTime.value = '';
    dateInputTime.maskOptions.format = timeFormat;
    dateInputTime.placeholder = dateInputTime.maskOptions.format;

    dateHourTime.value = '';
    dateHourTime.maskOptions.format = calendar.dateFormat.hour;
    dateHourTime.placeholder = dateHourTime.maskOptions.format;
  });
});
