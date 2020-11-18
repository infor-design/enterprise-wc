import IdsToggleButton from '../../src/ids-toggle-button/ids-toggle-button';

// Supporting components
import IdsIcon from '../../src/ids-icon/ids-icon';
import IdsText from '../../src/ids-text/ids-text';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});
