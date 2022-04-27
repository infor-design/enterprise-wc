// Supporting components
import '../../ids-input/ids-input';
import '../../ids-dropdown/ids-dropdown';

document.addEventListener('DOMContentLoaded', () => {
  const pageContainer: any = document.querySelector('ids-container');
  const dropdown: any = document.querySelector('ids-dropdown');
  let calendar = pageContainer.locale.calendar();

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

  // Change the IdsContainer's locale setting when the dropdown is modified
  dropdown.addEventListener('change', async (e: any) => {
    await pageContainer.setLocale(e.target.value);
  });

  // Change locale on the date input when the Page container's locale changes
  pageContainer.addEventListener('localechange', () => {
    calendar = pageContainer.locale.calendar();
    const shortFormat = calendar.dateFormat.short;
    const timeFormat = calendar.dateFormat.timestamp;

    dateInputShort.value = '';
    dateInputShort.maskOptions.format = shortFormat;
    dateInputShort.placeholder = dateInputShort.maskOptions.format;

    dateInputTime.value = '';
    dateInputTime.maskOptions.format = timeFormat;
    dateInputTime.placeholder = dateInputTime.maskOptions.format;
  });
});
