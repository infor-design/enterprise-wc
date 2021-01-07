import IdsPopupMenu from '../../src/ids-popup-menu/ids-popup-menu';
import IdsMenuHeader from '../../src/ids-menu/ids-menu-header';
import IdsMenuItem from '../../src/ids-menu/ids-menu-item';
import IdsMenuGroup from '../../src/ids-menu/ids-menu-group';
import IdsSeparator from '../../src/ids-menu/ids-separator';
import IdsPopup from '../../src/ids-popup/ids-popup';

import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl = document.querySelector('ids-popup-menu');
  const popupEl = popupmenuEl.popup;

  // Preconfigure the Popup
  popupEl.align = 'top, left';

  // Log to the console on `selected`
  popupmenuEl.addEventListener('selected', (e) => {
    // eslint-disable-next-line
    console.log(`Item "${e.detail.elem.text}" was selected`);
  });
});
