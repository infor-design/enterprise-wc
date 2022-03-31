// Supporting components
import '../ids-input';
import '../../ids-button/ids-button';

import IdsInput from '../ids-input';
import IdsButton from '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable: any = (document.querySelector('#btn-input-enable') as unknown as IdsButton);
  const btnDisable: any = (document.querySelector('#btn-input-disable') as unknown as IdsButton);
  const btnReadonly: any = (document.querySelector('#btn-input-readonly') as unknown as IdsButton);
  const input: any = (document.querySelector('#input-toggle-state') as unknown as IdsInput);

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

  const testInput: any = (document.querySelector('#test-input') as unknown as IdsInput);
  testInput?.addEventListener('change', (e: any) => {
    console.info('Test Input Change Event: ', e.target?.value);
  });
});
