import IdsModal from '../../src/ids-modal';
import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const parentTriggerId = '#parent-modal-trigger-btn';
  const parentTriggerBtn = document.querySelector(parentTriggerId);
  const parentModal = document.querySelector('#parent-modal');
  const parentModalCloseBtn = parentModal.querySelector('ids-button');

  const nestedTriggerId = '#nested-modal-trigger-btn';
  const nestedTriggerBtn = document.querySelector(nestedTriggerId);
  const nestedModal = document.querySelector('#nested-modal');
  const nestedModalCloseBtn = nestedModal.querySelector('ids-button');

  // Links the Modals to their trigger buttons
  parentModal.target = parentTriggerBtn;
  nestedModal.target = nestedTriggerBtn;

  // Disable the trigger buttons when showing their Modals.
  parentModal.addEventListener('beforeshow', () => {
    parentTriggerBtn.disabled = true;
    return true;
  });
  nestedModal.addEventListener('beforeshow', () => {
    nestedTriggerBtn.disabled = true;
    return true;
  });

  // Close the modals when their "close" buttons are clicked
  parentModalCloseBtn.addEventListener('click', () => {
    parentModal.hide();
  });
  nestedModalCloseBtn.addEventListener('click', () => {
    nestedModal.hide();
  });

  // When the modals are fully hidden, re-enable their trigger buttons
  parentModal.addEventListener('hide', () => {
    parentTriggerBtn.disabled = false;
  });
  nestedModal.addEventListener('hide', () => {
    nestedTriggerBtn.disabled = false;
  });
});
