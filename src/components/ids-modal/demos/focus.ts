// Supporting Components
import '../../ids-checkbox/ids-checkbox';
import '../../ids-input/ids-input';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-modal-button/ids-modal-button';
import '../../ids-textarea/ids-textarea';

// import './focus.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn: HTMLButtonElement | null = document.querySelector(triggerId);
  const modal: any = document.querySelector('ids-modal');

  const checkboxCapture: HTMLInputElement | null = document.querySelector('#setting-capture');
  const checkboxCycle: HTMLInputElement | null = document.querySelector('#setting-cycle');
  const checkboxAutoFocus: HTMLInputElement | null = document.querySelector('#setting-auto-focus');

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;
  modal.triggerType = 'click';

  if (!triggerBtn || !checkboxCapture || !checkboxCycle) {
    return;
  }

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

  checkboxCapture.addEventListener('change', (e: any) => {
    modal.capturesFocus = e.target?.checked;
    checkboxCycle.disabled = !e.target?.checked;
  });

  checkboxCycle.addEventListener('change', (e: any) => {
    modal.cyclesFocus = e.target.checked;
  });

  checkboxAutoFocus?.addEventListener('change', (e: any) => {
    modal.autoFocus = e.target.checked;
  });
});
