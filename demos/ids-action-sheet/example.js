document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl = document.querySelector('ids-menu-button');
  const hiddenEls = document.querySelectorAll('ids-hidden');

  // Toggle the Popup/Actionsheet
  menuBtnEl.addEventListener('click', () => {
    [...hiddenEls].forEach((hiddenEl) => {
      if (!hiddenEl.hidden) {
        hiddenEl.children[0].visible = !hiddenEl.children[0].visible;
      }
    });
  });
});
