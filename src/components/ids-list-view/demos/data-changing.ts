import '../ids-list-view';
import type IdsButton from '../../ids-button/ids-button';
import type IdsListView from '../ids-list-view';
import productsJSON from '../../../assets/data/products-100.json';

const listView = document.querySelector<IdsListView>('ids-list-view');
const randomizeDataBtn = document.querySelector<IdsButton>('ids-button');

if (listView) {
  const url: any = productsJSON;
  let data: any = [];

  const setInitialData = async () => {
    const res = await fetch(url);
    data = await res.json();
    listView.data = data;
  };
  setInitialData();

  randomizeDataBtn?.addEventListener('click', () => {
    const numProducts = Math.floor(Math.random() * data.length);
    listView.data = [...data].slice(numProducts);
  });

  // listView.addEventListener('itemactivated', setNewData);
  listView.addEventListener('itemactivated', (e: any) => {
    console.log('itemactivated', <CustomEvent>e.detail);
  });

  listView.addEventListener('selected', (e: any) => {
    console.log('selected', <CustomEvent>e.detail);
  });

  listView.addEventListener('deselected', (e: any) => {
    console.log('deselected', <CustomEvent>e.detail);
  });
}
