// Supporting components
import '../ids-progress-bar';
import '../../ids-toggle-button/ids-toggle-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnUpdateVal = document.querySelector('#test-button-secondary');
  const elem: any = document.querySelector('#elem-progress') || {};
  const orgValue = elem.value;

  // Update and reset value
  btnUpdateVal?.addEventListener('click', () => {
    const max = '100';
    elem.value = elem.value === max ? orgValue : max;
  });
});

// Initialize the 4.x
$('body').initialize();
$('#upd-progressbar').on('click', () => {
  $('#progress-bar1').data('progress').update('100');
});
