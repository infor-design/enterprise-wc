import IdsPopupMenu from '../../src/components/ids-popup-menu/ids-popup-menu';

// Example for populating the Popup Menu
const popupmenuEl = document.querySelector('#popupmenu');
const popupEl = popupmenuEl.popup;

// Standard menu configuration
document.addEventListener('DOMContentLoaded', () => {
  popupmenuEl.addEventListener('selected', (e) => {
    console.info(`Item "${e.detail.elem.text}" was selected`);
  });
});

const url = '/data/menu-contents.json';
popupEl.align = 'top, left';

fetch(url)
  .then(
    (res) => {
      if (res.status !== 200) {
        return;
      }

      res.json().then((data) => {
        popupmenuEl.data = data;
      });
    }
  );
