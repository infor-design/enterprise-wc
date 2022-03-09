// Supporting components
import IdsActionSheet from '../ids-action-sheet';
import IdsBlockGrid from '../../ids-block-grid/ids-block-grid';
import IdsCard from '../../ids-card/ids-card';

document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');
  const actionSheet = document.querySelector('ids-action-sheet');
  const menuItems = document.querySelectorAll('ids-menu-item');

  // Toggle the Popup/Actionsheet
  menuBtnEl.addEventListener('click', () => {
    actionSheet.visible = !actionSheet.visible;
  });

  menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
      actionSheet.dismiss();
    });
  });
});
