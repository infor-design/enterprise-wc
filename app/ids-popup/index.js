import IdsPopup from '../../src/ids-popup/ids-popup';

import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');

  triggerBtn.addEventListener('click', () => {
    popup.style.display = '';
    popup.alignTarget = triggerId;
    popup.align = 'bottom';
    popup.x = 0;
    popup.y = 15;
  });
});
