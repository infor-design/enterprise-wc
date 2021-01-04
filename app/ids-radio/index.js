import IdsRadio from '../../src/ids-radio/ids-radio';

// Supporting components
import IdsButton from '../../src/ids-button/ids-button';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  const radio1 = document.querySelector('#ids-radio-validation-1');
  const radio2 = document.querySelector('#ids-radio-validation-2');

  const btnValidate1 = document.querySelector('#btn-radio-validate-1');
  const btnValidate2 = document.querySelector('#btn-radio-validate-2');
  const btnClear1 = document.querySelector('#btn-radio-clear-1');
  const btnClear2 = document.querySelector('#btn-radio-clear-2');

  // Validate
  btnValidate1?.addEventListener('click', () => {
    radio1?.checkValidation();
  });
  btnValidate2?.addEventListener('click', () => {
    radio2?.checkValidation();
  });

  // Clear
  btnClear1?.addEventListener('click', () => {
    radio1?.clear();
  });
  btnClear2?.addEventListener('click', () => {
    radio2?.clear();
  });
});
