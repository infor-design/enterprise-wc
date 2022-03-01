import productsJSON from '../../../assets/data/products.json';

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url = productsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.forEach((l) => {
    l.data = data;
  });
};

setData();
