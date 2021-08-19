// Supporting components
import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/components/ids-layout-grid/ids-layout-grid-cell';
import IdsText from '../../src/components/ids-text/ids-text';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsToggleButton from '../../src/components/ids-toggle-button/ids-toggle-button';
import IdsIcon from '../../src/components/ids-icon/ids-icon';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});
