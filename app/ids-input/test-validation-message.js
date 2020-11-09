import IdsInput from '../../src/ids-input/ids-input';

// Supporting components
import IdsButton from '../../src/ids-button/ids-button';
import IdsIcon from '../../src/ids-icon/ids-icon';
import IdsText from '../../src/ids-text/ids-text';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  const inputValidationError = document.querySelector('#input-validation-error');
  const inputValidationAlert = document.querySelector('#input-validation-alert');
  const inputValidationSuccess = document.querySelector('#input-validation-success');
  const inputValidationInfo = document.querySelector('#input-validation-info');
  const inputValidationIconDefault = document.querySelector('#input-validation-icon-default');
  const inputValidationIconCustom = document.querySelector('#input-validation-icon-custom');

  // Error
  inputValidationError?.addMessage({
    message: 'Something is wrong do not continue',
    type: 'error',
    id: 'error'
  });

  // Alert
  inputValidationAlert?.addMessage({
    message: 'Warning the value may be incorrect',
    type: 'alert',
    id: 'alert'
  });

  // Success
  inputValidationSuccess?.addMessage({
    message: 'This value is correct',
    type: 'success',
    id: 'success'
  });

  // Info
  inputValidationInfo?.addMessage({
    message: 'Random information about this field',
    type: 'info',
    id: 'info'
  });

  // Icon default
  inputValidationIconDefault?.addMessage({
    message: 'Something about your user profile',
    type: 'icon',
    id: 'icon-default'
  });

  // Icon custom (mail)
  inputValidationIconCustom?.addMessage({
    message: 'Something about your mail information',
    type: 'icon',
    id: 'icon-custom',
    icon: 'mail'
  });
});
