// Supporting components
import '../ids-contextual-action-panel';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-popup-menu/ids-popup-menu';
import '../../ids-textarea/ids-textarea';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-button/ids-button';
import '../../ids-separator/ids-separator';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId: any = '#cap-trigger-btn';
  const triggerBtn: any = document.querySelector(triggerId);
  const cap: any = document.querySelector('ids-contextual-action-panel');

  // Links the CAP to its trigger button (sets up click/focus events)
  cap.target = triggerBtn;
  cap.trigger = 'click';

  // Disable the trigger button when showing the CAP.
  cap.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner buttons are clicked
  // (this can be in the standard button area, OR inside a Toolbar)
  cap.onButtonClick = () => {
    cap.hide();
  };

  // After the modal is done hiding, re-enable its trigger button.
  cap.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
