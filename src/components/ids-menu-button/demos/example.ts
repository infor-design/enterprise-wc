document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl: any = document.querySelector('ids-menu-button');

  // Log to the console on `toggle`
  menuBtnEl.menuEl.addEventListener('show', () => {
    console.info(`Menu Button items were displayed`);
  });

  menuBtnEl.menuEl.addEventListener('hide', () => {
    console.info(`Menu Button items were hidden`);
  });

  const menuItemResponse = (e: any, msg: string) => {
    const target = e.detail.elem;
    if (target !== null) {
      const text = target.textContent.trim();
      console.info(`Menu Item "${text}" was ${msg}`, e.detail.elem);
    }
  };

  menuBtnEl.menuEl.addEventListener('selected', (e: any) => {
    menuItemResponse(e, 'selected');
  });

  menuBtnEl.menuEl.addEventListener('deselected', (e: any) => {
    menuItemResponse(e, 'deselected');
  });
});
