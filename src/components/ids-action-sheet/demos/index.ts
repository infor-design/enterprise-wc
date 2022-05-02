// Supporting components
import '../ids-action-sheet';
import '../../ids-block-grid/ids-block-grid';
import '../../ids-card/ids-card';

document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl: any = document.querySelector('ids-menu-button');
  const actionSheet: any = document.querySelector('ids-action-sheet');
  const menuItems: any = document.querySelectorAll('ids-menu-item');

  // Toggle the Popup/Actionsheet
  menuBtnEl.addEventListener('click', () => {
    actionSheet.visible = !actionSheet.visible;
  });

  menuItems.forEach((menuItem: any) => {
    menuItem.addEventListener('click', () => {
      actionSheet.dismiss();
    });
  });
});
