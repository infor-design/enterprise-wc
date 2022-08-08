// Supporting components
import '../ids-list-view';
import '../../ids-card/ids-card';
import productsJSON from '../../../assets/data/products-100.json';

// Example for populating the List View
const listView: any = document.querySelector('ids-list-view');
const pager: any = document.querySelector('ids-pager');

// Do an ajax request and apply the data to the list
const url: any = productsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.data = data;
  pager.total = data.length;
  pager.addEventListener('pagenumberchange', (e: CustomEvent) => {
    console.info(`pagenumberchange page # ${e.detail.value}`);
    listView.redraw();
  });
};

setData();
