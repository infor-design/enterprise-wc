import IdsPopup from '../../src/ids-popup/ids-popup';

// Supporting Components
import IdsButton from '../../src/ids-button/ids-button';

import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');

  // Toggle the Popup
  triggerBtn.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});
