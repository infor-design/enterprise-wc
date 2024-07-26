// Supporting components
import '../ids-list-view';
import productsJSON from '../../../assets/data/products-with-groups.json';
import css from '../../../assets/css/ids-list-view/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView1: any = document.querySelector('#demo-lv-one');

if (listView1) {
  // Do an ajax request and apply the data to the list
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView1.data = data;
  };

  listView1.addEventListener('selected', (e: any) => {
    console.info('selected event called', e.detail);
  });
  listView1.addEventListener('click', (e: any) => {
    console.info('clicked event called', e.detail);
  });
  listView1.addEventListener('deselected', (e: any) => {
    console.info('deselected event called', e.detail);
  });

  await setData();
}

const listView2: any = document.querySelector('#demo-lv-two');
if (listView2) {
  listView2.addEventListener('selected', (e: any) => {
    console.info('selected event called', e.detail);
  });
  listView2.addEventListener('click', (e: any) => {
    console.info('clicked event called', e.detail);
  });
  listView2.addEventListener('deselected', (e: any) => {
    console.info('deselected event called', e.detail);
  });
}
