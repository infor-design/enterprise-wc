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
  // Opacity 2 Message
  const messageOpacity2El = document.querySelector('#message-opacity-2');
  const messageOpacity2TriggerBtn = document.querySelector('#message-opacity-2-trigger');
  setupMessage(messageOpacity2El, messageOpacity2TriggerBtn);

  // Opacity 4 Message
  const messageOpacity4El = document.querySelector('#message-opacity-4');
  const messageOpacity4TriggerBtn = document.querySelector('#message-opacity-4-trigger');
  setupMessage(messageOpacity4El, messageOpacity4TriggerBtn);

  // Opacity 6 Message
  const messageOpacity6El = document.querySelector('#message-opacity-6');
  const messageOpacity6TriggerBtn = document.querySelector('#message-opacity-6-trigger');
  setupMessage(messageOpacity6El, messageOpacity6TriggerBtn);

  // Opacity 8 Message
  const messageOpacity8El = document.querySelector('#message-opacity-8');
  const messageOpacity8TriggerBtn = document.querySelector('#message-opacity-8-trigger');
  setupMessage(messageOpacity8El, messageOpacity8TriggerBtn);

  // Opacity 10 Message
  const messageOpacity10El = document.querySelector('#message-opacity-10');
  const messageOpacity10TriggerBtn = document.querySelector('#message-opacity-10-trigger');
  setupMessage(messageOpacity10El, messageOpacity10TriggerBtn);
});
