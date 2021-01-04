import IdsMenu from '../../src/ids-menu/ids-menu';
import IdsMenuHeader from '../../src/ids-menu/ids-menu-header';
import IdsMenuItem from '../../src/ids-menu/ids-menu-item';
import IdsMenuGroup from '../../src/ids-menu/ids-menu-group';
import IdsSeparator from '../../src/ids-menu/ids-separator';

document.addEventListener('DOMContentLoaded', () => {
  // Add a `beforeselected` veto to one of the menu items
  const nonSelectableItem = document.querySelector('#no-select');
  nonSelectableItem.addEventListener('beforeselected', (e) => {
    console.log('%c You cannot select this item', 'color: #ff0000;', e.detail.elem);
    e.detail.response(false);
  });

  // Log to the console on `selected`
  const menu = document.querySelector('#complex-menu');
  menu.addEventListener('selected', (e) => {
    console.log(`Item "${e.detail.elem.text}" was selected`);
  });
});
