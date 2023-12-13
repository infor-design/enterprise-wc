document.addEventListener('DOMContentLoaded', () => {
  const radio: any = document.querySelector('#ids-radio-validation');

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

  // Change Event
  document.querySelector('#test-radio')?.addEventListener('change', () => {
    console.info('Radio Changed');
  });
});
