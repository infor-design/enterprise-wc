// Supporting components
import '../../ids-popup-menu/ids-popup-menu';
import '../../ids-popup/ids-popup';

// Example for populating the Popup Menu
const popupmenuEl: any = document.querySelector('#popupmenu');
const popupEl = popupmenuEl.popup;
if (popupmenuEl) {
  // Standard menu configuration
  document.addEventListener('DOMContentLoaded', () => {
    popupmenuEl.addEventListener('selected', (e: any) => {
      console.info(`Item "${e.detail.elem.text}" was selected`);
    });
  });

  popupEl.align = 'top, left';
}
