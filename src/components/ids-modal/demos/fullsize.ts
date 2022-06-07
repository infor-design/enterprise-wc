import { breakpoints } from '../../../core/ids-attributes';
import '../../ids-radio/ids-radio-group';
import '../../ids-radio/ids-radio';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn: any = document.querySelector(triggerId);
  const modal: any = document.querySelector('ids-modal');

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;
  modal.trigger = 'click';

  // Disable the trigger button when showing the Modal.
  modal.addEventListener('beforeshow', () => {
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

  // ===================================================================
  // Resize Observer for displaying current window width
  const sizeDisplayEl: any = document.querySelector('#current-window-width');
  const ro = new ResizeObserver(() => {
    sizeDisplayEl.innerHTML = `${window.innerWidth}px`;
  });
  ro.observe(document.querySelector('body') as any);

  // ===================================================================
  // Build the Radio Buttons that represent different fullsize settings
  const sizeRadioContainer: any = document.querySelector('#sizes');
  const fullsizeValues: Array<string | null> = [null, ...Object.keys(breakpoints).reverse(), 'always'];

  // Render IdsRadios representing actual breakpoint values
  let radioHTML = '';
  fullsizeValues.forEach((val) => {
    let radioText = val;
    let breakpointSize = '';
    let checked = '';

    if (val !== null && val !== 'always') {
      breakpointSize = breakpoints[val];
    }
    if (val === null) {
      radioText = 'Never';
      checked = ' checked';
    }
    if (val === 'always') {
      radioText = 'Always';
    }
    if (breakpointSize.length) {
      radioText += ` (${breakpointSize})`;
    }

    radioHTML += `<ids-radio value="${val}" label="${radioText}"${checked}></ids-radio>`;
  });
  sizeRadioContainer.insertAdjacentHTML('beforeend', radioHTML);

  // Change the fullsize setting on the Modal sample when radios are changed
  sizeRadioContainer.addEventListener('change', (e: Event) => {
    if (e.target) {
      modal.fullsize = (e.target as any).value;
    }
  });
});
