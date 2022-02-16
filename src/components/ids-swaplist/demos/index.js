// Supporting components
import IdsSwapList from '../ids-swaplist';
import IdsDraggable from '../../ids-draggable/ids-draggable';

// Example for populating the List View
const listView1 = document.querySelector('#swaplist-1').container.querySelectorAll('ids-list-view');
const listView2 = document.querySelector('#swaplist-2').container.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url = '/data/periods.json';

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView1.forEach((l) => {
    l.data = data;
  });

  listView2.forEach((l) => {
    l.data = data;
  });
};

setData();
