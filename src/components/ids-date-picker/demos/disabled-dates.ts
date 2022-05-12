import '../ids-date-picker';

const disabledDates: any = document.querySelector('#e2e-date-picker-disabled-dates');
const disabledYears: any = document.querySelector('#e2e-date-picker-disabled-years');
const disabledMinMax: any = document.querySelector('#e2e-date-picker-disabled-min-max');
const disabledReverse: any = document.querySelector('#e2e-date-picker-disabled-reverse');

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

if (disabledMinMax) {
  disabledMinMax.disable = {
    minDate: '6/3/2020',
    maxDate: '6/25/2020'
  };
}

if (disabledReverse) {
  disabledReverse.disable = {
    minDate: '6/3/2020',
    maxDate: '6/25/2020',
    isEnable: true
  };
}
