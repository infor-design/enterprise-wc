import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';
import IdsText from '../../src/ids-text/ids-text';
import IdsButton from '../../src/ids-button/ids-button';

// Add an event listener to test clickable links
const pager = document.querySelector('#ids-pager-example');
pager?.addEventListener('pagenumberchange', (e) => {
  console.info('pagenumberchange event fired ', e.detail.value);
});

const toggleDisableButton = document.querySelector('#ids-pager-toggle-disable-button');
toggleDisableButton.addEventListener('click', () => {
  pager.disabled = !pager.disabled;

  toggleDisableButton.querySelector('[slot="text"]').textContent = pager.disabled
    ? 'Enable'
    : 'Disabled';
});
