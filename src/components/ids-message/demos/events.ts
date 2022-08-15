document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn: any = document.querySelector('#message-example-event-trigger');
  const message: any = document.querySelector('#message-example-event');

  if (!message) {
    return;
  }

  // Link the Message to its trigger button
  message.target = triggerBtn;
  message.triggerType = 'click';

  // Setup the response callback
  message.onButtonClick = (buttonEl: any) => {
    const response = buttonEl.cancel ? 'cancelled' : 'confirmed';
    console.info(`IdsMessage was ${response}`);
    message.hide();
  };

  // Disable the trigger button when showing the Modal.
  message.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // When the modal is shown
  message.addEventListener('show', () => {
    console.info('Modal event "show" triggered');
    return true;
  });

  // After the modal is done hiding, re-enable its trigger button.
  message.addEventListener('hide', () => {
    console.info('Modal event "hide" triggered');
    triggerBtn.disabled = false;
  });
});
