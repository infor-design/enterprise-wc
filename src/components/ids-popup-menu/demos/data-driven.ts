// Supporting components
import '../ids-popup-menu';
import '../../ids-popup/ids-popup';
import json from '../../../assets/data/menu-contents.json';

// Example for populating the Popup Menu
const popupmenuEl: any = document.querySelector('#popupmenu');
if (popupmenuEl) {
  const popupEl = popupmenuEl.popup;

  // Standard menu configuration
  document.addEventListener('DOMContentLoaded', () => {
    popupmenuEl.addEventListener('selected', (e: any) => {
      console.info(`Item "${e.detail.elem.text}" was selected`);
    });
  });

  const url: any = json;
  popupEl.align = 'top, left';

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    popupmenuEl.data = data;
  };

  setData();
}
