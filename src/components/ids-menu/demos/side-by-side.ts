// Supporting components
import '../ids-menu-header';
import '../ids-menu-item';
import '../ids-menu-group';
import '../../ids-separator/ids-separator';

// Initialize the 4.x
document.addEventListener('DOMContentLoaded', () => {
  $('body').initialize();
  $('#popupmenu-trigger').popupmenu();
});
