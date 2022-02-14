// import '../ids-button/ids-button.js';
// import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn = document.querySelector('#message-example-error-trigger');
  const message = document.querySelector('#message-example-error');

  // Link the Message to its trigger button
  message.target = triggerBtn;
  message.trigger = 'click';

  // Setup the response callback
  message.onButtonClick = (buttonEl) => {
    const response = buttonEl.cancel ? 'cancelled' : 'confirmed';
    console.info(`IdsMessage was ${response}`);
    message.hide();
  };

  // Disable the trigger button when showing the Modal.
  message.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // After the modal is done hiding, re-enable its trigger button.
  message.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
