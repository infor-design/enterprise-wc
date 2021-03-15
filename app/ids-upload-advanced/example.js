// Supporting components
import IdsToggleButton from '../../src/ids-toggle-button/ids-toggle-button';
import IdsMenuButton from '../../src/ids-menu-button/ids-menu-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnDisable = document.querySelector('#btn-upload-advanced-disable');
  const btnMenu = document.querySelector('#btn-upload-advanced-menu');
  const elem = document.querySelector('#elem-upload-advanced');

  // Toggle disable/enable
  btnDisable?.addEventListener('click', (e) => {
    e.target.toggle();
    if (elem) {
      elem.disabled = !elem.disabled;
    }
  });

  /* eslint-disable */
  btnMenu?.menuEl.popup.addEventListener('selected', (e) => {
    const val = e.detail.value;
    if (elem && val) {
      let files = null;
      switch (val) {
        case 'all': files = elem.all; break;
        case 'in-process': files = elem.inProcess; break;
        case 'aborted': files = elem.aborted; break;
        case 'errored': files = elem.errored; break;
        case 'completed': files = elem.completed; break;
        default: console.log('Did not found! any matching');
      }
      console.log(val, files);
    }
  });

  // Files enter in drag area
  elem?.addEventListener('filesdragenter', (e) => {
    // console.log('Files enter in drag area', e);
  });

  // Files drop in to drag area
  elem?.addEventListener('filesdrop', (e) => {
    // console.log('Files drop in to drag area', e);
  });

  // File begin process
  elem?.addEventListener('beginprocess', (e) => {
    // console.log('File begin process', e);
  });

  // File abort
  elem?.addEventListener('abort', (e) => {
    // console.log('File abort', e);
  });

  // File error
  elem?.addEventListener('error', (e) => {
    // console.log('File error', e);
  });

  // File complete
  elem?.addEventListener('complete', (e) => {
    // console.log('File complete', e);
  });

  // Click close button
  elem?.addEventListener('closebuttonclick', (e) => {
    // console.log('Clicked on close button', e);
  });
});
