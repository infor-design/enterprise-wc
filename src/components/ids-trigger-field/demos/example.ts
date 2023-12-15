import statesJSON from '../../../assets/data/states.json';

import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';

const autocomplete: Element | any = document.querySelector('#trigger-field-7');
const url: any = statesJSON;

if (autocomplete) {
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    autocomplete.data = data;
  };

  await setData();
}

// Configures some PopupMenu properties
const popupMenu8 = document.querySelector<IdsPopupMenu>('#icon-menu')!;
popupMenu8.popup!.arrow = 'left';
popupMenu8.popup!.y = 8;
