import IdsListView from '../ids-list-view';
import IdsCard from '../../ids-card/ids-card';
// import './side-by-side.scss';

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url = '/data/products.json';

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
