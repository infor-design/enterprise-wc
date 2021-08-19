/* global $ */

import IdsToggleButton from '../../src/components/ids-toggle-button/ids-toggle-button';

// Supporting components
import IdsIcon from '../../src/components/ids-icon/ids-icon';
import IdsText from '../../src/components/ids-text/ids-text';
import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});

// Initialize the 4.x
$('body').initialize();
