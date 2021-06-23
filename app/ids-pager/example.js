import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';
import IdsText from '../../src/ids-text/ids-text';
import IdsButton from '../../src/ids-button/ids-button';

const TemplateHTML = {
  INPUT_AND_BUTTONS: (
    `<ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>`
  ),
  NUMBER_LIST: (
    `<ids-pager-button previous></ids-pager-button>
      <ids-pager-number-list></ids-pager-number-list>
      <ids-pager-button next></ids-pager-button>`
  )
};

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

let mode = 'input-buttons';

const toggleTypeButton = document.querySelector('#ids-pager-type-toggle-button');
toggleTypeButton.addEventListener('click', () => {
  mode = (mode === 'input-buttons') ? 'number-list' : 'input-buttons';

  toggleTypeButton.querySelector('[slot="text"]').textContent = (mode === 'input-buttons')
    ? 'IdsPagerNumberList'
    : 'IdsPagerInput + IdsPagerButtons';

  pager.innerHTML = '';

  const template = document.createElement('template');
  template.innerHTML = TemplateHTML[mode === 'input-buttons' ? 'INPUT_AND_BUTTONS' : 'NUMBER_LIST'];
  const pagerContent = template.content.cloneNode(true);
  pager.appendChild(pagerContent);
});
