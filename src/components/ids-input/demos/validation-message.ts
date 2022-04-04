// Supporting components
import '../ids-input';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnAddMessage: any = document.querySelector('#btn-add-message');
  const btnRemoveMessage: any = document.querySelector('#btn-remove-message');

  const inputError: any = document.querySelector('#input-validation-error');
  const inputAlert: any = document.querySelector('#input-validation-alert');
  const inputSuccess: any = document.querySelector('#input-validation-success');
  const inputInfo: any = document.querySelector('#input-validation-info');
  const inputIconDefault: any = document.querySelector('#input-validation-icon-default');
  const inputIconCustom: any = document.querySelector('#input-validation-icon-custom');

  // Add input message
  const addInputMessage = () => {
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
  };

  // Remove input message
  const removeInputMessage = () => {
    // Error
    inputError?.removeMessage({ id: 'error' });

    // Alert
    inputAlert?.removeMessage({ id: 'alert' });

    // Success
    inputSuccess?.removeMessage({ id: 'success' });

    // Info
    inputInfo?.removeMessage({ id: 'info' });

    // Icon default
    inputIconDefault?.removeMessage({ id: 'icon-default' });

    // Icon custom (mail)
    inputIconCustom?.removeMessage({ id: 'icon-custom' });
  };

  // Init, add message on load
  addInputMessage();

  // Bind buttons
  btnAddMessage?.addEventListener('click', addInputMessage);
  btnRemoveMessage?.addEventListener('click', removeInputMessage);
});
