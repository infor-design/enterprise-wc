import '../ids-dropdown';
import '../../ids-popup/ids-popup';
import css from '../../../assets/css/ids-popup/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup: any = document.querySelector('#popup-1');
  if (!popup) {
    return;
  }
  popup.arrow = 'right';

  // Toggle the Popup
  triggerBtn?.addEventListener('click', () => {
    if (!popup.visible) popup.visible = true; // closes automatically on click out
  });

  popup.addEventListener('hide', () => {
    console.info('Hide event fired');
  });
  popup.addEventListener('show', () => {
    console.info('Show event fired');
  });
});
