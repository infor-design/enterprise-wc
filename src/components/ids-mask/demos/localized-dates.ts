// Supporting components
import '../../ids-input/ids-input';
import '../../ids-dropdown/ids-dropdown';

document.addEventListener('DOMContentLoaded', () => {
  const pageContainer: any = document.querySelector('ids-container');
  const dropdown: any = document.querySelector('ids-dropdown');
  let calendar = pageContainer.locale.calendar();

  // Configure date inputs
  const dateInputShort: any = document.querySelector('#mask-date-short');
  dateInputShort.mask = 'date';
  dateInputShort.maskOptions = {
    format: calendar.dateFormat.short || 'M/d/yyyy'
  };
  dateInputShort.placeholder = calendar.dateFormat.short;
  const dateInputTime: any = document.querySelector('#mask-date-time');
  dateInputTime.mask = 'date';
  dateInputTime.maskOptions = {
    format: calendar.dateFormat.timestamp || 'M/d/yyyy'
  };
  dateInputTime.placeholder = calendar.dateFormat.timestamp;

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
    dateInputShort.placeholder = shortFormat;
    dateInputShort.maskOptions.format = shortFormat;

    dateInputTime.value = '';
    dateInputTime.placeholder = timeFormat;
    dateInputTime.maskOptions.format = timeFormat;
  });
});
