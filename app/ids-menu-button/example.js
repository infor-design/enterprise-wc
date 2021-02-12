document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');

  // Log to the console on `toggle`
  menuBtnEl.menuEl.popup.addEventListener('show', () => {
    // eslint-disable-next-line
    console.log(`Menu Button items were displayed`);
  });

  menuBtnEl.menuEl.popup.addEventListener('hide', () => {
    // eslint-disable-next-line
    console.log(`Menu Button items were hidden`);
  });
});
