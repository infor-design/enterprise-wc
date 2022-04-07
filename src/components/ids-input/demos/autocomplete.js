import statesJSON from '../../../assets/data/states.json';

const autocomplete = document.querySelector('ids-input');

const setData = async () => {
  const res = await fetch(statesJSON);
  const data = await res.json();
  autocomplete.data = data;
};

setData();
