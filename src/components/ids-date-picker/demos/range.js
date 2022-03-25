// Supporting components
import IdsDatePicker from '../ids-date-picker';

const rangePickerSettings = document.querySelector('#e2e-datepicker-settings-value');
const rangePickerForward = document.querySelector('#e2e-datepicker-forward');
const rangePickerBackward = document.querySelector('#e2e-datepicker-backward');
const rangePickerMax = document.querySelector('#e2e-datepicker-max');
const rangePickerMin = document.querySelector('#e2e-datepicker-min');

// Example to set start/end of the range via component settings
if (rangePickerSettings) {
  rangePickerSettings.rangeSettings = {
    start: '2/5/2018',
    end: '2/28/2018'
  };

  rangePickerSettings.addEventListener('dayselected', (e) => {
    console.info('Range Selected', e.detail.rangeStart, e.detail.rangeEnd);
  });
}

// Example range selection forward
if (rangePickerForward) {
  rangePickerForward.rangeSettings = {
    selectForward: true
  };
}

// Example range selection backward
if (rangePickerBackward) {
  rangePickerBackward.rangeSettings = {
    selectBackward: true
  };
}

// Example range max days
if (rangePickerMax) {
  rangePickerMax.rangeSettings = {
    maxDays: 2
  };
}

// Example range min days
if (rangePickerMin) {
  rangePickerMin.rangeSettings = {
    minDays: 5
  };
}
