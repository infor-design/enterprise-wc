// Supporting components
import '../ids-list-view';
import '../../ids-card/ids-card';
import '../../ids-draggable/ids-draggable';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the List View
const listView = document.querySelector('#card-example');

// Do an ajax request and apply the data to the list
const url: any = productsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  (listView as any).data = data;
};

setData();
