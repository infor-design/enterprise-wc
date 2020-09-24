import IdsPopup from '../../src/ids-popup/ids-popup';

import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');

  // Preconfigure the Popup
  popup.shouldUpdate = false;
  popup.alignTarget = triggerId;
  popup.align = 'right';
  popup.x = 15;
  popup.y = 0;
  popup.shouldUpdate = true;
  popup.refresh();

  // Toggle the Popup
  triggerBtn.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});
