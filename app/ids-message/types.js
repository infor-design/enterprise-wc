import IdsMessage from '../../src/ids-message/ids-message';

// Supporting Components
import IdsButton from '../../src/ids-button/ids-button';
import IdsHyperlink from '../../src/ids-hyperlink/ids-hyperlink';

import './types.scss';

// Convenience function for setting up modal/trigger button connection
const setupMessage = (messageEl, triggerBtnEl, cancelBtnEl) => {
  // Link the Message to its trigger button
  messageEl.target = triggerBtnEl;

  // Disable the trigger button when showing the Modal.
  messageEl.addEventListener('beforeshow', () => {
    triggerBtnEl.disabled = true;
    return true;
  });

  // Close the modal when its cancel button is clicked.
  if (cancelBtnEl) {
    cancelBtnEl.addEventListener('click', () => {
      messageEl.hide();
    });
  }

  // After the modal is done hiding, re-enable its trigger button.
  messageEl.addEventListener('hide', () => {
    triggerBtnEl.disabled = false;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // Error Message
  const messageErrorEl = document.querySelector('#message-error');
  const messageErrorTriggerBtn = document.querySelector('#message-error-trigger');
  setupMessage(messageErrorEl, messageErrorTriggerBtn);

  // Alert Message
  const messageAlertEl = document.querySelector('#message-alert');
  const messageAlertTriggerBtn = document.querySelector('#message-alert-trigger');
  const messageAlertCancelBtn = document.querySelector('#message-alert-cancel');
  setupMessage(messageAlertEl, messageAlertTriggerBtn, messageAlertCancelBtn);

  // Success Message
  const messageSuccessEl = document.querySelector('#message-success');
  const messageSuccessTriggerBtn = document.querySelector('#message-success-trigger');
  const messageSuccessCancelBtn = document.querySelector('#message-success-cancel');
  setupMessage(messageSuccessEl, messageSuccessTriggerBtn, messageSuccessCancelBtn);

  // Info Message
  const messageInfoEl = document.querySelector('#message-info');
  const messageInfoTriggerBtn = document.querySelector('#message-info-trigger');
  const messageInfoCancelBtn = document.querySelector('#message-info-cancel');
  setupMessage(messageInfoEl, messageInfoTriggerBtn, messageInfoCancelBtn);

  // Default (Confirmation) Message
  const messageConfEl = document.querySelector('#message-confirmation');
  const messageConfTriggerBtn = document.querySelector('#message-confirmation-trigger');
  const messageConfCancelBtn = document.querySelector('#message-confirmation-cancel');
  setupMessage(messageConfEl, messageConfTriggerBtn, messageConfCancelBtn);
});
