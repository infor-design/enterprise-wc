import '../ids-date-picker-popup';
import '../ids-month-year-picklist';
import '../ids-date-picker';
import '../../ids-button/ids-button';
import '../../ids-modal-button/ids-modal-button';

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector<any>('ids-date-picker-popup');
  picker.popup.arrowTarget = '#btn-dropdown-arrow';

  const btn = document.querySelector<any>('ids-button');
  btn.onEvent('dayselected', btn, (e: CustomEvent) => {
    const target = e.target;
    if (target) console.info('"dayselected" event triggered', target);
  });
});
