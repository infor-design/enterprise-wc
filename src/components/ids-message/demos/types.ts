// Supporting Components
import '../ids-message';
import '../../ids-modal/ids-modal';
import '../../ids-button/ids-button';
import '../../ids-hyperlink/ids-hyperlink';

// Convenience function for setting up modal/trigger button connection
const setupMessage = (messageEl: any, triggerBtnEl: any) => {
  // Link the Message to its trigger button
  messageEl.target = triggerBtnEl;
  messageEl.triggerType = 'click';

  // Disable the trigger button when showing the Modal.
  messageEl.addEventListener('beforeshow', () => {
    triggerBtnEl.disabled = true;
    return true;
  });

  // Setup the response callback
  messageEl.onButtonClick = (buttonEl: any) => {
    const response = buttonEl.cancel ? 'cancel' : buttonEl.text;
    console.info(`IdsMessage with title "${messageEl.title}" had its "${response}" button clicked`);
    messageEl.hide();
  };

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

  // Warning Message
  const messageWarningEl = document.querySelector('#message-warning');
  const messageWarningTriggerBtn = document.querySelector('#message-warning-trigger');
  setupMessage(messageWarningEl, messageWarningTriggerBtn);

  // Success Message
  const messageSuccessEl = document.querySelector('#message-success');
  const messageSuccessTriggerBtn = document.querySelector('#message-success-trigger');
  setupMessage(messageSuccessEl, messageSuccessTriggerBtn);

  // Info Message
  const messageInfoEl = document.querySelector('#message-info');
  const messageInfoTriggerBtn = document.querySelector('#message-info-trigger');
  setupMessage(messageInfoEl, messageInfoTriggerBtn);

  // Default (Confirmation) Message
  const messageConfEl = document.querySelector('#message-confirmation');
  const messageConfTriggerBtn = document.querySelector('#message-confirmation-trigger');
  setupMessage(messageConfEl, messageConfTriggerBtn);

  // Huge Text Message
  const messageHugeTextEl = document.querySelector('#message-huge-text');
  const messageHugeTextTriggerBtn = document.querySelector('#message-huge-text-trigger');
  setupMessage(messageHugeTextEl, messageHugeTextTriggerBtn);

  // No Buttons Message
  const messageNoButtonsEl = document.querySelector('#message-no-buttons');
  const messageNoButtonsBtn = document.querySelector('#message-no-buttons-trigger');
  setupMessage(messageNoButtonsEl, messageNoButtonsBtn);

  // Allowed Tags Message
  const messageAllowedTagsEl = document.querySelector('#message-allow-tags');
  const messageAllowedTagsBtn = document.querySelector('#message-allow-tags-trigger');
  setupMessage(messageAllowedTagsEl, messageAllowedTagsBtn);

  // Disallowed Tags Message
  const messageDisallowedTagsEl = document.querySelector('#message-disallow-tags');
  const messageDisallowedTagsBtn = document.querySelector('#message-disallow-tags-trigger');
  setupMessage(messageDisallowedTagsEl, messageDisallowedTagsBtn);
});
