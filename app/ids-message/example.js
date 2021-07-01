import IdsButton from '../../src/ids-button/ids-button';

import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn = document.querySelector('#message-example-error-trigger');
  const message = document.querySelector('#message-example-error');
  const messageCloseBtn = document.querySelector('#my-message-cancel');

  // Link the Message to its trigger button
  message.target = triggerBtn;

  // Display the message once the page loads
  message.show();

  // Disable the trigger button when showing the Modal.
  message.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner button is clicked.
  messageCloseBtn.addEventListener('click', () => {
    message.hide();
  });

  // After the modal is done hiding, re-enable its trigger button.
  message.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
