import IdsMenuButton from '../../src/ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../../src/ids-popup-menu/ids-popup-menu';
import IdsMenuGroup from '../../src/ids-menu/ids-menu-group';
import IdsMenuHeader from '../../src/ids-menu/ids-menu-header';
import IdsMenuItem from '../../src/ids-menu/ids-menu-item';
import IdsSeparator from '../../src/ids-menu/ids-separator';
import IdsPopup from '../../src/ids-popup/ids-popup';

document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');

  // Log to the console on `toggle`
  menuBtnEl.addEventListener('show', (e) => {
    // eslint-disable-next-line
    console.log(`Item "${e.detail.elem.text}" was displayed`);
  });

  menuBtnEl.addEventListener('hide', (e) => {
    // eslint-disable-next-line
    console.log(`Item "${e.detail.elem.text}" was hidden`);
  });
});
