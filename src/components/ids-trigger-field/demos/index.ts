import '../ids-trigger-field';

import statesJSON from '../../../assets/data/states.json';

const autocomplete: Element | any = document.querySelector('#trigger-field-7');

const url: any = statesJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  autocomplete.data = data;
};

setData();
