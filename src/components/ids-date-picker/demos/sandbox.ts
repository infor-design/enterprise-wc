import '../ids-date-picker';

const datePickerAvailable: any = document.querySelector('#date-picker-available');

if (datePickerAvailable) {
  datePickerAvailable.disableSettings = {
    dates: ['2/15/2010', '2/25/2010'],
    dayOfWeek: [0, 6]
  };
}
