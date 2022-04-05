// Supporting components
import IdsInput from '../ids-input';
import IdsButton from '../../ids-button/ids-button';
import IdsPopup from '../../ids-popup/ids-popup';
import IdsListBox from '../../ids-list-box/ids-list-box';
import IdsListBoxOption from '../../ids-list-box/ids-list-box-option';
import IdsAutoComplete from '../ids-autocomplete';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable = document.querySelector('#btn-input-enable');
  const btnDisable = document.querySelector('#btn-input-disable');
  const btnReadonly = document.querySelector('#btn-input-readonly');
  const input = document.querySelector('#input-toggle-state') || {};

  // Enable
  btnEnable?.addEventListener('click', () => {
    input.disabled = false;
    input.readonly = false;
  });

  // Disable
  btnDisable?.addEventListener('click', () => {
    input.disabled = true;
  });

  // Readonly
  btnReadonly?.addEventListener('click', () => {
    input.readonly = true;
  });

  const testInput = document.querySelector('#test-input');
  testInput?.addEventListener('change', (e) => {
    console.info('Test Input Change Event: ', e.target.value);
  });
});
