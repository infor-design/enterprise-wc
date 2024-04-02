// Supporting components
import '../ids-input';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable: any = document.querySelector('#btn-input-enable');
  const btnDisable: any = document.querySelector('#btn-input-disable');
  const btnReadonly: any = document.querySelector('#btn-input-readonly');
  const input: any = document.querySelector('#input-toggle-state');
  const dirtyTrackerInput: any = document.querySelector('#e2e-dirty-tracker-input');

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

  // Set up masks
  const phoneInput: any = document.querySelector('#phone-input');
  if (!phoneInput) return;
  phoneInput.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  const numberInput: any = document.querySelector('#number-input');
  numberInput.mask = 'number';
  numberInput.maskOptions = {
    allowDecimal: true,
    decimalLimit: 2,
    integerLimit: 3
  };

  // Dirty tracker events
  dirtyTrackerInput.addEventListener('dirty', (e: any) => {
    console.info('Test Input "dirty" Event', e.detail);
  });

  dirtyTrackerInput.addEventListener('pristine', (e: any) => {
    console.info('Test Input "pristine" Event', e.detail);
  });

  dirtyTrackerInput.addEventListener('afterresetdirty', (e: any) => {
    console.info('Test Input "afterresetdirty" Event', e.detail);
  });
});
