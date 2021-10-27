document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');
  const actionSheet = document.querySelector('ids-action-sheet');

  // Toggle the Popup/Actionsheet
  menuBtnEl.addEventListener('click', () => {
    actionSheet.visible = !actionSheet.visible;
  });
});
