// Supporting Components
import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const modal = document.querySelector('ids-modal');

  // Toggle the Modal
  triggerBtn.addEventListener('click', () => {
    modal.visible = !modal.visible;
  });
});
