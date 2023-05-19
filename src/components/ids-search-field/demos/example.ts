import statesJSON from '../../../assets/data/states.json';

const url: any = statesJSON;
const autocomplete: Element | any = document.querySelector('#search-field-autocomplete');

if (autocomplete) {
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    autocomplete.data = data;
  };

  setData();
}

const categories = ['Images', 'Documents', 'Audio', 'Video'];

const categorySelectors = [
  '#categories',
  '#categories-button',
  '#categories-short',
  'ids-search-field[multiple]',
];

document.querySelectorAll(categorySelectors.join(', '))
  .forEach((element: any) => {
    element.categories = categories;
  });

const logSearchDetails = ({ detail }: any) => console.log(detail);
document.querySelector('#categories-button')?.addEventListener('search', logSearchDetails);
document.querySelector('#categories-button-multiple')?.addEventListener('search', logSearchDetails);
