// Supporting components
import '../ids-popup';
import '../../ids-draggable/ids-draggable';
import css from '../../../assets/css/ids-popup/scrolling.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);

// Connect an IdsPopup to a trigger element
const connectButtonToPopup = (popupSelector: string, btnSelector: string) => {
  const popup: any = document.querySelector(popupSelector);
  const btn: any = document.querySelector(btnSelector);
  if (!popup) {
    throw new Error(`No popup found for selector ${popupSelector}`);
  }
  if (!btn) {
    throw new Error(`No trigger button found for selector ${btnSelector}`);
  }

  btn.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  connectButtonToPopup('#popup-test-1', '#popup-test-trigger-1');
  connectButtonToPopup('#popup-test-2', '#popup-test-trigger-2');
  connectButtonToPopup('#popup-test-3', '#popup-test-trigger-3');
});
