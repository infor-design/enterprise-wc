// Supporting components
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  const btnSetIndeterminate = document.querySelector('#btn-set-indeterminate');
  const btnRemoveIndeterminate = document.querySelector('#btn-remove-indeterminate');
  const cbIndeterminate = document.querySelector('#cb-indeterminate');

  // Set indeterminate
  btnSetIndeterminate?.addEventListener('click', () => {
    cbIndeterminate.indeterminate = true;
  });

  // Remove indeterminate
  btnRemoveIndeterminate?.addEventListener('click', () => {
    cbIndeterminate.indeterminate = false;
  });
});

document.addEventListener('click', (event) => {
  console.log(event);
});

document.addEventListener('change', (event) => {
  console.log(event);
});
