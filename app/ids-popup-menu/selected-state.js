import IdsPopupMenu from '../../src/ids-popup-menu/ids-popup-menu';
import IdsMenuHeader from '../../src/ids-menu/ids-menu-header';
import IdsMenuItem from '../../src/ids-menu/ids-menu-item';
import IdsMenuGroup from '../../src/ids-menu/ids-menu-group';
import IdsSeparator from '../../src/ids-menu/ids-separator';
import IdsPopup from '../../src/ids-popup/ids-popup';
import IdsIcon from '../../src/ids-icon/ids-icon';

// Supporting Components
import IdsText from '../../src/ids-text/ids-text';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl = document.querySelector('ids-popup-menu');
  const popupEl = popupmenuEl.popup;

  // Preconfigure the Popup
  popupEl.align = 'top, left';

  // Replace the browser's context menu with ours
  window.oncontextmenu = (e) => {
    popupmenuEl.popup.x = e.pageX;
    popupmenuEl.popup.y = e.pageY;
    popupmenuEl.show();
    return false;
  };

  // Close the context menu if we click, but the click isn't inside the menu
  window.onclick = (e) => {
    const clickedInMenu = e.target.closest('ids-popup-menu');
    if (!clickedInMenu) {
      popupmenuEl.hide();
    }
  };

  // Add a console log for all the others on `selected`
  const menuItems = document.querySelector('#popupmenu').items;
  menuItems.forEach((item) => {
    item.addEventListener('selected', (e) => {
      console.log(`Item "${e.detail.elem.text}" was selected`);
    });
  });
});
