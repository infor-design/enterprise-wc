document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');
  popup.arrow = 'right';

  // Toggle the Popup
  triggerBtn.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});
