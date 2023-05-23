import '../../ids-toast/ids-toast';
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
  'ids-search-field[category]',
  'ids-search-field[multiple]',
  '#categories-short',
];

document.querySelectorAll(categorySelectors.join(', '))
  .forEach((element: any) => {
    element.categories = categories;
  });

const toastSearchDetails = (eventType: string, { detail }: any) => {
  console.info(detail);

  const idsContainer = document.querySelector('ids-container');

  // Show toast message
  const toastId = 'test-demo-toast';
  let toast: any = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    idsContainer?.appendChild(toast);
  }
  toast.show({
    title: `${eventType} event: ${detail.value || '--'}`,
    message: `Categories: ${detail.categoriesSelected.join(', ')}`,
  });
};

document.querySelectorAll('ids-search-field[action]')
  .forEach((element: any) => {
    element.addEventListener('search', (e: any) => toastSearchDetails('search', e));
    element.addEventListener('selected', (e: any) => toastSearchDetails('selected', e));
    element.addEventListener('deselected', (e: any) => toastSearchDetails('deselected', e));
  });
