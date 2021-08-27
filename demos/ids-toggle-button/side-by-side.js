/* global $ */
import IdsToggleButton from '../../src/components/ids-toggle-button';

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
