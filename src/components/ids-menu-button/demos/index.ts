// Supporting components
import '../ids-menu-button';
import '../../ids-menu/ids-menu';
import '../../ids-popup/ids-popup';
import '../../ids-menu/ids-menu-header';
import '../../ids-menu/ids-menu-item';
import '../../ids-menu/ids-menu-group';
import '../../ids-popup-menu/ids-popup-menu';

document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl: any = document.querySelector('ids-menu-button');

  // Log to the console on `toggle`
  menuBtnEl.menuEl.popup.addEventListener('show', () => {
    console.info(`Menu Button items were displayed`);
  });

  menuBtnEl.menuEl.popup.addEventListener('hide', () => {
    console.info(`Menu Button items were hidden`);
  });
});
