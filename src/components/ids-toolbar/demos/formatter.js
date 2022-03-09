// Supporting components
import IdsToolbar from '../ids-toolbar';
import IdsButton from '../../ids-button/ids-button';
import IdsInput from '../../ids-input/ids-input';
import IdsMenuButton from '../../ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';

document.addEventListener('DOMContentLoaded', () => {
  const btnFontpicker = document.querySelector('#btn-fontpicker');
  btnFontpicker?.menuEl.popup.addEventListener('selected', (e) => {
    btnFontpicker.text = e.detail.elem.text;
  });
});
