import IdsTriggerField from '../ids-trigger-field';

import statesJSON from '../../../assets/data/states.json';

const autocomplete = document.querySelector('#trigger-field-7');

const setData = async () => {
  const res = await fetch(statesJSON);
  const data = await res.json();
  autocomplete.data = data;
};

setData();
