import IdsInput from '../../src/ids-input/ids-input';

// Supporting components
import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const inputError = document.querySelector('#input-validation-error');
  const inputAlert = document.querySelector('#input-validation-alert');
  const inputSuccess = document.querySelector('#input-validation-success');
  const inputInfo = document.querySelector('#input-validation-info');
  const inputIconDefault = document.querySelector('#input-validation-icon-default');
  const inputIconCustom = document.querySelector('#input-validation-icon-custom');

  // Error
  inputError?.addMessage({
    message: 'Something is wrong do not continue',
    type: 'error',
    id: 'error'
  });

  // Alert
  inputAlert?.addMessage({
    message: 'Warning the value may be incorrect',
    type: 'alert',
    id: 'alert'
  });

  // Success
  inputSuccess?.addMessage({
    message: 'This value is correct',
    type: 'success',
    id: 'success'
  });

  // Info
  inputInfo?.addMessage({
    message: 'Random information about this field',
    type: 'info',
    id: 'info'
  });

  // Icon default
  inputIconDefault?.addMessage({
    message: 'Something about your user profile',
    type: 'icon',
    id: 'icon-default'
  });

  // Icon custom (mail)
  inputIconCustom?.addMessage({
    message: 'Something about your mail information',
    type: 'icon',
    id: 'icon-custom',
    icon: 'mail'
  });
});
