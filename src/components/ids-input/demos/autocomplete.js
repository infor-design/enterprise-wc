import statesJSON from '../../../assets/data/states.json';

const input = document.querySelector('#input-autocomplete');

const setData = async () => {
  const res = await fetch(statesJSON);
  const data = await res.json();
  input.data = data;
};

setData();
