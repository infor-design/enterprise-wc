// Supporting components
import '../ids-popup-menu';
import '../../ids-popup/ids-popup';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl: any = document.querySelector('ids-popup-menu');
  const popupEl = popupmenuEl?.popup;

  if (popupmenuEl) {
    // Preconfigure the Popup
    popupEl.align = 'top, left';

    // Log to the console on `selected`
    popupmenuEl.addEventListener('selected', (e: any) => {
      console.info(`Item "${e.detail.elem.text}" was selected (id "${e.detail.elem.id}")`);
    });
  }
});
