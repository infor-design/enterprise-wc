import IdsModal from '../../src/components/ids-modal';
import IdsModalButton from '../../src/components/ids-modal-button';

// Supporting Components
import IdsCheckbox from '../../src/components/ids-checkbox';
import IdsInput from '../../src/components/ids-input';
import IdsDropdown from '../../src/components/ids-dropdown';
import IdsTextarea from '../../src/components/ids-textarea';

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
