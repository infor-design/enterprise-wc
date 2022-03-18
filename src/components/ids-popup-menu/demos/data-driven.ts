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

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  popupmenuEl.data = data;
};

setData();
