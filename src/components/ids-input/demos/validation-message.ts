// Supporting components
import '../ids-input';
import '../../ids-radio/ids-radio';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnAddMessages: any = document.querySelector('#btn-add-messages');
  const btnRemoveMessages: any = document.querySelector('#btn-remove-messages');

  const inputError: any = document.querySelector('#input-validation-error');
  const inputAlert: any = document.querySelector('#input-validation-alert');
  const inputSuccess: any = document.querySelector('#input-validation-success');
  const inputInfo: any = document.querySelector('#input-validation-info');
  const inputIconDefault: any = document.querySelector('#input-validation-icon-default');
  const inputIconCustom: any = document.querySelector('#input-validation-icon-custom');

  const btnAddMultipleMessages: any = document.querySelector('#btn-add-multiple-messages');
  const btnRemoveMultipleMessages: any = document.querySelector('#btn-remove-multiple-messages');
  const radioValidationAddType: any = document.querySelector('#radio-validation-add-type');
  const radioValidationRemoveBy: any = document.querySelector('#radio-validation-remove-by');

  const inputMultiple: any = document.querySelector('#input-validation-multiple');

  // Add single message
  const addSingleMessages = () => {
    // Error
    inputError?.addValidationMessage({
      message: 'Something is wrong do not continue',
      type: 'error',
      id: 'error'
    });

    // Alert
    inputAlert?.addValidationMessage({
      message: 'Warning the value may be incorrect',
      type: 'alert',
      id: 'alert'
    });

    // Success
    inputSuccess?.addValidationMessage({
      message: 'This value is correct',
      type: 'success',
      id: 'success'
    });

    // Info
    inputInfo?.addValidationMessage({
      message: 'Random information about this field',
      type: 'info',
      id: 'info'
    });

    // Icon default (user-profile)
    inputIconDefault?.addValidationMessage({
      message: 'Something about your user profile',
      type: 'icon',
      id: 'icon-default'
    });

    // Icon custom (mail)
    inputIconCustom?.addValidationMessage({
      message: 'Something about your mail information',
      type: 'icon',
      id: 'icon-custom',
      icon: 'mail'
    });
  };

  // Remove single message
  const removeSingleMessages = () => {
    // Error
    inputError?.removeValidationMessage({ id: 'error' });

    // Alert
    inputAlert?.removeValidationMessage({ id: 'alert' });

    // Success
    inputSuccess?.removeValidationMessage({ id: 'success' });

    // Info
    inputInfo?.removeValidationMessage({ id: 'info' });

    // Icon default
    inputIconDefault?.removeValidationMessage({ id: 'icon-default' });

    // Icon custom (mail)
    inputIconCustom?.removeValidationMessage({ id: 'icon-custom' });
  };

  // Initialize, add single messages on load
  addSingleMessages();

  // Add multiple messages (all)
  const addMultipleMessagesAll = () => {
    inputMultiple?.addValidationMessage([{
      message: 'Something is wrong do not continue',
      type: 'error',
      id: 'error-multi'
    }, {
      message: 'Warning the value may be incorrect',
      type: 'alert',
      id: 'alert-multi'
    }, {
      message: 'This value is correct',
      type: 'success',
      id: 'success-multi'
    }, {
      message: 'Random information about this field',
      type: 'info',
      id: 'info-multi'
    }, {
      message: 'Something about your user profile',
      type: 'icon',
      id: 'icon-default-multi'
    }, {
      message: 'Something about your mail information',
      type: 'icon',
      id: 'icon-custom-multi',
      icon: 'mail'
    }]);
  };

  // Add multiple messages
  const addMultipleMessages = () => {
    const addBy: string = radioValidationAddType.value;
    // Error
    if (addBy === 'error') {
      inputMultiple?.addValidationMessage({
        message: 'Something is wrong do not continue',
        type: 'error',
        id: 'error-multi'
      });
    }
    // Alert
    if (addBy === 'alert') {
      inputMultiple?.addValidationMessage({
        message: 'Warning the value may be incorrect',
        type: 'alert',
        id: 'alert-multi'
      });
    }
    // Success
    if (addBy === 'success') {
      inputMultiple?.addValidationMessage({
        message: 'This value is correct',
        type: 'success',
        id: 'success-multi'
      });
    }
    // Info
    if (addBy === 'info') {
      inputMultiple?.addValidationMessage({
        message: 'Random information about this field',
        type: 'info',
        id: 'info-multi'
      });
    }
    // Icon (default)
    if (addBy === 'icon') {
      inputMultiple?.addValidationMessage({
        message: 'Something about your user profile',
        type: 'icon',
        id: 'icon-default-multi'
      });
    }
    // Icon (custom)
    if (addBy === 'icon-custom') {
      inputMultiple?.addValidationMessage({
        message: 'Something about your mail information',
        type: 'icon',
        id: 'icon-custom-multi',
        icon: 'mail'
      });
    }
    if (addBy === 'all') addMultipleMessagesAll();
  };

  // Remove multiple messages by id (array of multiple objects)
  const removeMultipleMessagesById = () => {
    inputMultiple?.removeValidationMessage([
      { id: 'error-multi' },
      { id: 'alert-multi' },
      { id: 'info-multi' }
    ]);
  };

  // Remove multiple messages by type (single object)
  const removeMultipleMessagesByType = () => {
    inputMultiple?.removeValidationMessage({ type: 'icon' });
  };

  // Remove all validation messages
  const removeMultipleMessagesAll = () => {
    inputMultiple?.removeAllValidationMessages();
  };

  // Remove multiple messages
  const removeMultipleMessages = () => {
    const removeBy: string = radioValidationRemoveBy.value;
    if (removeBy === 'id') removeMultipleMessagesById();
    if (removeBy === 'type') removeMultipleMessagesByType();
    if (removeBy === 'all') removeMultipleMessagesAll();

    if (/error|alert|success|info|icon|icon-custom/g.test(removeBy)) {
      inputMultiple?.removeValidationMessage({ id: `${removeBy}-multi` });
    }
  };

  // Bind buttons
  btnAddMessages?.addEventListener('click', addSingleMessages);
  btnRemoveMessages?.addEventListener('click', removeSingleMessages);
  btnAddMultipleMessages?.addEventListener('click', addMultipleMessages);
  btnRemoveMultipleMessages?.addEventListener('click', removeMultipleMessages);
});
