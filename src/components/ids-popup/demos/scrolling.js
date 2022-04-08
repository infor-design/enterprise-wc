// Supporting components
import IdsPopup from '../ids-popup';
import css from '../../../assets/css/ids-popup/scrolling.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

// Connect an IdsPopup to a trigger element
const connectButtonToPopup = (popupSelector, btnSelector) => {
  const popup = document.querySelector(popupSelector);
  const btn = document.querySelector(btnSelector);
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
});

