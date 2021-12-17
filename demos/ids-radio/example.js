// Supporting components
import IdsButton from '../../src/components/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const radio = document.querySelector('#ids-radio-validation');

  const btnValidate = document.querySelector('#btn-radio-validate');
  const btnClear = document.querySelector('#btn-radio-clear');

  // Validate
  btnValidate?.addEventListener('click', () => {
    radio?.checkValidation();
  });

  // Clear
  btnClear?.addEventListener('click', () => {
    radio?.clear();
  });
});
