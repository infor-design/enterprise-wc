// Supporting components
import type IdsPopupMenu from '../ids-popup-menu';
import type IdsMenuGroup from '../../ids-menu/ids-menu-group';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import type IdsPopup from '../../ids-popup/ids-popup';
import type IdsCheckbox from '../../ids-checkbox/ids-checkbox';

import json from '../../../assets/data/menu-shortcuts.json';

document.addEventListener('DOMContentLoaded', async () => {
  const popupmenuEl: IdsPopupMenu = document.querySelector<IdsPopupMenu>('#popupmenu')!;

  // Configure the menu
  const popupEl: IdsPopup = popupmenuEl.popup!;
  popupEl.setAttribute('align', 'left, top');

  // Load/set data
  const url: any = json;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    popupmenuEl.data = data;
  };
  await setData();

  // Disable/Enable selection on the menu
  const singleSelectCheckEl = document.querySelector<IdsCheckbox>('#controls-selection')!;
  singleSelectCheckEl.addEventListener('change', (e: Event) => {
    const menuGroupEl = popupmenuEl.children[0] as IdsMenuGroup;
    menuGroupEl.select = (e.target as IdsCheckbox)?.checked ? 'single' : 'none';
  });

  // Add/remove icons to some menu items
  const iconsCheckEl = document.querySelector<IdsCheckbox>('#controls-icons')!;
  iconsCheckEl.addEventListener('change', (e: Event) => {
    const items = popupmenuEl.items;
    const checked = (e.target as IdsCheckbox)?.checked;

    if (!checked) {
      items.forEach((item: IdsMenuItem) => {
        if (item.iconEl) {
          item.removeAttribute('icon');
        }
      });
    } else {
      items[0].icon = 'folder';
      items[5].icon = 'edit';
      items[6].icon = 'delete';
      if (items[7]) items[7].icon = 'settings';
    }
  });

  // Add/remove a menu item that contains a submenu (further altering menu item alignment)
  const submenuCheckEl = document.querySelector<IdsCheckbox>('#controls-submenu')!;
  submenuCheckEl.addEventListener('change', (e: Event) => {
    const submenuItem = popupmenuEl.items[7] as IdsMenuItem;
    const menuGroupEl = popupmenuEl.children[0] as IdsMenuGroup;
    const checked = (e.target as IdsCheckbox)?.checked;

    if (!checked) submenuItem?.remove();
    else {
      const iconAttr = iconsCheckEl.checked ? ' icon="settings"' : '';
      menuGroupEl.insertAdjacentHTML(
        'beforeend',
        `<ids-menu-item id="contains-submenu"${iconAttr}>
          More Options...
          <ids-popup-menu>
            <ids-menu-header id="keep-open-header">Single-selectable Items that keep the menu open</ids-menu-header>
            <ids-menu-group id="single-sub-items" select="single" keep-open aria-labelledby="keep-open-header">
              <ids-menu-item value="sub-sub-single-1">Sub-Sub-Item One</ids-menu-item>
              <ids-menu-item value="sub-sub-single-2">Sub-Sub-Item Two</ids-menu-item>
              <ids-menu-item value="sub-sub-single-3">Sub-Sub-Item Three</ids-menu-item>
              <ids-menu-item value="sub-sub-single-4">Sub-Sub-Item Four</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
        </ids-menu-item>`
      );
    }
  });
});
