// Supporting components
import IdsDatePicker from '../ids-date-picker';

// Example to set start/end of the range via component settings
const rangePickerSettings = document.querySelector('#e2e-datepicker-settings-value');

// Example range selection forward
const rangePickerForward = document.querySelector('#e2e-datepicker-forward');

// Example range selection backward
const rangePickerBackward = document.querySelector('#e2e-datepicker-backward');

if (rangePickerSettings) {
  rangePickerSettings.rangeSettings = {
    start: '2/5/2018',
    end: '2/28/2018'
  };

  rangePickerSettings.addEventListener('dayselected', (e) => {
    console.info('Range Selected', e.detail.rangeStart, e.detail.rangeEnd);
  });
}

if (rangePickerForward) {
  rangePickerForward.rangeSettings = {
    selectForward: true
  };
}

if (rangePickerBackward) {
  rangePickerBackward.rangeSettings = {
    selectBackward: true
  };
}
