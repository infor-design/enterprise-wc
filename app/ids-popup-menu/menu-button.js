import IdsButton from '../../src/ids-button/ids-button';
import IdsPopupMenu from '../../src/ids-popup-menu/ids-popup-menu';
import IdsMenuHeader from '../../src/ids-menu/ids-menu-header';
import IdsMenuItem from '../../src/ids-menu/ids-menu-item';
import IdsMenuGroup from '../../src/ids-menu/ids-menu-group';
import IdsSeparator from '../../src/ids-menu/ids-separator';
import IdsPopup from '../../src/ids-popup/ids-popup';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl = document.querySelector('#menu-button + ids-popup-menu');

  // Log to the console on `selected`
  popupmenuEl.addEventListener('selected', (e) => {
    console.log(`Item "${e.detail.elem.text}" was selected`);
  });
});
