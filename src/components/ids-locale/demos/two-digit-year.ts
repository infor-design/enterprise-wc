import '../../ids-date-picker/ids-date-picker';
import IdsGlobal from '../../ids-global/ids-global';

// Asyncronously load a language and display the strings
(async function loadMessages() {
  const locale = IdsGlobal.getLocale();
  locale.twoDigitYearCutoff = 75;
  await locale.setLocale('en-US');

  document.querySelector('#datepicker-1')!.addEventListener('change', (e: Event) => {
    console.info('Change Event Fired', e);
  });

  document.querySelector('#datepicker-2')!.addEventListener('change', (e: Event) => {
    console.info('change event fired', e);
  });
}());
