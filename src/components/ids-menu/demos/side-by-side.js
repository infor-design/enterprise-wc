// Supporting components
import IdsMenuHeader from '../ids-menu-header';
import IdsMenuItem from '../ids-menu-item';
import IdsMenuGroup from '../ids-menu-group';
import IdsSeparator from '../../ids-separator/ids-separator';

// Initialize the 4.x
document.addEventListener('DOMContentLoaded', () => {
  $('body').initialize();
  $('#popupmenu-trigger').popupmenu();
});
