import statesJSON from '../../../assets/data/states.json';
import '../../ids-popup-menu/ids-popup-menu';

const autocomplete: Element | any = document.querySelector('#trigger-field-7');
const url: any = statesJSON;

if (autocomplete) {
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    autocomplete.data = data;
  };

  await await setData();
}
