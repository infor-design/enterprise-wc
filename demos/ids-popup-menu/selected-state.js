import IdsPopupMenu from '../../src/components/ids-popup-menu/ids-popup-menu';
import {
  IdsMenuHeader, IdsMenuItem, IdsMenuGroup, IdsSeparator
} from '../../src/components/ids-menu/ids-menu';
import IdsPopup from '../../src/components/ids-popup/ids-popup';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl = document.querySelector('ids-popup-menu');
  const popupEl = popupmenuEl.popup;

  // Preconfigure the Popup
  popupEl.align = 'top, left';

  // Log to the console on `selected`
  popupmenuEl.addEventListener('selected', (e) => {
    console.info(`Item "${e.detail.elem.text}" was selected`);
  });
});
