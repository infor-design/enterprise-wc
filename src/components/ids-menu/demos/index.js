import '../ids-menu/ids-menu-header.js';
import '../ids-menu/ids-menu.js';
import '../ids-menu/ids-menu-item.js';
import '../ids-menu/ids-menu-group.js';
import '../ids-separator/ids-separator.js';

document.addEventListener('DOMContentLoaded', () => {
  // Add a `beforeselected` veto to one of the menu items
  const nonSelectableItem = document.querySelector('#no-select');
  nonSelectableItem.addEventListener('beforeselected', (e) => {
    // eslint-disable-next-line
    console.info('%c You cannot select this item', 'color: #ff0000;', e.detail.elem);
    e.detail.response(false);
  });

  // Log to the console on `selected`
  const menu = document.querySelector('#complex-menu');
  menu.addEventListener('selected', (e) => {
    // eslint-disable-next-line
    console.info(`Item "${e.detail.elem.text}" was selected`);
  });
});
