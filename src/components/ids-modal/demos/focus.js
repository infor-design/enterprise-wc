// Supporting Components
import '../ids-checkbox/ids-checkbox.js';
import '../ids-input/ids-input.js';
import '../ids-dropdown/ids-dropdown.js';
import '../ids-modal-button/ids-modal-button.js';
import '../ids-textarea/ids-textarea.js';

import './focus.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const modal = document.querySelector('ids-modal');

  const checkboxCapture = document.querySelector('#setting-capture');
  const checkboxCycle = document.querySelector('#setting-cycle');

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;
  modal.trigger = 'click';

  // Disable the trigger button when showing the Modal.
  modal.addEventListener('beforeshow', () => {
    checkboxCapture.checked = true;
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner button is clicked.
  modal.onButtonClick = () => {
    modal.hide();
  };

  // After the modal is done hiding, re-enable its trigger button.
  modal.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });

  checkboxCapture.addEventListener('change', (e) => {
    modal.capturesFocus = e.target.checked;
    checkboxCycle.disabled = !e.target.checked;
  });

  checkboxCycle.addEventListener('change', (e) => {
    modal.cyclesFocus = e.target.checked;
  });
});
