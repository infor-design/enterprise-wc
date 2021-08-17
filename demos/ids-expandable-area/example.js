// Supporting components
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';
import IdsText from '../../src/ids-text/ids-text';
import IdsInput from '../../src/ids-input/ids-input';
import IdsToggleButton from '../../src/ids-toggle-button/ids-toggle-button';
import IdsIcon from '../../src/ids-icon/ids-icon';
import IdsHyperlink from '../../src/ids-hyperlink/ids-hyperlink';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});
