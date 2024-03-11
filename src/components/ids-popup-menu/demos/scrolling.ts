// Supporting components
import '../ids-popup-menu';
import '../../ids-popup/ids-popup';
import '../../ids-input/ids-input';

import { validMaxHeight } from '../../../utils/ids-dom-utils/ids-dom-utils';

import type {
  IdsMenuItemData,
  IdsMenuObjectData,
  IdsMenuGroupData
} from '../../ids-menu/ids-menu-attributes';
import type IdsInput from '../../ids-input/ids-input';

document.addEventListener('DOMContentLoaded', async () => {
  const popupmenuEl: any = document.querySelector('#popupmenu');

  // Configure the menu
  const popupEl = popupmenuEl.popup;
  popupEl.setAttribute('align', 'left, top');

  // Load/set data
  const setData = async () => {
    const data: IdsMenuObjectData = {
      id: 'test-menu',
      contents: [
        {
          type: 'group',
          items: []
        }
      ]
    };

    // Data configuration options
    const menuItems = 100;
    const submenuOnEvery = 10;
    const submenuItems = 5;

    // Builds submenu item data
    const createSubmenuItem = (i: number, j: number) => {
      const submenuId = `${i}-${j}`;
      return {
        id: `test-submenu-item-${submenuId}`,
        type: 'item',
        text: `Test Submenu Item ${submenuId}`
      } as IdsMenuItemData;
    };

    // Builds menu item data
    const createMenuItem = (i: number) => {
      const ret: IdsMenuItemData = {
        id: `menu-item-${i}`,
        text: `Menu Item ${i}`,
        type: 'item'
      };

      // Every (x) menu item -> add a submenu (configurable)
      if ((i / submenuOnEvery) % 1 === 0) {
        ret.text = `Menu Item ${i} (with Submenu)`;
        ret.submenu = {
          id: `test-submenu-${i}`,
          contents: [
            {
              id: `test-submenu-group-${i}`,
              type: 'group',
              items: []
            }
          ]
        };

        // Add submenu items (configurable)
        for (let j = 0; j < submenuItems; j++) {
          (ret.submenu.contents![0] as IdsMenuGroupData).items.push(createSubmenuItem(i, j));
        }
      }

      return ret;
    };

    // Add menu items (configurable)
    for (let i = 0; i < menuItems; i++) {
      (data.contents![0] as IdsMenuGroupData)!.items.push(createMenuItem(i));
    }

    popupmenuEl.data = data;
  };

  await setData();

  // Handle change of maxHeight via IdsInput 'input' event
  const input = document.querySelector<IdsInput>('ids-input')!;
  input.addEventListener('input', (e: Event) => {
    const target = e.target as IdsInput;
    if (validMaxHeight(target.value)) {
      popupmenuEl.setAttribute('max-height', `${target.value}px`);
    } else {
      popupmenuEl.removeAttribute('max-height');
    }
  });
});
