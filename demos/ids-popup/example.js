// Supporting Components
import IdsButton from '../../src/components/ids-button/ids-button';

import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');

  // Toggle the Popup
  triggerBtn.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});
