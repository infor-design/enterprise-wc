document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');
  const popupmenu = document.querySelector('ids-popup-menu');
  const actionSheet = document.querySelector('ids-action-sheet');

  // Toggle the Popup/Actionsheet
  menuBtnEl.addEventListener('click', () => {
    if (actionSheet !== null) {
      actionSheet.visible = !actionSheet.visible;
    }
    if (popupmenu !== null) {
      popupmenu.visible = !popupmenu.visible;
    }
  });
});
