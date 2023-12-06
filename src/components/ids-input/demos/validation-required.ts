import '../ids-input';

import type IdsInput from '../ids-input';

document.addEventListener('DOMContentLoaded', () => {
  const inputCustomValidation = document.querySelector<IdsInput>('#input-validation-custom')!;

  inputCustomValidation.addValidationRule({
    check: (input: any) => input.value,
    message: 'Please complete this field',
    type: 'error',
    id: 'my-custom-required'
  });
});
