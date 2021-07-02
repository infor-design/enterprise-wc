// Supporting Components
import IdsModalButton from '../../src/ids-modal/ids-modal-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const modal = document.querySelector('ids-modal');
  const modalCloseBtn = modal.querySelector('ids-modal-button');

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;

  // Disable the trigger button when showing the Modal.
  modal.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner button is clicked.
  modalCloseBtn.addEventListener('click', () => {
    modal.hide();
  });

  // After the modal is done hiding, re-enable its trigger button.
  modal.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
