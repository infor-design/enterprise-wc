import '../../ids-card/ids-card';
import '../../ids-list-view/ids-list-view';

// Example for populating the List View
const listView: Element | null | any = document.querySelector('#list-view-1');

// Do an ajax request and apply the data to the list
const url = '/data/bikes.json';

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.data = data;
};

setData();
