import '../ids-time-picker';
import type IdsTimePicker from '../ids-time-picker';

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector<IdsTimePicker>('ids-time-picker');
  picker?.open();
});
