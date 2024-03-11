import productsJSON from '../../../assets/data/products.json';
import css from '../../../assets/css/ids-list-view/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-virtual-scroll');

// Do an ajax request and apply the data to the list
const url: any = productsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.data = data;
};

await setData();
