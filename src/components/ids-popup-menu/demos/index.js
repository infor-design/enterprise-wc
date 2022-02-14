import '../ids-menu/ids-menu.js';
import '../ids-popup/ids-popup.js';

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
