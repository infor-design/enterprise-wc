// Supporting components
import IdsSwapList from '../ids-swaplist';
import IdsDraggable from '../../ids-draggable/ids-draggable';
import periodsJSON from '../../../assets/data/periods.json';

// Example for populating the List View
const listView1 = document.querySelector('#swaplist-1').container.querySelectorAll('ids-list-view');
const listView2 = document.querySelector('#swaplist-2').container.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const setData = async () => {
  const res = await fetch(periodsJSON);
  const data = await res.json();
  listView1.forEach((l) => {
    l.data = data;
  });

  listView2.forEach((l) => {
    l.data = data;
  });
};

setData();
