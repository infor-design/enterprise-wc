import '../ids-list-view';
import '../../ids-card/ids-card';
import productsJSON from '../../../assets/data/products-100.json';
import css from '../../../assets/css/ids-list-view/side-by-side.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}
// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url: any = productsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.forEach((l: any) => {
    l.data = data;
  });
};

await setData();
// Initialize the 4.x
$('body').initialize();
