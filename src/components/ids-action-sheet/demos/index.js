// Supporting components
// import '../ids-container/ids-container.js';
// import '../ids-text/ids-text.js';
// import '../ids-card/ids-card.js';
// import '../ids-layout-grid/ids-layout-grid.js';
// import '../ids-popup-menu/ids-popup-menu.js';
// import '../ids-action-sheet/ids-action-sheet.js';

import IdsContainer from "../../ids-container/ids-container";
import IdsText from "../../ids-text/ids-text";
import IdsBlockGrid from "../../ids-block-grid/ids-block-grid";
import IdsCard from "../../ids-card/ids-card";
import IdsLayoutGrid from "../../ids-layout-grid/ids-layout-grid";
import IdsActionSheet from "../ids-action-sheet";

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
