// Supporting components
import '../ids-list-builder';
import bikesJSON from '../../../assets/data/bikes.json';

// Example for populating the List Builder with Ajax
const listBuilder1: any = document.querySelector('#list-builder-1');
const listBuilder2: any = document.querySelector('#list-builder-2');

// Do an ajax request and apply the data to the list
const setData = async () => {
  const res = await fetch((bikesJSON as any));
  const data = await res.json();

  listBuilder1.data = data;
  listBuilder2.data = data;
};

setData();
