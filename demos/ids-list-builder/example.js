// Example for populating the List Builder with Ajax
const listBuilder = document.querySelector('ids-list-builder');

// Do an ajax request and apply the data to the list
const url = '/data/bikes.json';

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listBuilder.data = data;
};

setData();
