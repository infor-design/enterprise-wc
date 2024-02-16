/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsPopupMenu from '../../src/components/ids-popup-menu/ids-popup-menu';
import '../../src/components/ids-popup/ids-popup';

// Pull in menu contents
import defaultDataset from '../../src/assets/data/menu-contents.json';
import arrayDataset from '../../src/assets/data/menu-array.json';
import shortcutDataset from '../../src/assets/data/menu-shortcuts.json';

describe('IdsPopupMenu Component', () => {
  let menu: any;

  beforeEach(() => {
    // Invoke/Append the main menu
    menu = new IdsPopupMenu();
    menu.id = 'test-menu';
    menu.data = defaultDataset;
    document.body.appendChild(menu);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    menu = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    // Three popupmenus (top level and 2 submenus)
    expect(document.querySelectorAll('ids-popup-menu').length).toEqual(3);
    expect(errors).not.toHaveBeenCalled();
  });

  test('reverts to markup-driven if handed an empty dataset', () => {
    menu.data = null;

    // both old data and markup should stay in-tact
    let menus = document.querySelectorAll('ids-popup-menu');

    expect(menu.data).toEqual([]);
    expect(menus.length).toEqual(3);

    // Removing one via markup should work fine
    menus[2].remove();
    menus = document.querySelectorAll('ids-popup-menu');

    // Data shouldn't change, but markup will
    expect(menu.data).toEqual([]);
    expect(menus.length).toEqual(2);
  });

  test('accepts an array as a `contents` property', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.id = 'test-menu';
    menu.data = arrayDataset;
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.groups.length).toEqual(1);
    expect(menu.items.length).toEqual(3);
  });

  test('renders with no errors when given an empty dataset', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.id = 'test-menu';
    menu.data = {};
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
  });

  test('won\'t render contents if the data object has no items in its `contents` array', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      contents: []
    };
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.groups.length).toEqual(0);
  });

  test('propagates an `id` property on a data object as the Popupmenu\'s `id` attribute', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      id: 'test-menu',
      contents: []
    };
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.id).toBe('test-menu');
  });

  test('won\'t render contents if the contents property is not valid', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      contents: 'cake'
    };
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.groups.length).toEqual(0);
  });

  test('won\'t render a group if it has no `items` property', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      id: 'test-menu',
      contents: [
        {
          type: 'group',
          id: 'empty-group'
        }
      ]
    };
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.groups.length).toEqual(0);
  });

  test('won\'t render a group if its `items` property has no items present', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      id: 'test-menu',
      contents: [
        {
          type: 'group',
          id: 'empty-group',
          items: []
        }
      ]
    };
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.groups.length).toEqual(0);
  });

  test('won\'t render an item\'s submenu if the submenu has no `contents` property', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      id: 'test-menu',
      contents: [
        {
          type: 'group',
          id: 'empty-group',
          items: [
            {
              id: 'my-item',
              text: 'My Menu Item',
              submenu: {
                id: 'my-submenu'
              }
            }
          ]
        }
      ]
    };
    document.body.appendChild(menu);

    const item: any = document.querySelector('#my-item');

    expect(errors).not.toHaveBeenCalled();
    expect(item).toBeDefined();
    expect(item.hasSubmenu).toBeFalsy();
  });

  test('won\'t render an item\'s submenu if the submenu\'s `contents` property is invalid', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = {
      id: 'test-menu',
      contents: [
        {
          type: 'group',
          id: 'empty-group',
          items: [
            {
              id: 'my-item',
              text: 'My Menu Item',
              submenu: {
                id: 'my-submenu',
                contents: 'fish'
              }
            }
          ]
        }
      ]
    };
    document.body.appendChild(menu);

    const item: any = document.querySelector('#my-item');

    expect(errors).not.toHaveBeenCalled();
    expect(item).toBeDefined();
    expect(item.hasSubmenu).toBeFalsy();
  });

  test('propagates `shortcutKeys` property onto menu items if provided', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    menu = new IdsPopupMenu();
    menu.data = shortcutDataset;
    document.body.appendChild(menu);

    expect(errors).not.toHaveBeenCalled();
    expect(menu.items[0].shortcutKeys).toBe('⌘+R');
    expect(document.querySelector('ids-menu-item')?.getAttribute('shortcut-keys')).toBe('⌘+R');
  });
});
