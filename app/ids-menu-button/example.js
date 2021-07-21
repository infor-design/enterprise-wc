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
