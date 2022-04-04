// Supporting components
import '../ids-list-builder';

import bikesJSON from '../../../assets/data/bikes.json';

// Example for populating the List Builder with Ajax
const listBuilder: any = document.querySelector('ids-list-builder');

// Do an ajax request and apply the data to the list
const setData = async () => {
  const res = await fetch((bikesJSON as any));
  const data = await res.json();

  listBuilder.data = data;
};

setData();
