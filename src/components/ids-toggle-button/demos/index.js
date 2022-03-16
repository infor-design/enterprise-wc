// Supporting components
import IdsToggleButton from '../ids-toggle-button';
import IdsButton from '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});
