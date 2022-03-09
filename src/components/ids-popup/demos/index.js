// Supporting components
import IdsPopup from '../ids-popup';
import css from '../../../assets/css/ids-popup/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('#popup-1');
  if (!popup) {
    return;
  }
  popup.arrow = 'right';

  // Toggle the Popup
  triggerBtn?.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});
