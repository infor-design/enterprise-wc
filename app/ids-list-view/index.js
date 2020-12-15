import IdsListView from '../../src/ids-list-view/ids-list-view';
import IdsCard from '../../src/ids-card/ids-card';

// Example for populating the List View
const listView = document.querySelector('#list-view-1');

// Do an ajax request and apply the data to the list
const xmlhttp = new XMLHttpRequest();
const url = 'http://localhost:4300/api/products';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200 && listView) {
    listView.data = JSON.parse(this.responseText);
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
