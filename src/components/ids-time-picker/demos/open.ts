import '../ids-time-picker';

const timepickerOpen: any = document.querySelector('#e2e-timepicker-percy-axe');
const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
timepickerOpen?.dispatchEvent(event);
