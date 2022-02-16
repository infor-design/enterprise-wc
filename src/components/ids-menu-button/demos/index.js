// Supporting components
import IdsMenuButton from '../ids-menu-button';
import IdsMenu from '../../ids-menu/ids-menu';
import IdsPopup from '../../ids-popup/ids-popup';
import IdsMenuHeader from '../../ids-menu/ids-menu-header';
import IdsMenuItem from '../../ids-menu/ids-menu-item';
import IdsMenuGroup from '../../ids-menu/ids-menu-group';
import IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';

document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');

  // Log to the console on `toggle`
  menuBtnEl.menuEl.popup.addEventListener('show', () => {
    console.info(`Menu Button items were displayed`);
  });

  menuBtnEl.menuEl.popup.addEventListener('hide', () => {
    console.info(`Menu Button items were hidden`);
  });
});
