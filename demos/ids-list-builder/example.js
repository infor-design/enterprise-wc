// Example for populating the List Builder with Ajax
const listBuilder = document.querySelector('ids-list-builder');

// Do an ajax request and apply the data to the list
const xmlhttp = new XMLHttpRequest();
const url = '/data/products.json';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200 && listBuilder) {
    listBuilder.data = JSON.parse(this.responseText);
  }
};

// Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
