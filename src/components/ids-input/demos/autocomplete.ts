import statesJSON from '../../../assets/data/states.json';

const autocomplete: Element | any = document.querySelector('ids-input');

const url: any = statesJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  autocomplete.data = data;
};

setData();
