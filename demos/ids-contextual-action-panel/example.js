import '../../src/components/ids-contextual-action-panel';

// Supporting components
import '../../src/components/ids-checkbox';
import '../../src/components/ids-dropdown';
import '../../src/components/ids-popup-menu';
import '../../src/components/ids-textarea';
import '../../src/components/ids-toolbar';
import '../../src/components/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#cap-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const cap = document.querySelector('ids-contextual-action-panel');

  // Links the CAP to its trigger button (sets up click/focus events)
  cap.target = triggerBtn;
  cap.trigger = 'click';

  // Disable the trigger button when showing the CAP.
  cap.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner button is clicked.
  cap.onButtonClick = () => {
    cap.hide();
  };

  // After the modal is done hiding, re-enable its trigger button.
  cap.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
