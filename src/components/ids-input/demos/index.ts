// Supporting components
import '../ids-input';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable: any = document.querySelector('#btn-input-enable');
  const btnDisable: any = document.querySelector('#btn-input-disable');
  const btnReadonly: any = document.querySelector('#btn-input-readonly');
  const input: any = document.querySelector('#input-toggle-state');

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

  const testInput: any = document.querySelector('#test-input');
  testInput?.addEventListener('change', (e: any) => {
    console.info('Test Input Change Event: ', e.target?.value);
  });
});
