import IdsButton from '../../src/ids-button/ids-button';
import IdsToggleButton from '../../src/ids-button/ids-toggle-button';

// Supporting components
import IdsIcon from '../../src/ids-icon/ids-icon';
import IdsLabel from '../../src/ids-label/ids-label';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.pressed = !e.target.pressed;
    });
  });
});
