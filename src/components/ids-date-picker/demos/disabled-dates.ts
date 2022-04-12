import '../ids-date-picker';

const disabledDates: any = document.querySelector('#e2e-date-picker-disabled-dates');
const disabledYears: any = document.querySelector('#e2e-date-picker-disabled-years');

if (disabledDates) {
  disabledDates.disable = {
    dates: ['6/9/2015', '6/12/2015'],
    dayOfWeek: [0, 6]
  };
}

if (disabledYears) {
  disabledYears.disable = {
    years: [2019, 2021]
  };
}
