// Supporting components
import '../ids-checkbox';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnSetIndeterminate = document.querySelector('#btn-set-indeterminate');
  const btnRemoveIndeterminate = document.querySelector('#btn-remove-indeterminate');
  const cbIndeterminate: any = document.querySelector('#cb-indeterminate');

  // Set indeterminate
  btnSetIndeterminate?.addEventListener('click', () => {
    cbIndeterminate.indeterminate = true;
  });

  // Remove indeterminate
  btnRemoveIndeterminate?.addEventListener('click', () => {
    cbIndeterminate.indeterminate = false;
  });
});
