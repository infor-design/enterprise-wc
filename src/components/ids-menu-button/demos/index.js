// Supporting components
import '../ids-menu-button/ids-menu-button.js';
import '../ids-popup-menu/ids-popup-menu.js';
import '../ids-popup/ids-popup.js';
import '../ids-menu/ids-menu-header.js';
import '../ids-menu/ids-menu.js';
import '../ids-menu/ids-menu-item.js';
import '../ids-menu/ids-menu-group.js';

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
