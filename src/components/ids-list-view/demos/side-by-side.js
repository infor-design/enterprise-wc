import IdsListView from '../ids-list-view';
import IdsCard from '../../ids-card/ids-card';

import productsJSON from '../../../assets/data/products.json';
import css from '../../../assets/css/ids-list-view/side-by-side.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

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
// Initialize the 4.x
$('body').initialize();
