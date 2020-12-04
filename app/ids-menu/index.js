import IdsMenu from '../../src/ids-menu/ids-menu';
import IdsMenuHeader from '../../src/ids-menu/ids-menu-header';
import IdsMenuItem from '../../src/ids-menu/ids-menu-item';
import IdsSeparator from '../../src/ids-menu/ids-separator';
import IdsIcon from '../../src/ids-icon/ids-icon';

// Supporting Components
import IdsText from '../../src/ids-text/ids-text';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');

  // Add a `beforeselected` veto to one of the menu items
  const nonSelectableItem = document.querySelector('#no-select');
  nonSelectableItem.addEventListener('beforeselected', (e) => {
    console.log('%c You cannot select this item', 'color: #ff0000;');
    console.log(e.detail.elem);
    e.detail.response(false);
  });

  // Add a console log for all the others on `selected`
  const menuItems = document.querySelector('#complex-menu').items;
  menuItems.forEach((item) => {
    item.addEventListener('selected', (e) => {
      console.log(`Item "${e.detail.elem.textContent}" was selected`);
    });
  });
});
