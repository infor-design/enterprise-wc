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

// Create an ajax request
const xmlhttp = new XMLHttpRequest();
const url = '/api/menu-contents';
xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    popupEl.align = 'top, left';
    popupmenuEl.data = JSON.parse(this.responseText);
  }
};

// Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
