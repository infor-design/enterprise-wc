// Supporting Components
import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const modal = document.querySelector('ids-modal');
  const modalCloseBtn = modal.querySelector('ids-button');

  // Open the Modal when the trigger is clicked
  triggerBtn.addEventListener('click', () => {
    modal.show();
    triggerBtn.disabled = true;
  });

  // Close the modal when its inner button is clicked
  modalCloseBtn.addEventListener('click', () => {
    modal.hide();
    triggerBtn.disabled = false;
  });
});
