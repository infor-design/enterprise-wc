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
      message: 'An error occurred while processing your request. The username you entered is already in use. Each account must have a unique username to ensure proper identification and avoid conflicts. If you believe this is an error, please double-check the spelling or consider choosing a different username. Remember, your username is a key part of your identity on this platform, so it\'s important to select one that is both unique and memorable. Please try again with a different username.',
      type: 'error',
      id: 'error'
    });

    // Alert
    inputAlert?.addValidationMessage({
      message: 'Warning: You are about to delete a record that is linked to other important data within the system. Deleting this record may cause other data to become inaccessible or result in unexpected behavior. We strongly recommend reviewing the associated data and confirming that this action will not have unintended consequences. If you proceed, the deletion will be permanent, and the linked data may no longer function as expected. Please ensure that you have made a backup or have considered all implications before continuing.',
      type: 'alert',
      id: 'alert'
    });

    // Success
    inputSuccess?.addValidationMessage({
      message: 'Your changes have been successfully saved, but please note that some settings may take up to 24 hours to fully propagate across the system. During this time, you may experience temporary inconsistencies or delays in the affected areas. If you need to make additional changes, you can do so at any time, but please be aware that doing so may extend the propagation period. If everything looks good, there\'s no further action needed on your part. Thank you for your patience as the system updates.',
      type: 'success',
      id: 'success'
    });

    // Info
    inputInfo?.addValidationMessage({
      message: 'For your information: The system has detected that you have not logged in for the past 30 days. As part of our security policy, accounts with extended periods of inactivity are required to undergo an additional verification process upon the next login. This process ensures that your account remains secure and that you are the rightful owner. The verification will include confirming your email address and answering security questions. If you encounter any issues during this process, our support team is available to assist you. This additional step is in place to protect your account from unauthorized access',
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
    switch (radioValidationAddType.value) {
      // Error
      case 'error':
        inputMultiple?.addValidationMessage({
          message: 'Something is wrong do not continue',
          type: 'error',
          id: 'error-multi'
        });
        break;

      // Alert
      case 'alert':
        inputMultiple?.addValidationMessage({
          message: 'Warning the value may be incorrect',
          type: 'alert',
          id: 'alert-multi'
        });
        break;

      // Success
      case 'success':
        inputMultiple?.addValidationMessage({
          message: 'This value is correct',
          type: 'success',
          id: 'success-multi'
        });
        break;

      // Info
      case 'info':
        inputMultiple?.addValidationMessage({
          message: 'Random information about this field',
          type: 'info',
          id: 'info-multi'
        });
        break;

      // Icon (default)
      case 'icon':
        inputMultiple?.addValidationMessage({
          message: 'Something about your user profile',
          type: 'icon',
          id: 'icon-default-multi'
        });
        break;

      // Icon (custom)
      case 'icon-custom':
        inputMultiple?.addValidationMessage({
          message: 'Something about your mail information',
          type: 'icon',
          id: 'icon-custom-multi',
          icon: 'mail'
        });
        break;

      // All
      case 'all':
        addMultipleMessagesAll();
        break;
      default:
    }
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
