import IdsModal from '../../src/ids-modal/ids-modal';
import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const modal = document.querySelector('ids-modal');
  const modalCloseBtn = modal.querySelector('ids-button');

  // Links the Modal to its trigger button
  modal.target = triggerBtn;

  // Disable the trigger button when showing the Modal.
  modal.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner button is clicked
  modalCloseBtn.addEventListener('click', () => {
    modal.hide();
  });

  // After the modal is done hiding, re-enable its trigger button.
  modal.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
