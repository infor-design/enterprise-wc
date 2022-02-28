// Supporting components
import IdsMenu from '../ids-menu';
import IdsMenuHeader from '../ids-menu-header';
import IdsMenuItem from '../ids-menu-item';
import IdsMenuGroup from '../ids-menu-group';
import IdsSeparator from '../../ids-separator/ids-separator';

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

// Initialize the 4.x
$('body').initialize();
$('#popupmenu-trigger').popupmenu({
  attributes: [
    {
      name: 'id',
      value: 'popupmenu-id'
    },
    {
      name: 'data-automation-id',
      value: 'popupmenu-automation-id'
    }
  ]
});
